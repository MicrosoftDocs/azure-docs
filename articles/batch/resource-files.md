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

The resource file feature in Batch allows you to provision files on your VM at the per-task granularity ([ed]: there are no resource files on the pool, but there are app packages).   All task types support resource files:  tasks, start tasks, job prep, job release, job manager, etc.  Resource files are created based on input locations you specify and are placed on the VM in locations you determine (// do we mention the destinations are constrained by the task type and base design/layout?  Tmi?)

Resource files are a source of input for tasks and pools in Azure Batch. Resource files are created based on a given input file, and are then placed onto a task or pool for further processing.

Common use cases: 
    1. Provision common files on each VM using resource files on a start task. (// somewhere discuss the “shared directory hierarchy”)

See how this is indirect?  There are no RFs on pools.

    1.  Provision input data to be processed by tasks

I think  “background tasks” (breakaway) is a very advanced topic and I am not sure I feel comfortable surfacing this in the context of resource files.


Configuring a pool could mean, for example, setting up a start task to install the applications that your tasks run, or starting background processes. See [Start task](batch-api-basics.md#start-task) for more information about configuring a start task. An example of input data could be a video or image file to be processed by the task.

Typically, your Batch task will specify resource files from a linked Azure Storage account, but there are several ways to provide and specify resource files. This article covers three different ways to retrieve and generate resource files for your Batch tasks.

## Examples (C#)


FIX
This article covers three examples to consume an input file and generate a resource file to be used by Azure Batch.


The three options:

1. [FromAutoStorageContainer](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.resourcefile.fromautostoragecontainer?view=azure-dotnet) – Uses name of the container in a storage account linked to the Batch account (the “auto storage” account) to generate a resource file.

1. [FromStorageContainerUrl](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.resourcefile.fromstoragecontainerurl?view=azure-dotnet) – Uses any Azure storage container URL to generate a resource file.

1. [FromUrl](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.resourcefile.fromurl?view=azure-dotnet) – Uses any HTTP URL to generate a resource file.

### Storage container url

Using a storage container URL means you can access files in any Azure Storage container, not just the container that's linked to your Batch account. This example assumes the files are already uploaded to an Azure Storage account as blob storage.

First, create a SAS URI with the correct permissions to access the storage container. Let's take a closer look.

```csharp
SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy
{
    SharedAccessExpiryTime = DateTime.UtcNow.AddHours(2),
    Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.List
};
```

Set the expiry time and permissions for the shared access signature. In this case, no start time is specified, so the shared access signature becomes valid immediately and expires after two hours. Accessing a container is different than accessing a blob. For container access, you will need both `Read` and `List` permissions, whereas with blob access, you only need `Read` permission.

Once permissions are set, create the SAS token and SAS URI for the container. With the URI for the storage container, generate a resource file with `FromStorageContainerUrl`.

```csharp
CloudBlobContainer container = blobClient.GetContainerReference(containerName);

string sasToken = container.GetSharedAccessSignature(sasConstraints);
string containerSasUri = String.Format("{0}{1}", container.Uri, sasToken);

var inputFile = ResourceFile.FromStorageContainerUrl(containerSasUri);
```

Alternatively, you can set the access control list (ACL) for the container to allow public access. If you allow public access, you don't need to create a SAS URI for additional permissions.

The URL must be readable and listable using anonymous access; that is, the Batch service does not present any credentials when downloading the file. There are two ways to get such a URL for a container in Azure storage: include a Shared Access Signature (SAS) granting read and list permissions on the container, or set the ACL for the container to allow public access.

### Storage container name

In this example, we assume that the files that will be used as resource files are already in the Azure Storage account linked to your Batch account. If you don't have a linked storage account, see the steps in [Create a Batch account](/create-a-batch-account.md) for details on how to create and link an account.

By using a linked storage account, you don't need to create and configure a SAS URL to a storage container. Instead, provide the name of the storage container in your linked storage account.

```csharp
var inputFile = ResourceFile.FromAutoStorageContainer(containerName);
```

Because your Storage account is already linked to your Batch account, you only need to provide the name of the storage container with the input files and the API handles the details for you.

### Web endpoint

Files don't need to be in Azure Storage to be used by Batch. You can specify any arbitrary web endpoint to your resource file. In the following example, the file is hosted on fictitious GitHub endpoint. The API retrieves the file from the valid web end point and generates a resource file to be consumed by your task.

```csharp
var inputFile = ResourceFile.FromUrl("https://github.com/foo/file.txt", filePath);
```

## Tips and best practices

### Many resource files

If your task has several resource files, it's more efficient to use [application package](batch-application-packages.md) rather than specify a long list of individual resource files. With application packages, you don't have to manually manage several resource files and you don't need to worry about generating SAS URLs with the correct permissions to access the files in Azure Storage. Batch works in the background with Azure Storage to store and deploy application packages to compute nodes.

Another option is to create a zipped archive containing your resource files. Upload the archive as a blob to Azure Storage, and then unzip it from the command line of your start task. This will still allow you to have several resource files, while keeping the size of your task relatively small.

1. If each task has many files unique to that task, it is likely you’ll want resource files, as it is difficult to change an application packages content.
1. If the thing you are deploying is logically a “versioned application” then using applications makes a lot of sense, as it has optimizations in terms of download. This is doubly true if the content in the application changes very rarely, as it’s cached between tasks too.
1. If files are shared between tasks but not all files are shared between tasks, then you might want an application for the shared files and resource files for the non-common files.
1. The notion that they have to “specify a long list” of resource files is no longer true after Xings changes because they could specify one ResourceFile pointing at a container (which contains many blobs which will all be downloaded), so I am not sure that aspect of the tip above is correct.
1. The zipping idea is nice, but I’d refer to it as a download speed optimization now, and not a “keeping the size of your task small” optimization, as you can now keep the size of your task small by just putting the files into a container and putting a single ResourceFile pointing at the whole container (or a subset of it).
1. “.zip/app-packages that need to be unpacked increase the local storage impact… since the package needs to take up space to be unpacked.

### Number of resource files per task

Although some tasks require several resource files, it's best to keep your tasks small by minimizing the number of resource files needed. Small tasks are generally more efficient than large tasks. For example, instead of using a large number of resource files, install task dependencies using a start task on the pool. Also consider using an [application package](batch-application-packages.md) or a [Docker container](batch-docker-container-workloads.md).

Also, if there are hundreds of resource files specified on a task, Batch may reject the task due to it being too large. To avoid this, put your resource files into an Azure Storage container and use the different “Container” modes of resource files to specify collections of files to be downloaded using the blob prefix options.

## Next steps

* Learn about [application packages](batch-application-packages.md) as an alternative to resource files.
* For more information about using containers for resource files, see [Container workloads](batch-docker-container-workloads.md).
* To learn how to gather and save the output data from your tasks, see [Persist job and task output](batch-task-output.md).
* Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.