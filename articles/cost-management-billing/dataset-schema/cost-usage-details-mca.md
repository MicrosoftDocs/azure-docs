---
title: Microsoft Customer Agreement cost and usage details file schema
description: Learn about the data fields available in the Microsoft Customer Agreement cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Microsoft Customer Agreement cost and usage details file schema

This article applies to the Microsoft Customer Agreement cost and usage details file schema.

The following information lists the cost and usage details (formerly known as usage details) fields found in Microsoft Customer Agreement cost and usage details files. The file contains contains all of the cost details and usage data for the Azure services that were used.

## Version 2023-12-01-preview

| Column |Fields|Description|
|---|------|------|
| 1 |invoiceId|The unique document ID listed on the invoice PDF.|
| 2 |previousInvoiceId|Reference to an original invoice if the line item is a refund.|
| 3 |billingAccountId|Unique identifier for the root billing account.|
| 4 |billingAccountName|Name of the billing account.|
| 5 |billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 6 |billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 7 |invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 8 |invoiceSectionName|Name of the EA department or MCA invoice section.|
| 9 |resellerName|The name of the reseller associated with the subscription.|
| 10 |resellerMpnId|ID for the reseller associated with the subscription.|
| 11 |costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 12 |billingPeriodEndDate|The end date of the billing period.|
| 13 |billingPeriodStartDate|The start date of the billing period.|
| 14 |servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 15 |servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 16 |date|The usage or purchase date of the charge.|
| 17 |serviceFamily|Service family that the service belongs to.|
| 18 |productOrderId|Unique identifier for the product order.|
| 19 |productOrderName|Unique name for the product order.|
| 20 |consumedService|Name of the service the charge is associated with.|
| 21 |meterId|The unique identifier for the meter.|
| 22 |meterName|The name of the meter.|
| 23 |meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 24 |meterSubCategory|Name of the meter subclassification category.|
| 25 |meterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 26 |ProductId|Unique identifier for the product.|
| 27 |ProductName|Name of the product.|
| 28 |SubscriptionId|Unique identifier for the Azure subscription.|
| 29 |subscriptionName|Name of the Azure subscription.|
| 30 |publisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 31 |publisherId|The ID of the publisher. It's only available after the invoice is generated.|
| 32 |publisherName|Publisher for Marketplace services.|
| 33 |resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 34 |ResourceId|Unique identifier of the Azure Resource Manager resource.|
| 35 |resourceLocation|Datacenter location where the resource is running. See `Location`.|
| 36 |location|Normalized location of the resource, if different resource locations are configured for the same regions.|
| 37 |effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 38 |quantity|The number of units purchased or consumed.|
| 39 |unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 40 |chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 41 |billingCurrency|Currency associated with the billing account.|
| 42 |pricingCurrency|Currency used when rating based on negotiated prices.|
| 43 |costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 44 |costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
| 45 |costInUsd|  |
| 46 |paygCostInBillingCurrency|  |
| 47 |paygCostInUsd|  |
| 48 |exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
| 49 |exchangeRateDate|Date the exchange rate was established.|
| 50 |isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 51 |serviceInfo1|Service-specific metadata.|
| 52 |serviceInfo2|Legacy field with optional service-specific metadata.|
| 53 |additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 54 |tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 55 |PayGPrice|Retail price for the resource.|
| 56 |frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 57 |term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 58 |reservationId|Unique identifier for the purchased reservation instance.|
| 59 |reservationName|Name of the purchased reservation instance.|
| 60 |pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
| 61 |unitPrice|The price per unit for the charge.|
| 62 |costAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|
| 63 |benefitId|  |
| 64 |benefitName|  |
| 65 |provider|Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS.|

## Version 2021-10-01

