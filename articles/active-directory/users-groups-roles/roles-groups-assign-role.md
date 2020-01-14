---
title: Assign a role to a group in Azure Active Directory | Microsoft Docs
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

# Assign a role to a group in Azure Active Directory

This section describes how an IT admin can assign Azure AD role to a group.

## Using Azure AD admin aenter

Assigning a group to a user is similar to users and service principals with one caveat. Only groups that are eligible (isAssignableToRole property set to true) for role assignment are shown in the menu. 

1. Sign in to the [Azure AD admin center](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with Privileged role administrator or Global administrator permissions in the Azure AD organization.

1. Select Azure Active Directory > Roles and administrators > {Role name} > Add assignment. 


1. Select the group. Only groups that are eligible for role assignment (the cloud groups created with "Eligible for role assignment") are shown in the list, not all groups.

1. Click "Add". 
See this for more information - Assign administrator and non-administrator roles to users with Azure Active Directory. 

## Using PowerShell 

Note: Creating a group eligible for role assignment via PowerShell will not work now. We are working on fixing this issue. Use Azure portal to create groups that are eligible for role assignments. 

### Create a group that can be assigned to role 

$group = New-AzureADMSGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group is assigned to Helpdesk Administrator built-in role in Azure AD." -MailEnabled $true -SecurityEnabled $true -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole $true 

### Get the role definition you want to assign the group to 

$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Helpdesk Administrator'" 

### Create a role assignment 

$roleAssignment = New-AzureADMSRoleAssignment -ResourceScope '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $group.objectId 

## Using Microsoft Graph API 

````
//Create a group that can be assigned Azure AD role. POST https://graph.microsoft.com/beta/groups 
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

//Get the role definition. GET https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitions?$filter = displayName eq ‘Helpdesk Administrator’ 

//Create the role assignment. POST https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments 
{ 
"principalId":"<Object Id of Group>", 
"roleDefinitionId":"<Id of role definition>", 
"resourceScope":"/" 
} 
````