---
title: Assign a role to a cloud group in Azure Active Directory | Microsoft Docs
description: Assign an Azure AD role to a role-assignable group in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: rolyon
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: article
ms.date: 11/05/2020
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Assign a role to a cloud group in Azure Active Directory

This section describes how an IT admin can assign Azure Active Directory (Azure AD) role to an Azure AD group.

## Using Azure AD admin center

Assigning a group to an Azure AD role is similar to assigning users and service principals except that only groups that are role-assignable can be used. In the Azure portal, only groups that are role-assignable are displayed.

1. Sign in to the [Azure AD admin center](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with Privileged role administrator or Global administrator permissions in the Azure AD organization.

1. Select **Azure Active Directory** > **Roles and administrators**, and select the role you want to assign.

1. On the ***role name*** page, select > **Add assignment**.

   ![Add the new role assignment](./media/groups-assign-role/add-assignment.png)

1. Select the group. Only the groups that can be assigned to Azure AD roles are displayed.

    [![Only groups that are assignable are shown for a new role assignment.](./media/groups-assign-role/eligible-groups.png "Only groups that are assignable are shown for a new role assignment.")](./media/groups-assign-role/eligible-groups.png#lightbox)

1. Select **Add**.

For more information on assigning role permissions, see [Assign administrator and non-administrator roles to users](../fundamentals/active-directory-users-assign-role-azure-portal.md).

## Using PowerShell

### Create a group that can be assigned to role

```powershell
$group = New-AzureADMSGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group is assigned to Helpdesk Administrator built-in role in Azure AD." -MailEnabled $true -SecurityEnabled $true -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole $true 
```

### Get the role definition for the role you want to assign

```powershell
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Helpdesk Administrator'" 
```

### Create a role assignment

```powershell
$roleAssignment = New-AzureADMSRoleAssignment -ResourceScope '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $group.Id 
```

## Using Microsoft Graph API

### Create a group that can be assigned Azure AD role

```
POST https://graph.microsoft.com/beta/groups
{
"description": "This group is assigned to Helpdesk Administrator built-in role of Azure AD.",
"displayName": "Contoso_Helpdesk_Administrators",
"groupTypes": [
"Unified"
],
"mailEnabled": true,
"securityEnabled": true
"mailNickname": "contosohelpdeskadministrators",
"isAssignableToRole": true,
}
```

### Get the role definition

```
GET https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitions?$filter = displayName eq ‘Helpdesk Administrator’
```

### Create the role assignment

```
POST https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments
{
"principalId":"<Object Id of Group>",
"roleDefinitionId":"<ID of role definition>",
"directoryScopeId":"/"
}
```
## Next steps

- [Use cloud groups to manage role assignments](groups-concept.md)
- [Troubleshooting roles assigned to cloud groups](groups-faq-troubleshooting.md)
