---
title: Managing Azure file shares with Azure PowerShell
description: Learn to manage Azure file shares using Azure PowerShell.
services: storage
author: wmgries
ms.service: storage
ms.topic: get-started-article
ms.date: 03/26/2018
ms.author: wgries
ms.component: files
---

# Managing Azure file shares with Azure PowerShell 
[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares can be mounted in Windows, Linux, and macOS. This guide walks you through the basics of working with Azure file shares using PowerShell. In this article you learn how to:

> [!div class="checklist"]
> * Create a resource group and a storage account
> * Create an Azure file share 
> * Create a directory
> * Upload a file 
> * Download a file
> * Create and use a share snapshot

If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you would like to install and use the PowerShell locally, this guide requires the Azure PowerShell module version 5.1.1 or later. To find out which version of the Azure PowerShell module you are running, execute `Get-Module -ListAvailable AzureRM`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can create a new one with the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) cmdlet. 

The following example creates a resource group named *myResourceGroup* in the East US region:

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a storage account
A storage account is a shared pool of storage you can use to deploy Azure file shares, or other storage resources such as blobs or queues. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account.

This example creates a storage account named `mystorageacct<random number>` and puts a reference to that storage account in the variable **$storageAcct**. Storage account names must be unique, so use `Get-Random` to append a number to the name to make it unique. 

```azurepowershell-interactive 
$storageAcct = New-AzureRmStorageAccount `
                  -ResourceGroupName "myResourceGroup" `
                  -Name "mystorageacct$(Get-Random)" `
                  -Location eastus `
                  -SkuName Standard_LRS 
```

