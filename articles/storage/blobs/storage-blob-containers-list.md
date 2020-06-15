---
title: List blob containers with .NET - Azure Storage 
description: Learn how to list blob containers in your Azure Storage account using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 01/06/2020
ms.author: tamram
ms.subservice: blobs
---

# List blob containers with .NET

When you list the containers in an Azure Storage account from your code, you can specify a number of options to manage how results are returned from Azure Storage. This article shows how to list containers using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage?view=azure-dotnet).  

## Understand container listing options

To list containers in your storage account, call one of the following methods:

- [ListContainersSegmented](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.listcontainerssegmented)
- [ListContainersSegmentedAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.listcontainerssegmentedasync)

The overloads for these methods provide additional options for managing how containers are returned by the listing operation. These options are described in the following sections.

### Manage how many results are returned

By default, a listing operation returns up to 5000 results at a time. To return a smaller set of results, provide a nonzero value for the `maxresults` parameter when calling one of the **ListContainerSegmented** methods.

If your storage account contains more than 5000 containers, or if you have specified a value for `maxresults` such that the listing operation returns a subset of containers in the storage account, then Azure Storage returns a *continuation token* with the list of containers. A continuation token is an opaque value that you can use to retrieve the next set of results from Azure Storage.

In your code, check the value of the continuation token to determine whether it is null. When the continuation token is null, then the set of results is complete. If the continuation token is not null, then call **ListContainersSegmented** or **ListContainersSegmentedAsync** again, passing in the continuation token to retrieve the next set of results, until the continuation token is null.

### Filter results with a prefix

To filter the list of containers, specify a string for the `prefix` parameter. The prefix string can include one or more characters. Azure Storage then returns only the containers whose names start with that prefix.

### Return metadata

To return container metadata with the results, specify the **Metadata** value for the [ContainerListingDetails](/dotnet/api/microsoft.azure.storage.blob.containerlistingdetails) enumeration. Azure Storage includes metadata with each container returned, so you do not need to also call one of the **FetchAttributes** methods to retrieve the container metadata.

## Example: List containers

The following example asynchronously lists the containers in a storage account that begin with a specified prefix. The example lists containers in increments of 5 results at a time, and uses the continuation token to get the next segment of results. The example also returns container metadata with the results.

```csharp
private static async Task ListContainersWithPrefixAsync(CloudBlobClient blobClient,
                                                        string prefix)
{
    Console.WriteLine("List all containers beginning with prefix {0}, plus container metadata:", prefix);

    try
    {
        ContainerResultSegment resultSegment = null;
        BlobContinuationToken continuationToken = null;

        do
        {
            // List containers beginning with the specified prefix, returning segments of 5 results each.
            // Passing null for the maxResults parameter returns the max number of results (up to 5000).
            // Requesting the container's metadata with the listing operation populates the metadata,
            // so it's not necessary to also call FetchAttributes() to read the metadata.
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

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## See also

[List Containers](/rest/api/storageservices/list-containers2)
[Enumerating Blob Resources](/rest/api/storageservices/enumerating-blob-resources)
