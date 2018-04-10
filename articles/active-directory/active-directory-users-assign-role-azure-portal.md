---

title: Assign a user to administrator roles in Azure Active Directory  | Microsoft Docs
description: Explains how to change user administrative information in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.assetid: a1ca1a53-50d8-4bf0-ae8f-73fa1253e2d9
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/08/2018
ms.author: curtand
ms.reviewer: jeffsta

---
# Assign a user to administrator roles in Azure Active Directory
This article explains how to assign an administrative role to a user in Azure Active Directory (Azure AD). For information about adding new users in your organization, see [Add new users to Azure Active Directory](active-directory-users-create-azure-portal.md). Added users don't have administrator permissions by default, but you can assign roles to them at any time.

## Assign a role to a user
1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that's a global admin for the directory.
2. Select **Users and groups**.

   ![Opening user management](./media/active-directory-users-assign-role-azure-portal/create-users-user-management.png)
3. Select **All users**.
  
  ![Opening All users group](./media/active-directory-users-assign-role-azure-portal/create-users-open-users-blade.png)
4. Select a user from the list.
5. For the selected user, select **Directory role** and then assign the user to a role from the **Directory role** list. For more information about user and administrator roles, see [Assigning administrator roles in Azure AD](active-directory-assign-admin-roles-azure-portal.md).

      ![Assigning a user to a role](./media/active-directory-users-assign-role-azure-portal/create-users-assign-role.png)
6. Select **Save**.

## Next steps
* [Quickstart: Add or delete users in Azure Active Directory](add-users-azure-active-directory.md)
* [Manage user profiles](active-directory-users-profile-azure-portal.md)
* [Add guest users from another directory](active-directory-b2b-what-is-azure-ad-b2b.md) 
* [Assign a user to a role in your Azure AD](active-directory-users-assign-role-azure-portal.md)
* [Restore a deleted user](active-directory-users-restore.md)
