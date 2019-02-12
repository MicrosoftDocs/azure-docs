---
title: Copy Blob storage data with AzCopy - Team Data Science Process
description: Copy Data to and from Azure Blob Storage using AzCopy
services: machine-learning
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 11/04/2017
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Copy data to and from Azure Blob Storage using AzCopy
AzCopy is a command-line utility designed for uploading, downloading, and copying data to and from Microsoft Azure blob, file, and table storage.

For instructions on installing AzCopy and additional information on using it with the Azure platform, see [Getting Started with the AzCopy Command-Line Utility](../../storage/common/storage-use-azcopy.md).

[!INCLUDE [blob-storage-tool-selector](../../../includes/machine-learning-blob-storage-tool-selector.md)]

> [!NOTE]
> If you are using VM that was set up with the scripts provided by [Data Science Virtual machines in Azure](virtual-machines.md), then AzCopy is already installed on the VM.
> 
> [!NOTE]
> For a complete introduction to Azure blob storage, refer to [Azure Blob Basics](../../storage/blobs/storage-dotnet-how-to-use-blobs.md) and to [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx).
> 
> 

## Prerequisites
This document assumes that you have an Azure subscription, a storage account and the corresponding storage key for that account. Before uploading/downloading data, you must know your Azure storage account name and account key.

* To set up an Azure subscription, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* For instructions on creating a storage account and for getting account and key information, see [About Azure storage accounts](../../storage/common/storage-create-storage-account.md).

## Run AzCopy commands
To run AzCopy commands, open a command window and navigate to the AzCopy installation directory on your computer, where the AzCopy.exe executable is located. 

The basic syntax for AzCopy commands is:

    AzCopy /Source:<source> /Dest:<destination> [Options]

> [!NOTE]
> You can add the AzCopy installation location to your system path and then run the commands from any directory. By default, AzCopy is installed to *%ProgramFiles(x86)%\Microsoft SDKs\Azure\AzCopy* or *%ProgramFiles%\Microsoft SDKs\Azure\AzCopy*.
> 
> 

## Upload files to an Azure blob
To upload a file, use the following command:

    # Upload from local file system
    AzCopy /Source:<your_local_directory> /Dest: https://<your_account_name>.blob.core.windows.net/<your_container_name> /DestKey:<your_account_key> /S


## Download files from an Azure blob
To download a file from an Azure blob, use the following command:

    # Downloading blobs to local file system
    AzCopy /Source:https://<your_account_name>.blob.core.windows.net/<your_container_name>/<your_sub_directory_at_blob>  /Dest:<your_local_directory> /SourceKey:<your_account_key> /Pattern:<file_pattern> /S


## Copy blobs between Azure containers
To copy blobs between Azure containers, use the following command:

    # Copying blobs between Azure containers
    AzCopy /Source:https://<your_account_name1>.blob.core.windows.net/<your_container_name1>/<your_sub_directory_at_blob1> /Dest:https://<your_account_name2>.blob.core.windows.net/<your_container_name2>/<your_sub_directory_at_blob2> /SourceKey:<your_account_key1> /DestKey:<your_account_key2> /Pattern:<file_pattern> /S

    <your_account_name>: your storage account name
    <your_account_key>: your storage account key
    <your_container_name>: your container name
    <your_sub_directory_at_blob>: the sub directory in the container
    <your_local_directory>: directory of local file system where files to be uploaded from or the directory of local file system files to be downloaded to
    <file_pattern>: pattern of file names to be copied. The standard wildcards are supported


## Tips for using AzCopy
> [!TIP]
> 1. When **uploading** files, */S* uploads files recursively. Without this parameter, files in subdirectories are not uploaded.  
> 2. When **downloading** file, */S* searches the container recursively until all files in the specified directory and its subdirectories, or all files that match the specified pattern in the given directory and its subdirectories, are downloaded.  
> 3. You cannot specify a **specific blob file** to download using the */Source* parameter. To download a specific file, specify the blob file name to download using the */Pattern* parameter. **/S** parameter can be used to have AzCopy look for a file name pattern recursively. Without the pattern parameter, AzCopy downloads all files in that directory.
> 
> 

