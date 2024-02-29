---
title: Develop for Azure Files with Java
description: Learn how to develop Java applications and services that use Azure Files to store file data.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/26/2021
ms.custom: devx-track-java, devx-track-extended-java
ms.author: kendownie
---

# Develop for Azure Files with Java

[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

Learn the basics developing Java applications that use Azure Files to store data. Create a console application and learn basic actions using Azure Files APIs:

- Create and delete Azure file shares
- Create and delete directories
- Enumerate files and directories in an Azure file share
- Upload, download, and delete a file

[!INCLUDE [storage-check-out-samples-java](../../../includes/storage-check-out-samples-java.md)]

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Create a Java application

To build the samples, you'll need the Java Development Kit (JDK) and the [Azure Storage SDK for Java](https://github.com/azure/azure-sdk-for-java). You should also have created an Azure storage account.

## Set up your application to use Azure Files

To use the Azure Files APIs, add the following code to the top of the Java file from where you intend to access Azure Files.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_ImportStatements":::

## Set up an Azure storage connection string

To use Azure Files, you need to connect to your Azure storage account. Configure a connection string and use it to connect to your storage account. Define a static variable to hold the connection string.

Replace *\<storage_account_name\>* and *\<storage_account_key\>* with the actual values for your storage account.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_ConnectionString":::

## Access an Azure file share

To access Azure Files, create a [ShareClient](/java/api/com.azure.storage.file.share.shareclient) object. Use the [ShareClientBuilder](/java/api/com.azure.storage.file.share.shareclientbuilder) class to build a new **ShareClient** object.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_createClient":::

## Create a file share

All files and directories in Azure Files are stored in a container called a share.

The [ShareClient.create](/java/api/com.azure.storage.file.share.shareclient.create) method throws an exception if the share already exists. Put the call to **create** in a `try/catch` block and handle the exception.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_createFileShare":::

## Delete a file share

The following sample code deletes a file share.

Delete a share by calling the [ShareClient.delete](/java/api/com.azure.storage.file.share.shareclient.delete) method.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_deleteFileShare":::

## Create a directory

Organize storage by putting files inside subdirectories instead of having all of them in the root directory.

The following code creates a directory by calling [ShareDirectoryClient.create](/java/api/com.azure.storage.file.share.sharedirectoryclient.create). The example method returns a `Boolean` value indicating if it successfully created the directory.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_createDirectory":::

## Delete a directory

Deleting a directory is a straightforward task. You can't delete a directory that still contains files or subdirectories.

The [ShareDirectoryClient.delete](/java/api/com.azure.storage.file.share.sharedirectoryclient.delete) method throws an exception if the directory doesn't exist or isn't empty. Put the call to **delete** in a `try/catch` block and handle the exception.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_deleteDirectory":::

## Enumerate files and directories in an Azure file share

Get a list of files and directories by calling [ShareDirectoryClient.listFilesAndDirectories](/java/api/com.azure.storage.file.share.sharedirectoryclient.listfilesanddirectories). The method returns a list of [ShareFileItem](/java/api/com.azure.storage.file.share.models.sharefileitem) objects on which you can iterate. The following code lists files and directories inside the directory specified by the *dirName* parameter.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_enumerateFilesAndDirs":::

## Upload a file

Learn how to upload a file from local storage.

The following code uploads a local file to Azure Files by calling the [ShareFileClient.uploadFromFile](/java/api/com.azure.storage.file.share.sharefileclient.uploadfromfile) method. The following example method returns a `Boolean` value indicating if it successfully uploaded the specified file.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_uploadFile":::

## Download a file

One of the more frequent operations is to download files from an Azure file share.

The following example downloads the specified file to the local directory specified in the *destDir* parameter. The example method makes the downloaded filename unique by prepending the date and time.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_downloadFile":::

## Delete a file

Another common Azure Files operation is file deletion.

The following code deletes the specified file specified. First, the example creates a [ShareDirectoryClient](/java/api/com.azure.storage.file.share.sharedirectoryclient) based on the *dirName* parameter. Then, the code gets a [ShareFileClient](/java/api/com.azure.storage.file.share.sharefileclient) from the directory client, based on the *fileName* parameter. Finally, the example method calls [ShareFileClient.delete](/java/api/com.azure.storage.file.share.sharefileclient.delete) to delete the file.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_deleteFile":::

## Next steps

If you would like to learn more about other Azure storage APIs, follow these links.

- [Azure for Java developers](/azure/developer/java)
- [Azure SDK for Java](https://github.com/azure/azure-sdk-for-java)
- [Azure SDK for Android](https://github.com/azure/azure-sdk-for-android)
- [Azure File Share client library for Java SDK Reference](/java/api/overview/azure/storage-file-share-readme)
- [Azure Storage Services REST API](/rest/api/storageservices/)
- [Azure Storage Team Blog](https://azure.microsoft.com/blog/topics/storage-backup-and-recovery/)
- [Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy-v10.md)
- [Troubleshoot Azure Files](/troubleshoot/azure/azure-storage/files-troubleshoot?toc=/azure/storage/files/toc.json)

For related code samples using deprecated Java version 8 SDKs, see [Code samples using Java version 8](files-samples-java-v8.md).
