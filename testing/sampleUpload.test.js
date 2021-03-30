const testUpload = require('./sampleUpload');

// const fileList = [ 'a_drawing.pdf.txt']

const fileList = ['google_sheets.xlsx', 'a_drawing.pdf', 'Material_single.docx', 'Material_multiple.pptx'];

describe("File Upload To BrightSpace", () => {
  test.each(fileList)(
    "Uploading %p to Brightspace, expects status code '200'",
    async (file) => {
      const result = await testUpload(file);
      expect(result).toEqual(200);
    }
  );
});