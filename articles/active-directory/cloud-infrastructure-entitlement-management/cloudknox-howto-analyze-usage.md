---
title: CloudKnox Permissions Management - Analyze usage for an identity, a task, or an authorization system
description: How to analyze usage for an identity, a task, or an authorization system in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Analyze usage for an identity, a task, or an authorization system

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how you can use the Usage Analytics dashboard to analyze usage for an authorization system, a task, or an identity type (user) in CloudKnox Permissions Management (CloudKnox).

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

    The **Privilege Creep Index** (PCI) column displays the level of privileges available to the user compared to what the user is currently using. The PCI number helps you determine if the user is using all, some, or none of the privileges they've been granted.
3. To sort the PCI in ascending or descending order, select **Index**.
4. To view which privileges have been granted to, and used by, a user, select a username.
5. CloudKnox displays:

    The privileges granted to the user that are **Unused** and **Used**.
    The **Groups** the user belongs to.
    The **Roles** available to the user.
    The **Roles** the user has accessed.

### Get an in-dept view of the identity's usage

1. On the **Usage Analytics** tab page, select a username.

    The **User Explorer** appears, displaying more information about the user, the user groups they are in, the policies attached to the user, the roles available to them, and the roles they've accessed.
2. Select **View** (the eye icon) to the right of a policy or role to view the JSON code.

    The JSON code displays which policies are granted to a user and how the trust relationship is set up.

### View the Identity and Access Management (IAM) keys the user created

1. On the **Usage Analytics** tab page, from the drop-down list in the top-left of the page, select **Access Key Entitlements and Usage**.

    CloudKnox displays a list of Access Key IDs.
2. Select a username to view their privilege access and usage details.

    **Access Key Info** includes when the user last used the privileges. This indicates if the user is currently active, how active they are, and which of the permissions that were granted are being used.

    CloudKnox also tracks the **Access Key Age** to determine when the key was initially created and if it is currently still active.

### Grant access to individual accounts to a user

1. In the **Filter** tab on the left, select **Authorization systems** (the lock icon).
2. Select an authorization system.
3. Select an account, and then select **Apply**.

    CloudKnox displays a list of users.
4. To see if a user has a cross-account role they can assume, in the **Domain/Account** column, select the user’s account.

    CloudKnox displays the **Account Explorer** displaying lists of **Roles that Provide Access**, **Connecting Roles**, and **Identities with Access**.
5. To see if a user can access an Identity and Access Management (IAM) role, in the **Roles that Provide Access** box, select a role.
6. Select **View** (the eye icon on the right of the role name). 

    CloudKnox displays the JSON code you can use to view the policies that have been granted to a user and how the trust relationship is set up.

### Determine if a user has access to an account

1. From the drop-down list in the top-left of the page, select **User Entitlements and Usage**.
2. In the **Domain/Asset** column, select a domain.
3. In the Filter tab on the left, select **Authorization systems**, and then select an account.
4. Select **Apply**.

    CloudKnox displays a list of users who have access to the account. 
5. Use **Search** to locate the user you want.

### Determine if a user has access to a global account

1. Select a **Global account**, and in the **Domain/Asset** column, select a domain.

    CloudKnox displays a list of IAM roles.
2. Select an IAM role.

    CloudKnox displays a diagram that displays how the role accesses the global account.
3. Select an account in the diagram.

    CloudKnox displays the JSON code you can use to view the policies that have been granted to a user and how the trust relationship is set up.

### Determine if a user has access to a resource

1. In the **Search** box at the top of the page, enter a user, resource, or task name, and then press **Enter**.
2. Select a resource from the displayed list to see the **Identities**, **Policies**, and **Sources** that have access to the resource. 
3. In the top-left of the page, you can see if the selected resource is encrypted, globally accessible, or private.
4. Select a user to display a diagram of how they have access to policies, roles, and resources.

    CloudKnox displays the JSON code you can use to view the policies that have been granted to a user and how the trust relationship is set up.



<!---## Next steps--->
