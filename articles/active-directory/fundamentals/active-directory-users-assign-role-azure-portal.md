---
title: How to assign directory roles to users with Azure Active Directory | Microsoft Docs
description: How to assign directory roles to users with the Azure Active Directory portal.
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

# How to: Assign roles and administrators to users with the Azure Active Directory portal
New users aren't automatically assigned roles during creation. Instead, you have to specifically assign your users to an appropriate role, based on your organization's requirements.

For more information about the available roles, see [Assigning administrator roles in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md). For more information about adding users, see [Add new users to Azure Active Directory](add-users-azure-active-directory.md).

## Assign roles
For the purposes of this exercise, we're going to assign roles to users from the Directory role option on the user's profile page.

You can also assign roles using Privileged Identity Management (PIM). For more detailed information about how to use PIM, see [Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/privileged-identity-management).

### To assign a role to a user
1. Sign in to the [Azure AD portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, select **Users**, and then search for and select the user getting the role assignment. For example, _Alain Charon_.

IMAGE

3. Select **Directory role**, and then select **Add role**.

IMAGE

4. On the **Alain Charon - Directory role** blade, select the role to assign, and then choose **Select**. For example, select the role _Application administrator_.

IMAGE

Removing a role assignment
If you need to remove the role assignment from a user, you can also do that from the **Alain Charon - Directory role** blade.

### To remove a role assignment from a user

1. Select **Azure Active Directory**, select **Users**, and then search for and select the user getting the role assignment removed. For example, _Alain Charon_.

IMAGE

2. Select **Directory role**, select **Application administrator**, and then select **Remove role**.

IMAGE

## Next steps
- [Add or delete users](add-users-azure-active-directory.md)

- [Add or change profile information](active-directory-users-profile-azure-portal.md)

- [Add guest users from another directory](../b2b/what-is-b2b.md)

Or you can perform more complex user scenarios, such as assigning delegates, using policies, and sharing user accounts. For more information about other available actions, see [Azure Active Directory user management documentation](../users-groups-roles/index.yml).


