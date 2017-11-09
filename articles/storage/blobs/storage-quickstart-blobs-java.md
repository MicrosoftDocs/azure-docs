---
title: Azure Quickstart - Transfer objects to/from Azure Blob storage using Java | Microsoft Docs
description: Quickly learn to transfer objects to/from Azure Blob storage using Java
author: roygara
manager: timlt
services: storage

ms.service: storage
ms.topic: quickstart
ms.date: 11/01/2017
ms.author: v-rogara
ms.custom: mvc
---

# Transfer objects to/from Azure Blob storage using Java

In this quickstart, you learn how to use Java to upload, download, and list block blobs in a container in Azure Blob storage.

## Prerequisites

To complete this quickstart:

* Install an IDE that has Maven integration

* Alternatively, install and configure Maven to work from the command line

This tutorial uses [Eclipse](http://www.eclipse.org/downloads/) with the "Eclipse IDE for Java Developers" configuration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-java-quickstart) used in this quickstart is a basic console application. 

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-java-quickstart.git
```

This command clones the repository to your local git folder. To open the project, launch Eclipse and close the welcome screen. Select **File** then **Open Projects from File System...**. Make sure **Detect and configure project natures** is checked. Select **Directory** then navigate to where you stored the cloned repository, inside it select the **javaBlobsQuickstart** folder. Make sure the **javaBlobsQuickstarts** project appears as an Eclipse project, then select **Finish**.

Once the project finishes importing, open **AzureApp.java** (located in **blobQuickstart.blobAzureApp** inside of **src/main/java**), and replace the `accountname` and `accountkey` inside of the `storageConnectionString` string. Then run the application.
     

## Configure your storage connection string
    
In the application, you must provide the connection string for your storage account. Open the **AzureApp.Java** file. Find the `storageConnectionString` variable. Replace the `AccountName` and `AccountKey` values in the connection string with the values you saved from the Azure portal. Your `storageConnectionString` should look similar to the following:

```java
    public static final String storageConnectionString ="DefaultEndpointsProtocol=https;" +
     "AccountName=<Namehere>;" +
    "AccountKey=<Keyhere>";
```

## Run the sample

This sample creates a test file in your default directory (My Documents, for windows users), uploads it to Blob storage, lists the blobs in the container, then downloads the file with a new name so you can compare the old and new files. 

Run the sample by pressing **Ctrl+F11** in Eclipse.

If you wish to run the sample using Maven at the commandline, open a shell and navigate to **blobAzureApp** inside of your cloned directory. Then enter `mvn compile exec:java`.

The following is an example of output if you were to run the application on Windows.

```
Location of file: C:\Users\<user>\Documents\results.txt
File has been written
URI of blob is: http://myexamplesacct.blob.core.windows.net/quickstartblobs/results.txt
The program has completed successfully.
Press the 'Enter' key while in the console to delete the sample files, example container, and exit the application.
```

 Before you continue, check your default directory (My Documents, for windows users) for the two files. You can open them and see they are identical. Copy the URL for the blob out of the console window and paste it into a browser to view the contents of the file in Blob storage. When you press the enter key, it deletes the storage container and the files.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 

After you've verified the files, press the enter key to finish the demo and delete the test files. Now that you know what the sample does, open the **AzureApp.java** file to look at the code. 

## Code Walkthrough

The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other -- each is used by the next one in the list.

* Create an instance of the **CloudStorageAccount** object pointing to the [storage account](/java/api/com.microsoft.azure.management.storage._storage_account). 

* Create an instance of the **CloudBlobClient** object, which points to the [Blob service](/java/api/com.microsoft.azure.storage.blob._cloud_blob_client) in your storage account. 

* Create an instance of the **CloudBlobContainer** object, which represents the [container](/java/api/com.microsoft.azure.storage.blob._cloud_blob_container) you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the **CloudBlobContainer**, you can create an instance of the **CloudBlockBlob** object that points to the specific [blob](/java/api/com.microsoft.azure.storage.blob._cloud_block_blob) in which you are interested, and perform an upload, download, copy, etc. operation.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you create an instance of the objects, create a new container, and then set permissions on the container so the blobs are public and can be accessed with just a URL. The container is called **quickstartblobs**. 

This example uses **CreateIfNotExists** because we want to create a new container each time the sample is run. In a production environment where you use the same container throughout an application, it's better practice to only call **CreateIfNotExists** once. Alternatively, you can create the container ahead of time so you don't need to create it in the code.

```java
CloudStorageAccount storageAccount = CloudStorageAccount.parse(storageConnectionString);
        
CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

// Get a reference to a container.
// The container name must be lower case
CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

// Create the container if it does not exist.
container.createIfNotExists();

// Create a permissions object.
BlobContainerPermissions containerPermissions = new BlobContainerPermissions();

// Include public access in the permissions object.
containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);

