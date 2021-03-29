const testUpload = require('./sampleUpload');

const fileList = ['google_sheets.csv.txt', 'a_drawing.pdf.txt', 'Hey_There.docx.txt', 'Material_multiple.pptx.txt']

describe("File Upload To BrightSpace", () => {
  test.each(fileList)(
    "Uploading %p to Brightspace, expects status code '200'",
    async (file) => {
      console.log(file)
      const result = await testUpload(file);
      expect(result).toEqual(200);
    }
  );
});