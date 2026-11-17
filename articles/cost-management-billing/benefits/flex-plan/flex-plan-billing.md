---
title: Understand Flex Plan billing and charges
titleSuffix: Microsoft Cost Management
description: Learn how upfront and monthly Flex Plan commitments, usage, invoices, and amortized costs work.
author: pri-mittal
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 11/10/2026
ms.author: primittal
---

# Understand Flex Plan billing and charges

Flex Plan billing records show how Microsoft collects the commitment. Cost and usage records show how covered usage consumes the benefit balance.

Billing and benefit consumption are related but separate:

- Billing determines when Microsoft collects the committed amount.
- Benefit consumption determines how covered usage reduces the balance.

## Upfront billing

With upfront billing, Microsoft collects the full commitment at purchase. Covered usage reduces the benefit balance throughout the term, but there are no recurring minimum collection charges.

## Monthly billing

Monthly billing collects the commitment over the plan term while allowing charges to increase when covered usage occurs faster than the scheduled minimum collection.

### Monthly minimum

The monthly minimum is based on the total commitment and the number of months in the term.

For example, a $12,000 commitment over 12 months has a $1,000 monthly minimum.

The monthly minimum is the minimum amount collected for a billing period. It doesn't limit how much of the plan balance covered usage can consume during that period.

### How the charge is calculated

At each monthly close, Microsoft determines whether the minimum collection keeps pace with cumulative covered usage.

The finalized charge is generally the lesser of:

- The remaining uncollected commitment.
- The greater of the monthly minimum or the amount needed for cumulative finalized charges to catch up with cumulative covered usage.

The total collected never exceeds the commitment amount.

### Monthly billing example

Assume:

- Commitment: $12,000
- Term: 12 months
- Monthly minimum: $1,000

| Month | Monthly covered usage | Cumulative usage | Monthly charge | Cumulative charges |
| --- | --- | --- | --- | --- |
| 1 | $800 | $800 | $1,000 | $1,000 |
| 2 | $600 | $1,400 | $1,000 | $2,000 |
| 3 | $1,500 | $2,900 | $1,000 | $3,000 |
| 4 | $1,800 | $4,700 | $1,700 | $4,700 |

In month 4, cumulative usage exceeds the $4,000 that you would have collected through minimum charges. The charge increases to $1,700 so cumulative charges catch up with cumulative usage.

### Example: high early usage followed by lower usage

Both additional examples use a $12,000 commitment over 12 months and a $1,000 monthly minimum. Assume no purchase promotion, taxes, or uncovered pay-as-you-go charges. Covered usage is valued at the applicable Flex Plan benefit prices, not retail prices. The tables show finalized charges rather than provisional charges.

| **Month** | **Monthly covered usage** | **Cumulative usage** | **Monthly charge** | **Cumulative charges** |
| --- | --- | --- | --- | --- |
| 1 | $3,500 | $3,500 | $3,500 | $3,500 |
| 2 | $200 | $3,700 | $1,000 | $4,500 |
| 3 | $300 | $4,000 | $1,000 | $5,500 |
| 4 | $1,500 | $5,500 | $1,000 | $6,500 |

In month 1, the charge increases to $3,500 to catch up with usage. Lower usage in months 2 and 3 doesn't reverse that earlier charge; the monthly minimum still applies.

In month 4, usage is $1,500, but the charge is still $1,000. Cumulative usage is $5,500, and $5,500 was already collected before the month-4 charge. The calculation uses cumulative usage and previously finalized charges, not simply the greater of this month's usage and $1,000.

### Example: final collection below the monthly minimum

This example uses the same $12,000 commitment and $1,000 monthly minimum. Early catch-up charges leave only a small amount to collect later.

| **Month** | **Monthly covered usage** | **Cumulative usage** | **Monthly charge** | **Cumulative charges** |
| --- | --- | --- | --- | --- |
| 1 | $4,500 | $4,500 | $4,500 | $4,500 |
| 2 | $2,500 | $7,000 | $2,500 | $7,000 |
| 3 | $1,500 | $8,500 | $1,500 | $8,500 |
| 4 | $1,200 | $9,700 | $1,200 | $9,700 |
| 5 | $750 | $10,450 | $1,000 | $10,700 |
| 6 | $500 | $10,950 | $1,000 | $11,700 |
| 7 | $200 | $11,150 | $300 | $12,000 |

At the start of month 7, only $300 remains uncollected: $12,000 minus $11,700. The remaining-commitment cap limits the final charge to $300, even though the normal minimum is $1,000. Total collection stops at $12,000.

Completing payment doesn't by itself exhaust the benefit. At this point, covered usage has consumed $11,150, leaving $850 of benefit balance. That balance can cover eligible usage until it is exhausted or the term expires, whichever happens first.

### Early collection and low usage

If covered usage is high, Microsoft can collect the full commitment before the scheduled end of the term. The plan balance can also be exhausted early.

If covered usage remains below the monthly minimum, Microsoft continues collecting the minimum until the full commitment is collected. The last charge can be less than the normal minimum when the remaining uncollected commitment is smaller than the minimum.

Unused benefit balance is forfeited when the term expires, even if covered usage was less than the collected amount.

### Partial billing periods

