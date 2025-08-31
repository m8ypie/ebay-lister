#!/bin/bash
set -e

echo "Downloading AllPrintings.json..."
curl -L https://mtgjson.com/api/v5/AllPrintings.psql.gz -o AllPrintings.psql.gz
echo "unzipping..."
gunzip -f AllPrintings.psql.gz
echo "Ingesting AllPrintings.psql into PostgreSQL..."
psql -d mtg -f AllPrintings.psql
echo "✅ Ingestion complete."