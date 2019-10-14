---
title: Create and manage directories in Azure Storage by using code
description: Use the Azure Storage Client Library to create and managed directories in Azure Blob storage accounts that have a hierarchical namespace
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Create and manage directories in Azure Storage by using code

This article shows you how to use .NET, Java, or Python to manage directories in storage accounts that have a hierarchical namespace.

To learn how to set POSIX access control lists (ACL) on files and directories. See [Manage file and directory level permissions in Azure Storage by using code](data-lake-storage-develop-acl.md).

To learn how to work with containers and files, see the [.NET](storage-quickstart-blobs-dotnet.md), [Java](storage-quickstart-blobs-dotnet.md), or [Python](storage-quickstart-blobs-python.md) quickstart articles.

> [!NOTE]
>  The .NET, Java, and Python quickstart articles use terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is represented as a *blob*, and a *file system* is represented as a *container*.

## Connect to the storage account

# [.NET](#tab/dotnet)

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

# [Java](#tab/java)

First, parse the connection string by calling the [CloudStorageAccount.parse](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.parse?view=azure-java-legacy) method. 

Then, create an object that represents Blob storage in your storage account by calling the [createCloudBlobClient](https://docs.microsoft.com/java/api/com.microsoft.azure.storage._cloud_storage_account.createcloudblobclient?view=azure-java-legacy) method.

```java

CloudStorageAccount storageAccount = CloudStorageAccount.parse("<connection-string>");

cloudBlobClient = storageAccount.createCloudBlobClient();

```

Replace the `<connection-string>` placeholder value with the connection string of your storage account.  

# [Python](#tab/python)

Create an object that represents Blob storage in your storage account by creating an instance of a [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice.blockblobservice?view=azure-python). 

```python
def initialize_storage_account(storage_account_name, storage_account_key):
    try:
       global block_blob_service

       block_blob_service = BlockBlobService(account_name=storage_account_name, account_key=storage_account_key)

    except Exception as e:
        print(e)
```
 
- Replace the `storage_account_name` placeholder value with the name of your storage account.

- Replace the `storage-account-key` placeholder value with your storage account access key.

---

## Create a directory

# [.NET](#tab/dotnet)

Create a directory reference by calling the **GetDirectoryReference** method.

Create a directory by using the **CloudBlobDirectory.CreateAsync** method. 

This example adds a directory named `my-directory` to a container, and then adds a sub-directory named `my-subdirectory`. 

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

        if (cloudBlobDirectory != null)
        {
            await cloudBlobDirectory.CreateAsync();

            await cloudBlobDirectory.GetDirectoryReference("my-subdirectory").CreateAsync();
        }
    }
}
```

# [Java](#tab/java)

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

# [Python](#tab/python)

Add a directory by calling the **BlockBlobService.create_directory** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the new directory.

This example adds a directory named `my-directory` to a container. 

```python
def create_directory(container_name):
    try:

        block_blob_service.create_directory(container_name, "my-directory")

    except Exception as e:
        print(e)
```

---

## Rename a directory

# [.NET](#tab/dotnet)

Rename a directory by calling the **CloudBlobDirectory.MoveAsync** method. Pass the uri of the desired directory location as a parameter. 

This example renames a sub-directory to the name `my-directory-renamed`.

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

# [Java](#tab/java)

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

# [Python](#tab/python)

Rename a directory by calling the **BlockBlobService.rename_path** method. Pass these items as parameters to the method:

- The name of the container.
- The path that you want to give the directory.
- The path of the existing directory.

This example renames the directory `my-directory` to the name `my-new-directory`.

```python
def rename_directory(container_name):
  
    try:

        block_blob_service.rename_path(container_name,"my-new-directory","my-directory")

    except Exception as e:
        print(e)) 
```

---

## Move a directory

# [.NET](#tab/dotnet)

You can also use the **CloudBlobDirectory.MoveAsync** method to move a directory. Pass the uri of the desired directory location as a parameter to this method. 

This example moves a directory named `my-directory` to a sub-directory of a directory named `my-directory-2`. 

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

}
```

# [Java](#tab/java)

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

# [Python](#tab/python)

Move a directory by calling the **BlockBlobService.rename_path** method. Pass these items as parameters to the method:

- The name of the container.
- The path that you want to give the directory.
- The path of the existing directory.


This example moves a directory named `my-directory` to a sub-directory of another directory named `my-directory-2`. 

```python
def rename_directory(container_name):
  
    try:

        block_blob_service.rename_path(container_name, "my-directory", "my-directory-2/my-directory") )

    except Exception as e:
        print(e)) 

```

---

## Delete a directory

# [.NET](#tab/dotnet)

Delete a directory by calling the **CloudBlobDirectory.Delete** method.

This example deletes a directory named `my-directory`.  

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

# [Java](#tab/java)

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

# [Python](#tab/python)

Delete a directory by calling the **BlockBlobService.delete_directory** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the directory that you want to delete.

This method deletes a directory named `my-directory`.  

```python
def delete_directory(container_name):
  
    try:

        block_blob_service.delete_directory(container_name, "my-directory")

    except Exception as e:
        print(e)
```

---

## Upload a file to a directory

# [.NET](#tab/dotnet)

First, create a blob reference in the target directory by calling the **CloudBlobDirectory.GetBlockBlobReference** method. That method returns a **CloudBlockBlob** object. Upload a file by calling the **UploadFromFileAsync** method of a **CloudBlockBlob** object.

