---
title: Create and manage directories in Azure Storage by using .NET
description: Use the Azure Storage Client Library for .NET to create and manage directories in Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.date: 06/26/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Create and manage directories in Azure Storage by using .NET

This article shows you how to use the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).NET to manage directories in storage accounts that have a hierarchical namespace. 

## Connect to the storage account 

First, parse the connection string by calling the [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method. 

Then, create an object that represents Blob storage in your storage account by calling the [CloudStorageAccount.CreateCloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient?view=azure-dotnet) method.

```cs
public bool GetBlobClient(ref CloudBlobClient cloudBlobClient, string storageConnectionString)
{
    if (CloudStorageAccount.TryParse
        (storageConnectionString, out CloudStorageAccount storageAccount))
        {
            cloudBlobClient = storageAccount.CreateCloudBlobClient();

            return true;
        }
        else
        {
            return false;
        }
    }
}
```

## Create a directory

Create a directory reference by calling the **GetDirectoryReference** method.

Create a directory by using the **CreateAsync** method of a **CloudBlobDirectory** object. 

This example adds a directory named `my-directory` to a container and then adds a sub-directory named `my-subdirectory` to the directory named `my-directory`. 

```cs
public async Task CreateDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.CreateAsync();

            await cloudBlobDirectory.GetDirectoryReference("my-subdirectory").CreateAsync();
        }
    }
}
```

## Rename a directory

Rename a directory by calling the **MoveAsync** method of a **CloudBlobDirectory** object. Pass the Uri of the desired directory location as a parameter. 

This example renames that sub-directory to `my-directory-renamed`.

```cs
public async Task RenameDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory-2/my-directory");

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.MoveAsync(new Uri(cloudBlobContainer.Uri.AbsoluteUri + 
                "/my-directory-2/my-directory-renamed"));

        }
    }

}
```

## Move a directory

You can also use the **MoveAsync** method of a **CloudBlobDirectory** object to move a directory. Pass the Uri of the desired directory location as a parameter to this method. 

This example moves a directory named `my-directory` to a sub-directory of another directory named `my-directory-2`. 

```cs
public async Task MoveDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        // Get source directory
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            // Get destination directory
            CloudBlobDirectory cloudBlobDestinationDirectory =
                cloudBlobContainer.GetDirectoryReference("my-directory-2");

            if (cloudBlobDestinationDirectory != null)
            {
                await cloudBlobDirectory.MoveAsync(new Uri(cloudBlobDestinationDirectory.Uri.AbsoluteUri + "my-directory/"));
            }

        }
    }

}
```

## Delete a directory

Delete a directory by calling the **Delete** method of a **CloudBlobDirectory** object.

This example deletes a directory named `my-directory` from the `my-directory-2` directory.  

```cs
public void DeleteDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory-2/my-directory");

        if (cloudBlobDirectory != null)
        {
            cloudBlobDirectory.Delete();
        }
    }

}
```
## Upload a file to a directory

First, create a blob reference in the target directory by calling the **GetBlockBlobReference** method of a **CloudBlobDirectory** object. This returns a **CloudBlockBlob** object. Upload a file by calling the **UploadFromFileAsync** method of a **CloudBlockBlob** object.

This example uploads a file to a directory named `my-directory`.    

```cs
public async Task UploadFileToDirectory(CloudBlobClient cloudBlobClient,
    string sourceFilePath, string containerName, string blobName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            CloudBlockBlob cloudBlockBlob =
                cloudBlobDirectory.GetBlockBlobReference(blobName);

            await cloudBlockBlob.UploadFromFileAsync(sourceFilePath);
        }
    }
}
```

## Download a file from a directory

First, create a blob reference in the source directory by calling the **GetBlockBlobReference** method of a **CloudBlobDirectory** object. This returns a **CloudBlockBlob** object. Download that blob by calling the **DownloadToFileAsync** method of a **CloudBlockBlob** object.

This example downloads a file from a directory named `my-directory`.

```cs
public async Task DownloadFileFromDirectory(CloudBlobClient cloudBlobClient,
    string containerName, string blobName, string destinationFile)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            CloudBlockBlob cloudBlockBlob =
                    cloudBlobDirectory.GetBlockBlobReference(blobName);

            await cloudBlockBlob.DownloadToFileAsync(destinationFile, FileMode.Create);
        }


    }
}
```

## List the contents of a directory

To list containers in your storage account, call one of the following methods of a **CloudBlobDirectory** object:

- **ListBlobsSegmented**
- **ListBlobsSegmentedAsync**

The overloads for these methods provide additional options for managing how the contents of a directory are returned by the listing operation. To learn more about these listing options, see [Understand container listing options](storage-blob-containers-list.md#understand-container-listing-options).

This example asynchronously lists the contents of a directory by calling the **ListBlobsSegmentedAsync** method of a a **CloudBlobDirectory** object. This example uses the continuation token to get the next segment of result.

```cs
public async Task ListFilesInDirectory(CloudBlobClient cloudBlobClient, string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {

        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            BlobContinuationToken blobContinuationToken = null;
            do
            {
                var resultSegment = await cloudBlobDirectory.ListBlobsSegmentedAsync(blobContinuationToken);

                // Get the value of the continuation token returned by the listing call.
                blobContinuationToken = resultSegment.ContinuationToken;
                foreach (IListBlobItem item in resultSegment.Results)
                {
                    Console.WriteLine(item.Uri);
                }
            } while (blobContinuationToken != null);
            // Loop while the continuation token is not null.
        }

    }

}
```

[!INCLUDE [storage-blob-dotnet-resources](../../../includes/storage-blob-dotnet-resources.md)]