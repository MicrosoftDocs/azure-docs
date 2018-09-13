---
title: How to assign directory roles to users with Azure Active Directory | Microsoft Docs
description: How to assign directory roles to users with Azure Active Directory.
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: conceptual
ms.date: 09/06/2018
ms.author: lizross
ms.reviewer: jeffsta
---

# How to: Assign roles and administrators to users with Azure Active Directory
New users aren't automatically assigned roles during creation. Instead, you have to specifically assign your users to an appropriate role, based on your organization's requirements.

For more information about the available roles, see [Assigning administrator roles in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md). For more information about adding users, see [Add new users to Azure Active Directory](add-users-azure-active-directory.md).

## Assign roles
For the purposes of this exercise, we're going to assign roles to users from the Directory role option on the user's profile page.

You can also assign roles using Privileged Identity Management (PIM). For more detailed information about how to use PIM, see [Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management).

### To assign a role to a user
1. Sign in to the [Azure AD portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, select **Users**, and then search for and select the user getting the role assignment. For example, _Alain Charon_.

3. On the **Alain Charon - Profile** page, select **Directory role**.

    The **Alain Charon - Directory role** page appears.

4. Select **Add role**, select the role to assign to Alain (for example, _Application administrator_), and then choose **Select**.

    ![Directory roles page, showing the selected role](media/active-directory-users-assign-role-azure-portal/directory-role-select-role.png)

    The Application administrator role is assigned to Alain Charon and it appears on the **Alain Charon - Directory role** page.

## Remove a role assignment
If you need to remove the role assignment from a user, you can also do that from the **Alain Charon - Directory role** page.

### To remove a role assignment from a user

1. Select **Azure Active Directory**, select **Users**, and then search for and select the user getting the role assignment removed. For example, _Alain Charon_.

2. Select **Directory role**, select **Application administrator**, and then select **Remove role**.

    ![Directory roles page, showing the selected role and the remove option](media/active-directory-users-assign-role-azure-portal/directory-role-remove-role.png)

    The Application administrator role is removed from Alain Charon and it no longer appears on the **Alain Charon - Directory role** page.

## Next steps
- [Add or delete users](add-users-azure-active-directory.md)

- [Add or change profile information](active-directory-users-profile-azure-portal.md)

- [Add guest users from another directory](../b2b/what-is-b2b.md)

Or you can perform more complex user scenarios, such as assigning delegates, using policies, and sharing user accounts. For more information about other available actions, see [Azure Active Directory user management documentation](../users-groups-roles/index.yml).


