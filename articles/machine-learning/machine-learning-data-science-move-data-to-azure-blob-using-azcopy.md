<properties
	pageTitle="Move Data to and from Azure Blob Storage using AzCopy | Microsoft Azure"
	description="Move Data to and from Azure Blob Storage using AzCopy"
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

# Move Data to and from Azure Blob Storage using AzCopy

AzCopy is a command-line utility designed for high-performance uploading, downloading, and copying data to and from Microsoft Azure blob, file, and table storage.

For instructions on installing AzCopy and additional information on using it with the Azure platform, see [Getting Started with the AzCopy Command-Line Utility](../storage/storage-use-azcopy.md).

Guidance on technologies used to move data to and/or from Azure Blob storage are linked here:

[AZURE.INCLUDE [blob-storage-tool-selector](../../includes/machine-learning-blob-storage-tool-selector.md)]


> [AZURE.NOTE] If you are using VM that was set up with the scripts provided by [Data Science Virtual machines in Azure](machine-learning-data-science-virtual-machines.md), then AzCopy is already installed on the VM.

> [AZURE.NOTE] For a complete introduction to Azure blob storage, please refer to [Azure Blob Basics](../storage/storage-dotnet-how-to-use-blobs.md) and  [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx).


## Prerequisites

This document assumes that you have an Azure subscription, a storage account and the corresponding storage key for that account. Before uploading/downloading data, you must know your Azure storage account name and account key.

- To set up an Azure subscription, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
- For instructions on creating a storage account and for getting account and key information, see [About Azure storage accounts](../storage/storage-create-storage-account.md).


## Upload files to an Azure blob

To upload a file, use the following command in the AzCopy is a command-line.

	# Upload from local file system
	AzCopy /Source:<your_local_directory> /Dest: https://<your_account_name>.blob.core.windows.net/<your_container_name> /DestKey:<your_account_key> /S


## Download files from an Azure blob

To download a file from an Azure blob, use the following command in the AzCopy is a command-line.

	# Downloading blobs to local file system
	AzCopy /Source:https://<your_account_name>.blob.core.windows.net/<your_container_name>/<your_sub_directory_at_blob>  /Dest:<your_local_directory> /SourceKey:<your_account_key> /Pattern:<file_pattern> /S


## Transfer blobs between Azure containers

To transfer blobs between Azure containers, use the following command in the AzCopy is a command-line.

	# Transferring blobs between Azure containers
	AzCopy /Source:https://<your_account_name1>.blob.core.windows.net/<your_container_name1>/<your_sub_directory_at_blob1> /Dest:https://<your_account_name2>.blob.core.windows.net/<your_container_name2>/<your_sub_directory_at_blob2> /SourceKey:<your_account_key1> /DestKey:<your_account_key2> /Pattern:<file_pattern> /S

	<your_account_name>: your storage account name
	<your_account_key>: your storage account key
	<your_container_name>: your container name
	<your_sub_directory_at_blob>: the sub directory in the container
	<your_local_directory>: directory of local file system where files to be uploaded from or the directory of local file system files to be downloaded to
	<file_pattern>: pattern of file names to be transferred. The standard wildcards are supported


## Tips for using AzCopy

> [AZURE.TIP]   
> 1. When uploading files, /S will upload files recursively. Without this parameter, any files in the subdirectory will not be uploaded.  
> 2. When downloading file, /S will search the container recursively until all files in the specified directory and its subdirectories or all files that matching the specified pattern in the given directory and its subdirectories, are downloaded.  
> 3.  You cannot specify a specific blob file to download using the /Source parameter. To download a specific file, specify the blob file name to download using the /Pattern parameter. /S parameter can be used to have AzCopy look for a file name pattern recursively. Without the pattern parameter, AzCopy will download all files in that directory.
