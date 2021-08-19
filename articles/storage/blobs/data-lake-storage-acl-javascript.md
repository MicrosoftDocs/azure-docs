---
title: Use JavaScript (Node.js) to manage ACLs in Azure Data Lake Storage Gen2
description: Use Azure Storage Data Lake client library for JavaScript to manage access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
author: normesta
ms.service: storage
ms.date: 03/19/2021
ms.author: normesta
ms.topic: how-to
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
ms.custom: devx-track-js

---

# Use JavaScript SDK in Node.js to manage ACLs in Azure Data Lake Storage Gen2

This article shows you how to use Node.js to get, set, and update the access control lists of directories and files. 

[Package (Node Package Manager)](https://www.npmjs.com/package/@azure/storage-file-datalake) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-file-datalake/samples) | [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

- Azure CLI version `2.6.0` or higher.

- One of the following security permissions:

  - A provisioned Azure Active Directory (AD) [security principal](../../role-based-access-control/overview.md#security-principal) that has been assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role in the scope of the either the target container, parent resource group or subscription.  

  - Owning user of the target container or directory to which you plan to apply ACL settings. To set ACLs recursively, this includes all child items in the target container or directory.
  
  - Storage account key..

## Set up your project

Install Data Lake client library for JavaScript by opening a terminal window, and then typing the following command.

```javascript
npm install @azure/storage-file-datalake
```

Import the `storage-file-datalake` package by placing this statement at the top of your code file. 

```javascript
const {
AzureStorageDataLake,
DataLakeServiceClient,
StorageSharedKeyCredential
} = require("@azure/storage-file-datalake");
```

## Connect to the account

To use the snippets in this article, you'll need to create a **DataLakeServiceClient** instance that represents the storage account. 

### Connect by using Azure Active Directory (AD)

> [!NOTE]
> If you're using Azure Active Directory (Azure AD) to authorize access, then make sure that your security principal has been assigned the [Storage Blob Data Owner role](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control model in Azure Data Lake Storage Gen2](./data-lake-storage-access-control-model.md).

You can use the [Azure identity client library for JS](https://www.npmjs.com/package/@azure/identity) to authenticate your application with Azure AD.

Get a client ID, a client secret, and a tenant ID. To do this, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md). As part of that process, you'll have to assign one of the following [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) roles to your security principal. 

|Role|ACL setting capability|
|--|--|
|[Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)|All directories and files in the account.|
|[Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|Only directories and files owned by the security principal.|

This example creates a **DataLakeServiceClient** instance by using a client ID, a client secret, and a tenant ID.  

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
> This method of authorization works only for Node.js applications. If you plan to run your code in a browser, you can authorize by using Azure Active Directory (AD).

## Get and set a directory ACL

This example gets and then sets the ACL of a directory named `my-directory`. This example gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read access.

> [!NOTE]
> If your application authorizes access by using Azure Active Directory (Azure AD), then make sure that the security principal that your application uses to authorize access has been assigned the [Storage Blob Data Owner role](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](./data-lake-storage-access-control.md).

```javascript
async function ManageDirectoryACLs(fileSystemClient) {

    const directoryClient = fileSystemClient.getDirectoryClient("my-directory"); 
    const permissions = await directoryClient.getAccessControl();

    console.log(permissions.acl);

    const acl = [
    {
      accessControlType: "user",
      entityId: "",
      defaultScope: false,
      permissions: {
        read: true,
        write: true,
        execute: true
      }
    },
    {
      accessControlType: "group",
      entityId: "",
      defaultScope: false,
      permissions: {
        read: true,
        write: false,
        execute: true
      }
    },
    {
      accessControlType: "other",
      entityId: "",
      defaultScope: false,
      permissions: {
        read: true,
        write: true,
        execute: false
      }

    }

  ];

  await directoryClient.setAccessControl(acl);
}
```

You can also get and set the ACL of the root directory of a container. To get the root directory, pass an empty string (`/`) into the **DataLakeFileSystemClient.getDirectoryClient** method.

### Get and set a file ACL

This example gets and then sets the ACL of a file named `upload-file.txt`. This example gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read access.

> [!NOTE]
> If your application authorizes access by using Azure Active Directory (Azure AD), then make sure that the security principal that your application uses to authorize access has been assigned the [Storage Blob Data Owner role](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](./data-lake-storage-access-control.md).

```javascript
async function ManageFileACLs(fileSystemClient) {

  const fileClient = fileSystemClient.getFileClient("my-directory/uploaded-file.txt"); 
  const permissions = await fileClient.getAccessControl();

  console.log(permissions.acl);

  const acl = [
  {
    accessControlType: "user",
    entityId: "",
    defaultScope: false,
    permissions: {
      read: true,
      write: true,
      execute: true
    }
  },
  {
    accessControlType: "group",
    entityId: "",
    defaultScope: false,
    permissions: {
      read: true,
      write: false,
      execute: true
    }
  },
  {
    accessControlType: "other",
    entityId: "",
    defaultScope: false,
    permissions: {
      read: true,
      write: true,
      execute: false
    }

  }

];

await fileClient.setAccessControl(acl);        
}
```

## See also

- [Package (Node Package Manager)](https://www.npmjs.com/package/@azure/storage-file-datalake)
- [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-file-datalake/samples)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)
- [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)
- [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)