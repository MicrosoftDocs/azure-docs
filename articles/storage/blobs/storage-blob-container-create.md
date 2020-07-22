---
title: Create or delete a blob container with .NET - Azure Storage 
description: Learn how to create or delete a blob container in your Azure Storage account using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 12/17/2019
ms.author: tamram
ms.subservice: blobs
---

# Create or delete a container in Azure Storage with .NET

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This article shows how to create and delete containers with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage?view=azure-dotnet).

## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

- Container names can be between 3 and 63 characters long.
- Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
- Two or more consecutive dash characters are not permitted in container names.

The URI for a container is in this format:

`https://myaccount.blob.core.windows.net/mycontainer`

## Create a container

To create a container, call one of the following methods:

- [Create](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.create)
- [CreateAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createasync)
- [CreateIfNotExists](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createifnotexists)
- [CreateIfNotExistsAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createifnotexistsasync)

The **Create** and **CreateAsync** methods throw an exception if a container with the same name already exists.

The **CreateIfNotExists** and **CreateIfNotExistsAsync** methods return a Boolean value indicating whether the container was created. If a container with the same name already exists, then these methods return **False** to indicate that a new container was not created.

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another.

The following example creates a container asynchronously:

```csharp
private static async Task<CloudBlobContainer> CreateSampleContainerAsync(CloudBlobClient blobClient)
{
    // Name the sample container based on new GUID, to ensure uniqueness.
    // The container name must be lowercase.
    string containerName = "container-" + Guid.NewGuid();

    // Get a reference to a sample container.
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);

    try
    {
        // Create the container if it does not already exist.
        bool result = await container.CreateIfNotExistsAsync();
        if (result == true)
        {
            Console.WriteLine("Created container {0}", container.Name);
        }
    }
    catch (StorageException e)
    {
        Console.WriteLine("HTTP error code {0}: {1}",
                            e.RequestInformation.HttpStatusCode,
                            e.RequestInformation.ErrorCode);
        Console.WriteLine(e.Message);
    }

    return container;
}
```

## Create the root container

A root container serves as a default container for your storage account. Each storage account may have one root container, which must be named *$root.*. You must explicitly create or delete the root container.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob that resides in the root container in the following manner:

`https://myaccount.blob.core.windows.net/default.html`

The following example creates the root container synchronously:

```csharp
private static void CreateRootContainer(CloudBlobClient blobClient)
{
    try
    {
        // Create the root container if it does not already exist.
        CloudBlobContainer container = blobClient.GetContainerReference("$root");
        if (container.CreateIfNotExists())
        {
            Console.WriteLine("Created root container.");
        }
        else
        {
            Console.WriteLine("Root container already exists.");
        }
    }
    catch (StorageException e)
    {
        Console.WriteLine("HTTP error code {0}: {1}",
                            e.RequestInformation.HttpStatusCode,
                            e.RequestInformation.ErrorCode);
        Console.WriteLine(e.Message);
    }
}
```

## Delete a container

To delete a container in .NET, use one of the following methods:

- [Delete](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.delete)
- [DeleteAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.deleteasync)
- [DeleteIfExists](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.deleteifexists)
- [DeleteIfExistsAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.deleteifexistsasync)

The **Delete** and **DeleteAsync** methods throw an exception if the container does not exist.

The **DeleteIfExists** and **DeleteIfExistsAsync** methods return a Boolean value indicating whether the container was deleted. If the specified container does not exist, then these methods return **False** to indicate that the container was not deleted.

After you delete a container, you cannot create a container with the same name for at least 30 seconds, and possibly longer. While the container is being deleted, an attempt to create a container with the same name will fail with HTTP error code 409 (Conflict). Any other operations on the container or the blobs it contains will fail with HTTP error code 404 (Not Found) while the container is being deleted.

The following example deletes the specified container, and handles the exception if the container does not exist:

```csharp
private static async Task DeleteSampleContainerAsync(CloudBlobClient blobClient, string containerName)
{
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);

    try
    {
        // Delete the specified container and handle the exception.
        await container.DeleteAsync();
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

The following example shows how to delete all of the containers that start with a specified prefix. The example breaks the lease if there is an existing lease on the container.

```csharp
private static async Task DeleteContainersWithPrefixAsync(CloudBlobClient blobClient, string prefix)
{
    Console.WriteLine("Delete all containers beginning with the specified prefix");
    try
    {
        foreach (var container in blobClient.ListContainers(prefix))
        {
            Console.WriteLine("\tContainer:" + container.Name);
            if (container.Properties.LeaseState == LeaseState.Leased)
            {
                await container.BreakLeaseAsync(null);
            }

            await container.DeleteAsync();
        }

        Console.WriteLine();
    }
    catch (StorageException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}
```

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## See also

- [Create Container operation](/rest/api/storageservices/create-container)
- [Delete Container operation](/rest/api/storageservices/delete-container)
