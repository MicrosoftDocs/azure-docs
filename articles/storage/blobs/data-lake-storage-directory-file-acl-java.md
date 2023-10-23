---
title: Use Java to manage data in Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Use Azure Storage libraries for Java to manage directories and files in storage accounts that have a hierarchical namespace enabled.
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-data-lake-storage
ms.date: 08/08/2023
ms.devlang: java
ms.topic: how-to
ms.reviewer: prishet
ms.custom: devx-track-java, devx-track-extended-java
---

# Use Java to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use Java to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use .Java to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-java.md).

[Package (Maven)](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake) | [API reference](/java/api/overview/azure/storage-file-datalake-readme) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)

## Prerequisites

- An Azure subscription. For more information, see [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace enabled. Follow [these instructions](create-data-lake-storage-account.md) to create one.

## Set up your project

To get started, open [this page](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake) and find the latest version of the Java library. Then, open the *pom.xml* file in your text editor. Add a dependency element that references that version.

If you plan to authenticate your client application by using Microsoft Entra ID, then add a dependency to the Azure Identity library. For more information, see [Azure Identity client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity#adding-the-package-to-your-project).

Next, add these imports statements to your code file.

```java
import com.azure.identity.*;
import com.azure.storage.common.StorageSharedKeyCredential;
import com.azure.core.http.rest.PagedIterable;
import com.azure.core.util.BinaryData;
import com.azure.storage.file.datalake.*;
import com.azure.storage.file.datalake.models.*;
import com.azure.storage.file.datalake.options.*;
```

## Authorize access and connect to data resources

To work with the code examples in this article, you need to create an authorized [DataLakeServiceClient](/java/api/com.azure.storage.file.datalake.datalakeserviceclient) instance that represents the storage account. You can authorize a `DataLakeServiceClient` object using Microsoft Entra ID, an account access key, or a shared access signature (SAS).

<a name='azure-ad'></a>

### [Microsoft Entra ID](#tab/azure-ad)

You can use the [Azure identity client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity) to authenticate your application with Microsoft Entra ID.

Create a [DataLakeServiceClient](/java/api/com.azure.storage.file.datalake.datalakeserviceclient) instance and pass in a new instance of the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) class.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/Authorize_DataLake.java" id="Snippet_AuthorizeWithAzureAD":::

To learn more about using `DefaultAzureCredential` to authorize access to data, see [Azure Identity client library for Java](/java/api/overview/azure/identity-readme).

### [SAS token](#tab/sas-token)

To use a shared access signature (SAS) token, provide the token as a string and initialize a [DataLakeServiceClient](/java/api/com.azure.storage.file.datalake.datalakeserviceclient) object. If your account URL includes the SAS token, omit the credential parameter.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/Authorize_DataLake.java" id="Snippet_AuthorizeWithSAS":::

To learn more about generating and managing SAS tokens, see the following article:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

### [Account key](#tab/account-key)

You can authorize access to data using your account access keys (Shared Key). This example creates a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance that is authorized with the account key.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/Authorize_DataLake.java" id="Snippet_AuthorizeWithKey":::

[!INCLUDE [storage-shared-key-caution](../../../includes/storage-shared-key-caution.md)]

---

## Create a container

A container acts as a file system for your files. You can create a container by using the following method:

- [DataLakeServiceClient.createFileSystem](/java/api/com.azure.storage.file.datalake.datalakeserviceclient#method-details)

The following code example creates a container and returns a [DataLakeFileSystemClient](/java/api/com.azure.storage.file.datalake.datalakefilesystemclient) object for later use:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_CreateFileSystem":::

## Create a directory

You can create a directory reference in the container by using the following method:

- [DataLakeFileSystemClient.createDirectory](/java/api/com.azure.storage.file.datalake.datalakefilesystemclient#method-details)

The following code example adds a directory to a container, then adds a subdirectory and returns a [DataLakeDirectoryClient](/java/api/com.azure.storage.file.datalake.datalakedirectoryclient) object for later use:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_CreateDirectory":::

## Rename or move a directory

You can rename or move a directory by using the following method:

- [DataLakeDirectoryClient.rename](/java/api/com.azure.storage.file.datalake.datalakedirectoryclient#method-details)

Pass the path of the desired directory as a parameter. The following code example shows how to rename a subdirectory:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_RenameDirectory":::

The following code example shows how to move a subdirectory from one directory to a different directory:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_MoveDirectory":::

## Upload a file to a directory

You can upload content to a new or existing file by using the following method:

- [DataLakeFileClient.upload](/java/api/com.azure.storage.file.datalake.datalakefileclient#method-summary)
- [DataLakeFileClient.uploadFromFile](/java/api/com.azure.storage.file.datalake.datalakefileclient#method-summary)

The following code example shows how to upload a local file to a directory using the `uploadFromFile` method:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_UploadFile":::

You can use this method to create and upload content to a new file, or you can set the `overwrite` parameter to `true` to overwrite an existing file.

## Append data to a file

You can upload data to be appended to a file by using the following method:

- [DataLakeFileClient.append](/java/api/com.azure.storage.file.datalake.datalakefileclient#method-summary)

The following code example shows how to append data to the end of a file using these steps:

- Create a `DataLakeFileClient` object to represent the file resource you're working with. 
- Upload data to the file using the `DataLakeFileClient.append` method.
- Complete the upload by calling the `DataLakeFileClient.flush` method to write the previously uploaded data to the file.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_AppendDataToFile":::

## Download from a directory

The following code example shows how to download a file from a directory to a local file using these steps:

- Create a `DataLakeFileClient` object to represent the file that you want to download. 
- Use the `DataLakeFileClient.readToFile` method to read the file. This example sets the `overwrite` parameter to `true`, which overwrites an existing file.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_DownloadFile":::

## List directory contents

You can list directory contents by using the following method and enumerating the result:

- [DataLakeDirectoryClient.listPaths](/java/api/com.azure.storage.file.datalake.datalakedirectoryclient#method-summary)

Enumerating the paths in the result may make multiple requests to the service while fetching the values.

The following code example prints the names of each file that is located in a directory:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_ListFilesInDirectory":::

## Delete a directory

You can delete a directory by using one of the following methods:

- [DataLakeDirectoryClient.delete](/java/api/com.azure.storage.file.datalake.datalakedirectoryclient#method-summary)
- [DataLakeDirectoryClient.deleteIfExists](/java/api/com.azure.storage.file.datalake.datalakedirectoryclient#method-summary)
- [DataLakeDirectoryClient.deleteWithResponse](/java/api/com.azure.storage.file.datalake.datalakedirectoryclient#method-summary)

The following code example uses `deleteWithResponse` to delete a nonempty directory and all paths beneath the directory:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_DeleteDirectory":::

## See also

- [API reference documentation](/java/api/overview/azure/storage-file-datalake-readme)
- [Package (Maven)](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake)
- [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)
