---
title: Create a container in Azure Storage in .NET
description: Learn how to create a container in Azure Storage in .NET.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/01/2019
ms.author: tamram
ms.subservice: blobs
---

# Create a container in Azure Storage in .NET

All blobs in Azure Storage are organized into containers. The container forms part of the unique name  



## Name a container

A container name must be a valid DNS name, as it forms part of the unique URI used to address the container or its blobs. Follow these rules when naming a container:

1. Container names can be between 3 and 63 characters long.
1. Container names must start with a letter or number, and can contain only lowercase letters, numbers, and the dash (-) character.
1. Two or more consecutive dash characters are not permitted in container names.

The URI for a container is in this format:

`https://myaccount.blob.core.windows.net/mycontainer`

## Create a container

To create a container in .NET, use one of the following methods:

- [Create](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.create)
- [CreateAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createasync)
- [CreateIfNotExists](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createifnotexists)
- [CreateIfNotExistsAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.createifnotexistsasync)

The **Create** and **CreateAsync** methods throw an exception if a container with the same name already exists. 

The **CreateIfNotExists** and **CreateIfNotExistsAsync** methods return a Boolean value indicating whether the container was created. If a container with the same name already exists, then these methods return **False** to indicate that a new container was not created.

The following example creates a container:

```csharp
private static async Task<CloudBlobContainer> CreateSampleContainerAsync(CloudBlobClient blobClient)
{
    // Name the sample container based on a new GUID value, to ensure uniqueness.
    // The container name must be lowercase.
    string containerName = "container-" + Guid.NewGuid();

    // Get a reference to a sample container.
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);

    try
    {
        // Create the container if it does not already exist.
        await container.CreateIfNotExistsAsync();
    }
    catch (StorageException e)
    {
        // Ensure that the storage emulator is running if using emulator connection string.
        Console.WriteLine(e.Message);
        Console.ReadLine();
    }

    return container;
}
```

## Create the root container

A root container serves as a default container for your storage account. Each storage account may have one root container, which must be named *$root.*. You must explicitly create the root container.

You can reference a blob stored in the root container without including the root container name. The root container enables you to reference a blob at the top level of the storage account hierarchy. For example, you can reference a blob that resides in the root container in the following manner:

`https://myaccount.blob.core.windows.net/default.html`

The following example creates the root container:

```csharp


```