---
title: Create or delete a blob container in Azure Storage with .NET
description: Learn how to create or delete a container in Azure Storage with .NET.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/01/2019
ms.author: tamram
ms.subservice: blobs
---

# Create or delete a container in Azure Storage with .NET

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. This how-to article shows how to create and delete containers with the Azure Storage client library for .NET.

[API reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-storage-net/tree/master/Blob) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Storage.Blob/) | [Samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=dotnet&term=blob)

## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

1. Container names can be between 3 and 63 characters long.
1. Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
1. Two or more consecutive dash characters are not permitted in container names.

The URI for a container is in this format:

`https://myaccount.blob.core.windows.net/mycontainer`

## Create a container

To create a container in .NET, use one of the following methods:

> [!div class="checklist"]
> * [Create](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.create)
> * [CreateAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createasync)
> * [CreateIfNotExists](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createifnotexists)
> * [CreateIfNotExistsAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createifnotexistsasync)

The **Create** and **CreateAsync** methods throw an exception if a container with the same name already exists. 

The **CreateIfNotExists** and **CreateIfNotExistsAsync** methods return a Boolean value indicating whether the container was created. If a container with the same name already exists, then these methods return **False** to indicate that a new container was not created.

Containers are created immediately beneath the storage account. It's not possible to nest one container beneath another.

The following example takes a **CloudBlobClient** object and creates a container asynchronously:

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
        Console.WriteLine(e.Message);
        Console.ReadLine();
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
        // Create the container if it does not already exist.
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
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }
}
```

## Delete a container

```
code
```

## See also

- [Create Container operation](/rest/api/storageservices/create-container)
- [Delete Container operation](/rest/api/storageservices/delete-container)