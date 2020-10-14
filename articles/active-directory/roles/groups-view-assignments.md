---
title: View roles assigned to a group in Azure Active Directory | Microsoft Docs
description: Learn how the roles assigned to a group can be viewed using Azure AD admin center. Viewing groups and assigned roles are default user permissions.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 07/27/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---


# View roles assigned to a group in Azure Active Directory

This section describes how the roles assigned to a group can be viewed using Azure AD admin center. Viewing groups and assigned roles are default user permissions.

1. Sign in to the [Azure AD admin center](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with any non-admin or admin credentials.

1. Select the group that you are interested in.

1. Select **Assigned roles**. You can now see all the Azure AD roles assigned to this group.

   ![View all roles assigned to a selected group](./media/groups-view-assignments/view-assignments.png)

## Using PowerShell

### Get object ID of the group

```powershell
Get-AzureADMSGroup -SearchString “Contoso_Helpdesk_Administrators”
```

### View role assignment to a group

```powershell
Get-AzureADMSRoleAssignment -Filter "principalId eq '<object id of group>" 
```

## Using Microsoft Graph API

### Get object ID of the group

```powershell
GET https://graph.microsoft.com/beta/groups?$filter displayName eq ‘Contoso_Helpdesk_Administrator’ 
```

### Get role assignments to a group

```powershell
GET https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments?$filter=principalId eq
```

## Next steps

- [Use cloud groups to manage role assignments](../users-groups-roles/roles-groups-concept.md)
- [Troubleshooting roles assigned to cloud groups](../users-groups-roles/roles-groups-faq-troubleshooting.md)
