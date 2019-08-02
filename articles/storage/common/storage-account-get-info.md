---
title: Get storage account type and SKU name with .NET - Azure Storage
description: Learn how to get Azure Storage account type and SKU name using the .NET client library.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/01/2019
ms.service: storage
ms.subservice: common
ms.topic: article
---

# Get storage account type and SKU name with .NET

This article shows how to get Azure Storage account type and SKU using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).
To get the storage account type and SKU name associated with a blob, call the [GetAccountProperties](/dotnet/api/microsoft.azure.storage.blob.cloudblob.getaccountproperties?view=azure-dotnet) or [GetAccountPropertiesAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.getaccountpropertiesasync?view=azure-dotnet) method.

Account information is available on service versions beginning with version 2018-03-28.

## About account type and SKU

**Account type**: Valid account types include Storage, BlobStorage, StorageV2, FileStorage, BlockBlobStorage. [Azure storage account overview](storage-account-overview.md) has more information, including descriptions of different storage account types.

**SKU name**: Valid SKU names include Premium_LRS, Premium_ZRS, Standard_GRS, Standard_GZRS, Standard_LRS, Standard_RAGRS, Standard_RAGZRS, and Standard_ZRS. SKU names are case-sensitive and are string fields in the [SkuName class](/dotnet/api/microsoft.azure.management.storage.models.skuname?view=azure-dotnet).

## Retrieve account information

The following code example gets the read-only account properties.

```csharp
private static async Task GetAccountInfoAsync(CloudBlob blob)
{
    try
    {
        // Get the blob's storage account properties.
        AccountProperties acctProps = await blob.GetAccountPropertiesAsync();

        // Display the properties.
        Console.WriteLine("Account properties");
        Console.WriteLine("  AccountKind: {0}", acctProps.AccountKind);
        Console.WriteLine("      SkuName: {0}", acctProps.SkuName);
    }
    catch (StorageException e)
    {
        Console.WriteLine("HTTP error code {0}: {1}",
                            e.RequestInformation.HttpStatusCode,
                            e.RequestInformation.ErrorCode);
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }
}
```

[!INCLUDE [storage-blob-dotnet-resources](../../../includes/storage-blob-dotnet-resources.md)]

## See also

- [Get Account Information operation](/rest/api/storageservices/get-account-information)
