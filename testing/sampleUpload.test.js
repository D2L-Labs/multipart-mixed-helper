const sampleTestUpload = require('./SampleUpload');

const fileList = ['test_excel.xlsx', 'test_pdf.pdf', 'test_document.docx', 'test_powerpoint.pptx'];

describe("File Upload To BrightSpace", () => {
  test.each(fileList)(
    "Uploading %p to Brightspace, expects status code '200'",
    async (file) => {
      const result = await sampleTestUpload(file);
      expect(result).toEqual(200);
    }
  );
});