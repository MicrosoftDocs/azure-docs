---
title: Restrict upload/download of managed disks with Azure AD
description: Learn how to use Azure AD to securely import/export a disk.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 06/09/2022
ms.author: rogarana
ms.subservice: disks
---

# Use Azure AD to securely upload or download a managed disk (preview)

If you're using [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) to control resource access, you can now use it to restrict the export and import of Azure managed disks. This feature is currently in preview. When a user attempts to download or upload a disk, Azure validates the identity of the requesting user in Azure AD, and confirms that user has the required permissions. At a higher level, a system administrator could set a policy at the Azure account or subscription level, to ensure that all disks and snapshots must use Azure AD for import or export.

## Pre-requisites

# [PowerShell](#tab/azure-powershell)
- Email AzureDisks@microsoft .com to have the feature enabled on your subscription.
- Install the latest [Azure PowerShell module](/powershell/azure/install-az-ps).
- Install the [pre-release version](https://aka.ms/DisksAzureADAuthSDK) of the Az.Storage PowerShell module.

# [Azure CLI](#tab/azure-cli)
- Email AzureDisks@microsoft .com to have the feature enabled on your subscription.
- Install the latest [Azure CLI](/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

---

## Restrictions

- VHDs can't be uploaded to empty snapshots.
- Only currently available in xyz regions.

## Create custom role

# [PowerShell](#tab/azure-powershell)
First, create a custom RBAC role with the necessary permissions.

```azurepowershell
$role = [Microsoft.Azure.Commands.Resources.Models.Authorization.PSRoleDefinition]::new()
$role.Id = $null
$role.Name = "Disks Data Operator"
$role.Description = "A user in this role can read the data of the underlying VHD, export the VHD or upload a VHD to a disk, which is not attached to a running VM."
$role.IsCustom = $true
$perms = 'Microsoft.Compute/disks/download/action', 'Microsoft.Compute/disks/upload/action', 'Microsoft.Compute/snapshots/download/action', 'Microsoft.Compute/snapshots/upload/action'
$role.DataActions = $perms
$role.AssignableScopes = '/subscriptions/'+$subscriptionId

New-AzRoleDefinition -Role $role 
```

# [Azure CLI](#tab/azure-cli)

Cr

---

 $disk.Properties.DataAccessAuthMode.tostring()  

"AzureActiveDirectory"  

Export Disk and download using Az.Storage Powershell  

$diskSas = Grant-AzDiskAccess 'ResourceGroup01' -DiskName 'Disk01' -DurationInSecond 86400 -Access 'Read'  

Connect-AzAccount  

Get-AzStorageBlobContent -Uri $diskSas.AccessSAS -Destination $downloadDest  

## Upload a disk

# [PowerShell](#tab/azure-powershell)

### Prerequisites

- Download the latest [version of AzCopy v10](../../storage/common/storage-use-azcopy-v10.md#download-and-install-azcopy).
- [Install the Azure PowerShell module](/powershell/azure/install-Az-ps).
- A fixed size VHD that [has been prepared for Azure](prepare-for-upload-vhd-image.md), stored locally.

### Add-AzVHD

If Azure AD is used to enforce upload restrictions on a subscription or at the account level, [Add-AzVHD](/powershell/module/az.compute/add-azvhd?view=azps-7.1.0&viewFallbackFrom=azps-5.4.0&preserve-view=true) only succeeds if attempted by a user that has the [appropriate RBAC role or necessary permissions](#create-custom-role).

### Manual upload

If you're manually uploading a disk, you'll need to make a few extra configurations to do it with Azure AD.

### Configuration
Create the disk config with `dataAccessAuthMode` set to `AzureActiveDirectory`.

```azurepowershell
$diskConfig = New-AzDiskConfig -Location '<yourRegion>' -AccountType '<yourDiskType> -CreateOption 'Empty' -DiskSizeGB 'desiredSize" -DataAccessAuthMode 'AzureActiveDirectory'

New-AzDisk -ResourceGroupName 'yourRGName' -DiskName 'yourDiskName' -Disk $diskConfig
```


### Grant access to the disk
Assign RBAC permissions, to allow the role to access your disk and generate a writeable SAS for the empty disk.

```azurepowershell
New-AzRoleAssignment -SignInName <email address of the user> `
-RoleDefinitionName "Disks Data Operator" `
-Scope $myDisk.Id

$diskSas = Grant-AzDiskAccess -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>' -DurationInSecond 86400 -Access 'Write'

$disk = Get-AzDisk -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>'
```

### Upload a VHD

You can use the SAS with AzCopy to upload a disk.

```azcopy
AzCopy.exe copy "c:\somewhere\mydisk.vhd" $diskSas.AccessSAS --blob-type PageBlob
```

After the upload completes, revoke the SAS to allow you to attach it to a VM.

```azurepowershell
Revoke-AzDiskAccess -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>'
```

# [Azure CLI](#tab/azure-cli)

Cr

---



## Download a disk

To download a managed disk as VHD, generate the disk's SAS URI, and then authenticate yourself using Azure AD.

```azurepowershell
# Declare variables
$subscriptionID = "yourSubID"
$resourceGroupName = "yourRGName"
$diskName = "yourDiskName"

#set context to the appropriate subscription
set-AzContext -subscription $subscriptionID

# Switch an existing disk to AzureActiveDirectory to enable Azure AD access
New-AzDiskUpdateConfig -dataAccessAuthMode "AzureActiveDirectory" | Update-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName;
```

```azurepowershell
$diskSas = Grant-AzDiskAccess -ResourceGroupName $resourceGroup -DiskName
$diskName -DurationInSecond 86400 -Access 'Read'

Connect-AzAccount

$localFolder = "desiredFilePath"

$blob = Get-AzStorageBlobContent -Uri $diskSas.AccessSAS -Destination $localFolder -Force
```

## Next steps

[Upload a VHD to Azure or copy a managed disk to another region - Azure PowerShell](windows/disks-upload-vhd-to-managed-disk-powershell.md)