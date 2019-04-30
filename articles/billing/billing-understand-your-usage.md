---
title: Understand your detailed usage and charges | Microsoft Docs
description: Learn how to read and understand your detailed usage and charges
author: bandersmsft
manager: micflan
tags: billing
ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/24/2019
ms.author: banders

---
# Understand the terms in your Azure usage and charges file

The detailed usage and charges file contains daily rated usage based on negotiated rates,
purchases (for example, reservations, Marketplace fees), and refunds for the specified period.
Fees don't include credits, taxes, or other charges or discounts.
The following table covers which charges are included for each account type.

Account type | Azure usage | Marketplace usage | Purchases | Refunds
--- | --- | --- | --- | ---
Enterprise Agreement (EA) | Yes | Yes | Yes | No
Microsoft Customer Agreement (MCA) | Yes | Yes | Yes | Yes
Pay-as-you-go (PAYG) | Yes | No | No | No

To learn more about Marketplace orders (also known as external services), see [Understand your Azure external service charges](billing-understand-your-azure-marketplace-charges.md).

See [How to get your Azure billing invoice and daily usage
data](billing-download-azure-invoice-daily-usage-date.md)
for download instructions.
The usage and charges file is available in a comma-separated values (.csv) file format,
which you can open in a spreadsheet application.

## List of terms and descriptions

The following table describes the important terms used in the latest version of the Azure usage and charges file.
The list covers pay-as-you-go (PAYG), Enterprise Agreement (EA), and Microsoft Customer Agreement (MCA) accounts.

Term | Account type | Description
--- | --- | ---
AccountName | EA | Display name of the enrollment account.
AccountOwnerId | EA | Unique identifier for the enrollment account.
AdditionalInfo | All | Service-specific metadata. For example, an image type for a virtual machine.
BillingAccountId | EA, MCA | Unique identifier for the root billing account.
BillingAccountName | EA, MCA | Name of the billing account.
BillingCurrency | EA, MCA | Currency associated with the billing account.
BillingPeriod | EA | The billing period of the charge.
BillingPeriodEndDate | EA, MCA | The end date of the billing period.
BillingPeriodStartDate | EA, MCA | The start date of the billing period.
BillingProfileId | EA, MCA | Unique identifier of the EA enrollment or MCA billing profile.
BillingProfileName | EA, MCA | Name of the EA enrollment or MCA billing profile.
ChargeType | EA, MCA | Indicates whether the charge represents usage (**Usage**), a purchase (**Purchase**), or a refund (**Refund**).
ConsumedQuantity | PAYG | See Quantity.
ConsumedService | All | Name of the service the charge is associated with.
Cost | EA | See CostInBillingCurrency.
CostCenter | EA, MCA | The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).
CostInBillingCurrency | MCA | Cost of the charge in the billing currency before credits or taxes.
CostInPricingCurrency | MCA | Cost of the charge in the pricing currency before credits or taxes.
Currency | PAYG | See BillingCurrency.
Date | EA, MCA | The usage or purchase date of the charge.
ExchangeRateDate | MCA | Date the exchange rate was established.
ExchangeRatePricingToBilling | MCA | Exchange rate used to convert the cost in the pricing currency to the billing currency.
Frequency | EA, MCA | Indicates whether a charge is expected to repeat. Charges can either happen once (**OneTime**), repeat on a monthly or yearly basis (**Recurring**), or be based on usage (**UsageBased**).
IncludedQuantity | PAYG | The amount of the meter that is included at no charge in your current billing period.
InstanceId | PAGY | See ResourceId.
InvoiceId | EA, MCA | The unique document ID listed on the invoice PDF.
InvoiceSection | MCA | See InvoiceSectionName.
InvoiceSectionId | EA, MCA | Unique identifier for the EA department or MCA invoice section.
InvoiceSectionName | EA, MCA | Name of the EA department or MCA invoice section.
IsAzureCreditEligible | EA, MCA | Indicates if the charge is eligible to be paid for using Azure credits (Values: True, False).
Location | EA, MCA | Datacenter location where the resource is running.
MeterCategory | All | Name of the classification category for the meter. For example, *Cloud services* and *Networking*.
MeterId | All | The unique identifier for the meter.
MeterName | All | The name of the meter.
MeterRegion | All | Name of the datacenter location for services priced based on location. See Location.
MeterSubCategory | All | Name of the meter subclassification category.
OfferId | EA, MCA | Name of the offer purchased.
PartNumber | EA | Identifier used to get specific meter pricing.
PlanName | EA | Marketplace plan name.
PreviousInvoiceId | MCA | Reference to an original invoice if this line item is a refund.
PricingCurrency | MCA | Currency used when rating based on negotiated prices.
Product | MCA | See ProductName.
ProductId | EA, MCA | Unique identifier for the product.
ProductName | EA | Name of the product.
ProductOrderId | EA, MCA | Unique identifier for the product order.
ProductOrderName | EA, MCA | Unique name for the product order.
PublisherName | EA, MCA | Publisher for Marketplace services.
PublisherType | EA, MCA | Type of publisher (Values: firstParty, thirdPartyReseller, thirdPartyAgency).
Quantity | EA, MCA | The number of units purchased or consumed.
Rate | PAYG | See UnitPrice.
ReservationId | EA, MCA | Unique identifier for the purchased reservation instance.
ReservationName | EA, MCA | Name of the purchased reservation instance.
ResourceGroupId | EA, MCA | Unique identifier for the [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) the resource is in.
ResourceGroupName | EA, MCA | Name of the [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) the resource is in.
ResourceId | EA, MCA | Unique identifier of the [Azure Resource Manager](https://docs.microsoft.com/rest/api/resources/resources) resource.
ResourceLocation | EA, MCA | Datacenter location where the resource is running. See Location.
ResourceName | EA | Name of the resource.
ResourceType | MCA | Type of resource instance.
ServiceFamily | EA, MCA | Service family that the service belongs to.
ServiceInfo1 | All | Service-specific metadata.
ServiceInfo2 | All | Legacy field with optional service-specific metadata.
ServicePeriodEndDate | MCA | The end date of the rating period that defined and locked pricing for the consumed or purchased service.
ServicePeriodStartDate | MCA | The start date of the rating period that defined and locked pricing for the consumed or purchased service.
SubscriptionId | All | Unique identifier for the subscription.
SubscriptionName | All | Name of the subscription.
Tags | All | Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](https://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/).
Unit | PAYG | See UnitOfMeasure.
UnitOfMeasure | All | The unit of measure for billing for the service. For example, compute services are billed per hour.
UnitPrice | EA | The price per unit for the charge.
UsageDate | PAYG | See Date.

Note some fields may differ in casing and spacing between account types.
Older versions of pay-as-you-go usage files have separate sections for the statement and daily usage.

## Ensure that your charges are correct

To learn more about detailed usage and charges, read about how to understand your
[pay-as-you-go](./billing-understand-your-bill.md)
or [Microsoft Customer Agreement](billing-mca-understand-your-bill.md) invoice.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [View and download your Microsoft Azure invoice](billing-download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](billing-download-azure-daily-usage.md)
