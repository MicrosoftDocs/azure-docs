---
title: Manage Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how to manage savings plans. See steps to change the plan's scope, split a plan, and optimize its use.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 11/17/2023
ms.author: banders
---

# Manage Azure savings plans

After you buy an Azure savings plan, you may need to apply the savings plan to a different subscription, change who can manage the savings plan, or change the scope of the savings plan.

_Permission needed to manage a savings plan is separate from subscription permission._

## View savings plan order

To view a savings plan order, go to **Savings Plan** > select the savings plan, and then select the **Savings plan order ID**.

## Change the savings plan scope

Your savings plan discount applies to virtual machines, Azure Dedicated Hosts, Azure App services, Azure Container Instances, and Azure Premium Functions resources that match your savings plan and run in the savings plan scope. The billing scope is dependent on the subscription used to buy the savings plan.

Changing a savings plan's scope doesn't affect its term.

To update a savings plan scope:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Cost Management + Billing** > **Savings plans**.
3. Select the savings plan.
4. Select **Settings** > **Configuration**.
5. Change the scope.

If you change from shared to single scope, you can only select subscriptions where you're the owner. If you are a billing administrator, you don’t need to be an owner on the subscription. Only subscriptions within the same billing scope as the savings plan can be selected.

The scope only applies to Enterprise offers (MS-AZR-0017P or MS-AZR-0148P),  Microsoft Customer Agreements, and Microsoft Partner Agreements.

If all subscriptions are moved out of a management group, the scope of the savings plan is automatically changed to **Shared**.

## Who can manage a savings plan

By default, the following users can view and manage savings plan:

- The person who bought the savings plan and the account owner for the billing subscription get Azure RBAC access to the savings plan order.
- Enterprise Agreement and Microsoft Customer Agreement billing contributors can manage all savings plans from Cost Management + Billing > **Savings plan**. 

For more information, see [Permissions to view and manage Azure savings plans](permission-view-manage.md).

## How billing administrators view or manage savings plans

If you're a billing administrator you don't need to be an owner on the subscription. Use following steps to view and manage all savings plans and to their transactions.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
2. In the left menu, select **Products + services** > **Savings plan**.
3. The complete list of savings plans for your EA enrollment or billing profile is shown.

## Cancel, exchange, or refund

You can't cancel, exchange, or refund savings plans. 

## Transfer savings plan

Although you can't cancel, exchange, or refund a savings plan, you can transfer it from one supported agreement to another. For more information about supported transfers, see [Azure product transfer hub](../manage/subscription-transfer.md#product-transfer-support).

## View savings plan usage

Billing administrators can view savings plan usage Cost Management + Billing.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Cost Management + Billing** > **Savings plans** and note the **Utilization (%)** for a savings plan.
1. Select a savings plan.
1. Review the savings plan use trend over time.

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

To learn more about Azure Savings plan, see the following articles:
- [View saving plan utilization](utilization-cost-reports.md)
- [Cancellation policy](cancel-savings-plan.md)
- [Renew a savings plan](renew-savings-plan.md)
