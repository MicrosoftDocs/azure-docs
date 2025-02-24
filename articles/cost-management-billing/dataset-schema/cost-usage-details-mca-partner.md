---
title: Microsoft Partner Agreement (MPA) cost and usage details file schema
description: Learn about the data fields available in the MPA cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/24/2025
ms.author: banders
---

# Microsoft Partner Agreement cost and usage details file schema

This article applies to cost and usage details file schema for Microsoft Partner Agreement where the CSP partner has selected any of the billing scopes - Billing Account, Billing Profile or Customer scope.

## Version 2023-12-01-preview

|Column order|Fields|Description|
|------|------|------|
|1|invoiceId|The unique document ID listed on the invoice PDF.|
|2|previousInvoiceId|Reference to an original invoice if the line item is a refund.|
|3|billingAccountId|Unique identifier for the root billing account.|
|4|billingAccountName|Name of the billing account.|
|5|billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|6|billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|7|invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
|8|invoiceSectionName|Name of the EA department or MCA invoice section.|
|9|partnerTenantId|Identifier for the partner's Microsoft Entra tenant.|
|10|partnerName|Name of the partner Microsoft Entra directory tenant.|
|11|resellerName|The name of the reseller associated with the subscription.|
|12|resellerMpnId|ID for the reseller associated with the subscription.|
|13|customerTenantId|Identifier of the Microsoft Entra directory tenant of the customer's subscription.|
|14|customerName|Name of the Microsoft Entra directory tenant for the customer's subscription.|
|15|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|16|billingPeriodEndDate|The end date of the billing period.|
|17|billingPeriodStartDate|The start date of the billing period.|
|18|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|19|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|20|date|The usage or purchase date of the charge.|
|21|serviceFamily|Service family that the service belongs to.|
|22|productOrderId|Unique identifier for the product order.|
|23|productOrderName|Unique name for the product order.|
|24|consumedService|Name of the service the charge is associated with.|
|25|meterId|The unique identifier for the meter.|
|26|meterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
|27|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
|28|meterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
|29|meterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
|30|ProductId|Unique identifier for the product.|
|31|ProductName|Name of the product.|
|32|SubscriptionId|Unique identifier for the Azure subscription.|
|33|subscriptionName|Name of the Azure subscription.|
|34|publisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`..|
|35|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|36|publisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
|37|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|38|ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
|39|resourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
|40|location|The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, US East.|
|41|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|42|quantity|The number of units used by the given product or service for a given day.|
|43|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|44|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|45|billingCurrency|Currency associated with the billing account.|
|46|pricingCurrency|Currency used when rating based on negotiated prices.|
|47|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|48|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|49|costInUsd| Cost of the charge in USD currency before credits or taxes. |
|50|paygCostInBillingCurrency| The amount of Pay-As-You-Go (PayG) cost before tax in billing currency. You can compute `paygCostInBillingCurrency` by multiplying `PayGPrice`, `quantity` and `exchangeRatePricingToBilling`.   |
|51|paygCostInUsd| The amount of Pay-As-You-Go (PayG) cost before tax in USD currency. You can compute `paygCostInUsd` by multiplying `PayGPrice` and `quantity`.  |
|52|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|53|exchangeRateDate|Date the exchange rate was established.|
|54|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|55|serviceInfo1|Service-specific metadata.|
|56|serviceInfo2|Legacy field with optional service-specific metadata.|
|57|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|58|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|59|partnerEarnedCreditRate|Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access.|
|60|partnerEarnedCreditApplied|Indicates whether the partner earned credit was applied.|
|61|PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|62|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|63|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|64|reservationId|Unique identifier for the purchased reservation instance.|
|65|reservationName|Name of the purchased reservation instance.|
|66|PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
|67|unitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|68|benefitId| Unique identifier for the purchased savings plan instance. |
|69|benefitName| Unique identifier for the purchased savings plan instance. |
|70|provider|Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS.|

## Version 2021-10-01

|Column order|Fields|Description|
|------|------|------|
|1|invoiceId|The unique document ID listed on the invoice PDF.|
|2|previousInvoiceId|Reference to an original invoice if the line item is a refund.|
|3|billingAccountId|Unique identifier for the root billing account.|
|4|billingAccountName|Name of the billing account.|
|5|billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|6|billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|7|invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
|8|invoiceSectionName|Name of the EA department or MCA invoice section.|
|9|partnerTenantId|Identifier for the partner's Microsoft Entra tenant.|
|10|partnerName|Name of the partner Microsoft Entra directory tenant.|
|11|resellerName|The name of the reseller associated with the subscription.|
|12|resellerMpnId|ID for the reseller associated with the subscription.|
|13|customerTenantId|Identifier of the Microsoft Entra directory tenant of the customer's subscription.|
|14|customerName|Name of the Microsoft Entra directory tenant for the customer's subscription.|
|15|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|16|billingPeriodEndDate|The end date of the billing period.|
|17|billingPeriodStartDate|The start date of the billing period.|
|18|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|19|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|20|date|The usage or purchase date of the charge.|
|21|serviceFamily|Service family that the service belongs to.|
|22|productOrderId|Unique identifier for the product order.|
|23|productOrderName|Unique name for the product order.|
|24|consumedService|Name of the service the charge is associated with.|
|25|meterId|The unique identifier for the meter.|
|26|meterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
|27|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
|28|meterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
|29|meterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
|30|ProductId|Unique identifier for the product.|
|31|ProductName|Name of the product.|
|32|SubscriptionId|Unique identifier for the Azure subscription.|
|33|subscriptionName|Name of the Azure subscription.|
|34|publisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
|35|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|36|publisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
|37|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|38|ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
|39|resourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
|40|location|The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, US East.|
|41|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|42|quantity|The number of units used by the given product or service for a given day.|
|43|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|44|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|45|billingCurrency|Currency associated with the billing account.|
|46|pricingCurrency|Currency used when rating based on negotiated prices.|
|47|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|48|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|49|costInUsd| Cost of the charge in USD currency before credits or taxes. |
|50|paygCostInBillingCurrency| The amount of Pay-As-You-Go (PayG) cost before tax in billing currency. You can compute `paygCostInBillingCurrency` by multiplying `PayGPrice`, `quantity` and `exchangeRatePricingToBilling`. |
|51|paygCostInUsd| The amount of Pay-As-You-Go (PayG) cost before tax in USD currency. You can compute `paygCostInUsd` by multiplying `PayGPrice` and `quantity`. |
|52|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|53|exchangeRateDate|Date the exchange rate was established.|
|54|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|55|serviceInfo1|Service-specific metadata.|
|56|serviceInfo2|Legacy field with optional service-specific metadata.|
|57|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|58|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|59|partnerEarnedCreditRate|Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access.|
|60|partnerEarnedCreditApplied|Indicates whether the partner earned credit was applied.|
|61|PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|62|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|63|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|64|reservationId|Unique identifier for the purchased reservation instance.|
|65|reservationName|Name of the purchased reservation instance.|
|66|PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
|67|unitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|68|benefitId| Unique identifier for the purchased savings plan instance. |
|69|benefitName| Unique identifier for the purchased savings plan instance. |
|70|provider|Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS.|

## Version 2021-01-01

|Column order|Fields|Description|
|------|------|------|
|1|invoiceId|The unique document ID listed on the invoice PDF.|
|2|previousInvoiceId|Reference to an original invoice if the line item is a refund.|
|3|billingAccountId|Unique identifier for the root billing account.|
|4|billingAccountName|Name of the billing account.|
|5|billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|6|billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|7|invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
|8|invoiceSectionName|Name of the EA department or MCA invoice section.|
|9|partnerTenantId|Identifier for the partner's Microsoft Entra tenant.|
|10|partnerName|Name of the partner Microsoft Entra directory tenant.|
|11|resellerName|The name of the reseller associated with the subscription.|
|12|resellerMpnId|ID for the reseller associated with the subscription.|
|13|customerTenantId|Identifier of the Microsoft Entra directory tenant of the customer's subscription.|
|14|customerName|Name of the Microsoft Entra directory tenant for the customer's subscription.|
|15|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|16|billingPeriodEndDate|The end date of the billing period.|
|17|billingPeriodStartDate|The start date of the billing period.|
|18|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|19|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|20|date|The usage or purchase date of the charge.|
|21|serviceFamily|Service family that the service belongs to.|
|22|productOrderId|Unique identifier for the product order.|
|23|productOrderName|Unique name for the product order.|
|24|consumedService|Name of the service the charge is associated with.|
|25|meterId|The unique identifier for the meter.|
|26|meterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
|27|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
|28|meterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
|29|meterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
|30|ProductId|Unique identifier for the product.|
|31|ProductName|Name of the product.|
|32|SubscriptionId|Unique identifier for the Azure subscription.|
|33|subscriptionName|Name of the Azure subscription.|
|34|publisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
|35|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|36|publisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
|37|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|38|ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
|39|resourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
|40|location|The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, US East.|
|41|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|42|quantity|The number of units used by the given product or service for a given day.|
|43|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|44|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|45|billingCurrency|Currency associated with the billing account.|
|46|pricingCurrency|Currency used when rating based on negotiated prices.|
|47|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|48|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|49|costInUsd| Cost of the charge in USD currency before credits or taxes. |
|50|paygCostInBillingCurrency| The amount of Pay-As-You-Go (PayG) cost before tax in billing currency. You can compute `paygCostInBillingCurrency` by multiplying `PayGPrice`, `quantity` and `exchangeRatePricingToBilling`. |
|51|paygCostInUsd| The amount of Pay-As-You-Go (PayG) cost before tax in USD currency. You can compute `paygCostInUsd` by multiplying `PayGPrice` and `quantity`. |
|52|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|53|exchangeRateDate|Date the exchange rate was established.|
|54|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|55|serviceInfo1|Service-specific metadata.|
|56|serviceInfo2|Legacy field with optional service-specific metadata.|
|57|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|58|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|59|partnerEarnedCreditRate|Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access.|
|60|partnerEarnedCreditApplied|Indicates whether the partner earned credit was applied.|
|61|PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|62|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|63|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|64|reservationId|Unique identifier for the purchased reservation instance.|
|65|reservationName|Name of the purchased reservation instance.|
|66|PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
|67|unitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|

## Version 2019-11-01

|Column order|Fields|Description|
|------|------|------|
|1|invoiceId|The unique document ID listed on the invoice PDF.|
|2|previousInvoiceId|Reference to an original invoice if the line item is a refund.|
|3|billingAccountId|Unique identifier for the root billing account.|
|4|billingAccountName|Name of the billing account.|
|5|billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|6|billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|7|invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
|8|invoiceSectionName|Name of the EA department or MCA invoice section.|
|9|partnerTenantId|Identifier for the partner's Microsoft Entra tenant.|
|10|partnerName|Name of the partner Microsoft Entra tenant.|
|11|resellerName|The name of the reseller associated with the subscription.|
|12|resellerMpnId|ID for the reseller associated with the subscription.|
|13|customerTenantId|Identifier of the Microsoft Entra tenant of the customer's subscription.|
|14|customerName|Name of the Microsoft Entra tenant for the customer's subscription.|
|15|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|16|billingPeriodEndDate|The end date of the billing period.|
|17|billingPeriodStartDate|The start date of the billing period.|
|18|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|19|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|20|date|The usage or purchase date of the charge.|
|21|serviceFamily|Service family that the service belongs to.|
|22|productOrderId|Unique identifier for the product order.|
|23|productOrderName|Unique name for the product order.|
|24|consumedService|Name of the service the charge is associated with.|
|25|meterId|The unique identifier for the meter.|
|26|meterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
|27|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
|28|meterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
|29|meterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
|30|ProductId|Unique identifier for the product.|
|31|product|Name of the product.|
|32|subscriptionId|Unique identifier for the Azure subscription.|
|33|subscriptionName|Name of the Azure subscription.|
|34|publisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
|35|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|36|publisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
|37|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|38|InstanceName|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
|39|resourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
|40|Location|The normalized location used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs). The normalized location is based strictly on the resource location sent by RPs in usage data and is programmatically normalized to mitigate inconsistencies. Purchases and Marketplace usage might be shown as blank or unassigned. For example, US East.|
|41|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|42|quantity|The number of units used by the given product or service for a given day.|
|43|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|44|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|45|billingCurrency|Currency associated with the billing account.|
|46|pricingCurrency|Currency used when rating based on negotiated prices.|
|47|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|48|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|49|costInUsd| Cost of the charge in USD currency before credits or taxes. |
|50|paygCostInBillingCurrency| The amount of Pay-As-You-Go (PayG) cost before tax in billing currency. You can compute `paygCostInBillingCurrency` by multiplying `PayGPrice`, `quantity` and `exchangeRatePricingToBilling`. |
|51|paygCostInUsd| The amount of Pay-As-You-Go (PayG) cost before tax in USD currency. You can compute `paygCostInUsd` by multiplying `PayGPrice` and `quantity`. |
|52|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|53|exchangeRateDate|Date the exchange rate was established.|
|54|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|55|serviceInfo1|Service-specific metadata.|
|56|serviceInfo2|Legacy field with optional service-specific metadata.|
|57|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|58|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|59|partnerEarnedCreditRate|Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access.|
|60|partnerEarnedCreditApplied|Indicates whether the partner earned credit was applied.|
|61|payGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
|62|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|63|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|64|reservationId|Unique identifier for the purchased reservation instance.|
|65|reservationName|Name of the purchased reservation instance.|
|66|unitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|