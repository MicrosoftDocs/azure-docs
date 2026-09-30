---
title: How Azure Backup reserved capacity discounts apply
description: Learn how Azure Backup reserved capacity discounts apply to vault-standard backup storage, including eligible usage, unused capacity, and overage charges.
ms.topic: overview
ms.service: azure-backup
ms.date: 09/17/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to understand how reservation discounts for backup storage are applied, so that I can optimize my storage costs and ensure efficient use of my reserved capacity.
---

# How Azure Backup reserved capacity discounts apply

Azure Backup reserved capacity helps you reduce backup storage costs by providing a discount on eligible backup storage. After you purchase reserved capacity, Azure automatically applies the reservation discount to backup storage that matches the reservation terms.

This article explains how Azure applies the discount and what happens when you underuse or exceed your reserved capacity.

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

- [Optimize costs for Azure Backup storage with reserved capacity](backup-azure-reserved-pricing-optimize-cost.md)
- [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)
- [Estimate and understand Azure Backup pricing](azure-backup-pricing.md)

