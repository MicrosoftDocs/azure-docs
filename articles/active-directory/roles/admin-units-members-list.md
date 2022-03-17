---
title: List users or groups in an administrative unit - Azure Active Directory
description: List users or groups in an administrative unit in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: rolyon
manager: karenhoran
ms.service: active-directory
ms.topic: how-to
ms.subservice: roles
ms.workload: identity
ms.date: 01/12/2022
ms.author: rolyon
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# List users or groups in an administrative unit

In Azure Active Directory (Azure AD), you can list the users or groups in administrative units.

## Prerequisites

- Azure AD Premium P1 or P2 license for each administrative unit administrator
- Azure AD Free licenses for administrative unit members
- Privileged Role Administrator or Global Administrator
- AzureAD module when using PowerShell
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Azure portal

You can list the users or groups in administrative units using the Azure portal.

### List the administrative units for a single user or group

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory**.

1. Select **Users** or **Groups** and then select the user or group you want to list their administrative units.

1. Select **Administrative units** to list all the administrative units where the user or group is a member. 

    ![Screenshot of the "Administrative units" pane, displaying a list administrative units that a group is assigned to.](./media/admin-units-members-list/list-group-au.png)

### List the users or groups for a single administrative unit

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory**.

1. Select **Administrative units** and then select the administrative unit that you want to list the users or groups for.

1. Select **Users** or **Groups** to see the list of users or groups for this administrative unit.

   ![Screenshot of the "Groups" pane displaying a list of groups in an administrative unit.](./media/admin-units-members-list/list-groups-in-admin-units.png)

## PowerShell

Use the [Get-AzureADMSAdministrativeUnit](/powershell/module/azuread/get-azureadmsadministrativeunit) and [Get-AzureADMSAdministrativeUnitMember](/powershell/module/azuread/get-azureadmsadministrativeunitmember) commands to list users or groups for an administrative unit.

> [!NOTE]
> By default, [Get-AzureADMSAdministrativeUnitMember](/powershell/module/azuread/get-azureadmsadministrativeunitmember) returns only top members of an administrative unit. To retrieve all members, add the `-All $true` parameter.

### List the administrative units for a user

```powershell
$userObj = Get-AzureADUser -Filter "UserPrincipalName eq 'bill@example.com'"
Get-AzureADMSAdministrativeUnit | where { Get-AzureADMSAdministrativeUnitMember -Id $_.Id | where {$_.Id -eq $userObj.ObjectId} }
```

### List the administrative units for a group

```powershell
$groupObj = Get-AzureADGroup -Filter "displayname eq 'TestGroup'"
Get-AzureADMSAdministrativeUnit | where { Get-AzureADMSAdministrativeUnitMember -Id $_.Id | where {$_.Id -eq $groupObj.ObjectId} }
```

### List the users and groups for an administrative unit

```powershell
$adminUnitObj = Get-AzureADMSAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
Get-AzureADMSAdministrativeUnitMember -Id $adminUnitObj.Id
```

### List the groups for an administrative unit

```powershell
$adminUnitObj = Get-AzureADMSAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
foreach ($member in (Get-AzureADMSAdministrativeUnitMember -Id $adminUnitObj.Id)) 
{
    if($member.OdataType -eq "#microsoft.graph.group")
    {
        Get-AzureADGroup -ObjectId $member.Id
    }
}
```

## Microsoft Graph API

Use the [List members](/graph/api/administrativeunit-list-members) API to list users or groups for an administrative unit.

### List the administrative units for a user

```http
GET https://graph.microsoft.com/v1.0/users/{user-id}/memberOf/$/Microsoft.Graph.AdministrativeUnit
```

### List the administrative units for a group

```http
GET https://graph.microsoft.com/v1.0/groups/{group-id}/memberOf/$/Microsoft.Graph.AdministrativeUnit
```

### List the groups for an administrative unit

```http
GET https://graph.microsoft.com/v1.0/directory/administrativeUnits/{admin-unit-id}/members/$/microsoft.graph.group
```


## Next steps

- [Add users or groups to an administrative unit](admin-units-members-add.md)
- [Assign Azure AD roles with administrative unit scope](admin-units-assign-roles.md)
