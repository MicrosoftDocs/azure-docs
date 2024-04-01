---
title: Microsoft Customer Agreement (MCA) partner subscription cost and usage details file schema
description: Learn about the data fields available in the Microsoft Customer Agreement partner subscription cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 03/28/2024
ms.author: banders
---

# Microsoft Customer Agreement partner subscription cost and usage details file schema

This article applies to the Microsoft Customer Agreement partner subscription cost and usage details file schema.

The following information lists the cost and usage details (formerly known as usage details) fields found in Microsoft Customer Agreement partner subscription cost and usage details files. The file contains contains all of the cost details and usage data for the Azure services that were used.

## Version 2023-12-01-preview

|Column order|Fields|Description|
|------|------|------|
|1|billingAccountName|Name of the billing account.|
|2|partnerName| MISSING |
|3|resellerName|The name of the reseller associated with the subscription.|
|4|resellerMpnId|ID for the reseller associated with the subscription.|
|5|customerTenantId| MISSING |
|6|customerName| MISSING |
|7|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|8|billingPeriodEndDate|The end date of the billing period.|
|9|billingPeriodStartDate|The start date of the billing period.|
|10|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|11|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|12|date|The usage or purchase date of the charge.|
|13|serviceFamily|Service family that the service belongs to.|
|14|productOrderId|Unique identifier for the product order.|
|15|productOrderName|Unique name for the product order.|
|16|consumedService|Name of the service the charge is associated with.|
|17|meterId|The unique identifier for the meter.|
|18|meterName|The name of the meter.|
|19|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|20|meterSubCategory|Name of the meter subclassification category.|
|21|meterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
|22|ProductId|Unique identifier for the product.|
|23|ProductName|Name of the product.|
|24|SubscriptionId|Unique identifier for the Azure subscription.|
|25|subscriptionName|Name of the Azure subscription.|
|26|publisherType|Supported values: Microsoft, Azure, AWS, Marketplace. Values are microsoft for MCA accounts and Azure for EA and pay-as-you-go accounts.|
|27|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|28|publisherName|Publisher for Marketplace services.|
|29|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|30|ResourceId|Unique identifier of the Azure Resource Manager resource.|
|31|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|32|location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|33|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|34|quantity|The number of units purchased or consumed.|
|35|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|36|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|37|billingCurrency|Currency associated with the billing account.|
|38|pricingCurrency|Currency used when rating based on negotiated prices.|
|39|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|40|costInUsd|MISSING|
|41|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|42|exchangeRateDate|Date the exchange rate was established.|
|43|serviceInfo1|Service-specific metadata.|
|44|serviceInfo2|Legacy field with optional service-specific metadata.|
|45|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|46|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|47|PayGPrice|Retail price for the resource.|
|48|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|49|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|50|reservationId|Unique identifier for the purchased reservation instance.|
|51|reservationName|Name of the purchased reservation instance.|
|52|pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
|53|unitPrice|The price per unit for the charge.|
|54|benefitId|MISSING|
|55|benefitName|MISSING|
|56|provider|Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS.|

## Version 2021-10-01

|Column order|Fields|Description|
|------|------|------|
|1|billingAccountName|Name of the billing account.|
|2|partnerName| MISSING |
|3|resellerName|The name of the reseller associated with the subscription.|
|4|resellerMpnId|ID for the reseller associated with the subscription.|
|5|customerTenantId| MISSING |
|6|customerName| MISSING |
|7|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|8|billingPeriodEndDate|The end date of the billing period.|
|9|billingPeriodStartDate|The start date of the billing period.|
|10|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|11|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|12|date|The usage or purchase date of the charge.|
|13|serviceFamily|Service family that the service belongs to.|
|14|productOrderId|Unique identifier for the product order.|
|15|productOrderName|Unique name for the product order.|
|16|consumedService|Name of the service the charge is associated with.|
|17|meterId|The unique identifier for the meter.|
|18|meterName|The name of the meter.|
|19|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|20|meterSubCategory|Name of the meter subclassification category.|
|21|meterRegion|Name of the datacenter location for services priced based on location. See Location.|
|22|ProductId|Unique identifier for the product.|
|23|ProductName|Name of the product.|
|24|SubscriptionId|Unique identifier for the Azure subscription.|
|25|subscriptionName|Name of the Azure subscription.|
|26|publisherType|Supported values: Microsoft, Azure, AWS, Marketplace. Values are microsoft for MCA accounts and Azure for EA and pay-as-you-go accounts.|
|27|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|28|publisherName|Publisher for Marketplace services.|
|29|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|30|ResourceId|Unique identifier of the Azure Resource Manager resource.|
|31|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|32|location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|33|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|34|quantity|The number of units purchased or consumed.|
|35|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|36|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|37|billingCurrency|Currency associated with the billing account.|
|38|pricingCurrency|Currency used when rating based on negotiated prices.|
|39|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|40|costInUsd|MISSING|
|41|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|42|exchangeRateDate|Date the exchange rate was established.|
|43|serviceInfo1|Service-specific metadata.|
|44|serviceInfo2|Legacy field with optional service-specific metadata.|
|45|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|46|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|47|PayGPrice|Retail price for the resource.|
|48|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|49|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|50|reservationId|Unique identifier for the purchased reservation instance.|
|51|reservationName|Name of the purchased reservation instance.|
|52|pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
|53|unitPrice|The price per unit for the charge.|
|54|benefitId|MISSING|
|55|benefitName|MISSING|
|56|provider|Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS.|

