---
title: Assign a role to a cloud group in Azure Active Directory | Microsoft Docs
description: Assign an Azure AD role to a role-eligible group in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 01/22/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Assign a role to a cloud group in Azure Active Directory

This section describes how an IT admin can assign Azure Active Directory (Azure AD) role to a group.

## Using Azure AD admin center

Assigning a group to an Azure AD role is similar to assigning users and service principals with one difference: Only groups that are eligible (that is, created with "Eligible for role assignment" selected) for role assignment are shown in the menu.

1. Sign in to the [Azure AD admin center](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with Privileged role administrator or Global administrator permissions in the Azure AD organization.

1. Select **Azure Active Directory** > **Roles and administrators**, and select the role you want to assign.

1. On the ***role name*** page, select > **Add assignment**.

   ![Add the new role assignment](./media/roles-groups-assign-role/add-assignment.png)

1. Select the group. Only groups that are eligible for role assignment are displayed.

    [![Only groups that are eligible are shown for a new role assignment](./media/roles-groups-assign-role/eligible-groups.png "Select an eligible group and click Add")](media/roles-groups-assign-role/eligible-groups.png#lightbox)

1. Select **Add**.

For more information on assigning role permissions, see [Assign administrator and non-administrator roles to users](../fundamentals/active-directory-users-assign-role-azure-portal.md).

## Using PowerShell

### Create a group that can be assigned to role

    $group = New-AzureADMSGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group is assigned to Helpdesk Administrator built-in role in Azure AD." -MailEnabled $true -SecurityEnabled $true -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole $true 

### Get the role definition for the role you want to assign

    $roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Helpdesk Administrator'" 

### Create a role assignment

    $roleAssignment = New-AzureADMSRoleAssignment -ResourceScope '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $group.Id 

## Using Microsoft Graph API

### Create a group that can be assigned Azure AD role

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

### Get the role definition

    GET https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitions?$filter = displayName eq ‘Helpdesk Administrator’ 

### Create the role assignment

    POST https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments 
    { 
    "principalId":"<Object Id of Group>", 
    "roleDefinitionId":"<Id of role definition>", 
    "resourceScope":"/" 
    } 

## Next steps

- [Create a role-eligible group](roles-groups-create-eligible.md)
- [View a group's role assignments](roles-groups-view-assignments.md)
- [Remove a group role assignment](roles-groups-remove-assignment.md)
