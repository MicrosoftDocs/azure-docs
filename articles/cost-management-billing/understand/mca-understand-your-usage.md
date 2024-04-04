---
title: Microsoft Customer Agreement Azure usage and charges file terms
description: Learn how to read and understand the sections of the Azure usage and charges CSV for your billing profile.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: banders
---

# Terms in the Azure usage and charges file for a Microsoft Customer Agreement

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

The Azure usage and charges CSV file contains daily and meter-level usage charges for the current billing period.

To get your Azure usage and charges file, see [View and download Azure usage and charges for your Microsoft Customer Agreement](download-azure-daily-usage.md). It's available in a comma-separated values (.csv) file format that you can open in a spreadsheet application.

Usage charges are the total **monthly** charges on a subscription. The usage charges don't take into account any credits or discounts.

## Detailed terms and descriptions

If you want to see a list of all available terms in the MCA usage file, see [Understand cost details data fields](../automate/understand-usage-details-fields.md).

### Make sure that charges are correct

If you want to make sure that the charges in your detailed usage file are correct, you can verify them. See [Understand the charges on your billing profile's invoice](review-customer-agreement-bill.md)

## Changes from Azure EA usage and charges

If you're an EA customer, notice that the terms in the Azure billing profile usage CSV file differ from the terms in the Azure EA usage CSV file. Here's a mapping of EA usage terms to billing profile usage terms:

| Azure EA usage CSV | Microsoft Customer Agreement Azure usage and charges CSV | Description |
| --- | --- | --- |
| Date | date | Date that the resource was consumed. |
| Month | date | Month that the resource was consumed. |
| Day | date | Day that the resource was consumed. |
| Year | date | Year that the resourced was consumed. |
| Product | product | Name of the product. |
| MeterId | meterID | The unique identifier for the meter. |
| MeterCategory | meterCategory | Name of the classification category for the meter. Same as the service in the Microsoft Customer Agreement Price Sheet. Exact string values differ. |
| MeterSubCategory | meterSubCategory | Azure usage meter subclassification. |
| MeterRegion | meterRegion | Detail required for a service. Useful to find the region context of the resource. |
| MeterName | meterName | Name of the meter. Represents the Azure service deployable resource. |
| ConsumedQuantity | quantity | Measured quantity purchased or consumed. The amount of the meter used during the billing period. |
| ResourceRate | effectivePrice | The price represents the actual rate that you end up paying per unit, after discounts are taken into account. It's the price that should be used with the `Quantity` to do `Price` \* `Quantity` calculations to reconcile charges. The price takes into account the following scenarios and the scaled unit price that's also present in the files. As a result, it might differ from the scaled unit price. |
| ExtendedCost | cost | Cost of the charge in the billing currency before credits or taxes. |
| ResourceLocation | resourceLocation | Location of the used resource's data center. |
| ConsumedService | consumedService | Name of the service. |
| InstanceId | instanceId | Identifier of the resource instance. Shown as a ResourceURI that includes complete resource properties. |
| ServiceInfo1 | serviceInfo1 | Legacy field that captures optional service-specific metadata. |
| ServiceInfo2 | serviceInfo2 | Legacy field with optional service-specific metadata. |
| AdditionalInfo | additionalInfo | Service-specific metadata. For example, an image type for a virtual machine. |
| Tags | tags | Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](https://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/). |
| StoreServiceIdentifier | N/A |  |
| DepartmentName | invoiceSection | `DepartmentName` is the department ID. You can see department IDs in the Azure portal on the **Cost Management + Billing** \> **Departments** page. `invoiceSection` is the MCA invoice section name. |
| CostCenter | costCenter | Cost center associated to the subscription. |
| UnitOfMeasure | unitofMeasure | The unit of measure for billing for the service. For example, compute services are billed per hour. |
| ResourceGroup | resourceGroup | Name of the resource group associated with the resource. |
| ChargesBilledSeparately | isAzureCreditEligible | Indicates if the charge is eligible to be paid for using Azure credits. |

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [View and download your Microsoft Azure invoice](download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](download-azure-daily-usage.md)
