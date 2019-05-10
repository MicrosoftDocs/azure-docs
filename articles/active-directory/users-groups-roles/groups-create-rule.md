---
title: Create a dynamic group and check status - Azure Active Directory | Microsoft Docs
description: How to create a group membership rule in the Azure portal, check status.
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 03/18/2019
ms.author: curtand
ms.reviewer: krbain

ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Create a dynamic group and check status

In Azure Active Directory (Azure AD), you can use rules to determine group membership based on user or device properties. This article tells how to set up a rule for a dynamic group in the Azure portal.
Dynamic membership is supported for security groups or Office 365 groups. When a group membership rule is applied, user and device attributes are evaluated for matches with the membership rule. When an attribute changes for a user or device, all dynamic group rules in the organization are processed for membership changes. Users and devices are added or removed if they meet the conditions for a group.

For examples of syntax, supported properties, operators, and values for a membership rule, see [Dynamic membership rules for groups in Azure Active Directory](groups-dynamic-membership.md).

## To create a group membership rule

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that is in the Global administrator, Intune administrator, or User administrator role in the tenant.
2. Select **Groups**.
3. Select **All groups**, and select **New group**.

   ![Select the command to add new group](./media/groups-create-rule/new-group-creation.png)

4. On the **Group** page, enter a name and description for the new group. Select a **Membership type** for either users or devices, and then select **Add dynamic query**. You can use the rule builder to build a simple rule, or [write a membership rule yourself](groups-dynamic-membership.md).

   ![Add membership rule for a dynamic group](./media/groups-create-rule/add-dynamic-group-rule.png)

5. To see the custom extension properties available for your membership query
   1. Select **Get custom extension properties**
   2. Enter the application ID, and then select **Refresh properties**. 
6. After creating the rule, select **Add query** at the bottom of the blade.
7. Select **Create** on the **Group** blade to create the group.

If the rule you entered isn't valid, an explanation of why the rule couldn't be processed is displayed in the upper-right corner of the portal. Read it carefully to understand how to fix the rule.

## Turn on or off welcome email

When a new Office 365 group is created, a welcome notification is sent the users who are added to the group. Later, if any attributes of a user or device change, all dynamic group rules in the organization are processed for membership changes. Users who are added then also receive the welcome notification. You can turn off this behavior in [Exchange PowerShell](https://docs.microsoft.com/powershell/module/exchange/users-and-groups/Set-UnifiedGroup?view=exchange-ps). 

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

* &lt;**Date and time**&gt;: The last time the membership was updated.
* **In Progress**: Updates are currently in progress.
* **Unknown**: The last update time can't be retrieved. The group might be new.

If an error occurs while processing the membership rule for a specific group, an alert is shown on the top of the **Overview page** for the group. If no pending dynamic membership updates can be processed for all the groups within the tenant for more then 24 hours, an alert is shown on the top of **All groups**.

![processing error message alerts](./media/groups-create-rule/processing-error.png)

These articles provide additional information on groups in Azure Active Directory.

* [See existing groups](../fundamentals/active-directory-groups-view-azure-portal.md)
* [Create a new group and adding members](../fundamentals/active-directory-groups-create-azure-portal.md)
* [Manage settings of a group](../fundamentals/active-directory-groups-settings-azure-portal.md)
* [Manage memberships of a group](../fundamentals/active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](groups-dynamic-membership.md)
