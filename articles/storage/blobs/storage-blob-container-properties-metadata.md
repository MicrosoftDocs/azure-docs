---
title: Use .NET to manage properties and metadata for a blob container
titleSuffix: Azure Storage
description: Learn how to set and retrieve system properties and store custom metadata on blob containers in your Azure Storage account using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/01/2020
ms.author: tamram
---

# Manage container properties and metadata with .NET

Blob containers support system properties and user-defined metadata, in addition to the data they contain. This article shows how to manage system properties and user-defined metadata with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage?view=azure-dotnet).

## About properties and metadata

- **System properties**: System properties exist on each Blob storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. The Azure Storage client library for .NET maintains these properties for you.

- **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and do not affect how the resource behaves.

Metadata name/value pairs are valid HTTP headers, and so should adhere to all restrictions governing HTTP headers. Metadata names must be valid HTTP header names and valid C# identifiers, may contain only ASCII characters, and should be treated as case-insensitive. Metadata values containing non-ASCII characters should be Base64-encoded or URL-encoded.

## Retrieve container properties

# [.NET v12 SDK](#tab/dotnet)

To retrieve container properties, call one of the following methods:

- [GetProperties](/dotnet/api/azure.storage.blobs.blobcontainerclient.getproperties)
- [GetPropertiesAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getpropertiesasync)

The following code example fetches a container's system properties and writes some property values to a console window:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Metadata.cs" id="Snippet_ReadContainerProperties":::

# [.NET v11 SDK](#tab/dotnet11)

Retrieving property and metadata values for a Blob storage resource is a two-step process. Before you can read these values, you must explicitly fetch them by calling the **FetchAttributes** or **FetchAttributesAsync** method. The exception to this rule is that the **Exists** and **ExistsAsync** methods call the appropriate **FetchAttributes** method under the covers. When you call one of these methods, you do not need to also call **FetchAttributes**.

> [!IMPORTANT]
> If you find that property or metadata values for a storage resource have not been populated, then check that your code calls the **FetchAttributes** or **FetchAttributesAsync** method.

To retrieve container properties, call one of the following methods:

- [FetchAttributes](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.fetchattributes)
- [FetchAttributesAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.fetchattributesasync)

The following code example fetches a container's system properties and writes some property values to a console window:

```csharp
private static async Task ReadContainerPropertiesAsync(CloudBlobContainer container)
{
    try
    {
        // Fetch some container properties and write out their values.
        await container.FetchAttributesAsync();
        Console.WriteLine("Properties for container {0}", container.StorageUri.PrimaryUri);
        Console.WriteLine("Public access level: {0}", container.Properties.PublicAccess);
        Console.WriteLine("Last modified time in UTC: {0}", container.Properties.LastModified);
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

---

## Set and retrieve metadata

# [.NET v12 SDK](#tab/dotnet)

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, add name-value pairs to an [IDictionary](/dotnet/api/system.collections.idictionary) object, and then call one of the following methods to write the values:

- [SetMetadata](/dotnet/api/azure.storage.blobs.blobcontainerclient.setmetadata)
- [SetMetadataAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.setmetadataasync)

The name of your metadata must conform to the naming conventions for C# identifiers. Metadata names preserve the case with which they were created, but are case-insensitive when set or read. If two or more metadata headers with the same name are submitted for a resource, Blob storage comma-separates and concatenates the two values and return HTTP response code 200 (OK).

The following code example sets metadata on a container.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Metadata.cs" id="Snippet_AddContainerMetadata":::

To retrieve metadata, call one of the following methods:

- [GetProperties](/dotnet/api/azure.storage.blobs.blobcontainerclient.getproperties)
- [GetPropertiesAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.getpropertiesasync).

Then, read the values, as shown in the example below.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Metadata.cs" id="Snippet_ReadContainerMetadata":::

# [.NET v11 SDK](#tab/dotnet11)

You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, add name-value pairs to the **Metadata** collection on the resource, then call one of the following methods to write the values:

- [SetMetadata](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.setmetadata)
- [SetMetadataAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.setmetadataasync)

The name of your metadata must conform to the naming conventions for C# identifiers. Metadata names preserve the case with which they were created, but are case-insensitive when set or read. If two or more metadata headers with the same name are submitted for a resource, Blob storage comma-separates and concatenates the two values and return HTTP response code 200 (OK).

The following code example sets metadata on a container. One value is set using the collection's **Add** method. The other value is set using implicit key/value syntax. Both are valid.

```csharp
public static async Task AddContainerMetadataAsync(CloudBlobContainer container)
{
    try
    {
        // Add some metadata to the container.
        container.Metadata.Add("docType", "textDocuments");
        container.Metadata["category"] = "guidance";

        // Set the container's metadata.
        await container.SetMetadataAsync();
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
public static async Task ReadContainerMetadataAsync(CloudBlobContainer container)
{
    try
    {
        // Fetch container attributes in order to populate the container's properties and metadata.
        await container.FetchAttributesAsync();

        // Enumerate the container's metadata.
        Console.WriteLine("Container metadata:");
        foreach (var metadataItem in container.Metadata)
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

---

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## See also

- [Get Container Properties operation](/rest/api/storageservices/get-container-properties)
- [Set Container Metadata operation](/rest/api/storageservices/set-container-metadata)
- [Get Container Metadata operation](/rest/api/storageservices/get-container-metadata)
