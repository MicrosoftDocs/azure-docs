---
title: Microsoft Customer Agreement Azure usage and charges file terms
description: Learn how to read and understand the sections of the Azure usage and charges CSV for your billing profile.
author: bandersmsft
ms.reviewer: amberb
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 01/13/2023
ms.author: banders
---

# Terms in the Azure usage and charges file for a Microsoft Customer Agreement

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

The Azure usage and charges CSV file contains daily and meter-level usage charges for the current billing period.

To get your Azure usage and charges file, see [View and download Azure usage and charges for your Microsoft Customer Agreement](download-azure-daily-usage.md). It's available in a comma-separated values (.csv) file format that you can open in a spreadsheet application.

Usage charges are the total **monthly** charges on a subscription. The usage charges don't take into account any credits or discounts.

## Changes from Azure EA usage and charges

If you're an EA customer, you'll notice that the terms in the Azure billing profile usage CSV file differ from the terms in the Azure EA usage CSV file. Here's a mapping of EA usage terms to billing profile usage terms:

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

## Detailed terms and descriptions

The following  terms are shown in the Azure usage and charges file.

Term | Description
--- | ---
invoiceId | The unique document ID listed on the invoice PDF
previousInvoiceId | Reference to an original invoice if this line item is a refund
billingAccountName | Name of the Billing account
billingAccountId | Unique identifier for the root billing account
billingProfileId | Name of the billing profile that is accruing the charges that are invoiced
billingProfileName | Unique identifier for the Billing Profile that is accruing the charges that are invoiced
invoiceSectionId | Unique identifier for the Invoice section
invoiceSectionName | Name of the invoice section
costCenter | The cost center defined on the subscription for tracking costs (only available in open billing periods)
billingPeriodStartDate | The start date of the billing period for which the invoice is generated
billingPeriodEndDate | The end date of the billing period for which the invoice is generated
servicePeriodStartDate | The start date of the rating period that has defined and locked pricing for the consumed or purchased service
servicePeriodEndDate | The end date of the rating period that has defined and locked pricing for the consumed or purchased service
date | For Azure and Marketplace usage-based charges, it's the rating date. For one-time purchases (Reservations, Marketplace) or fixed recurring charges (support offers), it's the purchase date.
serviceFamily | Service family that the service belongs to
productOrderId | Unique identifier for the product order
productOrderName | Unique name for the product order
consumedService | Name of the consumed service
meterId | The unique identifier for the meter
meterName | The name of the meter
meterCategory | Name of the classification category for the meter. For example, *Cloud services*, *Networking*, etc.
meterSubCategory | Name of the meter subclassification category
meterRegion | Name of the region where the meter for the service is available. Identifies the location of the data center for certain services that are priced based on data center location.
offer | Name of the offer purchased
PayGPrice | Retail price for the resource.
PricingModel | Identifier indicating how the meter is priced (Values: On Demand, Reservation, Spot)
productId | Unique identifier for the product accruing the charges
product | Name of the product accruing the charges
subscription ID | Unique identifier for the subscription accruing the charges
subscriptionName | Name of the subscription accruing the charges
reservationId | Unique identifier for the purchased reservation instance
reservationName | Name of the purchased reservation instance
publisherType | Microsoft, Azure, Marketplace, and AWS costs.  Values are `Microsoft` for Microsoft Customer Agreement accounts and `Azure` for EA and pay-as-you-go accounts.
publisherName | Publisher for Marketplace services
resourceGroupId | Unique identifier for the resource group associated with the resource
resourceGroupName | Name of the resource group associated with the resource
resourceId | Unique identifier for the resource instance
resourceType | Type of resource instance
resourceLocation | Identifies the location of the data center where the resource is running.
location | Normalized location of the resource if different resource locations are configured for the same regions
quantity | The number of units purchased or consumed
unitOfMeasure | The unit of measure for billing for the service. For example, compute services are billed per hour.
chargeType | The type of charge. Values: <br><br>• AsCharged-Usage - Charges that are accrued based on usage of an Azure service. It includes usage against VMs that aren't charged because of reserved instances.<br><br>• AsCharged-PurchaseMarketplace - Either one-time or fixed recurring charges from Marketplace purchases<br><br>• AsCharged-UsageMarketplace - Charges for Marketplace services that are charged based on units of consumption
isAzureCreditEligible | Flag that indicates if the charge against the service is eligible to be paid for using Azure credits (Values: True, False)
serviceInfo1 | Service-specific metadata
serviceInfo2 | Legacy field that captures optional service-specific metadata
additionalInfo | Other service-specific metadata.
tags | Tags you assign to the resource

### Make sure that charges are correct

If you want to make sure that the charges in your detailed usage file are correct, you can verify them. See [Understand the charges on your billing profile's invoice](review-customer-agreement-bill.md)

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [View and download your Microsoft Azure invoice](download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](download-azure-daily-usage.md)
