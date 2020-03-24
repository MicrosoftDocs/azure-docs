---
title: Prepare to buy an Azure reservation
description: Learn about important points before you buy an Azure reservation.
author: bandersmsft
ms.reviewer: yashar
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 03/22/2020
ms.author: banders
---

# Prepare to buy a reservation

Azure Reservations help you save money by committing to one-year or three-years plans for many Azure resources. Before you enter a commitment to buy a reservation, be sure to review the following sections to prepare for your purchase.

## Who can buy a reservation

To buy a plan, you must have a subscription owner role in an Enterprise (MS-AZR-0017P or MS-AZR-0148P) or Pay-As-You-Go subscription (MS-AZR-0003P or MS-AZR-0023P) or Microsoft Customer Agreement subscription. Cloud solution providers can use the Azure portal or [Partner Center](/partner-center/azure-reservations) to purchase Azure Reservations.

Enterprise Agreement (EA) customers can limit purchases to EA admins by disabling the **Add Reserved Instances** option in the EA Portal. EA admins must be a subscription owner for at least one EA subscription to purchase a reservation. The option is useful for enterprises that want a centralized team to purchase reservations for different cost centers. After the purchase, centralized teams can add cost center owners to the reservations. Owners can then scope the reservation to their subscriptions. The central team doesn't need to have subscription owner access where the reservation is purchased.

A reservation discount only applies to resources associated with subscriptions purchased through Enterprise, Cloud Solution Provider (CSP), Microsoft Customer Agreement and individual plans with pay-as-you-go rates.

## Scope reservations

You can scope a reservation to a subscription or resource groups. Setting the scope for a reservation selects where the reservation savings apply. When you scope the reservation to a resource group, reservation discounts apply only to the resource group—not the entire subscription.

### Reservation scoping options

With resource group scoping you have three options to scope a reservation, depending on your needs:

- **Single resource group scope**—Applies the reservation discount to the matching resources in the selected resource group only.
- **Single subscription scope**—Applies the reservation discount to the matching resources in the selected subscription.
- **Shared scope**—Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment. For Microsoft Customer Agreement customers, the billing scope is the billing profile. For individual subscriptions with pay-as-you-go rates, the billing scope is all eligible subscriptions created by the account administrator.

While applying reservation discounts on your usage, Azure processes the reservation in the following order:

1. Reservations that are scoped to a resource group
2. Single scope reservations
3. Shared scope reservations

A single resource group can get reservation discounts from multiple reservations, depending on how you scope your reservations.

### Scope a reservation to a resource group

You can scope the reservation to a resource group when you buy the reservation, or you set the scope after purchase. You must be a subscription owner to scope the reservation to a resource group.

To set the scope, go to the [Purchase reservation](https://ms.portal.azure.com/#blade/Microsoft\_Azure\_Reservations/CreateBlade/referrer/Browse\_AddCommand) page in the Azure portal. Select the reservation type that you want to buy. On the **Select the product that you want to purchase** selection form, change the Scope value to Single resource group. Then, select a resource group.

![Example showing VM reservation purchase selection](./media/prepare-buy-reservation/select-product-to-purchase.png)

Purchase recommendations for the resource group in the virtual machine reservation are shown. Recommendations are calculated by analyzing your usage over the last 30 days. A purchase recommendation is made if the cost of running resources with reserved instances is cheaper than the cost of running resources with pay-as-you-go rates. For more information about reservation purchase recommendations, see [Get Reserved Instance purchase recommendations based on usage pattern](https://azure.microsoft.com/blog/get-usage-based-reserved-instance-recommendations).

You can always update the scope after you buy a reservation. To do so, go to the reservation, click **Configuration**, and rescope the reservation. Rescoping a reservation isn't a commercial transaction. Your reservation term isn't changed. For more information about updating the scope, see [Update the scope after you purchase a reservation](manage-reserved-vm-instance.md#change-the-reservation-scope).

![Example showing a reservation scope change](./media/prepare-buy-reservation/rescope-reservation-resource-group.png)

## Purchase reservations

You can purchase reservations from Azure portal, APIs, PowerShell, CLI. Read the following articles that apply to you when you're ready to make a reservation purchase:

- [App Service](prepay-app-service-isolated-stamp.md)
- [Azure Cache for Redis](../../azure-cache-for-redis/cache-reserved-pricing.md)
- [Cosmos DB](../../cosmos-db/cosmos-db-reserved-capacity.md)
- [Databricks](prepay-databricks-reserved-capacity.md)
- [Data Explorer](../../data-explorer/pricing-reserved-capacity.md)
- [Disk Storage](../../virtual-machines/linux/disks-reserved-capacity.md)
- [Dedicated Host](../../virtual-machines/prepay-dedicated-hosts-reserved-instances.md)
- [Software plans](../../virtual-machines/linux/prepay-suse-software-charges.md)
- [Storage](../../storage/blobs/storage-blob-reserved-capacity.md)
- [SQL Database](../../sql-database/sql-database-reserved-capacity.md)
- [SQL Data Warehouse](prepay-sql-data-warehouse-charges.md)
- [Virtual machines](../../virtual-machines/windows/prepay-reserved-vm-instances.md)

## Next steps

- [Manage Reservations for Azure resources](manage-reserved-vm-instance.md)
