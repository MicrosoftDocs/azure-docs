<properties
	pageTitle="Move Data to and from Azure Blob Storage using Python | Microsoft Azure"
	description="Move Data to and from Azure Blob Storage using Python"
	services="machine-learning,storage"
	documentationCenter=""
	authors="bradsev"
	manager="paulettm"
	editor="cgronlun" />

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/14/2016"
	ms.author="bradsev" />

# Move Data to and from Azure Blob Storage using Python

This topic describes how to list, upload and download blobs using the Python API. With the Python API provided in Azure SDK, you can:

- Create a container
- Upload a blob into a container
- Download blobs
- List the blobs in a container
- Delete a blob

For more information about using the Python API, see [How to Use the Blob Storage Service from Python](../storage/storage-python-how-to-use-blob-storage.md).

Guidance on technologies used to move data to and/or from Azure Blob storage are linked here:

[AZURE.INCLUDE [blob-storage-tool-selector](../../includes/machine-learning-blob-storage-tool-selector.md)]


> [AZURE.NOTE] If you are using VM that was set up with the scripts provided by [Data Science Virtual machines in Azure](machine-learning-data-science-virtual-machines.md), then AzCopy is already installed on the VM.

> [AZURE.NOTE] For a complete introduction to Azure blob storage, please refer to [Azure Blob Basics](../storage/storage-dotnet-how-to-use-blobs.md) and  [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx).


## Prerequisites

This document assumes that you have an Azure subscription, a storage account and the corresponding storage key for that account. Before uploading/downloading data, you must know your Azure storage account name and account key.

- To set up an Azure subscription, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
- For instructions on creating a storage account and for getting account and key information, see [About Azure storage accounts](../storage/storage-create-storage-account.md).


## Upload Data to Blob

Add the following snippet near the top of any Python code in which you wish to programmatically access Azure Storage:

	from azure.storage.blob import BlobService

The **BlobService** object lets you work with containers and blobs. The following code creates a BlobService object using the storage account name and account key. Replace account name and account key with your real account and key.

	blob_service = BlobService(account_name="<your_account_name>", account_key="<your_account_key>")

Use the following methods to upload data to a blob:

1. put\_block\_blob\_from\_path (uploads the contents of a file from the specified path)
2. put\_block_blob\_from\_file (uploads the contents from an already opened file/stream)
3. put\_block\_blob\_from\_bytes (uploads an array of bytes)
4. put\_block\_blob\_from\_text (uploads the specified text value using the specified encoding)

The following sample code uploads a local file to a container:

	blob_service.put_block_blob_from_path("<your_container_name>", "<your_blob_name>", "<your_local_file_name>")

The following sample code uploads all the files (excluding directories) in a local directory to blob storage:

	from azure.storage.blob import BlobService
	from os import listdir
	from os.path import isfile, join

	# Set parameters here
	ACCOUNT_NAME = "<your_account_name>"
	ACCOUNT_KEY = "<your_account_key>"
	CONTAINER_NAME = "<your_container_name>"
	LOCAL_DIRECT = "<your_local_directory>"		

	blob_service = BlobService(account_name=ACCOUNT_NAME, account_key=ACCOUNT_KEY)
	# find all files in the LOCAL_DIRECT (excluding directory)
	local_file_list = [f for f in listdir(LOCAL_DIRECT) if isfile(join(LOCAL_DIRECT, f))]

	file_num = len(local_file_list)
	for i in range(file_num):
	    local_file = join(LOCAL_DIRECT, local_file_list[i])
	    blob_name = local_file_list[i]
	    try:
	        blob_service.put_block_blob_from_path(CONTAINER_NAME, blob_name, local_file)
	    except:
	        print "something wrong happened when uploading the data %s"%blob_name


## Download Data from Blob

Use the following methods to download data from a blob:
1. get\_blob\_to\_path
2. get\_blob\_to\_file
3. get\_blob\_to\_bytes
4. get\_blob\_to\_text

These methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following sample code downloads the contents of a blob in a container to a local file:

	blob_service.get_blob_to_path("<your_container_name>", "<your_blob_name>", "<your_local_file_name>")

The following sample code downloads all blobs from a container. It uses list\_blobs to get the list of available blobs in the container and downloads them to a local directory.

	from azure.storage.blob import BlobService
	from os.path import join

	# Set parameters here
	ACCOUNT_NAME = "<your_account_name>"
	ACCOUNT_KEY = "<your_account_key>"
	CONTAINER_NAME = "<your_container_name>"
	LOCAL_DIRECT = "<your_local_directory>"		

	blob_service = BlobService(account_name=ACCOUNT_NAME, account_key=ACCOUNT_KEY)

	# List all blobs and download them one by one
	blobs = blob_service.list_blobs(CONTAINER_NAME)
	for blob in blobs:
	    local_file = join(LOCAL_DIRECT, blob.name)
	    try:
	        blob_service.get_blob_to_path(CONTAINER_NAME, blob.name, local_file)
	    except:
	        print "something wrong happened when downloading the data %s"%blob.name
