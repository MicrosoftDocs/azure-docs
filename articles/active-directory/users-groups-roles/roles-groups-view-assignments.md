---
title: View roles assigned to a group in Azure Active Directory | Microsoft Docs
description: Preview custom Azure AD roles for delegating identity management. Manage Azure roles in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 01/07/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---


# View roles assigned to a group in Azure Active Directory

This section describes how the roles assigned to a group can be viewed using Azure AD admin center. Viewing groups and roles is a default user permission.

1. Open https://aka.ms//assignrolestogroups. Sign in with any non-admin or admin credentials.

1. Select the group that you are interested in.

1. Select Assigned Roles tab from left pane. You can now see all the Azure AD roles assigned to this group. 

## Using PowerShell

### Get object id of the group 
Get-AzureADMSGroup -SearchString “Contoso_Helpdesk_Administrators”

### View role assignment to a group 
Get-AzureADMSRoleAssignment -Filter "principalId eq '<object id of group>" 

## Using Microsoft Graph API

//Get object id of the group GET https://graph.microsoft.com/beta/groups?$filter displayName eq ‘Contoso_Helpdesk_Administrator’ 

//Get role assignments to a group GET https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments?$filter=principalId eq
