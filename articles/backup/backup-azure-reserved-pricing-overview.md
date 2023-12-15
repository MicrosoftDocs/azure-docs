---
title: Reservation discounts for Azure Backup storage
description: This article explains about how reservation discounts are applied to Azure Backup storage.
ms.topic: conceptual
ms.service: backup
ms.date: 09/09/2022
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Understand how reservation discounts are applied to Azure Backup storage

Azure Backup enables you to save money on backup storage costs using Reserved capacity pricing. After you purchase reserved capacity, the reservation discount is automatically applied to the backup storage that matches the terms of the reservation. 

>[!Note]
>The reservation discount applies to storage capacity only.

- For more information about Azure Backup Storage reserved capacity, see [Optimize costs for Azure Backup storage with reserved capacity](backup-azure-reserved-pricing-optimize-cost.md).
- For information about Azure Backup storage pricing, see [Azure Backup pricing page](https://azure.microsoft.com/pricing/details/backup/).

## How's the reservation discount applied?

The reserved capacity discount applies to supported backup storage resources on an hourly basis. The reserved capacity discount is a use-it-or-lose-it discount. If you don't have any backup storage that meets the terms of the reservation for a given hour, then you lose a reservation quantity for that hour. You can't carry forward the unused reserved hours.

When you delete the backup storage, the reservation discount automatically applies to another matching backup storage in the specified scope. If there's no matching backup storage in the specified scope, the reserved hours are lost.

## Discount examples

The following examples show how the reserved capacity discount applies, depending on the deployments.

For example, you've purchased 100 TiB of reserved capacity in the *US West 2* region for a *1-year* term. Your reservation is for locally redundant storage (LRS) blob storage in the vault-standard tier.

For the cost of the reservation, you can either pay the full amount up front or pay fixed monthly installments per month for the next 12 months. If you've signed up for a monthly reservation payment plan, you may encounter the following scenarios if you under-use or overuse your reserved capacity.

### Underuse of your capacity

As an example, in each hour within the reservation period, if you used only 80 TiB of your 100 TiB reserved capacity, the remaining 20 TiB isn't applied for that hour and it doesn't get carried forward.

### Overuse of your capacity

As an example, in each hour within the reservation period, if you've used 101 TiB of backup storage capacity, the reservation discount applies to 100 TiB of your data, and the remaining 1 TiB is charged at pay-as-you-go rates for that hour. If in the next hour your usage changes to 100 TiB, then all usage is covered by the reservation.

>[!Note]
>For further support, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Optimize costs for Azure Backup storage with reserved capacity](backup-azure-reserved-pricing-optimize-cost.md).
- [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)

