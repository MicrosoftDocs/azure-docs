---
title: Change request settings for an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to change request settings for an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: ajburnle
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 09/16/2020
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about how I can edit an access package so that requestors have the resources they need to perform their job.

---
# Change request settings for an access package in Azure AD entitlement management

As an access package manager, you can change the users who can request an access package at any time by editing the policy or adding a new policy. This article describes how to change the request settings for an existing access package.

## Choose between one or multiple policies

The way you specify who can request an access package is with a policy. Before creating a new policy or editing an existing policy in an access package, you need to determine how many policies the access package needs. 

When you create an access package, you specify the request setting which creates a policy. Most access packages will have a single policy, but a single access package can have multiple policies. You would create multiple policies for an access package if you want to allow different sets of users to be granted assignments with different request and approval settings. 

For example, a single policy cannot be used to assign internal and external users to the same access package. However, you can create two policies in the same access package, one for internal users and one for external users. If there are multiple policies that apply to a user, they will be prompted at the time of their request to select the policy they would like to be assigned to. The following diagram shows an access package with two policies.

![Multiple policies in an access package](./media/entitlement-management-access-package-request-policy/access-package-policy.png)

### How many policies will I need?

| Scenario | Number of policies |
| --- | --- |
| I want all users in my directory to have the same request and approval settings for an access package | One |
| I want all users in certain connected organizations to be able to request an access package | One |
| I want to allow users in my directory and also users outside my directory to request an access package | Multiple |
| I want to specify different approval settings for some users | Multiple |
| I want some users access package assignments to expire while other users can extend their access | Multiple |

For information about the priority logic that is used when multiple policies apply, see [Multiple policies](entitlement-management-troubleshoot.md#multiple-policies
).

## Open an existing access package and add a new policy of request settings

If you have a set of users that should have different request and approval settings, you'll likely need to create a new policy. Follow these steps to start adding a new policy to an existing access package:

**Prerequisite role:** Global administrator, User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then **Add policy**.

1. You will start on the **Basics** tab. Type a name and a description for the policy.

    ![Create policy with name and description](./media/entitlement-management-access-package-request-policy/policy-name-description.png)

1. Click **Next** to open the **Requests** tab.

