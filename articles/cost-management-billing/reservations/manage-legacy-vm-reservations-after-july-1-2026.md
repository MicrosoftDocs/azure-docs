---
title: Transition guide for retired Azure Reserved VM Instances
description: Learn how to transition from retired Azure Reserved VM Instances (RIs) to Azure savings plans for compute or newer VM series before and after July 1, 2026.
author: onwokolo
ms.author: onwokolo
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 05/01/2026
---

# Transition guide for retired Azure Reserved VM Instances

This guide is for customers with [Azure Reserved Virtual Machine Instances (RIs)](/azure/virtual-machines/prepay-reserved-vm-instances) that will no longer be available for new purchase or renewal starting **July 1, 2026** for select VM series. It helps you understand the impact of these changes and plan next steps to maintain cost predictability and avoid lapses in commitment-based savings.

The guidance focuses on RIs associated with impacted VM series and explains the options available as existing reservations approach expiration, including transitioning to Azure savings plans for compute, or migrating workloads to newer VM series. Existing RIs continue to provide reservation discounts through the end of their term.

This guide covers:

- Impacted VM series and what changes on July 1, 2026
- Recommended options to plan for RI expiration
- Guidance on avoiding unexpected pay-as-you-go charges

By proactively planning for these RI availability changes, you can continue optimizing costs while aligning your workloads with Azure's current pricing and savings options.

## What is changing?

Starting **July 1, 2026**, purchases and renewals are no longer available for the following Azure Reserved VM Instances (RIs):

- **One-year RIs** for the VM series: Av2, Amv2, Bv1, D, Ds, Dv2, Dsv2, F, Fs, Fsv2, G, Gs, Ls, and Lsv2.
- **One-year and three-year RIs** for the VM series: Dv3, Dsv3, Ev3, and Esv3.

## How to identify if you're impacted

### Step 1: Review reservations inventory

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Reservations**.
1. Filter by **Product type**: Virtual Machines.
1. Review **VM family** and **Reservation expiration date**.

You're impacted if the VM family matches the list in the preceding section.

For more information, see [View Azure Reservation purchase and refund transactions](view-purchase-refunds.md).

### Step 2: Validate usage dependency

In **Cost Management + Billing**, complete these steps:

1. Navigate to **Reservations**.
1. Review utilization and active usage.
1. Confirm whether workloads will continue beyond the RI expiration date.

For more information, see [View Azure reservation utilization](reservation-utilization.md).

## What actions to take and when

### Decision guide: RIs expiring before July 1, 2026

If you have an RI that expires before **July 1, 2026**, you have a time-bound decision window.

#### Option 1: Evaluate Azure savings plan for compute as an alternative

Instead of renewing RIs, you can choose to trade in current RIs to [Azure savings plan for compute](../savings-plan/savings-plan-overview.md), which:

- Provides commitment-based savings without tying to a specific VM family or region.
- Covers broader compute usage, including future VM changes.

You should:

- Estimate expected hourly spend eligible for savings plans.
- Determine appropriate commitment term (1-year or 3-year).
- Compare savings plan coverage vs. existing RI utilization.

**Best fit for customers who:**

- Expect VM changes, scaling, or modernization.
- Want flexibility across VM families and regions.
- Prefer spend-based optimization over instance-specific locking.

For more information, see [Self-service trade-in for savings plans](../savings-plan/reservation-trade-in.md).

#### Option 2: Consider modernization alongside commitment decisions

As you evaluate your long-term strategy:

- Assess whether workloads running on the affected VM series should migrate to newer VM SKUs.
- Modernization can:
  - Improve price-performance.
  - Extend access to commitment-based savings via savings plans and reserved instances.
  - Reduce future disruption as older generations continue to age out.

**Best fit for customers who:**

- Have upcoming application refresh cycles.
- Want to improve performance or efficiency.
- Plan to stay optimized beyond the current RI term.

For more information, see [Retired VM sizes migration guide](/azure/virtual-machines/migration/sizes/d-ds-dv2-dsv2-ls-series-migration-guide).

#### Option 3: Renew RIs before July 1, 2026

If you want to continue using these VM series and prefer instance-specific commitments, you can renew a 1-year or 3-year RI before July 1, 2026. Note the following:

- This is the final opportunity to renew RIs for impacted legacy VM series.
- Renewed RIs are honored for their full term, even after July 1, 2026.
- After July 1, no additional renewals or purchases are allowed.
- Review the [VM migration guide](/azure/virtual-machines/migration/sizes/d-ds-dv2-dsv2-ls-series-migration-guide) to confirm VM retirement dates.

**Best fit for customers who:**

- Run stable, predictable workloads on the affected VM series.
- Don't plan near-term modernization.
- Prefer fixed, VM-specific savings over flexibility.

For more information, see [Buy an Azure reservation](prepare-buy-reservation.md).

### Decision guide: RIs expiring after July 1, 2026

If you have an RI that expires after **July 1, 2026**, decide on a long-term optimization strategy before expiration.

#### Option 1: Transition to Azure savings plan for compute

You can:

- Purchase an Azure savings plan for compute that covers eligible compute spend, including workloads currently covered by RIs.
- Maintain commitment-based savings without relying on VM-specific RIs.
- Gain flexibility to change VM sizes, families, or regions over time.

**Best fit for customers who:**

- Want a smooth transition when RIs expire.
- Expect infrastructure changes or scale variability.
- Prefer a single, flexible commitment model.

For more information, see [Buy a savings plan](../savings-plan/buy-savings-plan.md).

#### Option 2: Modernize workloads before RI expiration

You can:

- Migrate workloads from legacy VM generations (v1/v2/v3) to newer VM SKUs.
- Combine modernization with savings plans for better price-performance.
- Reduce long-term exposure to legacy infrastructure timelines.

**Best fit for customers who:**

- Have upcoming application refresh cycles.
- Want to improve performance or efficiency.
- Plan to stay optimized beyond the current RI term.

For more information, see [Retired VM sizes migration guide](/azure/virtual-machines/migration/sizes/d-ds-dv2-dsv2-ls-series-migration-guide).

#### Option 3: Take no action and accept pay-as-you-go pricing

If you take no action:

- Workloads continue running normally.
- Costs might increase once RI coverage ends.
- Optimization opportunities could be missed.

> [!IMPORTANT]
> This should be a conscious decision, not an accidental outcome.

### Best practices: Time the transition intentionally

To succeed:

- Start planning **6–12 months before RI expiration**, not at the expiration date.
- Align RI expiration timing with:
  - Savings plan purchase windows
  - Application modernization milestones
- Work with your Microsoft account team to model cost outcomes.

## Key takeaways

- July 1, 2026 does **not** terminate existing RIs.
- RIs remain valid until their individual expiration dates.
- Action must be taken on impacted RIs to avoid pay-as-you-go rates and continue cost optimization.
- There's no disruption to running workloads; RIs are a billing construct only.

## Related content

- [Azure savings plan for compute overview](../savings-plan/savings-plan-overview.md)
- [Self-service trade-in for savings plans](../savings-plan/reservation-trade-in.md)
- [Buy a savings plan](../savings-plan/buy-savings-plan.md)
- [View Azure reservation utilization](reservation-utilization.md)
- [Retired VM sizes migration guide](/azure/virtual-machines/migration/sizes/d-ds-dv2-dsv2-ls-series-migration-guide)