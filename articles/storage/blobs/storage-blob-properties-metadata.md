---
title: Manage properties and metadata for a blob with .NET - Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blobs in your Azure Storage account using the .NET client library.
services: storage
author: mhopkins-msft

ms.service: storage
ms.topic: article
ms.date: 07/25/2019
ms.author: mhopkins
---

# Manage blob properties and metadata with .NET

Blobs support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for .NET maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and do not affect how the resource behaves.

Retrieving property and metadata values for a Blob storage resource is a two-step process. Before you can read these values, you must explicitly fetch them by calling the **FetchAttributes** or **FetchAttributesAsync** method. The exception to this rule is that the **Exists** and **ExistsAsync** methods call the appropriate **FetchAttributes** method under the covers. When you call one of these methods, you do not need to also call **FetchAttributes**.

> [!IMPORTANT]
> If you find that property or metadata values for a storage resource have not been populated, then check that your code calls the **FetchAttributes** or **FetchAttributesAsync** method.

Metadata name/value pairs are valid HTTP headers, and so should adhere to all restrictions governing HTTP headers. Metadata names must be valid HTTP header names and valid C# identifiers, may contain only ASCII characters, and should be treated as case-insensitive. Metadata values containing non-ASCII characters should be Base64-encoded or URL-encoded.

## Set and retrieve properties

The following code example sets system properties on a blob. One value is set using the collection's **Add** method. The other value is set using implicit key/value syntax. Both are valid.

```csharp
public static async Task SetBlobPropertiesAsync(CloudBlob blob)
{
    try
    {
        // Set property values on the blob.
        blob.Properties.ContentType = "text";
        blob.Properties.ContentLanguage = "English";

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

To retrieve blob properties, get a reference to the blob on the server and access the [CloudBlob.Properties](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.blob.cloudblob.properties) property. The following code example gets a blob's system properties and writes some property values to a console window:

```csharp
private static async Task GetBlobPropertiesAsync(CloudBlobContainer container, String blobName)
{
    // Get a reference to the blob on the server.
    ICloudBlob blob = await container.GetBlobReferenceFromServerAsync(blobName);

    // Display some of the blob's property values.
    Console.WriteLine("Blob content type: {0}", blob.Properties.ContentType);
    Console.WriteLine("Blob content language: {0}", blob.Properties.ContentLanguage);
    Console.WriteLine("Last modified time in UTC: {0}", blob.Properties.LastModified);
}
```

## Set and retrieve metadata

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, add name-value pairs to the **Metadata** collection on the resource, then call one of the following methods to write the values:

- [SetMetadata](/dotnet/api/microsoft.azure.storage.blob.cloudblob.setmetadata)
- [SetMetadataAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.setmetadataasync)

The name of your metadata must conform to the naming conventions for C# identifiers. Metadata names preserve the case with which they were created, but are case-insensitive when set or read. If two or more metadata headers with the same name are submitted for a resource, Blob storage returns HTTP error code 400 (Bad Request).

The following code example sets metadata on a blob. One value is set using the collection's **Add** method. The other value is set using implicit key/value syntax. Both are valid.

```csharp
public static async Task AddBlobMetadataAsync(CloudBlob blob)
{
    try
    {
        // Add some metadata to the blob.
        blob.Metadata.Add("docType", "textDocuments");
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

To retrieve metadata, call the **FetchAttributes** or **FetchAttributesAsync** method on your blob or container to populate the **Metadata** collection, then read the values, as shown in the example below.

```csharp
public static async Task ReadBlobMetadataAsync(CloudBlob blob)
{
    try
    {
        // Fetch blob attributes in order to populate the blob's properties and metadata.
        await blob.FetchAttributesAsync();

        // Enumerate the blob's metadata.
        Console.WriteLine("Blob metadata:");
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

[!INCLUDE [storage-blob-dotnet-resources](../../../includes/storage-blob-dotnet-resources.md)]

## See also

- [Set Blob Properties operation](/rest/api/storageservices/set-blob-properties)
- [Get Blob Properties operation](/rest/api/storageservices/get-blob-properties)
- [Set Blob Metadata operation](/rest/api/storageservices/set-blob-metadata)
- [Get Blob Metadata operation](/rest/api/storageservices/set-blob-metadata)
