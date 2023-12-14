---
title: How an Azure reservation discount is applied
description: This article helps you understand how reserved instance discounts are generally applied.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 08/14/2023
ms.author: banders
---

# How a reservation discount is applied

This article helps you understand how reserved instance discounts are generally applied. The reservation discount applies to the resource usage matching the attributes you select when you buy the reservation. Attributes include the scope where the matching VMs, SQL databases, Azure Cosmos DB, or other resources run. For example, if you want a reservation discount for four Standard D2 virtual machines in the West US region, then select the subscription where the VMs are running.

A reservation discount is "*use-it-or-lose-it*". If you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are *lost*.

For example, you might later create a resource and have a matching reservation that is underutilized. The reservation discount automatically applies to the new matching resource.

If the virtual machines are running in different subscriptions within your enrollment/account, then select the scope as shared. Shared scope allows the reservation discount to be applied across subscriptions. You can change the scope after you buy a reservation. For more information, see [Manage Azure Reservations](manage-reserved-vm-instance.md). You can also use the management group scope. It applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.

A reservation discount only applies to resources associated with Enterprise, Microsoft Customer Agreement, CSP, or subscriptions with pay-as-you go rates. Resources that run in a subscription with other offer types don't receive the reservation discount.

The savings that are presented as part of [reservation recommendations](reserved-instance-purchase-recommendations.md) are the savings that are calculated in addition to your negotiated, or discounted (if applicable) prices.

When you purchase a reservation, the benefit is applied at reservation prices. On very rare occasions, you may have some pay-as-you-go rates that are lower than the reservation rate. In these cases, Azure uses the reservation rate to apply benefit. When you purchase a reservation for an SKU where the reservation rate is lower than the pay-as-you-go rate, but because of instance size flexibility, the reservation is also applied to the SKU which had more Azure consumption discount (ACD) than the reservation. 

## When the reservation term expires

At the end of the reservation term, the billing discount expires, and the resources are billed at the pay-as-you go price. By default, the reservations are not set to renew automatically. You can choose to enable automatic renewal of a reservation by selecting the option in the renewal settings. With automatic renewal, a replacement reservation will be purchased upon expiry of the existing reservation. By default, the replacement reservation has the same attributes as the expiring reservation, optionally you change the billing frequency, term, or quantity in the renewal settings. Any user with owner access on the reservation and the subscription used for billing can set up renewal.  

## Discount applies to different sizes

When you buy a reservation, the discount can apply to other instances with attributes that are within the same size group. This feature is known as instance size flexibility. The flexibility of the discount coverage depends on the type of reservation and the attributes you pick when you buy the reservation.

Service plans:

- Reserved VM Instances: When you buy the reservation and select **Optimized for instance size flexibility**, the discount coverage depends on the VM size you select. The reservation can apply to the virtual machines (VMs) sizes in the same size series group. For more information, see [Virtual machine size flexibility with Reserved VM Instances](../../virtual-machines/reserved-vm-instance-size-flexibility.md).
- Azure Storage reserved capacity: You can purchase reserved capacity for standard Azure Storage accounts in units of 100 TiB or 1 PiB per month. For information about which regions support Azure Storage reserved capacity, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). Azure Storage reserved capacity is available for all access tiers (hot, cool, and archive) and for any replication configuration (LRS, GRS, or ZRS).
- SQL Database reserved capacity: The discount coverage depends on the performance tier you pick. For more information, see [Understand how an Azure reservation discount is applied](understand-reservation-charges.md).
- Azure Cosmos DB reserved capacity: The discount coverage depends on the provisioned throughput. For more information, see [Understand how an Azure Cosmos DB reservation discount is applied](understand-cosmosdb-reservation-charges.md).

## How discounts apply to specific Azure services

Read the following articles that apply to you to learn how discounts apply to a specific Azure service:

- [App Service](reservation-discount-app-service.md)
- [Azure Cache for Redis](understand-azure-cache-for-redis-reservation-charges.md)
- [Azure Cosmos DB](understand-cosmosdb-reservation-charges.md)
- [Azure SQL Edge](discount-sql-edge.md)
- [Database for MariaDB](understand-reservation-charges-mariadb.md)
- [Database for MySQL](understand-reservation-charges-mysql.md)
- [Database for PostgreSQL](../../postgresql/single-server/concept-reserved-pricing.md)
- [Databricks](reservation-discount-databricks.md)
- [Data Explorer](understand-azure-data-explorer-reservation-charges.md)
- [Dedicated Hosts](billing-understand-dedicated-hosts-reservation-charges.md)
- [Disk Storage](understand-disk-reservations.md)
- [Red Hat Linux Enterprise](understand-rhel-reservation-charges.md)
- [Software plans](understand-suse-reservation-charges.md)
- [Storage](understand-storage-charges.md)
- [SQL Database](understand-reservation-charges.md)
- [Azure Synapse Analytics](reservation-discount-azure-sql-dw.md)
- [Virtual machines](../manage/understand-vm-reservation-charges.md)


## Next steps

- [Manage Azure Reservations](manage-reserved-vm-instance.md)
- [Understand reservation usage for your subscription with pay-as-you-go rates](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reservations](reserved-instance-windows-software-costs.md)
