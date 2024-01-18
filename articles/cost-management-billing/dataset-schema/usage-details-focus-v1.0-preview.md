---
title: FOCUS cost details file schema - version 1.0-preview
description: Learn about the data fields available in the FOCUS cost details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# FOCUS cost details file schema - version 1.0-preview


This article lists the cost details (formerly known as usage details) fields found in the FOCUS cost details file. The FOCUS-specific version of the cost details file differs from other versions. This version adheres to the [FinOps Open Cost and Usage Specification (FOCUS) project specification](https://focus.finops.org/#specification). You can get the FOCUS cost details file by using [Azure portal download](../understand/download-azure-daily-usage.md), [Exports](../costs/tutorial-export-acm-data.md) from Cost Management, or the [Cost Details API](/rest/api/cost-management/generate-cost-details-report). The cost details file is a CSV file that contains all of the cost details for the Azure services that were used. For more information about cost details best practices, see [Choose a cost details solution](../automate/usage-details-best-practices.md).

## Cost details data file fields

| Fields | Description |
|---|---|
| AvailabilityZone | Provider assigned identifier for a physically separated and isolated area within a Region that provides high availability and fault tolerance. |
| BilledCost | A charge serving as the basis for invoicing, inclusive of all reduced rates and discounts while excluding the amortization of upfront charges (one-time or recurring). |
| BillingAccountId | Unique identifier assigned to a billing account by the provider. |
| BillingAccountName | Display name assigned to a billing account. |
| BillingAccountType | Provider label for the kind of entity the `BillingAccountId` represents. |
| BillingCurrency | Currency that a charge was billed in. |
| BillingPeriodEnd | End date and time of the billing period. |
| BillingPeriodStart | Beginning date and time of the billing period. |
| ChargeCategory | Indicates whether the row represents an upfront or recurring fee. |
| ChargeDescription | Brief, human-readable summary of a row. |
| ChargeFrequency | Indicates how often a charge occurs. |
| ChargePeriodEnd | End date and time of a charge period. |
| ChargePeriodStart | Beginning date and time of a charge period. |
| ChargeSubcategory | Indicates the kind of usage or adjustment the row represents. |
| CommitmentDiscountCategory | Indicates whether the commitment-based discount identified in the `CommitmentDiscountId` column is based on usage quantity or cost, also called *spend*. |
| CommitmentDiscountId | Unique identifier assigned to a commitment-based discount by the provider. |
| CommitmentDiscountName | Display name assigned to a commitment-based discount. |
| CommitmentDiscountType | Label assigned by the provider to describe the type of commitment-based discount applied to the row. |
| EffectiveCost | The cost inclusive of amortized upfront fees. |
| InvoiceIssuerName | Name of the entity responsible for invoicing for the resources or services consumed. |
| ListCost | The cost without any discounts or amortized charges based on the public retail or market prices. |
| ListUnitPrice | Unit price for the SKU without any discounts or amortized charges based on the public retail or market prices that a consumer would be charged per unit. |
| PricingCategory | Indicates how the charge was priced. |
| PricingQuantity | Amount of a particular service that was used or purchased based on the `PricingUnit`. `PricingQuantity` is the same as `UsageQuantity` divided by `PricingBlocksize`. |
| PricingUnit | Indicates what measurement type is used by the `PricingQuantity`. |
| ProviderName | Name of the entity that made the resources or services available for purchase. |
| PublisherName | Name of the entity that produced the resources or services that were purchased. |
| Region | Isolated geographic area where a resource is provisioned in or a service is provided from. |
| ResourceId | Unique identifier assigned to a resource by the provider. |
| ResourceName | Display name assigned to a resource. |
| ResourceType | The kind of resource for which you're being charged. |
| ServiceCategory | Highest-level classification of a service based on the core function of the service. |
| ServiceName | An offering that can be purchased from a provider. For example, cloud virtual machine, SaaS database, or professional services from a systems integrator. |
| SkuId | Unique identifier for the SKU that was used or purchased. |
| SkuPriceId | Unique ID for the SKU inclusive of other pricing variations, like tiering and discounts. |
| SubAccountId | Unique identifier assigned to a grouping of resources or services, often used to manage access or cost. |
| SubAccountName | Name assigned to a grouping of resources or services, often used to manage access or cost. |
| SubAccountType | Provider label for the kind of entity the `SubAccountId` represents. |
| Tags | List of custom key-value pairs applied to a charge defined as a JSON object. |
| UsageQuantity | Number of units of a resource or service that was used or purchased based on the `UsageUnit`. |
| UsageUnit | Indicates what measurement type is used by the `UsageQuantity`. |
| x_AccountName | Name of the identity responsible for billing for the subscription. It is your EA enrollment account owner or MOSA account admin. Not applicable to MCA. |
| x_AccountOwnerId | Email address of the identity responsible for billing for this subscription. It is your EA enrollment account owner or MOSA account admin. Not applicable to MCA. |
| x_BilledCostInUsd | `BilledCost` in USD. |
| x_BilledUnitPrice | Unit price for the SKU that a consumer would be charged per unit. |
| x_BillingAccountId | Unique identifier for the Microsoft billing account. Same as `BillingAccountId` for EA. |
| x_BillingAccountName | Name of the Microsoft billing account. Same as `BillingAccountName` for EA. |
| x_BillingExchangeRate | Exchange rate to multiply by when converting from the pricing currency to the billing currency. |
| x_BillingExchangeRateDate | Date the exchange rate was determined. |
| x_BillingProfileId | Unique identifier for the Microsoft billing profile. Same as `BillingAccountId` for MCA. |
| x_BillingProfileName | Name of the Microsoft billing profile. Same as `BillingAccountName` for MCA. |
| x_ChargeId | Unique ID for the row. |
| x_CostAllocationRuleName | Name of the Microsoft Cost Management cost allocation rule that generated this charge. Cost allocation is used to move or split shared charges. |
| x_CostCenter | Custom value defined by a billing admin for internal chargeback. |
| x_CustomerId | Unique identifier for the Cloud Solution Provider (CSP) customer tenant. |
| x_CustomerName | Display name for the Cloud Solution Provider (CSP) customer tenant. |
| x_EffectiveCostInUsd | `EffectiveCost` in USD. |
| x_EffectiveUnitPrice | Unit price for the SKU inclusive of amortized upfront fees, amortized recurring fees, and the usage cost that a consumer would be charged per unit. |
| x_InvoiceId | Unique identifier for the invoice this charge was billed on. |
| x_InvoiceIssuerId | Unique identifier for the Cloud Solution Provider (CSP) partner. |
| x_InvoiceSectionId | Unique identifier for the MCA invoice section or EA department. |
| x_InvoiceSectionName | Display name for the MCA invoice section or EA department. |
| x_OnDemandCost | A charge inclusive of negotiated discounts that a consumer would be charged for each billing period. |
| x_OnDemandCostInUsd | `OnDemandCost` in USD. |
| x_OnDemandUnitPrice | Unit price for the SKU after negotiated discounts that a consumer would be charged per unit. |
| x_PartnerCreditApplied | Indicates when the Cloud Solution Provider (CSP) Partner Earned Credit (PEC) was applied for a charge. |
| x_PartnerCreditRate | Rate earned based on the Cloud Solution Provider (CSP) Partner Earned Credit (PEC) applied. |
| x_PricingBlockSize | Indicates the number of usage units grouped together for block pricing. This number is usually a part of the `PricingUnit`. Divide `UsageQuantity` by `PricingBlockSize` to get the `PricingQuantity`. |
| x_PricingCurrency | Currency used for all price columns. |
| x_PricingSubcategory | Describes the kind of pricing model used for a charge within a specific Pricing Category. |
| x_PricingUnitDescription | Indicates what measurement type is used by the `PricingQuantity`, including pricing block size. It's what is used in the price list or on the invoice. |
| x_PublisherCategory | Indicates whether a charge is from a cloud provider or third-party Marketplace vendor. |
| x_PublisherId | Unique identifier of the entity that produced the resources and/or services that were purchased. |
| x_ResellerId | Unique identifier for the Cloud Solution Provider (CSP) reseller. |
| x_ResellerName | Name of the Cloud Solution Provider (CSP) reseller. |
| x_ResourceGroupName | Grouping of resources that make up an application or set of resources that share the same lifecycle. For example, created and deleted together. |
| x_ResourceType | Azure Resource Manager resource type. |
| x_ServicePeriodEnd | Exclusive end date of the service period applicable for the charge. |
| x_ServicePeriodStart | Start date of the service period applicable for the charge. |
| x_SkuDescription | Description of the SKU that was used or purchased. |
| x_SkuDetails | Additional information about the SKU. This column is formatted as a JSON object. |
| x_SkuIsCreditEligible | Indicates if the charge is eligible for Azure credits. |
| x_SkuMeterCategory | Name of the service the SKU falls within. |
| x_SkuMeterId | Unique identifier (sometimes a GUID, but not always) for the usage meter. It usually maps to a specific SKU or range of SKUs that have a specific price. |
| x_SkuMeterName | Name of the usage meter. It usually maps to a specific SKU or range of SKUs that have a specific price. Not applicable for purchases. |
| x_SkuMeterSubcategory | Group of SKU Classes that address the same core need within the SKU Group. |
| x_SkuOfferId | Microsoft Cloud subscription type. |
| x_SkuOrderId | Unique identifier of the entitlement product for this charge. Same as MCA `ProductOrderId`. Not applicable for EA. |
| x_SkuOrderName | Display name of the entitlement product for this charge. Same as MCA `ProductOrderId`. Not applicable for EA. |
| x_SkuPartNumber | Identifier to help categorize specific usage meters. |
| x_SkuRegion | Region that the SKU operated in. It might be different from the resource region. |
| x_SkuServiceFamily | Highest-level classification of a SKU based on the core function of the SKU. |
| x_SkuTerm | Number of months a purchase covers. |
| x_SkuTier | Pricing tier for the SKU when that SKU supports tiered or graduated pricing. |
