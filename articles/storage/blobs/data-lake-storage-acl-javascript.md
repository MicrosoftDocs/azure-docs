---
title: Use JavaScript (Node.js) to manage ACLs in Azure Data Lake Storage
titleSuffix: Azure Storage
description: Use Azure Storage Data Lake client library for JavaScript to manage access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-data-lake-storage
ms.date: 09/06/2024
ms.topic: how-to
ms.reviewer: prishet
ms.devlang: javascript
ms.custom: devx-track-js
---

# Use JavaScript SDK in Node.js to manage ACLs in Azure Data Lake Storage

This article shows you how to use Node.js to get, set, and update the access control lists of directories and files.

[Package (Node Package Manager)](https://www.npmjs.com/package/@azure/storage-file-datalake) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-file-datalake/samples) | [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/).
- Azure storage account that has hierarchical namespace (HNS) enabled. Follow [these instructions](create-data-lake-storage-account.md) to create one.
- [Node.js LTS](https://nodejs.org/)
- Azure CLI version `2.6.0` or higher.
- One of the following security permissions:
  - A provisioned Microsoft Entra ID [security principal](../../role-based-access-control/overview.md#security-principal) that has been assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role, scoped to the target container, storage account, parent resource group, or subscription.
  - Owning user of the target container or directory to which you plan to apply ACL settings. To set ACLs recursively, this includes all child items in the target container or directory.
  - Storage account key.

## Set up your project

This section walks you through preparing a project to work with the Azure Data Lake Storage client library for JavaScript.

### Install packages

Install packages for the Azure Data Lake Storage and Azure Identity client libraries using the `npm install` command. The **@azure/identity** package is needed for passwordless connections to Azure services.

```bash
npm install @azure/storage-file-datalake
npm install @azure/identity
```

### Load modules

Add the following code at the top of your file to load the required modules:

```javascript
const {
AzureStorageDataLake,
DataLakeServiceClient,
StorageSharedKeyCredential
} = require("@azure/storage-file-datalake");

const { DefaultAzureCredential } = require('@azure/identity');
```

## Connect to the account

To run the code examples in this article, you need to create a [DataLakeServiceClient](/javascript/api/@azure/storage-file-datalake/datalakeserviceclient) instance that represents the storage account. You can authorize the client object with Microsoft Entra ID credentials or with an account key.

<a name='connect-by-using-azure-active-directory-ad'></a>

### [Microsoft Entra ID (recommended)](#tab/entra-id)

You can use the [Azure identity client library for JavaScript](https://www.npmjs.com/package/@azure/identity) to authenticate your application with Microsoft Entra ID.

> [!NOTE]
> If you're using Microsoft Entra ID to authorize access, then make sure that your security principal has been assigned the [Storage Blob Data Owner role](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see [Access control model in Azure Data Lake Storage](./data-lake-storage-access-control-model.md).

First, you'll have to assign one of the following [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) roles to your security principal:

| Role | ACL setting capability |
| --- | --- |
| [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) | All directories and files in the account. |
| [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) | Only directories and files owned by the security principal. |

Next, create a [DataLakeServiceClient](/javascript/api/@azure/storage-file-datalake/datalakeserviceclient) instance and pass in a new instance of the [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) class.

```javascript
function GetDataLakeServiceClientAD(accountName) {

  const dataLakeServiceClient = new DataLakeServiceClient(
      `https://${accountName}.dfs.core.windows.net`,
      new DefaultAzureCredential()
  );

  return dataLakeServiceClient;
}
```

To learn more about using `DefaultAzureCredential` to authorize access to data, see [Overview: Authenticate JavaScript apps to Azure using the Azure SDK](/azure/developer/javascript/sdk/authentication/overview).

### [Account key](#tab/account-key)

You can authorize access to data using your account access keys (Shared Key). This example creates a [DataLakeServiceClient](/javascript/api/@azure/storage-file-datalake/datalakeserviceclient) instance that is authorized with the account key.

```javascript

function GetDataLakeServiceClient(accountName, accountKey) {

  const sharedKeyCredential =
     new StorageSharedKeyCredential(accountName, accountKey);

  const dataLakeServiceClient = new DataLakeServiceClient(
      `https://${accountName}.dfs.core.windows.net`, sharedKeyCredential);

  return dataLakeServiceClient;
}

```

[!INCLUDE [storage-shared-key-caution](../../../includes/storage-shared-key-caution.md)]

---

## Get and set a directory ACL

This example gets and then sets the ACL of a directory named `my-directory`. This example gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read access.

> [!NOTE]
> If your application authorizes access by using Microsoft Entra ID, then make sure that the security principal that your application uses to authorize access has been assigned the [Storage Blob Data Owner role](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see [Access control in Azure Data Lake Storage](./data-lake-storage-access-control.md).

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
> If your application authorizes access by using Microsoft Entra ID, then make sure that the security principal that your application uses to authorize access has been assigned the [Storage Blob Data Owner role](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see [Access control in Azure Data Lake Storage](./data-lake-storage-access-control.md).

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
- [Access control model in Azure Data Lake Storage](data-lake-storage-access-control.md)
- [Access control lists (ACLs) in Azure Data Lake Storage](data-lake-storage-access-control.md)
