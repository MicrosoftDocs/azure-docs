---
title: Manage properties and metadata for a blob with .NET - Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blobs in your Azure Storage account using the .NET client library.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/09/2019
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
---

# Manage blob properties and metadata with .NET

In addition to the data they contain, blobs support system properties and user-defined metadata. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage?view=azure-dotnet).

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for .NET maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

> [!NOTE]
> Blob Index tags also provide the ability to store arbitrary user-defined key/value attributes alongside a Blob storage resource. While similar to metadata, only Blob Index tags are automatically indexed and made queryable by the native blob service. Metadata cannot be natively indexed and queried unless you utilize a separate service such as Azure Search.
>
> To learn more about this feature, see [Manage and find data on Azure Blob Storage with Blob Index (Preview)](storage-manage-find-blobs.md).

Retrieving metadata and property values for a Blob storage resource is a two-step process. Before you can read these values, you must explicitly fetch them by calling the `FetchAttributes` or `FetchAttributesAsync` method. The exception to this rule is that the `Exists` and `ExistsAsync` methods call the appropriate `FetchAttributes` method under the covers. When you call one of these methods, you don't need to also call `FetchAttributes`.

> [!IMPORTANT]
> If you find that property or metadata values for a storage resource have not been populated, check that your code calls the `FetchAttributes` or `FetchAttributesAsync` method.

## Set and retrieve properties

The following code example sets the `ContentType` and `ContentLanguage` system properties on a blob.

```csharp
public static async Task SetBlobPropertiesAsync(CloudBlob blob)
{
    try
    {
        Console.WriteLine("Setting blob properties.");

        // You must explicitly set the MIME ContentType every time
        // the properties are updated or the field will be cleared.
        blob.Properties.ContentType = "text/plain";
        blob.Properties.ContentLanguage = "en-us";

        // Set the blob's properties.
        await blob.SetPropertiesAsync();
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

To retrieve blob properties, call the `FetchAttributes` or `FetchAttributesAsync` method on your blob to populate the `Properties` property. The following code example gets a blob's system properties and displays some of the values:

```csharp
private static async Task GetBlobPropertiesAsync(CloudBlob blob)
{
    try
    {
        // Fetch the blob properties.
        await blob.FetchAttributesAsync();

        // Display some of the blob's property values.
        Console.WriteLine(" ContentLanguage: {0}", blob.Properties.ContentLanguage);
        Console.WriteLine(" ContentType: {0}", blob.Properties.ContentType);
        Console.WriteLine(" Created: {0}", blob.Properties.Created);
        Console.WriteLine(" LastModified: {0}", blob.Properties.LastModified);
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

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, add name-value pairs to the `Metadata` collection on the resource. Then, call one of the following methods to write the values:

- [SetMetadata](/dotnet/api/microsoft.azure.storage.blob.cloudblob.setmetadata)
- [SetMetadataAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.setmetadataasync)

Metadata name/value pairs are valid HTTP headers and should adhere to all restrictions governing HTTP headers. Metadata names must be valid HTTP header names and valid C# identifiers, may contain only ASCII characters, and should be treated as case-insensitive. [Base64-encode](https://docs.microsoft.com/dotnet/api/system.convert.tobase64string) or [URL-encode](https://docs.microsoft.com/dotnet/api/system.web.httputility.urlencode) metadata values containing non-ASCII characters.

The name of your metadata must conform to the naming conventions for C# identifiers. Metadata names maintain the case used when they were created, but are case-insensitive when set or read. If two or more metadata headers using the same name are submitted for a resource, Azure Blob storage returns HTTP error code 400 (Bad Request).

The following code example sets metadata on a blob. One value is set using the collection's `Add` method. The other value is set using implicit key/value syntax.

```csharp
public static async Task AddBlobMetadataAsync(CloudBlob blob)
{
    try
    {
        // Add metadata to the blob by calling the Add method.
        blob.Metadata.Add("docType", "textDocuments");

        // Add metadata to the blob by using key/value syntax.
        blob.Metadata["category"] = "guidance";

        // Set the blob's metadata.
        await blob.SetMetadataAsync();
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

To retrieve metadata, call the `FetchAttributes` or `FetchAttributesAsync` method on your blob or container to populate the `Metadata` collection, then read the values, as shown in the example below.

```csharp
public static async Task ReadBlobMetadataAsync(CloudBlob blob)
{
    try
    {
        // Fetch blob attributes in order to populate 
        // the blob's properties and metadata.
        await blob.FetchAttributesAsync();

        Console.WriteLine("Blob metadata:");

        // Enumerate the blob's metadata.
        foreach (var metadataItem in blob.Metadata)
        {
            Console.WriteLine("\tKey: {0}", metadataItem.Key);
            Console.WriteLine("\tValue: {0}", metadataItem.Value);
        }
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

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## See also

- [Set Blob Properties operation](/rest/api/storageservices/set-blob-properties)
- [Get Blob Properties operation](/rest/api/storageservices/get-blob-properties)
- [Set Blob Metadata operation](/rest/api/storageservices/set-blob-metadata)
- [Get Blob Metadata operation](/rest/api/storageservices/get-blob-metadata)
