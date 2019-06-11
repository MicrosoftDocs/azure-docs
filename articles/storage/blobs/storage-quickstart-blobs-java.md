---
title: How to create a blob in Azure Storage using the client library for Java v7 | Microsoft Docs
description: Create a storage account and a container in object (Blob) storage. Then use the Azure Storage client library for Java v7 to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: mhopkins-msft

ms.custom: mvc
ms.service: storage
ms.topic: conceptual
ms.date: 02/04/2019
ms.author: mhopkins
ms.reviewer: seguler
---

# How to upload, download, and list blobs using the client library for Java v7

In this how-to guide, you learn how to use the client library for Java v7 to upload, download, and list block blobs in a container in Azure Blob storage.

> [!TIP]
> The latest version of the Azure Storage client library for Java is v10. Microsoft recommends that you use the latest version of the client library when possible. To get started using v10, see [Quickstart: Upload, download, and list blobs by using the Java Storage SDK V10](storage-quickstart-blobs-java-v10.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Also create an Azure storage account in the [Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). For help creating the account, see [Create a storage account](../common/storage-quickstart-create-account.md).

Make sure you have the following prerequisites:

* Install an IDE that has Maven integration.

* Alternatively, install and configure Maven to work from the command line.

This guide uses [Eclipse](https://www.eclipse.org/downloads/) with the "Eclipse IDE for Java Developers" configuration.

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-java-quickstart) is a basic console application.  

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-java-quickstart.git
```

This command clones the repository to your local git folder. To open the project, launch Eclipse and close the Welcome screen. Select **File** then **Open Projects from File System**. Make sure **Detect and configure project natures** is checked. Select **Directory** then navigate to where you stored the cloned repository. Inside the cloned repository, select the **blobAzureApp** folder. Make sure the **blobAzureApp** project appears as an Eclipse project, then select **Finish**.

Once the project finishes importing, open **AzureApp.java** (located in **blobQuickstart.blobAzureApp** inside of **src/main/java**), and replace the `accountname` and `accountkey` inside of the `storageConnectionString` string. Then run the application. Specific instructions for completing these tasks are described in the following sections.

[!INCLUDE [storage-copy-connection-string-portal](../../../includes/storage-copy-connection-string-portal.md)]    

## Configure your storage connection string
    
In the application, you must provide the connection string for your storage account. Open the **AzureApp.Java** file. Find the `storageConnectionString` variable and paste the connection string value that you copied in the previous section. Your `storageConnectionString` variable should look similar to the following code example:

```java
public static final String storageConnectionString =
"DefaultEndpointsProtocol=https;" +
"AccountName=<account-name>;" +
"AccountKey=<account-key>";
```

## Run the sample

This sample application creates a test file in your default directory (*C:\Users\<user>\AppData\Local\Temp*, for Windows users), uploads it to Blob storage, lists the blobs in the container, then downloads the file with a new name so you can compare the old and new files. 

Run the sample using Maven at the command line. Open a shell and navigate to **blobAzureApp** inside of your cloned directory. Then enter `mvn compile exec:java`. 

The following example shows the output if you were to run the application on Windows.

```
Azure Blob storage quick start sample
Creating container: quickstartcontainer
Creating a sample file at: C:\Users\<user>\AppData\Local\Temp\sampleFile514658495642546986.txt
Uploading the sample file 
URI of blob is: https://myexamplesacct.blob.core.windows.net/quickstartcontainer/sampleFile514658495642546986.txt
The program has completed successfully.
Press the 'Enter' key while in the console to delete the sample files, example container, and exit the application.

Deleting the container
Deleting the source, and downloaded files
```

Before you continue, check your default directory (*C:\Users\<user>\AppData\Local\Temp*, for Windows users) for the sample file. Copy the URL for the blob out of the console window and paste it into a browser to view the contents of the file in Blob storage. If you compare the sample file in your directory with the contents stored in Blob storage, you will see that they are the same. 

  >[!NOTE]
  >You can also use a tool such as the [Azure Storage Explorer](https://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information.

After you've verified the files, press the **Enter** key to finish the demo and delete the test files. Now that you know what the sample does, open the **AzureApp.java** file to look at the code. 

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Get references to the storage objects

The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other -- each is used by the next one in the list.

* Create an instance of the [CloudStorageAccount](/java/api/com.microsoft.azure.management.storage.storageaccount) object pointing to the storage account.

    The **CloudStorageAccount** object is a representation of your storage account and it allows you to set and access storage account properties programmatically. Using the **CloudStorageAccount** object you can create an instance of the **CloudBlobClient**, which is necessary to access the blob service.

* Create an instance of the **CloudBlobClient** object, which points to the [Blob service](/java/api/com.microsoft.azure.storage.blob._cloud_blob_client) in your storage account.

    The **CloudBlobClient** provides you a point of access to the blob service, allowing you to set and access Blob storage properties programmatically. Using the **CloudBlobClient** you can create an instance of the **CloudBlobContainer** object, which is necessary to create containers.

* Create an instance of the [CloudBlobContainer](/java/api/com.microsoft.azure.storage.blob._cloud_blob_container) object, which represents the container you are accessing. Use containers to organize your blobs like you use folders on your computer to organize your files.    

    Once you have the **CloudBlobContainer**, you can create an instance of the [CloudBlockBlob](/java/api/com.microsoft.azure.storage.blob._cloud_block_blob) object that points to the specific blob you’re interested in, and perform an upload, download, copy, or other operation.

> [!IMPORTANT]
> Container names must be lowercase. For more information about containers, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

### Create a container

In this section, you create an instance of the objects, create a new container, and then set permissions on the container so the blobs are public and can be accessed with just a URL. The container is called **quickstartcontainer**. 

This example uses [CreateIfNotExists](/java/api/com.microsoft.azure.storage.blob._cloud_blob_container.createifnotexists) because we want to create a new container each time the sample is run. In a production environment, where you use the same container throughout an application, it's better practice to only call **CreateIfNotExists** once. Alternatively, you can create the container ahead of time so you don't need to create it in the code.

```java
// Parse the connection string and create a blob client to interact with Blob storage
storageAccount = CloudStorageAccount.parse(storageConnectionString);
blobClient = storageAccount.createCloudBlobClient();
container = blobClient.getContainerReference("quickstartcontainer");

// Create the container if it does not exist with public access.
System.out.println("Creating container: " + container.getName());
container.createIfNotExists(BlobContainerPublicAccessType.CONTAINER, new BlobRequestOptions(), new OperationContext());
```

### Upload blobs to the container

To upload a file to a block blob, get a reference to the blob in the target container. Once you have the blob reference, you can upload data to it by using [Cloud​Block​Blob.​Upload​](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_block_blob.upload). This operation creates the blob if it doesn't already exist, or overwrites the blob if it already exists.

The sample code creates a local file to be used for the upload and download, storing the file to be uploaded as **source** and the name of the blob in **blob**. The following example uploads the file to your container called **quickstartcontainer**.

```java
//Creating a sample file
sourceFile = File.createTempFile("sampleFile", ".txt");
System.out.println("Creating a sample file at: " + sourceFile.toString());
Writer output = new BufferedWriter(new FileWriter(sourceFile));
output.write("Hello Azure!");
output.close();

//Getting a blob reference
CloudBlockBlob blob = container.getBlockBlobReference(sourceFile.getName());

//Creating blob and uploading file to it
System.out.println("Uploading the sample file ");
blob.uploadFromFile(sourceFile.getAbsolutePath());
```

There are several `upload` methods including [upload](/java/api/com.microsoft.azure.storage.blob._cloud_block_blob.upload), [uploadBlock](/java/api/com.microsoft.azure.storage.blob._cloud_block_blob.uploadblock), [uploadFullBlob](/java/api/com.microsoft.azure.storage.blob._cloud_block_blob.uploadfullblob), [uploadStandardBlobTier](/java/api/com.microsoft.azure.storage.blob._cloud_block_blob.uploadstandardblobtier), and [uploadText](/java/api/com.microsoft.azure.storage.blob._cloud_block_blob.uploadtext) which you can use with Blob storage. For example, if you have a string, you can use the `UploadText` method rather than the `Upload` method. 

Block blobs can be any type of text or binary file. Page blobs are primarily used for the VHD files that back IaaS VMs. Use append blobs for logging, such as when you want to write to a file and then keep adding more information. Most objects stored in Blob storage are block blobs.

### List the blobs in a container

You can get a list of files in the container using [Cloud​Blob​Container.​List​Blobs](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob_container.listblobs). The following code retrieves the list of blobs, then loops through them, showing the URIs of the blobs found. You can copy the URI from the command window and paste it into a browser to view the file.

```java
//Listing contents of container
for (ListBlobItem blobItem : container.listBlobs()) {
    System.out.println("URI of blob is: " + blobItem.getUri());
}
```

### Download blobs

Download blobs to your local disk using [Cloud​Blob.​Download​To​File](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob.downloadtofile).

The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so you can see both files on local disk. 

```java
// Download blob. In most cases, you would have to retrieve the reference
// to cloudBlockBlob here. However, we created that reference earlier, and 
// haven't changed the blob we're interested in, so we can reuse it. 
// Here we are creating a new file to download to. Alternatively you can also pass in the path as a string into downloadToFile method: blob.downloadToFile("/path/to/new/file").
downloadedFile = new File(sourceFile.getParentFile(), "downloadedFile.txt");
blob.downloadToFile(downloadedFile.getAbsolutePath());
```

### Clean up resources

If you no longer need the blobs that you have uploaded, you can delete the entire container using [Cloud​Blob​Container.​DeleteIfExists](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob_container.deleteifexists). This method also deletes the files in the container.

```java
try {
if(container != null)
    container.deleteIfExists();
} catch (StorageException ex) {
System.out.println(String.format("Service error. Http code: %d and error code: %s", ex.getHttpStatusCode(), ex.getErrorCode()));
}

System.out.println("Deleting the source, and downloaded files");

if(downloadedFile != null)
downloadedFile.deleteOnExit();
        
if(sourceFile != null)
sourceFile.deleteOnExit();
```

## Next steps

In this article, you learned how to transfer files between a local disk and Azure Blob storage using Java. To learn more about working with Java, continue to our GitHub source code repository.

> [!div class="nextstepaction"]
> [Microsoft Azure Storage SDK v10 for Java](https://github.com/azure/azure-storage-java) 
> [Java API Reference](https://docs.microsoft.com/java/azure/)
> [Code Samples for Java](../common/storage-samples-java.md)
