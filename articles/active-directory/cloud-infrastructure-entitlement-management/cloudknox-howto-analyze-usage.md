---
title: Microsoft CloudKnox Permissions Management - Analyze usage for an identity, a task, or an authorization system
description: How to analyze usage for an identity, a task, or an authorization system in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/29/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management -  Analyze usage for an identity, a task, or an authorization system

This topic describes how you can use the Usage Analytics dashboard to analyse usage for an authorization system, a task, or an identity type (user).

## Analyze usage for an authorization system

1. In the **Filter** tab on the left, select **Authorization systems** (the lock icon).
2. Select the authorization system you want and then select **Apply**.
<!---Text to come.--->

## Analyze usage for a task

1. In the **Filter** tab on the left, select **Tasks** (the clipboard icon).
2. Select **All**, **High Risk Tasks**, or **Delete**, and then select **Apply**.
<!---Text to come.--->

## Analyze usage for a user identity type

1. In the **Filter** tab on the left, select **Users** (the people icon).
2. Select the type of user, role, or resource you want, and then select **Apply**.

    The **Usage Analytics** tab page displays a list of users that match your criteria. The list includes **Local** users and **SAML** (Security Assertions Markup Language) users.

    The **Privilege Creep Index** (PCI) column displays the level of privileges available to the user compared to how much the user is using. The PCI helps you determine if the user is using all, some, or none of the privileges  they have been granted.
3. To sort the PCI in ascending or descending order, select **Index**.
4. To view which privileges have been granted to, and used by, a user, select a username.
5. CloudKnox displays:

    The privileges granted to the user that are **Unused** and **Used**.
    The **Groups** the user belongs to.
    The **Roles** available to the user.
    The **Roles** the user has accessed.

### For a deeper dive into the identity's usage

1. On the **Usage Analytics** tab page, select a username.

    The **User Explorer** appears, displaying more information about the user, the user groups they are in, the policies attached to the user, the roles available to them, and the roles they have accessed.
2. Select **View** (the eye icon) to the right of a policy or role to view its details.

### View the IMKeys the user has created

1. On the **Usage Analytics** tab page, select an **IMKey** from the drop-down list in the upper left of the page.

    CloudKnox displays a list of IMKeys created for the user.
2. Select a username to view their privilege access and usage details.

    The **Access Key Info** displays when the user last used the privileges. This information helps you determine if the user is currently active and how active they are.

## Grant access to individual accounts to a user

1. In the **Filter** tab on the left, select **Authorization systems** (the lock icon).
2. Select an authorization system.
3. Select an account, and then select **Apply**.

    CloudKnox displays a list of users.
4. To see if a user has a cross-account role they can assume, in the **Domain/Account** column, select the user’s account.

    CloudKnox displays the **Account Explorer** displaying lists of **Roles that Provide Access**, **Connecting Roles**, and **Identities with Access**.
5. To evaluate the IMRole and who can assume it, in the **Roles that Provide Access** box, select a role.
<!---Text to come.--->




<!---## Next steps--->
