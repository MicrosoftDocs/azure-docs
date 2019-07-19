---
title: Manage directory and file access permissions in Azure Storage by using .NET
description: Use the Azure Storage Client Library for .NET to manage directory and file access permissions in Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.date: 06/26/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Managed directory and file access permissions in Azure Storage by using .NET

This article shows you how to use the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).NET to manage directory and file access permissions in storage accounts that have a hierarchical namespace. 

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

## Get the access control list (ACL) for a directory

Get the access permissions of a directory by calling the **cloudBlobDirectory.FetchAccessControlsAsync** method. 

This populates the **CloudBlobDirectory.PathProperties** property with the access control list (ACL) of the directory. 

You can use the **CloudBlobDirectory.PathProperties.ACL** property to get the short form of ACL. 

This example gets the ACL of the `my-directory` directory and then prints the short form of ACL to the console.

```cs
public async Task GetDirectoryACLs(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.FetchAccessControlsAsync();

            string ACLs = "";

            foreach (PathAccessControlEntry entry in cloudBlobDirectory.PathProperties.ACL)
            {
                ACLs = ACLs + entry.ToString() + " ";
            }

            Console.WriteLine(ACLs);
        }
    }
}
```

The short form of an ACL might look something like the following:

`user::rwx group::r-x other::--`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Set the ACL for a directory

Set the **Execute**, **Read**, and **Write** property for the owning user, owning group, or other users. Then, call the **CloudBlobDirectory.SetAcl** method to commit the setting. 

This example gives read access to all users.

```cs
public async Task SetDirectoryACLs(CloudBlobClient cloudBlobClient,
    string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.FetchAccessControlsAsync();


            foreach (PathAccessControlEntry entry in cloudBlobDirectory.PathProperties.ACL)
            {
                switch (entry.AccessControlType)
                {
                    case AccessControlType.Other:
                        entry.Permissions.Read = true;
                        break;

                    case AccessControlType.Group:
                        // set permissions for the owning group.
                        break;

                    case AccessControlType.User:
                        // set permissions for the owning user.
                        break;
                }
  
            }

            cloudBlobDirectory.SetAcl();
        }
    }
}
```
For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).


## Get the ACL of a file

Get the access permissions of a file by calling the **CloudBlockBlob.FetchAccessControlsAsync** method. 

This populates the **CloudBlockBlob.PathProperties** property with the access control list (ACL) of the file. 

You can use the **CloudBlockBlob.PathProperties.ACL** property to get the short form of ACL. 

This example gets the ACL of a file and then prints the short form of ACL to the console.

```cs
public async Task GetFileACL(CloudBlobClient cloudBlobClient,
    string containerName, string blobName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            CloudBlockBlob cloudBlockBlob =
                cloudBlobDirectory.GetBlockBlobReference(blobName);

            await cloudBlockBlob.FetchAccessControlsAsync();

            string ACLs = "";

            foreach (PathAccessControlEntry entry in cloudBlockBlob.PathProperties.ACL)
            {
                ACLs = ACLs + entry.ToString() + " ";
            }

            Console.WriteLine(ACLs);
        }
    }

}
```

The short form of an ACL might look something like the following:

`user::rwx group::r-x other::--`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Set the ACL of a file

Set the **Execute**, **Read**, and **Write** property for the owning user, owning group, or other users. Then, call the **CloudBlockBlob.SetAcl** method to commit the setting. 

This example gives read access to all users.

```cs
public async Task SetFileACL(CloudBlobClient cloudBlobClient,
    string containerName, string blobName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            CloudBlockBlob cloudBlockBlob =
                cloudBlobDirectory.GetBlockBlobReference(blobName);

            await cloudBlockBlob.FetchAccessControlsAsync();


            foreach (PathAccessControlEntry entry in cloudBlockBlob.PathProperties.ACL)
            {
                switch (entry.AccessControlType)
                {
                    case AccessControlType.Other:
                        entry.Permissions.Read = true;
                        break;

                    case AccessControlType.Group:
                        // set permissions for the owning group.
                        break;

                    case AccessControlType.User:
                        // set permissions for the owning user.
                        break;
                }

            }

            cloudBlockBlob.SetAcl();

        }
    }

}
```

[!INCLUDE [storage-blob-dotnet-resources](../../../includes/storage-blob-dotnet-resources.md)]