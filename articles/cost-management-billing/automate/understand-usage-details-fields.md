---
title: Understand usage details fields
titleSuffix: Microsoft Cost Management
description: This article describes the fields in the usage data files.
author: bandersmsft
ms.author: banders
ms.date: 01/31/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Understand cost details fields

This document describes the cost details (formerly known as usage details) fields found in files from using [Azure portal download](../understand/download-azure-daily-usage.md), [Exports](../costs/tutorial-export-acm-data.md) from Cost Management, or the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API. For more information about cost details best practices, see [Choose a cost details solution](usage-details-best-practices.md).

## Migration to new cost details formats

If you're using an older cost details solution and want to migrate to Exports or the Cost Details API, read the following articles.

- [Migrate from Enterprise Usage Details APIs](migrate-ea-usage-details-api.md)
- [Migrate from EA to MCA APIs](../costs/migrate-cost-management-api.md)
- [Migrate from Consumption Usage Details API](migrate-consumption-usage-details-api.md)

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

## List of fields and descriptions

The following table describes the important terms used in the latest version of the cost details file. The list covers pay-as-you-go (also called Microsoft Online Services Program), Enterprise Agreement (EA), Microsoft Customer Agreement (MCA), and Microsoft Partner Agreement (MPA) accounts. 

MPA accounts have all MCA terms, in addition to the MPA terms, as described in the following table. To identify what account type you are, see [supported Microsoft Azure offers](../costs/understand-cost-mgt-data.md#supported-microsoft-azure-offers).

| Term | Account type | Description |
| --- | --- | --- |
|AccountId|EA, pay-as-you-go|Unique identifier for the EA enrollment account.|
| AccountName | EA, pay-as-you-go | Display name of the EA enrollment account or pay-as-you-go billing account. |
| AccountOwnerId¹ | EA, pay-as-you-go | The email ID of the EA enrollment account owner. |
| AdditionalInfo¹  | All | Service-specific metadata. For example, an image type for a virtual machine. |
| AvailabilityZone | External account | Valid only for cost data obtained from the cross-cloud connector. The field displays the availability zone in which the AWS service is deployed. |
| BenefitId¹ | EA, MCA | Unique identifier for the purchased savings plan instance. |
| BenefitName | EA, MCA | Unique identifier for the purchased savings plan instance. |
| BillingAccountId¹ | All | Unique identifier for the root billing account. |
| BillingAccountName | All | Name of the billing account. |
| BillingCurrency | All | Currency associated with the billing account. |
| BillingCurrencyCode | All | See BillingCurrency. |
| BillingPeriod | EA, pay-as-you-go | The billing period of the charge. |
| BillingPeriodEndDate | All | The end date of the billing period. |
| BillingPeriodStartDate | All | The start date of the billing period. |
| BillingProfileId¹ | All | Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS⁴ consolidated account. |
| BillingProfileName | All | Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS⁴ consolidated account. |
| ChargeType | All | Indicates whether the charge represents usage (**Usage**), a purchase (**Purchase**), or a refund (**Refund**). |
| ConsumedService | All | Name of the service the charge is associated with. |
| CostCenter¹ | EA, MCA | The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts). |
| Cost | EA, pay-as-you-go | See CostInBillingCurrency. |
| CostAllocationRuleName | EA, MCA | Name of the Cost Allocation rule that's applicable to the record. |
| CostInBillingCurrency | EA, MCA | Cost of the charge in the billing currency before credits or taxes. |
| CostInPricingCurrency | MCA | Cost of the charge in the pricing currency before credits or taxes. |
| costInUsd | MCA | Cost of the charge in USD currency before credits or taxes. |
| Currency | EA, pay-as-you-go | See `BillingCurrency`. |
| CustomerName | MPA | Name of the Microsoft Entra tenant for the customer's subscription. |
| CustomerTenantId | MPA | Identifier of the Microsoft Entra tenant of the customer's subscription. |
| Date¹ | All | The usage or purchase date of the charge. |
| EffectivePrice² ³ | All | The price for a given product or service that represents the actual rate that you end up paying per unit. |
| ExchangeRateDate | MCA | Date the exchange rate was established. |
| ExchangeRatePricingToBilling | MCA | Exchange rate used to convert the cost in the pricing currency to the billing currency. |
| Frequency | All | Indicates whether a charge is expected to repeat. Charges can either happen once (**OneTime**), repeat on a monthly or yearly basis (**Recurring**), or be based on usage (**UsageBased**). |
| InstanceId | EA, pay-as-you-go | Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource. |
| InvoiceId | pay-as-you-go, MCA | The unique document ID listed on the invoice PDF. |
| InvoiceSection | MCA | See `InvoiceSectionName`. |
| InvoiceSectionId¹ | EA, MCA | Unique identifier for the EA department or MCA invoice section. |
| InvoiceSectionName | EA, MCA | Name of the EA department or MCA invoice section. |
| IsAzureCreditEligible | All | Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`). |
| Location | MCA | The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, `US East`. |
| MeterCategory | All | Name of the classification category for the meter. For example, _Cloud services_ and _Networking_. Purchases and Marketplace usage might be shown as blank or `unassigned`. |
| MeterId¹ | All | The unique identifier for the meter. |
| MeterName | All | The name of the meter. Purchases and Marketplace usage might be shown as blank or `unassigned`.|
| MeterRegion | All | The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter.<br>**Note**: The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated. |
| MeterSubCategory | All | Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or `unassigned`.|
| OfferId¹ | EA, pay-as-you-go | Name of the Azure offer, which is the type of Azure subscription that you have. For more information, see supported [Microsoft Azure offer details](https://azure.microsoft.com/support/legal/offer-details/). |
| pay-as-you-goPrice² ³| All | The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details). |
| PartnerEarnedCreditApplied | MPA | Indicates whether the partner earned credit was applied. |
| PartnerEarnedCreditRate | MPA | Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access. |
| PartnerName | MPA | Name of the partner Microsoft Entra tenant. |
| PartnerTenantId | MPA | Identifier for the partner's Microsoft Entra tenant. |
| PartNumber¹ | EA, pay-as-you-go | Identifier used to get specific meter pricing. |
| paygCostInBillingCurrency | MCA | The amount of Pay-As-You-Go (PayG) cost before tax in billing currency. You can compute `paygCostInBillingCurrency` by multiplying `PayGPrice`, `quantity` and `exchangeRatePricingToBilling`.  |
| paygCostInUsd | MCA | The amount of Pay-As-You-Go (PayG) cost before tax in USD currency. |
| PlanName | EA, pay-as-you-go | Marketplace plan name. |
| PreTaxCost| EA, pay-as-you-go | Cost of the charge before credits or taxes. You can compute `PreTaxCost` by multiplying `ResourceRate` with `UsageQuantity`. |
| PreviousInvoiceId | MCA | Reference to an original invoice if the line item is a refund. |
| PricingCurrency | MCA | Currency used when rating based on negotiated prices. |
| PricingModel | All | Identifier that indicates how the meter is priced. (Values: `OnDemand`, `Reservation`, `Spot`, and `SavingsPlan`) |
| ProductName | All | Name of the product. |
| ProductId¹ | MCA | Unique identifier for the product. |
| ProductOrderId | All | Unique identifier for the product order. |
| ProductOrderName | All | Unique name for the product order. |
| Provider | MCA | Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS⁴. |
| PublisherId | MCA | The ID of the publisher. It's only available after the invoice is generated. |
| PublisherName | All | The name of the publisher. For first-party services, the value should be listed as `Microsoft` or `Microsoft Corporation`.  |
| PublisherType | All |Supported values: **Microsoft**, **Azure**, **AWS**⁴, **Marketplace**. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`. |
| Quantity³ | All | The number of units used by the given product or service for a given day. |
| ResellerName | MPA | The name of the reseller associated with the subscription. |
| ResellerMpnId | MPA | ID for the reseller associated with the subscription. |
| ReservationId¹ | EA, MCA | Unique identifier for the purchased reservation instance. |
| ReservationName | EA, MCA | Name of the purchased reservation instance. |
| ResourceGroup | All | Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, **Others**, or **Not applicable**. |
| ResourceId¹ | All | Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource. |
| ResourceLocation¹  | All | The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location). |
| ResourceLocationNormalized  | EA | Standardized format of the Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. The normalized location is used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). |
| ResourceName | EA, pay-as-you-go | Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null/empty, **Others** , or **Not applicable**. |
| ResourceRate | pay-as-you-go | The price for a given product or service that represents the actual rate that you end up paying per unit. |
| ResourceType | MCA | Type of resource instance. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null/empty, **Others** , or **Not applicable**. |
| ServiceFamily | MCA | Service family that the service belongs to. |
| ServiceInfo1 | All | Service-specific metadata. |
| ServiceInfo2 | All | Legacy field with optional service-specific metadata. |
| ServiceName | pay-as-you-go | The service family that the service belongs to. |
| ServicePeriodEndDate | MCA | The end date of the rating period that defined and locked pricing for the consumed or purchased service. |
| ServicePeriodStartDate | MCA | The start date of the rating period that defined and locked pricing for the consumed or purchased service. |
| ServiceTier | pay-as-you-go | Name of the service subclassification category. |
| SubscriptionId¹ | All | Unique identifier for the Azure subscription. |
| SubscriptionName | All | Name of the Azure subscription. |
| Tags¹ | All | Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](https://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/). |
| Term | All | Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption. |
| UnitOfMeasure | All | The unit of measure for billing for the service. For example, compute services are billed per hour. |
| UnitPrice² ³| All | The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (`PayG` price column) for your contract. For more information, see [Pricing behavior in cost details](automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details). |
| UsageDateTime | EA, pay-as-you-go | The usage date of the charge in yyyy-mm-dd format. |
| UsageQuantity | pay-as-you-go | The number of units used by the given product or service for a given day. |

¹ Fields used to build a unique ID for a single cost record. Every record in your cost details file should be considered unique. 

² For MCA customers, prices are shown in the pricing currency in the Actual Cost and Amortized Cost reports. In contrast, for EA customers, the billing and pricing currencies are the same.

³ For more information about pricing terms and definitions, see [Pricing behavior in cost details](automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).

⁴ The Connector for AWS in the Cost Management service retires on March 31, 2025. Users should consider alternative solutions for AWS cost management reporting. On March 31, 2024, Azure will disable the ability to add new Connectors for AWS for all customers. For more information, see [Retire your Amazon Web Services (AWS) connector](../costs/retire-aws-connector.md).

The cost details file itself doesn’t uniquely identify individual records with an ID. Instead, you can use fields in the file flagged with ¹ to create a unique ID yourself.

Some fields might differ in casing and spacing between account types. Older versions of pay-as-you-go cost details files have separate sections for the statement and daily cost.

### Part numbers in the EA invoice are also in the cost and usage file

Records in cost and usage file and other cost management experiences, such as cost analysis, include part numbers matching them with the part numbers in the EA invoice. The part numbers in the cost and usage file are shown only for EA customers.

- Part numbers are shown for all usage records.
- Part numbers are shown for all purchase and refund records.

Part numbers are the same in the invoice and cost and usage file details for all charge types, excluding Azure Savings Plan and prepurchase reservations. They currently don't have a part number in the cost and usage details file.


## Reconcile charges in the cost and usage details file

Microsoft Customer Agreement (MCA) customers can use the following information to reconcile charges between billing and pricing currencies. 

1. Manually calculate the `CostInPricingCurrency` by: `(EffectivePrice)` * `(Quantity)`

1. Convert the calculated `CostInPricingCurrency` to the `CostInBillingCurrency` by: `(CalculatedCostInPricingCurrency)` * `(ExchangeRatePricingToBilling)`

1. Summarize the values that you calculated for `CostInBillingCurrency` and compare them to the invoice.

Enterprise Agreement (EA) customers can reconcile their charges using the following computation:

Manually calculate the cost by multiplying the **Effective Price** by the **Quantity**:

`Cost` = `(EffectivePrice)` * `(Quantity)`

## Reconcile reservation purchases with usage records

Every reservation purchase and usage record has two associated IDs:  `ReservationId` and `ProductOrderId`.

- Reservation purchase records (`PricingModel` = `Reservation`, `ChargeType` = `Purchase`):
    - The records carry the purchase order ID as `ProductOrderId`.
    - Additionally, they stamp the same purchase order ID as `ReservationId`.
- Reservation usage records (`PricingModel` = `Reservation`, `ChargeType` = `Usage`/`UnusedReservation`):
    - Like purchase records, the usage records also carry the purchase order ID as `ProductOrderId`.
    - However, the `ReservationId` can differ, as it gets attributed to the resources that benefited from the reservation.
    - Keep in mind that actions such as split, merge, partial refund, or exchange can create new reservations.

Although the `ReservationId` itself might differ, it's still part of the same order. Therefore, the `ProductOrderId` can be effectively used to associate the purchase with the usage record, facilitating reconciliation between reservation purchases and usage.

| Record type |`PricingModel`|`ChargeType`| `ReservationId`	| `ProductOrderId` |
| --- | -------- | -------- | --- | --- |
|Reservation purchase record (actual cost) |Reservation|Purchase|Purchase order ID |Purchase order ID |
|Reservation usage record (amortized and actual cost) |Reservation|Usage/UnusedReservation|Differing reservation ID |Purchase order ID |

For more information, see [Manage Reservations for Azure resources](../reservations/manage-reserved-vm-instance.md).

## Identify EA charges for included quantity

Included quantity (IQ) refers to the amount of a metered resource that can be consumed without incurring any extra cost in an Enterprise Agreement. When dealing with IQ, consider the following points:

Meter characteristics - Meters associated with IQ exhibit specific traits in the cost file because the meters allow consumption without any extra charges. In the cost file, a meter with IQ has:

- **ChargeType**: Usage, **PricingModel**: OnDemand.
- **Unit price**, **effective price**, and **Cost** set to 0, because you don't get billed for their consumption.
- **Quantity** isn't zero. It shows the actual consumption of the meter.
- However, the **PayG (pay-as-you-go) price** still shows the retail price, which is nonzero.

## Rounding adjustment details

A rounding adjustment represents the quantization that occurs during cost calculation. When the calculated costs are converted to the invoiced total, small rounding errors can occur. The rounding errors are represented as `rounding adjustment` to ensure that the costs shown in Cost Management align to the invoice.

### Why do we have rounding adjustment?

Every financial system involves rounding logic, which can cause some variance. Invoices aggregate monthly costs at the meter level, with costs rounded depending on the currency. In contrast, the cost file contains costs at the resource instance level with higher precision. This difference results in a variance in the total cost between the invoice and the cost file. The rounding adjustment is provided in the cost file at an aggregated level whenever the invoice is ready, ensuring that the total costs in both files match.

Note: Two separate rounding adjustments are provided—one for first-party records and the other for marketplace records. These adjustments aren't available during an open month and become visible when the month closes and the invoice is generated.

Customers can spread the rounding adjustment over finer details like individual resources, resource groups, or entire subscriptions. You can use a weighted average or use similar techniques.

### Rounding adjustment record in the cost file

The rounding adjustment record is available in the cost file at the Billing Profile scope for Microsoft Customer Agreement (MCA) or at the Enrollment scope for Enterprise Agreement (EA). Since it’s an aggregated value at the invoice level, there’s no lower-scope-level information for the record. The following fields are valid for a rounding adjustment record:

- `BillingAccountId`
- `BillingAccountName`
- `BillingPeriodStartDate`
- `BillingPeriodEndDate`
- `BillingProfileId`
- `BillingProfileName`

`MeterCategory`, `MeterSubCategory`, and `ChargeType` fields have the value as `RoundingAdjustment`.

### Illustration of rounding adjustment

Suppose you have two resources in your subscription: A and B. Resource A costs $0.1234 per hour and resource B costs $0.5678 per hour. You use both resources for 10 hours in a day, so the total cost for each resource is:

- Resource A: $0.1234 x 10 = $1.234
- Resource B: $0.5678 x 10 = $5.678

The total cost for the day is $1.234 + $5.678 = $6.912.

However, when the invoice is generated, the costs are rounded to two decimal places, so the invoice shows:

- Resource A: $1.23
- Resource B: $5.68
- Total: $6.91

The difference between the invoice total and the actual total is $0.002, which is the rounding adjustment. To ensure Cost Management costs match the invoice, an amount of -$0.002 is shown in the cost file as the rounding adjustment after the invoice generation.

## List of terms from older APIs

The following table maps terms used in older APIs to the new terms. Refer to the previous table for descriptions.

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

## Related content

- Get an overview of how to [ingest cost data](automation-ingest-usage-details-overview.md).
- Learn more about [Choose a cost details solution](usage-details-best-practices.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with Exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
- Learn how to [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).
