---
title: Create resource files three ways - Azure Batch | Microsoft Docs
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
ms.date: 02/28/2019
ms.author: lahugh
---

# Create resource files three ways

Resource files are a source of input for tasks and pools in Azure Batch. Resource files are created based on a given input file, and are then placed onto a task or pool for further processing.

Resource files serve two purposes:

1. Provide initial configuration settings for a pool.

1. Provide input data to be processed by tasks.

Configuring a pool could mean, for example, setting up a start task to install the applications that your tasks run, or starting background processes. See [Start task](batch-api-basics.md#start-task) for more information about configuring a start task. An example of input data could be a video or image file to be processed by the task.

Typically, your Batch task will specify resource files from a linked Azure Storage account, but there are several ways to access resource files. This article covers three different ways to retrieve and generate resource files for your Batch tasks.

## Examples (C#)

This article covers three examples to consume an input file and generate a resource file to be used by Azure Batch.

The three options:

1. [FromAutoStorageContainer](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.resourcefile.fromautostoragecontainer?view=azure-dotnet) – Uses name of the container in a storage account linked to the Batch account (the “auto storage” account) to generate a resource file.

1. [FromStorageContainerUrl](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.resourcefile.fromstoragecontainerurl?view=azure-dotnet) – Uses any Azure storage container URL to generate a resource file.

1. [FromUrl](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.resourcefile.fromurl?view=azure-dotnet) – Uses any HTTP URL to generate a resource file.

### Storage container name

In this example, we assume that the files that will be used as resource files are already in the Azure Storage account linked to your Batch account. If you don't have a linked storage account, see the steps in [Create a Batch account](/create-a-batch-account.md) for details on how to create and link an account.

By using a linked storage account, you don't need to create and configure a SAS URL to a storage container. Instead, provide the name of the storage container in your linked storage account.

```csharp
var inputFile = ResourceFile.FromAutoStorageContainer(containerName);
```

Because your Storage account is already linked to your Batch account, you only need to provide the name of the storage container with the input files and the API handles the details for you.

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

### Web endpoint

Files don't need to be in Azure Storage to be used by Batch. You can specify any arbitrary web endpoint to your resource file. In the following example, the file is hosted on fictitious GitHub endpoint. The API retrieves the file from the valid web end point and generates a resource file to be consumed by your task.

```csharp
var inputFile = ResourceFile.FromUrl("https://github.com/foo/file.txt", filePath);
```

The URL must be readable and listable using anonymous access; that is, the Batch service does not present any credentials when downloading the file. There are two ways to get such a URL for a container in Azure storage: include a Shared Access Signature (SAS) granting read and list permissions on the container, or set the ACL for the container to allow public access.

## Tips and best practices

### Many resource files

If your task has several resource files, it's more efficient to use [application package](batch-application-packages.md) rather than specify a long list of individual resource files. With application packages, you don't have to manually manage several resource files and you don't need to worry about generating SAS URLs with the correct permissions to access the files in Azure Storage. Batch works in the background with Azure Storage to store and deploy application packages to compute nodes.

Another option is to create a zipped archive containing your resource files. Upload the archive as a blob to Azure Storage, and then unzip it from the command line of your start task. This will still allow you to have several resource files, while keeping the size of your task relatively small.

### Number of resource files per task

Although some tasks require several resource files, it's best to keep your tasks small by minimizing the number of resource files needed. Small tasks are generally more efficient than large tasks. For example, instead of using a large number of resource files, install task dependencies using a start task on the pool. Also consider using an [application package](batch-application-packages.md) or a [Docker container](batch-docker-container-workloads.md).

Also, if there are hundreds of files, it's possible to hit a limit when resource files are copied from storage to a task. When there's a huge number of files, it's recommended to use the `azcopy` command line in the task, which can use wildcards and has no limit.  

## Next steps

* Learn about [application packages](batch-application-packages.md) as an alternative to resource files.
* For more information about using containers for resource files, see [Container workloads](batch-docker-container-workloads.md).
* To learn how to gather and save the output data from your tasks, see [Persist job and task output](batch-task-output.md).
* Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.