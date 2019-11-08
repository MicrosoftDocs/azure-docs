---
title: Manage directories, files, and permissions in Azure Data Lake Storage Gen2 (Java)
description: Use Azure Storage libraries for Java to manage directories and file and directory access control lists (ACL) in storage accounts that have a hierarchical namespace.
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: conceptual
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Manage directories, files, and permissions in Azure Data Lake Storage Gen2 (Java)

This article shows you how to use Java to create and manage directories, files, and permissions in storage accounts that have a hierarchical namespace. To create an account, see [Create an Azure Data Lake Storage Gen2 storage account](data-lake-storage-quickstart-create-account.md).

[API reference documentation](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake) | [Package (Maven)](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake/12.0.0-preview.6/jar) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake/src/samples/java/com/azure/storage/file/datalake)

## Set up your project

To get started, open the *pom.xml* file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-storage-file-datalake</artifactId>
  <version>12.0.0-preview.6</version>
</dependency>
```

Then, add these imports statements to your code file.

```java
import com.azure.storage.common.StorageSharedKeyCredential;
import com.azure.storage.file.datalake.DataLakeDirectoryClient;
import com.azure.storage.file.datalake.DataLakeFileClient;
import com.azure.storage.file.datalake.DataLakeFileSystemClient;
import com.azure.storage.file.datalake.DataLakeServiceClient;
import com.azure.storage.file.datalake.DataLakeServiceClientBuilder;
import com.azure.storage.file.datalake.models.ListPathsOptions;
import com.azure.storage.file.datalake.models.PathAccessControl;
import com.azure.storage.file.datalake.models.PathAccessControlEntry;
import com.azure.storage.file.datalake.models.PathItem;
import com.azure.storage.file.datalake.models.PathPermissions;
import com.azure.storage.file.datalake.models.RolePermissions;
```

## Connect to the account 

To use the snippets in this article, you'll need to create a [CloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob_client?view=azure-java-legacy) instance that represents the storage account. The easiest way to get one is to use a connection string. 

This example parses a connection string by calling the [CloudStorageAccount.parse](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.parse?view=azure-java-legacy) method, and then creates a [CloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob._cloud_blob_client?view=azure-java-legacy) instance by calling the [createCloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.createcloudblobclient?view=azure-java-legacy) method.

```java

static public DataLakeServiceClient GetDataLakeServiceClient
(String accountName, String accountKey){

    StorageSharedKeyCredential sharedKeyCredential =
        new StorageSharedKeyCredential(accountName, accountKey);

    DataLakeServiceClientBuilder builder = new DataLakeServiceClientBuilder();

    builder.credential(sharedKeyCredential);
    builder.endpoint("https://" + accountName + ".dfs.core.windows.net");

    return builder.buildClient();
}      

```
### Create a file system

Put some text here.

```java
static public DataLakeFileSystemClient CreateFileSystem
(DataLakeServiceClient serviceClient){

    return serviceClient.createFileSystem("my-file-system");
}
```

## Create a directory

Create a directory reference by calling the **getDirectoryReference** method.

Create a directory by using the **CloudBlobDirectory.create** method.. 

This example adds a directory named `my-directory` to a container, and then adds a sub-directory named `my-subdirectory` to the directory named `my-directory`. 

```java
static public DataLakeDirectoryClient CreateDirectory
(DataLakeServiceClient serviceClient, String fileSystemName){
    
    DataLakeFileSystemClient fileSystemClient =
    serviceClient.getFileSystemClient(fileSystemName);

    DataLakeDirectoryClient directoryClient =
        fileSystemClient.createDirectory("my-directory");

    return directoryClient.createSubDirectory("my-subdirectory");
}
```

## Rename a directory

Rename a directory by calling the **CloudBlobDirectory.move** method. Pass a reference to a new directory as a parameter.

This example changes the name of a directory to the name `my-directory-renamed`.

```java
static public DataLakeDirectoryClient
    RenameDirectory(DataLakeFileSystemClient fileSystemClient){

    DataLakeDirectoryClient directoryClient =
        fileSystemClient.getDirectoryClient("my-directory/my-subdirectory");

    return directoryClient.rename("my-directory/my-subdirectory-renamed");
}
```

## Move a directory

You can also use the **CloudBlobDirectory.move** method to move a directory. Pass a reference to a new directory as a parameter.

This example moves a directory named `my-directory` to a sub-directory of a directory named `my-directory-2`.

```java
static public DataLakeDirectoryClient MoveDirectory
(DataLakeFileSystemClient fileSystemClient){

    DataLakeDirectoryClient directoryClient =
        fileSystemClient.getDirectoryClient("my-directory/my-subdirectory-renamed");

    return directoryClient.rename("my-directory-2/my-subdirectory-renamed");                
}
```

## Delete a directory

Delete a directory by calling the **CloudBlobDirectory.delete** method.

This example deletes a directory named `my-directory`. 

```java
static public void DeleteDirectory(DataLakeFileSystemClient fileSystemClient){
        
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.getDirectoryClient("my-directory");

    directoryClient.delete();
}
```

## Manage a directory ACL

Put something here.

```java
static public void ManageDirectoryACLs(DataLakeFileSystemClient fileSystemClient){

    DataLakeDirectoryClient directoryClient =
        fileSystemClient.getDirectoryClient("my-directory");

    PathAccessControl directoryAccessControl =
        directoryClient.getAccessControl();

    System.out.println(directoryAccessControl.getAcl());

    directoryAccessControl.setAcl("user::rwx,group::r-x,other::rw-");
        
    directoryClient.setAccessControl(directoryAccessControl);

    System.out.println(directoryAccessControl.getAcl());

}

