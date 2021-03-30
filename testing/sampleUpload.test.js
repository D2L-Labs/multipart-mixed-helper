const sampleTestUpload = require('./sampleUpload');

const fileList = ['sample_sheets.xlsx', 'a_drawing.pdf', 'Material_single.docx', 'Material_multiple.pptx'];

describe("File Upload To BrightSpace", () => {
  test.each(fileList)(
    "Uploading %p to Brightspace, expects status code '200'",
    async (file) => {
      const result = await sampleTestUpload(file);
      expect(result).toEqual(200);
    }
  );
});