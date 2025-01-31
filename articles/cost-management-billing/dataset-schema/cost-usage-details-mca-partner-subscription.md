---
title: Cloud Solution Provider (CSP) subscription cost and usage details file schema
description: Learn about the data fields available in the CSP subscription cost and usage details file schema.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/24/2025
ms.author: banders
---

# Cloud Solution Provider subscription cost and usage details file schema

This article applies to cost and usage details file schema for a Microsoft Partner Agreement where the CSP partner or the customer has selected a subscription or resource group scope.

## Version 2023-12-01-preview

|Column order|Fields|Description|
|------|------|------|
|1|billingAccountName|Name of the billing account.|
|2|partnerName|  Name of the partner Microsoft Entra directory tenant.  |
|3|resellerName|The name of the reseller associated with the subscription.|
|4|resellerMpnId|ID for the reseller associated with the subscription.|
|5|customerTenantId|  Identifier of the Microsoft Entra tenant of the customer's subscription.  |
|6|customerName| Name of the Microsoft Entra tenant for the customer's subscription.   |
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
|18|meterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
|19|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
|20|meterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
|21|meterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
|22|ProductId|Unique identifier for the product.|
|23|ProductName|Name of the product.|
|24|SubscriptionId|Unique identifier for the Azure subscription.|
|25|subscriptionName|Name of the Azure subscription.|
|26|publisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
|27|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|28|publisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
|29|resourceGroupName|Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
|30|ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
|31|resourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
|32|location|The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, US East.|
|33|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|34|quantity|The number of units used by the given product or service for a given day.|
|35|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|36|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|37|billingCurrency|Currency associated with the billing account.|
|38|pricingCurrency|Currency used when rating based on negotiated prices.|
|39|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|40|costInUsd| Cost of the charge in USD currency before credits or taxes. |
|41|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|42|exchangeRateDate|Date the exchange rate was established.|
|43|serviceInfo1|Service-specific metadata.|
|44|serviceInfo2|Legacy field with optional service-specific metadata.|
|45|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|46|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|47|PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|48|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|49|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|50|reservationId|Unique identifier for the purchased reservation instance.|
|51|reservationName|Name of the purchased reservation instance.|
|52|PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
|53|unitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|54|benefitId| Unique identifier for the purchased savings plan instance. |
|55|benefitName| Unique identifier for the purchased savings plan instance. |
|56|provider|Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS.|

## Version 2021-10-01

|Column order|Fields|Description|
|------|------|------|
|1|billingAccountName|Name of the billing account.|
|2|partnerName|  Name of the partner Microsoft Entra directory tenant.  |
|3|resellerName|The name of the reseller associated with the subscription.|
|4|resellerMpnId|ID for the reseller associated with the subscription.|
|5|customerTenantId| Identifier of the Microsoft Entra tenant of the customer's subscription.   |
|6|customerName| Name of the Microsoft Entra tenant for the customer's subscription.   |
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
|18|meterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
|19|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
|20|meterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
|21|meterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
|22|ProductId|Unique identifier for the product.|
|23|ProductName|Name of the product.|
|24|SubscriptionId|Unique identifier for the Azure subscription.|
|25|subscriptionName|Name of the Azure subscription.|
|26|publisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
|27|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|28|publisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
|29|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|30|ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
|31|resourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
|32|location|The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, US East.|
|33|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|34|quantity|The number of units used by the given product or service for a given day.|
|35|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|36|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|37|billingCurrency|Currency associated with the billing account.|
|38|pricingCurrency|Currency used when rating based on negotiated prices.|
|39|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|40|costInUsd| Cost of the charge in USD currency before credits or taxes. |
|41|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|42|exchangeRateDate|Date the exchange rate was established.|
|43|serviceInfo1|Service-specific metadata.|
|44|serviceInfo2|Legacy field with optional service-specific metadata.|
|45|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|46|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|47|PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|48|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|49|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|50|reservationId|Unique identifier for the purchased reservation instance.|
|51|reservationName|Name of the purchased reservation instance.|
|52|PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
|53|unitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|54|benefitId| Unique identifier for the purchased savings plan instance. |
|55|benefitName| Unique identifier for the purchased savings plan instance. |
|56|provider|Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS.|

## Version 2021-01-01

|Column order|Fields|Description|
|------|------|------|
|1|billingAccountName|Name of the billing account.|
|2|partnerName| Name of the partner Microsoft Entra directory tenant.   |
|3|resellerName|The name of the reseller associated with the subscription.|
|4|resellerMpnId|ID for the reseller associated with the subscription.|
|5|customerTenantId| Identifier of the Microsoft Entra tenant of the customer's subscription.   |
|6|customerName| Name of the Microsoft Entra tenant for the customer's subscription.   |
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
|18|meterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
|19|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
|20|meterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
|21|meterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
|22|ProductId|Unique identifier for the product.|
|23|ProductName|Name of the product.|
|24|SubscriptionId|Unique identifier for the Azure subscription.|
|25|subscriptionName|Name of the Azure subscription.|
|26|publisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
|27|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|28|publisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
|29|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|30|ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
|31|resourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
|32|location|The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, US East.|
|33|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|34|quantity|The number of units used by the given product or service for a given day.|
|35|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|36|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|37|billingCurrency|Currency associated with the billing account.|
|38|pricingCurrency|Currency used when rating based on negotiated prices.|
|39|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|40|costInUsd| Cost of the charge in USD currency before credits or taxes. |
|41|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|42|exchangeRateDate|Date the exchange rate was established.|
|43|serviceInfo1|Service-specific metadata.|
|44|serviceInfo2|Legacy field with optional service-specific metadata.|
|45|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|46|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|47|PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|48|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|49|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|50|reservationId|Unique identifier for the purchased reservation instance.|
|51|reservationName|Name of the purchased reservation instance.|
|52|PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
|53|unitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|

## Version 2019-11-01

|Column order|Fields|Description|
|------|------|------|
|1|billingAccountName|Name of the billing account.|
|2|partnerName|  Name of the partner Microsoft Entra directory tenant.  |
|3|resellerName|The name of the reseller associated with the subscription.|
|4|resellerMpnId|ID for the reseller associated with the subscription.|
|5|customerTenantId|  Identifier of the Microsoft Entra tenant of the customer's subscription.  |
|6|customerName|  Name of the Microsoft Entra tenant for the customer's subscription.  |
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
|18|meterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
|19|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
|20|meterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
|21|meterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
|22|ProductId|Unique identifier for the product.|
|23|product| Name of the product.   |
|24|subscriptionId|Unique identifier for the Azure subscription.|
|25|subscriptionName|Name of the Azure subscription.|
|26|publisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
|27|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|28|publisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
|29|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|30|InstanceName|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
|31|resourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
|32|Location|The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, US East.|
|33|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|34|quantity|The number of units used by the given product or service for a given day.|
|35|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|36|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|37|billingCurrency|Currency associated with the billing account.|
|38|pricingCurrency|Currency used when rating based on negotiated prices.|
|39|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|40|costInUsd| Cost of the charge in USD currency before credits or taxes. |
|41|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|42|exchangeRateDate|Date the exchange rate was established.|
|43|serviceInfo1|Service-specific metadata.|
|44|serviceInfo2|Legacy field with optional service-specific metadata.|
|45|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|46|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|47|payGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|48|reservationId|Unique identifier for the purchased reservation instance.|
|49|reservationName|Name of the purchased reservation instance.|
|50|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|51|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|52|unitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|