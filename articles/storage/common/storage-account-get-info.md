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

The Get Account Information operation returns the sku name and account kind for the specified account.
The Get Account Information operation is available on service versions beginning with version 2018-03-28.

This article shows how to get Azure Storage account type and SKU using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).

## About account type and SKU

- **Account type**: Valid account types include Storage, BlobStorage, StorageV2, FileStorage, BlockBlobStorage

- **SKU name**: Valid SKU names include Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS, Standard_GZRS, and Standard_RAGZRS.

## Notes

- SKU type names are case-sensitive.
- Prior to version 2016-01-01, 'SKU' was called 'accountType' and was found under the 'properties' envelope.

## Retrieve account information

The following code example gets the read-only properties...

```csharp
public static async Task GetStorageAccountPropertiesAsync(CloudStorageAccount account)
{
    try
    {
        Console.WriteLine("Getting account properties.");

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
