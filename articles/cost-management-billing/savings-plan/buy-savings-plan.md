---
title: Buy an Azure savings plan
titleSuffix: Microsoft Cost Management
description: This article helps you buy an Azure savings plan.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/07/2023
ms.author: banders
---

# Buy an Azure savings plan

Azure savings plans help you save money by committing to an hourly spend for one-year or three-year plans for Azure compute resources. Before you enter a commitment to buy a savings plan, review the following sections to prepare for your purchase.

## Who can buy a savings plan

Savings plan discounts only apply to resources associated with subscriptions purchased through an Enterprise Agreement (EA), Microsoft Customer Agreement (MCA), or Microsoft Partner Agreement (MPA). You can buy a savings plan for an Azure subscription that's of type EA (MS-AZR-0017P or MS-AZR-0148P), MCA or MPA. To determine if you're eligible to buy a plan, [check your billing type](../manage/view-all-accounts.md#check-the-type-of-your-account).

>[!NOTE]
> Azure savings plan isn't supported for the China legacy Online Service Premium Agreement (OSPA) platform.

### Enterprise Agreement customers

- EA admins with write permissions can directly purchase savings plans from **Cost Management + Billing** > **Savings plan**. No subscription-specific permissions are needed.
- Subscription owners for one of the subscriptions in the enrollment account can purchase savings plans from **Home** > **Savings plan**.

Enterprise Agreement (EA) customers can limit purchases to only EA admins by disabling the Add Savings Plan option in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). Navigate to the **Policies** menu to change settings.

### Microsoft Customer Agreement (MCA) customers

- Customers with billing profile contributor permissions or higher can purchase savings plans from **Cost Management + Billing** > **Savings plan** experience. No subscription-specific permissions are needed.
- Subscription owners for one of the subscriptions in the billing profile can purchase savings plans from **Home** > **Savings plan**.

To disallow savings plan purchases on a billing profile, billing profile contributors can navigate to the **Policies** menu under the billing profile and adjust the Azure Savings Plan option.

### Microsoft Partner Agreement partners

