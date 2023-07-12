---
title: Azure File Share code samples using Java version 8 client libraries
titleSuffix: Azure Storage
description: View code samples that use the Azure File Share client library for Java version 8.
services: storage
author: pauljewellmsft
ms.service: azure-file-storage
ms.custom: devx-track-extended-java
ms.topic: how-to
ms.date: 04/26/2023
ms.author: pauljewell
---

# Azure File Share code samples using Java version 8 client libraries

This article shows code samples that use version 8 of the Azure File Share client library for Java.

[!INCLUDE [storage-v11-sdk-support-retirement](../../../includes/storage-v11-sdk-support-retirement.md)]

## Prerequisites

To use the Azure File Share client library, add the following `import` directives:

```java
// Include the following imports to use Azure Files APIs v11
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.file.*;
```

## Access an Azure file share

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#access-an-azure-file-share)

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

## Create a file share

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#create-a-file-share)

All files and directories in Azure Files are stored in a container called a share.

To obtain access to a share and its contents, create an Azure Files client. The following code example shows how to create a file share:

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

## Delete a file share

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#delete-a-file-share)

The following sample code deletes a file share.

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

## Create a directory

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#create-a-directory)

You can organize storage by putting files inside subdirectories instead of having all of them in the root directory.

The following code creates a subdirectory named **sampledir** under the root directory:

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

## Delete a directory

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#delete-a-directory)

The following code example shows how to delete a directory. You can't delete a directory that still contains files or subdirectories.

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

## Enumerate files and directories in an Azure file share

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#enumerate-files-and-directories-in-an-azure-file-share)

Get a list of files and directories by calling **listFilesAndDirectories** on a **CloudFileDirectory** reference. The method returns a list of **ListFileItem** objects on which you can iterate. 

The following code lists files and directories inside the root directory:

```java
//Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();

for ( ListFileItem fileItem : rootDir.listFilesAndDirectories() ) {
    System.out.println(fileItem.getUri());
}
```

## Upload a file

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#upload-a-file)

Get a reference to the directory where the file will be uploaded by calling the **getRootDirectoryReference** method on the share object.

```java
//Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();
```

Now that you have a reference to the root directory of the share, you can upload a file onto it using the following code:

```java
// Define the path to a local file.
final String filePath = "C:\\temp\\Readme.txt";

CloudFile cloudFile = rootDir.getFileReference("Readme.txt");
cloudFile.uploadFromFile(filePath);
```

## Download a file

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#download-a-file)

The following example downloads SampleFile.txt and displays its contents:

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

## Delete a file

Related article: [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md#delete-a-file)

The following code deletes a file named SampleFile.txt stored inside a directory named **sampledir**:

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
