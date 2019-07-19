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

> [!NOTE]
> The content featured in this article uses terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*.

## Connect to the storage account 

Comment here.

```java

CloudStorageAccount storageAccount = CloudStorageAccount.parse("<connection-string>");

cloudBlobClient = storageAccount.createCloudBlobClient();

```

Replace the `<connection-string>` placeholder value with the connection string of your storage account.  


## Get the access control list (ACL) for a directory

Intro text here

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

## Set the ACL for a directory

Intro text here

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

Comment

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

Comment

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