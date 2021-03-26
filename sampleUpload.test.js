const authenticateAdmin = require('./sampleUpload');

test('adds 1 + 2 to equal 3', async () => {
  const data = await authenticateAdmin()
  expect(data).toBe(200);
});