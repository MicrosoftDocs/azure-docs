---
title: Create a custom role definition in Azure AD role-based access control - Azure Active Directory | Microsoft Docs
description: You can now create custom Azure AD administrator roles in the Azure AD admin center.
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 06/30/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Create a custom role in your Azure Active Directory organization

In Azure Active Directory (Azure AD), custom roles can be created in the **Roles and administrators** tab on the Azure AD page or the Application registration page. Custom roles can be assigned at the directory scope or a scope of a single app registration.

## Create a new custom role using the Azure AD portal

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with Privileged role administrator or Global administrator permissions in the Azure AD organization.
1. Select **Roles and administrators**, and then select **New custom role**.

    ![Create or edit roles from the Roles and administrators page](./media/roles-create-assignments/new-custom-role.png)

1. On the **Basics** tab, provide "Application Support Administrator" for the name of the role and "Can manage basic aspects of application registrations" for the role description.

    ![provide a name and description for a custom role on the Basics tab](./media/roles-create-assignments/basics-tab.png)

1. On the Permissions tab, use the filter box to search for the following permissions individually, selecting the checkbox next to each one:
    - microsoft.directory/applications/allProperties/read
    - microsoft.directory/applications/basic/update
    - microsoft.directory/applications/credentials/update

    ![Select the permissions for a custom role on the Permissions tab](./media/roles-create-assignments/permissions-tab.png)

1. On the **Review + create** tab, review the permissions and select **Create**.

## Create a custom role using Azure AD PowerShell

### Prepare PowerShell

First, you must [download the Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD/).

To install the Azure AD PowerShell module, use the following commands:

``` PowerShell
install-module azureadpreview
import-module azureadpreview
```

To verify that the module is ready to use, use the following command:

``` PowerShell
get-module azuread
  ModuleType Version      Name                         ExportedCommands
  ---------- ---------    ----                         ----------------
  Binary     2.0.0.115    azuread                      {Add-AzureADAdministrati...}
```

### Create the custom role

Create a new role using the following PowerShell script:

``` PowerShell
# Basic role information
$description = "Application Support Administrator"
$displayName = "Can manage basic aspects of application registrations."
$templateId = (New-Guid).Guid

# Set of permissions to grant
$allowedResourceAction =
@(
    "microsoft.directory/applications/allProperties/read",
    "microsoft.directory/applications/basic/update",
    "microsoft.directory/applications/credentials/update"
)
$resourceActions = @{'allowedResourceActions'= $allowedResourceAction}
$rolePermission = @{'resourceActions' = $resourceActions}
$rolePermissions = $rolePermission

# Create new custom admin role
$customAdmin = New-AzureAdRoleDefinition -RolePermissions $rolePermissions -DisplayName $displayName -Description $description -TemplateId $templateId -IsEnabled $true
```

## Create a custom role using Microsoft Graph API

HTTP request to create a custom role definition.

POST

``` HTTP
https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitions
```

Body

``` HTTP
{
    "description":"Can manage basic aspects of application registrations.",
    "displayName":"Application Support Administrator",
    "isEnabled":true,
    "rolePermissions":
    [
        {
            "resourceActions":
            {
                "allowedResourceActions":
                [
                    "microsoft.directory/applications/allProperties/read",
                    "microsoft.directory/applications/basic/update",
                    "microsoft.directory/applications/credentials/update"
                ]
            },
            "condition":null
        }
    ],
    "templateId":"<GET NEW GUID AND INSERT HERE>",
    "version":"1"
}
```

There are two permissions available for granting the ability to create application registrations, with different behaviors:

- microsoft.directory/applications/createAsOwner: this permission results in the creator being added as the first owner of the created app registration, and the created app registration will count against the creator's 250 created objects quota.
- microsoft.directory/applicationPolicies/create: this permission results in the creator not being added as the first owner of the created app registration, and the created app registration will not count against the creator's 250 created objects quota. Use this permission carefully, as there is nothing preventing the assignee from creating app registrations until the directory-level quota is hit. If both permissions are assigned, this permission will take precedence.

## Next steps

- Feel free to share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
- For more about roles and Administrator role assignment, see [Assign administrator roles](directory-assign-admin-roles.md).
- For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
