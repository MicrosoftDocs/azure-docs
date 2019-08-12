---
title: Update and manage a dynamic group rule and troubleshoot membership - Azure Active Directory | Microsoft Docs
description: How to create a group membership rule in the Azure portal, check status.
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 08/12/2019
ms.author: curtand
ms.reviewer: krbain

ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Update a dynamic group to manage membership in Azure Active Directory

In Azure Active Directory (Azure AD), you can use rules to determine group membership based on user or device properties. This article tells how to set up a rule for a dynamic group in the Azure portal.
Dynamic membership is supported for security groups or Office 365 groups. When a group membership rule is applied, user and device attributes are evaluated for matches with the membership rule. When an attribute changes for a user or device, all dynamic group rules in the organization are processed for membership changes. Users and devices are added or removed if they meet the conditions for a group.

For examples of syntax, supported properties, operators, and values for a membership rule, see [Dynamic membership rules for groups in Azure Active Directory](groups-dynamic-membership.md).

## To update a group membership rule

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that is in the Global administrator, Intune administrator, or User administrator role in the tenant.
1. Select **Groups** > **All groups**.
1. Select a group to open its profile.
1. On the profile page for the group, select **Dynamic membership rules**. The rule builder supports up to five expressions. To add a sixth or any subsequent expressions, you must use the text box.

   ![Add membership rule for a dynamic group](./media/groups-update-rule/update-dynamic-group-rule.png)

1. To see the custom extension properties available for your membership rule:
   1. Select **Get custom extension properties**
   2. Enter the application ID, and then select **Refresh properties**.
1. After updating the rule, select **Save**.

If the rule you entered isn't valid, an explanation of why the rule couldn't be processed is displayed in the an Azure notification in the portal. Read it carefully to understand how to fix the rule.

## Check processing status for a rule

You can see the membership processing status and the last updated date on the **Overview** page for the group.
  
  ![display of dynamic group status](./media/groups-create-rule/group-status.png)

The following status messages can be shown for **Membership processing** status:

* **Evaluating**:  The group change has been received and the updates are being evaluated.
* **Processing**: Updates are being processed.
* **Update complete**: Processing has completed and all applicable updates have been made.
* **Processing error**:  Processing couldn't be completed because of an error evaluating the membership rule.
* **Update paused**: Dynamic membership rule updates have been paused by the administrator. MembershipRuleProcessingState is set to “Paused”.

The following status messages can be shown for **Membership last updated** status:

* **Date and time**: The last time the membership was updated.
* **In Progress**: Updates are currently in progress.
* **Unknown**: The last update time can't be retrieved. The group might be new.

If an error occurs while processing the membership rule for a specific group, an alert is shown on the top of the **Overview page** for the group. If no pending dynamic membership updates can be processed for all the groups within the tenant for more then 24 hours, an alert is shown on the top of **All groups**.

![processing error message alerts](./media/groups-create-rule/processing-error.png)

These articles provide additional information on groups in Azure AD.

* For a complete reference to dynamic rule structure, see [Dynamic membership rule syntax](groups-dynamic-membership.md).
* [Create a static membership group and add members](../fundamentals/active-directory-groups-create-azure-portal.md)
