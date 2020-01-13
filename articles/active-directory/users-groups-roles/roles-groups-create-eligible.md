---
title: Create a group for assigning roles in Azure Active Directory | Microsoft Docs
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

# Create a group for assigning roles in Azure Active Directory

This preview adds a group attribute that makes a group eligible to be assigned to a role in Azure Active Directory (Azure AD). This article describes how to create such a group.

## Using Azure Admin Center

1. Open https://aka.ms//assignrolestogroups. Sign in with Privileged Role Administrator or Global Administrator permissions in the Azure AD organization. 
1. Select Azure Active Directory > Groups > All groups > New group 



1. On the New Group tab, provide group type, name and description. 

1. Switch on the Eligible for role assignment toggle. 

Note that this toggle switch will be visible only to Privileged Role Administrators and Global Administrator since these are only two roles that can create such groups. 



1. Once the toggle is on, select the members and roles for this group. 



1. After members and roles are selected, select Create. 



The group will be created with role assigned to it. You can also choose not to assign roles during creation and assign them later on.

## Using PowerShell

Note: Creating a group eligible for role assignment via PowerShell will not work now. We are working on fixing this issue. Use Azure portal to create groups that are eligible for role assignments. #First, you must download the Azure AD Preview PowerShell module. To install the Azure AD #PowerShell module, use the following commands: 

install-module azureadpreview 
import-module azureadpreview 

### To verify that the module is ready to use, use the following command: 

get-module azureadpreview 

### Create a group that can be assigned to role 

$group = New-AzureADMSGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group is assigned to Helpdesk Administrator built-in role in Azure AD." -MailEnabled $true -SecurityEnabled $true -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole $true 

Note that for this type of group, groupType will always be "Unified" and isPublic will always be false. 
Using Microsoft Graph API 

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
