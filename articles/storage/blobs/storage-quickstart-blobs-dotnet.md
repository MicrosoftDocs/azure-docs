---
title: Azure Quickstart - Upload, download, and list blobs in Azure Storage using .NET | Microsoft Docs
description: In this quickstart, you create a storage account and a container. Then you use the storage client library for .NET to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: tamram
manager: jeconnoc

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 03/01/2018
ms.author: tamram
---

# Quickstart: Upload, download, and list blobs using .NET

In this quickstart, you learn how to use the .NET client library for Azure Storage to upload, download, and list block blobs in a container.

## Resources for developing .NET applications for Azure Storage

See these additional resources for .NET development with Azure Storage:

- See the [Storage .NET API reference](https://docs.microsoft.com/dotnet/api/overview/azure/storage) for more information about the client library.
- Download the NuGet package for the latest version of the [Storage .NET client library](https://www.nuget.org/packages/WindowsAzure.Storage/). 
- View the [Storage .NET client library source code](https://github.com/Azure/azure-storage-net) on GitHub.
- Explore [Blob storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=dotnet&term=blob) written using the Storage .NET client library.

## Prerequisites

To complete this quickstart:

* Install .NET core 2.0 for [Linux](/dotnet/core/linux-prerequisites?tabs=netcore2x) or [Windows](/dotnet/core/windows-prerequisites?tabs=netcore2x)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-quickstart-tutorial-create-account-portal](../../../includes/storage-quickstart-tutorial-create-account-portal.md)]

## Download the sample application

The sample application used in this quickstart is a basic console application. You can explore the sample application on [GitHub](https://github.com/Azure-Samples/storage-blobs-dotnet-quickstart).

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-dotnet-quickstart.git
```

This command clones the repository to your local git folder. To open the Visual Studio solution, look for the storage-blobs-dotnet-quickstart folder, open it, and double-click on storage-blobs-dotnet-quickstart.sln. 

## Configure your storage connection string

To run the application, you must provide the connection string for your storage account. You can store this connection string within an environment variable on the local machine running the application. Create the environment variable using one of the following commands, depending on your operating system. Replace `<yourconnectionstring>` with the actual connection string.

### Linux

```bash
export storageconnectionstring=<yourconnectionstring>
```
### Windows

```cmd
setx storageconnectionstring "<yourconnectionstring>"
```

## Run the sample

This sample creates a test file in your local **MyDocuments** folder and uploads it to Blob storage. The sample then lists the blobs in the container and downloads the file with a new name so that you can compare the old and new files. 

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

When you press the **Enter** key, the application deletes the storage container and the files. Before you delete them, check your **MyDocuments** folder for the two files. You can open them and observe that they are identical. Copy the blob's URL from the console window and paste it into a browser to view the contents of the blob.

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the Program.cs file to look at the code. 

## Understand the sample code

Next, explore the sample code so that you can understand how it works.

### Get references to the storage objects

First, create references to the objects used to access and manage Blob storage. These objects build on each other, so that each is used by the next one in the list.

* Create an instance of the [CloudStorageAccount](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount?view=azure-dotnet) object pointing to the storage account.

* Create an instance of the [CloudBlobClient](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient?view=azure-dotnet) object, which points to the Blob service in your storage account.

* Create an instance of the [CloudBlobContainer](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer?view=azure-dotnet) object, which represents the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the [CloudBlobContainer](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer?view=azure-dotnet) object, you can create an instance of a [CloudBlockBlob](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblockblob?view=azure-dotnet) object in the container.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

This example uses the [CreateAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.createasync) method to create a new container each time the sample is run. A GUID value is appended to the container name to ensure that it is unique. In a production environment, it's often preferable to use the [CreateIfNotExists](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.createifnotexists) method to create a container only if it does not already exist.

```csharp
// Load the connection string for use with the application. The storage connection string is stored
// in an environment variable on the machine running the application called storageconnectionstring.
// If the environment variable is created after the application is launched in a console or with Visual
// Studio, the shell needs to be closed and reloaded to take the environment variable into account.
string storageConnectionString = Environment.GetEnvironmentVariable("storageconnectionstring", EnvironmentVariableTarget.User);
if (storageConnectionString == null)
{
    Console.WriteLine(
        "A connection string has not been defined in the system environment variables. " +
        "Add a environment variable name 'storageconnectionstring' with the actual storage " +
        "connection string as a value.");
}
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);

// Create the CloudBlobClient that represents the Blob storage endpoint for the storage account.
CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

// Create a container called 'quickstartblobs' and append a GUID value to it to make the name unique. 
cloudBlobContainer = cloudBlobClient.GetContainerReference("quickstartblobs" + Guid.NewGuid().ToString());
await cloudBlobContainer.CreateAsync();

// Set the permissions so the blobs are public. 
BlobContainerPermissions permissions = new BlobContainerPermissions
{
    PublicAccess = BlobContainerPublicAccessType.Blob
};
await cloudBlobContainer.SetPermissionsAsync(permissions);
```

### Upload blobs to the container

This quickstart shows how to work with block blobs. Block blobs are ideal for storing text or binary data, like documents and media files.

To upload a file and create a blob, get a reference to the blob in the target container. Once you have the blob reference, you can upload data to it with the [Cloud​Block​Blob.​Upload​From​FileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblockblob.uploadfromfileasync) method. This method creates the blob if it doesn't already exist, and overwrites it if it does.

The sample code creates a local file to upload, then uploads the file to the container you created in the previous section.

```csharp
// Create a file in your local MyDocuments folder to upload to a blob.
string localPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
string localFileName = "QuickStart_" + Guid.NewGuid().ToString() + ".txt";
sourceFile = Path.Combine(localPath, localFileName);
// Write text to the file.
File.WriteAllText(sourceFile, "Hello, World!");

Console.WriteLine("Temp file = {0}", sourceFile);
Console.WriteLine("Uploading to Blob storage as blob '{0}'", localFileName);

// Get a reference to the blob address, then upload the file to the blob.
// Use the value of localFileName for the blob name.
CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(localFileName);
await cloudBlockBlob.UploadFromFileAsync(sourceFile);
```

### List the blobs in a container

You can list the blobs in a container using the [Cloud​Blob​Container.​List​BlobsSegmentedAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.listblobssegmentedasync) method. If you have 5000 or fewer blobs in the container, all of the blob names are retrieved in one call to **ListBlobsSegmentedAsync**. If you have more than 5000 blobs in the container, Blob storage retrieves the list in sets of 5000 until all of the blob have been retrieved. To retrieve the next set of 5000 blobs, you provide in the continuation token returned by the previous call, and so on, until the continuation token is null. A null continuation token indicates that all of the blobs have been retrieved.

The following code retrieves the list of blobs, then loops through them, writing out the URI for each blob. 

```csharp
// List the blobs in the container.
Console.WriteLine("List blobs in container.");
BlobContinuationToken blobContinuationToken = null;
do
{
    var results = await cloudBlobContainer.ListBlobsSegmentedAsync(null, blobContinuationToken);
    // Get the value of the continuation token returned by the listing call.
    blobContinuationToken = results.ContinuationToken;
    foreach (IListBlobItem item in results.Results)
    {
        Console.WriteLine(item.Uri);
    }
    blobContinuationToken = results.ContinuationToken;
} while (blobContinuationToken != null); // Loop while the continuation token is not null. 

```

### Download blobs

You can download blobs to your local file system using [Cloud​Blob.​Download​To​FileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtofileasync).

The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so that you can see both files on local file system.

```csharp
// Download the blob to a local file, using the reference created earlier. 
// Append the string "_DOWNLOADED" before the .txt extension so that you can see both files in MyDocuments.
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
