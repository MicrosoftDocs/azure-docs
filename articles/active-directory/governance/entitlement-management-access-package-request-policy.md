---
title: Change request and approval settings for an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to change request and approval settings for an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: msaburnley
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 03/30/2020
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about how I can edit an access package so that requestors have the resources they need to perform their job.

---
# Change request and approval settings for an access package in Azure AD entitlement management

As an access package manager, you can change the users who can request an access package at any time by editing the policy or adding a new policy. You can also change the approval settings.

This article describes how to change the request and approval settings for an existing access package.

## Choose between one or multiple polices

The way you specify who can request an access package is with a policy. When you create an access package, you specify the request and approval setting which creates a policy. Most access packages will have a single policy, but a single access package can have multiple policies. You would create multiple policies for an access package if you want to allow different sets of users to be granted assignments with different request and approval settings. For example, a single policy cannot be used to assign internal and external users to the same access package. However, you can create two policies in the same access package -- one for internal users and one for external users. If there are multiple policies that apply to a user, they will be prompted at the time of their request to select the policy they would like to be assigned to. The following diagram shows an access package with two policies.

![Multiple policies in an access package](./media/entitlement-management-access-package-request-policy/access-package-policy.png)

| Scenario | Number of policies |
| --- | --- |
| I want all users in my directory to have the same request and approval settings for an access package | One |
| I want all users in certain connected organizations to be able to request an access package | One |
| I want to allow users in my directory and also users outside my directory to request an access package | Multiple |
| I want to specify different approval settings for some users | Multiple |
| I want some users access package assignments to expire while other users can extend their access | Multiple |

For information about the priority logic that is used when multiple policies apply, see [Multiple policies](entitlement-management-troubleshoot.md#multiple-policies
).

### Open an existing policy of request and approval settings

To change the request and approval settings for an access package, you need to open the corresponding policy. Follow these steps to open the request and approval settings for an access package.

**Prerequisite role:** Global administrator, User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then click the policy you want to edit.

    The Policy details pane opens at the bottom of the page.

    ![Access package - Policy details pane](./media/entitlement-management-shared/policy-details.png)

1. Click **Edit** to edit the policy.

    ![Access package - Edit policy](./media/entitlement-management-shared/policy-edit.png)

1. Click the **Requests** tab to open the request and approval settings.

1. Perform the steps in one of the following request sections.

### Add a new policy of request and approval settings

If you have a set of users that should have different request and approval settings, you'll likely need to create a new policy. Follow these steps to start adding a new policy to an existing access package.

**Prerequisite role:** Global administrator, User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then **Add policy**.

1. Type a name and a description for the policy.

    ![Create policy with name and description](./media/entitlement-management-access-package-request-policy/policy-name-description.png)

1. Click **Next** to open the **Requests** tab.

1. Perform the steps in one of the following request sections.

[!INCLUDE [Entitlement management request policy](../../../includes/active-directory-entitlement-management-request-policy.md)]

If you are editing a policy click **Update**. If you are adding a new policy, click **Create**.

## Next steps

- [Change lifecycle settings for an access package](entitlement-management-access-package-lifecycle-policy.md)
- [View requests for an access package](entitlement-management-access-package-requests.md)