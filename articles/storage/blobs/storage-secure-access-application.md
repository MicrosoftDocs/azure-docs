---
title: Secure access to an application's data in the cloud with Azure Storage | Microsoft Docs 
description: Use SAS tokens, encryption and HTTPS to secure your application's data in the cloud.
services: storage
author: tamram

ms.service: storage
ms.topic: tutorial
ms.date: 05/30/2018
ms.author: tamram
ms.reviewer: cbrooks
ms.custom: mvc
---

# Secure access to an application's data in the cloud

This tutorial is part three of a series. You learn how to secure access to the storage account. 

In part three of the series, you learn how to:

> [!div class="checklist"]
> * Use SAS tokens to access thumbnail images
> * Turn on server-side encryption
> * Enable HTTPS-only transport

[Azure blob storage](../common/storage-introduction.md#blob-storage) provides a robust service to store files for applications. This tutorial extends [the previous topic][previous-tutorial] to show how to secure access to your storage account from a web application. When you're finished the images are encrypted and the web app uses secure SAS tokens to access the thumbnail images.

## Prerequisites

To complete this tutorial you must have completed the previous Storage tutorial: [Automate resizing uploaded images using Event Grid][previous-tutorial]. 

## Set container public access

In this part of the tutorial series, SAS tokens are used for accessing the thumbnails. In this step, you set the public access of the _thumbnails_ container to `off`.

```azurecli-interactive 
blobStorageAccount=<blob_storage_account>

blobStorageAccountKey=$(az storage account keys list -g myResourceGroup \
-n $blobStorageAccount --query [0].value --output tsv) 

az storage container set-permission \ --account-name $blobStorageAccount \ --account-key $blobStorageAccountKey \ --name thumbnails  \
--public-access off
``` 

## Configure SAS tokens for thumbnails

In part one of this tutorial series, the web application was showing images from a public container. In this part of the series, you use [Shared Access Signature (SAS)](../common/storage-dotnet-shared-access-signature-part-1.md#what-is-a-shared-access-signature) tokens to retrieve the thumbnail images. SAS tokens allow you to provide restricted access to a container or blob based on IP, protocol, time interval, or rights allowed.

In this example, the source code repository uses the `sasTokens` branch, which has an updated code sample. Delete the existing GitHub deployment with the [az webapp deployment source delete](/cli/azure/webapp/deployment/source). Next, configure GitHub deployment to the web app with the [az webapp deployment source config](/cli/azure/webapp/deployment/source) command.  

In the following command, `<web-app>` is the name of your web app.  

```azurecli-interactive 
az webapp deployment source delete --name <web-app> --resource-group myResourceGroup

az webapp deployment source config --name <web_app> \
--resource-group myResourceGroup --branch sasTokens --manual-integration \
--repo-url https://github.com/Azure-Samples/storage-blob-upload-from-webapp
``` 

The `sasTokens` branch of the repository updates the `StorageHelper.cs` file. It replaces the `GetThumbNailUrls` task with the code example below. The updated task retrieves the thumbnail URLs by setting a [SharedAccessBlobPolicy](/dotnet/api/microsoft.azure.storage.blob.sharedaccessblobpolicy) to specify the start time, expiry time, and permissions for  the SAS token. Once deployed the web app now retrieves the thumbnails with a URL using a SAS token. The updated task is shown in the following example:
    
```csharp
public static async Task<List<string>> GetThumbNailUrls(AzureStorageConfig _storageConfig)
{
    List<string> thumbnailUrls = new List<string>();

    // Create storagecredentials object by reading the values from the configuration (appsettings.json)
    StorageCredentials storageCredentials = new StorageCredentials(_storageConfig.AccountName, _storageConfig.AccountKey);

    // Create cloudstorage account by passing the storagecredentials
    CloudStorageAccount storageAccount = new CloudStorageAccount(storageCredentials, true);

    // Create blob client
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Get reference to the container
    CloudBlobContainer container = blobClient.GetContainerReference(_storageConfig.ThumbnailContainer);

    BlobContinuationToken continuationToken = null;

    BlobResultSegment resultSegment = null;

    //Call ListBlobsSegmentedAsync and enumerate the result segment returned, while the continuation token is non-null.
    //When the continuation token is null, the last page has been returned and execution can exit the loop.
    do
    {
        //This overload allows control of the page size. You can return all remaining results by passing null for the maxResults parameter,
        //or by calling a different overload.
        resultSegment = await container.ListBlobsSegmentedAsync("", true, BlobListingDetails.All, 10, continuationToken, null, null);

        foreach (var blobItem in resultSegment.Results)
        {
            CloudBlockBlob blob = blobItem as CloudBlockBlob;
            //Set the expiry time and permissions for the blob.
            //In this case, the start time is specified as a few minutes in the past, to mitigate clock skew.
            //The shared access signature will be valid immediately.
            SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy();

            sasConstraints.SharedAccessStartTime = DateTimeOffset.UtcNow.AddMinutes(-5);

            sasConstraints.SharedAccessExpiryTime = DateTimeOffset.UtcNow.AddHours(24);

            sasConstraints.Permissions = SharedAccessBlobPermissions.Read;

            //Generate the shared access signature on the blob, setting the constraints directly on the signature.
            string sasBlobToken = blob.GetSharedAccessSignature(sasConstraints);

            //Return the URI string for the container, including the SAS token.
            thumbnailUrls.Add(blob.Uri + sasBlobToken);

        }

        //Get the continuation token.
        continuationToken = resultSegment.ContinuationToken;
    }

    while (continuationToken != null);

    return await Task.FromResult(thumbnailUrls);
}
```

The following classes, properties, and methods are used in the preceding task:

|Class  |Properties| Methods  |
|---------|---------|---------|
|[StorageCredentials](/dotnet/api/microsoft.azure.cosmos.table.storagecredentials)    |         |
|[CloudStorageAccount](/dotnet/api/microsoft.azure.cosmos.table.cloudstorageaccount)     | |[CreateCloudBlobClient](/dotnet/api/microsoft.azure.storage.blob.blobaccountextensions.createcloudblobclient)        |
|[CloudBlobClient](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient)     | |[GetContainerReference](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.getcontainerreference)         |
|[CloudBlobContainer](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer)     | |[SetPermissionsAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.setpermissionsasync) <br> [ListBlobsSegmentedAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.listblobssegmentedasync)       |
|[BlobContinuationToken](/dotnet/api/microsoft.azure.storage.blob.blobcontinuationtoken)     |         |
|[BlobResultSegment](/dotnet/api/microsoft.azure.storage.blob.blobresultsegment)    | [Results](/dotnet/api/microsoft.azure.storage.blob.blobresultsegment.results)         |
|[CloudBlockBlob](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob)    |         | [GetSharedAccessSignature](/dotnet/api/microsoft.azure.storage.blob.cloudblob.getsharedaccesssignature)
|[SharedAccessBlobPolicy](/dotnet/api/microsoft.azure.storage.blob.sharedaccessblobpolicy)     | [SharedAccessStartTime](/dotnet/api/microsoft.azure.storage.blob.sharedaccessblobpolicy.sharedaccessstarttime)<br>[SharedAccessExpiryTime](/dotnet/api/microsoft.azure.storage.blob.sharedaccessblobpolicy.sharedaccessexpirytime)<br>[Permissions](/dotnet/api/microsoft.azure.storage.blob.sharedaccessblobpolicy.permissions) |        |

## Server-side encryption

[Azure Storage Service Encryption (SSE)](../common/storage-service-encryption.md) helps you protect and safeguard your data. SSE encrypts data at rest, handling encryption, decryption, and key management. All data is encrypted using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available.

SSE automatically encrypts data in all performance tiers (Standard and Premium), all deployment models (Azure Resource Manager and Classic), and all of the Azure Storage services (Blob, Queue, Table, and File). 

## Enable HTTPS only

In order to ensure that requests for data to and from a storage account are secure, you can limit requests to HTTPS only. Update the storage account required protocol by using the [az storage account update](/cli/azure/storage/account) command.

```azurecli-interactive
az storage account update --resource-group myresourcegroup --name <storage-account-name> --https-only true
```

Test the connection using `curl` using the `HTTP` protocol.

```azurecli-interactive
curl http://<storage-account-name>.blob.core.windows.net/<container>/<blob-name> -I
```

Now that secure transfer is required, you receive the following message:

```
HTTP/1.1 400 The account being accessed does not support http.
```

## Next steps

In part three of the series, you learned how to secure access to the storage account, such as how to:

> [!div class="checklist"]
> * Use SAS tokens to access thumbnail images
> * Turn on server-side encryption
> * Enable HTTPS-only transport

Advance to part four of the series to learn how to monitor and troubleshoot a cloud storage application.

> [!div class="nextstepaction"]
> [Monitor and troubleshoot application cloud application storage](storage-monitor-troubleshoot-storage-application.md)

[previous-tutorial]: ../../event-grid/resize-images-on-storage-blob-upload-event.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json
