---
title: Azure Quickstart - Upload, download, and list blobs in Azure Storage using .NET | Microsoft Docs
description: In this quickstart, you create a storage account and a container. Then you use the storage client library for .NET to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: tamram
manager: jeconnoc

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 02/22/2018
ms.author: tamram
---

# Quickstart: Upload, download, and list blobs using .NET

In this quickstart, you learn how to use the .NET client library for Azure Storage to upload, download, and list block blobs in a container.

## Prerequisites

To complete this quickstart:

* Install .NET core 2.0 for [Linux](/dotnet/core/linux-prerequisites?tabs=netcore2x) or [Windows](/dotnet/core/windows-prerequisites?tabs=netcore2x)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application

The sample application used in this quickstart is a basic console application. 

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-dotnet-quickstart.git
```

This command clones the repository to your local git folder. To open the Visual Studio solution, look for the storage-blobs-dotnet-quickstart folder, open it, and double-click on storage-blobs-dotnet-quickstart.sln. 

## Configure your storage connection string

In the application, you must provide the connection string for your storage account. It is recommended to store this connection string within an environment variable on the local machine running the application. Follow one of the examples below depending on your Operating System to create the environment variable.  Replace \<yourconnectionstring\> with your actual connection string.

### Linux

```bash
export storageconnectionstring=<yourconnectionstring>
```
### Windows

```cmd
setx storageconnectionstring "<yourconnectionstring>"
```

## Run the sample

This sample creates a test file in My Documents, uploads it to Blob storage, lists the blobs in the container, then downloads the file with a new name so you can compare the old and new files. 

Navigate to your application directory and run the application with the `dotnet run` command.

```
dotnet run
```

The output shown is similar to the following example:

```
Azure Blob storage quick start sample
Temp file = /home/admin/QuickStart_b73f2550-bf20-4b3b-92ec-b9b31c56b374.txt
Uploading to Blob storage as blob 'QuickStart_b73f2550-bf20-4b3b-92ec-b9b31c56b374.txt'
List blobs in container.
https://mystorageaccount.blob.core.windows.net/quickstartblobs/QuickStart_b73f2550-bf20-4b3b-92ec-b9b31c56b374.txt
Downloading blob to /home/admin/QuickStart_b73f2550-bf20-4b3b-92ec-b9b31c56b374_DOWNLOADED.txt
The program has completed successfully.
Press the 'Enter' key while in the console to delete the sample files, example container, and exit the application.
```

When you press any key to continue, it deletes the storage container and the files. Before you continue, check MyDocuments for the two files. You can open them and see they are identical. Copy the URL for the blob out of the console window and paste it into a browser to view the contents of the file in Blob storage.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the Program.cs file to look at the code. 

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Get references to the storage objects

The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other, each is used by the next one in the list.

* Create an instance of the [CloudStorageAccount](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount?view=azure-dotnet) object pointing to the storage account.

* Create an instance of the [CloudBlobClient](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient?view=azure-dotnet) object, which points to the Blob service in your storage account.

* Create an instance of the [CloudBlobContainer](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer?view=azure-dotnet) object, which represents the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the [CloudBlobContainer](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer?view=azure-dotnet), you can create an instance of the [CloudBlockBlob](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblockblob?view=azure-dotnet) object that points to the specific blob in which you are interested, and perform an upload, download, copy, etc. operation.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you create an instance of the objects, create a new container, and then set permissions on the container so the blobs are public and can be accessed with just a URL. The container is called **quickstartblobs**.

This example uses [CreateIfNotExists](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.createifnotexists?view=azure-dotnet) because we want to create a new container each time the sample is run. In a production environment where you use the same container throughout an application, it's better practice to only call **CreateIfNotExists** once. Alternatively, to create the container ahead of time so you don't need to create it in the code.

```csharp
// Load the connection string for use with the application. The storage connection string is stored
// in an environment variable on the machine running the application called storageconnectionstring.
// If the environment variable is created after the application is launched in a console or with Visual
// Studio, the shell needs to be closed and reloaded to take the environment variable into account.
string storageConnectionString = Environment.GetEnvironmentVariable("storageconnectionstring");
if (storageConnectionString == null)
{
    Console.WriteLine(
        "A connection string has not been defined in the system environment variables. " +
        "Add a environment variable name 'storageconnectionstring' with the actual storage " +
        "connection string as a value.");
}
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

// Create the CloudBlobClient that is used to call the Blob Service for that storage account.
CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

// Create a container called 'quickstartblobs'. 
cloudBlobContainer = cloudBlobClient.GetContainerReference("quickstartblobs" + Guid.NewGuid().ToString());
await cloudBlobContainer.CreateIfNotExistsAsync();