| Column |Fields|Description|
|---|------|------|
| 1 |invoiceId|The unique document ID listed on the invoice PDF.|
| 2 |previousInvoiceId|Reference to an original invoice if the line item is a refund.|
| 3 |billingAccountId|Unique identifier for the root billing account.|
| 4 |billingAccountName|Name of the billing account.|
| 5 |billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 6 |billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 7 |invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 8 |invoiceSectionName|Name of the EA department or MCA invoice section.|
| 9 |resellerName|The name of the reseller associated with the subscription.|
| 10 |resellerMpnId|ID for the reseller associated with the subscription.|
| 11 |costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 12 |billingPeriodEndDate|The end date of the billing period.|
| 13 |billingPeriodStartDate|The start date of the billing period.|
| 14 |servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 15 |servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 16 |date|The usage or purchase date of the charge.|
| 17 |serviceFamily|Service family that the service belongs to.|
| 18 |productOrderId|Unique identifier for the product order.|
| 19 |productOrderName|Unique name for the product order.|
| 20 |consumedService|Name of the service the charge is associated with.|
| 21 |meterId|The unique identifier for the meter.|
| 22 |meterName|The name of the meter.|
| 23 |meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 24 |meterSubCategory|Name of the meter subclassification category.|
| 25 |meterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 26 |ProductId|Unique identifier for the product.|
| 27 |ProductName|Name of the product.|
| 28 |SubscriptionId|Unique identifier for the Azure subscription.|
| 29 |subscriptionName|Name of the Azure subscription.|
| 30 |publisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 31 |publisherId|The ID of the publisher. It's only available after the invoice is generated.|
| 32 |publisherName|Publisher for Marketplace services.|
| 33 |resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 34 |ResourceId|Unique identifier of the Azure Resource Manager resource.|
| 35 |resourceLocation|Datacenter location where the resource is running. See `Location`.|
| 36 |location|Normalized location of the resource, if different resource locations are configured for the same regions.|
| 37 |effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 38 |quantity|The number of units purchased or consumed.|
| 39 |unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 40 |chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 41 |billingCurrency|Currency associated with the billing account.|
| 42 |pricingCurrency|Currency used when rating based on negotiated prices.|
| 43 |costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 44 |costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
| 45 |costInUsd|  |
| 46 |paygCostInBillingCurrency|  |
| 47 |paygCostInUsd|  |
| 48 |exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
| 49 |exchangeRateDate|Date the exchange rate was established.|
| 50 |isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 51 |serviceInfo1|Service-specific metadata.|
| 52 |serviceInfo2|Legacy field with optional service-specific metadata.|
| 53 |additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 54 |tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 55 |PayGPrice|Retail price for the resource.|
| 56 |frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 57 |term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 58 |reservationId|Unique identifier for the purchased reservation instance.|
| 59 |reservationName|Name of the purchased reservation instance.|
| 60 |pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
| 61 |unitPrice|The price per unit for the charge.|
| 62 |costAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|
| 63 |benefitId|  |
| 64 |benefitName|  |
| 65 |provider|Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS.|

## Version 2021-01-01

