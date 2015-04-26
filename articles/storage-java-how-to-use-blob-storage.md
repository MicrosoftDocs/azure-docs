<properties 
	pageTitle="How to use Blob storage from Java | Microsoft Azure" 
	description="Learn how to use the Azure blob service to upload, download, list, and delete blob content. Samples written in Java." 
	services="storage" 
	documentationCenter="java" 
	authors="rmcmurray" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="03/11/2015" 
	ms.author="robmcm"/>

# How to use Blob storage from Java

[AZURE.INCLUDE [storage-selector-blob-include](../includes/storage-selector-blob-include.md)]

## Overview

This guide will show you how to perform common scenarios using the Microsoft Azure Blob storage service. The samples are written in Java and use the [Azure Storage SDK for Java][]. The scenarios covered include **uploading**, **listing**, **downloading**, and **deleting** blobs. For more information on blobs, see the [Next Steps](#NextSteps) section.

> [AZURE.NOTE] An SDK is available for developers who are using Azure Storage on Android devices. For more information, see the [Azure Storage SDK for Android][]. 

[AZURE.INCLUDE [storage-blob-concepts-include](../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../includes/storage-create-account-include.md)]

## Create a Java application

In this guide, you will use storage features which can be run within a Java application locally, or in code running within a web role or worker role in Azure.

To do so, you will need to install the Java Development Kit (JDK) and create an Azure storage account in your Azure subscription. Once you have done so, you will need to verify that your development system meets the minimum requirements and dependencies which are listed in the [Azure Storage SDK for Java][] repository on GitHub. If your system meets those requirements, you can follow the instructions for downloading and installing the Azure Storage Libraries for Java on your system from that repository. Once you have completed those tasks, you will be able to create a Java application which uses the examples in this article.

## Configure your application to access Blob Storage

Add the following import statements to the top of the Java file where you want to use the Azure storage APIs to access blobs:

    // Include the following imports to use blob APIs.
    import com.microsoft.azure.storage.*;
    import com.microsoft.azure.storage.blob.*;

## Setup an Azure storage connection string

An Azure storage client uses a storage connection string to store
endpoints and credentials for accessing data management services. When running in a client application, you must provide the storage connection string in the following format, using the name of your storage account and the Primary access key for the storage account listed in the Management Portal for the *AccountName* and *AccountKey* values. This example shows how you can declare a static field to hold the connection string:

    // Define the connection-string with your values
    public static final String storageConnectionString = 
        "DefaultEndpointsProtocol=http;" + 
        "AccountName=your_storage_account;" + 
        "AccountKey=your_storage_account_key";

In an application running within a role in Microsoft Azure, this string can be stored in the service configuration file, *ServiceConfiguration.cscfg*, and can be accessed with a call to the **RoleEnvironment.getConfigurationSettings** method. Here's an example of getting the connection string from a **Setting** element named *StorageConnectionString* in the service configuration file:

    // Retrieve storage account from connection-string.
    String storageConnectionString = 
        RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");

The following samples assume that you have used one of these two methods to get the storage connection string.

## How to: Create a container

A CloudBlobClient object lets you get reference objects for containers and blobs. The following code creates a **CloudBlobClient** object. (Note: There are additional ways to create **CloudStorageAccount** objects; for more information, see **CloudStorageAccount** in the [Azure Storage Client SDK Reference].)

All blobs reside in a container. Use the **CloudBlobClient** object to get a reference to the container you want to use. You can create the container if it doesn't exist with the **createIfNotExists** method, which will otherwise return the existing container. By default, the new container is private, so you must specify your storage access key (as you did above) to download blobs from this container.

	try
    {
        // Retrieve storage account from connection-string.
    	CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

    	// Create the blob client.
	   CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

	   // Get a reference to a container.
	   // The container name must be lower case
	   CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

	   // Create the container if it does not exist.
    	container.createIfNotExists();
    }
    catch (Exception e)
    {
        // Output the stack trace.
        e.printStackTrace();
    }

### Optional: Configure a container for public access

A container's permissions are configured for private access by default, but you can easily configure a container's permissions to allow public, read-only access for all users on the Internet:

    // Create a permissions object.
    BlobContainerPermissions containerPermissions = new BlobContainerPermissions();

    // Include public access in the permissions object.
    containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);

    // Set the permissions on the container.
    container.uploadPermissions(containerPermissions);

## How to: Upload a blob into a container

To upload a file to a blob, get a container reference and use it to get a blob reference. Once you have a blob reference, you can upload any stream by calling upload on the blob reference. This operation will create the blob if it doesn't exist, or overwrite it if it does. This code sample shows this, and assumes that the container has already been created.

	try
    {
        // Retrieve storage account from connection-string.
    	CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

    	// Create the blob client.
    	CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

	   // Retrieve reference to a previously created container.
    	CloudBlobContainer container = blobClient.getContainerReference("mycontainer");
			
        // Define the path to a local file.
        final String filePath = "C:\\myimages\\myimage.jpg";

    	// Create or overwrite the "myimage.jpg" blob with contents from a local file.
    	CloudBlockBlob blob = container.getBlockBlobReference("myimage.jpg");
    	File source = new File(filePath);
    	blob.upload(new FileInputStream(source), source.length());
    }
    catch (Exception e)
    {
        // Output the stack trace.
        e.printStackTrace();
    }

