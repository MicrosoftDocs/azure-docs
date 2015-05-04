<properties 
	pageTitle="Move Data to and from  Azure Blob Storage" 
	description="Move Data to and from  Azure Blob Storage" 
	services="machine-learning" 
	documentationCenter="" 
	authors="msolhab" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="sunliangms;sachouks;mohabib" />

# Move Data to and from Azure Blob Storage

The [Cloud data science sample scenarios](machine-learning-data-science-plan-sample-scenarios.md) article helps you determine the resources you need for a variety of data science workflows. If you need to move data to and from Azure Blob storage based on you scenario, use one of the following methods:

- [Using Azure Storage Explorer](#explorer)
- [Using AzCopy Command line utility](#AzCopy)
- [Using Azure SDK in Python](#PythonSDK)



> [AZURE.NOTE] For a complete introduction to Azure blob storage, please refer to [Azure Blob Basics](storage-dotnet-how-to-use-blobs.md) and  [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx). 

Before uploading/downloading data, you must know your Azure storage account name and account key. For instructions on getting this information, see the "How to: View, copy and regenerate storage access keys" section of [Manage storage accounts](storage-create-storage-account.md). This document assumes that you have an Azure storage account and the corresponding storage key(s).


<a id="explorer"></a>
## Use Azure Storage Explorer 

Azure Storage Explorer is a free windows based tool for inspecting and altering data in an Azure storage account. It can be downloaded from [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/). The following steps document how to upload/download data using Azure Storage Explorer. 

1.  Launch Azure Storage Explorer 
2.  If the storage account you want to access has not been added to Azure Storage Explorer, click the "Add Account" button to add the account. If it has already been added, select the account from the "--Select a Storage Account--" dropdown.  
![Create workspace][1]
<br>
3. Enter storage account name and storage account key, and then click Add Storage Account. You may add multiple storage accounts and each account will be displayed on a tab. The containers under this storage account are shown in the left panel. Select a container to see the blobs in the container in the right panel.  
![Create workspace][2]
<br>
![Create workspace][3]
<br>
4. Upload data by clicking the "Upload" button. Select one or multiple files to upload from the file system and click "Open" to begin uploading the file(s).
5. Download data by selecting the blob in the corresponding container and clicking the "Download" button .

<a id="AzCopy"></a>
## Use AzCopy

AzCopy is a command line utility to upload and download data. 

**Warning** If you are using a machine different from the VM that was set up earlier in the cloud data science process, please install AzCopy using the following installation instructions: [Download and install AzCopy](storage-use-azcopy.md#install).

####Examples of uploading/downloading files to/from blobs:

	# Uploading from local file system
	AzCopy /Source:<your_local_directory> /Dest: https://<your_account_name>.blob.core.windows.net/<your_container_name> /DestKey:<your_account_key> /S 

	# Downloading blobs to local file system
	AzCopy /Source:https://<your_account_name>.blob.core.windows.net/<your_container_name>/<your_sub_directory_at_blob>  /Dest:<your_local_directory> /SourceKey:<your_account_key> /Pattern:<file_pattern> /S

	# Transferring blobs between Azure containers
	AzCopy /Source:https://<your_account_name1>.blob.core.windows.net/<your_container_name1>/<your_sub_directory_at_blob1> /Dest:https://<your_account_name2>.blob.core.windows.net/<your_container_name2>/<your_sub_directory_at_blob2> /SourceKey:<your_account_key1> /DestKey:<your_account_key2> /Pattern:<file_pattern> /S
	
	<your_account_name>: your storage account name
	<your_account_key>: your storage account key
	<your_container_name>: your container name
	<your_sub_directory_at_blob>: the sub directory in the container 
	<your_local_directory>: directory of local file system where files to be uploaded from or the directory of local file system files to be downloaded to
	<file_pattern>: pattern of file names to be transferred. The standard wildcards are supported

> [AZURE.TIP]   
> 1. When uploading files, /S will upload files recursively. Without this parameter, any files in the subdirectory will not be uploaded.  
> 2. When downloading file, /S will search the container recursively until all files in the specified directory and its subdirectories or all files that matching the specified pattern in the given directory and its subdirectories, are downloaded.  
> 3.  You cannot specify a specific blob file to download using the /Source parameter. To download a specific file, specify the blob file name to download using the /Pattern parameter. /S parameter can be used to have AzCopy look for a file name pattern recursively. Without the pattern parameter, AzCopy will download all files in that directory. 

For detailed usage of AzCopy, please refer to [Getting Started with the AzCopy Command-Line Utility](storage-use-azcopy.md#install).


<a id="PythonSDK"></a>
## Use Python

With the Python API provided in Azure SDK, you can

- Create a container
- Upload a blob into a container
- Download blobs
- List the blobs in a container
- Delete a blob

This section documents how to list, upload and download blobs. For more details of the usage of the Python API, please refer [How to Use the Blob Storage Service from Python](storage-python-how-to-use-blob-storage.md). 

> [AZURE.NOTE] If you are using a machine different from the VM that was set up earlier in the cloud data science process, you need to install the [Python Azure SDK](python-how-to-install.md) before using the sample code below.

###Upload Data to Blob
Add the following snippet near the top of any Python code in which you wish to programmatically access Azure Storage:

	from azure.storage import BlobService

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

	from azure.storage import BlobService
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

###Download Data from Blob

Use the following methods to download data from a blob:
1. get\_blob\_to\_path
2. get\_blob\_to\_file
3. get\_blob\_to\_bytes
4. get\_blob\_to\_text 

These methods that perform the necessary chunking when the size of the data exceeds 64 MB. 

The following sample code downloads the contents of a blob in a container to a local file: 

	blob_service.get_blob_to_path("<your_container_name>", "<your_blob_name>", "<your_local_file_name>")

The following sample code downloads all blobs from a container. It uses list\_blobs to get the list of available blobs in the container and downloads them to a local directory. 

	from azure.storage import BlobService
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

<!-- Images -->

[1]: ./media/machine-learning-data-science-move-azure-blob/data-science-process-uploading-data-to-blob-storage-img1.png
[2]: ./media/machine-learning-data-science-move-azure-blob/data-science-process-uploading-data-to-blob-storage-img2.png
[3]: ./media/machine-learning-data-science-move-azure-blob/data-science-process-uploading-data-to-blob-storage-img3.png
