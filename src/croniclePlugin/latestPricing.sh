#!/bin/bash
set -e

DB_NAME="mtg"
TSV_FILE="tcg_prices.tsv"
JSON_FILE="todays_prices.json"

echo "📥 Downloading AllPricesToday.json..."
curl -L --retry 3 https://mtgjson.com/api/v5/AllPricesToday.json -o "$JSON_FILE"
echo "✅ Downloaded $(du -h "$JSON_FILE" | cut -f1)"

echo "🔍 Validating JSON..."
jq empty "$JSON_FILE" || { echo "❌ Invalid JSON. Aborting."; exit 1; }

echo "🧪 Extracting TCGPlayer prices..."
rm -f "$TSV_FILE"
jq -c '.data | to_entries[]' "$JSON_FILE" | while read -r entry; do
  uuid=$(echo "$entry" | jq -r '.key')
  tcg=$(echo "$entry" | jq -c '.value.paper.tcgplayer // {}' | tr '\n' ' ' | tr '\t' ' ')
  echo -e "$uuid\t$tcg" >> "$TSV_FILE"
done
echo "✅ Extracted $(wc -l < "$TSV_FILE") entries."

echo "📥 Loading TSV into temp table..."
psql -d "$DB_NAME" -c "\copy staging_prices FROM '$TSV_FILE' WITH (FORMAT text)"

echo "🧬 Adding tcg_prices column to cards (if missing)..."
psql -d "$DB_NAME" -c "
  DO \$\$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name='cards' AND column_name='tcg_prices'
    ) THEN
      ALTER TABLE cards ADD COLUMN tcg_prices JSONB;
    END IF;
  END
  \$\$;
"

echo "🔄 Updating cards with TCGPlayer prices..."
psql -d "$DB_NAME" -c "
  UPDATE cards
  SET tcg_prices = staging_prices.tcg_prices
  FROM staging_prices
  WHERE cards.uuid = staging_prices.uuid::text;
"

echo "🧼 Cleaning up..."
rm -f "$TSV_FILE"

echo "✅ Enrichment complete. Cards now include TCGPlayer pricing across treatments."