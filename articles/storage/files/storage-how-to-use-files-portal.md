---
title: Quickstart for managing Azure file shares with Azure portal
description: See how to create and manage Azure file shares in the Azure portal. Create a storage account, create an Azure file share, and use your Azure file share.
author: roygara
ms.service: storage
ms.topic: quickstart
ms.date: 09/01/2021
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

## Create a resource group
A resource group is a logical container in which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can use the [az group create](/cli/azure/group) command to create one. 

The following example creates a resource group named *myResourceGroup* in the *West US 2* location:

```azurecli-interactive 
export resourceGroupName="myResourceGroup"
region="westus2"

az group create \
    --name $resourceGroupName \
    --location $region \
    --output none
```

## Create a storage account
A storage account is a shared pool of storage in which you can deploy Azure file shares or other storage resources, such as blobs or queues. A storage account can contain an unlimited number of file shares. A share can store an unlimited number of files, up to the capacity limits of the storage account.

The following example creates a storage account using the [az storage account create](/cli/azure/storage/account) command. Storage account names must be unique, so use `$RANDOM` to append a number to the name to make it unique.

```azurecli-interactive 
export storageAccountName="mystorageacct$RANDOM"

az storage account create \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --location $region \
    --kind StorageV2 \
    --sku Standard_LRS \
    --enable-large-file-share \
    --output none
```


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

Now you can create your first Azure file share. You can create a file share using the [New-AzRmStorageShare](/powershell/module/az.storage/New-AzRmStorageShare) cmdlet. This example creates a share named `myshare`.

```azurepowershell-interactive
$shareName = "myshare"

New-AzRmStorageShare `
    -StorageAccount $storageAcct `
    -Name $shareName `
    -EnabledProtocol SMB `
    -QuotaGiB 1024 | Out-Null
```

# [Azure CLI](#tab/azure-cli)

