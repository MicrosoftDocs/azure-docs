---
title: Create and manage directories in Azure Storage by using PowerShell
description: Use PowerShell cmdlets to create and manage directories in Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 06/26/2019
ms.author: normesta
---

# Create and manage directories in Azure Storage by using PowerShell

This article shows you how to use PowerShell to manage directories in storage accounts that have a hierarchical namespace.

## First, connect to the storage account

See [Using Azure PowerShell with Azure Storage](../common/storage-powershell-guide-full.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

## Rename or move a directory

Rename or move a directory by using the `Move-AzStorageBlobDirectory` cmdlet.

This example renames a directory from the name `my-directory` to the name `my-new-directory`.

```powershell
$containerName = "mycontainer"
$sourceDirectory = "my-directory"
$destinationDirectory = "my-new-directory"
$dir3 = Move-AzStorageBlobDirectory -Context $ctx -SrcContainer $containerName -SrcPath $sourceDirectory -DestContainer $containerName -DestPath $destinationDirectory
```

## Delete a directory

Delete a directory by using the `Remove-AzStorageBlobDirectory` cmdlet.

This example deletes a directory named `my-directory`. 

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
Remove-AzStorageBlobDirectory -Context $ctx -Container $containerName -Path $directory 
```

## Upload a file to a directory

Upload a file to a directory by using the `Set-AzStorageBlobContent` cmdlet.

This example uploads a file named `text1.txt` to a directory named `my-directory`. 

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
$localSrcFile = "C:\text1.txt"
Set-AzStorageBlobContent -Context $ctx -File $localSrcFile -Container $containerName -Blob "$($directory)/text1.txt" -Force 
```

## Download a file from a directory

Download a file from a directory by using the `Get-AzStorageBlobFromDirectory` cmdlet.

This example downloads a file named `text1.txt` from a directory named `my-directory`. 

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
$blob = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName  -BlobRelativePath text1.txt
$blob
```

## List the contents of a directory

List the contents of a directory by using the `Get-AzStorageBlobFromDirectory` cmdlet.

This example lists the contents of a directory named `my-directory`. 

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName 
```

## Next steps

To learn more about working with Blob storage by using PowerShell, see [Using Azure PowerShell with Azure Storage](../common/storage-powershell-guide-full.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

To find a comprehensive list of Microsoft Azure PowerShell Storage cmdlets, see [Storage PowerShell cmdlets](/powershell/module/az.storage).

