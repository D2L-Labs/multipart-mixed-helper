const sendMultipartMixedRequest = require('./ServiceHelper.js');
const mimeTypes = require('./MimeTypes');

const uploadToContent = async (hostUrl, orgUnitId,  moduleId, fileName, fileContent, fileExtension, authToken) => {
    const createSubPostRoute = `/d2l/api/le/1.50/${orgUnitId}/content/modules/${moduleId}/structure/?base64=1`;
    const fileType = {
        ending: fileExtension,
        mimeType: mimeTypes[fileExtension],
      };

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
        hostUrl + createSubPostRoute,
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