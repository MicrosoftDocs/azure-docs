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
ms.date: 01/18/2023
ms.author: banders
---

# Buy an Azure savings plan

Azure savings plans help you save money by committing to an hourly spend for one-year or three-year plans for Azure compute resources. Before you enter a commitment to buy a savings plan, review the following sections to prepare for your purchase.

## Who can buy a savings plan

Savings plan discounts only apply to resources associated with subscriptions purchased through an Enterprise Agreement (EA), Microsoft Customer Agreement (MCA), or Microsoft Partner Agreement (MPA). You can buy a savings plan for an Azure subscription that's of type EA (MS-AZR-0017P or MS-AZR-0148P), MCA or MPA. To determine if you're eligible to buy a plan, [check your billing type](../manage/view-all-accounts.md#check-the-type-of-your-account).

### Enterprise Agreement customers

- EA admins with write permissions can directly purchase savings plans from **Cost Management + Billing** > **Savings plan**. No subscription-specific permissions are needed.
- Subscription owners for one of the subscriptions in the enrollment account can purchase savings plans from **Home** > **Savings plan**.

Enterprise Agreement (EA) customers can limit purchases to only EA admins by disabling the Add Savings Plan option in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). Navigate to the **Policies** menu to change settings.

### Microsoft Customer Agreement (MCA) customers

- Customers with billing profile contributor permissions or higher can purchase savings plans from **Cost Management + Billing** > **Savings plan** experience. No subscription-specific permissions are needed.
- Subscription owners for one of the subscriptions in the billing profile can purchase savings plans from **Home** > **Savings plan**.

To disallow savings plan purchases on a billing profile, billing profile contributors can navigate to the **Policies** menu under the billing profile and adjust the Azure Savings Plan option.

### Microsoft Partner Agreement partners

- Partners can use **Home** > **Savings plan** in the [Azure portal](https://portal.azure.com/) to purchase savings plans on behalf of their customers.

## Scope savings plans

Setting the scope for a savings plan selects where the benefits apply.

You have the following options to scope a savings plan, depending on your needs:

- **Single resource group scope** - Applies the savings plan benefit to the eligible resources in the selected resource group only.
- **Single subscription scope** - Applies the savings plan benefit to the eligible resources in the selected subscription.
- **Shared scope** - Applies the savings plan benefit to eligible resources within subscriptions that are in the billing context. If a subscription was moved to different billing context, the benefit will no longer be applied to this subscription and will continue to apply to other subscriptions in the billing context.
  - For Enterprise Agreement customers, the billing context is the enrollment.
  - For Microsoft Customer Agreement customers, the billing scope is the billing profile.
- **Management group** - Applies the savings plan benefit to eligible resources in the list of subscriptions that are a part of both the management group and billing scope. To buy a savings plan for a management group, you must have at least read permission on the management group and be a savings plan owner on the billing subscription.

While applying savings plan benefits to your usage, Azure processes savings plans in the following order:

1. Savings plans with a single resource group scope.
2. Savings plans with a single subscription scope.
3. Savings plans scoped to a management group.
4. Savings plans with a shared scope (multiple subscriptions), described previously.

You can always update the scope after you buy a savings plan. To do so, go to the savings plan, select **Configuration**, and rescope the savings plan. Rescoping a savings plan isn't a commercial transaction, so your savings plan term isn't changed. For more information about updating the scope, see [Update the scope](manage-savings-plan.md#change-the-savings-plan-scope) after you purchase a savings plan.

## Purchase savings plan

You can purchase a savings plan using the [Azure portal](https://portal.azure.com/) and with APIs. You don't need to assign a savings plan to your compute resources, the savings plan benefit is applied automatically to compute usage that matches the savings plan scope. A savings plan purchase covers only the compute part of your usage. For example, for Windows VMs, the usage meter is split into two separate meters. There's a compute meter, which is same as the Linux meter, and a Windows IP meter. The charges that you see when you make the purchase are only for the compute costs. Charges don't include Windows software costs. For more information about software costs, see [Software costs not included with Azure savings plans](software-costs-not-included.md).

### Use savings plan recommendations

You can use savings plan recommendations to help determine the hourly commitment you should purchase.

- Hourly commitment recommendations are shown when you purchase a savings plan in the Azure portal.
- Azure Advisor provides purchase recommendations for individual subscriptions.
- You can use the APIs to get purchase recommendations for both shared scope and single subscription scope. 

For more information, see [Savings plan purchase recommendations](purchase-recommendations.md).

### Buy a savings plan in the Azure portal

1. Sign in to the Azure portal.
2. Select **All services** > **Savings plans**.
3. Select **Add** to purchase a new savings plan.
4. Complete all required fields:
    - **Name** – Friendly name for the new savings plan.
    - **Billing subscription** - Subscription used to pay for the savings plan. For more information about permissions and roles required to purchase a savings plan, see [Who can buy a savings plan](#who-can-buy-a-savings-plan).
    - **Apply to any eligible resource** – scope of resources that are eligible for savings plan benefits. For more information, see [Scope savings plans](#scope-savings-plans).
    - **Term length** - One year or three years.
    - **Hourly commitment** – Amount available through the savings plan each hour. In the Azure portal, up to 10 recommendations may be presented. Recommendations are scope-specific. Azure doesn't currently provide recommendations for management groups. Each recommendation includes:
        - An hourly commitment.
        - The potential savings percentage compared to on-demand costs for the commitment.
        - The percentage of the selected scopes compute usage that would be covered by new savings plan. It includes the commitment amount plus any other previously purchased savings plan or reservation.
    - **Billing frequency** – **All upfront** or **Monthly**. The total cost of the savings plan will be the same regardless of the selected frequency.

### Purchase with the Savings Plan Order Alias - Create API

Buy savings plans by using Azure RBAC permissions or with permissions on your billing scope. When using the [Savings Plan Order Alias - Create](/rest/api/billingbenefits/savings-plan-order-alias/create) REST API, the format of the `billingScopeId` in the request body is used to control the permissions that are checked.

To purchase using Azure RBAC permissions:

- You must be an Owner of the subscription that you plan to use, specified as `billingScopeId`.
- The `billingScopeId` property in the request body must use the `/subscriptions/10000000-0000-0000-0000-000000000000` format.

To purchase using billing permissions:

Permission needed to purchase varies by the type of account that you have.

- For Enterprise agreement customers, you must be an EA admin with write permissions.
- For Microsoft Customer Agreement (MCA) customers, you must be a billing profile contributor or higher.
- For Microsoft Partner Agreement partners, only Azure RBAC permissions are currently supported

The `billingScopeId` property in the request body must use the `/providers/Microsoft.Billing/billingAccounts/{accountId}/billingSubscriptions/10000000-0000-0000-0000-000000000000` format.

## Usage data and savings plan utilization

Your usage data has an effective price of zero for the usage that gets a savings plan benefit. You can see which compute resource received the benefit for each savings plan.

For more information about how savings plan benefits appear in usage data, see [Understand savings plan costs and usage](utilization-cost-reports.md).

## Change a savings plan after purchase

You can make the following types of changes to a savings plan after purchase:

- Savings plan name
- Update savings plan scope
- Permission to access and manage a savings plan
- Auto-renewal

Except for auto-renewal, none of the changes cause a new commercial transaction or change the end date of the savings plan.

You can't make the following types of changes after purchase:

- Hourly commitment
- Term length
- Billing frequency

## Cancel, exchange, or refund savings plans

You can't cancel, exchange, or refund savings plans.

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