```

## Upload a file to a directory

First, create a blob reference in the target directory by calling the **CloudBlobDirectory.getBlockBlobReference** method. Upload a file by calling the **uploadFromFile** method of a **CloudBlockBlob** object.

This example uploads a file to a directory named `my-directory`

```java
static public void UploadFile(DataLakeFileSystemClient fileSystemClient) 
    throws FileNotFoundException{
        
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.getDirectoryClient("my-directory");

    DataLakeFileClient fileClient = directoryClient.createFile("uploaded-file.txt");

    File file = new File("C:\\Users\\normesta\\Norms-Test-Projects\\mytestfile.txt");

    InputStream targetStream = new FileInputStream(file);

    long fileSize = file.length();

    fileClient.append(targetStream, 0, fileSize);

    fileClient.flush(fileSize);
}
```

## Manage a file ACL

Put something here.

```java
static public void ManageFileACLs(DataLakeFileSystemClient fileSystemClient){

    DataLakeDirectoryClient directoryClient =
        fileSystemClient.getDirectoryClient("my-directory");

    DataLakeFileClient fileClient = 
        directoryClient.getFileClient("hello.txt");

    PathAccessControl fileAccessControl =
        fileClient.getAccessControl();

    System.out.println(fileAccessControl.getAcl());

    fileAccessControl.setAcl("user::rwx,group::r-x,other::rw-");
        
    fileClient.setAccessControl(fileAccessControl);

    System.out.println(fileAccessControl.getAcl());

}
```

## Download from a directory

First, create a blob reference in the source directory by calling the **CloudBlobDirectory.getBlockBlobReference** method. That method returns a **CloudBlockBlob** object. Download that blob by calling the **downloadToFileAsync** method of a **CloudBlockBlob** object.

```java
static public void DownloadFile(DataLakeFileSystemClient fileSystemClient)
    throws FileNotFoundException, java.io.IOException{

    DataLakeDirectoryClient directoryClient =
        fileSystemClient.getDirectoryClient("my-directory");

    DataLakeFileClient fileClient = 
        directoryClient.getFileClient("uploaded-file.txt");

    File file = new File("C:\\Users\\normesta\\Norms-Test-Projects\\downloadedFile.txt");

    OutputStream targetStream = new FileOutputStream(file);

    fileClient.read(targetStream);

    targetStream.close();

    fileClient.flush(file.length());
        
}

```

## List directory contents

To list containers in your storage account, call the **CloudBlobDirectory.listBlobsSegmented**.

This example asynchronously lists the contents of a directory by calling the **CloudBlobDirectory.ListBlobsSegmented** method.

This example uses the continuation token to get the next segment of result.

```java
static public void ListFilesInDirectory(DataLakeFileSystemClient fileSystemClient){
        
    ListPathsOptions options = new ListPathsOptions();
    options.setPath("my-directory");
     
    PagedIterable<PathItem> pagedIterable = 
    fileSystemClient.listPaths(options, null);

    java.util.Iterator<PathItem> iterator = pagedIterable.iterator();

       
    PathItem item = iterator.next();

    while (item != null)
    {
        System.out.println(item.getName());


        if (!iterator.hasNext())
        {
            break;
        }
            
        item = iterator.next();
    }

}
```

## See also

Explore more APIs in the [com.microsoft.azure.storage.blob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-preview) namespace of the [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-preview) docs.