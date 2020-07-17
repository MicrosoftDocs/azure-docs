---
title: Quickstart for managing Azure file shares with Azure PowerShell
description: Use this quickstart to learn to manage Azure file shares using Azure PowerShell.
author: roygara
ms.service: storage
ms.topic: quickstart
ms.date: 10/26/2018
ms.author: rogarana
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Create and manage an Azure file share with Azure PowerShell 
This guide walks you through the basics of working with [Azure file shares](storage-files-introduction.md) with PowerShell. Azure file shares are just like other file shares, but stored in the cloud and backed by the Azure platform. Azure File shares support the industry standard SMB protocol and enable file sharing across multiple machines, applications, and instances. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you would like to install and use the PowerShell locally, this guide requires the Azure PowerShell module Az version 0.7 or later. To find out which version of the Azure PowerShell module you are running, execute `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you are running PowerShell locally, you also need to run `Login-AzAccount` to login to your Azure account.

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

> [!Note]  
> Shares greater than 5 TiB (up to a maximum of 100 TiB per share) are only available in locally redundant (LRS) and zone redundant (ZRS) storage accounts. To create a geo-redundant (GRS) or geo-zone-redundant (GZRS) storage account, remove the `-EnableLargeFileShare` parameter.

## Create an Azure file share
Now you can create your first Azure file share. You can create a file share using the [New-AzRmStorageShare](/powershell/module/az.storage/New-AzRmStorageShare) cmdlet. This example creates a share named `myshare`.

```azurepowershell-interactive
$shareName = "myshare"

New-AzRmStorageShare `
    -StorageAccount $storageAcct `
    -Name $shareName `
    -QuotaGiB 1024 | Out-Null
```

Share names need to be all lower-case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

## Use your Azure file share
Azure Files provides two methods of working with files and folders within your Azure file share: the industry standard [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) and the [File REST protocol](https://docs.microsoft.com/rest/api/storageservices/file-service-rest-api). 

To mount a file share with SMB, see the following document based on your OS:
- [Windows](storage-how-to-use-files-windows.md)
- [Linux](storage-how-to-use-files-linux.md)
- [macOS](storage-how-to-use-files-mac.md)

### Using an Azure file share with the File REST protocol 
It is possible work with the File REST protocol directly (i.e. handcrafting REST HTTP calls yourself), but the most common way to use the File REST protocol is to use the Azure PowerShell module, the [Azure CLI](storage-how-to-use-files-cli.md), or an Azure Storage SDK, all of which provide a nice wrapper around the File REST protocol in the scripting/programming language of your choice.  

In most cases, you will use your Azure file share over the SMB protocol, as this allows you to use the existing applications and tools you expect to be able to use, but there are several reasons why it is advantageous to use the File REST API rather than SMB, such as:

- You are browsing your file share from the PowerShell Cloud Shell (which cannot mount file shares over SMB).
- You are taking advantage of serverless resources, such as [Azure Functions](../../azure-functions/functions-overview.md). 
- You are creating a value-add service that will interact with many Azure file shares, such as performing backup or antivirus scans.

The following examples show how to use the Azure PowerShell module to manipulate your Azure file share with the File REST protocol. The `-Context` parameter is used to retrieve the storage account key to perform the indicated actions against the file share. To retrieve the storage account key, you must have the RBAC role of `Owner` on the storage account.

#### Create directory
To create a new directory named *myDirectory* at the root of your Azure file share, use the [New-AzStorageDirectory](/powershell/module/az.storage/New-AzStorageDirectory) cmdlet.

```azurepowershell-interactive
New-AzStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName $shareName `
   -Path "myDirectory"
```

#### Upload a file
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

#### Download a file
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

#### Copy files
One common task is to copy files from one file share to another file share. To demonstrate this functionality, you can create a new share and copy the file you just uploaded over to this new share using the [Start-AzStorageFileCopy](/powershell/module/az.storage/Start-AzStorageFileCopy) cmdlet. 

```azurepowershell-interactive
$otherShareName = "myshare2"

New-AzRmStorageShare `
    -StorageAccount $storageAcct `
    -Name $otherShareName `
    -QuotaGiB 1024 | Out-Null
  
New-AzStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName $otherShareName `
   -Path "myDirectory2"

Start-AzStorageFileCopy `
    -Context $storageAcct.Context `
    -SrcShareName $shareName `
    -SrcFilePath "myDirectory\SampleUpload.txt" `
    -DestShareName $otherShareName `
    -DestFilePath "myDirectory2\SampleCopy.txt" `
    -DestContext $storageAcct.Context
```

Now, if you list the files in the new share, you should see your copied file.

```azurepowershell-interactive
Get-AzStorageFile `
    -Context $storageAcct.Context `
    -ShareName $otherShareName `
    -Path "myDirectory2" 
```

While the `Start-AzStorageFileCopy` cmdlet is convenient for ad hoc file moves between Azure file shares, for migrations and larger data movements, we recommend `robocopy` on Windows and `rsync` on macOS and Linux. `robocopy` and `rsync` use SMB to perform the data movements instead of the FileREST API.

## Create and manage share snapshots
One additional useful task you can do with an Azure file share is to create share snapshots. A snapshot preserves a point in time for an Azure file share. Share snapshots are similar to operating system technologies you may already be familiar with such as:

- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/windows/desktop/VSS/volume-shadow-copy-service-portal) for Windows file systems such as NTFS and ReFS.
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems.
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 

