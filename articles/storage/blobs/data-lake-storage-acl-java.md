---
title: Manage file and directory level permissions in Azure Storage by using Java
description: Use the Azure Storage libraries for Java to manage file and directory level permissions in Azure Blob storage accounts that have a hierarchical namespace.
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: conceptual
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Manage file and directory level permissions in Azure Storage by using Java

This article shows you how to use Java to get and set the access control lists (ACLs) of directories and files in storage accounts that have a hierarchical namespace.

To learn more about ACLs, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md). 

## Connect to the storage account 

First, parse the connection string by calling the [CloudStorageAccount.parse](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.parse?view=azure-java-legacy) method. 

Then, create an object that represents Blob storage in your storage account by calling the [createCloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.createcloudblobclient?view=azure-java-legacy) method.

```java

CloudStorageAccount storageAccount = CloudStorageAccount.parse("<connection-string>");

cloudBlobClient = storageAccount.createCloudBlobClient();

```

Replace the `<connection-string>` placeholder value with the connection string of your storage account.  

## Get the ACL of a directory

Get the ACL of a directory by calling the **CloudBlobDirectory.downloadSecurityInfo** method.

Call the **CloudBlobDirectory.getAccessControlList** method to return a collection of ACL entries.

This example gets the ACL of a directory named `my-directory` directory, and then prints the short form of the ACL to the console.

```java
static void GetDirectoryACL(CloudBlobClient cloudBlobClient, String containerName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

            cloudBlobDirectory.downloadSecurityInfo();

            if (cloudBlobDirectory != null){

                String ACL = "";

                for (PathAccessControlEntry entry :cloudBlobDirectory.getAccessControlList()) {
                     ACL = ACL + entry.toString();
                }

                 System.out.println(ACL);
            }
    }
}

```

The short form of an ACL might look something like the following:

`user::rwx group::r-x other::--`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. 

## Get the ACL of a file

Get the ACL of a file by calling the **CloudBlockBlob.downloadSecurityInfo** method.

Call the **CloudBlockBlob.getAccessControlList** method to return a collection of ACL entries.

This example gets the ACL of a file and then prints the short form of the ACL to the console.

```java
static void GetFileACL(CloudBlobClient cloudBlobClient, String containerName,
String blobName) throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

            if (cloudBlobDirectory != null){

                CloudBlockBlob cloudBlockBlob =
                cloudBlobDirectory.getBlockBlobReference(blobName);

                cloudBlockBlob.downloadSecurityInfo();

                if (cloudBlockBlob != null){

                    String ACL = "";

                    for (PathAccessControlEntry entry :cloudBlockBlob.getAccessControlList()) {
                        ACL = ACL + entry.toString();
                     }

                     System.out.println(ACL);
                }

            }
    }
}
```

## Set the ACL of a directory

Set the ACL of a directory by setting the permission of an existing entry in the access control list or by adding a new entry to the access control list.

This example gets the ACL of a directory named `my-directory` directory, and locates the entry for all users other than the owning group and owning user. Then, it modifies that entry to grant read access to those users.

```java
static void SetDirectoryACL(CloudBlobClient cloudBlobClient, String containerName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);


    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            cloudBlobDirectory.downloadSecurityInfo();

            RolePermissions perms = new RolePermissions();
            perms.setRead(true);

            for (PathAccessControlEntry entry :cloudBlobDirectory.getAccessControlList()) {
                if (entry.getAccessControlType() == AccessControlType.OTHER){
                    entry.setPermissions(perms);
                }
           }
            cloudBlobDirectory.uploadACL();
        }
     }
}
```

## Set the ACL of a file

Set the ACL of a file by setting the permission of an existing entry in the access control list or by adding a new entry to the access control list.

This example gets the ACL of a file, and locates the entry for all users other than the owning group and owning user. Then, it modifies that entry to grant read access to those users.

```java
static void SetFileACL(CloudBlobClient cloudBlobClient, String containerName, String blobName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            CloudBlockBlob cloudBlockBlob =
            cloudBlobDirectory.getBlockBlobReference(blobName);

            if (cloudBlockBlob != null){

                cloudBlockBlob.downloadSecurityInfo();

                RolePermissions perms = new RolePermissions();
                perms.setRead(true);

                for (PathAccessControlEntry entry :cloudBlockBlob.getAccessControlList()) {
                    if (entry.getAccessControlType() == AccessControlType.OTHER){
                        entry.setPermissions(perms);
                    }
                }

                cloudBlockBlob.uploadACL();
            }
        }
     }
}
```

## Next steps

Explore more APIs in the [com.microsoft.azure.storage.blob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-preview) namespace of the [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-preview) docs.