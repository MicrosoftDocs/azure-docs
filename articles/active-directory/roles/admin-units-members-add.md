---
title: Add users, groups, or devices to an administrative unit - Azure Active Directory
description: Add users, groups, or devices to an administrative unit in Azure Active Directory
services: active-directory
documentationcenter: ''
author: rolyon
manager: karenhoran
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

# Add users, groups, or devices to an administrative unit

> [!IMPORTANT]
> Administrative units support for devices is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In Azure Active Directory (Azure AD), you can add users, groups, or devices to an administrative unit to restrict the scope of role permissions. For additional details on what scoped administrators can do, see [Administrative units in Azure Active Directory](administrative-units.md).

This article describes how to add users, groups, or devices to administrative units manually. For information about how to add users or devices to administrative units dynamically using rules, see [Manage users or devices for an administrative unit with dynamic membership rules](admin-units-members-dynamic.md).

## Prerequisites

- Azure AD Premium P1 or P2 license for each administrative unit administrator
- Azure AD Free licenses for administrative unit members
- Privileged Role Administrator or Global Administrator
- AzureAD module when using PowerShell
- AzureADPreview module when using PowerShell for devices
- Admin consent when using Graph explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## Azure portal

You can add users, groups, or devices to administrative units using the Azure portal. You can also add users in a bulk operation.

### Add a single user, group, or device to administrative units

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory**.

1. Select one of the following:

    - **Users**
    - **Groups**
    - **Devices** > **All devices**
  
1. Select the user, group, or device you want to add to administrative units.

1. Select **Administrative units**. 

1. Select **Assign to administrative unit**.

1. In the **Select** pane, select the administrative units and then select **Select**.

    ![Screenshot of the Administrative units page for adding a user to an administrative unit.](./media/admin-units-members-add/assign-users-individually.png)

### Add users, groups, or devices to a single administrative unit

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory**.

1. Select **Administrative units** and then select the administrative unit that you want to add users, groups, or devices to.

1. Select one of the following:

    - **Users**
    - **Groups**
    - **Devices**

1. Select **Add member**, **Add**, or **Add device**.

1. In the **Select** pane, select the users, groups, or devices you want to add to the administrative unit and then select **Select**.

    ![Screenshot of adding multiple devices to an administrative unit.](./media/admin-units-members-add/admin-unit-members-add.png)

### Add users to an administrative unit in a bulk operation

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Select **Azure Active Directory**.

1. Select **Administrative units** and then select the administrative unit that you want to add users to.

1. Select the administrative unit to which you want to add users.

1. Select **Users** > **Bulk operations** > **Bulk add members**.

   ![Screenshot of the Users page for assigning users to an administrative unit as a bulk operation.](./media/admin-units-members-add/bulk-assign-to-admin-unit.png)

1. In the **Bulk add members** pane, download the comma-separated values (CSV) template.

1. Edit the downloaded CSV template with the list of users you want to add.

    Add one user principal name (UPN) in each row. Don't remove the first two rows of the template.

1. Save your changes and upload the CSV file.

   ![Screenshot of an edited CSV file for adding users to an administrative unit in bulk.](./media/admin-units-members-add/bulk-user-entries.png)

1. Select **Submit**.

## PowerShell

Use the [Add-AzureADMSAdministrativeUnitMember](/powershell/module/azuread/add-azureadmsadministrativeunitmember) command to add users or groups to an administrative unit.

Use the [Add-AzureADMSAdministrativeUnitMember (Preview)](/powershell/module/azuread/add-azureadmsadministrativeunitmember?view=azureadps-2.0-preview&preserve-view=true) command to add devices to an administrative unit.

### Add users to an administrative unit

```powershell
$adminUnitObj = Get-AzureADMSAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
$userObj = Get-AzureADUser -Filter "UserPrincipalName eq 'bill@example.com'"
Add-AzureADMSAdministrativeUnitMember -Id $adminUnitObj.Id -RefObjectId $userObj.ObjectId
```

### Add groups to an administrative unit

```powershell
$adminUnitObj = Get-AzureADMSAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
$groupObj = Get-AzureADGroup -Filter "displayname eq 'TestGroup'"
Add-AzureADMSAdministrativeUnitMember -Id $adminUnitObj.Id -RefObjectId $groupObj.ObjectId
```

### Add devices to an administrative unit

```powershell
$adminUnitObj = Get-AzureADMSAdministrativeUnit -Filter "displayname eq 'Test administrative unit 2'"
$deviceObj = Get-AzureADDevice -Filter "displayname eq 'TestDevice'"
Add-AzureADMSAdministrativeUnitMember -Id $adminUnitObj.Id -RefObjectId $deviceObj.ObjectId
```

## Microsoft Graph API

Use the [Add a member](/graph/api/administrativeunit-post-members) API to add users or groups to an administrative unit.

Use the [Add a member (Beta)](/graph/api/administrativeunit-post-members?view=graph-rest-beta&preserve-view=true) API to add devices to an administrative unit.


### Add users to an administrative unit

Request

```http
POST https://graph.microsoft.com/v1.0/directory/administrativeUnits/{admin-unit-id}/members/$ref
```

Body

```http
{
    "@odata.id":"https://graph.microsoft.com/v1.0/users/{user-id}"
}
```

Example

```http
{
    "@odata.id":"https://graph.microsoft.com/v1.0/users/john@example.com"
}
```

### Add groups to an administrative unit

Request

```http
POST https://graph.microsoft.com/v1.0/directory/administrativeUnits/{admin-unit-id}/members/$ref
```

Body

```http
{
    "@odata.id":"https://graph.microsoft.com/v1.0/groups/{group-id}"
}
```

Example

```http
{
    "@odata.id":"https://graph.microsoft.com/v1.0/groups/871d21ab-6b4e-4d56-b257-ba27827628f3"
}
```

### Add devices to an administrative unit

Request

```http
POST https://graph.microsoft.com/beta/administrativeUnits/{admin-unit-id}/members/$ref
```

Body

```http
{
    "@odata.id":"https://graph.microsoft.com/beta/devices/{device-id}"
}
```

## Next steps

- [Administrative units in Azure Active Directory](administrative-units.md)
- [Assign Azure AD roles with administrative unit scope](admin-units-assign-roles.md)
- [Manage users or devices for an administrative unit with dynamic membership rules](admin-units-members-dynamic.md)
- [Remove users, groups, or devices from an administrative unit](admin-units-members-remove.md)
