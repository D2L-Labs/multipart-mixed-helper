# multipart-mixed-helper
## Context
The multipart-mixed-helper provides developers an easy way to send and await multipart-mixed requests.

## Installation
To include this repo in your project as a subrepo, simply run the command in the directory you want it to appear in: `git submodule add https://github.com/D2L-Labs/multipart-mixed-helper.git`

As an example, the multipart-mixed-helper is added as a subrepo in ``https://github.com/D2L-Labs/cold-start.git``

## Updating/Pulling Recent Changes
To checkout a specific branch or pull latest version of this repo, simply ``cd`` into this repo within your project (``cd rootProj/../../multipart-mixed-helper``) and ``git pull`` to get the latest changes on that branch (usually ``main``)

## Usage
Adding the submodule simply creates a folder of this code in your repo, importing is simple: ``import sendMultipartMixedRequest from "./multipart-mixed-helper/ServiceHelper";`` (Be sure to use the correct path to the submodule in your import, in cold-start the submodule was imported in the same directory as the file that needed it).

The ``sendMultipartMixedRequest`` takes in the following parameters ``sendMultipartMixedRequest(url, requestData, file, token)``, 
 -  ``url`` being the endpoint you want to send the request to
 -  ``requestData`` is your json payload you want to send, like a POST request body.
 -  ``file`` is an object containing the following:

```
const file = {
    contentType: fileType.mimeType,
    filename: `${fileName}.${fileType.ending}`,
    fileData: fileContent,
  };
```
 -  ``file.contentType`` is the mime-type of the file (example for PDFs: ``application/pdf``)
 -  ``fileName`` is the name of the file without the extension (.pdf, .word)
 -  ``fileData`` is the base64 representation of the binary file data which can be obtained by using a ``blobToData`` conversion as shown below.

(See example below for in-code usage of this conversion)
```
const blobToData = (blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };
    
let data = await blobToData(res.data);
data = data.split(",").pop();
```
 - Lastly, ``token`` is your Bearer auth token for Brightspace OAuth2 requests. If your application does not use Bearer Tokens, or would like to use a different OAuth method, you can simply change what is set as the requestHeader on line 41: ``request.setRequestHeader("Authorization", "Bearer " + token);`` of ``ServiceHelper.js`` located in this repo. 

## Example Usage
```
exportGDrive = async (link, fileTypeObject) => {
    const res = await axios.get(
      ...,
      { responseType: "blob" }
    );


    const blobToData = (blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };

    let data = await blobToData(res.data);
    data = data.split(",").pop();

    return data;
  };
```

```
const fileContent = await exportGDrive(link, fileType);
await fileUpload(name, fileContent, fileType);
```

```
const fileUpload = async (fileName, fileContent, fileType) => {
  ...
  const requestData = {
  ...
  };

  const file = {
    contentType: fileType.mimeType,
    fileName: `${fileName}.${fileType.ending}`,
    fileData: fileContent,
  };

  const res = await sendMultipartMixedRequest(
    route,
    requestData,
    file,
    sessionStorage.getItem(authTokenName)
  );

  return res.data;
};
```