1. Change the **Users who can request access** setting. Use the steps in the following sections to change the setting to one of the following options: 
    - [For users in your directory](#for-users-in-your-directory) 
    - [For users not in your directory](#for-users-not-in-your-directory)
    - [None (administrator direct assignments only)](#none-administrator-direct-assignments-only)

## For users in your directory

Follow these steps if you want to allow users in your directory to be able to request this access package. When defining the request policy, you can specify individual users, or more commonly groups of users. For example, your organization may already have a group such as **All employees**.  If that group is added in the policy for users who can request access, then any member of that group can then request access.

1. In the **Users who can request access** section, click **For users in your directory**.

    When you select this option, new options appear to further refine who in your directory can request this access package.

    ![Access package - Requests - For users in your directory](./media/entitlement-management-access-package-request-policy/for-users-in-your-directory.png)

1. Select one of the following options:

    |  |  |
    | --- | --- |
    | **Specific users and groups** | Choose this option if you want only the users and groups in your directory that you specify to be able to request this access package. |
    | **All members (excluding guests)** | Choose this option if you want all member users in your directory to be able to request this access package. This option doesn't include any guest users you might have invited into your directory. |
    | **All users (including guests)** | Choose this option if you want all member users and guest users in your directory to be able to request this access package. |

    Guest users refer to external users that have been invited into your directory with [Azure AD B2B](../external-identities/what-is-b2b.md). For more information about the differences between member users and guest users, see [What are the default user permissions in Azure Active Directory?](../fundamentals/users-default-permissions.md).

1. If you selected **Specific users and groups**, click **Add users and groups**.

1. In the Select users and groups pane, select the users and groups you want to add.

    ![Access package - Requests - Select users and groups](./media/entitlement-management-access-package-request-policy/select-users-groups.png)

1. Click **Select** to add the users and groups.

1. If you want to require approval, use the steps in [Change approval settings for an access package in Azure AD entitlement management](entitlement-management-access-package-approval-policy.md) to configure approval settings.

1. Go to the [Enable requests](#enable-requests) section.
 
## For users not in your directory

 **Users not in your directory** refers to users who are in another Azure AD directory or domain. These users may not have yet been invited into your directory. Azure AD directories must be configured to be allow invitations in **Collaboration restrictions**. For more information, see [Enable B2B external collaboration and manage who can invite guests](../external-identities/delegate-invitations.md).

> [!NOTE]
> A guest user account will be created for a user not yet in your directory whose request is approved or auto-approved. The guest will be invited, but will not receive an invite email. Instead, they will receive an email when their access package assignment is delivered. By default, later when that guest user no longer has any access package assignments, because their last assignment has expired or been cancelled, that guest user account will be blocked from sign in and subsequently deleted. If you want to have guest users remain in your directory indefinitely, even if they have no access package assignments, you can change the settings for your entitlement management configuration. For more information about the guest user object, see [Properties of an Azure Active Directory B2B collaboration user](../external-identities/user-properties.md).

Follow these steps if you want to allow users not in your directory to request this access package:

1. In the **Users who can request access** section, click **For users not in your directory**.

    When you select this option, new options appear.

    ![Access package - Requests - For users not in your directory](./media/entitlement-management-access-package-request-policy/for-users-not-in-your-directory.png)

1. Select one of the following options:

    |  |  |
    | --- | --- |
    | **Specific connected organizations** | Choose this option if you want to select from a list of organizations that your administrator previously added. All users from the selected organizations can request this access package. |
    | **All configured connected organizations** | Choose this option if all users from all your configured connected organizations can request this access package. Only users from configured connected organizations can request access packages that are shown to users from all configured organizations. |
    | **All users (All connected organizations + any new external users)** | Choose this option if any user on the internet should be able to request this access package.  If they don’t belong to a connected organization in your directory, a connected organization will automatically be created for them when they request the package. The automatically created connected organization will be in a **proposed** state. For more information about the proposed state, see [State properties of connected organizations](entitlement-management-organization.md#state-properties-of-connected-organizations). |

    A connected organization is an external Azure AD directory or domain that you have a relationship with.

1. If you selected **Specific connected organizations**, click **Add directories** to select from a list of connected organizations that your administrator previously added.

1. Type the name or domain name to search for a previously connected organization.

    ![Access package - Requests - Select directories](./media/entitlement-management-access-package-request-policy/select-directories.png)

    If the organization you want to collaborate with isn't in the list, you can ask your administrator to add it as a connected organization. For more information, see [Add a connected organization](entitlement-management-organization.md).

1. Once you've selected all your connected organizations, click **Select**.

    > [!NOTE]
    > All users from the selected connected organizations will be able to request this access package. This includes users in Azure AD from all subdomains associated with the organization, unless those domains are blocked by the Azure B2B allow or deny list. For more information, see [Allow or block invitations to B2B users from specific organizations](../external-identities/allow-deny-list.md).

1. If you want to require approval, use the steps in [Change approval settings for an access package in Azure AD entitlement management](entitlement-management-access-package-approval-policy.md) to configure approval settings.
 
1. Go to the [Enable requests](#enable-requests) section.

## None (administrator direct assignments only)

Follow these steps if you want to bypass access requests and allow administrators to directly assign specific users to this access package. Users won't have to request the access package. You can still set lifecycle settings, but there are no request settings.

1. In the **Users who can request access** section, click **None (administrator direct assignments only**.

    ![Access package - Requests - None administrator direct assignments only](./media/entitlement-management-access-package-request-policy/none-admin-direct-assignments-only.png)

    After you create the access package, you can directly assign specific internal and external users to the access package. If you specify an external user, a guest user account will be created in your directory. For information about directly assigning a user, see [View, add, and remove assignments for an access package](entitlement-management-access-package-assignments.md).

1. Skip to the [Enable requests](#enable-requests) section.


## Open and edit an existing policy of request settings

To change the request and approval settings for an access package, you need to open the corresponding policy. Follow these steps to open and edit the request settings for an access package:

**Prerequisite role:** Global administrator, User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then click the policy you want to edit.

    The Policy details pane opens at the bottom of the page.

    ![Access package - Policy details pane](./media/entitlement-management-shared/policy-details.png)

1. Click **Edit** to edit the policy.

    ![Access package - Edit policy](./media/entitlement-management-shared/policy-edit.png)

1. Click the **Requests** tab to open the request settings.

1. Use the steps in the previous sections to change the request settings as needed.

1. Go to the [Enable requests](#enable-requests) section.

## Enable requests

1. If you want the access package to be made immediately available for users in the request policy to request, move the Enable toggle to **Yes**.

    You can always enable it in the future after you have finished creating the access package.

    If you selected **None (administrator direct assignments only)** and you set enable to **No**, then administrators can't directly assign this access package.

    ![Access package - Policy- Enable policy setting](./media/entitlement-management-access-package-approval-policy/enable-requests.png)

1. Click **Next**.

1. If you want to require requestors to provide additional information when requesting access to an access package, use the steps in []() to configure requestor information (preview).

1. Configure lifecycle settings.

1. If you are editing a policy click **Update**. If you are adding a new policy, click **Create**.

## Next steps

- [Change the approval settings for an access package](entitlement-management-access-package-approval-policy.md)
- [Change lifecycle settings for an access package](entitlement-management-access-package-lifecycle-policy.md)
- [View requests for an access package](entitlement-management-access-package-requests.md)
