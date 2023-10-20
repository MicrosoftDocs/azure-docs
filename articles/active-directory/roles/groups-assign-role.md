---
title: Assign Microsoft Entra roles to groups
description: Assign Microsoft Entra roles to role-assignable groups in the Microsoft Entra admin center, PowerShell, or Microsoft Graph API.
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
ms.custom: it-pro, has-azure-ad-ps-ref

ms.collection: M365-identity-device-management
---

# Assign Microsoft Entra roles to groups

To simplify role management, you can assign Microsoft Entra roles to a group instead of individuals. This article describes how to assign Microsoft Entra roles to [role-assignable groups](groups-concept.md) using the Microsoft Entra admin center, PowerShell, or Microsoft Graph API.

## Prerequisites

- Microsoft Entra ID P1 license
- [Privileged Role Administrator](./permissions-reference.md#privileged-role-administrator) role
- Microsoft.Graph module when using [Microsoft Graph PowerShell](/powershell/microsoftgraph/installation?branch=main)
- Azure AD PowerShell module when using [Azure AD PowerShell](/powershell/azure/active-directory/overview?branch=main)
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Assigning a Microsoft Entra role to a group is similar to assigning users and service principals except that only groups that are role-assignable can be used.

> [!TIP]
> These steps apply to customers that have a Microsoft Entra ID P1 license. If you have a Microsoft Entra ID P2 license in your tenant, you should instead follow steps in [Assign Microsoft Entra roles in Privileged Identity Management](../privileged-identity-management/pim-how-to-add-role-to-user.md).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator).

1. Browse to **Identity** > **Roles & admins** > **Roles & admins**.

    :::image type="content" source="media/common/roles-and-administrators.png" alt-text="Screenshot of Roles and administrators page in Microsoft Entra ID." lightbox="media/common/roles-and-administrators.png":::

1. Select the role name to open the role. Don't add a check mark next to the role.

    :::image type="content" source="media/common/role-select-mouse.png" alt-text="Screenshot that shows selecting a role." lightbox="media/common/role-select-mouse.png":::

1. Select **Add assignments**.

    If you see something different from the following screenshot, you might have Microsoft Entra ID P2. For more information, see [Assign Microsoft Entra roles in Privileged Identity Management](../privileged-identity-management/pim-how-to-add-role-to-user.md).

    :::image type="content" source="media/groups-assign-role/add-assignments.png" alt-text="Screenshot of Add assignments pane to assign role to users or groups." lightbox="media/groups-assign-role/add-assignments.png":::

1. Select the group you want to assign to this role. Only role-assignable groups are displayed.

    If group isn't listed, you will need to create a role-assignable group. For more information, see [Create a role-assignable group in Microsoft Entra ID](groups-create-eligible.md).

1. Select **Add** to assign the role to the group.

## PowerShell

# [Microsoft Graph PowerShell](#tab/ms-powershell)

### Create a role-assignable group

Use the [New-MgGroup](/powershell/module/microsoft.graph.groups/new-mggroup?branch=main) command to create a role-assignable group.

```powershell
Connect-MgGraph -Scopes "Group.ReadWrite.All","RoleManagement.ReadWrite.Directory"
$group = New-MgGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group has Helpdesk Administrator built-in role assigned to it in Azure AD." -MailEnabled:$false -SecurityEnabled -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole:$true
```

### Get the role definition you want to assign

Use the [Get-MgRoleManagementDirectoryRoleDefinition](/powershell/module/microsoft.graph.identity.governance/get-mgrolemanagementdirectoryroledefinition) command to get a role definition.

```powershell
$roleDefinition = Get-MgRoleManagementDirectoryRoleDefinition -Filter "displayName eq 'Helpdesk Administrator'"
```

### Create a role assignment

Use the [New-MgRoleManagementDirectoryRoleAssignment](/powershell/module/microsoft.graph.identity.governance/new-mgrolemanagementdirectoryroleassignment) command to assign the role.

```powershell
$roleAssignment = New-MgRoleManagementDirectoryRoleAssignment -DirectoryScopeId '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $group.Id
```

# [Azure AD PowerShell](#tab/aad-powershell)

[!INCLUDE [aad-powershell-migration-include](../includes/aad-powershell-migration-include.md)]

### Create a role-assignable group

Use the [New-AzureADMSGroup](/powershell/module/azuread/new-azureadmsgroup?branch=main) command to create a role-assignable group.

```powershell
$group = New-AzureADMSGroup -DisplayName "Contoso_Helpdesk_Administrators" -Description "This group is assigned to Helpdesk Administrator built-in role in Azure AD." -MailEnabled $false -SecurityEnabled $true -MailNickName "contosohelpdeskadministrators" -IsAssignableToRole $true 
```

### Get the role definition you want to assign

Use the [Get-AzureADMSRoleDefinition](/powershell/module/azuread/get-azureadmsroledefinition?branch=main) command to get a role definition.

```powershell
$roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Helpdesk Administrator'" 
```

### Create a role assignment

Use the [New-AzureADMSRoleAssignment](/powershell/module/azuread/new-azureadmsroleassignment?branch=main) command to assign the role.

```powershell
$roleAssignment = New-AzureADMSRoleAssignment -DirectoryScopeId '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $group.Id 
```

---

## Microsoft Graph API

### Create a role-assignable group

Use the [Create group](/graph/api/group-post-groups?branch=main) API to create a role-assignable group.

**Request**

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
    "mailNickname": "contosohelpdeskadministrators",
    "securityEnabled": true
}
```

**Response**

```http
HTTP/1.1 201 Created
```

### Get the role definition you want to assign

Use the [List unifiedRoleDefinitions](/graph/api/rbacapplication-list-roledefinitions?branch=main) API to get a role definition.

**Request**

```http
GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleDefinitions?$filter = displayName eq 'Helpdesk Administrator'
```

**Response**

```json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#roleManagement/directory/roleDefinitions",
    "value": [
        {
            "id": "729827e3-9c14-49f7-bb1b-9608f156bbb8",
            "description": "Can reset passwords for non-administrators and Helpdesk Administrators.",
            "displayName": "Helpdesk Administrator",
            "isBuiltIn": true,
            "isEnabled": true,
            "resourceScopes": [
                "/"
            ],

    ...

```

### Create the role assignment

Use the [Create unifiedRoleAssignment](/graph/api/rbacapplication-post-roleassignments?branch=main) API to assign the role.

**Request**

```http
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments

{
    "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
    "principalId": "<Object ID of Group>",
    "roleDefinitionId": "<ID of role definition>",
    "directoryScopeId": "/"
}
```

**Response**

```json
HTTP/1.1 201 Created
Content-type: application/json
{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#roleManagement/directory/roleAssignments/$entity",
    "id": "<Role assignment ID>",
    "roleDefinitionId": "<ID of role definition>",
    "principalId": "<Object ID of Group>",
    "directoryScopeId": "/"
}

```

## Next steps

- [Use Microsoft Entra groups to manage role assignments](groups-concept.md)
- [Troubleshoot Microsoft Entra roles assigned to groups](groups-faq-troubleshooting.yml)
