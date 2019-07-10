---
title: Assign admin roles with administrative unit scope with Azure PowerShell - Azure Active Directory | Microsoft Docs
description: For those who frequently manage role assignments, you can now manage members of an Azure AD administrator role with Azure PowerShell.
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 04/18/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Use PowerShell to assign administrator roles with administrative unit scope in Azure Active Directory

You can automate how you assign roles to User admins and Helpdesk admins scoped to a single administrative unit in Azure Active Directory (Azure AD) using Azure PowerShell. This article uses the [Azure Active Directory PowerShell Version 2](https:/docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#directory_roles) module. For more comprehensive examples, see [Working with Administrative Units](https://docs.microsoft.com/en-us/powershell/azure/active-directory/working-with-administrative-units?view=azureadps-2.0).

## Required permissions

Connect to your Azure AD tenant using a global administrator account to assign or remove roles.

## Prepare PowerShell

First, install the Azure AD PowerShell module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.17). Then import the Azure AD PowerShell preview module, using the following command:

```powershell
import-module azureadpreview
```

To verify that the module is ready to use, match the version returned by the following command to the one listed here:

```powershell
get-module azureadpreview
  ModuleType Version      Name                         ExportedCommands
  ---------- ---------    ----                         ----------------
  Binary     2.0.0.115    azureadpreview               {Add-AzureADAdministrati...}
```

Now you can start using the cmdlets in the module. For a full description of the cmdlets in the Azure AD module, see the online reference documentation for [Azure Active Directory PowerShell Version 2](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#directory_roles).

## List of permissions granted

List of permissions granted to User Account admin and Helpdesk admin:

* Get list of administrative unit (AU) members
* Set properties for an AU member
* Reset password for an AU member
* Assigning a license for an AU member
* Get list of members from a different AU

## Syntax

Assign a scoped role syntax.

```powershell
Add-AzureADScopedRoleMembership
   -ObjectId <String>
   [-AdministrativeUnitObjectId <String>]
   [-RoleObjectId <String>]
   [-RoleMemberInfo <RoleMemberInfo>]
   [<CommonParameters>]
```

Fetch a scoped role syntax.

```powershell
Get-AzureADScopedRoleMembership
   -ObjectId <String>
   [-ScopedRoleMembershipId <String>]
   [<CommonParameters>]
```

Remove a scoped role syntax.

```powershell
Remove-AzureADScopedRoleMembership
      -ObjectId <String>
      -ScopedRoleMembershipId <String>
      [<CommonParameters>]
```

## Example: Assign a scoped role

This examples fetches a user and their display name and the name of the role you're assigning. When you have the display name of the account and the name of the role, use the following cmdlets to assign the role to the user. This example assigns the User Account Administrator role.

``` PowerShell
#Sign in as Global administrator
Connect-AzureAD

# Delegate admin permissions scoped to administrative units. If role instance does not exist, instantiate it based on the role template.

# Fetch user to assign to role
$roleMember = Get-AzureADUser -ObjectId "username@contoso.com"

#Get list of available roles
$admins = Get-AzureADDirectoryRole
foreach($i in $admins) {
    if($i.DisplayName -eq "User Account Administrator") {
        $uaAdmin = $i
        }
    if($i.DisplayName -eq "Helpdesk Administrator") {
        $helpDeskAdmin = $i
        }
    }

# If role instance does not exist, instantiate it based on the role template
if ($role -eq $null) {
    # Instantiate an instance of the role template
    $roleTemplate = Get-AzureADDirectoryRoleTemplate | Where-Object {$_.displayName -eq 'User Account Administrator'}
    Enable-AzureADDirectoryRole -RoleTemplateId $roleTemplate.ObjectId

    # Fetch User Account Administrator role instance again
    $role = Get-AzureADDirectoryRole | Where-Object {$_.displayName -eq 'User Account Administrator'}
}

# Add user to a scoped role
$uaRoleMemberInfo = New-Object -TypeName Microsoft.Open.AzureAD.Model.RoleMemberInfo -Property @{ ObjectId =  $yourAdminUnit.ObjectId }
Add-AzureADScopedRoleMembership -RoleObjectId $uaAdmin.ObjectId -ObjectId $ourAdminUnit.ObjectId -RoleMemberInfo $uaRoleMemberInfo

# Fetch role membership for role to confirm
Get-AzureADScopedRoleMember -ObjectId $role.ObjectId | Get-AzureADUser
```

## Assign a role to a service principal (are we including this for AU scope?)

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

## Example: Remove an AU scoped role

This example removes a role assignment for the specified user.

```powershell

# Get roles 
$admins = Get-AzureADDirectoryRole
foreach($i in $admins) {
    if($i.DisplayName -eq "User Account Administrator") {
        $uaadmin = $i
        }
    if($i.DisplayName -eq "Helpdesk Administrator") {
        $helpdeskadmin = $i
        }
    }

# Delete scoped role memberships used 
$adminunits = Get-AzureADAdministrativeUnit
foreach($adminunit in $adminunits) {
    $adminScopes = Get-AzureADScopedRoleMembership -ObjectId $adminunit.ObjectId
    foreach($SRM in $adminScopes) {
        Remove-AzureADScopedRoleMembership -ObjectId $uaadmin.ObjectId -ScopedRoleMembershipId $SRM.Id
        Remove-AzureADScopedRoleMembership -ObjectId $helpdeskadmin.ObjectId -ScopedRoleMembershipId $SRM.Id
        }
    }

# Check all scoped role memberships were deleted
foreach($adminunit in $adminunits) {
    $adminScopes = Get-AzureADScopedRoleMembership -ObjectId $adminunit.ObjectId
    }
```

## Next steps

* Share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
* For more about roles and azure AD administrator role assignments, see [Assign administrator roles](directory-assign-admin-roles.md).
* For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
