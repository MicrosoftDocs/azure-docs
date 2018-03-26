---
title: Managing Azure file shares with Azure PowerShell | Microsoft Docs
description: Learn to manage Azure file shares using Azure PowerShell.
services: storage
documentationcenter: ''
author: wmgries	
manager: jeconnoc
editor: 

ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/26/2018
ms.author: wgries
---

# Quickstart: Managing Azure file shares with Azure PowerShell 

[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares can be mounted in Windows and Windows Server. This guide walks you through the basics of working with Azure file shares using PowerShell. In this article you learn how to:

> [!div class="checklist"]
> * Create a resource group and a storage account
> * Create an Azure file share 
> * Create a directory
> * Upload a file
> * Download a file
> * Create and use a share snapshot

If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If would like to install and use the PowerShell locally, this guide requires the Azure PowerShell module version 5.1.1 or later. To find out which version of the Azure PowerShell module you are running, execute `Get-Module -ListAvailable AzureRM`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can create a new one with the[`New-AzureRmResourceGroup`](/powershell/module/azurerm.resources/new-azurermresourcegroup) cmdlet. 

The following example creates a resource group named **myResourceGroup** in the **East US** region:

```azurepowershell-interactive
New-AzureRmResourceGroup `
   -Name myResourceGroup `
   -Location EastUS
```

## Create a storage account
A storage account is a shared pool of storage you can use to deploy Azure file share, or other storage resources such as blobs or queues. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account.

This example creates a storage account named `mystorageaccount<random number>` and puts a reference to that storage account in the variable **$storageAcct**. Storage account names must be unique, so use `Get-Random` to append a number to the name to make it unique. 

```azurepowershell-interactive 
$storageAcct = New-AzureRmStorageAccount `
                  -ResourceGroupName "myResourceGroup" `
                  -Name "mystorageacct$(Get-Random)" `
                  -Location eastus `
                  -SkuName Standard_LRS 
```


## Create an Azure file share
Now you can create your first Azure file share. You can create a file share using the [New-AzureStorageShare](/powershell/module/azurerm.storage/new-azurestorageshare) cmdlet. Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

This example creates a share named `myshare`.

```azurepowershell-interactive
New-AzureStorageShare `
   -Name myshare `
   -Context $storageAcct.Context
```


### Create directory
To create a new directory named **myDirectory** at the root of your Azure file share, use the [`New-AzureStorageDirectory`](/powershell/module/azurerm.storage/new-azurestoragedirectory) cmdlet.

```azurepowershell-interactive
New-AzureStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName "myshare" `
   -Path "myDirectory"
```

### Upload a file
To demonstrate how to upload a file using the [`Set-AzureStorageFileContent`](/powershell/module/azure.storage/set-azurestoragefilecontent) cmdlet, we first need to create a file inside your PowerShell Cloud Shell's scratch drive to upload. 

Create a simple file by putting the current date and time into a new file on your scratch drive.

```azurepowershell-interactive
Get-Date | Out-File -FilePath "C:\Users\ContainerAdministrator\CloudDrive\SampleUpload.txt" -Force
```

Upload the file to the file share.

```azurepowershell-interactive
Set-AzureStorageFileContent `
   -Context $storageAcct.Context `
   -ShareName "myshare" `
   -Source "C:\Users\ContainerAdministrator\CloudDrive\SampleUpload.txt" `
   -Path "myDirectory\SampleUpload.txt"
```   

After uploading the file, use the [`Get-AzureStorageFile`](/powershell/module/Azure.Storage/Get-AzureStorageFile) cmdlet to check to make sure that the file was uploaded to your Azure file share. 

```azurepowershell-interactive
Get-AzureStorageFile `
   -Context $storageAcct.Context `
   -ShareName "myshare" `
   -Path "myDirectory" | Get-AzureStorageFile
```

### Download a file
You can use the [`Get-AzureStorageFileContent`](/powershell/module/azure.storage/get-azurestoragefilecontent) cmdlet to download a copy of the file you just uploaded to the scratch drive of your Cloud Shell.

```azurepowershell-interactive
Get-AzureStorageFileContent `
    -Context $storageAcct.Context `
    -ShareName "myshare" `
    -Path "myDirectory\SampleUpload.txt" `
    -Destination "C:\Users\ContainerAdministrator\CloudDrive\SampleDownload.txt"
```

After downloading the file, use the **dir** command to check to make sure that the file was downloaded. 

```azurepowershell-interactive
dir C:\Users\ContainerAdministrator\CloudDrive\
```

## Copy files

To copy files from one file share to another file share, use the [`Start-AzureStorageFileCopy`](/powershell/module/azure.storage/start-azurestoragefilecopy) cmdlet. You can also use this cmdlet to copy files to and from an Azure Blob storage container.  

This example creates a new share and copies the file you just uploaded to the new share. 

Create the new share.

```azurepowershell-interactive
New-AzureStorageShare `
    -Name "myshare2" `
    -Context $storageAcct.Context
```

Create the new directory.

```azurepowershell-interactive
New-AzureStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName "myshare2" `
   -Path "myDirectory2"
```

Copy the file to the new directory.

```azurepowershell-interactive
Start-AzureStorageFileCopy `
    -Context $storageAcct.Context `
    -SrcShareName "myshare" `
    -SrcFilePath "myDirectory\SampleUpload.txt" `
    -DestShareName "myshare2" `
    -DestFilePath "myDirectory2\SampleCopy.txt" `
    -DestContext $storageAcct.Context
```

Now, if you list the files in the new share, you should see your copied file.

```azurepowershell-interactive
Get-AzureStorageFile `
   -Context $storageAcct.Context `
   -ShareName "myshare2" `
   -Path "myDirectory2" | Get-AzureStorageFile
```

The `Start-AzureStorageFileCopy` cmdlet is convenient for simple moves between Azure file shares and Azure Blob storage containers, we recommend AzCopy for larger moves. Learn more about [AzCopy for Windows](../common/storage-use-azcopy.md) and [AzCopy for Linux](../common/storage-use-azcopy-linux.md). AzCopy must be installed locally - it is not available in Cloud Shell. 



## Optional: Use snapshots

A snapshot preserves a point-in-time copy of an Azure file share. File share snapshots are similar to other technologies you may already be familiar with like: 
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636) for Windows file systems such as NTFS and ReFS
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 

