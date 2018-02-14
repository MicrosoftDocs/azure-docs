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
# Quickstart: Managing file shares with Azure PowerShell 

This quickstart walks you through the basics of working with Azure file shares using PowerShell. Learn how to create a share, a directory within the share, upload files, and copy files between shares.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.1.1 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.



## Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

This example creates a resource group named *myResourceGroup* in *East US*. 

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a storage account

Create a new storage account, within the resource group that you created, that will be used to host the file share using [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/new-azurermstorageaccount). This example creates a storage account named *mystorage<10 random digits>* using locally redundant storage. Storage account names must be unique, so we use **Get-Random** to append 10 random digit to the end to make it unique.

```azurecli-interactive 
$storageName = "mystorage$(Get-Random)"
New-AzureRmStorageAccount -ResourceGroupName myResourceGroup `
  -Name $storageName `
  -Location eastus `
  -SkuName Standard_LRS 
```

## Get the storage account key

Storage account keys are used to control access to resources in a storage account. They are automatically created when you create a storage account. View the storage account keys using the [Get-AzureRmStorageAccountKey](/powershell/module/azurerm.storage/Get-AzureRmStorageAccountKey) cmdlet. This example displays the storage account keys for *mystorageaccount* in table format.

```azurecli-interactive 
Get-AzureRmStorageAccountKey `
   -ResourceGroupName myResourceGroup `
   -AccountName $storageName | Format-table
```

Copy *key 1* where you can get to it easily to use in next step.

## Create a context

Create the storage account context. The context encapsulates the storage account name and account key. 

Replace `<storage-account-key>` with the key you copied in the previous step.

```azurepowershell-interactive
$myContext = New-AzureStorageContext $storageName <storage-account-key>
```

## Create a file share

Now you can create your first file share. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account. Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://msdn.microsoft.com/library/azure/dn167011.aspx).

Create file shares using [az storage share create](/cli/azure/storage/share#create). This example creates a share named *myshare* with a 10 GiB quota. Be sure to enter your own storage account key in the last line.

```azurepowershell-interactive
New-AzureStorageShare `
   -Name myshare `
   -Context $myContext
```

## Create a directory

Adding a directory provides a hierarchical structure for managing your file share. You can create multiple levels, but you must ensure that all parent directories exist before creating a subdirectory. For example, for path *myDirectory/mySubDirectory*, you must first create directory *myDirectory*, then create *mySubDirectory*.

This example use the [New-AzureStorageDirectory]() to create a directory named *myDirectory* in the file share called *myshare*.


```azurepowershell-interactive
New-AzureStorageDirectory `
   -Context $myContext `
   -ShareName myshare `
   -Path myDirectory
```

## Create a file

Create a file in your Cloud Shell session by piping the output of Get-AzureFileStorage to a .txt file.

```azurepowershell-interactive
Get-AzureStorageFile -Context $myContext -ShareName myshare -Path myDirectory | Out-File C:\Users\ContainerAdministrator\clouddrive\output.txt
```

You can use Vim to check the contents of the file. 

```azurepowershell-interactive
vim C:\Users\ContainerAdministrator\clouddrive\output.txt
```

You may have to scroll the Cloud Shell windows to see the contents.

To close out of Vim, hit the **Esc** key and type `:x`.

## Upload the file to Azure

Upload the file from your Cloud Shell session to your new Azure file share using [Set-AzureStorageFileContent](/powershell/module/azure.storage/set-azurestoragefilecontent)

```azurepowershell-interactive
Set-AzureStorageFileContent `
   -Context $myContext `
   -ShareName myshare `
   -Source C:\Users\ContainerAdministrator\clouddrive\output.txt `
   -Path myDirectory/output.txt
```   

Check to make sure the file was uploaded by using [Get-AzureStorageFile](/powershell/module/Azure.Storage/Get-AzureStorageFile) to list the contents of the file share. This example lists the files in *myshare/myDirectory* and returns the name of the file that you uploaded.


```azurepowershell-interactive
Get-AzureStorageFile -Context myContext -ShareName myshare -Path myDirectory 
```


## Copy files

Now, create a new share and copy the file you uploaded over to this new share. To copy files, use [az storage file copy](/cli/azure/storage/file/copy). You can copy a file to another file, a file to a blob, or a blob to a file.  This example creates a second share named *myshare2* and copies *samplefile.txt* to the root of the new share. 

```azurepowershell-interactive
New-AzureStorageShare `
   -Name myshare2 `
   -Context $myContext

Start-AzureStorageFileCopy 
   -SrcShareName myshare `
   -SrcFilePath myshare/file.txt `
   -DestShareName myshare2 `
   -DestFilePath myshare2/file.txt `
   -Context $myContext `
   -DestContext $myContext
```


Now, if you list the files in the new share, you should see your file.

```azurecli-interactive
Get-AzureStorageFile -Share myshare2 -Path myshare2 | Get-AzureStorageFile
```


## Clean up resources

When you are done, you can use [az group delete](/cli/azure/group#delete) to remove the resource group and all related resources. 

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
```


## Next steps
In this quickstart, you've learned to create a share, a directory within the share, upload files, and copy files between shares.

Advance to the next article to learn more
> [!div class="nextstepaction"]
> [Next steps button](storage-sync-files-server-endpoint.md)





