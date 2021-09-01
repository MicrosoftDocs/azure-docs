---
title: Quickstart for managing Azure file shares with Azure portal
description: See how to create and manage Azure file shares in the Azure portal. Create a storage account, create an Azure file share, and use your Azure file share.
author: roygara
ms.service: storage
ms.topic: quickstart
ms.date: 04/15/2021
ms.author: rogarana
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Create and manage Azure file shares with the Azure portal 
[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares can be mounted in Windows, Linux, and macOS. This guide walks you through the basics of working with Azure file shares using the [Azure portal](https://portal.azure.com/).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Pre-requisites

# [Portal](#tab/azure-portal)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

# [PowerShell](#tab/azure-powershell)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you would like to install and use the PowerShell locally, this guide requires the Azure PowerShell module Az version 0.7 or later. To find out which version of the Azure PowerShell module you are running, execute `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you are running PowerShell locally, you also need to run `Login-AzAccount` to login to your Azure account.

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- By default, Azure CLI commands return JavaScript Object Notation (JSON). JSON is the standard way to send and receive messages from REST APIs. To facilitate working with JSON responses, some of the examples in this article use the *query* parameter on Azure CLI commands. This parameter uses the [JMESPath query language](http://jmespath.org/) to parse JSON. To learn more about how to use the results of Azure CLI commands by following the JMESPath query language, see the [JMESPath tutorial](http://jmespath.org/tutorial.html).

---

## Create a storage account

# [Portal](#tab/azure-portal)
[!INCLUDE [storage-files-create-storage-account-portal](../../../includes/storage-files-create-storage-account-portal.md)]


# [PowerShell](#tab/azure-powershell)


## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can create a new one with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. 

The following example creates a resource group named *myResourceGroup* in the West US 2 region:

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$region = "westus2"

New-AzResourceGroup `
    -Name $resourceGroupName `
    -Location $region | Out-Null
```

## Create a storage account

A storage account is a shared pool of storage you can use to deploy Azure file shares. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account. This example creates a general purpose version 2 (GPv2 storage account), which can storage standard Azure file shares or other storage resources such as blobs or queues, on hard-disk drive (HDD) rotational media. Azure Files also supports premium solid-state disk drives (SSDs); premium Azure file shares can be created in FileStorage storage accounts.

This example creates a storage account using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet. The storage account is named *mystorageaccount\<random number>* and a reference to that storage account is stored in the variable **$storageAcct**. Storage account names must be unique, so use `Get-Random` to append a number to the name to make it unique. 

```azurepowershell-interactive 
$storageAccountName = "mystorageacct$(Get-Random)"

$storageAcct = New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -Location $region `
    -Kind StorageV2 `
    -SkuName Standard_ZRS `
    -EnableLargeFileShare
```

# [Azure CLI](#tab/azure-cli)


---


## Create an Azure file share


# [Portal](#tab/azure-portal)

To create an Azure file share:

1. Select the storage account from your dashboard.
1. On the storage account page, in the **Services** section, select **Files**.
	
    ![A screenshot of the data storage section of the storage account; select file shares.](media/storage-how-to-use-files-portal/create-file-share-1.png)

1. On the menu at the top of the **File service** page, click **File share**. The **New file share** page drops down.
1. In **Name** type *myshare*, enter a quoate, and leave **Transaction optimized** selected for **Tiers**.
1. Select **Create** to create the Azure file share.

Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

# [PowerShell](#tab/azure-powershell)


## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can create a new one with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. 

The following example creates a resource group named *myResourceGroup* in the West US 2 region:

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$region = "westus2"

New-AzResourceGroup `
    -Name $resourceGroupName `
    -Location $region | Out-Null
```

## Create a storage account

A storage account is a shared pool of storage you can use to deploy Azure file shares. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account. This example creates a general purpose version 2 (GPv2 storage account), which can storage standard Azure file shares or other storage resources such as blobs or queues, on hard-disk drive (HDD) rotational media. Azure Files also supports premium solid-state disk drives (SSDs); premium Azure file shares can be created in FileStorage storage accounts.

This example creates a storage account using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet. The storage account is named *mystorageaccount\<random number>* and a reference to that storage account is stored in the variable **$storageAcct**. Storage account names must be unique, so use `Get-Random` to append a number to the name to make it unique. 

```azurepowershell-interactive 
$storageAccountName = "mystorageacct$(Get-Random)"

$storageAcct = New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -Location $region `
    -Kind StorageV2 `
    -SkuName Standard_ZRS `
    -EnableLargeFileShare
```

# [Azure CLI](#tab/azure-cli)


---

## Use your Azure file share
Azure Files provides three methods of working with files and folders within your Azure file share: the industry standard [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview), the Network File System (NFS) protocol (preview), and the [File REST protocol](/rest/api/storageservices/file-service-rest-api). 

To mount a file share with SMB, see the following document based on your OS:
- [Windows](storage-how-to-use-files-windows.md)
- [Linux](storage-how-to-use-files-linux.md)
- [macOS](storage-how-to-use-files-mac.md)

### Using an Azure file share from the Azure portal
All requests made via the Azure portal are made with the File REST API enabling you to create, modify, and delete files and directories on clients without SMB access. It is possible to work directly with the File REST protocol (that is, handcrafting REST HTTP calls yourself), but the most common way (beyond using the Azure portal) to use the File REST protocol is to use the [Azure PowerShell module](storage-how-to-use-files-powershell.md), the [Azure CLI](storage-how-to-use-files-cli.md), or an Azure Storage SDK, all of which provide a nice wrapper around the File REST protocol in the scripting/programming language of your choice. 

We expect most users of Azure Files will want to work with their Azure file share over the SMB protocol, as this allows them to use the existing applications and tools they expect to be able to use, but there are several reasons why it is advantageous to use the File REST API rather than SMB, such as:

- You need to make a quick change to your Azure file share from on-the-go, such as from a laptop without SMB access, tablet, or mobile device.
- You need to execute a script or application from a client which cannot mount an SMB share, such as on-premises clients, which do not have port 445 unblocked.
- You are taking advantage of serverless resources, such as [Azure Functions](../../azure-functions/functions-overview.md). 

The following examples show how to use the Azure portal to manipulate your Azure file share with the File REST protocol. 

Now that you have created an Azure file share, you can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can work with your Azure file share with the Azure portal. 

#### Create a directory
To create a new directory named *myDirectory* at the root of your Azure file share:

1. On the **File Service** page, select the **myshare** file share. The page for your file share opens.
1. On the menu at the top of the page, select **+ Add directory**. The **New directory** page drops down.
1. Type *myDirectory* and then click **OK**.

#### Upload a file 
To demonstrate uploading a file, you first need to create or select a file to be uploaded. You may do this by whatever means you see fit. Once you've selected the file you would like to upload:

1. Click on the **myDirectory** directory. The **myDirectory** panel opens.
1. In the menu at the top, select **Upload**. The **Upload files** panel opens.  
	
    ![A screenshot of the upload files panel](media/storage-how-to-use-files-portal/upload-file-1.png)

1. Click on the folder icon to open a window to browse your local files. 
1. Select a file and then click **Open**. 
1. In the **Upload files** page, verify the file name and then click **Upload**.
1. When finished, the file should appear in the list on the **myDirectory** page.

#### Download a file
You can download a copy of the file you uploaded by right-clicking on the file. After clicking the download button, the exact experience will depend on the operating system and browser you're using.

## Clean up resources
[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

## Next steps

> [!div class="nextstepaction"]
> [What is Azure Files?](storage-files-introduction.md)