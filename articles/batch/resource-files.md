---
title: Creating and using resource files 
description: Learn how to create Batch resource files from various input sources. This article covers a few common methods on how to create and place them on a VM.
ms.date: 08/18/2021
ms.topic: how-to
---

# Creating and using resource files

An Azure Batch task often requires some form of data to process. Resource files are the way to provide this data to your Batch virtual machine (VM) via a task. All types of tasks support resource files: tasks, start tasks, job preparation tasks, job release tasks, etc. This article covers a few common methods of how to create resource files and place them on a VM.  

Resource files put data onto a VM in Batch, but the type of data and how it's used is flexible. There are, however, some common use cases:

- Provision common files on each VM using resource files on a start task.
- Provision input data to be processed by tasks.

Common files could be, for example, files on a start task used to install applications that your tasks run. Input data could be raw image or video data, or any information to be processed by Batch.

## Types of resource files

There are a few different options available to generate resource files, each with their own [methods](/dotnet/api/microsoft.azure.batch.resourcefile#methods). The creation process for resource files varies depending on where the original data is stored and whether multiple files should be created.

- [Storage container URL](#storage-container-url): Generates resource files from any storage container in Azure.
- [Storage container name](#storage-container-name-autostorage): Generates resource files from the name of a container in the Azure storage account linked to your Batch account (the autostorage account).
- [Single resource file from web endpoint](#single-resource-file-from-web-endpoint): Generates a single resource file from any valid HTTP URL.

### Storage container URL

Using a storage container URL means, with the correct permissions, you can access files in any storage container in Azure.

In this C# example, the files have already been uploaded to an Azure storage container as blob storage. To access the data needed to create a resource file, we first need to get access to the storage container. This can be done in several ways.

#### Shared Access Signature

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

Once the permissions are configured, create the SAS token and format the SAS URL for access to the storage container. Using the formatted SAS URL for the storage container, generate a resource file with [FromStorageContainerUrl](/dotnet/api/microsoft.azure.batch.resourcefile.fromstoragecontainerurl).

```csharp
CloudBlobContainer container = blobClient.GetContainerReference(containerName);

string sasToken = container.GetSharedAccessSignature(sasConstraints);
string containerSasUrl = String.Format("{0}{1}", container.Uri, sasToken);

ResourceFile inputFile = ResourceFile.FromStorageContainerUrl(containerSasUrl);
```

If desired, you can use the [blobPrefix](/dotnet/api/microsoft.azure.batch.resourcefile.blobprefix) property to limit downloads to only those blobs whose name begins with a specified prefix:

```csharp
ResourceFile inputFile = ResourceFile.FromStorageContainerUrl(containerSasUrl, blobPrefix = yourPrefix);
```

#### Managed identity

Create a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity) and assign it the `Storage Blob Data Reader` role for your Azure Storage container. Next, [assign the managed identity to your pool](managed-identity-pools.md) so that your VMs can access the identity. Finally, you can access the files in your container by specifying the identity for Batch to use.

```csharp
CloudBlobContainer container = blobClient.GetContainerReference(containerName);

ResourceFile inputFile = ResourceFile.FromStorageContainerUrl(container.Uri, identityReference: new ComputeNodeIdentityReference() { ResourceId = "/subscriptions/SUB/resourceGroups/RG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-name" });
```

#### Public access

An alternative to generating a SAS URL or using a managed identity is to enable anonymous, public read-access to a container and its blobs in Azure Blob storage. By doing so, you can grant read-only access to these resources without sharing your account key, and without requiring a SAS. Public access is typically used for scenarios where you want certain blobs to be always available for anonymous read-access. If this scenario suits your solution, see [Configure anonymous public read access for containers and blobs](../storage/blobs/anonymous-read-access-configure.md) to learn more about managing access to your blob data.

### Storage container name (autostorage)

Instead of configuring and creating a SAS URL, you can use the name of your Azure storage container to access your blob data. The storage container you use must be in the Azure storage account that's linked to your Batch account, sometimes referred to as the *autostorage account*. Using the autostorage container allows you to bypass configuring and creating a SAS URL to access a storage container. Instead, you provide the name of the storage container in your linked storage account.

If you don't have an autostorage account already, see the steps in [Create a Batch account](batch-account-create-portal.md) for details on how to create and link a storage account.

The following example uses [AutoStorageContainer](/dotnet/api/microsoft.azure.batch.resourcefile.fromautostoragecontainer) to generate the file from data in the autostorage account.

```csharp
ResourceFile inputFile = ResourceFile.FromAutoStorageContainer(containerName);
```

As with a storage container URL, you can use the [blobPrefix](/dotnet/api/microsoft.azure.batch.resourcefile.blobprefix) property to specify which blobs will be downloaded:

```csharp
ResourceFile inputFile = ResourceFile.FromAutoStorageContainer(containerName, blobPrefix = yourPrefix);
```

### Single resource file from web endpoint

To create a single resource file, you can specify a valid HTTP URL containing your input data. The URL is provided to the Batch API, and then the data is used to create a resource file. This method can be used whether the data to create your resource file is in Azure Storage, or in any other web location, such as a GitHub endpoint.

The following example uses [FromUrl](/dotnet/api/microsoft.azure.batch.resourcefile.fromurl) to retrieve the file from a string that contains a valid URL, then generates a resource file to be used by your task. No credentials are needed for this scenario. (Credentials are required if using blob storage, unless public read access is enabled on the blob container.)

```csharp
ResourceFile inputFile = ResourceFile.FromUrl(yourURL, filePath);
```

You can also use a string that you define as a URL (or a combination of strings that, together, create the full URL for your file).

```csharp
ResourceFile inputFile = ResourceFile.FromUrl(yourDomain + yourFile, filePath);
```

If your file is in Azure Storage, you can use a managed identity instead of generating a Shared Access Signature for the resource file.

```csharp
ResourceFile inputFile = ResourceFile.FromUrl(yourURLFromAzureStorage, 
    identityReference: new ComputeNodeIdentityReference() { ResourceId = "/subscriptions/SUB/resourceGroups/RG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-name"},
    filePath: filepath
);
```

> [!Note]
> Managed identity authentication will only work with files in Azure Storage. The nanaged identity needs the `Storage Blob Data Reader` role assignment for the container the file is in, and it must also be [assigned to the Batch pool](managed-identity-pools.md).

## Tips and suggestions

Azure Batch tasks can use files in many ways, which is why Batch provides various options for managing files on tasks. The following scenarios aren't meant to be comprehensive, but cover a few common situations and provide recommendations.

### Many resource files

If common task files are shared among many tasks in your Batch job, you may want to use an [application package](batch-application-packages.md) to contain those files. Application packages provide optimization for download speed, and data in application packages is cached between tasks. With application packages, you don't need to manually manage several resource files or generate SAS URLs to access the files in Azure Storage. Batch works in the background with Azure Storage to store and deploy application packages to compute nodes. If your task files don't change often, application packages may be a good fit for your solution.

Conversely, if your tasks each have many files unique to that task, resource files are likely the best option. Tasks that use unique files often need to be updated or replaced, which is not as easy to do with application package content. Resource files provide additional flexibility for updating, adding, or editing individual files.

### Number of resource files per task

When a task specifies several hundred resource files, Batch might reject the task as being too large. It's best to keep your tasks small by minimizing the number of resource files on the task itself.

If there's no way to minimize the number of files your task needs, you can optimize the task by creating a single resource file that references a storage container of resource files. To do this, put your resource files into an Azure Storage container and use one of the methods described above to generate resource files as needed.

## Next steps

- Learn about [application packages](batch-application-packages.md) as an alternative to resource files.
- Learn about [using containers](batch-docker-container-workloads.md) for resource files.
- Learn how to [gather and save the output data from your tasks](batch-task-output.md).
- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
