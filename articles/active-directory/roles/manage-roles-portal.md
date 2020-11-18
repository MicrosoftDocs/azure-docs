---
title: View and assign administrator role permissions - Azure AD | Microsoft Docs
description: You can now see and manage members of an Azure AD administrator role in the portal. For those who frequently manage role assignments.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 11/05/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# View and assign administrator roles in Azure Active Directory

You can now see and manage all the members of the administrator roles in the Azure Active Directory portal. If you frequently manage role assignments, you will probably prefer this experience. And if you ever wondered “What the heck do these roles really do?”, you can see a detailed list of permissions for each of the Azure AD administrator roles.

## View all roles

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Azure Active Directory**.

1. Select **Roles and administrators** to see the list of all available roles.

1. Select the ellipsis on the right of each row to see the permissions for the role. Select a role to view the users assigned to the role. If you see something different from the following picture, read the Note in [View assignments for privileged roles](#view-assignments-for-privileged-roles) to verify whether you're in Privileged Identity Management (PIM).

    ![list of roles in Azure AD portal](./media/manage-roles-portal/view-roles-in-azure-active-directory.png)

## View my roles

It's easy to view your own permissions as well. Select **Your Role** on the **Roles and administrators** page to see the roles that are currently assigned to you.

## View assignments for privileged roles

You can select **Manage in PIM** for additional management capabilities. Privileged Role Administrators can change “Permanent” (always active in the role) assignments to “Eligible” (in the role only when elevated). If you don't have Privileged Identity Management, you can still select **Manage in PIM** to sign up for a trial. Privileged Identity Management requires an [Azure AD Premium P2 license plan](../privileged-identity-management/subscription-requirements.md).

![list of members of an admin role](./media/manage-roles-portal/member-list.png)

If you are a Global Administrator or a Privileged Role Administrator, you can easily add or remove members, filter the list, or select a member to see their active assigned roles.

> [!Note]
> If you have an Azure AD premium P2 license and you already use Privileged Identity Management, all role management tasks are performed in Privilege Identity Management and not in Azure AD.
>
> ![Azure AD roles managed in PIM for users who already use PIM and have a Premium P2 license](./media/manage-roles-portal/pim-manages-roles-for-p2.png)

## View a user's role permissions

When you're viewing a role's members, select **Description** to see the complete list of permissions granted by the role assignment. The page includes links to relevant documentation to help guide you through managing directory roles.

![Screenshot that shows the "Global administrator - Description" page.](./media/manage-roles-portal/role-description.png)

## Download role assignments

To download all assignments for a specific role, on the **Roles and administrators** page, select a role, and then select **Download role assignments**. A CSV file that lists assignments at all scopes for that role is downloaded.

![download all assignments for a role](./media/manage-roles-portal/download-role-assignments.png)

## Assign a role

1. Sign in to the [Azure portal](https://portal.azure.com) with Global Administrator or Privileged Role Administrator permissions and select **Azure Active Directory**.

1. Select **Roles and administrators** to see the list of all available roles.

1. Select a role to see its assignments.

    ![Screenshot that shows the "User administrator - Assignments" page with the "Manage in PIM" action selected.](./media/manage-roles-portal/member-list.png)

1. Select **Add assignments** and select the roles you want to assign. You can select **Manage in PIM** for additional management capabilities. If you see something different from the following picture, read the Note in [View assignments for privileged roles](#view-assignments-for-privileged-roles) to verify whether you're in PIM.

    ![list of permissions for an admin role](./media/manage-roles-portal/directory-role-select-role.png)

## Next steps

* Feel free to share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
* For more about roles and Administrator role assignment, see [Assign administrator roles](permissions-reference.md).
* For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
