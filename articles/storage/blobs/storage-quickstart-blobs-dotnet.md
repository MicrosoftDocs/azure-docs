---
title: Azure Quickstart - Transfer objects to/from Azure Blob storage using .NET | Microsoft Docs
description: Quickly learn to transfer objects to/from Azure Blob storage using .NET
services: storage
documentationcenter: storage
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: 
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 08/01/2017
ms.author: robinsh
---

# Transfer objects to/from Azure Blob storage using .NET

In this quickstart, you learn how to use C#.NET to upload, download, and list block blobs in a container in Azure Blob storage on Windows.

## Prerequisites

To complete this quickstart:

* Install [Visual Studio 2017](https://www.visualstudio.com/en-us/visual-studio-homepage-vs.aspx) with the following workload:
    - **Azure development**

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a storage account using the Azure portal

First, create a new general-purpose storage account to use for this quickstart. 

1. Go to the [Azure portal](https://portal.azure.com) and log in using your Azure account. 
2. On the Hub menu, select **New** > **Storage** > **Storage account - blob, file, table, queue**. 
3. Enter a name for your storage account. The name must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. It must also be unique.
4. Set `Deployment model` to **Resource manager**.
5. Set `Account kind` to **General purpose**.
6. Set `Performance` to **Standard**. 
7. Set `Replication` to **Locally Redundant storage (LRS)**.
8. Set `Storage service encryption` to **Disabled**.
9. Set `Secure transfer required` to **Disabled**.
10. Select your subscription. 
11. For `resource group`, create a new one and give it a unique name. 
12. Select the `Location` to use for your storage account.
13. Check **Pin to dashboard** and click **Create** to create your storage account. 

After your storage account is created, it is pinned to the dashboard. Click on it to open it. Under SETTINGS, click **Access keys**. Select a key and copy the CONNECTION STRING to the clipboard, then paste it into Notepad for later use.

## Download the sample application

The sample application used in this quickstart is a basic console application. 

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-dotnet-quickstart.git
```

This command clones the repository to your local git folder. To open the Visual Studio solution, look for the storage-blobs-dotnet-quickstart folder, open it, and double-click on storage-blobs-dotnet-quickstart.sln. 

## Configure your storage connection string

In the application, you must provide the connection string for your storage account. Open the `app.config` file from Solution Explorer in Visual Studio. Find the StorageConnectionString entry. For **value**, replace the entire value of the connection string with the one you saved from the Azure portal in Notepad. You should have something similar to the following when you're done.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5.2" />
    </startup>
  <appSettings>
    <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;
    AccountName=youraccountname;
    AccountKey=7NGE5jasdfdRzASDFNOMEx1u20W/thisisjustC/anexampleZK/Rt5pz2xNRrDckyv8EjB9P1WGF==" />
  </appSettings>
</configuration>
```

## Run the sample

This sample creates a test file in My Documents, uploads it to Blob storage, lists the blobs in the container, then downloads the file with a new name so you can compare the old and new files. 

Run the sample by pressing F5. It shows output in a console window that is similar to the following: 

```
Temp file = C:\Users\azureuser\Documents\QuickStart_cbd5f95c-6ab8-4cbf-b8d2-a58e85d7a8e8.txt
Uploading to Blob storage as blob 'QuickStart_cbd5f95c-6ab8-4cbf-b8d2-a58e85d7a8e8.txt'
List blobs in container.
https://mystorage.blob.core.windows.net/quickstartblobs/QuickStart_cbd5f95c-6ab8-4cbf-b8d2-a58e85d7a8e8.txt
Downloading blob to C:\Users\azureuser\Documents\QuickStart_cbd5f95c-6ab8-4cbf-b8d2-a58e85d7a8e8_DOWNLOADED.txt
```

When you press any key to continue, it deletes the storage container and the files. Before you continue, check MyDocuments for the two files -- you can open them and see they are identical. Copy the URL for the blob out of the console window and paste it into a browser to view the contents of the file in Blob storage.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the Program.cs file to look at the code. 

## Get references to the storage objects

The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other -- each is used by the next one in the list.

* Instantiate the **CloudStorageAccount** object pointing to the storage account. 

* Instantiate the **CloudBlobClient** object, which points to the Blob service in your storage account. 

* Instantiate the **CloudBlobContainer** object, which represents the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the **CloudBlobContainer**, you can instantiate the **CloudBlockBlob** object that points to the specific  blob in which you are interested, and perform an upload, download, copy, etc. operation.

In this section, you instantiate the objects, create a new container, and then set permissions on the container so the blobs are public and can be accessed with just a URL. The container is called **quickstartblobs**. 

This example uses CreateIfNotExists because we want to create a new container each time the sample is run. In a production environment where you use the same container throughout an application, it's better practice to only call CreateIfNotExists once, or to create the container ahead of time so you don't need to create it in the code.

```csharp
// Create a CloudStorageAccount instance pointing to your storage account.
CloudStorageAccount storageAccount =
    CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the CloudBlobClient that is used to call the Blob Service for that storage account.
CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

// Create a container called 'quickstartblobs'. 
CloudBlobContainer cloudBlobContainer = 
    cloudBlobClient.GetContainerReference("quickstartblobs");
await cloudBlobContainer.CreateIfNotExistsAsync();

// Set the permissions so the blobs are public. 
BlobContainerPermissions permissions = new BlobContainerPermissions();
permissions.PublicAccess = BlobContainerPublicAccessType.Blob;
await cloudBlobContainer.SetPermissionsAsync(permissions);
```

## Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that's what is used in this quickstart. 

To upload a file to a blob, get a reference to the blob in the target container. Once you have the blob reference, you can upload data to it by using [Cloud​Block​Blob.​Upload​From​FileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblockblob.uploadfromfileasync). This operation creates the blob if it doesn't already exist, or overwrites it if it does already exist.

The sample code creates a local file to be used for the upload and download, storing the file to be uploaded as **fileAndPath** and the name of the blob in **localFileName**. The following example uploads the file to your container called **quickstartblobs**.

```csharp
// Create a file in MyDocuments to test the upload and download.
string localPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
string localFileName = "QuickStart_" + Guid.NewGuid().ToString() + ".txt";
string fileAndPath = Path.Combine(localPath, localFileName);
File.WriteAllText(fileAndPath, "Hello, World!");

//Upload the file.
CloudBlockBlob blockBlob = container.GetBlockBlobReference(localFileName);
await blockBlob.UploadFromFileAsync(fileAndPath);
```

There are several upload methods that you can use with Blob storage. For example, if you have a memory stream, you can use the UploadFromStreamAsync method rather than the UploadFromFileAsync. 

Block blobs can be as large as 4.7 TB, and can be anything from Excel spreadsheets to large video files. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Most objects stored in Blob storage are block blobs.

## List the blobs in a container

Get a list of files in the container using [Cloud​Blob​Container.​List​BlobsSegmentedAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.listblobssegmentedasync). The following code retrieves the list of blobs, then loops through them, showing the URIs of the blobs found. You can copy the URI from the command window and paste it into a browser to view the file.

If you have 5,000 or fewer blobs in the container, all of the blob names are retrieved in one call to ListBlobsSegmentedAsync. If you have more than 5,000 blobs in the container, the service retrieves the list in sets of 5,000 until all of the blob names have been retrieved. So the first time this API is called, it returns the first 5,000 blob names and a continuation token. The second time, you provide the token, and the service retrieves the next set of blob names, and so on, until the continuation token is null, which indicates that all of the blob names have been retrieved. 

```csharp
// List the blobs in the container.
Console.WriteLine("List blobs in container.");
BlobContinuationToken blobContinuationToken = null;
do
{
    var results = await cloudBlobContainer.ListBlobsSegmentedAsync(null, blobContinuationToken);
    foreach(IListBlobItem item in results.Results)
    {
        Console.WriteLine(item.Uri);
    }
} while (blobContinuationToken != null);
```

## Download blobs

Download blobs to your local disk using [Cloud​Blob.​Download​To​FileAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtofileasync).

The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so you can see both files on local disk. 

```csharp
// Download blob. In most cases, you would have to retrieve the reference
//   to cloudBlockBlob here. However, we created that reference earlier, and 
//   haven't changed the blob we're interested in, so we can reuse it. 
// First, add a _DOWNLOADED before the .txt so you can see both files in MyDocuments.
string fileAndPath2 = fileAndPath.Replace(".txt", "_DOWNLOADED.txt");
Console.WriteLine("Downloading blob to {0}", fileAndPath2);
await cloudBlockBlob.DownloadToFileAsync(fileAndPath2, FileMode.Create);
```

## Clean up resources

If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using [Cloud​Blob​Container.​DeleteAsync](/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.deleteasync). Also delete the files created if they are no longer needed.

```csharp
await cloudBlobContainer.DeleteAsync();
File.Delete(fileAndPath);
File.Delete(fileAndPath2);    
```

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage using .NET. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-dotnet-how-to-use-blobs.md)

For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
