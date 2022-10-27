---
title: Use Java to manage data in Azure Data Lake Storage Gen2
description: Use Azure Storage libraries for Java to manage directories and files in storage accounts that has hierarchical namespace enabled.
author: pauljewellmsft
ms.author: pauljewell
ms.service: storage
ms.date: 02/17/2021
ms.devlang: java
ms.custom: devx-track-java
ms.topic: how-to
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Use Java to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use Java to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use .Java to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-java.md).

[Package (Maven)](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake) | [API reference](/java/api/overview/azure/storage-file-datalake-readme) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)

## Prerequisites

- An Azure subscription. For more information, see [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

## Set up your project

To get started, open [this page](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake) and find the latest version of the Java library. Then, open the *pom.xml* file in your text editor. Add a dependency element that references that version.

If you plan to authenticate your client application by using Azure Active Directory (Azure AD), then add a dependency to the Azure Secret Client Library. For more information, see [Adding the Secret Client Library package to your project](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity#adding-the-package-to-your-project).

Next, add these imports statements to your code file.

```java
import com.azure.storage.common.StorageSharedKeyCredential;
import com.azure.storage.file.datalake.DataLakeDirectoryClient;
import com.azure.storage.file.datalake.DataLakeFileClient;
import com.azure.storage.file.datalake.DataLakeFileSystemClient;
import com.azure.storage.file.datalake.DataLakeServiceClient;
import com.azure.storage.file.datalake.DataLakeServiceClientBuilder;
import com.azure.storage.file.datalake.models.ListPathsOptions;
import com.azure.storage.file.datalake.models.PathItem;
import com.azure.storage.file.datalake.models.AccessControlChangeCounters;
import com.azure.storage.file.datalake.models.AccessControlChangeResult;
import com.azure.storage.file.datalake.models.AccessControlType;
import com.azure.storage.file.datalake.models.PathAccessControl;
import com.azure.storage.file.datalake.models.PathAccessControlEntry;
import com.azure.storage.file.datalake.models.PathPermissions;
import com.azure.storage.file.datalake.models.PathRemoveAccessControlEntry;
import com.azure.storage.file.datalake.models.RolePermissions;
import com.azure.storage.file.datalake.options.PathSetAccessControlRecursiveOptions;
```

## Connect to the account

To use the snippets in this article, you'll need to create a **DataLakeServiceClient** instance that represents the storage account.

### Connect by using an account key

This is the easiest way to connect to an account.

This example creates a **DataLakeServiceClient** instance by using an account key.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/Authorize_DataLake.java" id="Snippet_AuthorizeWithKey":::

### Connect by using Azure Active Directory (Azure AD)

You can use the [Azure identity client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity) to authenticate your application with Azure AD.

This example creates a **DataLakeServiceClient** instance by using a client ID, a client secret, and a tenant ID. To get these values, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md).

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/Authorize_DataLake.java" id="Snippet_AuthorizeWithAzureAD":::

> [!NOTE]
> For more examples, see the [Azure identity client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity) documentation.

## Create a container

A container acts as a file system for your files. You can create one by calling the **DataLakeServiceClient.createFileSystem** method.

This example creates a container named `my-file-system`.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_CreateFileSystem":::

## Create a directory

Create a directory reference by calling the **DataLakeFileSystemClient.createDirectory** method.

This example adds a directory named `my-directory` to a container, and then adds a sub-directory named `my-subdirectory`.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_CreateDirectory":::

## Rename or move a directory

Rename or move a directory by calling the **DataLakeDirectoryClient.rename** method. Pass the path of the desired directory a parameter.

This example renames a sub-directory to the name `my-subdirectory-renamed`.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_RenameDirectory":::

This example moves a directory named `my-subdirectory-renamed` to a sub-directory of a directory named `my-directory-2`.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_MoveDirectory":::

## Delete a directory

Delete a directory by calling the **DataLakeDirectoryClient.deleteWithResponse** method.

This example deletes a directory named `my-directory`.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_DeleteDirectory":::

## Upload a file to a directory

First, create a file reference in the target directory by creating an instance of the **DataLakeFileClient** class. Upload a file by calling the **DataLakeFileClient.append** method. Make sure to complete the upload by calling the **DataLakeFileClient.FlushAsync** method.

This example uploads a text file to a directory named `my-directory`.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_UploadFile":::

> [!TIP]
> If your file size is large, your code will have to make multiple calls to the **DataLakeFileClient.append** method. Consider using the **DataLakeFileClient.uploadFromFile** method instead. That way, you can upload the entire file in a single call.
>
> See the next section for an example.

## Upload a large file to a directory

Use the **DataLakeFileClient.uploadFromFile** method to upload large files without having to make multiple calls to the **DataLakeFileClient.append** method.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_UploadFileBulk":::

## Download from a directory

First, create a **DataLakeFileClient** instance that represents the file that you want to download. Use the **DataLakeFileClient.read** method to read the file. Use any Java file processing API to save bytes from the stream to a file.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_DownloadFile":::

## List directory contents

This example prints the names of each file that is located in a directory named `my-directory`.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/CRUD_DataLake.java" id="Snippet_ListFilesInDirectory":::

## See also

- [API reference documentation](/java/api/overview/azure/storage-file-datalake-readme)
- [Package (Maven)](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake)
- [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)
