---
title: Managing Azure file shares with PowerShell | Microsoft Docs 
description: Learn to use PowerShell to manage Azure Files.
services: storage
documentationcenter: ''
author: cynthn	
manager: jeconnoc
editor: tysonn

ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/01/2018
ms.author: cynthn
---

# Managing file shares with Azure PowerShell 
This guide walks you through the basics of working with Azure file shares using PowerShell: learn how to create a share, a directory within the share, upload files, and copy files between shares.

If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If would like choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.1.1 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can create a new one with [`New-AzureRmResourceGroup`](/powershell/module/azurerm.resources/new-azurermresourcegroup). The following example creates a resourc group named *myResourceGroup* in the East US region:

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create or get a storage account
A storage account is a shared pool of storage for which you can deploy Azure file share, or other storage resources such as blobs or queues. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account.

If you don't already have an existing storage account, you can create a new one using [`New-AzureRmStorageAccount`](/powershell/module/azurerm.storage/new-azurermstorageaccount). This example creates a storage account named *mystorage<10 random digits>* and puts a reference to that storage account in the variable `$storageAcct`. Storage account names must be unique, so we use **Get-Random** to append 10 random digit to the end to make it unique. 

```azurepowershell-interactive 
$storageAcct = New-AzureRmStorageAccount `
                  -ResourceGroupName "myResourceGroup" `
                  -Name "mystorage$(Get-Random)" `
                  -Location eastus `
                  -SkuName Standard_LRS 
```

If you already have an existing storage account you'd like to use for this tutorial, you can get a reference to the storage account using [`Get-AzureRmStorageAccount`](/powershell/module/azurerm.storage/get-azurermstorageaccount).

```azurepowershell-interactive
$storageAcct = Get-AzureRmStorageAccount -ResourceGroupName "myResourceGroup" -StorageAccountName "<my-storage-account-name>"
```

> [!Note]  
> You only need to run one of these cmdlets: if you executed `New-AzureRmStorageAccount`, you don't need to execute `Get-AzureRmStorageAccount`, the variable `$storageAcct` already has a reference to the storage account.

## Create a file share
Now you can create your first Azure file share. You can create a file share using [New-AzureStorageShare](/powershell/module/azurerm.storage/new-azurestorageshare). This example creates a share named *myshare* with a 10 GiB quota.

```azurepowershell-interactive
New-AzureStorageShare `
   -Name myshare `
   -Context $storageAcct.Context
```

> [!Important]  
> Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

## Maniuplating the content of the Azure file share
Now that you have created an Azure file share, you can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can maniuplate your Azure file share with the Azure PowerShell module. This is advantageous over mounting the file share with SMB, because all requests made with PowerShell are made with the File REST API enabling you to create, modify, and delete files and directories in your file share from:

- The PowerShell Cloud Shell (which cannot mount file shares over SMB)
- Clients which cannot mount SMB shares, such as on-premises clients which do not have port 445 unblocked.
- Serverless scenarios, such as in [Azure Functions](../../azure-functions/functions-overview.md). 

### Create directory
To create a new directory named *myDirectory* at the root at your Azure file share, use the [`New-AzureStorageDirectory`](/powershell/module/azurerm.storage/new-azurestoragedirectory) cmdlet.

```azurepowershell-interactive
New-AzureStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName "myshare" `
   -Path "myDirectory"
```

### Upload the file to Azure
To demostrate how to upload a file using the [`Set-AzureStorageFileContent`](/powershell/module/azure.storage/set-azurestoragefilecontent) cmdlet, we first need to create a file inside your PowerShell Cloud Shell's scratch drive to upload. The following commands will create and then upload the file: 

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

If you're running PowerShell locally, you should substitute `C:\Users\ContainerAdministrator\CloudDrive\SampleUpload.txt` with a path that exists on your machine.

After uploading the file, you can use [`Get-AzureStorageFile`](/powershell/module/Azure.Storage/Get-AzureStorageFile) to check to make sure the file was uploaded to your Azure file share. 

```azurepowershell-interactive
Get-AzureStorageFile -Context $storageAcct.Context -ShareName "myshare" -Path "myDirectory" 
```

### Download a file
You can use the [`Get-AzureStorageFileContent`](/powershell/module/azure.storage/get-azurestoragefilecontent) to download a copy of the file you just uploaded to your scratch drive.

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

### Copy files
One common task is to copy files from one file share to another file share, or to/from a Azure Blob storage container. To demonstrate this functionality, you can create a new share and copy the file you just uploaded over to this new share using the [`Start-AzureStorageFileCopy`](/powershell/module/azure.storage/start-azurestoragefilecopy) cmdlet. 

```azurepowershell-interactive
New-AzureStorageShare `
    -Name "myshare2" `
    -Context $storageAcct.Context
  
New-AzureStorageDirectory `
   -Context $storageAcct.Context `
   -ShareName "myshare2" `
   -Path "myDirectory2"

Start-AzureStorageFileCopy 
    -Context $storageAcct.Context `
    -SrcShareName "myshare" `
    -SrcFilePath "myDirectory\SampleUpload.txt" `
    -DestShareName "myshare2" `
    -DestFilePath "myDirectory2\file.txt" `
    -DestContext $storageAcct.Context
```

Now, if you list the files in the new share, you should see your file.

```azurepowershell-interactive
Get-AzureStorageFile -Context $storageAcct.Context -Share "myshare2" -Path "myDirectory2" 
```

While the `Start-AzureStorageFileCopy` is a convenient cmdlet for ad-hoc file moves between Azure file shares and Azure Blob storage containers, we recommend AzCopy for larger moves (in terms of number or size of files being moved). Learn more about [AzCopy for Windows](../common/storage-use-azcopy.md) and [AzCopy for Linux](../common/storage-use-azcopy-linux.md). AzCopy must be installed locally - it is not available in Cloud Shell 

## Clean up resources
When you are done, you can use [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) to remove the resource group and all related resources. 

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
- [Managing file shares with Azure CLI](storage-quickstart-files-cli.md)
- [Managing file shares with the Azure portal](storage-how-to-use-files-powershell.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)