---
title: Create a role-assignable group in Azure Active Directory
description: Learn how to a role-assignable group in Azure Active Directory using the Azure portal, PowerShell, or Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 04/10/2023
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Create a role-assignable group in Azure Active Directory

With Azure AD Premium P1 or P2, you can create [role-assignable groups](groups-concept.md) and assign Azure AD roles to these groups. You create a new role-assignable group by setting **Azure AD roles can be assigned to the group** to **Yes** or by setting the `isAssignableToRole` property set to `true`. A role-assignable group can't be of dynamic membership type and you can create a maximum of 500 groups in a single tenant.

This article describes how to create a role-assignable group using the Azure portal, PowerShell, or Microsoft Graph API.

## Prerequisites

- Azure AD Premium P1 or P2 license
- [Privileged Role Administrator](./permissions-reference.md#privileged-role-administrator)
- Microsoft.Graph module when using [Microsoft Graph PowerShell](/powershell/microsoftgraph/installation?branch=main)
- AzureAD module when using [Azure AD PowerShell](/powershell/azure/active-directory/overview?branch=main)
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** > **Groups** > **All groups** > **New group**.

1. On the **New Group** tab, provide group type, name and description.

1. Set **Azure AD roles can be assigned to the group** to **Yes**.

    This option is visible to only Privileged Role Administrators and Global Administrators because these are only two roles that can set this option.

    :::image type="content" source="media/groups-create-eligible/eligible-switch.png" alt-text="Screenshot of option to make group a role-assignable group." lightbox="media/groups-create-eligible/eligible-switch.png":::
    
1. Select the members and owners for the group. You also have the option to assign roles to the group, but assigning a role isn't required here.

1. Select **Create**.

    You see the following message:
    
    Creating a group to which Azure AD roles can be assigned is a setting that cannot be changed later. Are you sure you want to add this capability?

    :::image type="content" source="media/groups-create-eligible/group-create-message.png" alt-text="Screenshot of confirm message when creating a role-assignable group." lightbox="media/groups-create-eligible/group-create-message.png":::

1. Select **Yes**.

    The group is created with any roles you might have assigned to it.

## PowerShell

# [Microsoft Graph PowerShell](#tab/ms-powershell)

Use the [New-MgGroup](/powershell/module/microsoft.graph.groups/new-mggroup?branch=main) command to create a role-assignable group.

```powershell
Connect-MgGraph -Scopes "Group.ReadWrite.All"
$group = New-MgGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group has Helpdesk Administrator built-in role assigned to it in Azure AD." -MailEnabled:$false -SecurityEnabled -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole:$true
```

# [Azure AD PowerShell](#tab/aad-powershell)

Use the [New-AzureADMSGroup](/powershell/module/azuread/new-azureadmsgroup?branch=main) command to create a role-assignable group.

```powershell
$group = New-AzureADMSGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group is assigned to Helpdesk Administrator built-in role in Azure AD." -MailEnabled $false -SecurityEnabled $true -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole $true
```

For this type of group, `isPublic` will always be false and `isSecurityEnabled` will always be true.

### Copy one group's users and service principals into a role-assignable group

```powershell
#Basic set up
Install-Module -Name AzureAD
Import-Module -Name AzureAD
Get-Module -Name AzureAD

#Connect to Azure AD. Sign in as Privileged Role Administrator or Global Administrator. Only these two roles can create a role-assignable group.
Connect-AzureAD

#Input variabled: Existing group
$idOfExistingGroup = "14044411-d170-4cb0-99db-263ca3740a0c"

#Input variables: New role-assignable group
$groupName = "Contoso_Bellevue_Admins"
$groupDescription = "This group is assigned to Helpdesk Administrator built-in role in Azure AD."
$mailNickname = "contosobellevueadmins"

#Create new security group which is a role assignable group. For creating a Microsoft 365 group, set GroupTypes="Unified" and MailEnabled=$true
$roleAssignablegroup = New-AzureADMSGroup -DisplayName $groupName -Description $groupDescription -MailEnabled $false -MailNickname $mailNickname -SecurityEnabled $true -IsAssignableToRole $true

#Get details of existing group
$existingGroup = Get-AzureADMSGroup -Id $idOfExistingGroup
$membersOfExistingGroup = Get-AzureADGroupMember -ObjectId $existingGroup.Id

#Copy users and service principals from existing group to new group
foreach($member in $membersOfExistingGroup){
if($member.ObjectType -eq 'User' -or $member.ObjectType -eq 'ServicePrincipal'){
Add-AzureADGroupMember -ObjectId $roleAssignablegroup.Id -RefObjectId $member.ObjectId
}
}
```

---

## Microsoft Graph API

Use the [Create group](/graph/api/group-post-groups?branch=main) API to create a role-assignable group.

```http
POST https://graph.microsoft.com/v1.0/groups
{
  "description": "This group is assigned to Helpdesk Administrator built-in role of Azure AD.",
  "displayName": "Contoso_Helpdesk_Administrators",
  "groupTypes": [
    "Unified"
  ],
  "isAssignableToRole": true,
  "mailEnabled": true,
  "securityEnabled": true,
  "mailNickname": "contosohelpdeskadministrators",
  "visibility" : "Private"
}
```

For this type of group, `isPublic` will always be false and `isSecurityEnabled` will always be true.

## Next steps

- [Assign Azure AD roles to groups](groups-assign-role.md)
- [Use Azure AD groups to manage role assignments](groups-concept.md)
- [Troubleshoot Azure AD roles assigned to groups](groups-faq-troubleshooting.yml)
