---
title: Buy an Azure savings plan
titleSuffix: Microsoft Cost Management
description: This article provides you with information to help you buy an Azure savings plan.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 05/07/2024
ms.author: banders
---

# Buy an Azure savings plan

Azure savings plans help you save money by committing to an hourly spend for one-year or three-year plans for Azure compute resources. Before you enter a commitment to buy a savings plan, review the following sections to prepare for your purchase.

Only one savings plan is offered. It applies to all compute services listed at [Charges covered by savings plan](savings-plan-compute-overview.md#charges-covered-by-savings-plan).

## Prerequisites

The person who buys a savings plan must have the necessary permissions. For more information, see [Permissions to buy an Azure savings plan](permission-buy-savings-plan.md).

## Purchase a savings plan

You can purchase a savings plan by using the [Azure portal](https://portal.azure.com/). You can also use the [Savings Plan Order Alias - Create](/rest/api/billingbenefits/savings-plan-order-alias/create) REST API.

After you buy a savings plan, you can [change the savings plan scope](manage-savings-plan.md#change-the-savings-plan-scope) to a different subscription.

### Buy a savings plan in the Azure portal

1. Sign in to the Azure portal.
1. In the **Search** area, enter **Savings plans**. Then select **Savings plans**.
1. Select **Add** to purchase a new savings plan.
1. Complete all the required fields:
    - **Name**: Friendly name for the new savings plan.
    - **Billing subscription**: Subscription used to pay for the savings plan. For more information about permissions and roles required to purchase a savings plan, see [Permissions to buy an Azure savings plan](perimssion-buy-savings-plan.md).
    - **Apply to any eligible resource**: Scope of resources that are eligible for savings plan benefits. For more information, see [Savings plan scopes](scope-savings-plan.md).
    - **Term length**: One year or three years.
    - **Hourly commitment**: Amount available through the plan each hour. In the Azure portal, up to 10 recommendations might appear. Recommendations are scope-specific. Azure doesn't currently provide recommendations for management groups. Each recommendation includes:
        - An hourly commitment.
        - The potential savings percentage compared to on-demand costs for the commitment.
        - The percentage of the selected scopes compute usage that is covered by the new savings plan. It includes the commitment amount plus any other previously purchased savings plan or reservation.
    - **Billing frequency**: **All upfront** or **Monthly**. The total cost of the savings plan is the same regardless of the selected frequency.

### Purchase with the Savings Plan Order Alias - Create API

You can buy savings plans by using Azure role-based access control (RBAC) permissions or with permissions on your billing scope. When you use the [Savings Plan Order Alias - Create](/rest/api/billingbenefits/savings-plan-order-alias/create) REST API, the format of the `billingScopeId` property in the request body is used to control the permissions that are checked.

#### Purchase by using Azure RBAC permissions

- You must have the savings plan purchaser role within, or be an owner of, the subscription that you plan to use, which is specified as `billingScopeId`.
- The `billingScopeId` property in the request body must use the `/subscriptions/10000000-0000-0000-0000-000000000000` format.

#### Purchase by using billing permissions

Permission needed to purchase varies by the type of account that you have:

- **Enterprise Agreement**: You must be an Enterprise Agreement admin with write permissions.
- **Microsoft Customer Agreement**: You must be a billing profile contributor or higher.
- **Microsoft Partner Agreement**: Only Azure RBAC permissions are currently supported.

The `billingScopeId` property in the request body must use the `/providers/Microsoft.Billing/billingAccounts/{accountId}/billingSubscriptions/10000000-0000-0000-0000-000000000000` format.

## Cancel, exchange, or refund savings plans

You can't cancel, exchange, or refund savings plans.

### Buy savings plans with monthly payments

You can pay for savings plans with monthly payments. Unlike an up front purchase where you pay the full amount, the monthly payment option divides the total cost of the savings plan evenly over each month of the term. The total cost of upfront and monthly savings plans is the same. You don't pay any extra fees when you choose to pay monthly.

If a savings plan is purchased by using a Microsoft Customer Agreement, your monthly payment amount might vary, depending on the current month's market exchange rate for your local currency.

## View payments made

You can view payments that were made by using APIs, usage data, and cost analysis. For savings plans paid for monthly, the frequency value is shown as **recurring** in the usage data and the Savings Plan Charges API. For savings plans paid upfront, the value is shown as **onetime**.

Cost analysis shows monthly purchases in the default view. Apply the **purchase** filter to **Charge type** and **recurring** for **Frequency** to see all purchases. To view only savings plans, apply a filter for **Savings Plan**.

:::image type="content" source="./media/buy-savings-plan/cost-analysis-savings-plan-costs.png" alt-text="Screenshot that shows saving plan costs in cost analysis." lightbox="./media/buy-savings-plan/cost-analysis-savings-plan-costs.png" :::

## Reservation trade-ins and refunds

Unlike reservations, you can't return or exchange savings plans.

You can trade in one or more reservations for a savings plan. When you trade in reservations, the hourly commitment of the new savings plan must be greater than the leftover payments that are canceled for the returned reservations. There are no other limits or fees for trade-ins. You can trade in a reservation that gets paid for upfront to purchase a new savings plan that gets billed monthly. However, the lifetime value of the new savings plan must be greater than the prorated value of the reservations traded in.

## Savings plan notifications

Depending on how you pay for your Azure subscription, email savings plan notifications are sent to the following users in your organization. Notifications are sent for various events, such as:

- Purchase
- Upcoming savings plan expiration: 30 days before
- Expiry: 30 days before
- Renewal
- Cancellation
- Scope change

For customers with Enterprise Agreement subscriptions:

- Notifications are sent to Enterprise Agreement administrators and Enterprise Agreement notification contacts.
- The Azure RBAC owner of the savings plan receives all notifications.

For customers with Microsoft Customer Agreement subscriptions:

- The purchaser receives a purchase notification.
- The Azure RBAC owner of the savings plan receives all notifications.

For Microsoft Partner Agreement partners:

- Notifications are sent to the partner.

## Need help?

If you have Azure savings plan for compute questions, contact your account team or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides answers to expert support requests in English for questions about Azure savings plan for compute.

## Related content

- To learn how to manage a savings plan, see [Manage Azure savings plans](manage-savings-plan.md).
- To learn more about Azure savings plans, see:

    - [What are Azure savings plans?](savings-plan-compute-overview.md)
    - [Manage Azure savings plans](manage-savings-plan.md)
    - [How a savings plan discount is applied](discount-application.md)
    - [Understand savings plan costs and usage](utilization-cost-reports.md)
    - [Software costs not included with Azure savings plans](software-costs-not-included.md)