| Column |Fields|Description|
|---|------|------|
| 1 |invoiceId|The unique document ID listed on the invoice PDF.|
| 2 |previousInvoiceId|Reference to an original invoice if the line item is a refund.|
| 3 |billingAccountId|Unique identifier for the root billing account.|
| 4 |billingAccountName|Name of the billing account.|
| 5 |billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 6 |billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 7 |invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 8 |invoiceSectionName|Name of the EA department or MCA invoice section.|
| 9 |resellerName|The name of the reseller associated with the subscription.|
| 10 |resellerMpnId|ID for the reseller associated with the subscription.|
| 11 |costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 12 |billingPeriodEndDate|The end date of the billing period.|
| 13 |billingPeriodStartDate|The start date of the billing period.|
| 14 |servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 15 |servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 16 |date|The usage or purchase date of the charge.|
| 17 |serviceFamily|Service family that the service belongs to.|
| 18 |productOrderId|Unique identifier for the product order.|
| 19 |productOrderName|Unique name for the product order.|
| 20 |consumedService|Name of the service the charge is associated with.|
| 21 |meterId|The unique identifier for the meter.|
| 22 |meterName|The name of the meter.|
| 23 |meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 24 |meterSubCategory|Name of the meter subclassification category.|
| 25 |meterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 26 |ProductId|Unique identifier for the product.|
| 27 |ProductName|Name of the product.|
| 28 |SubscriptionId|Unique identifier for the Azure subscription.|
| 29 |subscriptionName|Name of the Azure subscription.|
| 30 |publisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 31 |publisherId|The ID of the publisher. It's only available after the invoice is generated.|
| 32 |publisherName|Publisher for Marketplace services.|
| 33 |resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 34 |ResourceId|Unique identifier of the Azure Resource Manager resource.|
| 35 |resourceLocation|Datacenter location where the resource is running. See `Location`.|
| 36 |location|Normalized location of the resource, if different resource locations are configured for the same regions.|
| 37 |effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 38 |quantity|The number of units purchased or consumed.|
| 39 |unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 40 |chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 41 |billingCurrency|Currency associated with the billing account.|
| 42 |pricingCurrency|Currency used when rating based on negotiated prices.|
| 43 |costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 44 |costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
| 45 |costInUsd|  |
| 46 |paygCostInBillingCurrency|  |
| 47 |paygCostInUsd|  |
| 48 |exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
| 49 |exchangeRateDate|Date the exchange rate was established.|
| 50 |isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 51 |serviceInfo1|Service-specific metadata.|
| 52 |serviceInfo2|Legacy field with optional service-specific metadata.|
| 53 |additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 54 |tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 55 |PayGPrice|Retail price for the resource.|
| 56 |frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 57 |term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 58 |reservationId|Unique identifier for the purchased reservation instance.|
| 59 |reservationName|Name of the purchased reservation instance.|
| 60 |pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
| 61 |unitPrice|The price per unit for the charge.|
| 62 |costAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|

## Version 2019-11-01

| Column |Fields|Description|
|---|------|------|
| 1 |invoiceId|The unique document ID listed on the invoice PDF.|
| 2 |previousInvoiceId|Reference to an original invoice if the line item is a refund.|
| 3 |billingAccountId|Unique identifier for the root billing account.|
| 4 |billingAccountName|Name of the billing account.|
| 5 |billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 6 |billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 7 |invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 8 |invoiceSectionName|Name of the EA department or MCA invoice section.|
| 9 |resellerName|The name of the reseller associated with the subscription.|
| 10 |resellerMpnId|ID for the reseller associated with the subscription.|
| 11 |costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 12 |billingPeriodEndDate|The end date of the billing period.|
| 13 |billingPeriodStartDate|The start date of the billing period.|
| 14 |servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 15 |servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 16 |date|The usage or purchase date of the charge.|
| 17 |serviceFamily|Service family that the service belongs to.|
| 18 |productOrderId|Unique identifier for the product order.|
| 19 |productOrderName|Unique name for the product order.|
| 20 |consumedService|Name of the service the charge is associated with.|
| 21 |meterId|The unique identifier for the meter.|
| 22 |meterName|The name of the meter.|
| 23 |meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 24 |meterSubCategory|Name of the meter subclassification category.|
| 25 |meterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 26 |ProductId|Unique identifier for the product.|
| 27 |product|Name of the product.|
| 28 |subscriptionId|Unique identifier for the Azure subscription.|
| 29 |subscriptionName|Name of the Azure subscription.|
| 30 |publisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 31 |publisherId|The ID of the publisher. It's only available after the invoice is generated.|
| 32 |publisherName|Publisher for Marketplace services.|
| 33 |resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 34 |InstanceName|Unique identifier of the Azure Resource Manager resource.|
| 35 |resourceLocation|Datacenter location where the resource is running. See `Location`.|
| 36 |Location|Normalized location of the resource, if different resource locations are configured for the same regions.|
| 37 |effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 38 |quantity|The number of units purchased or consumed.|
| 39 |unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 40 |chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 41 |billingCurrency|Currency associated with the billing account.|
| 42 |pricingCurrency|Currency used when rating based on negotiated prices.|
| 43 |costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 44 |costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
| 45 |costInUsd|  |
| 46 |paygCostInBillingCurrency|  |
| 47 |paygCostInUsd|  |
| 48 |exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
| 49 |exchangeRateDate|Date the exchange rate was established.|
| 50 |isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 51 |serviceInfo1|Service-specific metadata.|
| 52 |serviceInfo2|Legacy field with optional service-specific metadata.|
| 53 |additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 54 |tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 55 |payGPrice|Retail price for the resource.|
| 56 |frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 57 |term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 58 |reservationId|Unique identifier for the purchased reservation instance.|
| 59 |reservationName|Name of the purchased reservation instance.|
| 60 |unitPrice|The price per unit for the charge.|