// Set the permissions on the container.
container.uploadPermissions(containerPermissions);
```

## Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that's what is used in this quickstart. 

To upload a file to a blob, get a reference to the blob in the target container. Once you have the blob reference, you can upload data to it by using [Cloud​Block​Blob.​Upload​](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_block_blob.upload#com_microsoft_azure_storage_blob__cloud_block_blob_upload_final_InputStream_final_long). This operation creates the blob if it doesn't already exist, or overwrites it if it does already exist.

The sample code creates a local file to be used for the upload and download. storing the file to be uploaded as **source** and the name of the blob in **blob**. The following example uploads the file to your container called **quickstartblobs**.

```java
//Getting the path to user's myDocuments folder
String myDocs = FileSystemView.getFileSystemView().getDefaultDirectory().getPath();

//Creating a file in the myDocuments folder
File source = new File(myDocs + File.separator + "results.txt");
try( Writer output = new BufferedWriter(new FileWriter(source)))
{
    System.out.println("Location of file: " + source.toString());

    output.write("Hello Azure!");
    output.close();
    
    System.out.println("File has been written");
}
catch(IOException x) 
{
    System.err.println(x);
}

//Getting blob reference
CloudBlockBlob blob = container.getBlockBlobReference("results.txt");

//Creating a FileInputStream as it is necessary for the upload
FileInputStream myFile = new FileInputStream(source);

//Creating blob and uploading file to it
blob.upload( myFile, source.length());

//Closing FileInputStream
myFile.close();
```

There are several upload methods that you can use with Blob storage. For example, if you have a memory stream, you can use the UploadFromStreamAsync method rather than the UploadFromFileAsync. 

Block blobs can be any type of text or binary file. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Most objects stored in Blob storage are block blobs.

## List the blobs in a container

You can get a list of files in the container using [Cloud​Blob​Container.​List​Blobs](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob_container.listblobs#com_microsoft_azure_storage_blob__cloud_blob_container_listBlobs). The following code retrieves the list of blobs, then loops through them, showing the URIs of the blobs found. You can copy the URI from the command window and paste it into a browser to view the file.

```java
//Listing contents of container
for (ListBlobItem blobItem : container.listBlobs()) {
    System.out.println("URI of blob is: " + blobItem.getUri());
}
```

## Download blobs

Download blobs to your local disk using [Cloud​Blob.​Download​To​File](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob.downloadtofile#com_microsoft_azure_storage_blob__cloud_blob_downloadToFile_final_String).

The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so you can see both files on local disk. 

```java
// Download blob. In most cases, you would have to retrieve the reference
// to cloudBlockBlob here. However, we created that reference earlier, and 
// haven't changed the blob we're interested in, so we can reuse it. 
// First, add a _DOWNLOADED before the .txt so you can see both files in your default directory.
blob.downloadToFile(myDocs + File.separator + "results_DOWNLOADED.txt");
```

## Clean up resources

If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using [Cloud​Blob​Container.​DeleteIfExists](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob_container.deleteifexists#com_microsoft_azure_storage_blob__cloud_blob_container_deleteIfExists). This also deletes the files in the container.

```java
//Deletes container if it exists then deletes files created locally
container.deleteIfExists();
downloadedFile.deleteOnExit();
sourceFile.deleteOnExit();
```

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage using Java. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-java-how-to-use-blob-storage.md)

For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md).