---
title: List Azure AD role definitions - Azure AD
description: You can now see and manage members of an Azure AD administrator role in the portal. For those who frequently manage role assignments.
services: active-directory
author: rolyon
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 03/07/2021
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# List Azure AD role definitions

A role definition is a collection of permissions that can be performed, such as read, write, and delete. It's typically just called a role. Azure Active Directory has over 70 built-in roles or you can create your own custom roles. This article describes how to list the built-in and custom roles that you can use to grant access to Azure resources.

## List all roles

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) and select **Azure Active Directory**.

1. Select **Roles and administrators** to see the list of all available roles.

1. Select the ellipsis on the right of each row to see the permissions for the role. Select a role to view the users assigned to the role. If you see something different from the following picture, read the Note in [View assignments for privileged roles](#view-assignments-for-privileged-roles) to verify whether you're in Privileged Identity Management (PIM).

    ![list of roles in Azure AD portal](./media/role-definitions-list/view-roles-in-azure-active-directory.png)

## List role permissions

When you're viewing a role's members, select **Description** to see the complete list of permissions granted by the role assignment. The page includes links to relevant documentation to help guide you through managing directory roles.

![Screenshot that shows the "Global administrator - Description" page.](./media/role-definitions-list/role-description.png)

## Next steps

* Feel free to share with us on the [Azure AD administrative roles forum](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=166032).
* For more about roles and Administrator role assignment, see [Assign administrator roles](permissions-reference.md).
* For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md).
