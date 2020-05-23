---
title: Creating and using resource files 
description: Learn how to create Batch resource files from various input sources. This article covers a few common methods on how to create and place them on a VM.
ms.date: 03/18/2020
ms.topic: how-to
---

# Creating and using resource files

An Azure Batch task often requires some form of data to process. Resource files are the way to provide this data to your Batch virtual machine (VM) via a task. All types of tasks support resource files: tasks, start tasks, job preparation tasks, job release tasks, etc. This article covers a few common methods of how to create resource files and place them on a VM.  

Resource files put data onto a VM in Batch, but the type of data and how it's used is flexible. There are, however, some common use cases:

1. Provision common files on each VM using resource files on a start task
1. Provision input data to be processed by tasks

Common files could be, for example, files on a start task used to install applications that your tasks run. Input data could be raw image or video data, or any information to be processed by Batch.

## Types of resource files

There are a few different options available to generate resource files. The creation process for resource files varies depending on where the original data is stored.

Options for creating a resource file:

- [Storage container URL](#storage-container-url): Generates a resource file from any storage container in Azure
- [Storage container name](#storage-container-name): Generates a resource file from the name of a container in an Azure storage account linked to Batch
- [Web endpoint](#web-endpoint): Generates a resource file from any valid HTTP URL

### Storage container URL

Using a storage container URL means, with the correct permissions, you can access files in any storage container in Azure. 

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

An alternative to generating a SAS URL is to enable anonymous, public read-access to a container and its blobs in Azure Blob storage. By doing so, you can grant read-only access to these resources without sharing your account key, and without requiring a SAS. Public read-access is typically used for scenarios where you want certain blobs to be always available for anonymous read-access. If this scenario suits your solution, see the [Anonymous access to blobs](../storage/blobs/storage-manage-access-to-resources.md) article to learn more about managing access to your blob data.

### Storage container name

Instead of configuring and creating a SAS URL, you can use the name of your Azure storage container to access your blob data. The storage container you use must be in the Azure storage account that's linked to your Batch account. That storage account is known as the autostorage account. Using the autostorage container allows you to bypass configuring and creating a SAS URL to access a storage container.

In this example, we assume that the data to be used for resource file creation is already in an Azure Storage account linked to your Batch account. If you don't have an autostorage account, see the steps in [Create a Batch account](batch-account-create-portal.md) for details on how to create and link an account.

By using a linked storage account, you don't need to create and configure a SAS URL to a storage container. Instead, provide the name of the storage container in your linked storage account.

```csharp
ResourceFile inputFile = ResourceFile.FromAutoStorageContainer(containerName);
```

### Web endpoint

Data that isn't uploaded to Azure Storage can still be used to create resource files. You can specify any valid HTTP URL containing your input data. The URL is provided to the Batch API, and then the data is used to create a resource file.

In the following C# example, the input data is hosted on a fictitious GitHub endpoint. The API retrieves the file from the valid web endpoint and generates a resource file to be consumed by your task. No credentials are needed for this scenario.

```csharp
ResourceFile inputFile = ResourceFile.FromUrl("https://github.com/foo/file.txt", filePath);
```

## Tips and suggestions

Each Azure Batch task uses files differently, which is why Batch has options available for managing files on tasks. The following scenarios aren't meant to be comprehensive, but instead cover a few common situations and provide recommendations.

### Many resource files

Your Batch job may contain several tasks that all use the same, common files. If common task files are shared among many tasks, using an application package to contain the files instead of using resource files may be a better option. Application packages provide optimization for download speed. Also, data in application packages is cached between tasks, so if your task files don't change often, application packages may be a good fit for your solution. With application packages, you don't need to manually manage several resource files or generate SAS URLs to access the files in Azure Storage. Batch works in the background with Azure Storage to store and deploy application packages to compute nodes.

If each task has many files unique to that task, resource files are the best option becasue tasks that use unique files often need to be updated or replaced, which is not as easy to do with application packages content. Resource files provide additional flexibility for updating, adding, or editing individual files.

### Number of resource files per task

If there are several hundred resource files specified on a task, Batch might reject the task as being too large. It's best to keep your tasks small by minimizing the number of resource files on the task itself.

If there's no way to minimize the number of files your task needs, you can optimize the task by creating a single resource file that references a storage container of resource files. To do this, put your resource files into an Azure Storage container and use the different "container" [methods](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.resourcefile?view=azure-dotnet#methods) for resource files. Use the blob prefix options to specify collections of files to be downloaded for your tasks.

## Next steps

- Learn about [application packages](batch-application-packages.md) as an alternative to resource files.
- For more information about using containers for resource files, see [Container workloads](batch-docker-container-workloads.md).
- To learn how to gather and save the output data from your tasks, see [Persist job and task output](batch-task-output.md).
- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
