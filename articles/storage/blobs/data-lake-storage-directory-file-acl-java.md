---
title: Manage directories, files, and ACLs in Azure Data Lake Storage Gen2 (Java)
description: Use Azure Storage libraries for Java to manage directories and file and directory access control lists (ACL) in storage accounts that have a hierarchical namespace.
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: conceptual
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Manage directories, files, and ACLs in Azure Data Lake Storage Gen2 (Java)

This article shows you how to use Java to work with directories, files, and POSIX [access control lists](data-lake-storage-access-control.md) (ACLs) in storage accounts that have a hierarchical namespace. 

## Connect to the storage account 

To use the snippets in this article, you'll need to create a [CloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob_client?view=azure-java-legacy) instance that represents the storage account. The easiest way to get one is to use a connection string. 

This example parses a connection string by calling the [CloudStorageAccount.parse](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.parse?view=azure-java-legacy) method, and then creates a [CloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob_client?view=azure-java-legacy) instance by calling the [createCloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.createcloudblobclient?view=azure-java-legacy) method.

```java

CloudStorageAccount storageAccount = CloudStorageAccount.parse("<connection-string>");

cloudBlobClient = storageAccount.createCloudBlobClient();

```

Replace the `<connection-string>` placeholder value with the connection string of your storage account. 


## Create a directory

Create a directory reference by calling the **getDirectoryReference** method.

Create a directory by using the **CloudBlobDirectory.create** method.. 

This example adds a directory named `my-directory` to a container, and then adds a sub-directory named `my-subdirectory` to the directory named `my-directory`. 

```java
static void CreateDirectory(CloudBlobClient cloudBlobClient, String containerName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null){

        CloudBlobDirectory cloudBlobDirectory =
        cloudBlobContainer.getDirectoryReference("my-directory");

        cloudBlobDirectory.create();

        cloudBlobDirectory.getDirectoryReference("my-subdirectory").create();
    }
}
```

## Rename a directory

Rename a directory by calling the **CloudBlobDirectory.move** method. Pass a reference to a new directory as a parameter.

This example changes the name of a directory to the name `my-directory-renamed`.

```java
static void RenameDirectory(CloudBlobClient cloudBlobClient, String containerName)
    throws URISyntaxException, StorageException {

    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null){
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null){
            // Get destination directory
            CloudBlobDirectory cloudBlobDestinationDirectory =
                cloudBlobContainer.getDirectoryReference("my-directory-renamed");

            if (cloudBlobDestinationDirectory != null){

                cloudBlobDirectory.move(cloudBlobDestinationDirectory);
            }  

        }
    }

} 
```

## Move a directory

You can also use the **CloudBlobDirectory.move** method to move a directory. Pass a reference to a new directory as a parameter.

This example moves a directory named `my-directory` to a sub-directory of a directory named `my-directory-2`.

```java
static void MoveDirectory(CloudBlobClient cloudBlobClient, String containerName)
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null){

        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null){

            CloudBlobDirectory cloudBlobDestinationDirectory =
                cloudBlobContainer.getDirectoryReference("my-directory-2");

            if (cloudBlobDestinationDirectory != null){

                // Get destination directory
                CloudBlobDirectory cloudBlobDestinationDirectory =
                    cloudBlobContainer.getDirectoryReference("my-directory-2/my-directory");

                if (cloudBlobDestinationDirectory != null){

                    cloudBlobDirectory.move(cloudBlobDestinationDirectory);
                }

            }

        }
   }

}
```



## Delete a directory

Delete a directory by calling the **CloudBlobDirectory.delete** method.

This example deletes a directory named `my-directory`. 

```java
static void DeleteDirectory(CloudBlobClient cloudBlobClient, String containerName) 
throws URISyntaxException, StorageException{

    CloudBlobContainer cloudBlobContainer =
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null){

        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null){

            cloudBlobDirectory.delete(true);    
        }
    }    
}
```

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

## Upload a file to a directory

First, create a blob reference in the target directory by calling the **CloudBlobDirectory.getBlockBlobReference** method. Upload a file by calling the **uploadFromFile** method of a **CloudBlockBlob** object.

This example uploads a file to a directory named `my-directory`

```java
static void UploadFilesToDirectory(CloudBlobClient cloudBlobClient, 
String sourceFilePath, String containerName, String blobName)
throws URISyntaxException, StorageException, IOException{
    
    CloudBlobContainer cloudBlobContainer = 
    cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null){
       
        CloudBlobDirectory cloudBlobDirectory =
        cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null){
            
            CloudBlockBlob cloudBlockBlob = 
            cloudBlobDirectory.getBlockBlobReference(blobName);

            if (cloudBlockBlob != null){
                
                cloudBlockBlob.uploadFromFile(sourceFilePath);
            }            
         }  
    }
}
```

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

## Download a file from a directory

First, create a blob reference in the source directory by calling the **CloudBlobDirectory.getBlockBlobReference** method. That method returns a **CloudBlockBlob** object. Download that blob by calling the **downloadToFileAsync** method of a **CloudBlockBlob** object.

```java
static void GetFileFromDirectory(CloudBlobClient cloudBlobClient, 
String containerName, String blobName, String destinationFile)
throws URISyntaxException, StorageException, IOException{
    
    CloudBlobContainer cloudBlobContainer = 
         cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null){
        
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null){
            
            CloudBlockBlob cloudBlockBlob = 
            cloudBlobDirectory.getBlockBlobReference(blobName);

            if (cloudBlobDirectory != null){
                cloudBlockBlob.downloadToFile(destinationFile);
            }
        }
    }
}
```

## List the contents of a directory

To list containers in your storage account, call the **CloudBlobDirectory.listBlobsSegmented**.

This example asynchronously lists the contents of a directory by calling the **CloudBlobDirectory.ListBlobsSegmented** method.

This example uses the continuation token to get the next segment of result.

```java
static void ListDirectoryContents(CloudBlobClient cloudBlobClient, String containerName)
throws URISyntaxException, StorageException{
    
    CloudBlobContainer cloudBlobContainer = 
    cloudBlobClient.getContainerReference(containerName);

    ResultContinuation blobContinuationToken = null;

    if (cloudBlobContainer != null){

        CloudBlobDirectory cloudBlobDirectory =
        cloudBlobContainer.getDirectoryReference("my-directory");

        if (cloudBlobDirectory != null){

            ResultSegment<ListBlobItem> resultSegment = null;

            do
            {
                resultSegment = cloudBlobDirectory.listBlobsSegmented();
    
                blobContinuationToken = resultSegment.getContinuationToken();
        
                for (ListBlobItem item :resultSegment.getResults()){
                    System.out.println(item.getUri());
                }
            } while (blobContinuationToken != null); 
        }     
    } 
}
```

## Next steps

Explore more APIs in the [com.microsoft.azure.storage.blob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-preview) namespace of the [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-preview) docs.