The first or last service period can contain fewer days than a full calendar month. A minimum charge isn't necessarily prorated solely because the plan starts late in a month. Review the purchase terms and invoice for the exact billing period and amount.

## Purchase and invoice records

When you purchase, the Flex Plan transaction sets up:

- Total commitment amount
- Currency
- Term start and end dates
- Billing frequency
- Flex Plan order and resource identifiers

For a monthly billed plan, invoices include a Flex Plan charge while an amount remains to be collected. The charge is:

- At least the applicable monthly minimum in a normal billing period.
- Higher when cumulative covered usage exceeds cumulative finalized charges.
- Lower than the normal minimum only when a smaller residual amount remains.
- Never more than the remaining uncollected commitment.

## Usage records

Covered usage records identify the Flex Plan benefit that was applied and the amount of balance consumed.

Usage that isn't covered can appear as a separate charge when:

- The product or SKU isn't covered.
- The resource is outside the benefit scope.
- Another benefit doesn't apply.
- The Flex Plan balance is exhausted.
- The Flex Plan has expired or ended.

## Amortized costs

Amortized cost reporting attributes Flex Plan value to the covered usage that receives the benefit. It helps you understand the cost of the subscriptions, resource groups, products, or workloads that consumed the plan, rather than only when Microsoft collected payment.

### How amortized costs work

Microsoft values covered usage at its applicable benefit price and deducts that amount from the Flex Plan balance. Amortized reporting associates the corresponding usage cost with the resource or workload that received the benefit.

For example, if covered usage consumes $800 of plan value, the no-promotion examples in this article attribute $800 to that usage. If two workloads consume $500 and $300, their allocated costs are $500 and $300, respectively.

Allocation follows actual covered usage; it isn't a fixed daily or monthly fraction of the commitment. A month with no covered usage doesn't automatically receive a share of the plan's cost solely because time passed. Unused balance remains available during the active term.

Billing frequency determines when Microsoft collects payment. Upfront billing collects the purchase amount at purchase; monthly billing collects minimum and catch-up charges over time. In either case, amortized reporting explains which usage consumed the benefit. The timing and detail of supporting records can differ.

### Actual cost compared with amortized cost

| **Question** | **Actual cost and invoice charges** | **Amortized cost** |
| --- | --- | --- |
| What does it explain? | When the purchase or monthly charge was billed. | Which covered usage consumed plan value. |
| What determines the amount for a period? | The upfront charge or the finalized minimum and catch-up charges. | The covered usage attributed to the plan during that period. |
| What is it useful for? | Invoice reconciliation and payment tracking. | Workload cost analysis, showback, and chargeback. |
| Does it change what is owed? | Reflects the applicable billing obligation. | No. It is a reporting allocation, not an additional charge. |

Actual and amortized amounts can differ for the same month. Don't add purchase or monthly collection charges to their corresponding amortized allocations when calculating the plan's cost; these are different views of the same commitment.

### Amortized cost example

Use the first three months of the monthly billing example earlier in this article: a $12,000 plan, a 12-month term, and no purchase promotion. The following table compares invoice collection with usage-based cost allocation.

| **Month** | **Finalized invoice charge** | **Covered usage at benefit prices** | **Amortized usage cost** | **Remaining benefit balance** |
| --- | --- | --- | --- | --- |
| 1 | $1,000 | $800 | $800 | $11,200 |
| 2 | $1,000 | $600 | $600 | $10,600 |
| 3 | $1,000 | $1,500 | $1,500 | $9,100 |
| Total / closing balance | $3,000 | $2,900 | $2,900 | $9,100 |

In month 1, the invoice charge is $1,000, but only $800 is attributed to covered usage. In month 3, $1,500 is attributed to usage even though that month's invoice charge is $1,000; earlier collections count toward the cumulative billing calculation.

After three months, Microsoft has collected $3,000 and usage has consumed $2,900. The $100 difference isn't an additional usage charge. The total remaining benefit balance is $9,100, which includes value that isn't yet collected under monthly billing.

### Unused value at the end of the term

If a benefit balance remains when the term expires, the unused value is forfeited. Cost data can include a separate unused-value record for the term. It isn't allocated to a workload that didn't consume the benefit, and it isn't treated as a new unused amount for each quiet day or month.

For example, if a $12,000 no-promotion plan expires after $9,000 of covered usage, $9,000 is attributed to usage and $3,000 remains unused. Review both used and unused value when assessing the plan's overall cost and utilization. Unused value isn't a refund and doesn't remove the obligation to pay the commitment.

### Review and reconcile amortized costs

Use the amortized cost dataset or view available in Cost Management. Identify the Flex Plan by its benefit or plan identifier, select the reporting period, and group the covered usage by the subscription, resource group, product, or workload you want to analyze.

Use actual cost and invoices to reconcile collection. Compare finalized data for the same plan, currency, scope, and reporting period; reporting delays and the timing of adjustments can otherwise make totals appear different. Field names and the presentation of unused value can vary by report or export format.

## Channel-specific billing

Invoice layout and the party receiving the invoice can differ by purchasing channel. The underlying commitment and benefit-consumption records follow the same principles.

## Next steps

- [Manage a Flex Plan](manage-flex-plan.md)
- [Automate Flex Plan operations](automate-flex-plan.md)
- [Troubleshoot Flex Plan](troubleshoot-flex-plan.md)