Partners can use **Home** > **Savings plan** in the [Azure portal](https://portal.azure.com/) to purchase savings plans on behalf of their customers.

As of June 2023, partners can purchase an Azure savings plan through Partner Center. Previously, Azure savings plan was only supported for purchase through the Azure portal. Partners can now purchase Azure savings plan through the Partner Center portal, APIs, or they can continue to use the Azure portal.

To purchase Azure savings plan using the Partner Center APIs, see [Purchase Azure savings plans](/partner-center/developer/azure-purchase-savings-plan).

## Change agreement type to one supported by savings plan

If your current agreement type isn't supported by a savings plan, you might be able to transfer or migrate it to one that's supported. For more information, see the following articles.

- [Transfer Azure products between different billing agreements](../manage/subscription-transfer.md)
- [Product transfer support](../manage/subscription-transfer.md#product-transfer-support)
- [From MOSA to the Microsoft Customer Agreement](https://www.microsoft.com/licensing/news/from-mosa-to-microsoft-customer-agreement)

## Purchase savings plan

You can purchase a savings plan using the [Azure portal](https://portal.azure.com/) or with the [Savings Plan Order Alias - Create](/rest/api/billingbenefits/savings-plan-order-alias/create) REST API.

After you buy a savings plan, you can [change the savings plan scope](manage-savings-plan.md#change-the-savings-plan-scope) to a different subscription.

### Buy a savings plan in the Azure portal

1. Sign in to the Azure portal.
2. Select **All services** > **Savings plans**.
3. Select **Add** to purchase a new savings plan.
4. Complete all required fields:
    - **Name** – Friendly name for the new savings plan.
    - **Billing subscription** - Subscription used to pay for the savings plan. For more information about permissions and roles required to purchase a savings plan, see [Who can buy a savings plan](#who-can-buy-a-savings-plan).
    - **Apply to any eligible resource** – scope of resources that are eligible for savings plan benefits. For more information, see [Savings plan scopes](scope-savings-plan.md).
    - **Term length** - One year or three years.
    - **Hourly commitment** – Amount available through the savings plan each hour. In the Azure portal, up to 10 recommendations may be presented. Recommendations are scope-specific. Azure doesn't currently provide recommendations for management groups. Each recommendation includes:
        - An hourly commitment.
        - The potential savings percentage compared to on-demand costs for the commitment.
        - The percentage of the selected scopes compute usage that would be covered by new savings plan. It includes the commitment amount plus any other previously purchased savings plan or reservation.
    - **Billing frequency** – **All upfront** or **Monthly**. The total cost of the savings plan will be the same regardless of the selected frequency.

### Purchase with the Savings Plan Order Alias - Create API

Buy savings plans by using Azure RBAC permissions or with permissions on your billing scope. When using the [Savings Plan Order Alias - Create](/rest/api/billingbenefits/savings-plan-order-alias/create) REST API, the format of the `billingScopeId` in the request body is used to control the permissions that are checked.

#### To purchase using Azure RBAC permissions

- You must be an Owner of the subscription that you plan to use, specified as `billingScopeId`.
- The `billingScopeId` property in the request body must use the `/subscriptions/10000000-0000-0000-0000-000000000000` format.

#### To purchase using billing permissions

Permission needed to purchase varies by the type of account that you have.

- For Enterprise agreement customers, you must be an EA admin with write permissions.
- For Microsoft Customer Agreement (MCA) customers, you must be a billing profile contributor or higher.
- For Microsoft Partner Agreement partners, only Azure RBAC permissions are currently supported

The `billingScopeId` property in the request body must use the `/providers/Microsoft.Billing/billingAccounts/{accountId}/billingSubscriptions/10000000-0000-0000-0000-000000000000` format.

## Cancel, exchange, or refund savings plans

You can't cancel, exchange, or refund savings plans.

### Buy savings plans with monthly payments

You can pay for savings plans with monthly payments. Unlike an up-front purchase where you pay the full amount, the monthly payment option divides the total cost of the savings plan evenly over each month of the term. The total cost of up-front and monthly savings plans is the same and you don't pay any extra fees when you choose to pay monthly.

If savings plan is purchased using an MCA, your monthly payment amount may vary, depending on the current month's market exchange rate for your local currency.

## View payments made

You can view payments that were made using APIs, usage data, and cost analysis. For savings plans paid for monthly, the frequency value is shown as  **recurring** in the usage data and the Savings Plan Charges API. For savings plans paid up front, the value is shown as **onetime**.

Cost analysis shows monthly purchases in the default view. Apply the **purchase** filter to **Charge type** and **recurring** for **Frequency** to see all purchases. To view only savings plans, apply a filter for **Savings Plan**.

:::image type="content" source="./media/buy-savings-plan/cost-analysis-savings-plan-costs.png" alt-text="Screenshot showing saving plan costs in cost analysis." lightbox="./media/buy-savings-plan/cost-analysis-savings-plan-costs.png" :::

## Reservation trade ins and refunds

Unlike reservations, you can't return or exchange savings plans.

You can trade in one or more reservations for a savings plan. When you trade in reservations, the hourly commitment of the new savings plan must be greater than the leftover payments that are canceled for the returned reservations. There are no other limits or fees for trade ins. You can trade in a reservation that's paid for up front to purchase a new savings plan that's billed monthly. However, the lifetime value of the new savings plan must be greater than the prorated value of the reservations traded in.

## Savings plan notifications

Depending on how you pay for your Azure subscription, email savings plan notifications are sent to the following users in your organization. Notifications are sent for various events including:

- Purchase
- Upcoming savings plan expiration - 30 days before
- Expiry - 30 days before
- Renewal
- Cancellation
- Scope change

For customers with EA subscriptions:

- Notifications are sent to EA administrators and EA notification contacts.
- Azure RBAC owner of the savings plan receives all notifications.

For customers with MCA subscriptions:

- The purchaser receives a purchase notification.
- Azure RBAC owner of the savings plan receives all notifications.

For Microsoft Partner Agreement partners:

- Notifications are sent to the partner.

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

- To learn how to manage a savings plan, see [Manage Azure savings plans](manage-savings-plan.md).
- To learn more about Azure Savings plans, see the following articles:
    - [What are Azure Savings plans?](savings-plan-compute-overview.md)
    - [Manage Azure savings plans](manage-savings-plan.md)
    - [How saving plan discount is applied](discount-application.md)
    - [Understand savings plan costs and usage](utilization-cost-reports.md)
    - [Software costs not included with Azure savings plans](software-costs-not-included.md)