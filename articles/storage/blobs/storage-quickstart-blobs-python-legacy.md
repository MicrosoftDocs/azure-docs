---
title: 'Quickstart: Azure Blob storage client library v2.1 for Python'
description: In this quickstart, you create a storage account and a container in object (Blob) storage. Then you use the storage client library v2.1 for Python to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
author: mhopkins-msft
ms.author: mhopkins
ms.date: 01/24/2020
ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.custom: seo-python-october2019, tracking-python
---

# Quickstart: Manage blobs with Python v2.1 SDK

In this quickstart, you learn to manage blobs by using Python. Blobs are objects that can hold large amounts of text or binary data, including images, documents, streaming media, and archive data. You'll upload, download, and list blobs, and you'll create and delete containers.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An Azure Storage account. [Create a storage account](../common/storage-account-create.md).
- [Python](https://www.python.org/downloads/).
- [Azure Storage SDK for Python](https://github.com/Azure/azure-sdk-for-python).

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Download the sample application

The [sample application](https://github.com/Azure-Samples/storage-blobs-python-quickstart.git) in this quickstart is a basic Python application.  

Use the following [git](https://git-scm.com/) command to download the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-python-quickstart.git 
```

To review the Python program, open the *example.py* file at the root of the repository.  

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Configure your storage connection string

In the application, provide your storage account name and account key to create a `BlockBlobService` object.

1. Open the *example.py* file from the Solution Explorer in your IDE.

1. Replace the `accountname` and `accountkey` values with your storage account name and key:

    ```python
    block_blob_service = BlockBlobService(
        account_name='accountname', account_key='accountkey')
    ```

1. Save and close the file.

## Run the sample

The sample program creates a test file in your *Documents* folder, uploads the file to Blob storage, lists the blobs in the file, and downloads the file with a new name.

1. Install the dependencies:

    ```console
    pip install azure-storage-blob==2.1.0
    ```

1. Go to the sample application:

    ```console
    cd storage-blobs-python-quickstart
    ```

1. Run the sample:

    ```console
    python example.py
    ```

    You’ll see messages similar to the following output:
  
    ```output
    Temp file = C:\Users\azureuser\Documents\QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

    Uploading to Blob storage as blobQuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

    List blobs in the container
             Blob name: QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

    Downloading blob to     C:\Users\azureuser\Documents\QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078_DOWNLOADED.txt
    ```

1. Before you continue, go to your *Documents* folder and check for the two files.

    * *QuickStart_\<universally-unique-identifier\>*
    * *QuickStart_\<universally-unique-identifier\>_DOWNLOADED*

1. You can open them and see they're the same.

    You can also use a tool like the [Azure Storage Explorer](https://storageexplorer.com). It's good for viewing the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that lets you access your storage account info. 

1. After you've looked at the files, press any key to finish the sample and delete the test files.

## Learn about the sample code

Now that you know what the sample does, open the *example.py* file to look at the code.

### Get references to the storage objects

In this section, you instantiate the objects, create a new container, and then set permissions on the container so the blobs are public. You'll call the container `quickstartblobs`. 

```python
# Create the BlockBlockService that the system uses to call the Blob service for the storage account.
block_blob_service = BlockBlobService(
    account_name='accountname', account_key='accountkey')

# Create a container called 'quickstartblobs'.
container_name = 'quickstartblobs'
block_blob_service.create_container(container_name)

# Set the permission so the blobs are public.
block_blob_service.set_container_acl(
    container_name, public_access=PublicAccess.Container)
```

First, you create the references to the objects used to access and manage Blob storage. These objects build on each other, and each is used by the next one in the list.

* Instantiate the **BlockBlobService** object, which points to the Blob service in your storage account. 

* Instantiate the **CloudBlobContainer** object, which represents the container you're accessing. The system uses containers to organize your blobs like you use folders on your computer to organize your files.

Once you have the Cloud Blob container, instantiate the **CloudBlockBlob** object that points to the specific blob that you're interested in. You can then upload, download, and copy the blob as you need.

> [!IMPORTANT]
> Container names must be lowercase. For more information about container and blob names, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs can be as large as 4.7 TB, and can be anything from Excel spreadsheets to large video files. You can use append blobs for logging when you want to write to a file and then keep adding more information. Page blobs are primarily used for the Virtual Hard Disk (VHD) files that back infrastructure as a service virtual machines (IaaS VMs). Block blobs are the most commonly used. This quickstart uses block blobs.

To upload a file to a blob, get the full file path by joining the directory name with the file name on your local drive. You can then upload the file to the specified path using the `create_blob_from_path` method. 

The sample code creates a local file the system uses for the upload and download, storing the file the system uploads as *full_path_to_file* and the name of the blob as *local_file_name*. This example uploads the file to your container called `quickstartblobs`:

```python
# Create a file in Documents to test the upload and download.
local_path = os.path.expanduser("~\Documents")
local_file_name = "QuickStart_" + str(uuid.uuid4()) + ".txt"
full_path_to_file = os.path.join(local_path, local_file_name)

# Write text to the file.
file = open(full_path_to_file, 'w')
file.write("Hello, World!")
file.close()

print("Temp file = " + full_path_to_file)
print("\nUploading to Blob storage as blob" + local_file_name)

# Upload the created file, use local_file_name for the blob name.
block_blob_service.create_blob_from_path(
    container_name, local_file_name, full_path_to_file)
```

There are several upload methods that you can use with Blob storage. For example, if you have a memory stream, you can use the `create_blob_from_stream` method rather than `create_blob_from_path`. 

### List the blobs in a container

The following code creates a `generator` for the `list_blobs` method. The code loops through the list of blobs in the container and prints their names to the console.

```python
# List the blobs in the container.
print("\nList blobs in the container")
generator = block_blob_service.list_blobs(container_name)
for blob in generator:
    print("\t Blob name: " + blob.name)
```

### Download the blobs


Download blobs to your local disk using the `get_blob_to_path` method.
The following code downloads the blob you uploaded previously. The system appends *_DOWNLOADED* to the blob name so you can see both files on your local disk.

```python
# Download the blob(s).
# Add '_DOWNLOADED' as prefix to '.txt' so you can see both files in Documents.
full_path_to_file2 = os.path.join(local_path, local_file_name.replace(
   '.txt', '_DOWNLOADED.txt'))
print("\nDownloading blob to " + full_path_to_file2)
block_blob_service.get_blob_to_path(
    container_name, local_file_name, full_path_to_file2)
```

### Clean up resources
If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using the `delete_container` method. To delete individual files instead, use the `delete_blob` method.

```python
# Clean up resources. This includes the container and the temp files.
block_blob_service.delete_container(container_name)
os.remove(full_path_to_file)
os.remove(full_path_to_file2)
```

## Resources for developing Python applications with blobs

For more about Python development with Blob storage, see these additional resources:

### Binaries and source code

- View, download, and install the [Python client library source code](https://github.com/Azure/azure-storage-python) for Azure Storage on GitHub.

### Client library reference and samples

- For more about the Python client library, see the [Azure Storage libraries for Python](https://docs.microsoft.com/python/api/overview/azure/storage).
- Explore [Blob storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=python&term=blob) written using the Python client library.

## Next steps
 
In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage using Python. 

For more about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
