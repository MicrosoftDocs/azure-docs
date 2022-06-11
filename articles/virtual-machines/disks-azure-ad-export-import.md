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

---

## Restrictions

- VHDs can't be uploaded to empty snapshots.
- Only currently available in xyz regions.

## Get started


Create disk with DataAccessAuthMode set to AzureActiveDirectory.  

$diskConfig = New-AzDiskConfig -Location 'eastus2euap' -AccountType 'Premium_LRS' -CreateOption 'Empty' -DiskSizeGB 32 -DataAccessAuthMode 'AzureActiveDirectory'  

New-AzDisk -ResourceGroupName 'ResourceGroup01' -DiskName 'Disk01' -Disk $diskConfig  

$disk = Get-AzDisk -ResourceGroupName 'ResourceGroup01' -DiskName 'Disk01'  

  

# $disk.Properties.DataAccessAuthMode.tostring()  

"AzureActiveDirectory"  

Export Disk and download using Az.Storage Powershell  

$diskSas = Grant-AzDiskAccess 'ResourceGroup01' -DiskName 'Disk01' -DurationInSecond 86400 -Access 'Read'  

Connect-AzAccount  

Get-AzStorageBlobContent -Uri $diskSas.AccessSAS -Destination $downloadDest  

# [PowerShell](#tab/azure-powershell)
Before either uploading or downloading a disk, you have to set its `dataAccessAuthMode` to `AzureActiveDirectory`. 


### upload configuration
When uploading a disk, create the disk config with the `dataAccessAuthMode` set to `AzureActiveDirectory`.

```azurepowershell
$diskConfig = New-AzDiskConfig -Location '<yourRegion>' -AccountType '<yourDiskType> -CreateOption 'Empty' -DiskSizeGB 'desiredSize" -DataAccessAuthMode 'AzureActiveDirectory'

New-AzDisk -ResourceGroupName 'yourRGName' -DiskName 'yourDiskName' -Disk $diskConfig

```


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

# [Azure CLI](#tab/azure-cli)

Cr

---


Next, create a custom RBAC role with the necessary permissions.

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

After that, assign RBAC permissions, to allow the role to access your disk.

```azurepowershell
$myDisk=Get-AzDisk -DiskName $diskName -ResourceGroupName $resourceGroup

New-AzRoleAssignment -SignInName <email address of the user> `
-RoleDefinitionName "Disks Data Operator" `
-Scope $myDisk.Id
```

To download a managed disk as VHD, generate the disk's SAS URI, and then authenticate yourself using Azure AD.

```azurepowershell
$diskSas = Grant-AzDiskAccess -ResourceGroupName $resourceGroup -DiskName
$diskName -DurationInSecond 86400 -Access 'Read'

Connect-AzAccount

$localFolder = "desiredFilePath"

$blob = Get-AzStorageBlobContent -Uri $diskSas.AccessSAS -Destination $localFolder -Force
```

## Next steps

[Upload a VHD to Azure or copy a managed disk to another region - Azure PowerShell](windows/disks-upload-vhd-to-managed-disk-powershell.md)