---
title: Develop for Azure File Storage with Java | Microsoft Docs
description: Learn how to develop Java applications and services that use Azure File Storage to store file data.
services: storage
documentationcenter: java
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: 3bfbfa7f-d378-4fb4-8df3-e0b6fcea5b27
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 05/27/2017
ms.author: robinsh
---

# Develop for Azure File Storage with Java
[!INCLUDE [storage-selector-file-include](../../includes/storage-selector-file-include.md)]

[!INCLUDE [storage-check-out-samples-java](../../includes/storage-check-out-samples-java.md)]

## About this tutorial
This tutorial will demonstrate the basics of using Java to develop applications or services that use Azure File Storage to store file data. In this tutorial, we will create a simple console application and show how to perform basic actions with Java and Azure File Storage:

* Create and delete Azure File shares
* Create and delete directories
* Enumerate files and directories in an Azure File share
* Upload, download, and delete a file

> [!Note]  
> Because Azure File Storage may be accessed over SMB, it is possible to write simple applications that access the Azure File share using the standard Java I/O classes. This article will describe how to write applications that use the Azure Storage Java SDK, which uses the [Azure File Storage REST API](https://docs.microsoft.com/rest/api/storageservices/fileservices/file-service-rest-api) to talk to Azure File Storage.

## Create a Java application
To build the samples, you will need the Java Development Kit (JDK) and the [Azure Storage SDK for Java][]. You should also have created an Azure storage account.

## Setup your application to use Azure File Storage
To use the Azure storage APIs, add the following statement to the top of the Java file where you intend to access the storage service from.

```java
// Include the following imports to use blob APIs.
import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.file.*;
```

## Setup an Azure storage connection string
To use Azure File Storage, you need to connect to your Azure storage account. The first step would be to configure a connection string which we'll use to connect to your storage account. Let's define a static variable to do that.

```java
// Configure the connection-string with your values
public static final String storageConnectionString =
    "DefaultEndpointsProtocol=http;" +
    "AccountName=your_storage_account_name;" +
    "AccountKey=your_storage_account_key";
```

> [!NOTE]
> Replace your_storage_account_name and your_storage_account_key with the actual values for your storage account.
> 
> 

## Connecting to an Azure storage account
To connect to your storage account, you need to use the **CloudStorageAccount** object, passing a connection string to its **parse** method.

```java
// Use the CloudStorageAccount object to connect to your storage account
try {
    CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);
} catch (InvalidKeyException invalidKey) {
    // Handle the exception
}
```

**CloudStorageAccount.parse** throws an InvalidKeyException so you'll need to put it inside a try/catch block.

## Create an Azure File share
All files and directories in Azure File Storage reside in a container called a **Share**. Your storage account can have as much shares as your account capacity allows. To obtain access to a share and its contents, you need to use a Azure File Storage client.

```java
// Create the Azure File Storage client.
CloudFileClient fileClient = storageAccount.createCloudFileClient();
```

Using the Azure File Storage client, you can then obtain a reference to a share.

```java
// Get a reference to the file share
CloudFileShare share = fileClient.getShareReference("sampleshare");
```

To actually create the share, use the **createIfNotExists** method of the CloudFileShare object.

```java
if (share.createIfNotExists()) {
    System.out.println("New share created");
}
```

At this point, **share** holds a reference to a share named **sampleshare**.

## Delete an Azure File share
Deleting a share is done by calling the **deleteIfExists** method on a CloudFileShare object. Here's sample code that does that.

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
You can also organize storage by putting files inside sub-directories instead of having all of them in the root directory. Azure File Storage allows you to create as much directories as your account will allow. The code below will create a sub-directory named **sampledir** under the root directory.

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
Deleting a directory is a fairly simple task, although it should be noted that you cannot delete a directory that still contains files or other directories.

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

## Enumerate files and directories in an Azure File share
Obtaining a list of files and directories within a share is easily done by calling **listFilesAndDirectories** on a CloudFileDirectory reference. The method returns a list of ListFileItem objects which you can iterate on. As an example, the following code will list files and directories inside the root directory.

```java
//Get a reference to the root directory for the share.
CloudFileDirectory rootDir = share.getRootDirectoryReference();

for ( ListFileItem fileItem : rootDir.listFilesAndDirectories() ) {
    System.out.println(fileItem.getUri());
}
```

## Upload a file
An Azure File share contains at the very least, a root directory where files can reside. In this section, you'll learn how to upload a file from local storage onto the root directory of a share.

The first step in uploading a file is to obtain a reference to the directory where it should reside. You do this by calling the **getRootDirectoryReference** method of the share object.

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

## Download a file
One of the more frequent operations you will perform against Azure File Storage is to download files. In the following example, the code downloads SampleFile.txt and displays its contents.

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
Another common Azure File Storage operation is file deletion. The following code deletes a file named SampleFile.txt stored inside a directory named **sampledir**.

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

## Next steps
If you would like to learn more about other Azure storage APIs, follow these links.

* [Java Developer Center](http://azure.microsoft.com/develop/java/)
* [Azure Storage SDK for Java](https://github.com/azure/azure-storage-java)
* [Azure Storage SDK for Android](https://github.com/azure/azure-storage-android)
* [Azure Storage Client SDK Reference](http://dl.windowsazure.com/storage/javadoc/)
* [Azure Storage Services REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx)
* [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
* [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md)