## How to: List the blobs in a container

To list the blobs in a container, first get a container reference like you did to upload a blob. You can use the container's **listBlobs** method with a **for** loop. The following code outputs the Uri of each blob in a container to the console.

	try
    {
        // Retrieve storage account from connection-string.
    	CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

    	// Create the blob client.
    	CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

    	// Retrieve reference to a previously created container.
    	CloudBlobContainer container = blobClient.getContainerReference("mycontainer");
			
    	// Loop over blobs within the container and output the URI to each of them.
    	for (ListBlobItem blobItem : container.listBlobs()) {
	       System.out.println(blobItem.getUri());
	   }
    }
    catch (Exception e)
    {
        // Output the stack trace.
        e.printStackTrace();
    }

The blob service has the concept of directories within containers, as well. This is so that you can organize your blobs in a more folder-like structure.

For example, you could have a container named "photos", in which you might upload blobs named "rootphoto1", "2010/photo1", "2010/photo2", and "2011/photo1". This would create the virtual directories "2010" and "2011" within the "photos" container. When you call **listBlobs** on the "photos" container, the collection returned will contain **CloudBlobDirectory** and **CloudBlob** objects representing the directories and blobs contained at the top level. In this case, directories "2010" and "2011", as well as photo "rootphoto1" would be returned. You can use the **instanceof** operator to distinguish these objects.

Optionally, you can pass in parameters to the **listBlobs** method with
the **useFlatBlobListing** parameter set to true. This will result in
every blob being returned, regardless of directory. For more
information, see **CloudBlobContainer.listBlobs** in the [Azure Storage Client SDK Reference].

## How to: Download a blob

To download blobs, follow the same steps as you did for uploading a blob in order to get a blob reference. In the uploading example, you called upload on the blob object. In the following example, call download to transfer the blob contents to a stream object such as a **FileOutputStream** that you can use to persist the blob to a local file.

    try
    {
    	// Retrieve storage account from connection-string.
	   CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

	   // Create the blob client.
	   CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

	   // Retrieve reference to a previously created container.
	   CloudBlobContainer container = blobClient.getContainerReference("mycontainer");
			
	   // Loop through each blob item in the container.
	   for (ListBlobItem blobItem : container.listBlobs()) {
	       // If the item is a blob, not a virtual directory.
	       if (blobItem instanceof CloudBlob) {
	           // Download the item and save it to a file with the same name.
    	        CloudBlob blob = (CloudBlob) blobItem;
    	        blob.download(new FileOutputStream("C:\\mydownloads\\" + blob.getName()));
    	    }
    	}
    }
    catch (Exception e)
    {
        // Output the stack trace.
        e.printStackTrace();
    }

## How to: Delete a blob

To delete a blob, get a blob reference, and call **deleteIfExists**.

    try
    {
	   // Retrieve storage account from connection-string.
	   CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

	   // Create the blob client.
	   CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

	   // Retrieve reference to a previously created container.
	   CloudBlobContainer container = blobClient.getContainerReference("mycontainer");
			
	   // Retrieve reference to a blob named "myimage.jpg".
	   CloudBlockBlob blob = container.getBlockBlobReference("myimage.jpg");

	   // Delete the blob.
	   blob.deleteIfExists();
    }
    catch (Exception e)
    {
        // Output the stack trace.
        e.printStackTrace();
    }

## How to: Delete a blob container

Finally, to delete a blob container, get a blob container reference, and
call **deleteIfExists**.

    try
    {
	   // Retrieve storage account from connection-string.
	   CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);

	   // Create the blob client.
	   CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

	   // Retrieve reference to a previously created container.
	   CloudBlobContainer container = blobClient.getContainerReference("mycontainer");
			
	   // Delete the blob container.
	   container.deleteIfExists();
    }
    catch (Exception e)
    {
        // Output the stack trace.
        e.printStackTrace();
    }

## Next steps

Now that you've learned the basics of blob storage, follow these links to learn about more complex storage tasks.

- [Azure Storage SDK for Java]
- [Azure Storage Client SDK Reference]
- [Azure Storage REST API]
- [Azure Storage Team Blog]

[Azure SDK for Java]: http://azure.microsoft.com/develop/java/
[Azure Storage SDK for Java]: https://github.com/azure/azure-storage-java
[Azure Storage SDK for Android]: https://github.com/azure/azure-storage-android
[Azure Storage Client SDK Reference]: http://dl.windowsazure.com/storage/javadoc/
[Azure Storage REST API]: http://msdn.microsoft.com/library/azure/gg433040.aspx
[Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
