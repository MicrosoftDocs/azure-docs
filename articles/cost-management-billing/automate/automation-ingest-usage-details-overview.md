---
title: Ingest cost details data
titleSuffix: Microsoft Cost Management
description: This article explains how to use cost details records to correlate meter-based charges with the specific resources responsible for the charges. Then you can properly reconcile your bill.
author: bandersmsft
ms.author: banders
ms.date: 05/30/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Ingest cost details data

Cost details (formerly referred to as usage details) are the most granular cost records that are available across Microsoft. Cost details records allow you to correlate Azure meter-based charges with the specific resources responsible for the charges so that you can properly reconcile your bill. The data also includes charges associated with New Commerce products like Microsoft 365 and Dynamics 365 that are invoiced along with Azure. Currently, only Partners can purchase New Commerce non-Azure products. To learn more, see [Understand cost management data](../costs/understand-cost-mgt-data.md). 

This document outlines the main solutions available to you as you work with cost details data. You might need to download your cost data to merge it with other datasets. Or you might need to integrate cost data into your own systems. There are different options available depending on the amount of data involved.

You must have Cost Management permissions at the appropriate scope to use APIs and tools in any case. For more information, see [Assign access to data](../costs/assign-access-acm-data.md) and [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

## How to get cost details

You can get cost details programmatically with [exports](../costs/tutorial-export-acm-data.md) or the [Cost Details](/rest/api/cost-management/generate-cost-details-report) report. To learn more about which solutions are best for your scenarios, see [Choose a cost details solution](usage-details-best-practices.md).

For Azure portal download instructions, see [How to get your Azure billing invoice and daily usage data](../manage/download-azure-invoice-daily-usage-date.md). If you have a small cost details dataset that you maintain from one month to another, you can open your CSV file in Microsoft Excel or another spreadsheet application.

## Cost details data format

The Azure billing system uses cost details records at the end of the month to generate your bill. Your bill is based on the net charges that were accrued, by meter. Cost records contain daily rated usage based on negotiated rates, purchases (for example, reservations, Marketplace fees), and refunds for the specified period. Fees don't include credits, taxes, or other charges or discounts.

The following table shows the charges that are included in your cost details dataset for each account type.

| **Account type** | **Azure usage** | **Marketplace usage** | **Purchases** | **Refunds** |
| --- | --- | --- | --- | --- |
| Enterprise Agreement (EA) | ✔ | ✔ | ✔ | ✘ |
| Microsoft Customer Agreement (MCA) | ✔ | ✔ | ✔ | ✔ |
| Pay-as-you-go (PAYG) | ✔ | ✔ | ✘ | ✘ |

A single Azure resource often has multiple meters emitting charges. For example, a VM might have both Compute and Networking related meters.

To understand the fields that are available in cost details records, see [Understand cost details fields](understand-usage-details-fields.md).

To learn more about Marketplace orders (also known as external services), see [Understand your Azure external service charges](../understand/understand-azure-marketplace-charges.md).

### A single resource might have multiple records per day

Azure resource providers emit usage and charges to the billing system and populate the Additional Info field of the usage records. Occasionally, resource providers might emit usage for a given day and stamp the records with different datacenters in the Additional Info field of the cost records. It can cause multiple records for a meter or resource to be present in your cost file for a single day. In that situation, you aren't overcharged. The multiple records represent the full cost of the meter for the resource on that day.

### Pricing behavior in cost and usage details

The cost and usage details file exposes multiple price points. They're outlined as follows.

**PAYGPrice:** - The market price, also referred to as retail or list price, for a given product or service.
  - In all consumption usage records, `PayGPrice` reflects the market price of the meter, regardless of any benefit plan, such as reservations or savings plan, applied on that line item.
  - Purchases and refunds reflect the market price for that transaction.

In benefit-related records, where the `PricingModel` is `Reservations` or `SavingsPlan`, *PayGPrice* reflects the market price of the original meter, displaying what the price would have been without the application of a benefit.

**UnitPrice:** - The price for a given product or service inclusive of any negotiated discount that is applied on top of the `PaygPrice` based on your contract.
  - In all consumption usage records, `UnitPrice` reflects the negotiated meter price based on your contract, regardless of any benefit plan such as reservations or savings plan, applied on that line item.
  - Purchases and refunds reflect the negotiated price for that transaction.

**EffectivePrice** - The actual rate that you end up paying per unit for a given product or service. It's the price that should be used with the quantity to calculate charges (`price * quantity`) and reconcile them. The price considers the following scenarios:
  - Tiered pricing: For example: USD 10 for the first 100 units, USD 8 for the next 100 units.
  - Reservation/savings plan actual cost record: In the actual cost report, the effective price for a usage record is 0 because the resource, for example VM, is covered by prepaid commitment. The effective price for a purchase record shows the price of the purchase transaction.
  - Reservation/savings plan amortized cost record: In the amortized cost report, the effective price for a usage record is the prorated hourly price of the reservation/savings plan.

**Quantity:** - The number of units consumed per day by the given product or service. It relates to the unit of measure (UOM) used in actual resource usage.

## Reconcile charges

When you reconcile costs with your price sheet or invoice, the price points and quantity in cost and usage details file might differ in scale and granularity from these other documents.

For customers with an Enterprise Agreement, the cost and usage details might have a UOM (for example, per day vs per month) that is different from the invoice or price sheet. Cost and usage details is presented at a daily granularity, while the invoice is aggregated at a monthly, quarterly or a different custom billing period grain.

The following example illustrates how the same monthly total cost is represented differently across multiple reports for the same resource. This example considers a sample month of 31 days, and the invoice is generated every month.

| **Report** | **Unit of measure** | **Unit price** | **Total monthly quantity** | **Total month cost** | **Daily quantity** | **Daily cost** |
| --- | --- | --- | --- | --- | --- | --- | 
| Invoice | 1/day | 100 | 31 | 3100 | N/A | N/A | 
| Cost and usage details | 1/month | 3100 | 1 | 3100 | 0.032257961<sup> 1 </sup>| 100 | 
| Price sheet | 1/day | 100 | N/A | N/A | N/A | N/A |

<sup> 1 </sup> Since the total monthly quantity is 1 unit, the daily quantity is estimated to be 1/31 = 0.03225796

**Price Sheet unit of measure behavior** - The prices shown on the price sheet are the prices that you receive from Azure. They're scaled to a specific unit of measure.

**Cost details unit of measure behavior** - The unit of measure associated with the usage quantities and pricing seen in cost details aligns with actual resource usage.

#### Example pricing scenarios seen in cost details for a resource

Here are some example scenarios that show how an actual cost report or amortized cost report might look like.

Sample actual cost report:

| **MeterId** | **PricingModel** | **ChargeType** | **Quantity** | **PAYGPrice** | **UnitPrice** | **EffectivePrice** | **UnitOfMeasure** | **Cost** | **Notes** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xxxxxxxx-xxxx- xxxx - xxxx -xxxxxxxxxxx | OnDemand | Usage | 24 | 1 | 0.8 | 0.8 | 1 hour | 19.2 | Manual calculation of the actual charge: multiply 24 \* 0.8 \* 1 hour. |
| xxxxxxxx-xxxx- xxxx - xxxx -xxxxxxxxxxx | Reservations/SavingsPlan | Usage | 24 | 1 | 0.8 | 0 | 1 hour | 0 | Manual calculation of the actual charge: multiply 24 \* 0 \* 1 hour. |
| xxxxxxxx-xxxx- xxxx - xxxx -xxxxxxxxxxx | Reservations | Purchase | 15 | 120 | 120 | 120 | 1 hour | 1800 | Manual calculation of the actual charge: multiply 15 \* 120 \* 1 hour. |

Sample amortized cost report:

| **MeterId** | **PricingModel** | **ChargeType** | **Quantity** | **PAYGPrice** | **UnitPrice** | **EffectivePrice** | **UnitOfMeasure** | **Cost** | **Notes** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xxxxxxxx-xxxx- xxxx - xxxx -xxxxxxxxxxx | OnDemand | Usage | 24 | 1 | 0.8 | 0.8 | 1 hour | 19.2 | Manual calculation of the actual charge: multiply 24 \* 0.8 \* 1 hour. |
| xxxxxxxx-xxxx- xxxx - xxxx -xxxxxxxxxxx | Reservations/SavingsPlan | Usage | 24 | 1 | 0.8 | 0.3 | 1 hour | 7.2 | Manual calculation of the actual charge: multiply 24 \* 0.3 \* 1 hour. |

>[!NOTE]
> - Limitations on `PayGPrice`
>    - For EA customers `PayGPrice` isn't populated when `PricingModel` = `Reservations` or `Marketplace`.
>    - For MCA customers, `PayGPrice` isn't populated when `PricingModel` = `Reservations` or `Marketplace`.
>- Limitations on `UnitPrice`
>    - For EA customers, `UnitPrice` isn't populated when `PricingModel` = `MarketPlace`. If the cost allocation rule is enabled, the `UnitPrice` will be 0 where `PricingModel` = `Reservations`. For more information, see [Current limitations](../costs/allocate-costs.md#current-limitations).
>    - For MCA customers, `UnitPrice` isn't populated when `PricingModel` = `Reservations`.

## Unexpected charges

If you have charges that you don't recognize, there are several things you can do to help understand why:

- Review the invoice that has charges for the resource
- Review your invoiced charges in Cost analysis
- Find people responsible for the resource and engage with them
- Analyze the audit logs
- Analyze user permissions to the resource's parent scope
- To help identify the charges, create an [Azure support request](https://go.microsoft.com/fwlink/?linkid=2083458) 

For more information, see [Analyze unexpected charges](../understand/analyze-unexpected-charges.md).

Azure doesn't log most user actions. Instead, Azure logs resource usage for billing. If you notice a usage spike in the past and you didn't have logging enabled, Azure can't pinpoint the cause. Enable logging for the service that you want to view the increased usage for so that the appropriate technical team can assist you with the issue.

## Related content

- Learn more about [Choose a cost details solution](usage-details-best-practices.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with Exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
- [Understand cost details fields](understand-usage-details-fields.md).
- Learn how to [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).
