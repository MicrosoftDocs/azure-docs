---
title: Move Blob storage data with Azure Storage Explorer - Team Data Science Process
description: Move Data to and from Azure Blob Storage using Azure Storage Explorer
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
# Move data to and from Azure Blob Storage using Azure Storage Explorer
Azure Storage Explorer is a free tool from Microsoft that allows you to work with Azure Storage data on Windows, macOS, and Linux. This topic describes how to use it to upload and download data from Azure blob storage. The tool can be downloaded from [Microsoft Azure Storage Explorer](https://storageexplorer.com/).

[!INCLUDE [blob-storage-tool-selector](../../../includes/machine-learning-blob-storage-tool-selector.md)]

> [!NOTE]
> If you are using VM that was set up with the scripts provided by [Data Science Virtual machines in Azure](virtual-machines.md), then Azure Storage Explorer is already installed on the VM.
> 
> [!NOTE]
> For a complete introduction to Azure blob storage, refer to [Azure Blob Basics](../../storage/blobs/storage-dotnet-how-to-use-blobs.md) and [Azure Blob Service](https://msdn.microsoft.com/library/azure/dd179376.aspx).   
> 
> 

## Prerequisites
This document assumes that you have an Azure subscription, a storage account, and the corresponding storage key for that account. Before uploading/downloading data, you must know your Azure storage account name and account key. 

* To set up an Azure subscription, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* For instructions on creating a storage account and for getting account and key information, see [About Azure storage accounts](../../storage/common/storage-create-storage-account.md). Make a note the access key for your storage account as you need this key to connect to the account with the Azure Storage Explorer tool.
* The Azure Storage Explorer tool can be downloaded from [Microsoft Azure Storage Explorer](https://storageexplorer.com/). Accept the defaults during install.

<a id="explorer"></a>

## Use Azure Storage Explorer
The following steps document how to upload/download data using Azure Storage Explorer. 

1. Launch Microsoft Azure Storage Explorer.
2. To bring up the **Sign in to your account...** wizard, select **Azure account settings** icon, then **Add an account** and enter you credentials. ![Add an Azure storage account](./media/move-data-to-azure-blob-using-azure-storage-explorer/add-an-azure-store-account.png)
3. To bring up the **Connect to Azure Storage** wizard, select the **Connect to Azure storage** icon. ![Click "Connect to Azure storage"](./media/move-data-to-azure-blob-using-azure-storage-explorer/connect-to-azure-storage-1.png)
4. Enter the access key from your Azure storage account on the **Connect to Azure Storage** wizard and then **Next**. ![Enter access key from Azure storage account](./media/move-data-to-azure-blob-using-azure-storage-explorer/connect-to-azure-storage-2.png)
5. Enter storage account name in the **Account name** box and then select **Next**. ![Attach external storage](./media/move-data-to-azure-blob-using-azure-storage-explorer/attach-external-storage.png)
6. The storage account added should now be listed. To create a blob container in a storage account, right-click the **Blob Containers** node in that account, select **Create Blob Container**, and enter a name.
7. To upload data to a container, select the target container and click the **Upload** button.![Storage accounts](./media/move-data-to-azure-blob-using-azure-storage-explorer/storage-accounts.png)
8. Click on the **...** to the right of the **Files** box, select one or multiple files to upload from the file system and click **Upload** to begin uploading the files.![Upload files](./media/move-data-to-azure-blob-using-azure-storage-explorer/upload-files-to-blob.png)
9. To download data, selecting the blob in the corresponding container to download and click **Download**. ![Download files](./media/move-data-to-azure-blob-using-azure-storage-explorer/download-files-from-blob.png)

