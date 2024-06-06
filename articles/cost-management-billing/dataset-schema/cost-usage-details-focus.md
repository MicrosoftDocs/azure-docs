---
title: FOCUS cost and usage details file schema
description: Learn about the data fields available in the FOCUS cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# FOCUS cost and usage details file schema

This article lists the cost details and usage (formerly known as usage details) fields found in the FOCUS cost and usage details file. The FOCUS version of the cost and usage details file uses columns, values, and semantics as they are defined in the [FinOps Open Cost and Usage Specification (FOCUS) project](https://focus.finops.org/#specification). The file contains all of the same cost and usage data for the Microsoft Cloud services that were used or purchased as what you will find in the actual and amortized files.

To learn more about FOCUS, see [FOCUS: A new specification for cloud cost transparency](https://azure.microsoft.com/blog/focus-a-new-specification-for-cloud-cost-transparency).

## Version 1.0-preview(v1)

| Column | Fields | Description |
|---|---|---|
| 1 | AvailabilityZone | Provider-assigned identifier for a physically separated and isolated area within a region that provides high availability and fault tolerance. |
| 2 | BilledCost | A charge serving as the basis for invoicing, inclusive of all reduced rates and discounts while excluding the amortization of upfront charges (one-time or recurring). |
| 3 | BillingAccountId | Unique identifier assigned to a billing account by the provider. |
| 4 | BillingAccountName | Display name assigned to a billing account. |
| 5 | BillingAccountType | Provider label for the kind of entity the `BillingAccountId` represents. |
| 6 | BillingCurrency | Currency that a charge was billed in. |
| 7 | BillingPeriodEnd | End date and time of the billing period. |
| 8 | BillingPeriodStart | Beginning date and time of the billing period. |
| 9 | ChargeCategory | Indicates whether the row represents an upfront or recurring fee. |
| 10 | ChargeDescription | Brief, human-readable summary of a row. |
| 11 | ChargeFrequency | Indicates how often a charge occurs. |
| 12 | ChargePeriodEnd | End date and time of a charge period. |
| 13 | ChargePeriodStart | Beginning date and time of a charge period. |
| 14 | ChargeSubcategory | Indicates the kind of usage or adjustment the row represents. |
| 15 | CommitmentDiscountCategory | Indicates whether the commitment-based discount identified in the `CommitmentDiscountId` column is based on usage quantity or cost, also called *spend*. |
| 16 | CommitmentDiscountId | Unique identifier assigned to a commitment-based discount by the provider. |
| 17 | CommitmentDiscountName | Display name assigned to a commitment-based discount. |
| 18 | CommitmentDiscountType | Label assigned by the provider to describe the type of commitment-based discount applied to the row. |
| 19 | EffectiveCost | The cost inclusive of amortized upfront fees. |
| 20 | InvoiceIssuerName | Name of the entity responsible for invoicing for the resources or services consumed. |
| 21 | ListCost | The cost without any discounts or amortized charges based on the public retail or market prices. |
| 22 | ListUnitPrice | Unit price for the SKU without any discounts or amortized charges based on the public retail or market prices that a consumer would be charged per unit. |
| 23 | PricingCategory | Indicates how the charge was priced. |
| 24 | PricingQuantity | Amount of a particular service that was used or purchased based on the `PricingUnit`. `PricingQuantity` is the same as `UsageQuantity` divided by `PricingBlocksize`. |
| 25 | PricingUnit | Indicates what measurement type is used by the `PricingQuantity`. |
| 26 | ProviderName | Name of the entity that made the resources or services available for purchase. |
| 27 | PublisherName | Name of the entity that produced the resources or services that were purchased. |
| 28 | Region | Isolated geographic area where a resource is provisioned in or a service is provided from. |
| 29 | ResourceId | Unique identifier assigned to a resource by the provider. |
| 30 | ResourceName | Display name assigned to a resource. |
| 31 | ResourceType | The kind of resource for which you're being charged. |
| 32 | ServiceCategory | Highest-level classification of a service based on the core function of the service. |
| 33 | ServiceName | An offering that can be purchased from a provider. For example, cloud virtual machine, SaaS database, or professional services from a systems integrator. |
| 34 | SkuId | Unique identifier for the SKU that was used or purchased. |
| 35 | SkuPriceId | Unique ID for the SKU inclusive of other pricing variations, like tiering and discounts. |
| 36 | SubAccountId | Unique identifier assigned to a grouping of resources or services, often used to manage access or cost. |
| 37 | SubAccountName | Name assigned to a grouping of resources or services, often used to manage access or cost. |
| 38 | SubAccountType | Provider label for the kind of entity the `SubAccountId` represents. |
| 39 | Tags | List of custom key-value pairs applied to a charge defined as a JSON object. |
| 40 | UsageQuantity | Number of units of a resource or service that was used or purchased based on the `UsageUnit`. |
| 41 | UsageUnit | Indicates what measurement type is used by the `UsageQuantity`. |
| 42 | x_AccountName | Name of the identity responsible for billing for the subscription. It is your EA enrollment account owner or MOSA account admin. Not applicable to MCA. |
| 43 | x_AccountOwnerId | Email address of the identity responsible for billing for this subscription. It is your EA enrollment account owner or MOSA account admin. Not applicable to MCA. |
| 44 | x_BilledCostInUsd | `BilledCost` in USD. |
| 45 | x_BilledUnitPrice | Unit price for the SKU that a consumer would be charged per unit. |
| 46 | x_BillingAccountId | Unique identifier for the Microsoft billing account. Same as `BillingAccountId` for EA. |
| 47 | x_BillingAccountName | Name of the Microsoft billing account. Same as `BillingAccountName` for EA. |
| 48 | x_BillingExchangeRate | Exchange rate to multiply by when converting from the pricing currency to the billing currency. |
| 49 | x_BillingExchangeRateDate | Date the exchange rate was determined. |
| 50 | x_BillingProfileId | Unique identifier for the Microsoft billing profile. Same as `BillingAccountId` for MCA. |
| 51 | x_BillingProfileName | Name of the Microsoft billing profile. Same as `BillingAccountName` for MCA. |
| 52 | x_ChargeId | Unique ID for the row. |
| 53 | x_CostAllocationRuleName | Name of the Microsoft Cost Management cost allocation rule that generated this charge. Cost allocation is used to move or split shared charges. |
| 54 | x_CostCenter | Custom value defined by a billing admin for internal chargeback. |
| 55 | x_CustomerId | Unique identifier for the Cloud Solution Provider (CSP) customer tenant. |
| 56 | x_CustomerName | Display name for the Cloud Solution Provider (CSP) customer tenant. |
| 57 | x_EffectiveCostInUsd | `EffectiveCost` in USD. |
| 58 | x_EffectiveUnitPrice | Unit price for the SKU inclusive of amortized upfront fees, amortized recurring fees, and the usage cost that a consumer would be charged per unit. |
| 59 | x_InvoiceId | Unique identifier for the invoice this charge was billed on. |
| 60 | x_InvoiceIssuerId | Unique identifier for the Cloud Solution Provider (CSP) partner. |
| 61 | x_InvoiceSectionId | Unique identifier for the MCA invoice section or EA department. |
| 62 | x_InvoiceSectionName | Display name for the MCA invoice section or EA department. |
| 63 | x_OnDemandCost | A charge inclusive of negotiated discounts that a consumer would be charged for each billing period. |
| 64 | x_OnDemandCostInUsd | `OnDemandCost` in USD. |
| 65 | x_OnDemandUnitPrice | Unit price for the SKU after negotiated discounts that a consumer would be charged per unit. |
| 66 | x_PartnerCreditApplied | Indicates when the Cloud Solution Provider (CSP) Partner Earned Credit (PEC) was applied for a charge. |
| 67 | x_PartnerCreditRate | Rate earned based on the Cloud Solution Provider (CSP) Partner Earned Credit (PEC) applied. |
| 68 | x_PricingBlockSize | Indicates the number of usage units grouped together for block pricing. This number is usually a part of the `PricingUnit`. Divide `UsageQuantity` by `PricingBlockSize` to get the `PricingQuantity`. |
| 69 | x_PricingCurrency | Currency used for all price columns. |
| 70 | x_PricingSubcategory | Describes the kind of pricing model used for a charge within a specific Pricing Category. |
| 71 | x_PricingUnitDescription | Indicates what measurement type is used by the `PricingQuantity`, including pricing block size. It's what is used in the price list or on the invoice. |
| 72 | x_PublisherCategory | Indicates whether a charge is from a cloud provider or third-party Marketplace vendor. |
| 73 | x_PublisherId | Unique identifier of the entity that produced the resources and/or services that were purchased. |
| 74 | x_ResellerId | Unique identifier for the Cloud Solution Provider (CSP) reseller. |
| 75 | x_ResellerName | Name of the Cloud Solution Provider (CSP) reseller. |
| 76 | x_ResourceGroupName | Grouping of resources that make up an application or set of resources that share the same lifecycle. For example, created and deleted together. |
| 77 | x_ResourceType | Azure Resource Manager resource type. |
| 78 | x_ServicePeriodEnd | Exclusive end date of the service period applicable for the charge. |
| 79 | x_ServicePeriodStart | Start date of the service period applicable for the charge. |
| 80 | x_SkuDescription | Description of the SKU that was used or purchased. |
| 81 | x_SkuDetails | Additional information about the SKU. This column is formatted as a JSON object. |
| 82 | x_SkuIsCreditEligible | Indicates if the charge is eligible for Azure credits. |
| 83 | x_SkuMeterCategory | Name of the service the SKU falls within. |
| 84 | x_SkuMeterId | Unique identifier (sometimes a GUID, but not always) for the usage meter. It usually maps to a specific SKU or range of SKUs that have a specific price. |
| 85 | x_SkuMeterName | Name of the usage meter. It usually maps to a specific SKU or range of SKUs that have a specific price. Not applicable for purchases. |
| 86 | x_SkuMeterSubcategory | Group of SKU Classes that address the same core need within the SKU Group. |
| 87 | x_SkuOfferId | Microsoft Cloud subscription type. |
| 88 | x_SkuOrderId | Unique identifier of the entitlement product for this charge. Same as MCA `ProductOrderId`. Not applicable for EA. |
| 89 | x_SkuOrderName | Display name of the entitlement product for this charge. Same as MCA `ProductOrderId`. Not applicable for EA. |
| 90 | x_SkuPartNumber | Identifier to help categorize specific usage meters. |
| 91 | x_SkuRegion | Region that the SKU operated in. It might be different from the resource region. |
| 92 | x_SkuServiceFamily | Highest-level classification of a SKU based on the core function of the SKU. |
| 93 | x_SkuTerm | Number of months a purchase covers. |
| 94 | x_SkuTier | Pricing tier for the SKU when that SKU supports tiered or graduated pricing. |