Now, you can create your first Azure file share. Create file shares by using the [az storage share-rm create](/cli/azure/storage/share-rm?view=azure-cli-latest&preserve-view=false#az_storage_share_rm_create) command. This example creates an Azure file share named *myshare*: 

```azurecli-interactive
shareName="myshare"

az storage share-rm create \
    --resource-group $resourceGroupName \
    --storage-account $storageAccountName \
    --name $shareName \
    --quota 1024 \
    --enabled-protocols SMB \
    --output none
```

---

#### Create a directory

# [Portal](#tab/azure-portal)

To create a new directory named *myDirectory* at the root of your Azure file share:

1. On the **File Service** page, select the **myshare** file share. The page for your file share opens.
1. On the menu at the top of the page, select **+ Add directory**. The **New directory** page drops down.
1. Type *myDirectory* and then click **OK**.

# [PowerShell](#tab/azure-powershell)

To create a new directory named *myDirectory* at the root of your Azure file share, use the [New-AzStorageDirectory](/powershell/module/az.storage/New-AzStorageDirectory) cmdlet.

```azurepowershell-interactive
New-AzStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName $shareName `
   -Path "myDirectory"
```

# [Azure CLI](#tab/azure-cli)

To create a new directory named *myDirectory* at the root of your Azure file share, use the [`az storage directory create`](/cli/azure/storage/directory) command:

```azurecli-interactive
az storage directory create \
   --account-name $storageAccountName \
   --account-key $storageAccountKey \
   --share-name $shareName \
   --name "myDirectory" \
   --output none
```

---


#### Upload a file 
# [Portal](#tab/azure-portal)


To demonstrate uploading a file, you first need to create or select a file to be uploaded. You may do this by whatever means you see fit. Once you've selected the file you would like to upload:

1. Click on the **myDirectory** directory. The **myDirectory** panel opens.
1. In the menu at the top, select **Upload**. The **Upload files** panel opens.  
	
    ![A screenshot of the upload files panel](media/storage-how-to-use-files-portal/upload-file-1.png)

1. Click on the folder icon to open a window to browse your local files. 
1. Select a file and then click **Open**. 
1. In the **Upload files** page, verify the file name and then click **Upload**.
1. When finished, the file should appear in the list on the **myDirectory** page.

# [PowerShell](#tab/azure-powershell)

To demonstrate how to upload a file using the [Set-AzStorageFileContent](/powershell/module/az.storage/Set-AzStorageFileContent) cmdlet, we first need to create a file inside your PowerShell Cloud Shell's scratch drive to upload. 

This example puts the current date and time into a new file on your scratch drive, then uploads the file to the file share.

```azurepowershell-interactive
# this expression will put the current date and time into a new file on your scratch drive
cd "~/CloudDrive/"
Get-Date | Out-File -FilePath "SampleUpload.txt" -Force

# this expression will upload that newly created file to your Azure file share
Set-AzStorageFileContent `
   -Context $storageAcct.Context `
   -ShareName $shareName `
   -Source "SampleUpload.txt" `
   -Path "myDirectory\SampleUpload.txt"
```   

If you're running PowerShell locally, you should substitute `~/CloudDrive/` with a path that exists on your machine.

After uploading the file, you can use [Get-AzStorageFile](/powershell/module/Az.Storage/Get-AzStorageFile) cmdlet to check to make sure that the file was uploaded to your Azure file share. 

```azurepowershell-interactive
Get-AzStorageFile `
    -Context $storageAcct.Context `
    -ShareName $shareName `
    -Path "myDirectory\" 
```


# [Azure CLI](#tab/azure-cli)

To demonstrate how to upload a file by using the [`az storage file upload`](/cli/azure/storage/file) command, first create a file to upload on the Cloud Shell scratch drive. In the following example, you create and then upload the file:

```azurecli-interactive
cd ~/clouddrive/
date > SampleUpload.txt

az storage file upload \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $shareName \
    --source "SampleUpload.txt" \
    --path "myDirectory/SampleUpload.txt"
```

If you're running Azure CLI locally, substitute `~/clouddrive` with a path that exists on your machine.

After you upload the file, you can use the [`az storage file list`](/cli/azure/storage/file) command to make sure that the file was uploaded to your Azure file share:

```azurecli-interactive
az storage file list \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $shareName \
    --path "myDirectory" \
    --output table
```


---

#### Download a file
# [Portal](#tab/azure-portal)

You can download a copy of the file you uploaded by right-clicking on the file. After clicking the download button, the exact experience will depend on the operating system and browser you're using.


# [PowerShell](#tab/azure-powershell)

You can use the [Get-AzStorageFileContent](/powershell/module/az.storage/Get-AzStorageFilecontent) cmdlet to download a copy of the file you just uploaded to the scratch drive of your Cloud Shell.

```azurepowershell-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists because you've run this example before.
Remove-Item `
    -Path "SampleDownload.txt" `
    -Force `
    -ErrorAction SilentlyContinue

Get-AzStorageFileContent `
    -Context $storageAcct.Context `
    -ShareName $shareName `
    -Path "myDirectory\SampleUpload.txt" `
    -Destination "SampleDownload.txt"
```

After downloading the file, you can use the `Get-ChildItem` to see that the file has been downloaded to your PowerShell Cloud Shell's scratch drive.

```azurepowershell-interactive
Get-ChildItem | Where-Object { $_.Name -eq "SampleDownload.txt" }
``` 

# [Azure CLI](#tab/azure-cli)

You can use the [`az storage file download`](/cli/azure/storage/file) command to download a copy of the file that you uploaded to the Cloud Shell scratch drive:

```azurecli-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists, because you've run this example before
rm -f SampleDownload.txt

az storage file download \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $shareName \
    --path "myDirectory/SampleUpload.txt" \
    --dest "SampleDownload.txt" \
    --output none
```

---

## Clean up resources
# [Portal](#tab/azure-portal)

[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

# [PowerShell](#tab/azure-powershell)

When you are done, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to remove the resource group and all related resources. 

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

# [Azure CLI](#tab/azure-cli)

When you are done, you can use the [`az group delete`](/cli/azure/group) command to remove the resource group and all related resources: 

```azurecli-interactive 
az group delete --name $resourceGroupName
```


---

### Using an Azure file share from the Azure portal
All requests made via the Azure portal are made with the File REST API enabling you to create, modify, and delete files and directories on clients without SMB access. It is possible to work directly with the File REST protocol (that is, handcrafting REST HTTP calls yourself), but the most common way (beyond using the Azure portal) to use the File REST protocol is to use the [Azure PowerShell module](storage-how-to-use-files-powershell.md), the [Azure CLI](storage-how-to-use-files-cli.md), or an Azure Storage SDK, all of which provide a nice wrapper around the File REST protocol in the scripting/programming language of your choice. 

We expect most users of Azure Files will want to work with their Azure file share over the SMB protocol, as this allows them to use the existing applications and tools they expect to be able to use, but there are several reasons why it is advantageous to use the File REST API rather than SMB, such as:

- You need to make a quick change to your Azure file share from on-the-go, such as from a laptop without SMB access, tablet, or mobile device.
- You need to execute a script or application from a client which cannot mount an SMB share, such as on-premises clients, which do not have port 445 unblocked.
- You are taking advantage of serverless resources, such as [Azure Functions](../../azure-functions/functions-overview.md). 

The following examples show how to use the Azure portal to manipulate your Azure file share with the File REST protocol. 

Now that you have created an Azure file share, you can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can work with your Azure file share with the Azure portal. 

## Next steps

> [!div class="nextstepaction"]
> [What is Azure Files?](storage-files-introduction.md)