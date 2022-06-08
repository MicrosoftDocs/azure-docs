---
title: Ingest cost details data
titleSuffix: Azure Cost Management + Billing
description: This article explains how to use cost details records to correlate meter-based charges with the specific resources responsible for the charges so that you can properly reconcile your bill.
author: bandersmsft
ms.author: banders
ms.date: 05/27/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Ingest cost details data

Cost details (formerly referred to as usage details) are the most granular cost records that are available across Microsoft. Cost details records allow you to correlate Azure meter-based charges with the specific resources responsible for the charges so that you can properly reconcile your bill. The data also includes charges associated with New Commerce products like Microsoft 365 and Dynamics 365 that are invoiced along with Azure. Currently, only Partners can purchase New Commerce non-Azure products. To learn more, see [Understand cost management data - LINK NEEDED]().

This document outlines the main solutions available to you as you work with cost details data. You might need to download your cost data to merge it with other datasets. Or you might need to integrate cost data into your own systems. There are different options available depending on the amount of data involved.

You must have Cost Management permissions at the appropriate scope to use APIs and tools in any case. For more information, see [Assign access to data](../costs/assign-access-acm-data.md) and [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

## How to get cost details

You can use [exports](../costs/tutorial-export-acm-data.md) or the [Cost Details API-UNPUBLISHED-UNPUBLISHED](../index.yml) to get cost details programmatically. To learn more about which solutions are best for your scenarios, see [Picking a cost details solution](usage-details-best-practices.md).

For Azure portal download instructions, see [How to get your Azure billing invoice and daily usage data](../manage/download-azure-invoice-daily-usage-date.md). If you have a small cost details dataset that you maintain from one month to another, you can open your CSV file in Microsoft Excel or another spreadsheet application.

## Cost details data format

The Azure billing system uses cost details records at the end of the month to generate your bill. Your bill is based on the net charges that were accrued by meter. Cost records contain daily rated usage based on negotiated rates, purchases (for example, reservations, Marketplace fees), and refunds for the specified period. Fees don't include credits, taxes, or other charges or discounts.

The following table shows the charges that are included in your cost details dataset for each account type.

| **Account type** | **Azure usage** | **Marketplace usage** | **Purchases** | **Refunds** |
| --- | --- | --- | --- | --- |
| Enterprise Agreement (EA) | ✔ | ✔ | ✔ | ✘ |
| Microsoft Customer Agreement (MCA) | ✔ | ✔ | ✔ | ✔ |
| Pay-as-you-go (PAYG) | ✔ | ✔ | ✘ | ✘ |

A single Azure resource often has multiple meters emitting charges. For example, a VM may have both Compute and Networking related meters.

To understand the fields that are available in cost details records, see [Understand cost details fields](understand-usage-details-fields.md).

To learn more about Marketplace orders (also known as external services), see [Understand your Azure external service charges](../understand/understand-azure-marketplace-charges.md).

### A single resource might have multiple records per day

Azure resource providers emit usage and charges to the billing system and populate the Additional Info field of the usage records. Occasionally, resource providers might emit usage for a given day and stamp the records with different datacenters in the Additional Info field of the cost records. It can cause multiple records for a meter or resource to be present in your cost file for a single day. In that situation, you aren't overcharged. The multiple records represent the full cost of the meter for the resource on that day.

### Notes about pricing

If you want to reconcile costs with your price sheet or invoice, note the following information.

**Price Sheet price behavior** - The prices shown on the price sheet are the prices that you receive from Azure. They're scaled to a specific unit of measure. Unfortunately, the unit of measure doesn't always align to the unit of measure where the actual resource usage and charges are emitted.

**Cost details price behavior** - Usage files show scaled information that may not match precisely with the price sheet. Specifically:

- Unit Price - The price is scaled to match the unit of measure where the charges are actually emitted by Azure resources. If scaling occurs, then the price won't match the price seen in the Price Sheet.
- Unit of Measure - Represents the unit of measure where charges are actually emitted by Azure resources.
- Effective Price / Resource Rate - The price represents the actual rate that you end up paying per unit, after discounts are taken into account. It's the price that should be used with the Quantity to do Price \* Quantity calculations to reconcile charges. The price takes into account the following scenarios and the scaled unit price that's also present in the files. As a result, it might differ from the scaled unit price.
  - Tiered pricing - For example: $10 for the first 100 units, $8 for the next 100 units.
  - Included quantity - For example: The first 100 units are free and then $10 for each unit.
  - Reservations
  - Rounding that occurs during calculation – Rounding takes into account the consumed quantity, tiered/included quantity pricing, and the scaled unit price.


## Unexpected charges

If you have charges that you don't recognize, there are several things you can do to help understand why:

- Review the invoice that has charges for the resource
- Review your invoiced charges in Cost analysis
- Find people responsible for the resource and engage with them
- Analyze the audit logs
- Analyze user permissions to the resource's parent scope
- Create an [Azure support request](https://go.microsoft.com/fwlink/?linkid=2083458) to help identify the charges

For more information, see [Analyze unexpected charges](../understand/analyze-unexpected-charges.md).

Azure doesn't log most user actions. Instead, Azure logs resource usage for billing. If you notice a usage spike in the past and you didn't have logging enabled, Azure can't pinpoint the cause. Enable logging for the service that you want to view the increased usage for so that the appropriate technical team can assist you with the issue.

## Next steps

- Learn more about [Picking a cost details solution](usage-details-best-practices.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with Exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
- [Understand cost details fields](understand-usage-details-fields.md).
- Learn how to [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).
