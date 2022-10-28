---
title: Create or delete administrative units - Azure Active Directory
description: Create administrative units to restrict the scope of role permissions in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.subservice: roles
ms.workload: identity
ms.date: 03/22/2022
ms.author: rolyon
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Create or delete administrative units

Administrative units let you subdivide your organization into any unit that you want, and then assign specific administrators that can manage only the members of that unit. For example, you could use administrative units to delegate permissions to administrators of each school at a large university, so they could control access, manage users, and set policies only in the School of Engineering.

This article describes how to create or delete administrative units to restrict the scope of role permissions in Azure Active Directory (Azure AD).

## Prerequisites

- Azure AD Premium P1 or P2 license for each administrative unit administrator
- Azure AD Free licenses for administrative unit members
- Privileged Role Administrator or Global Administrator
- AzureAD module when using PowerShell
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Create an administrative unit

You can create a new administrative unit by using either the Azure portal, PowerShell or Microsoft Graph.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Administrative units**.

    ![Screenshot of the Administrative units page in Azure AD.](./media/admin-units-manage/nav-to-admin-units.png)

1. Select **Add**.

1. In the **Name** box, enter the name of the administrative unit. Optionally, add a description of the administrative unit.

    ![Screenshot showing the Add administrative unit page and the Name box for entering the name of the administrative unit.](./media/admin-units-manage/add-new-admin-unit.png)

1. Optionally, on the **Assign roles** tab, select a role and then select the users to assign the role to with this administrative unit scope.

    ![Screenshot showing the Add assignments pane to add role assignments with this administrative unit scope.](./media/admin-units-manage/assign-roles-admin-unit.png)

1. On the **Review + create** tab, review the administrative unit and any role assignments.

1. Select the **Create** button.

### PowerShell

Use the [New-AzureADMSAdministrativeUnit](/powershell/module/azuread/new-azureadmsadministrativeunit) command to create a new administrative unit.

```powershell
New-AzureADMSAdministrativeUnit -Description "West Coast region" -DisplayName "West Coast"
```

### Microsoft Graph API

Use the [Create administrativeUnit](/graph/api/administrativeunit-post-administrativeunits) API to create a new administrative unit.

Request

```http
POST https://graph.microsoft.com/v1.0/directory/administrativeUnits
```

Body

```http
{
  "displayName": "North America Operations",
  "description": "North America Operations administration"
}
```

## Delete an administrative unit

In Azure AD, you can delete an administrative unit that you no longer need as a unit of scope for administrative roles. Before you delete the administrative unit, you should remove any role assignments with that administrative unit scope.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Administrative units** and then select the administrative unit you want to delete.

1. Select **Roles and administrators**, and then open a role to view the role assignments.

1. Remove all the role assignments with the administrative unit scope.

1. Select **Azure Active Directory** > **Administrative units**.

1. Add a check mark next to the administrative unit you want to delete.

1. Select **Delete**.

    ![Screenshot of the administrative unit Delete button and confirmation window.](./media/admin-units-manage/select-admin-unit-to-delete.png)

1. To confirm that you want to delete the administrative unit, select **Yes**.

### PowerShell

Use the [Remove-AzureADMSAdministrativeUnit](/powershell/module/azuread/remove-azureadmsadministrativeunit) command to delete an administrative unit.

```powershell
$adminUnitObj = Get-AzureADMSAdministrativeUnit -Filter "displayname eq 'DeleteMe Admin Unit'"
Remove-AzureADMSAdministrativeUnit -Id $adminUnitObj.Id
```

### Microsoft Graph API

Use the [Delete administrativeUnit](/graph/api/administrativeunit-delete) API to delete an administrative unit.

```http
DELETE https://graph.microsoft.com/v1.0/directory/administrativeUnits/{admin-unit-id}
```

## Next steps

- [Add users, groups, or devices to an administrative unit](admin-units-members-add.md)
- [Assign Azure AD roles with administrative unit scope](admin-units-assign-roles.md)
