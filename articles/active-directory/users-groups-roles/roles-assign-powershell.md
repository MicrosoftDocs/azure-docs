---
title: Assign custom admininstrator roles with reseource scope using Azure PowerShell - Azure Active Directory | Microsoft Docs
description: For those who frequently manage role assignments, you can now manage members of an Azure AD administrator role with Azure PowerShell.
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 07/22/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Assign custom roles with resource scope using PowerShell in Azure Active Directory

This article describes how to create a role assignment at directory scope in Azure Active Directory (Azure AD). A directory-scoped role assignment grants access across the directory. To create a role assignment with a scope of a single Azure AD resource, see [How to create a custom role and assign it at resource scope](roles-create-custom.md).This article uses the [Azure Active Directory PowerShell Version 2](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#directory_roles) module.

For more information about Azure AD admin roles, see [Assigning administrator roles in Azure Active Directory](directory-assign-admin-roles.md).

## Required permissions

Connect to your Azure AD tenant using a global administrator account to assign or remove roles.

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
# Get the user and role definition you want to link
 $user = Get-AzureADMSUser -Filter "userPrincipalName eq 'cburl@f128.info'"
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Application Support Administrator'"

# Get app registration and construct resource scope for assignment.
    "displayName eq 'f/128 Filter Photos'"
$resourceScopes = '/' + $appRegistration.objectId

# Create a scoped role assignment
$roleAssignment = New-AzureADMSRoleAssignment -ResourceScopes $resourceScopes -RoleDefinitionId $roleDefinition.objectId -PrincipalId $user.objectId
```

To assign the role to a service principal instead of a user, use the [Get-AzureADMSServicePrincipal cmdlet](https://docs.microsoft.com/powershell/module/azuread/get-azureadserviceprincipal?view=azureadps-2.0).

## Delete a role assignment

Delete a RoleAssignment object.

``` PowerShell
# Delete role assignment
Remove-AzureADMSRoleAssignments -ObjectId $roleAssignment.ObjectId
```

## Next steps

* Share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
* For more about roles and azure AD administrator role assignments, see [Assign administrator roles](directory-assign-admin-roles.md).
* For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
