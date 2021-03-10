---
title: Use JavaScript to manage data in Azure Data Lake Storage Gen2
description: Use Azure Storage Data Lake client library for JavaScript to manage directories and files in storage accounts that has hierarchical namespace enabled.
author: normesta
ms.service: storage
ms.date: 02/17/2021
ms.author: normesta
ms.topic: how-to
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
ms.custom: devx-track-js

---

# Use JavaScript to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use JavaScript to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use JavaScript to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-javascript.md).

[Package (Node Package Manager)](https://www.npmjs.com/package/@azure/storage-file-datalake) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-file-datalake/samples) | [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

- If you are using this package in a Node.js application, you'll need Node.js 8.0.0 or higher.

## Set up your project

Install Data Lake client library for JavaScript by opening a terminal window, and then typing the following command.

```javascript
npm install @azure/storage-file-datalake
```

Import the `storage-file-datalake` package by placing this statement at the top of your code file. 

```javascript
const AzureStorageDataLake = require("@azure/storage-file-datalake");
```

## Connect to the account 

To use the snippets in this article, you'll need to create a **DataLakeServiceClient** instance that represents the storage account. 

### Connect by using an account key

This is the easiest way to connect to an account. 

This example creates a **DataLakeServiceClient** instance by using an account key.

```javascript

function GetDataLakeServiceClient(accountName, accountKey) {

  const sharedKeyCredential = 
     new StorageSharedKeyCredential(accountName, accountKey);
  
  const datalakeServiceClient = new DataLakeServiceClient(
      `https://${accountName}.dfs.core.windows.net`, sharedKeyCredential);

  return datalakeServiceClient;             
}      

```

> [!NOTE]
> This method of authorization works only for Node.js applications. If you plan to run your code in a browser, you can authorize by using Azure Active Directory (Azure AD).

### Connect by using Azure Active Directory (Azure AD)

You can use the [Azure identity client library for JS](https://www.npmjs.com/package/@azure/identity) to authenticate your application with Azure AD.

This example creates a **DataLakeServiceClient** instance by using a client ID, a client secret, and a tenant ID.  To get these values, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md).

```javascript
function GetDataLakeServiceClientAD(accountName, clientID, clientSecret, tenantID) {

  const credential = new ClientSecretCredential(tenantID, clientID, clientSecret);
  
  const datalakeServiceClient = new DataLakeServiceClient(
      `https://${accountName}.dfs.core.windows.net`, credential);

  return datalakeServiceClient;             
}
```

> [!NOTE]
> For more examples, see the [Azure identity client library for JS](https://www.npmjs.com/package/@azure/identity) documentation.

## Create a container

A container acts as a file system for your files. You can create one by getting a **FileSystemClient** instance, and then calling the **FileSystemClient.Create** method.

This example creates a container named `my-file-system`. 

```javascript
async function CreateFileSystem(datalakeServiceClient) {

  const fileSystemName = "my-file-system";
  
  const fileSystemClient = datalakeServiceClient.getFileSystemClient(fileSystemName);

  const createResponse = await fileSystemClient.create();
        
}
```

## Create a directory

Create a directory reference by getting a **DirectoryClient** instance, and then calling the **DirectoryClient.create** method.

This example adds a directory named `my-directory` to a container. 

```javascript
async function CreateDirectory(fileSystemClient) {
   
  const directoryClient = fileSystemClient.getDirectoryClient("my-directory");
  
  await directoryClient.create();

}
```

## Rename or move a directory

Rename or move a directory by calling the **DirectoryClient.rename** method. Pass the path of the desired directory a parameter. 

This example renames a sub-directory to the name `my-directory-renamed`.

```javascript
async function RenameDirectory(fileSystemClient) {

  const directoryClient = fileSystemClient.getDirectoryClient("my-directory"); 
  await directoryClient.move("my-directory-renamed");

}
```

This example moves a directory named `my-directory-renamed` to a sub-directory of a directory named `my-directory-2`. 

```javascript
async function MoveDirectory(fileSystemClient) {

  const directoryClient = fileSystemClient.getDirectoryClient("my-directory-renamed"); 
  await directoryClient.move("my-directory-2/my-directory-renamed");      

}
```

## Delete a directory

Delete a directory by calling the **DirectoryClient.delete** method.

This example deletes a directory named `my-directory`.   

```javascript
async function DeleteDirectory(fileSystemClient) {

  const directoryClient = fileSystemClient.getDirectoryClient("my-directory"); 
  await directoryClient.delete();

}
```

## Upload a file to a directory

First, read a file. This example uses the Node.js `fs` module. Then, create a file reference in the target directory by creating a **FileClient** instance, and then calling the **FileClient.create** method. Upload a file by calling the **FileClient.append** method. Make sure to complete the upload by calling the **FileClient.flush** method.

This example uploads a text file to a directory named `my-directory`.`

```javascript
async function UploadFile(fileSystemClient) {

  const fs = require('fs') 

  var content = "";
  
  fs.readFile('mytestfile.txt', (err, data) => { 
      if (err) throw err; 

      content = data.toString();

  }) 
  
  const fileClient = fileSystemClient.getFileClient("my-directory/uploaded-file.txt");
  await fileClient.create();
  await fileClient.append(content, 0, content.length);
  await fileClient.flush(content.length);

}
```

## Download from a directory

First, create a **FileSystemClient** instance that represents the file that you want to download. Use the **FileSystemClient.read** method to read the file. Then, write the file. This example uses the Node.js `fs` module to do that. 

> [!NOTE]
> This method of downloading a file works only for Node.js applications. If you plan to run your code in a browser, see the [Azure Storage File Data Lake client library for JavaScript](https://www.npmjs.com/package/@azure/storage-file-datalake) readme file for an example of how to do this in a browser.

```javascript
async function DownloadFile(fileSystemClient) {

  const fileClient = fileSystemClient.getFileClient("my-directory/uploaded-file.txt");

  const downloadResponse = await fileClient.read();

  const downloaded = await streamToString(downloadResponse.readableStreamBody);
 
  async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }   
  
  const fs = require('fs');

  fs.writeFile('mytestfiledownloaded.txt', downloaded, (err) => {
    if (err) throw err;
  });
}

```

## List directory contents

This example, prints the names of each directory and file that is located in a directory named `my-directory`.

```javascript
async function ListFilesInDirectory(fileSystemClient) {
  
  let i = 1;

  let iter = await fileSystemClient.listPaths({path: "my-directory", recursive: true});

  for await (const path of iter) {
    
    console.log(`Path ${i++}: ${path.name}, is directory: ${path.isDirectory}`);
  }

}
```

## See also

- [Package (Node Package Manager)](https://www.npmjs.com/package/@azure/storage-file-datalake)
- [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-file-datalake/samples)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)