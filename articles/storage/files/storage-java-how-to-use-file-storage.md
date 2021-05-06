---
title: Develop for Azure Files with Java | Microsoft Docs
description: Learn how to develop Java applications and services that use Azure Files to store file data.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 11/18/2020
ms.custom: devx-track-java
ms.author: rogarana
ms.subservice: files
---

# Develop for Azure Files with Java

[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

Learn the basics developing Java applications that use Azure Files to store data. Create a console application and learn basic actions using Azure Files APIs:

- Create and delete Azure file shares
- Create and delete directories
- Enumerate files and directories in an Azure file share
- Upload, download, and delete a file

[!INCLUDE [storage-check-out-samples-java](../../../includes/storage-check-out-samples-java.md)]

## Create a Java application

To build the samples, you'll need the Java Development Kit (JDK) and the [Azure Storage SDK for Java](https://github.com/azure/azure-sdk-for-java). You should also have created an Azure storage account.

## Set up your application to use Azure Files

To use the Azure Files APIs, add the following code to the top of the Java file from where you intend to access Azure Files.

# [Azure Java SDK v12](#tab/java)

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_ImportStatements":::

# [Azure Java SDK v11](#tab/java11)

```java
// Include the following imports to use Azure Files APIs v11
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.file.*;
```

---

## Set up an Azure storage connection string

To use Azure Files, you need to connect to your Azure storage account. Configure a connection string and use it to connect to your storage account. Define a static variable to hold the connection string.

# [Azure Java SDK v12](#tab/java)

Replace *\<storage_account_name\>* and *\<storage_account_key\>* with the actual values for your storage account.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_ConnectionString":::

# [Azure Java SDK v11](#tab/java11)

Replace *your_storage_account_name* and *your_storage_account_key* with the actual values for your storage account.

```java
// Configure the connection-string with your values
public static final String storageConnectionString =
    "DefaultEndpointsProtocol=http;" +
    "AccountName=your_storage_account_name;" +
    "AccountKey=your_storage_account_key";
```

---

## Access an Azure file share

# [Azure Java SDK v12](#tab/java)

To access Azure Files, create a [ShareClient](/java/api/com.azure.storage.file.share.shareclient) object. Use the [ShareClientBuilder](/java/api/com.azure.storage.file.share.shareclientbuilder) class to build a new **ShareClient** object.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_createClient":::

# [Azure Java SDK v11](#tab/java11)

To access your storage account, use the **CloudStorageAccount** object, passing the connection string to its **parse** method.

```java
// Use the CloudStorageAccount object to connect to your storage account
try {
    CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);
} catch (InvalidKeyException invalidKey) {
    // Handle the exception
}
```

**CloudStorageAccount.parse** throws an InvalidKeyException so you'll need to put it inside a try/catch block.

---

## Create a file share

All files and directories in Azure Files are stored in a container called a share.

# [Azure Java SDK v12](#tab/java)

The [ShareClient.create](/java/api/com.azure.storage.file.share.shareclient.create) method throws an exception if the share already exists. Put the call to **create** in a `try/catch` block and handle the exception.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_createFileShare":::

# [Azure Java SDK v11](#tab/java11)

To obtain access to a share and its contents, create an Azure Files client.

```java
// Create the Azure Files client.
CloudFileClient fileClient = storageAccount.createCloudFileClient();
```

Using the Azure Files client, you can then obtain a reference to a share.

```java
// Get a reference to the file share
CloudFileShare share = fileClient.getShareReference("sampleshare");
```

To actually create the share, use the **createIfNotExists** method of the **CloudFileShare** object.

```java
if (share.createIfNotExists()) {
    System.out.println("New share created");
}
```

At this point, **share** holds a reference to a share named **sample share**.

---

## Delete a file share

The following sample code deletes a file share.

# [Azure Java SDK v12](#tab/java)

Delete a share by calling the [ShareClient.delete](/java/api/com.azure.storage.file.share.shareclient.delete) method.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_deleteFileShare":::

# [Azure Java SDK v11](#tab/java11)

Delete a share by calling the **deleteIfExists** method on a **CloudFileShare** object.

```java
try
{
    // Retrieve storage account from connection-string.
    CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

    // Create the file client.
   CloudFileClient fileClient = storageAccount.createCloudFileClient();

   // Get a reference to the file share
   CloudFileShare share = fileClient.getShareReference("sampleshare");

   if (share.deleteIfExists()) {
       System.out.println("sampleshare deleted");
   }
} catch (Exception e) {
    e.printStackTrace();
}
```

---

## Create a directory

Organize storage by putting files inside subdirectories instead of having all of them in the root directory.

# [Azure Java SDK v12](#tab/java)

The following code creates a directory by calling [ShareDirectoryClient.create](/java/api/com.azure.storage.file.share.sharedirectoryclient.create). The example method returns a `Boolean` value indicating if it successfully created the directory.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_createDirectory":::

# [Azure Java SDK v11](#tab/java11)

The following code creates a subdirectory named **sampledir** under the root directory.

```java
//Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();

//Get a reference to the sampledir directory
CloudFileDirectory sampleDir = rootDir.getDirectoryReference("sampledir");

if (sampleDir.createIfNotExists()) {
    System.out.println("sampledir created");
} else {
    System.out.println("sampledir already exists");
}
```

---

## Delete a directory

Deleting a directory is a straightforward task. You can't delete a directory that still contains files or subdirectories.

# [Azure Java SDK v12](#tab/java)

The [ShareDirectoryClient.delete](/java/api/com.azure.storage.file.share.sharedirectoryclient.delete) method throws an exception if the directory doesn't exist or isn't empty. Put the call to **delete** in a `try/catch` block and handle the exception.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_deleteDirectory":::

# [Azure Java SDK v11](#tab/java11)

```java
// Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();

// Get a reference to the directory you want to delete
CloudFileDirectory containerDir = rootDir.getDirectoryReference("sampledir");

// Delete the directory
if ( containerDir.deleteIfExists() ) {
    System.out.println("Directory deleted");
}
```

---

## Enumerate files and directories in an Azure file share

# [Azure Java SDK v12](#tab/java)

Get a list of files and directories by calling [ShareDirectoryClient.listFilesAndDirectories](/java/api/com.azure.storage.file.share.sharedirectoryclient.listfilesanddirectories). The method returns a list of [ShareFileItem](/java/api/com.azure.storage.file.share.models.sharefileitem) objects on which you can iterate. The following code lists files and directories inside the directory specified by the *dirName* parameter.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_enumerateFilesAndDirs":::

# [Azure Java SDK v11](#tab/java11)

Get a list of files and directories by calling **listFilesAndDirectories** on a **CloudFileDirectory** reference. The method returns a list of **ListFileItem** objects on which you can iterate. The following code lists files and directories inside the root directory.

```java
//Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();

for ( ListFileItem fileItem : rootDir.listFilesAndDirectories() ) {
    System.out.println(fileItem.getUri());
}
```

---

## Upload a file

Learn how to upload a file from local storage.

# [Azure Java SDK v12](#tab/java)

The following code uploads a local file to Azure File storage by calling the [ShareFileClient.uploadFromFile](/java/api/com.azure.storage.file.share.sharefileclient.uploadfromfile) method. The following example method returns a `Boolean` value indicating if it successfully uploaded the specified file.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_uploadFile":::

# [Azure Java SDK v11](#tab/java11)

Get a reference to the directory where the file will be uploaded by calling the **getRootDirectoryReference** method on the share object.

```java
//Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();
```

Now that you have a reference to the root directory of the share, you can upload a file onto it using the following code.

```java
// Define the path to a local file.
final String filePath = "C:\\temp\\Readme.txt";

CloudFile cloudFile = rootDir.getFileReference("Readme.txt");
cloudFile.uploadFromFile(filePath);
```

---

## Download a file

One of the more frequent operations is to download files from an Azure file share.

# [Azure Java SDK v12](#tab/java)

The following example downloads the specified file to the local directory specified in the *destDir* parameter. The example method makes the downloaded filename unique by prepending the date and time.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_downloadFile":::

# [Azure Java SDK v11](#tab/java11)

The following example downloads SampleFile.txt and displays its contents.

```java
//Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();

//Get a reference to the directory that contains the file
CloudFileDirectory sampleDir = rootDir.getDirectoryReference("sampledir");

//Get a reference to the file you want to download
CloudFile file = sampleDir.getFileReference("SampleFile.txt");

//Write the contents of the file to the console.
System.out.println(file.downloadText());
```

---

## Delete a file

Another common Azure Files operation is file deletion.

# [Azure Java SDK v12](#tab/java)

The following code deletes the specified file specified. First, the example creates a [ShareDirectoryClient](/java/api/com.azure.storage.file.share.sharedirectoryclient) based on the *dirName* parameter. Then, the code gets a [ShareFileClient](/java/api/com.azure.storage.file.share.sharefileclient) from the directory client, based on the *fileName* parameter. Finally, the example method calls [ShareFileClient.delete](/java/api/com.azure.storage.file.share.sharefileclient.delete) to delete the file.

:::code language="java" source="~/azure-storage-snippets/files/howto/java/java-v12/files-howto-v12/src/main/java/com/files/howto/App.java" id="Snippet_deleteFile":::

# [Azure Java SDK v11](#tab/java11)

The following code deletes a file named SampleFile.txt stored inside a directory named **sampledir**.

```java
// Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();

// Get a reference to the directory where the file to be deleted is in
CloudFileDirectory containerDir = rootDir.getDirectoryReference("sampledir");

String filename = "SampleFile.txt"
CloudFile file;

file = containerDir.getFileReference(filename)
if ( file.deleteIfExists() ) {
    System.out.println(filename + " was deleted");
}
```

---

## Next steps

If you would like to learn more about other Azure storage APIs, follow these links.

- [Azure for Java developers](/azure/developer/java)
- [Azure SDK for Java](https://github.com/azure/azure-sdk-for-java)
- [Azure SDK for Android](https://github.com/azure/azure-sdk-for-android)
- [Azure File Share client library for Java SDK Reference](/java/api/overview/azure/storage-file-share-readme)
- [Azure Storage Services REST API](/rest/api/storageservices/)
- [Azure Storage Team Blog](https://azure.microsoft.com/blog/topics/storage-backup-and-recovery/)
- [Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy-v10.md)
- [Troubleshooting Azure Files problems - Windows](storage-troubleshoot-windows-file-connection-problems.md)
