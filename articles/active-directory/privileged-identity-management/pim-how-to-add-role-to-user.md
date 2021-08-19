---
title: Assign Azure AD roles in PIM - Azure Active Directory | Microsoft Docs
description: Learn how to assign Azure AD roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: pim
ms.date: 06/03/2021
ms.author: curtand
ms.collection: M365-identity-device-management
ms.custom: subject-rbac-steps
---

# Assign Azure AD roles in Privileged Identity Management

With Azure Active Directory (Azure AD), a Global administrator can make **permanent** Azure AD admin role assignments. These role assignments can be created using the [Azure portal](../roles/permissions-reference.md) or using [PowerShell commands](/powershell/module/azuread#directory_roles).

The Azure AD Privileged Identity Management (PIM) service also allows Privileged role administrators to make permanent admin role assignments. Additionally, Privileged role administrators can make users **eligible** for Azure AD admin roles. An eligible administrator can activate the role when they need it, and then their permissions expire once they're done.

Privileged Identity Management support both built-in and custom Azure AD roles. For more information on Azure AD custom roles, see [Role-based access control in Azure Active Directory](../roles/custom-overview.md).

## Assign a role

Follow these steps to make a user eligible for an Azure AD admin role.

1. Sign in to [Azure portal](https://portal.azure.com/) with a user that is a member of the [Privileged role administrator](../roles/permissions-reference.md#privileged-role-administrator) role.

1. Open **Azure AD Privileged Identity Management**.

1. Select **Azure AD roles**.

1. Select **Roles** to see the list of roles for Azure AD permissions.

    ![Screenshot of the "Roles" page with the "Add assignments" action selected.](./media/pim-how-to-add-role-to-user/roles-list.png)

1. Select **Add assignments** to open the **Add assignments** page.

1. Select **Select a role** to open the **Select a role** page.

    ![New assignment pane](./media/pim-how-to-add-role-to-user/select-role.png)

1. Select a role you want to assign, select a member to whom you want to assign to the role, and then select **Next**.

1. In the **Assignment type** list on the **Membership settings** pane, select **Eligible** or **Active**.

    - **Eligible** assignments require the member of the role to perform an action to use the role. Actions might include performing a multi-factor authentication (MFA) check, providing a business justification, or requesting approval from designated approvers.

    - **Active** assignments don't require the member to perform any action to use the role. Members assigned as active have the privileges assigned to the role at all times.

1. To specify a specific assignment duration, add a start and end date and time boxes. When finished, select **Assign** to create the new role assignment.

    ![Memberships settings - date and time](./media/pim-how-to-add-role-to-user/start-and-end-dates.png)

1. After the role is assigned, a assignment status notification is displayed.

    ![New assignment - Notification](./media/pim-how-to-add-role-to-user/assignment-notification.png)

## Assign a role with restricted scope

For certain roles, the scope of the granted permissions can be restricted to a single admin unit, service principal, or application. This procedure is an example if assigning a role that has the scope of an administrative unit. For a list of roles that support scope via administrative unit, see [Assign scoped roles to an administrative unit](../roles/admin-units-assign-roles.md). This feature is currently being rolled out to Azure AD organizations.

1. Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com) with Privileged Role Administrator permissions.

1. Select **Azure Active Directory** > **Roles and administrators**.

1. Select the **User Administrator**.

    ![The Add assignment command is available when you open a role in the portal](./media/pim-how-to-add-role-to-user/add-assignment.png)

1. ​Select **Add assignments**.

    ![When a role supports scope, you can select a scope](./media/pim-how-to-add-role-to-user/add-scope.png)

1. On the **Add assignments** page, you can:

   - Select a user or group to be assigned to the role
   - Select the role scope (in this case, administrative units)
   - Select an administrative unit for the scope

For more information about creating administrative units, see [Add and remove administrative units](../roles/admin-units-manage.md).

## Update or remove an existing role assignment

Follow these steps to update or remove an existing role assignment. **Azure AD P2 licensed customers only**: Don't assign a group as Active to a role through both Azure AD and Privileged Identity Management (PIM). For a detailed explanation, see [Known issues](../roles/groups-concept.md#known-issues).

1. Open **Azure AD Privileged Identity Management**.

1. Select **Azure AD roles**.

1. Select **Roles** to see the list of roles for Azure AD.

1. Select the role that you want to update or remove.

1. Find the role assignment on the **Eligible roles** or **Active roles** tabs.

    ![Update or remove role assignment](./media/pim-how-to-add-role-to-user/remove-update-assignments.png)

1. Select **Update** or **Remove** to update or remove the role assignment.

## Next steps

- [Configure Azure AD admin role settings in Privileged Identity Management](pim-how-to-change-default-settings.md)
- [Assign Azure resource roles in Privileged Identity Management](pim-resource-roles-assign-roles.md)