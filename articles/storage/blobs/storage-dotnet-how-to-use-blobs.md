---
title: How to use Blob storage from .NET
description: Use the Azure Storage Client Library for .NET to interact with Blob storage
services: storage
author: normesta
ms.service: storage
ms.date: 04/14/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# How to use Blob storage from .NET

Intro text here.

## Install the Azure Storage Client Library for .NET

Put guidance here.

## Add library references to your code file

Put these things in your file.

```cs
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
```

## Get the connection string of your storage account

Use same guidance as is presented in the related .NET quickstart.

## Connect to the storage account

Some guidance goes here.

```cs
public bool GetBlob(ref CloudBlobClient cloudBlobClient)
{
    string storageConnectionString =
        Environment.GetEnvironmentVariable("storageconnectionstring");

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
```

## Create a container and set permissions

Some guidance goes here.

```cs
public async Task CreateContainerAsync
    (CloudBlobClient cloudBlobClient, string containerName)
{
    // Create container and give that container the name that you pass into this method.
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    await cloudBlobContainer.CreateAsync();

    // Set the permissions so the blobs are public.
    BlobContainerPermissions permissions = new BlobContainerPermissions
    {
        PublicAccess = BlobContainerPublicAccessType.Blob
    };

    await cloudBlobContainer.SetPermissionsAsync(permissions);
}
```

## Upload blobs to the container

Some guidance goes here.

```cs
public async Task UploadBlob(CloudBlobClient cloudBlobClient,
    string sourceFile, string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    CloudBlockBlob cloudBlockBlob =
        cloudBlobContainer.GetBlockBlobReference(sourceFile);

    await cloudBlockBlob.UploadFromFileAsync(sourceFile);
}
```

## List blobs in the container

Some guidance goes here.

```cs
public async Task ListBlobs(CloudBlobClient cloudBlobClient, string containerName)
{
    CloudBlobContainer cloudBlobContainer = 
        cloudBlobClient.GetContainerReference(containerName);

    BlobContinuationToken blobContinuationToken = null;
    do
    {
        var resultSegment = await cloudBlobContainer.ListBlobsSegmentedAsync
            (null, blobContinuationToken);

        // Get the value of the continuation token returned by the listing call.
        blobContinuationToken = resultSegment.ContinuationToken;
        foreach (IListBlobItem item in resultSegment.Results)
        {
            Console.WriteLine(item.Uri);
        }
    } while (blobContinuationToken != null);
    // Loop while the continuation token is not null.
}
```

## Download blobs from the container

Some guidance goes here.

```cs
public async Task DownloadBlobs(CloudBlobClient cloudBlobClient, 
    string containerName, string sourceFile, string destinationFile)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    CloudBlockBlob cloudBlockBlob =
        cloudBlobContainer.GetBlockBlobReference(sourceFile);

    await cloudBlockBlob.DownloadToFileAsync(destinationFile, FileMode.Create);
}
```

## Delete blobs from the container

Some guidance goes here.

```cs
public async Task DeleteBlob(CloudBlobClient cloudBlobClient,
    string sourceFile, string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    CloudBlockBlob cloudBlockBlob =
        cloudBlobContainer.GetBlockBlobReference(sourceFile);

    await cloudBlockBlob.DeleteAsync();
}
```

## Add directories to the container

This is only for accounts that have a hierarchical namespace.

```cs

```

## Add files to directories in the container

This is only for accounts that have a hierarchical namespace.

```cs

```

## Set Access Control Lists (ACL) permission on a directory

This is only for accounts that have a hierarchical namespace.

```cs

```

## Set Access Control Lists (ACL) permission on a file in a directory

This is only for accounts that have a hierarchical namespace.

```cs

```

## Something here for append data and flush methods (scenario TBD)

This is only for accounts that have a hierarchical namespace.

```cs

```

## Next steps

Now that you've learned the basics of blob storage, follow these links to learn more about Azure Storage.  

Put next steps here.