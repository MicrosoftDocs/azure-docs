---
title: Manage expiration of Azure Storage blobs in Azure CDN | Microsoft Docs
description: Learn about the options for controlling time-to-live for blobs in Azure CDN caching.
services: cdn
documentationcenter: ''
author: zhangmanling
manager: erikre
editor: ''

ms.assetid: ad4801e9-d09a-49bf-b35c-efdc4e6034e8
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 01/23/2017
ms.author: mazha

---
# Manage expiration of Azure Storage blobs in Azure CDN
> [!div class="op_single_selector"]
> * [Azure Web Apps/Cloud Services, ASP.NET, or IIS](cdn-manage-expiration-of-cloud-service-content.md)
> * [Azure Storage blob service](cdn-manage-expiration-of-blob-content.md)
> 
> 

The [blob service](../storage/storage-introduction.md#blob-storage) in [Azure Storage](../storage/storage-introduction.md) is one of several Azure-based origins integrated with Azure CDN.  Any publicly accessible blob content can be cached in Azure CDN until its time-to-live (TTL) elapses.  The TTL is determined by the [*Cache-Control* header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9) in the HTTP response from Azure Storage.

> [!TIP]
> You may choose to set no TTL on a blob.  In this case, Azure CDN automatically applies a default TTL of seven days.
> 
> For more information about how Azure CDN works to speed up access to blobs and other files, see the [Azure CDN Overview](cdn-overview.md).
> 
> For more details on the Azure Storage blob service, see [Blob Service Concepts](https://msdn.microsoft.com/library/dd179376.aspx). 
> 
> 

This tutorial demonstrates several ways that you can set the TTL on a blob in Azure Storage.  

## Azure PowerShell
[Azure PowerShell](/powershell/azure/overview) is one of the quickest, most powerful ways to administer your Azure services.  Use the `Get-AzureStorageBlob` cmdlet to get a reference to the blob, then set the `.ICloudBlob.Properties.CacheControl` property. 

```powershell
# Create a storage context
$context = New-AzureStorageContext -StorageAccountName "<storage account name>" -StorageAccountKey "<storage account key>"

# Get a reference to the blob
$blob = Get-AzureStorageBlob -Context $context -Container "<container name>" -Blob "<blob name>"

# Set the CacheControl property to expire in 1 hour (3600 seconds)
$blob.ICloudBlob.Properties.CacheControl = "public, max-age=3600"

# Send the update to the cloud
$blob.ICloudBlob.SetProperties()
```

> [!TIP]
> You can also use PowerShell to [manage your CDN profiles and endpoints](cdn-manage-powershell.md).
> 
> 

## Azure Storage Client Library for .NET
To set a blob's TTL using .NET, use the [Azure Storage Client Library for .NET](../storage/storage-dotnet-how-to-use-blobs.md) to set the [CloudBlob.Properties.CacheControl](https://msdn.microsoft.com/library/microsoft.windowsazure.storage.blob.blobproperties.cachecontrol.aspx) property.

```csharp
class Program
{
    const string connectionString = "<storage connection string>";
    static void Main()
    {
        // Retrieve storage account information from connection string
        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);

        // Create a blob client for interacting with the blob service.
        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

        // Create a reference to the container
        CloudBlobContainer container = blobClient.GetContainerReference("<container name>");

        // Create a reference to the blob
        CloudBlob blob = container.GetBlobReference("<blob name>");

        // Set the CacheControl property to expire in 1 hour (3600 seconds)
        blob.Properties.CacheControl = "public, max-age=3600";

        // Update the blob's properties in the cloud
        blob.SetProperties();
    }
}
```

> [!TIP]
> There are many more .NET code samples available in the [Azure Blob Storage Samples for .NET](https://azure.microsoft.com/documentation/samples/storage-blob-dotnet-getting-started/).
> 
> 

## Other methods
* [Azure Command-Line Interface](../cli-install-nodejs.md)
  
    When uploading the blob, set the *cacheControl* property using the `-p` switch.  This example sets the TTL to one hour (3600 seconds).
  
    ```text
    azure storage blob upload -c <connectionstring> -p cacheControl="public, max-age=3600" .\test.txt myContainer test.txt
    ```
* [Azure Storage Services REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx)
  
    Explicitly set the *x-ms-blob-cache-control* property on a [Put Blob](https://msdn.microsoft.com/en-us/library/azure/dd179451.aspx), [Put Block List](https://msdn.microsoft.com/en-us/library/azure/dd179467.aspx), or [Set Blob Properties](https://msdn.microsoft.com/library/azure/ee691966.aspx) request.
* Third-party storage management tools
  
    Some third-party Azure Storage management tools allow you to set the *CacheControl* property on blobs. 

## Testing the *Cache-Control* header
You can easily verify the TTL of your blobs.  Using your browser's [developer tools](https://developer.microsoft.com/microsoft-edge/platform/documentation/f12-devtools-guide/), test that your blob is including the *Cache-Control* response header.  You can also use a tool like **wget**, [Postman](https://www.getpostman.com/), or [Fiddler](http://www.telerik.com/fiddler) to examine the response headers.

## Next Steps
* [Read about the *Cache-Control* header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
* [Learn how to manage expiration of Cloud Service content in Azure CDN](cdn-manage-expiration-of-cloud-service-content.md)

