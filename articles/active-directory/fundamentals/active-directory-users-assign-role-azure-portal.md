---
title: Assign a user to administrator roles in Azure Active Directory  | Microsoft Docs
description: How to change user administrative information in Azure Active Directory
services: active-directory
documentationcenter: ''
author: eross-msft
manager: mtillman
editor: ''
ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: quickstart
ms.date: 06/25/2018
ms.author: lizross
ms.reviewer: jeffsta
---

# Assign a user to administrator roles in Azure Active Directory
This article explains how to assign an administrative role to a user in Azure Active Directory (Azure AD). For information about adding new users in your organization, see [Add new users to Azure Active Directory](../add-users-azure-active-directory.md). Added users don't have administrator permissions by default, but you can assign roles to them at any time.

## Assign a role to a user
1. Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin or privileged role admin for the directory.

2. Select **Azure Active Directory**, select **Users**, and then select a specific user from the list.

    ![Opening user management](./media/active-directory-users-assign-role-azure-portal/create-users-user-management.png)

3. For the selected user, select **Directory role**, select **Add role**, and then pick the appropriate admin roles from the **Directory roles** list, such as **Conditional access administrator**. For more information about administrative roles, see [Assigning administrator roles in Azure AD](../users-groups-roles/directory-assign-admin-roles.md). 

    ![Assigning a user to a role](./media/active-directory-users-assign-role-azure-portal/create-users-assign-role.png)

1. Press **Select** to save.

## Next steps
* [Quickstart: Add or delete users in Azure Active Directory](add-users-azure-active-directory.md)
* [Manage user profiles](active-directory-users-profile-azure-portal.md)
* [Add guest users from another directory](../b2b/what-is-b2b.md) 
* [Assign a user to a role in your Azure AD](active-directory-users-assign-role-azure-portal.md)
* [Restore a deleted user](active-directory-users-restore.md)
