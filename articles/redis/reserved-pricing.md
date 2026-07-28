---
title: Prepay for Compute with Reservations - Azure Managed Redis
description: Use reservations to pay in advance for Azure Managed Redis compute resources.
ms.date: 11/12/2025
ms.topic: how-to
ai-usage: ai-assisted
ms.custom:
  - ignite-2024
  - build-2025
  - references_regions
appliesto:
  - ✅ Azure Managed Redis
---

# Use reservations to prepay for Azure Managed Redis compute resources

You can use Azure Managed Redis reservations to reduce costs by prepaying for compute resources. You commit to a cache in exchange for significant compute cost discounts.

You can prepay for compute costs for one or three years. After you purchase a reservation, matching compute charges use reserved rates instead of pay-as-you-go pricing.

You can purchase reservations for a specific Azure region, Redis tier, term, and node quantity. You don't assign reservations to specific cache instances, because existing and new caches automatically receive reserved pricing up to the total reservation size.

You can enable auto-renewal or let the reservation expire and revert to pay-as-you-go pricing. You can pay upfront or monthly. For details, see [Buy a reservation](/azure/cost-management-billing/reservations/prepare-buy-reservation).

For pricing information, see the [Azure Managed Redis pricing page](https://azure.microsoft.com/pricing/details/managed-redis/). Reservations don't cover networking or storage charges.

For details on how Enterprise Agreement (EA) customers and pay-as-you-go customers are charged for reservation purchases, see the following articles:

- [Get Enterprise Agreement and Microsoft Customer Agreement reservation costs and usage](/azure/cost-management-billing/reservations/understand-reserved-instance-usage-ea)
- [Understand Azure reservation usage for your pay-as-you-go rate subscription](/azure/cost-management-billing/reservations/understand-reserved-instance-usage)

## Plan reservations

The following Azure Managed Redis tiers currently support reservations:

| Region name         | Memory optimized | Balanced | Compute optimized | Flash optimized |
| ------------------- | ---------------- | -------- | ---------------- | --------------- |
| Australia Central   | Yes              | Yes      | Yes              | No              |
| Australia Central 2 | Yes              | Yes      | Yes              | No              |
| Australia East      | Yes              | Yes      | Yes              | No              |
| Australia Southeast | Yes              | Yes      | Yes              | No              |
| Austria East        | Yes              | Yes      | Yes              | No              |
| Belgium Central     | Yes              | Yes      | Yes              | No              |
| Brazil South        | Yes              | Yes      | Yes              | No              |
| Brazil Southeast    | Yes              | Yes      | Yes              | No              |
| Canada Central      | Yes              | Yes      | Yes              | No              |
| Canada East         | Yes              | Yes      | Yes              | No              |
| Central US          | Yes              | Yes      | Yes              | No              |
| Chile Central       | Yes              | Yes      | Yes              | No              |
| East Asia           | Yes              | Yes      | Yes              | No              |
| East US             | Yes              | No       | Yes              | No              |
| East US 2           | Yes              | Yes      | Yes              | No              |
| France Central      | Yes              | Yes      | Yes              | No              |
| France South        | Yes              | Yes      | Yes              | No              |
| Germany North       | Yes              | Yes      | Yes              | No              |
| Germany West Central| Yes              | Yes      | Yes              | No              |
| India Central       | Yes              | Yes      | Yes              | No              |
| India South         | Yes              | Yes      | Yes              | No              |
| India West          | Yes              | Yes      | Yes              | No              |
| Indonesia Central   | Yes              | Yes      | Yes              | No              |
| Israel Central      | Yes              | Yes      | Yes              | No              |
| Israel Northwest    | No               | Yes      | Yes              | No              |
| Italy North         | Yes              | Yes      | Yes              | No              |
| Japan East          | Yes              | Yes      | Yes              | No              |
| Japan West          | Yes              | Yes      | Yes              | No              |
| Korea Central       | Yes              | Yes      | Yes              | No              |
| Korea South         | Yes              | Yes      | Yes              | No              |
| Malaysia West       | Yes              | Yes      | Yes              | No              |
| Mexico Central      | Yes              | Yes      | Yes              | No              |
| New Zealand North   | Yes              | Yes      | Yes              | No              |
| North Europe        | Yes              | Yes      | Yes              | No              |
| North Central US    | Yes              | Yes      | Yes              | No              |
| Norway East         | Yes              | Yes      | Yes              | No              |
| Norway West         | Yes              | Yes      | Yes              | No              |
| Poland Central      | Yes              | Yes      | Yes              | No              |
| Qatar Central       | Yes              | Yes      | Yes              | No              |
| South Africa North  | Yes              | Yes      | Yes              | No              |
| South Africa West   | Yes              | Yes      | Yes              | No              |
| South Central US    | Yes              | Yes      | Yes              | No              |
| South East Asia     | Yes              | Yes      | Yes              | No              |
| Spain Central       | Yes              | Yes      | Yes              | No              |
| Sweden Central      | Yes              | Yes      | Yes              | No              |
| Sweden South        | Yes              | Yes      | Yes              | No              |
| Switzerland North   | Yes              | Yes      | Yes              | No              |
| Switzerland West    | Yes              | Yes      | Yes              | No              |
| UAE Central         | Yes              | Yes      | Yes              | No              |
| UAE North           | Yes              | Yes      | Yes              | No              |
| UK South            | Yes              | Yes      | Yes              | No              |
| UK West             | Yes              | Yes      | Yes              | No              |
| West Central US     | Yes              | Yes      | Yes              | No              |
| West Europe         | Yes              | Yes      | Yes              | No              |
| West US             | Yes              | Yes      | Yes              | No              |
| West US 2           | Yes              | Yes      | Yes              | No              |
| West US 3           | Yes              | Yes      | Yes              | No              |

## Buy Azure Managed Redis reservations

To buy a reservation:

- You must have the Owner or Reservation Purchaser role in the Azure subscription.
- For Azure Managed Redis subscriptions, you must enable **Add Reserved Instances** in the [EA portal](https://ea.azure.com/). If that setting is disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Managed Redis reservations. For more information, see [Azure reservations in the Partner Center CSP program](/partner-center/azure-reservations).

### Use the Azure portal to buy reservations

1. In the Azure portal, search for and select **Reservations** > **Add**. You can also go to the [Purchase reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/) page.

1. On the **Purchase reservations** page, select **Azure Cache for Redis and Managed Redis**.

1. On the **Select the product you want to purchase** pane, select your chosen options for **Scope** and **Subscription**.

1. Select your chosen values from the dropdown menus for **Region**, **Term**, and **Billing frequency**.

The following list describes the form fields in detail.

- **Subscription**: The subscription that you use to pay for the reservation. The subscription type must be either:
  - **EA**: Offer numbers MS-AZR-0017P or MS-AZR-0148P. The charges are deducted from the enrollment's Azure prepayment balance or charged as overage.
  - **An individual agreement with pay-as-you-go pricing**: Offer numbers MS-AZR-0003P or MS-AZR-0023P. The charges are billed to the subscription's credit card or invoice.
- **Scope**: The reservation's scope, one of the following options:
  - **Shared**: Applies the reservation discount to cache instances in any subscriptions in your billing context. For EA, the shared scope is the enrollment and includes subscriptions within the enrollment. For pay-as-you-go, the shared scope is all of the pay-as-you-go subscriptions that the account administrator created.
  - **Single subscription**: Applies the reservation discount to cache instances in this subscription.
  - **Single resource group**: Applies the reservation discount to instances in the selected resource group within the subscription.
  - **Management group**: Applies the reservation discount to matching resources in subscriptions that are a part of both the management group and billing scope.
- **Region**: The Azure region for the reservation.
- **Term**: **1 year** or **3 years**.
- **Billing frequency**: **Monthly** or **Upfront**.
- **Recommended quantity**: The recommended number of nodes to reserve in the selected Azure region, tier, and scope. For information about the recommended quantities, select **See details**.

Existing or new caches that match the attributes that you select get the reservation discount. The actual number of instances that get the discount depends on the scope and quantity you select.

1. Select the reservation you want. Note the amount for **Monthly price per node** and the estimated savings.

1. Select **Add to cart**, and then select **View cart** to close the product list pane.

1. On the **Purchase reservations** page, review the reservation details.

1. **Auto-renew** is set to **On** by default, and automatically renews your reservation at the end of the term. You can change it to **Off** at any time before the end of the term.

1. Select **Next: Review + buy**.

1. Review the details for **Additional notes**, **Today's charge**, and **Total cost**. Then select **Buy now**.

You can update the scope of the reservation through the Azure portal, PowerShell, the Azure CLI, or the API.

## Exchange existing reservations with Azure Managed Redis

You can cancel, exchange, or refund reservations (with certain limitations). For more information, see [Self-service exchanges and refunds for Azure reservations](/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations).

## Related content

- [Azure Managed Redis pricing page](https://azure.microsoft.com/pricing/details/managed-redis/)
- [What are Azure reservations?](/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Manage Azure reservations](/azure/cost-management-billing/reservations/manage-reserved-vm-instance)
