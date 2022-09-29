---
title: Manage Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how to manage savings plans. See steps to change the plan's scope, split a plan, and optimize its use.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 09/23/2022
ms.author: banders
---

# Manage Azure savings plans


After you buy an Azure savings plan, you may need to apply the savings plan to a different subscription, change who can manage the savings plan, or change the scope of the savings plan.

_Permission needed to manage a savings plan is separate from subscription permission._

## Savings plan order and savings plan

To view a savings plan order, go to **Savings Plan** > select the savings plan, and then select the **Savings plan order ID**.

## Change the savings plan scope

Your savings plan discount applies to virtual machines, Azure Dedicated Hosts, Azure App services, Azure Container Instances, and Azure Premium Functions resources that match your savings plan and run in the savings plan scope. The billing context is dependent on the subscription used to buy the savings plan.

To update a savings plan scope:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Savings plans**.
3. Select the savings plan.
4. Select **Settings** > **Configuration**.
5. Change the scope.

If you change from shared to single scope, you can only select subscriptions where you're the owner. Only subscriptions within the same billing context as the savings plan can be selected.

The scope only applies to individual subscriptions with pay-as-you-go rates (offers MS-AZR-0003P or MS-AZR-0023P), Enterprise offers (MS-AZR-0017P or MS-AZR-0148P),  Microsoft Customer Agreements, and Microsoft Partner Agreements.

If all subscriptions are moved out of a management group, the scope of the savings plan is automatically changed to **Shared**.

## Who can manage a savings plan by default

By default, the following users can view and manage savings plan:

- The person who bought the savings plan and the account owner for the billing subscription get Azure RBAC access to the savings plan order.
- Enterprise Agreement and Microsoft Customer Agreement billing contributors can manage all savings plans from Cost Management + Billing > **Savings plan**. 
 
To allow other people to manage savings plans, you have two options:

  - Delegate access management for an individual savings plan order by assigning the Owner role to a user at the resource scope of the savings plan order. If you want to give limited access, select a different role.  
    For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
  - Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement:
      - For an Enterprise Agreement, add users with the _Enterprise Administrator_ role to view and manage all savings plan orders that apply to the Enterprise Agreement. Users with the _Enterprise Administrator (read only)_ role can only view the savings plan. Department admins and account owners can't view savings plans _unless_ they're explicitly added to them using Access control (IAM).  
      For more information, see [Managing Azure Enterprise roles](../manage/understand-ea-roles.md).  
      - For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made using the billing profile. Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## How billing administrators view or manage savings plans

If you're a billing administrator, use following steps to view and manage all savings plans and to their transactions.

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to **Cost Management + Billing**.
  - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
  - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
2. In the left menu, select **Products + services** > **Savings plan**.
3. The complete list of savings plans for your EA enrollment or billing profile is shown.

## Change billing subscription

We don't allow changing Billing subscription after a savings plan is purchased. 

## Cancel, exchange, or refund

You can't cancel, exchange, or refund savings plans. 

## View savings plan use

You can view savings plan usage is in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **All services** > **Savings plans** and note the **Utilization (%)** for a savings plan.
1. Select a savings plan.
1. Review the savings plan use trend over time.

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

To learn more about Azure Savings plan, see the following articles:
- [View saving plan utilization](utilization-cost-reports.md)
- [Cancellation policy](cancel-savings-plan.md)
- [Renew a savings plan](renew-savings-plan.md)