This example uploads a file to a directory named `my-directory`.    

```cs
public async Task UploadFileToDirectory(CloudBlobClient cloudBlobClient,
    string sourceFilePath, string containerName, string blobName)
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

            await cloudBlockBlob.UploadFromFileAsync(sourceFilePath);
        }
    }
}
```

# [Java](#tab/java)

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

# [Python](#tab/python)

Upload a file to a directory by calling the **BlockBlobService.create_blob_from_path** method. Pass these items as parameters to the method:

- The name of the container.
- The path to the location in your container where you want to place this file along with the name of the file.
- The path to the local file that you want to upload.

This example uploads a file named `my-file.txt` to a directory named `my-directory`.

```python
def upload_file_to_directory(container_name, file_name):

        # Upload the created file, use local_file_name for the blob name
        block_blob_service.create_blob_from_path(container_name, "my-directory/my-file.txt", file_name)
```

---

## Download a file from a directory 

# [.NET](#tab/dotnet)

First, create a blob reference in the source directory by calling the **CloudBlobDirectory.GetBlockBlobReference** method. That method returns a **CloudBlockBlob** object. Download that blob by calling the **DownloadToFileAsync** method of a **CloudBlockBlob** object.

This example downloads a file from a directory named `my-directory`.

```cs
public async Task DownloadFileFromDirectory(CloudBlobClient cloudBlobClient,
    string containerName, string blobName, string destinationFile)
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

            await cloudBlockBlob.DownloadToFileAsync(destinationFile, FileMode.Create);
        }


    }
}
```

# [Java](#tab/java)

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

# [Python](#tab/python)

Download a file from a directory by calling the **BlockBlobService.get_blob_to_path** method. Pass these items as parameters to the method:

- The name of the container.
- The path to the file in your storage account. 
- The path to the local file system where you want to download this file along with the name that you want to give the downloaded file.

```python
def download_file_from_directory(container_name, file_destination_path):

    block_blob_service.get_blob_to_path(container_name, "my-directory/my-file.txt", file_destination_path)
```

---

## List the contents of a directory

# [.NET](#tab/dotnet)

To list containers in your storage account, call one of the following methods of a **CloudBlobDirectory** object:

- **ListBlobsSegmented**
- **ListBlobsSegmentedAsync**

The overloads for these methods provide additional options for managing how the contents of a directory are returned by the listing operation. To learn more about these listing options, see [Understand container listing options](storage-blob-containers-list.md#understand-container-listing-options).

This example asynchronously lists the contents of a directory by calling the **CloudBlobDirectory.ListBlobsSegmentedAsync** method. This example uses the continuation token to get the next segment of result.

```cs
public async Task ListFilesInDirectory(CloudBlobClient cloudBlobClient, string containerName)
{
    CloudBlobContainer cloudBlobContainer =
        cloudBlobClient.GetContainerReference(containerName);

    if (cloudBlobContainer != null)
    {

        CloudBlobDirectory cloudBlobDirectory =
            cloudBlobContainer.GetDirectoryReference("my-directory");

        if (cloudBlobDirectory != null)
        {
            BlobContinuationToken blobContinuationToken = null;
            do
            {
                var resultSegment = await cloudBlobDirectory.ListBlobsSegmentedAsync(blobContinuationToken);

                // Get the value of the continuation token returned by the listing call.
                blobContinuationToken = resultSegment.ContinuationToken;
                foreach (IListBlobItem item in resultSegment.Results)
                {
                    Console.WriteLine(item.Uri);
                }
            } while (blobContinuationToken != null);
            // Loop while the continuation token is not null.
        }

    }

}
```

# [Java](#tab/java)

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

# [Python](#tab/python)

List the contents of a directory by calling the **BlockBlobService.list_blobs** method.

```python
def list_directory_contents():
    print("\nList blobs in the 'my-directory' directory")
    generator = block_blob_service.list_blobs("mycontainer/my-directory")
    for blob in generator:
        print("\t Blob name: " + blob.name)
```

---

## Sample

Put link to github sample here along with some explanatory text.

## Next steps

Learn to set access control lists on files and directories. See [Manage file and directory level permissions in Azure Storage by using code](data-lake-storage-develop-acl.md).

Explore more APIs. 

# [.NET](#tab/dotnet)

The links below provide useful resources for developers using the Azure Storage client library for .NET.

### Azure Storage common APIs

- [API reference documentation](/dotnet/api/overview/azure/storage/client)
- [Library source code](https://github.com/Azure/azure-storage-net/tree/master/Common)
- [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Storage.Common/)

### Blob storage APIs

- [API reference documentation](/dotnet/api/overview/azure/storage/client)
- [Library source code](https://github.com/Azure/azure-storage-net/tree/master/Blob)
- [Package (NuGet) for version 11.x](https://www.nuget.org/packages/Microsoft.Azure.Storage.Blob/)
- [Package (NuGet) for version 12.x-preview](https://www.nuget.org/packages/Azure.Storage.Blobs)
- [Samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=dotnet&term=blob)

### .NET tools

- [.NET](https://dotnet.microsoft.com/download/)
- [Visual Studio](https://visualstudio.microsoft.com/)

# [Java](#tab/java)

See the [com.microsoft.azure.storage.blob](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.blob?view=azure-java-preview) namespace of the [Azure Storage libraries for Java](https://docs.microsoft.com/java/api/overview/azure/storage?view=azure-java-preview) docs. 

# [Python](#tab/python)

See the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.

---

