---
title:  Azure Quickstart - Transfer objects to/from Azure Blob storage using Python | Microsoft Docs 
description: Quickly learn to transfer objects to/from Azure Blob storage using Python
services: storage
documentationcenter: storage
author: ruthogunnnaike
manager: cwatson
editor: tysonn

ms.assetid: 
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 09/28/2017
ms.author: v-ruogun
---
#  Transfer objects to/from Azure Blob storage using Python
The Python Client Library for Azure Storage is used to create and manage Azure resources programmatically. In this quickstart, you learn how to use Python to upload, download, and list block blobs in a container in Azure Blob storage. 

## Prerequisites

To complete this quickstart: 

* Install [Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python).
<!-- (https://azure.microsoft.com/en-us/develop/python/)
which makes it easy to consume Microsoft Azure Storage services.  -->

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a storage account using the Azure portal

First, create a new general-purpose storage account to use for this quickstart. 

1. Go to the [Azure portal](https://portal.azure.com) and log in using your Azure account. 
2. On the Hub menu, select **New** > **Storage** > **Storage account - blob, file, table, queue**. 
3. Enter a name for your storage account. The name must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. It must also be unique.
4. Set `Deployment model` to **Resource manager**.
5. Set `Account kind` to **General purpose**.
6. Set `Performance` to **Standard**. 
7. Set `Replication` to **Locally Redundant storage (LRS)**.
8. Set `Storage service encryption` to **Disabled**.
9. Set `Secure transfer required` to **Disabled**.
10. Select your subscription. 
11. For `resource group`, create a new one and give it a unique name. 
12. Select the `Location` to use for your storage account.
13. Check **Pin to dashboard** and click **Create** to create your storage account. 

After your storage account is created, it is pinned to the dashboard. Click on it to open it. Under SETTINGS, click **Access keys**. Select a key and copy the CONNECTION STRING to the clipboard, then paste it into Notepad for later use.

## Download the sample application
The sample application used in this quickstart is a basic python application.  

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-blobs-python-quickstart.git
```

 This command clones the repository to your local git folder. To open the python program, look for storage-blobs-python-quickstart folder.  

## Configure your storage connection string
In the application, you must provide your storage account name and account key to create a BlockBlobService object. Open the `example.py` file from the Solution Explorer in your IDE. Replace **accountname** and **accountkey** with your account name and key. 

```python
account_name = 'accountname'
account_key = 'accountkey'
storage_account = CloudStorageAccount(account_name, account_key)
```

## Run the sample
This sample creates a test file in the 'Documents' folder, uploads it to Blob storage, lists the blobs in the container, then downloads the file with a new name so you can compare the old and new files. 

Run the sample. It shows the output on the console similar to the following: 
  
```
Temp file = C:\Users\azureuser\Documents\QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

Uploading to Blob storage as blobQuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

List blobs in the container
         Blob name: QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078.txt

Downloading blob to C:\Users\azureuser\Documents\QuickStart_9f4ed0f9-22d3-43e1-98d0-8b2c05c01078_DOWNLOADED.txt
```
When you press any key to continue, it deletes the storage container and the files. Before you continue, check your 'Documents' for the two files -- you can open them and see they are identical.

You can also use a tool such as the [Azure Storage Explorer](http://storageexplorer.com/?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) to view the files in Blob storage. Azure Storage Explorer is a free cross-platform tool that allows you to access your storage account information. 

After you've verified the files, hit any key to finish the demo and delete the test files. Now that you know what the sample does, open the example.py file to look at the code. 

## Get references to the storage objects
The first thing to do is create the references to the objects used to access and manage Blob storage. These objects build on each other -- each is used by the next one in the list.

* Instantiate the **CloudStorageAccount** object pointing to the storage account. 

* Instantiate the **BlockBlobService** object, which points to the Blob service in your storage account. 

* Instantiate the **CloudBlobContainer** object, which represents the container you are accessing. Containers are used to organize your blobs like you use folders on your computer to organize your files.

Once you have the Cloud Blob Container, you can instantiate the **CloudBlockBlob** object that points to the specific  blob in which you are interested, and perform an upload, download, copy, etc. operation.

In this section, you instantiate the objects, create a new container, and then set permissions on the container so the blobs are public. The container is called **quickstartblobs**. 


```python
# Create a CloudStorageAccount instance pointing to your storage account.
account_name = 'accountname'
account_key = 'accountkey'
storage_account = CloudStorageAccount(account_name, account_key)

# Create the BlockBlockService that is used to call the Blob service for the storage account
block_blob_service = storage_account.create_block_blob_service()
 
# Create a container called 'quickstartblobs'.
container_name ='quickstartblobs'
block_blob_service.create_container(container_name) 

# Set the permission so the blobs are public.
block_blob_service.set_container_acl(container_name, public_access=PublicAccess.Container)
```
## Upload blobs to the container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most commonly used, and that's what is used in this quickstart. 

To upload a file to a blob, use the get a reference to the blob in the target container. Once you have the blob reference, you can upload data to it by using **create\_blob\_from\_path**. This operation creates the blob if it doesn't already exist, and overwrites it if it does already exist.

The sample code creates a local file to be used for the upload and download, storing the file to be uploaded as **file\_path\_to\_file** and the name of the blob in **local\_file\_name**. The following example uploads the file to your container called **quickstartblobs**.

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

## List the blobs in a container

Get a list of files in the container using **list_blobs** method. This method returns a generator. The following code retrieves the list of blobs, then loops through them, showing the names of the blobs found in a container.  

```python
# List the blobs in the container
print("\nList blobs in the container")
    generator = block_blob_service.list_blobs(container_name)
    for blob in generator:
        print("\t Blob name: " + blob.name)
```

## Download the Blobs

Download blobs to your local disk using **get\_blob\_to\_path** method. 
The following code downloads the blob uploaded in a previous section, adding a suffix of "_DOWNLOADED" to the blob name so you can see both files on local disk. 

```python
# Download the blob(s).
# Add '_DOWNLOADED' as prefix to '.txt' so you can see both files in Documents.
full_path_to_file2 = os.path.join(local_path, string.replace(local_file_name ,'.txt', '_DOWNLOADED.txt'))
print("\nDownloading blob to " + full_path_to_file2)
block_blob_service.get_blob_to_path(container_name, local_file_name, full_path_to_file2)
```

## Clean up resources
If you no longer need the blobs uploaded in this quickstart, you can delete the entire container using **delete\_blob** method. Also delete the files created if they are no longer needed.

```python
# Clean up resources. This includes the container and the temp files
block_blob_service.delete_blob(container_name, local_file_name)
block_blob_service.delete_container(container_name)
```

## Next steps

<!-- To Dos  - make sure the href links to the correct md file, ensure you follow the name you stated below.  -->
In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage using Python. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-python-how-to-use-blob_storage.md)
 

For more information about the Storage Explorer and Blobs, see [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).




