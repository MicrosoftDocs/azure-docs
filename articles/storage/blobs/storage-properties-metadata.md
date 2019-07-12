---
title: Set and retrieve object properties and metadata in Azure Storage | Microsoft Docs
description: Store custom metadata on objects in Azure Storage, and set and retrieve system properties.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/03/2019
ms.author: tamram
---

# Set and retrieve properties and metadata

Objects in Azure Storage support system properties and user-defined metadata, in addition to the data they contain. This article discusses managing system properties and user-defined metadata with the [Azure Storage Client Library for .NET](/dotnet/api/overview/azure/storage/client).

* **System properties**: System properties exist on each storage resource. Some of them can be read or set, while others are read-only. Under the covers, some system properties correspond to certain standard HTTP headers. Azure Storage client libraries maintain these properties for you.

* **User-defined metadata**: User-defined metadata consists of one or more name-value pairs that you specify for an Azure Storage resource. You can use metadata to store additional values with a resource. Metadata values are for your own purposes only, and do not affect how the resource behaves.

Retrieving property and metadata values for a storage resource is a two-step process. Before you can read these values, you must explicitly fetch them by calling the **FetchAttributes** or **FetchAttributesAsync** method. The exception is if you are calling the **Exists** or **ExistsAsync** method on a resource. When you call one of these methods, Azure Storage calls the appropriate **FetchAttributes** method under the covers as part of the call to the **Exists** method.

> [!IMPORTANT]
> If you find that property or metadata values for a storage resource have not been populated, then check that your code calls the **FetchAttributes** or **FetchAttributesAsync** method.
>
> Metadata name/value pairs are valid HTTP headers, and so should adhere to all restrictions governing HTTP headers. Metadata names must be valid HTTP header names and valid C# identifiers, may contain only ASCII characters, and should be treated as case-insensitive. Metadata values containing non-ASCII characters should be Base64-encoded or URL-encoded.

## Setting and retrieving properties
To retrieve property values, call the **FetchAttributesAsync** method on your blob or container to populate the properties, then read the values.

To set properties on an object, specify the property value, then call the **SetProperties** method.

The following code example creates a container, then writes some of its property values to a console window.

```csharp
//Parse the connection string for the storage account.
const string ConnectionString = "DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key";
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);

//Create the service client object for credentialed access to the Blob service.
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Retrieve a reference to a container.
CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

// Create the container if it does not already exist.
container.CreateIfNotExists();

// Fetch container properties and write out their values.
await container.FetchAttributesAsync();
Console.WriteLine("Properties for container {0}", container.StorageUri.PrimaryUri.ToString());
Console.WriteLine("LastModifiedUTC: {0}", container.Properties.LastModified.ToString());
Console.WriteLine("ETag: {0}", container.Properties.ETag);
Console.WriteLine();
```

## Setting and retrieving metadata
You can specify metadata as one or more name-value pairs on a blob or container resource. To set metadata, add name-value pairs to the **Metadata** collection on the resource, then call the **SetMetadata** or **SetMetadataAsync** method to save the values to the service.

> [!NOTE]
> The name of your metadata must conform to the naming conventions for C# identifiers.
>
>

The following code example sets metadata on a container. One value is set using the collection's **Add** method. The other value is set using implicit key/value syntax. Both are valid.

```csharp
public static async Task AddContainerMetadataAsync(CloudBlobContainer container)
{
    // Add some metadata to the container.
    container.Metadata.Add("docType", "textDocuments");
    container.Metadata["category"] = "guidance";

    // Set the container's metadata.
    await container.SetMetadataAsync();
}
```

To retrieve metadata, call the **FetchAttributes** or **FetchAttributesAsync** method on your blob or container to populate the **Metadata** collection, then read the values, as shown in the example below.

```csharp
public static async Task ListContainerMetadataAsync(CloudBlobContainer container)
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
```

## Next steps
* [Azure Storage client library for .NET reference](/dotnet/api/?term=Microsoft.Azure.Storage)
* [Azure Blob storage client library for .NET package](https://www.nuget.org/packages/Microsoft.Azure.Storage.Blob/)
* [Azure Queue storage client library for .NET package](https://www.nuget.org/packages/Microsoft.Azure.Storage.Queue/)
* [Azure File storage client library for .NET package](https://www.nuget.org/packages/Microsoft.Azure.Storage.File/)

