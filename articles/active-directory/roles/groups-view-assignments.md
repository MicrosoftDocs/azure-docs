---
title: View roles assigned to a group in Microsoft Entra ID
description: Learn how the roles assigned to a group can be viewed using the Microsoft Entra admin center. Viewing groups and assigned roles are default user permissions.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 08/08/2023
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro, has-azure-ad-ps-ref

ms.collection: M365-identity-device-management
---


# View roles assigned to a group in Microsoft Entra ID

This section describes how the roles assigned to a group can be viewed using the Microsoft Entra admin center. Viewing groups and assigned roles are default user permissions.

## Prerequisites

- Azure AD PowerShell module when using PowerShell
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).

1. Browse to **Identity** > **Groups** > **All groups**.

1. Select a role-assignable group that you are interested in.

1. Select **Assigned roles**. You can now see all the Microsoft Entra roles assigned to this group.

   ![View all roles assigned to a selected group](./media/groups-view-assignments/view-assignments.png)

## PowerShell

### Get object ID of the group

```powershell
Get-AzureADMSGroup -SearchString "Contoso_Helpdesk_Administrators"
```

### View role assignment to a group

```powershell
Get-AzureADMSRoleAssignment -Filter "principalId eq '<object id of group>'" 
```

## Microsoft Graph API

### Get object ID of the group

Use the [Get group](/graph/api/group-get) API to get a group.

```http
GET https://graph.microsoft.com/v1.0/groups?$filter=displayName+eq+'Contoso_Helpdesk_Administrator'
```

### Get role assignments to a group

Use the [List unifiedRoleAssignments](/graph/api/rbacapplication-list-roleassignments) API to get the role assignment.

```http
GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments?$filter=principalId eq
```

## Next steps

- [Use Microsoft Entra groups to manage role assignments](groups-concept.md)
- [Troubleshoot Microsoft Entra roles assigned to groups](groups-faq-troubleshooting.yml)
