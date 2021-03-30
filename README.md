# multipart-mixed-helper
## Context
The multipart-mixed-helper is a great tool for uploading files to Brightspace in the browser or server, providing developers an easy way to send and await multipart-mixed upload requests.

## Installation
To include this repo in your project you can install with NPM with the following command: ``npm i --save https://github.com/D2L-Labs/multipart-mixed-helper.git``

The following line should be present in your package.json ``"multipart-mixed-helper": "git+https://github.com/D2L-Labs/multipart-mixed-helper.git",``

## Usage

For Uploading to Brightspace Content, you can use the uploadToContent function: ``import uploadToContent from "multipart-mixed-helper/UploadToContent.js";``. This function wraps the ``sendMultipartMixedRequest()`` call and provides a template for uploading to a Brightspace Content Module. 

The ``uploadToContent`` function takes in the following parameters ``uploadToContent(hostUrl, orgUnitId,  moduleId, fileName, fileContent, fileExtension, authToken)``:
 -  ``hostUrl`` is the primary Brightspace domain you will be sending to (ex: ``https://d2llabs.desire2learn.com``).
 -  ``orgUnitId`` is the orgUnitId containing the module you want to upload to.
 -  ``moduleId`` is the moduleId of the module you want to upload the file into.
 -  ``fileName`` is the name of the file as it will appear on Brightspace.
 -  ``fileContent`` is the base64 representation of your file's binary data (examples below on how to obtain in Browser/Node).
 -  ``fileExtension`` is the file extension (.pdf, .docx, .xslx, etc).
 -  ``authToken`` the D2L Oauth2 token required to authorize file uploads in that scope.

If you would like to craft the request yourself you can import ``sendMultipartMixedRequest`` itself: ``import sendMultipartMixedRequest from "multipart-mixed-helper/ServiceHelper.js";`` 

The ``sendMultipartMixedRequest`` takes in the following parameters ``sendMultipartMixedRequest(url, requestData, file, token)``:
 -  ``url`` being the endpoint you want to send the request to.
 -  ``requestData`` is your json payload you want to send, like a POST request body.
 -  ``file`` is an object containing the following:

```
const file = {
    contentType: fileType.mimeType,
    filename: `${fileName}.${fileType.ending}`,
    fileData: fileContent,
  };
```
 -  ``file.contentType`` is the mime-type of the file (example for PDFs: ``application/pdf``).
 -  ``fileName`` is the name of the file without the extension (.pdf, .word).
 -  ``fileData`` is the base64 representation of the binary file data which can be obtained by using a ``blobToData`` conversion as shown below.


 - Lastly, ``token`` is your Bearer auth token for Brightspace OAuth2 requests. If your application does not use Bearer Tokens, or would like to use a different OAuth method, you can simply change what is set as the requestHeader on line 41: ``request.setRequestHeader("Authorization", "Bearer " + token);`` of ``ServiceHelper.js`` located in this repo. 

## Converting Files to Base64
When dealing with files/binary data in the browser, a common data type is the Blob. When converting a blob to base64, a simple function like this can be used. We provide this in the repo by importing: ``import blobToBase64 from "multipart-mixed-helper/blobToBase64.js";``.
```
const blobToBase64 = (blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };
    
let data = await blobToData(res.data);
data = data.split(",").pop();
```
When dealing with files and the fileSystem in Node.js, base64 binary data can be read directly from the file as shown below. We also provide this in the repo by importing: ``import fileToBase64 from "multipart-mixed-helper/FileToBase64.js";``.
```
const fs = require('fs').promises;

const fileToBase64 = async (file) => {
  const rawData = await fs.readFile(file);
  return new Buffer(rawData).toString("base64");
};
```

## Example Usage
The following example code is directly taken from the test cases provided in the ``/testing`` folder. To test the code for yourself follow the steps below to set up your .env file and provide the neccessary environment variables. 4 sample files are already provided for you in the ``/testing/sample_files`` folder.
```
// const file = "google_sheets.xlsx";

const runTest = async (file) => {
  const authToken = (await authenticateAdmin()).token; 
  const fileParts = file.split('.');
  const fileData = await fileToBase64(`sample_files/${file}`);
  const fileName = fileParts[0];
  const fileExtension = fileParts[1];
  const res = await uploadToContent(HOST_URL, ORG_UNIT_ID, MODULE_ID, fileName, fileData, fileExtension, authToken);
  return res;
}
```

## Testing 

### Setting up environment variables
- Navigate to the testing folder using a TextEditor (ex: Visual Studio Code).
- Create a new file titled : ``.env``
- Inside the ``.env`` file copy and paste the following fields:

```
USR_NAME=
USR_PWD=
HOST_URL=
MODULE_ID=
ORG_UNIT_ID=
```
- Populate the ``USR_NAME`` and ``USR_PWD`` with the Brightspace credentials you want to use for testing.
- The ``HOST_URL`` is the Brightspace domain you are using (ex: ``https://d2llabs.desire2learn.com``).
- ``MODULE_ID`` and ``ORG_UNIT_ID`` are the respective Id's of where you want to store the file.

### Running the Test
- Open the terminal and ``cd testing``
- ``npm install``
- ``npm test``
- That's it! (If everything is configured correctly, and the accounts have correct authorization, you should have 4 successful tests passed for the 4 sample files).
- Double check by logging into Brightspace and assuring the files are indeed in the intended module.

The ``/testing`` folder should have the following files if configured correctly.
![Screen Shot 2021-03-30 at 11 56 34 AM](https://user-images.githubusercontent.com/44853346/113018904-00651300-914f-11eb-9a1e-afa4d9ec17e0.png)




