const sendMultipartMixedRequest = require('./ServiceHelper.js')

const uploadToContent = async (fullRequestUrl, fileName, fileContent, fileType, authToken) => {
    try {  
      const requestData = {
        Title: fileName,
        ShortTitle: fileName,
        Type: 1,
        TopicType: 1,
        Url: `${fileName}.${fileType.ending}`,
        StartDate: null,
        EndDate: null,
        DueDate: null,
        IsHidden: false,
        IsLocked: false,
        OpenAsExternalResource: false,
        Description: null,
      };
    
      const file = {
        contentType: fileType.mimeType,
        filename: `${fileName}.${fileType.ending}`,
        fileData: fileContent,
      };
    
      const res = await sendMultipartMixedRequest(
        fullRequestUrl,
        requestData,
        file,
        authToken
      );
      return res;
    } catch(err) {
      console.log(err)
    }
  };

  module.exports = uploadToContent;