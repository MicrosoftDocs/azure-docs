---
title: Manage directory and file access permissions in Azure Storage by using Java
description: Use the Azure Storage libraries for Java to manage directory and file access permissions in Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Managed directory and file access permissions in Azure Storage by using Java

This article shows you how to use Java to manage directory and file access permissions in storage accounts that have a hierarchical namespace. 

## Connect to the storage account 

Comment here.

```java

CloudStorageAccount storageAccount = CloudStorageAccount.parse("<connection-string>");

cloudBlobClient = storageAccount.createCloudBlobClient();

```

Replace the `<connection-string>` placeholder value with the connection string of your storage account.  


## Get the access control list (ACL) for a directory

Get the access permissions of a directory by calling the **CloudBlobDirectory.downloadSecurityInfo** method.

Call the **CloudBlobDirectory.getAccessControlList** method to return a collection of ACLs.

This example gets the ACL of the `my-directory` directory and then prints the short form of ACL to the console.

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

                String ACLs = "";

                for (PathAccessControlEntry entry :cloudBlobDirectory.getAccessControlList()) {
                     ACLs = ACLs + entry.toString();
                }

                 System.out.println(ACLs);
            }
    }
}

```

The short form of an ACL might look something like the following:

`user::rwx group::r-x other::--`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Set the ACL for a directory

Need to get a working example of this.

```java
static void SetDirectoryACL(CloudBlobClient cloudBlobClient, String containerName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null)
    {
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        cloudBlobDirectory.downloadSecurityInfo();

        if (cloudBlobDirectory != null)
        {
            PathPermissions pathPermissions  = new PathPermissions();
            RolePermissions otherPermission = new RolePermissions();
            otherPermission.setRead(true);
            pathPermissions.setOther(otherPermission);
            cloudBlobDirectory.setPermissions(pathPermissions);

            cloudBlobDirectory.uploadPermissions();
        }

    }

}
```

## Get the ACL of a file

Get the access permissions of a file by calling the **CloudBlockBlob.downloadSecurityInfo** method.

Call the **CloudBlockBlob.getAccessControlList** method to return a collection of ACLs.

This example gets the ACL of a file and then prints the short form of ACL to the console.

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

                    String ACLs = "";

                    for (PathAccessControlEntry entry :cloudBlockBlob.getAccessControlList()) {
                        ACLs = ACLs + entry.toString();
                     }
    
                     System.out.println(ACLs);
                }

            }
    }
}
```

## Set the ACL of a file

Need to get a working example of this

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

                PathPermissions pathPermissions  = new PathPermissions();
                RolePermissions otherPermission = new RolePermissions();
                otherPermission.setRead(true);
                pathPermissions.setOther(otherPermission);
                cloudBlockBlob.setPermissions(pathPermissions);

            }
            

        }
     }
}
```

## Next steps

Explore more APIs in the [com.microsoft.azure.storage.blob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-preview) namespace of the [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-preview) docs.