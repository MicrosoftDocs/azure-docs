---
title: Create an Azure file share
titleSuffix: Azure Files
description: How to create an Azure file share by using the Azure portal, PowerShell, or the Azure CLI.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 09/19/2017
ms.author: rogarana
ms.subservice: files
---

# Create a file share
You can create a share in Azure Files by using the [Azure portal](https://portal.azure.com/), the Azure Storage PowerShell cmdlets, the Azure Storage client libraries, or the Azure Storage REST API. In this article, you'll learn how to:
- Create an Azure file share by using the Azure portal
- Create an Azure file share by using PowerShell
- Create an Azure file share by using the Azure CLI

## Prerequisites
To create an Azure file share, you can use a storage account that already exists or [create a new Azure storage account](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json). To create an Azure file share with PowerShell, you'll need the account key and name of your storage account. You'll need a storage account key if you plan to use PowerShell or the CLI.

> [!NOTE]
> If you want to create file shares larger than 5 TiB, see [Enable large file shares](storage-files-how-to-create-large-file-share.md).

## Create a file share through the Azure portal

1. Go to the **Storage account** pane on the Azure portal.
    ![Storage account pane](./media/storage-how-to-create-file-share/create-file-share-portal1.png)

1. Select the **+ File share** button.
    ![The add File share button](./media/storage-how-to-create-file-share/create-file-share-portal2.png)

1. Enter your information for **Name** and **Quota**.
    ![The name and quota for the new file share](./media/storage-how-to-create-file-share/create-file-share-portal3.png)

1. View your new file share.
    ![The new file share in the UI](./media/storage-how-to-create-file-share/create-file-share-portal4.png)

1. Upload a file.
    ![The Upload button in the navigation bar](./media/storage-how-to-create-file-share/create-file-share-portal5.png)

1. Browse into your file share, and manage your directories and files.
    ![Folder view of file shares](./media/storage-how-to-create-file-share/create-file-share-portal6.png)

## Create a file share through PowerShell

Download and install the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) for the install point and installation instructions.

> [!Note]  
> We recommend that you download and install, or upgrade to, the latest Azure PowerShell module.

1. Create a new storage account.
    A storage account is a shared pool of storage where you can deploy Azure file shares and storage resources like blobs or queues.

    ```PowerShell
    $resourceGroup = "myresourcegroup"
    $storAcctName = "myuniquestorageaccount"
    $region = "westus2"
    $storAcct = New-AzStorageAccount -ResourceGroupName $resourceGroup -Name $storAcctName -SkuName Standard_LRS -Location $region -Kind StorageV2
    ```

1. Create a new file share.        
    ```PowerShell
    $shareName = "myshare"
    $share = New-AzStorageShare -Context $storAcct.Context -Name $shareName
    ```

> [!Note]  
> The name of your file share must be all lowercase. For complete details about naming file shares and files, see [Naming and referencing shares, directories, files, and metadata](https://msdn.microsoft.com/library/azure/dn167011.aspx).

## Create a file share through the CLI

1. Download and install the Azure CLI.
    See [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and [Get started with the Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli).

1. Create a connection string to the storage account where you want to create the share.
    Replace ```<storage-account>``` and ```<resource_group>``` with your storage account name and resource group in the following example:

   ```azurecli
    current_env_conn_string=$(az storage account show-connection-string -n <storage-account> -g <resource-group> --query 'connectionString' -o tsv)

    if [[ $current_env_conn_string == "" ]]; then  
        echo "Couldn't retrieve the connection string."
    fi
    ```

1. Create the file share.
    ```azurecli
    az storage share create --name files --quota 2048 --connection-string $current_env_conn_string > /dev/null
    ```

## Next steps

* [Connect and mount a file share on Windows](storage-how-to-use-files-windows.md)
* [Connect and mount a file share on Linux](storage-how-to-use-files-linux.md)
* [Connect and mount a file share on macOS](storage-how-to-use-files-mac.md)

See these links for more information about Azure Files:

* [Storage files FAQ](storage-files-faq.md)
* [Troubleshoot Azure Files on Windows](storage-troubleshoot-windows-file-connection-problems.md)
* [Troubleshoot Azure Files on Linux](storage-troubleshoot-linux-file-connection-problems.md)
