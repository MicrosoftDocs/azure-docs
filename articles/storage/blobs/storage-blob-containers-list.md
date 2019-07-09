---
title: List blob containers with .NET - Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/26/2019
ms.author: tamram
ms.subservice: blobs
---

# List blob containers with .NET

When you list the containers in an Azure Storage account, you can specify a number of options to manage how results are returned from Blob storage. This article shows how to list containers using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).  

## About container listing options

To list containers in your storage account, call one of the following methods:

> [!div class="checklist"]
> - [ListContainersSegmented](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.listcontainerssegmented)
> - [ListContainersSegmentedAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.listcontainerssegmentedasync)

The overloads for these methods provide additional options for controlling how containers are returned by the listing operation. These options are described in the following sections.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the `maxresults` parameter.

If your storage account contains more than 5000 containers, or if you have specified a value for `maxresults` such that the listing operation returns a subset of containers in the storage account, then Azure Storage returns a continuation token with the list of containers. A continuation token is an opaque value that you can use to retrieve the next set of results from Azure Storage. When the continuation token is null, then the set of results is complete.

### Filter results with a prefix

To filter the list of containers, specify a string for the `prefix` parameter. The prefix string can include one or more characters. Azure Storage returns the containers whose names start with that prefix.

### Return container metadata

To return container metadata with the results, specify **Metadata** for the [ContainerListDetails](/dotnet/api/microsoft.azure.storage.blob.containerlistingdetails) enumeration. Azure Storage includes metadata with each container returned, so you do not need to also call one of the **FetchAttributes** methods to retrieve the container metadata.

## List containers example

The following example lists the containers in a storage account that begin with a specified prefix. The example lists containers in increments of five results at a time, and uses the continuation token to get the next segment of results. The example also specifies that the listing operation should return container metadata with the results.

```csharp
private static async Task ListContainersWithPrefixAsync(CloudBlobClient blobClient, string prefix)
{
    Console.WriteLine("List all containers beginning with prefix {0}, plus container metadata:", prefix);

    try
    {
        ContainerResultSegment resultSegment = null;
        BlobContinuationToken continuationToken = null;

        do
        {
            // List containers beginning with the specified prefix, returning segments of 5 results each.
            // Note that passing in null for the maxResults parameter returns the maximum number of results (up to 5000).
            // Requesting the container's metadata as part of the listing operation populates the metadata,
            // so it's not necessary to call FetchAttributes() to read the metadata.
            resultSegment = await blobClient.ListContainersSegmentedAsync(
                prefix, ContainerListingDetails.Metadata, 5, continuationToken, null, null);

            // Enumerate the containers returned.
            foreach (var container in resultSegment.Results)
            {
                Console.WriteLine("\tContainer:" + container.Name);

                // Write the container's metadata keys and values.
                foreach (var metadataItem in container.Metadata)
                {
                    Console.WriteLine("\t\tMetadata key: " + metadataItem.Key);
                    Console.WriteLine("\t\tMetadata value: " + metadataItem.Value);
                }
            }

            // Get the continuation token. If not null, get the next segment.
            continuationToken = resultSegment.ContinuationToken;

        } while (continuationToken != null);
    }
    catch (StorageException e)
    {
        Console.WriteLine("HTTP error code {0} : {1}",
                            e.RequestInformation.HttpStatusCode,
                            e.RequestInformation.ErrorCode);
        Console.WriteLine(e.Message);
    }
}
```

[!INCLUDE [storage-blob-dotnet-resources](../../../includes/storage-blob-dotnet-resources.md)]

## See also

[List Containers](/rest/api/storageservices/list-containers2)
[Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
