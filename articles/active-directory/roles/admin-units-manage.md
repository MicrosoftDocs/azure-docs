---
title: Add or delete administrative units - Azure Active Directory
description: Add administrative units to restrict the scope of role permissions in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: rolyon
manager: daveba
ms.service: active-directory
ms.topic: how-to
ms.subservice: roles
ms.workload: identity
ms.date: 11/18/2021
ms.author: rolyon
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Add or delete administrative units

Administrative units let you subdivide your organization into any unit that you want, and then assign specific administrators that can manage only the members of that unit. For example, you could use administrative units to delegate permissions to administrators of each school at a large university, so they could control access, manage users, and set policies only in the School of Engineering.

This article describes how to add or delete administrative units to restrict the scope of role permissions in Azure Active Directory (Azure AD).

## Prerequisites

- Azure AD Premium P1 or P2 license for each administrative unit administrator
- Azure AD Free licenses for administrative unit members
- Privileged Role Administrator or Global Administrator
- AzureAD module when using PowerShell
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Add an administrative unit

You can add an administrative unit by using either the Azure portal, PowerShell or Microsoft Graph.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Administrative units**.

    ![Screenshot of the "Administrative units" link in Azure AD.](./media/admin-units-manage/nav-to-admin-units.png)

1. Select the **Add** button at the upper part of the pane, and then, in the **Name** box, enter the name of the administrative unit. Optionally, add a description of the administrative unit.

    ![Screenshot showing the Add button and the Name box for entering the name of the administrative unit.](./media/admin-units-manage/add-new-admin-unit.png)

1. Select the blue **Add** button to finalize the administrative unit.

### PowerShell

```powershell
Connect-AzureAD
New-AzureADMSAdministrativeUnit -Description "West Coast region" -DisplayName "West Coast"
```

You can modify the values that are enclosed in quotation marks, as required.

### Microsoft Graph API

Request

```http
POST /directory/administrativeUnits
```

Body

```http
{
  "displayName": "North America Operations",
  "description": "North America Operations administration"
}
```

## Delete an administrative unit

In Azure AD, you can delete an administrative unit that you no longer need as a unit of scope for administrative roles.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory** > **Administrative units**.
 
1. Select the administrative unit to be deleted, and then select **Delete**.

1. To confirm that you want to delete the administrative unit, select **Yes**. The administrative unit is deleted.

    ![Screenshot of the administrative unit Delete button and confirmation window.](./media/admin-units-manage/select-admin-unit-to-delete.png)

### PowerShell

```powershell
$adminUnitObj = Get-AzureADMSAdministrativeUnit -Filter "displayname eq 'DeleteMe Admin Unit'"
Remove-AzureADMSAdministrativeUnit -Id $adminUnitObj.Id
```

You can modify the values that are enclosed in quotation marks, as required for the specific environment.

### Microsoft Graph API

Request

```http
DELETE /directory/administrativeUnits/{admin-unit-id}
```

Body

```http
{}
```

## Next steps

* [Manage users in an administrative unit](admin-units-add-manage-users.md)
* [Manage groups in an administrative unit](admin-units-add-manage-groups.md)