## Create an Azure file share
Now you can create your first Azure file share. You can create a file share using the [New-AzureStorageShare](https://docs.microsoft.com/powershell/module/servicemanagement/azure.storage/new-azurestorageshare) cmdlet. This example creates a share named `myshare`.

```azurepowershell-interactive
New-AzureStorageShare `
   -Name myshare `
   -Context $storageAcct.Context
```

> [!Important]  
> Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

## Work with the contents of the Azure file share
Now that you have created an Azure file share, you can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can work with your Azure file share with the Azure PowerShell module. This is advantageous over mounting the file share with SMB, because all requests made with PowerShell are made with the File REST API enabling you to create, modify, and delete files and directories in your file share from:

- The PowerShell Cloud Shell (which cannot mount file shares over SMB).
- Clients which cannot mount SMB shares, such as on-premises clients which do not have port 445 unblocked.
- Serverless scenarios, such as in [Azure Functions](../../azure-functions/functions-overview.md). 


### Create directory
To create a new directory named *myDirectory* at the root of your Azure file share, use the [New-AzureStorageDirectory](https://docs.microsoft.com/powershell/module/azure.storage/new-azurestoragedirectory) cmdlet.


```azurepowershell-interactive
New-AzureStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName "myshare" `
   -Path "myDirectory"
```

### Upload a file
To demonstrate how to upload a file using the [Set-AzureStorageFileContent](/powershell/module/azure.storage/set-azurestoragefilecontent) cmdlet, we first need to create a file inside your PowerShell Cloud Shell's scratch drive to upload. 

This example puts the current date and time into a new file on your scratch drive, then uploads the file to the file share.

```azurepowershell-interactive
# this expression will put the current date and time into a new file on your scratch drive
Get-Date | Out-File -FilePath "C:\Users\ContainerAdministrator\CloudDrive\SampleUpload.txt" -Force

# this expression will upload that newly created file to your Azure file share
Set-AzureStorageFileContent `
   -Context $storageAcct.Context `
   -ShareName "myshare" `
   -Source "C:\Users\ContainerAdministrator\CloudDrive\SampleUpload.txt" `
   -Path "myDirectory\SampleUpload.txt"
```   

If you're running PowerShell locally, you should substitute `C:\Users\ContainerAdministrator\CloudDrive\` with a path that exists on your machine.

After uploading the file, you can use [Get-AzureStorageFile](/powershell/module/Azure.Storage/Get-AzureStorageFile) cmdlet to check to make sure that the file was uploaded to your Azure file share. 

```azurepowershell-interactive
Get-AzureStorageFile -Context $storageAcct.Context -ShareName "myshare" -Path "myDirectory" 
```

### Download a file
You can use the [Get-AzureStorageFileContent](/powershell/module/azure.storage/get-azurestoragefilecontent) cmdlet to download a copy of the file you just uploaded to the scratch drive of your Cloud Shell.

```azurepowershell-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists because you've run this example before.
Remove-Item 
    `-Path "C:\Users\ContainerAdministrator\CloudDrive\SampleDownload.txt" `
     -Force `
     -ErrorAction SilentlyContinue

Get-AzureStorageFileContent `
    -Context $storageAcct.Context `
    -ShareName "myshare" `
    -Path "myDirectory\SampleUpload.txt" ` 
    -Destination "C:\Users\ContainerAdministrator\CloudDrive\SampleDownload.txt"
```

After downloading the file, you can use the `Get-ChildItem` to see that the file has been downloaded to your PowerShell Cloud Shell's scratch drive.

```azurepowershell-interactive
Get-ChildItem -Path "C:\Users\ContainerAdministrator\CloudDrive"
``` 

### Copy files
One common task is to copy files from one file share to another file share, or to/from an Azure Blob storage container. To demonstrate this functionality, you can create a new share and copy the file you just uploaded over to this new share using the [Start-AzureStorageFileCopy](/powershell/module/azure.storage/start-azurestoragefilecopy) cmdlet. 

```azurepowershell-interactive
New-AzureStorageShare `
    -Name "myshare2" `
    -Context $storageAcct.Context
  
New-AzureStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName "myshare2" `
   -Path "myDirectory2"

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
Get-AzureStorageFile -Context $storageAcct.Context -ShareName "myshare2" -Path "myDirectory2" 
```

While the `Start-AzureStorageFileCopy` cmdlet is convenient for ad-hoc file moves between Azure file shares and Azure Blob storage containers, we recommend AzCopy for larger moves (in terms of number or size of files being moved). Learn more about [AzCopy for Windows](../common/storage-use-azcopy.md) and [AzCopy for Linux](../common/storage-use-azcopy-linux.md). AzCopy must be installed locally - it is not available in Cloud Shell. 

## Create and modify share snapshots
One additional useful task you can do with an Azure file share is to create share snapshots. A snapshot preserves a point in time for an Azure file share. Share snapshots are similar to operating system technologies you may already be familiar with such as:
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/en-us/windows/desktop/VSS/volume-shadow-copy-service-portal) for Windows file systems such as NTFS and ReFS
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 

You can create a share snapshot for a share by using the `Snapshot` method on PowerShell object for a file share, which is retrieved with the [Get-AzureStorageShare](/powershell/module/azure.storage/get-azurestorageshare) cmdlet. 

```azurepowershell-interactive
$share = Get-AzureStorageShare -Context $storageAcct.Context -Name "myshare"
$snapshot = $share.Snapshot()
```

### Browse share snapshots
You can browse the contents of the share snapshot by passing the snapshot reference (`$snapshot`) to the `-Share` parameter of the `Get-AzureStorageFile` cmdlet.

```azurepowershell-interactive
Get-AzureStorageFile -Share $snapshot
```

### List share snapshots
You can see the list of snapshots you've taken for your share with the following command.

```azurepowershell-interactive
Get-AzureStorageShare -Context $storageAcct.Context | Where-Object { $_.Name -eq "myshare" -and $_.IsSnapshot -eq $true }
```

### Restore from a share snapshot
You can restore a file by using the `Start-AzureStorageFileCopy` command we used before. For the purposes of this quickstart, we'll first delete our `SampleUpload.txt` file we previously uploaded so we can restore it from the snapshot.

```azurepowershell-interactive
# Delete SampleUpload.txt
Remove-AzureStorageFile `
    -Context $storageAcct.Context `
    -ShareName "myshare" `
    -Path "myDirectory\SampleUpload.txt"

# Restore SampleUpload.txt from the share snapshot
Start-AzureStorageFileCopy `
    -SrcShare $snapshot `
    -SrcFilePath "myDirectory\SampleUpload.txt" `
    -DestContext $storageAcct.Context `
    -DestShareName "myshare" `
    -DestFilePath "myDirectory\SampleUpload.txt"
```

### Delete a share snapshot
You can delete a share snapshot by using the [Remove-AzureStorageShare](/powershell/module/azure.storage/remove-azurestorageshare) cmdlet, with the variable containing the `$snapshot` reference to the `-Share` parameter.

```azurepowershell-interactive
Remove-AzureStorageShare -Share $snapshot
```

## Clean up resources
When you are done, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) cmdlet to remove the resource group and all related resources. 

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
```

You can alternatively remove resources one by one:

- To remove the Azure file shares we created for this quickstart.
```azurepowershell-interactive
Get-AzureStorageShare -Context $storageAcct.Context | Where-Object { $_.IsSnapshot -eq $false } | ForEach-Object { 
    Remove-AzureStorageShare -Context $storageAcct.Context -Name $_.Name
}
```

- To remove the storage account itself (this will implicitly remove the Azure file shares we created as well as any other storage resources you may have created such as an Azure Blob storage container).
```azurepowershell-interactive
Remove-AzureRmStorageAccount -ResourceGroupName $storageAcct.ResourceGroupName -Name $storageAcct.StorageAccountName
```

## Next steps
- [Managing file shares with the Azure portal](storage-how-to-use-files-portal.md)
- [Managing file shares with Azure CLI](storage-how-to-use-files-cli.md)
- [Managing file shares with Storage Explorer](storage-how-to-use-files-storage-explorer.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)
