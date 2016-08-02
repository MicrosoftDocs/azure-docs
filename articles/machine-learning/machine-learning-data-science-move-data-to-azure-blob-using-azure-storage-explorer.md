<properties 
	pageTitle="Move Data to and from Azure Blob Storage using Azure Storage Explorer | Microsoft Azure" 
	description="Move Data to and from Azure Blob Storage using Azure Storage Explorer" 
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

# Move Data to and from Azure Blob Storage using Azure Storage Explorer

Azure Storage Explorer is a free windows based tool for inspecting and altering data in an Azure storage account. This topic describes how to use it to upload and download data from Azure blob storage. The tool can be downloaded from [Azure Storage Explorer](http://storageexplorer.com/).

Guidance on technologies used to move data to and/or from Azure Blob storage are linked here:
 
[AZURE.INCLUDE [blob-storage-tool-selector](../../includes/machine-learning-blob-storage-tool-selector.md)]   
 
&nbsp; 
 
> [AZURE.NOTE] If you are using VM that was set up with the scripts provided by [Data Science Virtual machines in Azure](machine-learning-data-science-virtual-machines.md), then Azure Storage Explorer is already installed on the VM.  
 
&nbsp; 
 
> [AZURE.NOTE] For a complete introduction to Azure blob storage, please refer to [Azure Blob Basics](../storage/storage-dotnet-how-to-use-blobs.md) and  [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx).   

## Prerequisites

This document assumes that you have an Azure subscription, a storage account and the corresponding storage key for that account. Before uploading/downloading data, you must know your Azure storage account name and account key. 

- To set up an Azure subscription, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
- For instructions on creating a storage account and for getting account and key information, see [About Azure storage accounts](../storage/storage-create-storage-account.md).


<a id="explorer"></a>
## Use Azure Storage Explorer 

The following steps document how to upload/download data using Azure Storage Explorer. 

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

<!-- Images -->

[1]: ./media/machine-learning-data-science-move-azure-blob/data-science-process-uploading-data-to-blob-storage-img1.png
[2]: ./media/machine-learning-data-science-move-azure-blob/data-science-process-uploading-data-to-blob-storage-img2.png
[3]: ./media/machine-learning-data-science-move-azure-blob/data-science-process-uploading-data-to-blob-storage-img3.png
