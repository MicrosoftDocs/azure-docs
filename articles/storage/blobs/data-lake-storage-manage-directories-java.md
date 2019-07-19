---
title: Create and manage directories in Azure Storage by using Java
description: Use the Azure Storage libraries for Java to create and manage directories in Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Create and manage directories in Azure Storage by using Java

This article shows you how to use Java to manage directories in storage accounts that have a hierarchical namespace. 

> [!NOTE]
> The content featured in this article uses terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*. 

## Connect to the storage account 

Comment here.

```java

CloudStorageAccount storageAccount = CloudStorageAccount.parse("<connection-string>");

cloudBlobClient = storageAccount.createCloudBlobClient();

```

Replace the `<connection-string>` placeholder value with the connection string of your storage account. 


## Create a directory

Intro text here

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

## Move a directory

Intro text here

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

            // Need snippet here. Question pending.

            }

        }
   }

}
```

## Rename a directory

Intro text here

```java
static void RenameDirectory(CloudBlobClient cloudBlobClient, String containerName)
    throws URISyntaxException, StorageException {

    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.getContainerReference(containerName);

    if (cloudBlobContainer != null){
        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.getDirectoryReference("my-directory-2/my-directory");

        if (cloudBlobDirectory != null){
            // Need snippet here. Question pending. 

        }
    }

} 
```

## Delete a directory

Intro text here

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

## Upload a file to a directory

Intro text here

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

## Download a file from a directory

Intro text here

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

Intro text here

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