## Version 2019-10-01

|Column|Fields|Description|
|---|------|------|
| 1 |InvoiceID|The unique document ID listed on the invoice PDF.|
| 2 |PreviousInvoiceId|Reference to an original invoice if the line item is a refund.|
| 3 |BillingAccountId|Unique identifier for the root billing account.|
| 4 |BillingAccountName|Name of the billing account.|
| 5 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 6 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 7 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 8 |InvoiceSectionName|Name of the EA department or MCA invoice section.|
| 9 |ResellerName|The name of the reseller associated with the subscription.|
| 10 |ResellerMPNId|ID for the reseller associated with the subscription.|
| 11 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 12 |BillingPeriodEndDate|The end date of the billing period.|
| 13 |BillingPeriodStartDate|The start date of the billing period.|
| 14 |ServicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 15 |ServicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 16 |Date|The usage or purchase date of the charge.|
| 17 |ServiceFamily|Service family that the service belongs to.|
| 18 |ProductOrderId|Unique identifier for the product order.|
| 19 |ProductOrderName|Unique name for the product order.|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |MeterId|The unique identifier for the meter.|
| 22 |MeterName|The name of the meter.|
| 23 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 24 |MeterSubcategory|Name of the meter subclassification category.|
| 25 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 26 |ProductId|Unique identifier for the product.|
| 27 |Product|Name of the product.|
| 28 |SubscriptionGuid|Unique identifier for the Azure subscription.|
| 29 |SubscriptionName|Name of the Azure subscription.|
| 30 |PublisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 31 |PublisherId|The ID of the publisher. It's only available after the invoice is generated.|
| 32 |PublisherName|Publisher for Marketplace services.|
| 33 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 34 |InstanceName|Unique identifier of the Azure Resource Manager resource.|
| 35 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 36 |Location|Normalized location of the resource, if different resource locations are configured for the same regions.|
| 37 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 38 |Quantity|The number of units purchased or consumed.|
| 39 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 40 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 41 |BillingCurrencyCode|Currency associated with the billing account.|
| 42 |PricingCurrencyCode|Currency used when rating based on negotiated prices.|
| 43 |CostInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 44 |CostInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
| 45 |CostInUSD|  |
| 46 |PaygCostInBillingCurrency|  |
| 47 |PaygCostInUSD|  |
| 48 |ExchangeRate|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
| 49 |ExchangeRateDate|Date the exchange rate was established.|
| 50 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 51 |ServiceInfo1|Service-specific metadata.|
| 52 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 53 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 54 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 55 |MarketPrice|Retail price for the resource.|
| 56 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 57 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 58 |ReservationId|Unique identifier for the purchased reservation instance.|
| 59 |ReservationName|Name of the purchased reservation instance.|
| 60 |UnitPrice|The price per unit for the charge.|