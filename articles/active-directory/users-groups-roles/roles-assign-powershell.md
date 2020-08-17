---
title: Assign custom roles using Azure PowerShell - Azure AD | Microsoft Docs
description: Manage members of an Azure AD administrator custom role with Azure PowerShell.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: how-to
ms.date: 04/29/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
---
# Assign custom roles with resource scope using PowerShell in Azure Active Directory

This article describes how to create a role assignment at organization-wide scope in Azure Active Directory (Azure AD). Assigning a role at organization-wide scope grants access across the Azure AD organization. To create a role assignment with a scope of a single Azure AD resource, see [How to create a custom role and assign it at resource scope](roles-create-custom.md).This article uses the [Azure Active Directory PowerShell Version 2](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#directory_roles) module.

For more information about Azure AD admin roles, see [Assigning administrator roles in Azure Active Directory](directory-assign-admin-roles.md).

## Required permissions

Connect to your Azure AD organization using a global administrator account to assign or remove roles.

## Prepare PowerShell

Install the Azure AD PowerShell module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.17). Then import the Azure AD PowerShell preview module, using the following command:

``` PowerShell
import-module azureadpreview
```

To verify that the module is ready to use, match the version returned by the following command to the one listed here:

``` PowerShell
get-module azureadpreview
  ModuleType Version      Name                         ExportedCommands
  ---------- ---------    ----                         ----------------
  Binary     2.0.0.115    azureadpreview               {Add-AzureADMSAdministrati...}
```

Now you can start using the cmdlets in the module. For a full description of the cmdlets in the Azure AD module, see the online reference documentation for [Azure AD preview module](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.17).

## Assign a role to a user or service principal with resource scope

1. Open the Azure AD preview PowerShell module.
1. Sign in by executing the command `Connect-AzureAD`.
1. Create a new role using the following PowerShell script.

``` PowerShell
## Assign a role to a user or service principal with resource scope
# Get the user and role definition you want to link
$user = Get-AzureADUser -Filter "userPrincipalName eq 'cburl@f128.info'"
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Application Support Administrator'"

# Get app registration and construct resource scope for assignment.
$appRegistration = Get-AzureADApplication -Filter "displayName eq 'f/128 Filter Photos'"
$resourceScope = '/' + $appRegistration.objectId

# Create a scoped role assignment
$roleAssignment = New-AzureADMSRoleAssignment -ResourceScope $resourceScope -RoleDefinitionId $roleDefinition.Id -PrincipalId $user.objectId
```

To assign the role to a service principal instead of a user, use the [Get-AzureADMSServicePrincipal cmdlet](https://docs.microsoft.com/powershell/module/azuread/get-azureadserviceprincipal?view=azureadps-2.0).

## Operations on RoleDefinition

Role definition objects contain the definition of the built-in or custom role, along with the permissions that are granted by that role assignment. This resource displays both custom role definitions and built-in directoryRoles (which are displayed in roleDefinition equivalent form). Today, an Azure AD organization can have a maximum of 30 unique custom RoleDefinitions defined.

### Create Operations on RoleDefinition

``` PowerShell
# Basic information
$description = "Can manage credentials of application registrations"
$displayName = "Application Registration Credential Administrator"
$templateId = (New-Guid).Guid

# Set of actions to grant
$allowedResourceAction =
@(
    "microsoft.directory/applications/standard/read",
    "microsoft.directory/applications/credentials/update"
)
$rolePermissions = @{'allowedResourceActions'= $allowedResourceAction}

# Create new custom admin role
$customAdmin = New-AzureADMSRoleDefinition -RolePermissions $rolePermissions -DisplayName $displayName -Description $description -TemplateId $templateId -IsEnabled $true
```

### Read Operations on RoleDefinition

``` PowerShell
# Get all role definitions
Get-AzureADMSRoleDefinitions

# Get single role definition by objectId
Get-AzureADMSRoleDefinition -Id 86593cfc-114b-4a15-9954-97c3494ef49b

# Get single role definition by templateId
Get-AzureADMSRoleDefinition -Filter "templateId eq 'c4e39bd9-1100-46d3-8c65-fb160da0071f'"
```

### Update Operations on RoleDefinition

``` PowerShell
# Update role definition
# This works for any writable property on role definition. You can replace display name with other
# valid properties.
Set-AzureADMSRoleDefinition -Id c4e39bd9-1100-46d3-8c65-fb160da0071f -DisplayName "Updated DisplayName"
```

### Delete operations on RoleDefinition

``` PowerShell
# Delete role definition
Remove-AzureADMSRoleDefinitions -Id c4e39bd9-1100-46d3-8c65-fb160da0071f
```

## Operations on RoleAssignment

Role assignments contain information linking a given security principal (a user or application service principal) to a role definition. If required, you can add a scope of a single Azure AD resource for the assigned permissions.  Restricting the scope of permissions is supported for built-in and custom roles.

### Create Operations on RoleAssignment

``` PowerShell
# Get the user and role definition you want to link
$user = Get-AzureADUser -Filter "userPrincipalName eq 'cburl@f128.info'"
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Application Support Administrator'"

# Get app registration and construct resource scope for assignment.
$appRegistration = Get-AzureADApplication -Filter "displayName eq 'f/128 Filter Photos'"
$resourceScope = '/' + $appRegistration.objectId

# Create a scoped role assignment
$roleAssignment = New-AzureADMSRoleAssignment -ResourceScope $resourceScope -RoleDefinitionId $roleDefinition.Id -PrincipalId $user.objectId
```

### Read Operations on RoleAssignment

``` PowerShell
# Get role assignments for a given principal
Get-AzureADMSRoleAssignment -Filter "principalId eq '27c8ca78-ab1c-40ae-bd1b-eaeebd6f68ac'"

# Get role assignments for a given role definition 
Get-AzureADMSRoleAssignment -Filter "roleDefinitionId eq '355aed8a-864b-4e2b-b225-ea95482e7570'"
```

### Delete Operations on RoleAssignment

``` PowerShell
# Delete role assignment
Remove-AzureADMSRoleAssignment -Id 'qiho4WOb9UKKgng_LbPV7tvKaKRCD61PkJeKMh7Y458-1'
```

## Next steps

- Share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
- For more about roles and azure AD administrator role assignments, see [Assign administrator roles](directory-assign-admin-roles.md).
- For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
