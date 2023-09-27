---
title: Remove limits on creating app registrations
description: Assign a custom role to grant unrestricted app registrations in the Microsoft Entra Active Directory
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: quickstart
ms.date: 02/04/2022
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro, mode-other, has-azure-ad-ps-ref
ms.collection: M365-identity-device-management
---
# Quickstart: Grant permission to create unlimited app registrations

In this quick start guide, you will create a custom role with permission to create an unlimited number of app registrations, and then assign that role to a user. The assigned user can then use the Microsoft Entra admin center, Azure AD PowerShell, or Microsoft Graph API to create application registrations. Unlike the built-in Application Developer role, this custom role grants the ability to create an unlimited number of application registrations. The Application Developer role grants the ability, but the total number of created objects is limited to 250 to prevent hitting [the directory-wide object quota](../enterprise-users/directory-service-limits-restrictions.md). The least privileged role required to create and assign Microsoft Entra custom roles is the Privileged Role Administrator.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

- Microsoft Entra ID P1 or P2 license
- Privileged Role Administrator or Global Administrator
- AzureADPreview module when using PowerShell
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Microsoft Entra admin center

### Create a custom role

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator).

1. Browse to **Identity** > **Roles & admins** > **Roles & admins**.

1. Select **New custom role**.

    ![Create or edit roles from the Roles and administrators page](./media/quickstart-app-registration-limits/new-custom-role.png)

1. On the **Basics** tab, provide "Application Registration Creator" for the name of the role and "Can create an unlimited number of application registrations" for the role description, and then select **Next**.

    ![provide a name and description for a custom role on the Basics tab](./media/quickstart-app-registration-limits/basics-tab.png)

1. On the **Permissions** tab, enter "microsoft.directory/applications/create" in the search box, and then select the checkboxes next to the desired permissions, and then select **Next**.

    ![Select the permissions for a custom role on the Permissions tab](./media/quickstart-app-registration-limits/permissions-tab.png)

1. On the **Review + create** tab, review the permissions and select **Create**.

### Assign the role

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator).

1. Browse to **Identity** > **Roles & admins** > **Roles & admins**.

1. Select the Application Registration Creator role and select **Add assignment**.

1. Select the desired user and click **Select** to add the user to the role.

Done! In this quickstart, you successfully created a custom role with permission to create an unlimited number of app registrations, and then assign that role to a user.

> [!TIP]
> To assign the role to an application using the Microsoft Entra admin center, enter the name of the application into the search box of the assignment page. Applications are not shown in the list by default, but are returned in search results.

### App registration permissions

There are two permissions available for granting the ability to create application registrations, each with different behavior.

- microsoft.directory/applications/createAsOwner: Assigning this permission results in the creator being added as the first owner of the created app registration, and the created app registration will count against the creator's 250 created objects quota.
- microsoft.directory/applications/create: Assigning this permission results in the creator not being added as the first owner of the created app registration, and the created app registration will not count against the creator's 250 created objects quota. Use this permission carefully, because there is nothing preventing the assignee from creating app registrations until the directory-level quota is hit. If both permissions are assigned, this permission takes precedence.

## PowerShell

### Create a custom role

Create a new role using the following PowerShell script:

```powershell

# Basic role information
$displayName = "Application Registration Creator"
$description = "Can create an unlimited number of application registrations."
$templateId = (New-Guid).Guid

# Set of permissions to grant
$allowedResourceAction =
@(
    "microsoft.directory/applications/create"
    "microsoft.directory/applications/createAsOwner"
)
$rolePermissions = @{'allowedResourceActions'= $allowedResourceAction}

# Create new custom admin role
$customRole = New-AzureAdMSRoleDefinition -RolePermissions $rolePermissions -DisplayName $displayName -Description $description -TemplateId $templateId -IsEnabled $true
```

### Assign the role

Assign the role using the following PowerShell script:

```powershell
# Get the user and role definition you want to link
$user = Get-AzureADUser -Filter "userPrincipalName eq 'Adam@contoso.com'"
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Application Registration Creator'"

# Get resource scope for assignment
$resourceScope = '/'

# Create a scoped role assignment
$roleAssignment = New-AzureADMSRoleAssignment -ResourceScope $resourceScope -RoleDefinitionId $roleDefinition.Id -PrincipalId $user.objectId
```

## Microsoft Graph API

### Create a custom role

Use the [Create unifiedRoleDefinition](/graph/api/rbacapplication-post-roledefinitions) API to create a custom role.

```http
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleDefinitions
```

Body

```http
{
    "description": "Can create an unlimited number of application registrations.",
    "displayName": "Application Registration Creator",
    "isEnabled": true,
    "rolePermissions":
    [
        {
            "allowedResourceActions":
            [
                "microsoft.directory/applications/create"
                "microsoft.directory/applications/createAsOwner"
            ]
        }
    ],
    "templateId": "<PROVIDE NEW GUID HERE>",
    "version": "1"
}
```

### Assign the role

Use the [Create unifiedRoleAssignment](/graph/api/rbacapplication-post-roleassignments) API to assign the custom role. The role assignment combines a security principal ID (which can be a user or service principal), a role definition (role) ID, and a Microsoft Entra resource scope.

```http
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments
```

Body

```http
{
    "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
    "principalId": "<PROVIDE OBJECTID OF USER TO ASSIGN HERE>",
    "roleDefinitionId": "<PROVIDE OBJECTID OF ROLE DEFINITION HERE>",
    "directoryScopeId": "/"
}
```

## Next steps

- Feel free to share with us on the [Microsoft Entra administrative roles forum](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).
- For more about Microsoft Entra roles, see [Microsoft Entra built-in roles](permissions-reference.md).
- For more about default user permissions, see [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
