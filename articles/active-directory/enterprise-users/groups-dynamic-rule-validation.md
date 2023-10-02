---
title: Validate rules for dynamic group membership (preview)
description: How to test members against a membership rule for a dynamic group in Microsoft Entra ID.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: yukarppa
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Validate a dynamic group membership rule (preview) in Microsoft Entra ID

Microsoft Entra ID provides the means to validate dynamic group rules (in public preview). On the **Validate rules** tab, you can validate your dynamic rule against sample group members to confirm the rule is working as expected. When you create or update dynamic group rules, you want to know whether a user or a device will be a member of the group. This knowledge helps you evaluate whether a user or device meets the rule criteria and help you troubleshoot when membership isn't expected.

## Prerequisites
To evaluate the dynamic group rule membership feature, the administrator must have one of the following rules assigned directly: Global Administrator, Groups Administrator, or Intune Administrator.

> [!TIP]
> Assigning one of required roles via indirect group membership is not yet supported.

## Step-by-step walk-through

To get started, sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Groups Administrator](../roles/permissions-reference.md#groups-administrator).

Browse to **Identity** > **Groups** > **All groups**. Select an existing dynamic group or create a new dynamic group and select **Dynamic membership rules**. You can then see the **Validate Rules** tab.

![Find the Validate rules tab and start with an existing rule](./media/groups-dynamic-rule-validation/validate-tab.png)

On **Validate rules** tab, you can select users to validate their memberships. 20 users or devices can be selected at one time.

![Add users to validate the existing rule against](./media/groups-dynamic-rule-validation/validate-tab-add-users.png)

After you select users or devices from the picker, and **Select**, validation will automatically start and validation results will appear.

![View the results of the rule validation](./media/groups-dynamic-rule-validation/validate-tab-results.png)

The results tell whether a user is a member of the group or not. If the rule isn't valid or there's a network issue, the result will show as **Unknown**. If the value is **Unknown**, the detailed error message will describe the issue and actions needed.

![View the details of the results of the rule validation](./media/groups-dynamic-rule-validation/validate-tab-view-details.png)

You can modify the rule and validation of memberships will be triggered. To see why user isn't a member of the group, select **View details** and verification details will show the result of each expression composing the rule. Select **OK** to exit.

## Next steps

- [Dynamic membership rules for groups](groups-dynamic-membership.md)
