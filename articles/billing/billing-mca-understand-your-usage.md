---
title: Understand your Azure usage and charges for your billing profile | Microsoft Docs
description: Learn how to read and understand the sections of your detailed usage CSV for your Azure subscription
services: ''
documentationcenter: ''
author: bandersmsft
manager: alherz
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/31/2017
ms.author: banders

---
# Understand terms on your Azure usage and charges

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

The detailed usage charges CSV file contains daily and meter level usage charges for the current billing period.

To get your detailed usage file,
see [Download Azure usage for your billing profile](billing-download-azure-invoice-daily-usage-date.md#Download-usage-for-your-billing-profile).
It’s available in a comma-separated values (.csv) file format that you
can open in a spreadsheet application.

Usage charges are the total **monthly** charges on a subscription. The
usage charges don’t take into account any credits or discounts.

## Changes in the Azure usage and charges CSV

If you were an EA customer, you'll notice that the terms in the billing profile Azure usage CSV file are different than the terms in the EA Azure usage CSV file. Here's a mapping of EA usage terms to billing profile usage terms:

| EA Azure usage CSV | Billing profile Azure usage CSV |
| --- | --- |
| Date | date |
| Month| date |
| Day | date |
| Year | date |
| Product | product |
| MeterId | meterID |
| MeterCategory | meterCategory |
| MeterSubCategory | meterSubCategory |
| MeterRegion | meterRegion |
| MeterName | meterName |
| ConsumedQuantity | quantity |
| ResourceRate | effectivePrice | <!-- this was highlighted -->
| ExtendedCost | cost |
| ResourceLocation | resourceLocation |
| ConsumedService | consumedService |
| InstanceId | instanceId |
| ServiceInfo1 | serviceInfo1 |
| ServiceInfo2 | serviceInfo2 |
| AdditionalInfo | additionalInfo |
| Tags | tags |
| StoreServiceIdentifier | N/A |
| DepartmentName | invoiceSection | <!-- this was highlighted -->
| CostCenter | costCenter |
| UnitOfMeasure | unitofMeasure |
| ResourceGroup | resourceGroup |
| ChargesBilledSeparately | isAzureCreditEligible | <!-- this was highlighted -->

<!-- TO DO: Marketplace CSV? -->

## Detailed terms and descriptions of your detailed usage file

The following sections describe the important terms shown in detailed Azure usage and charges file.

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
servicePeriodStartDate | The start date of the rating period which has defined and locked pricing for the consumed or purchased service
servicePeriodEndDate | The end date of the rating period which has defined and locked pricing for the consumed or purchased service
date | For Azure and Marketplace usage-based charges, this is the rating date. For one-time purchases (Reservations, Marketplace) or fixed recurring charges (support offers), this is the purchase date.
serviceFamily | Service family that the service belongs to
productOrderId | Unique identifier for the product order
productOrderName | Unique name for the product order
consumedService | Name of the consumed service
meterId | The unique identifier for the meter
meterName | The name of the meter
meterCategory | Name of the classification category for the meter. For example, *Cloud services*, *Networking*, etc.
meterSubCategory | Name of the meter sub-classification category
meterRegion | Name of the region where the meter for the service is available. Identifies the location of the data center for certain services that are priced based on data center location.
offer | Name of the offer purchased
productId | Unique identifier for the product accruing the charges (TBD if available in invoiced)
product | Name of the product accruing the charges
subscription ID | Unique identifier for the subscription accruing the charges
subscriptionName | Name of the subscription accruing the charges
reservationId | Unique identifier for the purchased reservation instance
reservationName | Name of the purchased reservation instance
publisherType | Type of publisher (Values: firstParty, thirdPartyReseller, thirdPartyAgency)
publisherName | Publisher for Marketplace services
resourceGroupId | Unique identifier for the resource group associated with the resource
resourceGroupName | Name of the resource group associated with the resource
resourceId | Unique identifier for the resource instance
resourceType | Type of resource instance
resourceLocation | Identifies the location of the data center where the resource is running.
location | Normalized location of the resource if different resource locations are configured for the same regions
quantity | The number of units purchased or consumed
unitOfMeasure | The unit of measure for billing for the service. For example, compute services are billed per hour.
chargeType | The type of charge. Values: <ul><li>AsCharged-Usage: Charges that are accrued based on usage of an Azure service. This includes usage against VMs that are not charged because of reserved instances.</li><li>AsCharged-PurchaseMarketplace: Either one-time or fixed recurring charges from Marketplace purchases</li><li>AsCharged-UsageMarketplace: Charges for Marketplace services that are charged based on units of consumption</li></ul>
isAzureCreditEligible | Flag that indicates if the charge against the service is eligible to be paid for using Azure credits (Values: True, False)
serviceInfo1 | Service-specific metadata
serviceInfo2 | Legacy field that captures optional service-specific metadata
additionalInfo | Additional service-specific metadata.
tags | Tags you assign to the resource

## How do I make sure that the charges in my detailed usage file are correct?
If there is a charge on your detailed usage file that you would like
more details on, see [Understand the charges on your billing profile's invoice](billing-understand-your-bill-mca.md)

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

# Next steps

- [View and download your Microsoft Azure invoice](billing-download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](billing-download-azure-daily-usage.md)
