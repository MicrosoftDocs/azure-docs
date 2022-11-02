---
title: Buy an Azure savings plan
titleSuffix: Microsoft Cost Management
description: This article helps you buy an Azure savings plan.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 10/12/2022
ms.author: banders
---

# Buy an Azure savings plan

Azure savings plans help you save money by committing to an hourly spend for one-year or three-years plans for Azure compute resources. Saving plans discounts apply to usage from virtual machines, Dedicated Hosts, Container Instances, App Services and Azure Premium Functions. The hourly commitment is priced in USD for Microsoft Customer Agreement customers and local currency for Enterprise customers. Before you enter a commitment to buy a savings plan, be sure to review the following sections to prepare for your purchase.

## Who can buy a savings plan

You can buy a savings plan for an Azure subscription that's of type Enterprise (MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreement (MCA) or Microsoft Partner Agreement.

Savings plan discounts only apply to resources associated with subscriptions purchased through an Enterprise Agreement, Microsoft Customer Agreement, or Microsoft Partner Agreement (MPA).

### Enterprise Agreement customers

-	EA admins with write permissions can directly purchase savings plans from **Cost Management + Billing** > **Savings plan**. No specific permission for a subscription is needed.
-	Subscription owners for one of the subscriptions in the EA enrollment can purchase savings plans from **Home** > **Savings plan**.
-	Enterprise Agreement (EA) customers can limit purchases to EA admins only by disabling the **Add Savings Plan** option in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). Navigate to the **Policies** menu to change settings. 

### Microsoft Customer Agreement (MCA) customers

-	Customers with billing profile contributor permissions and above can purchase savings plans from **Cost Management + Billing** > **Savings plan** experience. No specific permissions on a subscription needed.
-	Subscription owners for one of the subscriptions in the billing profile can purchase savings plans from **Home** > **Savings plan**.
-	To disallow savings plan purchases on a billing profile, billing profile contributors can navigate to the Policies menu under the billing profile and adjust **Azure Savings Plan** option.

### Microsoft Partner Agreement partners

-	Partners can use **Home** > **Savings plan** in the Azure portal to purchase savings plans for their customers.

## Scope savings plans

You can scope a savings plan to a shared scope, management group, subscription, or resource group scopes. Setting the scope for a savings plan selects where the savings plan savings apply. When you scope the savings plan to a resource group, savings plan discounts apply only to the resource group—not the entire subscription.

### Savings plan scoping options

You have four options to scope a savings plan, depending on your needs:

- **Shared scope** - Applies the savings plan discounts to matching resources in eligible subscriptions that are in the billing scope. If a subscription was moved to a different billing scope, the benefit no longer applies to the subscription. It does continue to apply to other subscriptions in the billing scope.
  - For Enterprise Agreement customers, the billing scope is the enrollment. The savings plan shared scope would include multiple Active Directory tenants in an enrollment.
  - For Microsoft Customer Agreement customers, the billing scope is the billing profile.
  - For Microsoft Partner Agreement, the billing scope is a customer.
- **Single subscription scope** - Applies the savings plan discounts to the matching resources in the selected subscription.
- **Management group** - Applies the savings plan discounts to the matching resource in the list of subscriptions that are a part of both the management group and billing scope. To scope a savings plan to a management group, you must have at least read permission on the management group.
- **Single resource group scope** - Applies the savings plan discounts to the matching resources in the selected resource group only.

When savings plan discounts are applied to your usage, Azure processes the savings plan in the following order:

1. Savings plans with a single resource group scope
2. Savings plans with a single subscription scope
3. Savings plans scoped to a management group
4. Savings plans with a shared scope (multiple subscriptions), described previously

You can always update the scope after you buy a savings plan. To do so, go to the savings plan, select **Configuration**, and rescope the savings plan. Rescoping a savings plan isn't a commercial transaction. Your savings plan term isn't changed. For more information about updating the scope, see [Update the scope after you purchase a savings plan](manage-savings-plan.md#change-the-savings-plan-scope).

:::image type="content" source="./media/buy-savings-plan/scope-savings-plan.png" alt-text="Screenshot showing saving plan scope options." lightbox="./media/buy-savings-plan/scope-savings-plan.png" :::

## Discounted subscription and offer types

Savings plan discounts apply to the following eligible subscriptions and offer types.

- Enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P)
- Microsoft Customer Agreement subscriptions.
- Microsoft Partner Agreement subscriptions.

## Purchase savings plans

You can purchase savings plans in the Azure portal.

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
- Upcoming savings plan expiration
- Expiry
- Renewal
- Cancellation
- Scope change

For customers with EA subscriptions:

- Notifications are sent to EA administrators and EA notification contacts.
- Users added to a savings plan using Azure RBAC (IAM) permission don't receive any email notifications.

For customers with MCA subscriptions:

- The purchaser receives a purchase notification.

For Microsoft Partner Agreement partners:

- Notifications are sent to the partner.

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

- [Permissions to view and manage Azure savings plans](permission-view-manage.md)
- [Manage Azure savings plans](manage-savings-plan.md)
