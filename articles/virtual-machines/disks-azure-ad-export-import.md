---
title: Use Azure AD to securely import/export a managed disk
description: Learn how to use Azure AD to securely import/export a disk.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 03/30/2022
ms.author: rogarana
ms.subservice: disks
---

# Use Azure AD to securely import/export a managed disk (preview)

You can use Azure Active Directory (Azure AD) integration to control export and import of data to Azure managed disks. You do this with the **DataAccessAuthMode** property of disks called DataAccessAuthMode to AzureActiveDirectory to ensure the system validates the identity of users in Azure AD and that the user has the necessary permissions to export or import data from a disk. Moreover, a system administrator can set a policy at the Azure account or subscription level to enforce that DataAccessAuthMode is set to AzureActiveDirectory for disks and snapshots. 


## Pre-requisites

1. Enable the feature on your subscription, reach out to AzureDisks@microsoft .com to have the feature enabled.
1. Install the latest Azure PowerShell module.
1. Install this pre-release version of the Az.Storage PowerShell module.

## Restrictions

- You cannot upload a VHD to an empty snapshot, only empty disks.
- 

## Export a disk

First, make sure the disk you're importing to or exporting from has its dataAccessAuthMode set to AzureActiveDirectory.

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

Next, create a custom RBAC role with the permissions to allow disk import/export.

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

Then, assign RBAC permissions.

```azurepowershell
$myDisk=Get-AzDisk -DiskName $diskName -ResourceGroupName $resourceGroup

New-AzRoleAssignment -SignInName <email address of the user> `
-RoleDefinitionName "Disks Data Operator" `
-Scope $myDisk.Id
```

Generate SAS

Download VHD.

```azurepowershell
$diskSas = Grant-AzDiskAccess -ResourceGroupName $resourceGroup -DiskName
$diskName -DurationInSecond 86400 -Access 'Read'

Connect-AzAccount

$localFolder = "desiredFilePath"

$blob = Get-AzStorageBlobContent -Uri $diskSas.AccessSAS -Destination $localFolder -Force
```

## Import a disk


