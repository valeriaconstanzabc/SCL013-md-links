const tryTest = require('../functions');

test('tryTest', () => {
  return readFile().then(tryTest => {
    expect(tryTest).toBe('function');
  });
});


// no funciona
/* test('es una función', async () => {
 // expect.assertions(1);
  const data = await tryTest();
  expexct(data).toEqual('function');
}) */


// funciona
/* describe ('tryTest', () => {
  test('es una función', () => {
    expect(typeof tryTest).toEqual('object');
  })
}) */