You can create a share snapshot for a share by using the `Snapshot` method on PowerShell object for a file share, which is retrieved with the [Get-AzStorageShare](/powershell/module/az.storage/Get-AzStorageShare) cmdlet. 

```azurepowershell-interactive
$share = Get-AzStorageShare -Context $storageAcct.Context -Name $shareName
$snapshot = $share.CloudFileShare.Snapshot()
```

### Browse share snapshots
You can browse the contents of the share snapshot by passing the snapshot reference (`$snapshot`) to the `-Share` parameter of the `Get-AzStorageFile` cmdlet.

```azurepowershell-interactive
Get-AzStorageFile -Share $snapshot
```

### List share snapshots
You can see the list of snapshots you've taken for your share with the following command.

```azurepowershell-interactive
Get-AzStorageShare `
        -Context $storageAcct.Context | `
    Where-Object { $_.Name -eq $shareName -and $_.IsSnapshot -eq $true }
```

### Restore from a share snapshot
You can restore a file by using the `Start-AzStorageFileCopy` command we used before. For the purposes of this quickstart, we'll first delete our `SampleUpload.txt` file we previously uploaded so we can restore it from the snapshot.

```azurepowershell-interactive
# Delete SampleUpload.txt
Remove-AzStorageFile `
    -Context $storageAcct.Context `
    -ShareName $shareName `
    -Path "myDirectory\SampleUpload.txt"

# Restore SampleUpload.txt from the share snapshot
Start-AzStorageFileCopy `
    -SrcShare $snapshot `
    -SrcFilePath "myDirectory\SampleUpload.txt" `
    -DestContext $storageAcct.Context `
    -DestShareName $shareName `
    -DestFilePath "myDirectory\SampleUpload.txt"
```

### Delete a share snapshot
You can delete a share snapshot by using the [Remove-AzStorageShare](/powershell/module/az.storage/Remove-AzStorageShare) cmdlet, with the variable containing the `$snapshot` reference to the `-Share` parameter.

```azurepowershell-interactive
Remove-AzStorageShare `
    -Share $snapshot `
    -Confirm:$false `
    -Force
```

## Clean up resources
When you are done, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to remove the resource group and all related resources. 

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup
```

You can alternatively remove resources one by one:

- To remove the Azure file shares we created for this quickstart.

    ```azurepowershell-interactive
    Get-AzRmStorageShare -StorageAccount $storageAcct | Remove-AzRmStorageShare -Force
    ```

    > [!Note]  
    > You must delete all the share snapshots for the Azure file shares you created before deleting the Azure file share.

- To remove the storage account itself (this will implicitly remove the Azure file shares we created as well as any other storage resources you may have created such as an Azure Blob storage container).

    ```azurepowershell-interactive
    Remove-AzStorageAccount `
        -ResourceGroupName $storageAcct.ResourceGroupName `
        -Name $storageAcct.StorageAccountName
    ```

## Next steps
> [!div class="nextstepaction"]
> [What is Azure Files?](storage-files-introduction.md)