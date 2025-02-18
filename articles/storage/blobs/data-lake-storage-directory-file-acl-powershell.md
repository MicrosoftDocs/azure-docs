---
title: 'Use PowerShell to manage data: Azure Data Lake Storage'
titleSuffix: Azure Storage
description: Use PowerShell cmdlets to manage directories and files in storage accounts that have a hierarchical namespace enabled.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: how-to
ms.date: 11/26/2024
ms.author: normesta
ms.reviewer: prishet
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
---

# Use PowerShell to manage directories and files in Azure Data Lake Storage

This article shows you how to use PowerShell to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use PowerShell to manage ACLs in Azure Data Lake Storage](data-lake-storage-acl-powershell.md).

[Reference](/powershell/module/Az.Storage/) | [Gen1 to Gen2 mapping](#gen1-gen2-map) | [Give feedback](https://github.com/Azure/azure-powershell/issues)

## Prerequisites

- An Azure subscription. For more information, see [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

- .NET Framework is 4.7.2 or greater installed. For more information, see [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).

- PowerShell version `5.1` or higher.

## Install the PowerShell module

1. Verify that the version of PowerShell that 's installed is `5.1` or higher by using the following command.

   ```powershell
   echo $PSVersionTable.PSVersion.ToString()
   ```

   To upgrade your version of PowerShell, see [Upgrading existing Windows PowerShell](/powershell/scripting/install/installing-windows-powershell#upgrading-existing-windows-powershell)

2. Install **Az.Storage** module.

   ```powershell
   Install-Module Az.Storage -Repository PSGallery -Force  
   ```

   For more information about how to install PowerShell modules, see [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell)

## Connect to the account

1. Open a Windows PowerShell command window, and then sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, and you are not prompted to select the subscription, then set your active subscription to the subscription of the storage account that you want to operate upon. In this example, replace the `<subscription-id>` placeholder value with the ID of your subscription.

   ```powershell
   Select-AzSubscription -SubscriptionId <subscription-id>
   ```
   ```

3. Get the storage account context.

   ```powershell
   $ctx = New-AzStorageContext -StorageAccountName '<storage-account-name>' -UseConnectedAccount
   ```

## Create a container

A container acts as a file system for your files. You can create one by using the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) cmdlet.

This example creates a container named `my-file-system`.

```powershell
$filesystemName = "my-file-system"
New-AzStorageContainer -Context $ctx -Name $filesystemName
```

## Create a directory

Create a directory reference by using the [New-AzDataLakeGen2Item](/powershell/module/az.storage/new-azdatalakegen2item) cmdlet.

This example adds a directory named `my-directory` to a container.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
New-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -Directory
```

This example adds the same directory, but also sets the permissions, umask, property values, and metadata values.

```powershell
$dir = New-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -Directory -Permission rwxrwxrwx -Umask ---rwx---  -Property @{"ContentEncoding" = "UDF8"; "CacheControl" = "READ"} -Metadata  @{"tag1" = "value1"; "tag2" = "value2" }
```

## Show directory properties

This example gets a directory by using the [Get-AzDataLakeGen2Item](/powershell/module/az.storage/get-azdatalakegen2item) cmdlet, and then prints property values to the console.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
$dir =  Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname
$dir.ACL
$dir.Permissions
$dir.Group
$dir.Owner
$dir.Properties
$dir.Properties.Metadata
```

> [!NOTE]
> To get the root directory of the container, omit the `-Path` parameter.

## Rename or move a directory

Rename or move a directory by using the [Move-AzDataLakeGen2Item](/powershell/module/az.storage/move-azdatalakegen2item) cmdlet.

This example renames a directory from the name `my-directory` to the name `my-new-directory`.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
$dirname2 = "my-new-directory/"
Move-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -DestFileSystem $filesystemName -DestPath $dirname2
```

> [!NOTE]
> Use the `-Force` parameter if you want to overwrite without prompts.

This example moves a directory named `my-directory` to a subdirectory of `my-directory-2` named `my-subdirectory`.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
$dirname2 = "my-directory-2/my-subdirectory/"
Move-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -DestFileSystem $filesystemName -DestPath $dirname2
```

## Delete a directory

Delete a directory by using the [Remove-AzDataLakeGen2Item](/powershell/module/az.storage/remove-azdatalakegen2item) cmdlet.

This example deletes a directory named `my-directory`.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
Remove-AzDataLakeGen2Item  -Context $ctx -FileSystem $filesystemName -Path $dirname
```

You can use the `-Force` parameter to remove the file without a prompt.

## Download from a directory

Download a file from a directory by using the [Get-AzDataLakeGen2ItemContent](/powershell/module/az.storage/get-azdatalakegen2itemcontent) cmdlet.

This example downloads a file named `upload.txt` from a directory named `my-directory`.

```powershell
$filesystemName = "my-file-system"
$filePath = "my-directory/upload.txt"
$downloadFilePath = "download.txt"
Get-AzDataLakeGen2ItemContent -Context $ctx -FileSystem $filesystemName -Path $filePath -Destination $downloadFilePath
```

## List directory contents

List the contents of a directory by using the [Get-AzDataLakeGen2ChildItem](/powershell/module/az.storage/get-azdatalakegen2childitem) cmdlet. You can use the optional parameter `-OutputUserPrincipalName` to get the name (instead of the object ID) of users.

This example lists the contents of a directory named `my-directory`.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
Get-AzDataLakeGen2ChildItem -Context $ctx -FileSystem $filesystemName -Path $dirname -OutputUserPrincipalName
```

The following example lists the `ACL`, `Permissions`, `Group`, and `Owner` properties of each item in the directory. The `-FetchProperty` parameter is required to get values for the `ACL` property.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
$properties = Get-AzDataLakeGen2ChildItem -Context $ctx -FileSystem $filesystemName -Path $dirname -Recurse -FetchProperty
$properties.ACL
$properties.Permissions
$properties.Group
$properties.Owner
```

> [!NOTE]
> To list the contents of the root directory of the container, omit the `-Path` parameter.

## Upload a file to a directory

Upload a file to a directory by using the [New-AzDataLakeGen2Item](/powershell/module/az.storage/new-azdatalakegen2item) cmdlet.

This example uploads a file named `upload.txt` to a directory named `my-directory`.

```powershell
$localSrcFile =  "upload.txt"
$filesystemName = "my-file-system"
$dirname = "my-directory/"
$destPath = $dirname + (Get-Item $localSrcFile).Name
New-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $destPath -Source $localSrcFile -Force
```

This example uploads the same file, but then sets the permissions, umask, property values, and metadata values of the destination file. This example also prints these values to the console.

```powershell
$file = New-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $destPath -Source $localSrcFile -Permission rwxrwxrwx -Umask ---rwx--- -Property @{"ContentEncoding" = "UDF8"; "CacheControl" = "READ"} -Metadata  @{"tag1" = "value1"; "tag2" = "value2" }
$file1
$file1.Properties
$file1.Properties.Metadata

```

> [!NOTE]
> To upload a file to the root directory of the container, omit the `-Path` parameter.

## Show file properties

This example gets a file by using the [Get-AzDataLakeGen2Item](/powershell/module/az.storage/get-azdatalakegen2item) cmdlet, and then prints property values to the console.

```powershell
$filepath =  "my-directory/upload.txt"
$filesystemName = "my-file-system"
$file = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $filepath
$file
$file.ACL
$file.Permissions
$file.Group
$file.Owner
$file.Properties
$file.Properties.Metadata
```

## Delete a file

Delete a file by using the [Remove-AzDataLakeGen2Item](/powershell/module/az.storage/remove-azdatalakegen2item) cmdlet.

This example deletes a file named `upload.txt`.

```powershell
$filesystemName = "my-file-system"
$filepath = "upload.txt"
Remove-AzDataLakeGen2Item  -Context $ctx -FileSystem $filesystemName -Path $filepath
```

You can use the `-Force` parameter to remove the file without a prompt.

<a id="gen1-gen2-map"></a>

## Gen1 to Gen2 Mapping

The following table shows how the cmdlets used for Data Lake Storage Gen1 map to the cmdlets for Data Lake Storage.

> [!NOTE]
> Azure Data Lake Storage Gen1 is now retired. See the retirement announcement [here](https://aka.ms/data-lake-storage-gen1-retirement-announcement). Data Lake Storage Gen1 resources are no longer accessible. If you require special assistance, please [contact us](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

|Data Lake Storage Gen1 cmdlet| Data Lake Storage cmdlet| Notes |
|--------|---------|-----|
|Get-AzDataLakeStoreChildItem|Get-AzDataLakeGen2ChildItem|By default, the Get-AzDataLakeGen2ChildItem cmdlet only lists the first level child items. The -Recurse parameter lists child items recursively. |
|Get-AzDataLakeStoreItem<br>Get-AzDataLakeStoreItemAclEntry<br>Get-AzDataLakeStoreItemOwner<br>Get-AzDataLakeStoreItemPermission|Get-AzDataLakeGen2Item|The output items of the Get-AzDataLakeGen2Item cmdlet have these properties: Acl, Owner, Group, Permission.|
|Get-AzDataLakeStoreItemContent|Get-AzDataLakeGen2FileContent|The Get-AzDataLakeGen2FileContent cmdlet download file content to local file.|
|Move-AzDataLakeStoreItem|Move-AzDataLakeGen2Item||
|New-AzDataLakeStoreItem|New-AzDataLakeGen2Item|This cmdlet uploads the new file content from a local file.|
|Remove-AzDataLakeStoreItem|Remove-AzDataLakeGen2Item||
|Set-AzDataLakeStoreItemOwner<br>Set-AzDataLakeStoreItemPermission<br>Set-AzDataLakeStoreItemAcl|Update-AzDataLakeGen2Item|The Update-AzDataLakeGen2Item cmdlet updates a single item only, and not recursively. If you want to update recursively, list items by using the Get-AzDataLakeStoreChildItem cmdlet, then pipeline to the Update-AzDataLakeGen2Item cmdlet.|
|Test-AzDataLakeStoreItem|Get-AzDataLakeGen2Item|The Get-AzDataLakeGen2Item cmdlet reports an error if the item doesn't exist.|

## See also

- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Storage PowerShell cmdlets](/powershell/module/az.storage)