## Version 2021-01-01

|Column order|Fields|Description|
|------|------|------|
|1|billingAccountName|Name of the billing account.|
|2|partnerName| MISSING |
|3|resellerName|The name of the reseller associated with the subscription.|
|4|resellerMpnId|ID for the reseller associated with the subscription.|
|5|customerTenantId| MISSING |
|6|customerName| MISSING |
|7|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|8|billingPeriodEndDate|The end date of the billing period.|
|9|billingPeriodStartDate|The start date of the billing period.|
|10|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|11|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|12|date|The usage or purchase date of the charge.|
|13|serviceFamily|Service family that the service belongs to.|
|14|productOrderId|Unique identifier for the product order.|
|15|productOrderName|Unique name for the product order.|
|16|consumedService|Name of the service the charge is associated with.|
|17|meterId|The unique identifier for the meter.|
|18|meterName|The name of the meter.|
|19|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|20|meterSubCategory|Name of the meter subclassification category.|
|21|meterRegion|Name of the datacenter location for services priced based on location. See Location.|
|22|ProductId|Unique identifier for the product.|
|23|ProductName|Name of the product.|
|24|SubscriptionId|Unique identifier for the Azure subscription.|
|25|subscriptionName|Name of the Azure subscription.|
|26|publisherType|Supported values: Microsoft, Azure, AWS, Marketplace. Values are microsoft for MCA accounts and Azure for EA and pay-as-you-go accounts.|
|27|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|28|publisherName|Publisher for Marketplace services.|
|29|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|30|ResourceId|Unique identifier of the Azure Resource Manager resource.|
|31|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|32|location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|33|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|34|quantity|The number of units purchased or consumed.|
|35|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|36|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|37|billingCurrency|Currency associated with the billing account.|
|38|pricingCurrency|Currency used when rating based on negotiated prices.|
|39|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|40|costInUsd|MISSING|
|41|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|42|exchangeRateDate|Date the exchange rate was established.|
|43|serviceInfo1|Service-specific metadata.|
|44|serviceInfo2|Legacy field with optional service-specific metadata.|
|45|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|46|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|47|PayGPrice|Retail price for the resource.|
|48|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|49|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|50|reservationId|Unique identifier for the purchased reservation instance.|
|51|reservationName|Name of the purchased reservation instance.|
|52|pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
|53|unitPrice|The price per unit for the charge.|

## Version 2019-11-01

|Column order|Fields|Description|
|------|------|------|
|1|billingAccountName|Name of the billing account.|
|2|partnerName| MISSING |
|3|resellerName|The name of the reseller associated with the subscription.|
|4|resellerMpnId|ID for the reseller associated with the subscription.|
|5|customerTenantId| MISSING |
|6|customerName| MISSING |
|7|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|8|billingPeriodEndDate|The end date of the billing period.|
|9|billingPeriodStartDate|The start date of the billing period.|
|10|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|11|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|12|date|The usage or purchase date of the charge.|
|13|serviceFamily|Service family that the service belongs to.|
|14|productOrderId|Unique identifier for the product order.|
|15|productOrderName|Unique name for the product order.|
|16|consumedService|Name of the service the charge is associated with.|
|17|meterId|The unique identifier for the meter.|
|18|meterName|The name of the meter.|
|19|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|20|meterSubCategory|Name of the meter subclassification category.|
|21|meterRegion|Name of the datacenter location for services priced based on location. See Location.|
|22|ProductId|Unique identifier for the product.|
|23|product| MISSING |
|24|subscriptionId|Unique identifier for the Azure subscription.|
|25|subscriptionName|Name of the Azure subscription.|
|26|publisherType|Supported values: Microsoft, Azure, AWS, Marketplace. Values are microsoft for MCA accounts and Azure for EA and pay-as-you-go accounts.|
|27|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|28|publisherName|Publisher for Marketplace services.|
|29|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|30|InstanceName|Unique identifier of the Azure Resource Manager resource.|
|31|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|32|Location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|33|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|34|quantity|The number of units purchased or consumed.|
|35|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|36|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|37|billingCurrency|Currency associated with the billing account.|
|38|pricingCurrency|Currency used when rating based on negotiated prices.|
|39|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|40|costInUsd|MISSING|
|41|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|42|exchangeRateDate|Date the exchange rate was established.|
|43|serviceInfo1|Service-specific metadata.|
|44|serviceInfo2|Legacy field with optional service-specific metadata.|
|45|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|46|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|47|payGPrice|Retail price for the resource.|
|48|reservationId|Unique identifier for the purchased reservation instance.|
|49|reservationName|Name of the purchased reservation instance.|
|50|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|51|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|52|unitPrice|The price per unit for the charge.|