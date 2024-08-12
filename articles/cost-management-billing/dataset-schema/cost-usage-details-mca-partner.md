---
title: Microsoft Partner Agreement (MPA) cost and usage details file schema
description: Learn about the data fields available in the MPA cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
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
|9|partnerTenantId|Identifier for the partner's Microsoft Entra directory tenant.|
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
|26|meterName|The name of the meter.|
|27|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|28|meterSubCategory|Name of the meter subclassification category.|
|29|meterRegion|Name of the datacenter location for services priced based on location. See Location.|
|30|ProductId|Unique identifier for the product.|
|31|ProductName|Name of the product.|
|32|SubscriptionId|Unique identifier for the Azure subscription.|
|33|subscriptionName|Name of the Azure subscription.|
|34|publisherType|Supported values: Microsoft, Azure, AWS, Marketplace. Values are microsoft for MCA accounts and Azure for EA and pay-as-you-go accounts.|
|35|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|36|publisherName|Publisher for Marketplace services.|
|37|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|38|ResourceId|Unique identifier of the Azure Resource Manager resource.|
|39|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|40|location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|41|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|42|quantity|The number of units purchased or consumed.|
|43|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|44|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|45|billingCurrency|Currency associated with the billing account.|
|46|pricingCurrency|Currency used when rating based on negotiated prices.|
|47|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|48|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|49|costInUsd|  |
|50|paygCostInBillingCurrency|  |
|51|paygCostInUsd|  |
|52|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|53|exchangeRateDate|Date the exchange rate was established.|
|54|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|55|serviceInfo1|Service-specific metadata.|
|56|serviceInfo2|Legacy field with optional service-specific metadata.|
|57|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|58|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|59|partnerEarnedCreditRate|Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access.|
|60|partnerEarnedCreditApplied|Indicates whether the partner earned credit was applied.|
|61|PayGPrice|Retail price for the resource.|
|62|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|63|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|64|reservationId|Unique identifier for the purchased reservation instance.|
|65|reservationName|Name of the purchased reservation instance.|
|66|pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
|67|unitPrice|The price per unit for the charge.|
|68|benefitId|  |
|69|benefitName|  |
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
|9|partnerTenantId|Identifier for the partner's Microsoft Entra directory tenant.|
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
|26|meterName|The name of the meter.|
|27|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|28|meterSubCategory|Name of the meter subclassification category.|
|29|meterRegion|Name of the datacenter location for services priced based on location. See Location.|
|30|ProductId|Unique identifier for the product.|
|31|ProductName|Name of the product.|
|32|SubscriptionId|Unique identifier for the Azure subscription.|
|33|subscriptionName|Name of the Azure subscription.|
|34|publisherType|Supported values: Microsoft, Azure, AWS, Marketplace. Values are microsoft for MCA accounts and Azure for EA and pay-as-you-go accounts.|
|35|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|36|publisherName|Publisher for Marketplace services.|
|37|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|38|ResourceId|Unique identifier of the Azure Resource Manager resource.|
|39|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|40|location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|41|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|42|quantity|The number of units purchased or consumed.|
|43|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|44|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|45|billingCurrency|Currency associated with the billing account.|
|46|pricingCurrency|Currency used when rating based on negotiated prices.|
|47|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|48|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|49|costInUsd|  |
|50|paygCostInBillingCurrency|  |
|51|paygCostInUsd|  |
|52|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|53|exchangeRateDate|Date the exchange rate was established.|
|54|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|55|serviceInfo1|Service-specific metadata.|
|56|serviceInfo2|Legacy field with optional service-specific metadata.|
|57|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|58|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|59|partnerEarnedCreditRate|Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access.|
|60|partnerEarnedCreditApplied|Indicates whether the partner earned credit was applied.|
|61|PayGPrice|Retail price for the resource.|
|62|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|63|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|64|reservationId|Unique identifier for the purchased reservation instance.|
|65|reservationName|Name of the purchased reservation instance.|
|66|pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
|67|unitPrice|The price per unit for the charge.|
|68|benefitId|  |
|69|benefitName|  |
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
|9|partnerTenantId|Identifier for the partner's Microsoft Entra directory tenant.|
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
|26|meterName|The name of the meter.|
|27|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|28|meterSubCategory|Name of the meter subclassification category.|
|29|meterRegion|Name of the datacenter location for services priced based on location. See Location.|
|30|ProductId|Unique identifier for the product.|
|31|ProductName|Name of the product.|
|32|SubscriptionId|Unique identifier for the Azure subscription.|
|33|subscriptionName|Name of the Azure subscription.|
|34|publisherType|Supported values: Microsoft, Azure, AWS, Marketplace. Values are microsoft for MCA accounts and Azure for EA and pay-as-you-go accounts.|
|35|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|36|publisherName|Publisher for Marketplace services.|
|37|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|38|ResourceId|Unique identifier of the Azure Resource Manager resource.|
|39|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|40|location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|41|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|42|quantity|The number of units purchased or consumed.|
|43|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|44|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|45|billingCurrency|Currency associated with the billing account.|
|46|pricingCurrency|Currency used when rating based on negotiated prices.|
|47|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|48|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|49|costInUsd|  |
|50|paygCostInBillingCurrency|  |
|51|paygCostInUsd|  |
|52|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|53|exchangeRateDate|Date the exchange rate was established.|
|54|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|55|serviceInfo1|Service-specific metadata.|
|56|serviceInfo2|Legacy field with optional service-specific metadata.|
|57|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|58|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|59|partnerEarnedCreditRate|Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access.|
|60|partnerEarnedCreditApplied|Indicates whether the partner earned credit was applied.|
|61|PayGPrice|Retail price for the resource.|
|62|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|63|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|64|reservationId|Unique identifier for the purchased reservation instance.|
|65|reservationName|Name of the purchased reservation instance.|
|66|pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
|67|unitPrice|The price per unit for the charge.|

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
|26|meterName|The name of the meter.|
|27|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|28|meterSubCategory|Name of the meter subclassification category.|
|29|meterRegion|Name of the datacenter location for services priced based on location. See Location.|
|30|ProductId|Unique identifier for the product.|
|31|product|Name of the product.|
|32|subscriptionId|Unique identifier for the Azure subscription.|
|33|subscriptionName|Name of the Azure subscription.|
|34|publisherType|Supported values: Microsoft, Azure, AWS, Marketplace. Values are microsoft for MCA accounts and Azure for EA and pay-as-you-go accounts.|
|35|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|36|publisherName|Publisher for Marketplace services.|
|37|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or` Not applicable`.|
|38|InstanceName|Unique identifier of the Azure Resource Manager resource.|
|39|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|40|Location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|41|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|42|quantity|The number of units purchased or consumed.|
|43|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|44|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|45|billingCurrency|Currency associated with the billing account.|
|46|pricingCurrency|Currency used when rating based on negotiated prices.|
|47|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|48|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|49|costInUsd|  |
|50|paygCostInBillingCurrency|  |
|51|paygCostInUsd|  |
|52|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|53|exchangeRateDate|Date the exchange rate was established.|
|54|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|55|serviceInfo1|Service-specific metadata.|
|56|serviceInfo2|Legacy field with optional service-specific metadata.|
|57|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|58|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|59|partnerEarnedCreditRate|Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access.|
|60|partnerEarnedCreditApplied|Indicates whether the partner earned credit was applied.|
|61|payGPrice|Retail price for the resource.|
|62|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|63|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|64|reservationId|Unique identifier for the purchased reservation instance.|
|65|reservationName|Name of the purchased reservation instance.|
|66|unitPrice|The price per unit for the charge.|