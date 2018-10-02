---
title: Azure Quickstart - Create a blob in object storage using Python | Microsoft Docs
description: In this quickstart, you create a storage account and a container in object (Blob) storage. Then you use the storage client library for Python to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage  
author: craigshoemaker
 

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 04/09/2018
ms.author: cshoe
---

# Quickstart: Upload, download, and list blobs using Python

In this quickstart, you learn how to use Python to upload, download, and list block blobs in a container in Azure Blob storage. 

## Prerequisites

To complete this quickstart: 
* Install [Python](https://www.python.org/downloads/)
* Download and install [Azure Storage SDK for Python](https://github.com/Azure/azure-sdk-for-python). 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

## Download the sample application
The [sample application](https://github.com/Azure-Samples/storage-blobs-python-quickstart.git) used in this quickstart is a basic Python application.  

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-python-quickstart.git 
```

This command clones the repository to your local git folder. To open the Python program, look for the storage-blobs-python-quickstart folder, and example.py file.  

[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Configure your storage connection string
In the application, you must provide your storage account name and account key to create a `BlockBlobService` object. Open the `example.py` file from the Solution Explorer in your IDE. Replace the **accountname** and **accountkey** values with your account name and key. 

```python 
block_blob_service = BlockBlobService(account_name='accountname', account_key='accountkey') 
```

## Run the sample
This sample creates a test file in the 'Documents' folder. The sample program uploads the test file to Blob storage, lists the blobs in the container, and downloads the file with a new name. 

First, install the dependencies by running `pip install`:

    pip install azure-storage

Next, run the sample. The following output is an example of the output returned when running the application:
  
```
Temp file = C:\Users\azureuser\Documents\QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

Uploading to Blob storage as blobQuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

List blobs in the container
         Blob name: QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

Downloading blob to C:\Users\azureuser\Documents\QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078_DOWNLOADED.txt
```
When you press any key to continue, the sample program deletes the storage container and the files. Before you continue, check your 'Documents' folder for the two files. You can open them and see they are identical.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the example.py file to look at the code. 

## Understand the sample code

Next, we walk through the sample code so that you can understand how it works.

### Get references to the storage objects
The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other, and each is used by the next one in the list.

* Instantiate the **BlockBlobService** object, which points to the Blob service in your storage account. 

* Instantiate the **CloudBlobContainer** object, which represents the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the Cloud Blob container, you can instantiate the **CloudBlockBlob** object that points to the specific blob in which you are interested, and perform operations such as upload, download, and copy.

> [!IMPORTANT]
> Container names must be lowercase. See [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata) for more information about container and blob names.

In this section, you instantiate the objects, create a new container, and then set permissions on the container so the blobs are public. The container is called **quickstartblobs**. 

```python 
# Create the BlockBlockService that is used to call the Blob service for the storage account
block_blob_service = BlockBlobService(account_name='accountname', account_key='accountkey') 
 
# Create a container called 'quickstartblobs'.
container_name ='quickstartblobs'
block_blob_service.create_container(container_name) 

# Set the permission so the blobs are public.
block_blob_service.set_container_acl(container_name, public_access=PublicAccess.Container)
```
### Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that is what is used in this quickstart.  

To upload a file to a blob, get the full path of the file by joining the directory name and the file name on your local drive. You can then upload the file to the specified path using the **create\_blob\_from\_path** method. 

The sample code creates a local file to be used for the upload and download, storing the file to be uploaded as **file\_path\_to\_file** and the name of the blob as **local\_file\_name**. The following example uploads the file to your container called **quickstartblobs**.

```python
# Create a file in Documents to test the upload and download.
local_path=os.path.expanduser("~\Documents")
local_file_name ="QuickStart_" + str(uuid.uuid4()) + ".txt"
full_path_to_file =os.path.join(local_path, local_file_name)

# Write text to the file.
file = open(full_path_to_file,  'w')
file.write("Hello, World!")
file.close()

print("Temp file = " + full_path_to_file)
print("\nUploading to Blob storage as blob" + local_file_name)

# Upload the created file, use local_file_name for the blob name
block_blob_service.create_blob_from_path(container_name, local_file_name, full_path_to_file)
```

There are several upload methods that you can use with Blob storage. For example, if you have a memory stream, you can use the **create\_blob\_from\_stream** method rather than the **create\_blob\_from\_path**. 

Block blobs can be as large as 4.7 TB, and can be anything from Excel spreadsheets to large video files. Page blobs are primarily used for the VHD files used to back IaaS VMs. Append blobs are used for logging, such as when you want to write to a file and then keep adding more information. Most objects stored in Blob storage are block blobs.

### List the blobs in a container

Get a list of files in the container using the **list_blobs** method. This method returns a generator. The following code retrieves the list of blobs, then loops through them, showing the names of the blobs found in a container.  

```python
# List the blobs in the container
print("\nList blobs in the container")
generator = block_blob_service.list_blobs(container_name)
for blob in generator:
    print("\t Blob name: " + blob.name)
```

### Download the blobs

Download blobs to your local disk using the **get\_blob\_to\_path** method. 
The following code downloads the blob uploaded in a previous section. "_DOWNLOADED" is added as a suffix to the blob name so you can see both files on local disk. 

```python
# Download the blob(s).
# Add '_DOWNLOADED' as prefix to '.txt' so you can see both files in Documents.
full_path_to_file2 = os.path.join(local_path, string.replace(local_file_name ,'.txt', '_DOWNLOADED.txt'))
print("\nDownloading blob to " + full_path_to_file2)
block_blob_service.get_blob_to_path(container_name, local_file_name, full_path_to_file2)
```

### Clean up resources
If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using the **delete\_container**. If the files created are no longer needed, you use the **delete\_blob** method to delete the files.

```python
# Clean up resources. This includes the container and the temp files
block_blob_service.delete_container(container_name)
os.remove(full_path_to_file)
os.remove(full_path_to_file2)
```
## Resources for developing Python applications with blobs

See these additional resources for Python development with Blob storage:

### Binaries and source code

- View, download, and install the [Python client library source code](https://github.com/Azure/azure-storage-python) for Azure Storage on GitHub.

### Client library reference and samples

- See the [Python API reference](https://docs.microsoft.com/python/api/overview/azure/storage) for more information about the Python client library.
- Explore [Blob storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=python&term=blob) written using the Python client library.

## Next steps
 
In this quickstart, you learned how to transfer files between a local disk and Azure blob storage using Python. To learn more about working with blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](./storage-python-how-to-use-blob-storage.md)
 
For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