Create a share snapshot for a share by using the `Snapshot` method on a file share object. Get the file share object using the [Get-AzureStorageShare](/powershell/module/azure.storage/get-azurestorageshare) cmdlet. 

```azurepowershell-interactive
$share = Get-AzureStorageShare -Context $storageAcct.Context -Name "myshare"
$snapshot = $share.Snapshot()
```

Browse the contents of the share snapshot by passing the snapshot reference **$snapshot** to the `-Share` parameter of the [Get-AzureStorageFile](/powershell/module/azure.storage/get-azurestoragefile) cmdlet.

```azurepowershell-interactive
Get-AzureStorageFile -Share $snapshot
```

See the list of snapshots you've taken of your share using the [Get-AzureStorageShare](/powershell/module/azure.storage/get-azurestorageshare) cmdlet.

```azurepowershell-interactive
Get-AzureStorageShare -Context $storageAcct.Context | Where-Object { $_.Name -eq "myshare" -and $_.IsSnapshot -eq $true }
```

Restore a file by using the [Start-AzureStorageFileCopy](/powershell/module/azure.storage/start-azurestoragefilecopy) cmdlet. This example deletes the **SampleUpload.txt** file that was uploaded and then restores it from the snapshot as **SampleRestore.txt**.


Delete SampleUpload.txt.

```azurepowershell-interactive
Remove-AzureStorageFile `
    -Context $storageAcct.Context `
    -ShareName "myshare" `
    -Path "myDirectory\SampleUpload.txt"
```

Restore SampleUpload.txt from the share snapshot.

```azurepowershell-interactive
Start-AzureStorageFileCopy `
    -SrcShare $snapshot `
    -SrcFilePath "myDirectory\SampleUpload.txt" `
    -DestContext $storageAcct.Context `
    -DestShareName "myshare" `
    -DestFilePath "myDirectory\SampleRestore.txt"
```


## Clean up resources

When you are done, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) cmdlet to remove the resource group and all related resources. 

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
```


## Next steps

You can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md) operating systems.

