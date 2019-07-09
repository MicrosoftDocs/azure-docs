---
title: Use .NET with Azure Data Lake Storage Gen2
description: Use the Azure Storage Client Library for .NET to interact with Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.date: 06/26/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Use .NET with Azure Data Lake Storage Gen2

This guide shows you how to use .NET to interact with objects, manage directories, and set directory-level access permissions (access-control lists) in storage accounts that have a hierarchical namespace. 

To use the snippets presented in this article, you'll need to create a storage account, and then enable the hierarchical namespace feature on that account. See [Create a storage account](data-lake-storage-quickstart-create-account.md).

> [!NOTE]
> The content featured in this article uses terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*. 

## Set up your development environment

What you install depends on the operating system that you are running on your development computer.

### Windows

* Install [.NET Core for Windows](https://www.microsoft.com/net/download/windows) or the [.NET Framework](https://www.microsoft.com/net/download/windows) (included with Visual Studio for Windows)

* Install [Visual Studio for Windows](https://www.visualstudio.com/). If you are using .NET Core, installing Visual Studio is optional. 

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

### Linux

* Install [.NET Core for Linux](https://www.microsoft.com/net/download/linux)

* Optionally install [Visual Studio Code](https://www.visualstudio.com/) and the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp&dotnetid=963890049.1518206068)

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

### macOS

* Install [.NET Core for macOS](https://www.microsoft.com/net/download/macos).

* Optionally install [Visual Studio for Mac](https://www.visualstudio.com/vs/visual-studio-mac/)

* Install the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet).

## Add library references to your code file

Add these using statements to your code file.

```cs
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
```
## Connect to the storage account 

First, parse the connection string by calling the [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method. 

Then, create an object that represents Blob storage in your storage account by calling the [CloudStorageAccount.CreateCloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient?view=azure-dotnet) method.

```cs
public bool GetBlobClient(ref CloudBlobClient cloudBlobClient, string storageConnectionString)
{
    if (CloudStorageAccount.TryParse
        (storageConnectionString, out CloudStorageAccount storageAccount))
        {
            cloudBlobClient = storageAccount.CreateCloudBlobClient();

            return true;
        }
        else
        {
            return false;
        }
    }
}
```

### APIs featured in this snippet 

> [!div class="checklist"] 
> * [CloudStorageAccount.TryParse](/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.tryparse) method 
> * [CloudStorageAccount.CreateCloudBlobClient](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient?view=azure-dotnet) method

## Perform common blob tasks 

You can use the same set of APIs to interact with your data objects regardless of whether the account has a hierarchical namespace. To find snippets that help you perform common tasks such as creating a container (file system), uploading and downloading blobs (files), and deleting blobs and containers, see [Quickstart: Use .NET to create a blob in object storage](storage-quickstart-blobs-dotnet.md).

The rest of this article presents snippets that help you perform tasks related only to accounts that have a hierarchical namespace. 

## Add directory to a file system (container)

Create a directory reference by calling the [CloudBlobContainer.GetDirectoryReference](https://www.microsoft.com) method.

Create a directory instance by calling the [CloudBlobDirectory.CreateAsync](https://www.microsoft.com) method.

This example adds a directory named `my-directory` to a container and then adds a sub-directory named `my-subdirectory` to the directory named `my-directory`. 

```cs
public async Task CreateDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        await cloudBlobDirectory.CreateAsync();

        await cloudBlobDirectory.GetDirectoryReference("my-subdirectory").CreateAsync();
    }
}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [CloudBlobClient.GetContainerReference](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient.getcontainerreference?view=azure-dotnet) method.
> * [CloudBlobContainer.GetDirectoryReference](https://www.microsoft.com) method.
> * [CloudBlobDirectory.CreateAsync](https://www.microsoft.com) method.

## Rename or move a directory

Move or rename a directory by calling the [Put method here](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path that you want to give the directory.

* The path of the existing directory.

This example moves a directory named `my-directory` to a sub-directory of another directory named `my-directory-2`. 

```cs
public async Task MoveDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        // Get source directory
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            // Get destination directory
            CloudBlobDirectory cloudBlobDestinationDirectory =
                cloudBlobContainer.GetDirectoryReference("my-directory-2");

            if (cloudBlobDestinationDirectory != null)
            {
                await cloudBlobDirectory.MoveAsync(new Uri(cloudBlobDestinationDirectory.Uri.AbsoluteUri + "my-directory/"));
            }

        }
    }
```

This example renames that sub-directory to `my-directory-renamed`.

```cs
public async Task RenameDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory-2/my-directory");

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.MoveAsync(new Uri(cloudBlobContainer.Uri.AbsoluteUri + 
                "/my-directory-2/my-directory-renamed"));

        }
    }

}
```

### APIs featured in this snippet

> * [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice.blockblobservice?view=azure-python) class
> * [BlockBlobService.rename_path](https://www.microsoft.com) method.

## Delete a directory from a file system (container)

The following example deletes a directory by calling the [Put method here](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path of the directory that you want to delete.

This method deletes a directory named `my-directory` from the `my-directory-2` directory.  

```cs
public void DeleteDirectory(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory-2/my-directory");

        if (cloudBlobDirectory != null)
        {
            cloudBlobDirectory.Delete();
        }
    }

}
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice.blockblobservice?view=azure-python) class
> * [BlockBlobService.service.delete_directory](https://www.microsoft.com) method.

## Get the access permissions of a directory

Get the access permissions of a directory by calling the [BlockBlobService.get_path_access_control](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path of the directory.

The following example returns a [PathProperties](https://www.microsoft.com) instance that contains the access control list (ACL) of the directory.

This example gets the ACL of the `my-directory` directory and then prints the short form of ACL to the console.

```python
public virtual void FetchAccessControls(BlobRequestOption options = null, AccessCondition accessCondition = null, OperationContext operationContext = null, bool? upn = null)
```

The short form of an ACL might look something like the following:

`user::rwx,group::r-x,other::---`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Set the access permissions of a directory

Set the access permissions of a directory by calling the [BlockBlobService.set_directory_permissions](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path of the directory.

* The short form of the desired ACL.

This example gives read access to all users.

```python
    public virtual void SetAcl(BlobRequestOptions options = null, AccessCondition accessCondition = null, OperationContext operationContext = null)
```

For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

### APIs featured in this snippet

> [!div class="checklist"]
> * [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice.blockblobservice?view=azure-python) class
> * [BlockBlobService.set_path_access_control](https://www.microsoft.com) method.

## Next steps

Explore more APIs in the [Microsoft.WindowsAzure.Storage.Blob](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob?view=azure-dotnet) namespace of the [Azure Storage APIs for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/storage?view=azure-dotnet) docs.