---
title: Creating and using resource files - Azure Batch | Microsoft Docs
description: Learn how to create resource files from various input sources for Azure Batch.
services: batch
documentationcenter: ''
author: laurenhughes
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/12/2019
ms.author: lahugh
---

# Creating and using resource files

(// do we mention the destinations are constrained by the task type and base design/layout?  Tmi?)
(// somewhere discuss the “shared directory hierarchy”)

An Azure Batch task often requires some form of data to process. Resource files are the means to provide this data to your Batch virtual machine (VM) via a task. All types of tasks support resource files: tasks, start tasks, job preparation tasks, job release tasks, etc. This article covers a few common methods on how to create resource files and place them on a VM.  

Resource files are a mechanism to put data onto a VM in Batch, but what type of data and how it is used is flexible. There are, however, some common use cases:

1. Provision common files on each VM using resource files on a start task
1. Provision input data to be processed by tasks

Common files could be, for example, files on a start task used to install applications that your tasks run. Input data could be raw image or video data, or any information to be processed by Batch.

## Types of resource files

There are a few different options available to generate resource files. The creation process for resource files varies depending on where the original data is stored.

Options for creating a resource file:

- [Storage container URL](#storage-container-url)
   Generates a resource file from any storage container in Azure
- [Storage container name](#storage-container-name)
   Generates a resource file from the name of a container in an Azure storage account linked to Batch
- [Web endpoint](#web-endpoint)
   Generates a resource file from any valid HTTP URL

### Storage container URL

Using a storage container URL means you can access files in any storage container in Azure. With the correct permissions

In this C# example, the files have already been uploaded to an Azure storage container as blob storage. To access the data needed to create a resource file, we first need to get access to the storage container.

Create a shared access signature (SAS) URI with the correct permissions to access the storage container. Set the expiration time and permissions for the SAS. In this case, no start time is specified, so the SAS becomes valid immediately and expires two hours after it's generated.

```csharp
SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy
{
    SharedAccessExpiryTime = DateTime.UtcNow.AddHours(2),
    Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.List
};
```

> [!NOTE]
> For container access, you must have both `Read` and `List` permissions, whereas with blob access, you only need `Read` permission.

Once the permissions are configured, create the SAS token and format the SAS URL for access to the storage container. Using the formatted SAS URL for the storage container, generate a resource file with [`FromStorageContainerUrl`](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.resourcefile.fromstoragecontainerurl?view=azure-dotnet).

```csharp
CloudBlobContainer container = blobClient.GetContainerReference(containerName);

string sasToken = container.GetSharedAccessSignature(sasConstraints);
string containerSasUrl = String.Format("{0}{1}", container.Uri, sasToken);

ResourceFile inputFile = ResourceFile.FromStorageContainerUrl(containerSasUrl);
```

An alternative to generating a SAS URL is to enable anonymous, public read access to a container and its blobs in Azure Blob storage. By doing so, you can grant read-only access to these resources without sharing your account key, and without requiring a SAS. Public read access is typically used for scenarios where you want certain blobs to always be available for anonymous read access. If this scenario suits your solution, see the [Anonymous access to blobs](../storage/blobs/storage-manage-access-to-resources.md) article to learn more about managing access to your blob data.

### Storage container name

Instead of configuring and creating a SAS URL, you can use the name of your Azure storage container to access your blob data. The storage container used needs to in the Azure storage account that's linked to your Batch account, known as the auto-storage account. Using the storage container name of an auto-storage account allows you to bypass configuring and creating a SAS URL to access a storage container.

In this example, we assume that the data to be used for resource file creation is already in an Azure Storage account linked to your Batch account. If you don't have an auto-storage account, see the steps in [Create a Batch account](/create-a-batch-account.md) for details on how to create and link an account.

By using a linked storage account, you don't need to create and configure a SAS URL to a storage container. Instead, provide the name of the storage container in your linked storage account.

```csharp
ResourceFile inputFile = ResourceFile.FromAutoStorageContainer(containerName);
```

### Web endpoint

Data that isn't uploaded to Azure Storage can still be used to create resource files. You can specify any valid HTTP URL containing your input data. The URL is provided to the Batch API, and then the data is used to create a resource file.

In the following C# example, the input data is hosted on fictitious GitHub endpoint. The API retrieves the file from the valid web endpoint and generates a resource file to be consumed by your task. No credentials are needed when using this option.

```csharp
ResourceFile inputFile = ResourceFile.FromUrl("https://github.com/foo/file.txt", filePath);
```

## Tips and best practices

Depends on your scenario. Depends on how your tasks are organized and what the data for your tasks looks like.

### Many resource files



1. If each task has many files unique to that task, it is likely you’ll want resource files, as it is difficult to change an application packages content.

1. If the thing you are deploying is logically a “versioned application” then using applications makes a lot of sense, as it has optimizations in terms of download. This is doubly true if the content in the application changes very rarely, as it’s cached between tasks too.
1. If files are shared between tasks but not all files are shared between tasks, then you might want an application for the shared files and resource files for the non-common files.

1. The notion that they have to “specify a long list” of resource files is no longer true after Xings changes because they could specify one ResourceFile pointing at a container (which contains many blobs which will all be downloaded), so I am not sure that aspect of the tip above is correct.

1. The zipping idea is nice, but I’d refer to it as a download speed optimization now, and not a “keeping the size of your task small” optimization, as you can now keep the size of your task small by just putting the files into a container and putting a single ResourceFile pointing at the whole container (or a subset of it).

1. “.zip/app-packages that need to be unpacked increase the local storage impact… since the package needs to take up space to be unpacked.

If your task has several resource files, it's more efficient to use [application package](batch-application-packages.md) rather than specify a long list of individual resource files.

With application packages, you don't have to manually manage several resource files and you don't need to worry about generating SAS URLs with the correct permissions to access the files in Azure Storage. Batch works in the background with Azure Storage to store and deploy application packages to compute nodes.

Another option is to create a zipped archive containing your resource files. Upload the archive as a blob to Azure Storage, and then unzip it from the command line of your start task. This will still allow you to have several resource files, while keeping the size of your task relatively small.

### Number of resource files per task

Although some tasks require several resource files, it's best to keep your tasks small by minimizing the number of resource files needed. Small tasks are generally more efficient than large tasks. For example, instead of using a large number of resource files, install task dependencies using a start task on the pool. Also consider using an [application package](batch-application-packages.md) or a [Docker container](batch-docker-container-workloads.md).

Also, if there are hundreds of resource files specified on a task, Batch may reject the task due to it being too large. To avoid this, put your resource files into an Azure Storage container and use the different “Container” modes of resource files to specify collections of files to be downloaded using the blob prefix options.

## Next steps

- Learn about [application packages](batch-application-packages.md) as an alternative to resource files.
- For more information about using containers for resource files, see [Container workloads](batch-docker-container-workloads.md).
- To learn how to gather and save the output data from your tasks, see [Persist job and task output](batch-task-output.md).
- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.