type ReGenerator = Generator<{ value: number }>;

function* doTheThing(): ReGenerator {
  yield { value: 100 };

  yield { value: 104 };

  yield { value: 103 };

  yield { value: 102 };
}

const gen = doTheThing();

let val = gen.next();

console.log(val);

while (!val.done) {
  console.log(val.value.value);
  val = gen.next();
}
