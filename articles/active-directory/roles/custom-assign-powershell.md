---
title: Assign custom roles using Azure AD PowerShell
description: Manage members of a Microsoft Entra administrator custom role with Azure AD PowerShell.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 05/10/2022
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro, has-azure-ad-ps-ref
ms.collection: M365-identity-device-management
---
# Assign custom roles with resource scope using PowerShell in Microsoft Entra ID

This article describes how to create a role assignment at organization-wide scope in Microsoft Entra ID. Assigning a role at organization-wide scope grants access across the Microsoft Entra organization. To create a role assignment with a scope of a single Microsoft Entra resource, see [Create and assign a custom role in Microsoft Entra ID](custom-create.md). This article uses the [Azure Active Directory PowerShell Version 2](/powershell/module/azuread/#directory_roles) module.

For more information about Microsoft Entra roles, see [Microsoft Entra built-in roles](permissions-reference.md).

## Prerequisites

- Microsoft Entra ID P1 or P2 license
- Privileged Role Administrator or Global Administrator
- AzureADPreview module when using PowerShell

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Assign a directory role to a user or service principal with resource scope

1. Load the Azure AD PowerShell (Preview) module.
1. Sign in by executing the command `Connect-AzureAD`.
1. Create a new role using the following PowerShell script.

``` PowerShell
## Assign a role to a user or service principal with resource scope
# Get the user and role definition you want to link
$user = Get-AzureADUser -Filter "userPrincipalName eq 'cburl@f128.info'"
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Application Support Administrator'"

# Get app registration and construct resource scope for assignment.
$appRegistration = Get-AzureADApplication -Filter "displayName eq 'f/128 Filter Photos'"
$directoryScope = '/' + $appRegistration.objectId

# Create a scoped role assignment
$roleAssignment = New-AzureADMSRoleAssignment -DirectoryScopeId $directoryScope -RoleDefinitionId $roleDefinition.Id -PrincipalId $user.objectId
```

To assign the role to a service principal instead of a user, use the [Get-AzureADMSServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) cmdlet.

## Role definitions

Role definition objects contain the definition of the built-in or custom role, along with the permissions that are granted by that role assignment. This resource displays both custom role definitions and built-in directory roles (which are displayed in roleDefinition equivalent form). For information about the maximum number of custom roles that can be created in a Microsoft Entra organization, see [Microsoft Entra service limits and restrictions](../enterprise-users/directory-service-limits-restrictions.md).

### Create a role definition

``` PowerShell
# Basic information
$description = "Can manage credentials of application registrations"
$displayName = "Application Registration Credential Administrator"
$templateId = (New-Guid).Guid

# Set of actions to include
$rolePermissions = @{
    "allowedResourceActions" = @(
        "microsoft.directory/applications/standard/read",
        "microsoft.directory/applications/credentials/update"
    )
}

# Create new custom directory role
$customAdmin = New-AzureADMSRoleDefinition -RolePermissions $rolePermissions -DisplayName $displayName -Description $description -TemplateId $templateId -IsEnabled $true
```

### Read and list role definitions

``` PowerShell
# Get all role definitions
Get-AzureADMSRoleDefinitions

# Get single role definition by ID
Get-AzureADMSRoleDefinition -Id 86593cfc-114b-4a15-9954-97c3494ef49b

# Get single role definition by templateId
Get-AzureADMSRoleDefinition -Filter "templateId eq 'c4e39bd9-1100-46d3-8c65-fb160da0071f'"
```

### Update a role definition

``` PowerShell
# Update role definition
# This works for any writable property on role definition. You can replace display name with other
# valid properties.
Set-AzureADMSRoleDefinition -Id c4e39bd9-1100-46d3-8c65-fb160da0071f -DisplayName "Updated DisplayName"
```

### Delete a role definition

``` PowerShell
# Delete role definition
Remove-AzureADMSRoleDefinitions -Id c4e39bd9-1100-46d3-8c65-fb160da0071f
```

## Role assignments

Role assignments contain information linking a given security principal (a user or application service principal) to a role definition. If required, you can add a scope of a single Microsoft Entra resource for the assigned permissions.  Restricting the scope of a role assignment is supported for built-in and custom roles.

### Create a role assignment

``` PowerShell
# Get the user and role definition you want to link
$user = Get-AzureADUser -Filter "userPrincipalName eq 'cburl@f128.info'"
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Application Support Administrator'"

# Get app registration and construct resource scope for assignment.
$appRegistration = Get-AzureADApplication -Filter "displayName eq 'f/128 Filter Photos'"
$directoryScope = '/' + $appRegistration.objectId

# Create a scoped role assignment
$roleAssignment = New-AzureADMSRoleAssignment -DirectoryScopeId $directoryScope -RoleDefinitionId $roleDefinition.Id -PrincipalId $user.objectId
```

### Read and list role assignments

``` PowerShell
# Get role assignments for a given principal
Get-AzureADMSRoleAssignment -Filter "principalId eq '27c8ca78-ab1c-40ae-bd1b-eaeebd6f68ac'"

# Get role assignments for a given role definition 
Get-AzureADMSRoleAssignment -Filter "roleDefinitionId eq '355aed8a-864b-4e2b-b225-ea95482e7570'"
```

### Remove a role assignment

``` PowerShell
# Remove role assignment
Remove-AzureADMSRoleAssignment -Id 'qiho4WOb9UKKgng_LbPV7tvKaKRCD61PkJeKMh7Y458-1'
```

## Next steps

- Share with us on the [Microsoft Entra administrative roles forum](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789)
- For more about roles and Microsoft Entra administrator role assignments, see [Assign administrator roles](permissions-reference.md)
- For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md)
