---
title: Remove role assignments from a group in Azure Active Directory
description: Remove role assignments from a group in Azure Active Directory using the Azure portal, PowerShell, or Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 02/04/2022
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Remove role assignments from a group in Azure Active Directory

This article describes how an IT admin can remove Azure AD roles assigned to groups. In the Azure portal, you can now remove both direct and indirect role assignments to a user. If a user is assigned a role by a group membership, remove the user from the group to remove the role assignment.

## Prerequisites

- Azure AD Premium P1 or P2 license
- Privileged Role Administrator or Global Administrator
- AzureAD module when using PowerShell
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** > **Roles and administrators** > *role name*.

1. Select the group from which you want to remove the role assignment and select **Remove assignment**.

   ![Remove a role assignment from a selected group.](./media/groups-remove-assignment/remove-assignment.png)

1. When asked to confirm your action, select **Yes**.

## PowerShell

### Create a group that can be assigned to role

```powershell
$group = New-AzureADMSGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group is assigned to Helpdesk Administrator built-in role in Azure AD." -MailEnabled $true -SecurityEnabled $true -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole $true
```

### Get the role definition you want to assign the group to

```powershell
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Helpdesk Administrator'"
```

### Create a role assignment

```powershell
$roleAssignment = New-AzureADMSRoleAssignment -ResourceScope '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $group.objectId
```

### Remove the role assignment

```powershell
Remove-AzureAdMSRoleAssignment -Id $roleAssignment.Id 
```

## Microsoft Graph API

### Create a group that can be assigned an Azure AD role

Use the [Create group](/graph/api/group-post-groups) API to create a group.

```http
POST https://graph.microsoft.com/v1.0/groups

{
    "description": "This group is assigned to Helpdesk Administrator built-in role of Azure AD",
    "displayName": "Contoso_Helpdesk_Administrators",
    "groupTypes": [
        "Unified"
    ],
    "isAssignableToRole": true,
    "mailEnabled": true,
    "mailNickname": "contosohelpdeskadministrators",
    "securityEnabled": true
}
```

### Get the role definition

Use the [List unifiedRoleDefinitions](/graph/api/rbacapplication-list-roledefinitions) API to get a role definition.

```http
GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleDefinitions?$filter=displayName+eq+'Helpdesk Administrator'
```

### Create the role assignment

Use the [Create unifiedRoleAssignment](/graph/api/rbacapplication-post-roleassignments) API to assign the role.

```http
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments
{
    "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
    "principalId": "{object-id-of-group}",
    "roleDefinitionId": "{role-definition-id}",
    "directoryScopeId": "/"
}
```

### Delete role assignment

Use the [Delete unifiedRoleAssignment](/graph/api/unifiedroleassignment-delete) API to delete the role assignment.

```http
DELETE https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments/{role-assignment-id}
```

## Next steps

- [Use Azure AD groups to manage role assignments](groups-concept.md)
- [Troubleshoot Azure AD roles assigned to groups](groups-faq-troubleshooting.yml)
