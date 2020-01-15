---
title: Understand your detailed usage and charges | Microsoft Docs
description: Learn how to read and understand your detailed usage and charges
author: bandersmsft
manager: micflan
tags: billing
ms.service: cost-management-billing
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
Pay-as-you-go (PAYG) | Yes | Yes | No | No

To learn more about Marketplace orders (also known as external services), see [Understand your Azure external service charges](understand-azure-marketplace-charges.md).

For download instructions, see [How to get your Azure billing invoice and daily usage data](../manage/download-azure-invoice-daily-usage-date.md).
You can open your usage and charges CSV file in Microsoft Excel or another spreadsheet application.

## List of terms and descriptions

The following table describes the important terms used in the latest version of the Azure usage and charges file.
The list covers pay-as-you-go (PAYG), Enterprise Agreement (EA), and Microsoft Customer Agreement (MCA) accounts.

Term | Account type | Description
--- | --- | ---
AccountName | EA, PAYG | Display name of the EA enrollment account or PAYG billing account.
AccountOwnerId<sup>1</sup> | EA, PAYG | Unique identifier for the EA enrollment account or PAYG billing account.
AdditionalInfo | All | Service-specific metadata. For example, an image type for a virtual machine.
BillingAccountId<sup>1</sup> | All | Unique identifier for the root billing account.
BillingAccountName | All | Name of the billing account.
BillingCurrency | All | Currency associated with the billing account.
BillingPeriod | EA, PAYG | The billing period of the charge.
BillingPeriodEndDate | All | The end date of the billing period.
BillingPeriodStartDate | All | The start date of the billing period.
BillingProfileId<sup>1</sup> | All | Unique identifier of the EA enrollment, PAYG subscription, MCA billing profile, or AWS consolidated account.
BillingProfileName | All | Name of the EA enrollment, PAYG subscription, MCA billing profile, or AWS consolidated account.
ChargeType | All | Indicates whether the charge represents usage (**Usage**), a purchase (**Purchase**), or a refund (**Refund**).
ConsumedService | All | Name of the service the charge is associated with.
CostCenter<sup>1</sup> | EA, MCA | The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).
Cost | EA, PAYG | See CostInBillingCurrency.
CostInBillingCurrency | MCA | Cost of the charge in the billing currency before credits or taxes.
CostInPricingCurrency | MCA | Cost of the charge in the pricing currency before credits or taxes.
Currency | EA, PAYG | See BillingCurrency.
Date<sup>1</sup> | All | The usage or purchase date of the charge.
EffectivePrice | All | Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.
ExchangeRateDate | MCA | Date the exchange rate was established.
ExchangeRatePricingToBilling | MCA | Exchange rate used to convert the cost in the pricing currency to the billing currency.
Frequency | All | Indicates whether a charge is expected to repeat. Charges can either happen once (**OneTime**), repeat on a monthly or yearly basis (**Recurring**), or be based on usage (**UsageBased**).
InvoiceId | PAYG, MCA | The unique document ID listed on the invoice PDF.
InvoiceSection | MCA | See InvoiceSectionName.
InvoiceSectionId<sup>1</sup> | EA, MCA | Unique identifier for the EA department or MCA invoice section.
InvoiceSectionName | EA, MCA | Name of the EA department or MCA invoice section.
IsAzureCreditEligible | All | Indicates if the charge is eligible to be paid for using Azure credits (Values: True, False).
Location | MCA | Datacenter location where the resource is running.
MeterCategory | All | Name of the classification category for the meter. For example, *Cloud services* and *Networking*.
MeterId<sup>1</sup> | All | The unique identifier for the meter.
MeterName | All | The name of the meter.
MeterRegion | All | Name of the datacenter location for services priced based on location. See Location.
MeterSubCategory | All | Name of the meter subclassification category.
OfferId<sup>1</sup> | All | Name of the offer purchased.
PartNumber<sup>1</sup> | EA, PAYG | Identifier used to get specific meter pricing.
PlanName | EA, PAYG | Marketplace plan name.
PreviousInvoiceId | MCA | Reference to an original invoice if this line item is a refund.
PricingCurrency | MCA | Currency used when rating based on negotiated prices.
Product | All | Name of the product.
ProductId<sup>1</sup> | MCA | Unique identifier for the product.
ProductOrderId | All | Unique identifier for the product order.
ProductOrderName | All | Unique name for the product order.
PublisherName | All | Publisher for Marketplace services.
PublisherType | All | Type of publisher (Values: **Azure**, **AWS**, **Marketplace**).
Quantity | All | The number of units purchased or consumed.
ReservationId | EA, MCA | Unique identifier for the purchased reservation instance.
ReservationName | EA, MCA | Name of the purchased reservation instance.
ResourceGroup | All | Name of the [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) the resource is in.
ResourceId<sup>1</sup> | All | Unique identifier of the [Azure Resource Manager](https://docs.microsoft.com/rest/api/resources/resources) resource.
ResourceLocation | All | Datacenter location where the resource is running. See Location.
ResourceName | EA, PAYG | Name of the resource.
ResourceType | MCA | Type of resource instance.
ServiceFamily | MCA | Service family that the service belongs to.
ServiceInfo1 | All | Service-specific metadata.
ServiceInfo2 | All | Legacy field with optional service-specific metadata.
ServicePeriodEndDate | MCA | The end date of the rating period that defined and locked pricing for the consumed or purchased service.
ServicePeriodStartDate | MCA | The start date of the rating period that defined and locked pricing for the consumed or purchased service.
SubscriptionId<sup>1</sup> | All | Unique identifier for the Azure subscription.
SubscriptionName | All | Name of the Azure subscription.
Tags<sup>1</sup> | All | Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](https://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/).
Term | All | Displays the term for the validity of the offer. For example: In case of reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is 1 month (SaaS, Marketplace Support). This is not applicable for Azure consumption.
UnitOfMeasure | All | The unit of measure for billing for the service. For example, compute services are billed per hour.
UnitPrice | EA, PAYG | The price per unit for the charge.

_<sup>**1**</sup> Fields used to build a unique ID for a single cost record._

Note some fields may differ in casing and spacing between account types.
Older versions of pay-as-you-go usage files have separate sections for the statement and daily usage.

### List of terms from older APIs
The following table maps terms used in older APIs to the new terms. Refer to the above table for those descriptions.

Old term | New term
--- | ---
ConsumedQuantity | Quantity
IncludedQuantity | N/A
InstanceId | ResourceId
Rate | EffectivePrice
Unit | UnitOfMeasure
UsageDate | Date
UsageEnd | Date
UsageStart | Date


## Ensure charges are correct

To learn more about detailed usage and charges, read about how to understand your
[pay-as-you-go](review-individual-bill.md)
or [Microsoft Customer Agreement](review-customer-agreement-bill.md) invoice.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [View and download your Microsoft Azure invoice](download-azure-invoice.md)
- [View and download your Microsoft Azure usage and charges](download-azure-daily-usage.md)
