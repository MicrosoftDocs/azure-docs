---
title: Assign and remove administrator roles assignment with Azure PowerShell - Azure Active Directory | Microsoft Docs
description: For those who frequently manage role assignments, you can now manage members of an Azure AD administrator role with Azure PowerShell.
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 04/15/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Assign Azure Active Directory admin roles using PowerShell

You can automate how you assign roles to user accounts using Azure PowerShell. This article uses the [Azure Active Directory PowerShell Version 2](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#directory_roles) module.

## Prepare PowerShell

First, you must [download the Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD/).

## Install the Azure AD PowerShell module

To install the Azure AD PowerShell module, use the following commands:

```powershell
install-module azuread
import-module azuread
```

To verify that the module is ready to use, use the following command:

```powershell
get-module azuread
  ModuleType Version      Name                         ExportedCommands
  ---------- ---------    ----                         ----------------
  Binary     2.0.0.115    azuread                      {Add-AzureADAdministrati...}
```

Now you can start using the cmdlets in the module. For a full description of the cmdlets in the Azure AD module, please refer to the online reference documentation for [Azure Active Directory PowerShell Version 2](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#directory_roles).

## Permissions required

Connect to your Azure AD tenant using a global administrator account to assign or remove roles.

## Assign a single role

To assign a role, you must first obtain its display name and the name of the role you're assigning. When you have the display name of the account and the name of the role, use the following cmdlets to assign the role to the user.

``` PowerShell
# Fetch user to assign to role
$roleMember = Get-AzureADUser -ObjectId "username@contoso.com"

# Fetch User Account Administrator role instance
$role = Get-AzureADDirectoryRole | Where-Object {$_.displayName -eq 'User Account Administrator'}

# If role instance does not exist, instantiate it based on the role template
if ($role -eq $null) {
    # Instantiate an instance of the role template
    $roleTemplate = Get-AzureADDirectoryRoleTemplate | Where-Object {$_.displayName -eq 'User Account Administrator'}
    Enable-AzureADDirectoryRole -RoleTemplateId $roleTemplate.ObjectId

    # Fetch User Account Administrator role instance again
    $role = Get-AzureADDirectoryRole | Where-Object {$_.displayName -eq 'User Account Administrator'}
}

# Add user to role
Add-AzureADDirectoryRoleMember -ObjectId $role.ObjectId -RefObjectId $roleMember.ObjectId

# Fetch role membership for role to confirm
Get-AzureADDirectoryRoleMember -ObjectId $role.ObjectId | Get-AzureADUser
```

## Assign a role to a service principal

Example of assigning a service principal to a role.

```powershell
# Fetch a service principal to assign to role
$roleMember = Get-AzureADServicePrincipal -ObjectId "00221b6f-4387-4f3f-aa85-34316ad7f956"
 
#Fetch list of all directory roles with object ID
Get-AzureADDirectoryRole
 
# Fetch a directory role by ID
$role = Get-AzureADDirectoryRole -ObjectId "5b3fe201-fa8b-4144-b6f1-875829ff7543"
 
# Add user to role
Add-AzureADDirectoryRoleMember -ObjectId $role.ObjectId -RefObjectId $roleMember.ObjectId
 
# Fetch the assignment for the role to confirm
Get-AzureADDirectoryRoleMember -ObjectId $role.ObjectId | Get-AzureADServicePrincipal
```

## Multiple role assignments

Examples of assigning and removing multiple roles at once.

```powershell
#File name
$fileName="<file path>" 
 
$input_Excel = New-Object -ComObject Excel.Application
$input_Workbook = $input_Excel.Workbooks.Open($fileName)
$input_Worksheet = $input_Workbook.Sheets.Item(1)
 
        #Count number of users who have to be assigned to role
$count = $input_Worksheet.UsedRange.Rows.Count
 
#Loop through each line of the csv file starting from line 2 (assuming first line is title)
for ($i=2; $i -le $count; $i++)
{
       #Fetch user display name
       $displayName = $input_Worksheet.Cells.Item($i,1).Text
       
       #Fetch role name
       $roleName = $input_Worksheet.Cells.Item($i,2).Text
 
       #Assign role
       Add-AzureADDirectoryRoleMember -ObjectId (Get-AzureADDirectoryRole | Where-Object DisplayName -eq $roleName).ObjectId -RefObjectId (Get-AzureADUser | Where-Object DisplayName -eq $displayName).ObjectId
}
 
#Remove multiple role assignments
for ($i=2; $i -le $count; $i++)
{
       $displayName = $input_Worksheet.Cells.Item($i,1).Text
       $roleName = $input_Worksheet.Cells.Item($i,2).Text
 
       Remove-AzureADDirectoryRoleMember -ObjectId (Get-AzureADDirectoryRole | Where-Object DisplayName -eq $roleName).ObjectId -MemberId (Get-AzureADUser | Where-Object DisplayName -eq $displayName).ObjectId
}
```

## Remove a role assignment

This example removes a role assignment for the specified user.

```powershell
# Fetch user to assign to role
$roleMember = Get-AzureADUser -ObjectId "username@contoso.com"

#Fetch list of all directory roles with object id
Get-AzureADDirectoryRole
 
# Fetch a directory role by id
$role = Get-AzureADDirectoryRole -ObjectId "5b3fe201-fa8b-4144-b6f1-875829ff7543"
 
# Remove user from role
Remove-AzureADDirectoryRoleMember -ObjectId $role.ObjectId -MemberId $roleMember.ObjectId 

# Fetch role membership for role to confirm
Get-AzureADDirectoryRoleMember -ObjectId $role.ObjectId | Get-AzureADUser
 
```

## Next steps

* Feel free to share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
* For more about roles and Administrator role assignment, see [Assign administrator roles](directory-assign-admin-roles.md).
* For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
