---
title: Azure Data Lake Storage Gen2 PowerShell for files & ACLs
description: Use PowerShell cmdlets to manage directories and file and directory access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
services: storage
author: normesta
ms.service: storage
ms.subservice: data-lake-storage-gen2
ms.topic: how-to
ms.date: 04/21/2020
ms.author: normesta
ms.reviewer: prishet
---

# Use PowerShell to manage directories, files, and ACLs in Azure Data Lake Storage Gen2

This article shows you how to use PowerShell to create and manage directories, files, and permissions in storage accounts that has hierarchical namespace (HNS) enabled. 

[Gen1 to Gen2 mapping](#gen1-gen2-map) | [Give feedback](https://github.com/Azure/azure-powershell/issues)

## Prerequisites

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has hierarchical namespace (HNS) enabled. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.
> * .NET Framework is 4.7.2 or greater installed. See [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).
> * PowerShell version `5.1` or higher.

## Install the PowerShell module

1. Verify that the version of PowerShell that have installed is `5.1` or higher by using the following command.    

   ```powershell
   echo $PSVersionTable.PSVersion.ToString() 
   ```
    
   To upgrade your version of PowerShell, see [Upgrading existing Windows PowerShell](https://docs.microsoft.com/powershell/scripting/install/installing-windows-powershell?view=powershell-6#upgrading-existing-windows-powershell)
    
2. Install **Az.Storage** module.

   ```powershell
   Install-Module Az.Storage -Repository PSGallery -Force  
   ```

   For more information about how to install PowerShell modules, see [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.0.0)

## Connect to the account

Open a Windows PowerShell command window, and then sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that you want create and manage directories in. In this example, replace the `<subscription-id>` placeholder value with the ID of your subscription.

```powershell
Select-AzSubscription -SubscriptionId <subscription-id>
```

Next, choose how you want your commands to obtain authorization to the storage account. 

### Option 1: Obtain authorization by using Azure Active Directory (AD)

With this approach, the system ensures that your user account has the appropriate role-based access control (RBAC) assignments and ACL permissions. 

```powershell
$ctx = New-AzStorageContext -StorageAccountName '<storage-account-name>' -UseConnectedAccount
```

### Option 2: Obtain authorization by using the storage account key

With this approach, the system doesn't check RBAC or ACL permissions.

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
$ctx = $storageAccount.Context
```

## Create a file system

A file system acts as a container for your files. You can create one by using the `New-AzDatalakeGen2FileSystem` cmdlet. 

This example creates a file system named `my-file-system`.

```powershell
$filesystemName = "my-file-system"
New-AzDatalakeGen2FileSystem -Context $ctx -Name $filesystemName
```

## Create a directory

Create a directory reference by using the `New-AzDataLakeGen2Item` cmdlet. 

This example adds a directory named `my-directory` to a file system.

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

This example gets a directory by using the `Get-AzDataLakeGen2Item` cmdlet, and then prints property values to the console.

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

## Rename or move a directory

Rename or move a directory by using the `Move-AzDataLakeGen2Item` cmdlet.

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
Move-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname1 -DestFileSystem $filesystemName -DestPath $dirname2
```

## Delete a directory

Delete a directory by using the `Remove-AzDataLakeGen2Item` cmdlet.

This example deletes a directory named `my-directory`. 

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
Remove-AzDataLakeGen2Item  -Context $ctx -FileSystem $filesystemName -Path $dirname 
```

You can use the `-Force` parameter to remove the file without a prompt.

## Download from a directory

Download a file from a directory by using the `Get-AzDataLakeGen2ItemContent` cmdlet.

This example downloads a file named `upload.txt` from a directory named `my-directory`. 

```powershell
$filesystemName = "my-file-system"
$filePath = "my-directory/upload.txt"
$downloadFilePath = "download.txt"
Get-AzDataLakeGen2ItemContent -Context $ctx -FileSystem $filesystemName -Path $filePath -Destination $downloadFilePath
```

## List directory contents

List the contents of a directory by using the `Get-AzDataLakeGen2ChildItem` cmdlet. You can use the optional parameter `-OutputUserPrincipalName` to get the name (instead of the object ID) of users.

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

To list the contents of a file system, omit the `-Path` parameter from the command.

## Upload a file to a directory

Upload a file to a directory by using the `New-AzDataLakeGen2Item` cmdlet.

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

## Show file properties

This example gets a file by using the `Get-AzDataLakeGen2Item` cmdlet, and then prints property values to the console.

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

Delete a file by using the `Remove-AzDataLakeGen2Item` cmdlet.

This example deletes a file named `upload.txt`. 

```powershell
$filesystemName = "my-file-system"
$filepath = "upload.txt"
Remove-AzDataLakeGen2Item  -Context $ctx -FileSystem $filesystemName -Path $filepath 
```

You can use the `-Force` parameter to remove the file without a prompt.

## Manage access permissions

You can get, set, and update access permissions of file systems, directories and files. These permissions are captured in access control lists (ACLs).

> [!NOTE]
> If you're using Azure Active Directory (Azure AD) to authorize commands, then make sure that your security principal has been assigned the [Storage Blob Data Owner role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control).

### Get an ACL

Get the ACL of a directory or file by using the `Get-AzDataLakeGen2Item`cmdlet.

This example gets the ACL of a **file system** and then prints the ACL to the console.

```powershell
$filesystemName = "my-file-system"
$filesystem = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName
$filesystem.ACL
```

This example gets the ACL of a **directory**, and then prints the ACL to the console.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
$dir = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname
$dir.ACL
```

This example gets the ACL of a **file** and then prints the ACL to the console.

```powershell
$filePath = "my-directory/upload.txt"
$file = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $filePath
$file.ACL
```

The following image shows the output after getting the ACL of a directory.

![Get ACL output](./media/data-lake-storage-directory-file-acl-powershell/get-acl.png)

In this example, the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

### Set an ACL

Use the `set-AzDataLakeGen2ItemAclObject` cmdlet to create an ACL for the owning user, owning group, or other users. Then, use the `Update-AzDataLakeGen2Item` cmdlet to commit the ACL.

This example sets the ACL on a **file system** for the owning user, owning group, or other users, and then prints the ACL to the console.

```powershell
$filesystemName = "my-file-system"
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rw- 
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType group -Permission rw- -InputObject $acl 
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType other -Permission -wx -InputObject $acl
Update-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Acl $acl
$filesystem = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName
$filesystem.ACL
```

This example sets the ACL on a **directory** for the owning user, owning group, or other users, and then prints the ACL to the console.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rw- 
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType group -Permission rw- -InputObject $acl 
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType other -Permission -wx -InputObject $acl
Update-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -Acl $acl
$dir = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname
$dir.ACL
```
This example sets the ACL on a **file** for the owning user, owning group, or other users, and then prints the ACL to the console.

```powershell
$filesystemName = "my-file-system"
$filePath = "my-directory/upload.txt"
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rw- 
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType group -Permission rw- -InputObject $acl 
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType other -Permission "-wx" -InputObject $acl
Update-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $filePath -Acl $acl
$file = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $filePath
$file.ACL
```

The following image shows the output after setting the ACL of a file.

![Get ACL output](./media/data-lake-storage-directory-file-acl-powershell/set-acl.png)

In this example, the owning user and owning group have only read and write permissions. All other users have write and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).


### Set ACLs on all items in a file system

You can use the `Get-AzDataLakeGen2Item` and the `-Recurse` parameter together with the `Update-AzDataLakeGen2Item` cmdlet to recursively to set the ACL for directories and files in a file system. 

```powershell
$filesystemName = "my-file-system"
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rw- 
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType group -Permission rw- -InputObject $acl 
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType other -Permission -wx -InputObject $acl

$Token = $Null
do
{
     $items = Get-AzDataLakeGen2ChildItem -Context $ctx -FileSystem $filesystemName -Recurse -ContinuationToken $Token    
     if($items.Length -le 0) { Break;}
     $items | Update-AzDataLakeGen2Item -Acl $acl
     $Token = $items[$items.Count -1].ContinuationToken;
}
While ($Token -ne $Null) 
```

### Add or update an ACL entry

First, get the ACL. Then, use the `set-AzDataLakeGen2ItemAclObject` cmdlet to add or update an ACL entry. Use the `Update-AzDataLakeGen2Item` cmdlet to commit the ACL.

This example creates or updates the ACL on a **directory** for a user.

```powershell
$filesystemName = "my-file-system"
$dirname = "my-directory/"
$acl = (Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname).ACL
$acl = set-AzDataLakeGen2ItemAclObject -AccessControlType user -EntityID xxxxxxxx-xxxx-xxxxxxxxxxx -Permission r-x -InputObject $acl 
Update-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -Acl $acl
```

### Remove an ACL entry

This example removes an entry from an existing ACL.

```powershell
$id = "xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Create the new ACL object.
[Collections.Generic.List[System.Object]]$aclnew =$acl

foreach ($a in $aclnew)
{
    if ($a.AccessControlType -eq "User"-and $a.DefaultScope -eq $false -and $a.EntityId -eq $id)
    {
        $aclnew.Remove($a);
        break;
    }
}
Update-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -Acl $aclnew
```

<a id="gen1-gen2-map"></a>

## Gen1 to Gen2 Mapping

The following table shows how the cmdlets used for Data Lake Storage Gen1 map to the cmdlets for Data Lake Storage Gen2.

|Data Lake Storage Gen1 cmdlet| Data Lake Storage Gen2 cmdlet| Notes |
|--------|---------|-----|
|Get-AzDataLakeStoreChildItem|Get-AzDataLakeGen2ChildItem|By default, the Get-AzDataLakeGen2ChildItem cmdlet only lists the first level child items. The -Recurse parameter lists child items recursively. |
|Get-AzDataLakeStoreItem<br>Get-AzDataLakeStoreItemAclEntry<br>Get-AzDataLakeStoreItemOwner<br>Get-AzDataLakeStoreItemPermission|Get-AzDataLakeGen2Item|The output items of the Get-AzDataLakeGen2Item cmdlet has these properties: Acl, Owner, Group, Permission.|
|Get-AzDataLakeStoreItemContent|Get-AzDataLakeGen2FileContent|The Get-AzDataLakeGen2FileContent cmdlet download file content to local file.|
|Move-AzDataLakeStoreItem|Move-AzDataLakeGen2Item||
|New-AzDataLakeStoreItem|New-AzDataLakeGen2Item|This cmdlet uploads the new file content from a local file.|
|Remove-AzDataLakeStoreItem|Remove-AzDataLakeGen2Item||
|Set-AzDataLakeStoreItemOwner<br>Set-AzDataLakeStoreItemPermission<br>Set-AzDataLakeStoreItemAcl|Update-AzDataLakeGen2Item|The Update-AzDataLakeGen2Item cmdlet updates a single item only, and not recursively. If want to update recursively, list items by using the Get-AzDataLakeStoreChildItem cmdlet, then pipeline to the Update-AzDataLakeGen2Item cmdlet.|
|Test-AzDataLakeStoreItem|Get-AzDataLakeGen2Item|The Get-AzDataLakeGen2Item cmdlet will report an error if the item doesn't exist.|

## See also

* [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
* [Storage PowerShell cmdlets](/powershell/module/az.storage)