// Set the permissions so the blobs are public. 
BlobContainerPermissions permissions = new BlobContainerPermissions
{
    PublicAccess = BlobContainerPublicAccessType.Blob
};
await cloudBlobContainer.SetPermissionsAsync(permissions);
```

### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that's what is used in this quickstart.

To upload a file to a blob, get a reference to the blob in the target container. Once you have the blob reference, you can upload data to it by using [Cloud​Block​Blob.​Upload​From​FileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblockblob.uploadfromfileasync). This operation creates the blob if it doesn't already exist, or overwrites it if it does already exist.

The sample code creates a local file to be used for the upload and download, storing the file to be uploaded as **fileAndPath** and the name of the blob in **localFileName**. The following example uploads the file to your container called **quickstartblobs**.

```csharp
// Create a file in MyDocuments to test the upload and download.
string localPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
string localFileName = "QuickStart_" + Guid.NewGuid().ToString() + ".txt";
sourceFile = Path.Combine(localPath, localFileName);
// Write text to the file.
File.WriteAllText(sourceFile, "Hello, World!");

Console.WriteLine("Temp file = {0}", sourceFile);
Console.WriteLine("Uploading to Blob storage as blob '{0}'", localFileName);

// Get a reference to the location where the blob is going to go, then upload the file.
// Upload the file you created, use localFileName for the blob name.
CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(localFileName);
await cloudBlockBlob.UploadFromFileAsync(sourceFile);
```

There are several upload methods that you can use with Blob storage. For example, if you have a memory stream, you can use the UploadFromStreamAsync method rather than the UploadFromFileAsync.

Block blobs can be any type of text or binary file. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Most objects stored in Blob storage are block blobs.

### List the blobs in a container

You can get a list of files in the container using [Cloud​Blob​Container.​List​BlobsSegmentedAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.listblobssegmentedasync). The following code retrieves the list of blobs, then loops through them, showing the URIs of the blobs found. You can copy the URI from the command window and paste it into a browser to view the file.

If you have 5,000 or fewer blobs in the container, all of the blob names are retrieved in one call to ListBlobsSegmentedAsync. If you have more than 5,000 blobs in the container, the service retrieves the list in sets of 5,000 until all of the blob names have been retrieved. So the first time this API is called, it returns the first 5,000 blob names and a continuation token. The second time, you provide the token, and the service retrieves the next set of blob names, and so on, until the continuation token is null, which indicates that all of the blob names have been retrieved.

```csharp
// List the blobs in the container.
Console.WriteLine("List blobs in container.");
BlobContinuationToken blobContinuationToken = null;
do
{
    var results = await cloudBlobContainer.ListBlobsSegmentedAsync(null, blobContinuationToken);
    blobContinuationToken = results.ContinuationToken;
    foreach (IListBlobItem item in results.Results)
    {
        Console.WriteLine(item.Uri);
    }
    blobContinuationToken = results.ContinuationToken;
} while (blobContinuationToken != null);

```

### Download blobs

Download blobs to your local disk using [Cloud​Blob.​Download​To​FileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtofileasync).

The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so you can see both files on local disk.

```csharp
// Download blob. In most cases, you would have to retrieve the reference
//   to cloudBlockBlob here. However, we created that reference earlier, and 
//   haven't changed the blob we're interested in, so we can reuse it. 
// First, add a _DOWNLOADED before the .txt so you can see both files in MyDocuments.
destinationFile = sourceFile.Replace(".txt", "_DOWNLOADED.txt");
Console.WriteLine("Downloading blob to {0}", destinationFile);
await cloudBlockBlob.DownloadToFileAsync(destinationFile, FileMode.Create);  
```

### Clean up resources

If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using [Cloud​Blob​Container.​DeleteAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.deleteasync). Also delete the files created if they are no longer needed.

```csharp
Console.WriteLine("Press the 'Enter' key to delete the sample files, example container, and exit the application.");
Console.ReadLine();
// Clean up resources. This includes the container and the two temp files.
Console.WriteLine("Deleting the container");
if (cloudBlobContainer != null)
{
    await cloudBlobContainer.DeleteIfExistsAsync();
}
Console.WriteLine("Deleting the source, and downloaded files");
File.Delete(sourceFile);
File.Delete(destinationFile);
```

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage using .NET. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-dotnet-how-to-use-blobs.md)

For additional Azure Storage code samples that you can download and run, see the list of [Azure Storage samples using .NET](../common/storage-samples-dotnet.md).

For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
