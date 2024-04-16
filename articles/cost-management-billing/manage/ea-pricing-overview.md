---
title: Azure EA pricing
description: This article provides a pricing overview for Azure enterprise customers.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: conceptual
ms.date: 03/07/2024
ms.author: banders
---

# Azure EA pricing

This article provides a pricing overview for Azure enterprise customers. It also provides details on how usage is calculated. It answers many frequently asked questions about charges for various Azure services in an Enterprise Agreement where the calculations are more complex.

## Price protection

As a customer or a channel partner, you're guaranteed to receive prices at or below the:

- Prices shown on your Customer Price Sheet (CPS)
- Prices in effect on the coverage start date of your Azure purchase

The price is referred to as the baseline price. Here are more details about the coverage start date:

  - The coverage start date is based on the usage date for the purchase order. If the usage date is the first day of the month, the coverage start date is the first day of that month. If the usage date is the second day of the month or later, the coverage start date is the first day of the *following month*. If you need to backdate the coverage date, contact your partner or Software Advisor.

  - The price guarantee start date is set in the month of the coverage start date if you purchased Azure Prepayment more than 30 days from the agreement start date.  

    For example, assume you purchased prepayment with a coverage start date of April 1, 2023. Your agreement start date is March 1, 2023. The gap between the coverage start date and the agreement start date is **more than 30 days**. So, your price guarantee start date is set to April 1, 2023.

  - The price guarantee start date is set in the month before the coverage start date if you purchased Monetary commitment within the first 30 days of the agreement start date.

    For example, assume you purchased prepayment with a coverage start date of April 1, 2023. Your agreement start date is March 27, 2023. The gap between the coverage start date and the agreement start date is less than 30 days. So, your price guarantee start date is set to March 1, 2023.  

    If you have questions about price protection, contact your partner or Software Advisor.

For services introduced after your Azure purchase, you're charged the price that's in effect at the applicable level discount when the service is first introduced. The price protection applies during your Prepayment term - one or three years depending upon your Enterprise Agreement. For more information about prepayment provisioning, see [Azure EA agreements and amendments](ea-portal-agreements.md#enrollment-provisioning-status).

## Price changes

Microsoft might drop the current Enterprise Agreement price for individual Azure services during the term of an enrollment. We extend these reduced rates to existing customers while the lower price is in effect. If these rates increase later, your enrollment's price for a service doesn't increase beyond your price protection ceiling as defined previously. However, the rate might increase relative to the prior lowered price. In either case, we inform customers and indirect channel partners of upcoming price changes by emailing the Enterprise and Partner administrators associated with the enrollment.

## Current effective pricing

Customer and channel partners can view their current pricing for an enrollment by signing in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). Then view the price sheet page for that enrollment. Direct EA customers can now view and download **price sheet** in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). See [view price sheet](ea-pricing.md#download-pricing-for-an-enterprise-agreement).

If you purchase Azure indirectly through one of our channel partners, you must get your pricing updates from your channel partner unless they enabled markup pricing to be displayed for your enrollment.

## Introduction of new Azure services

We're continually enhancing Azure and periodically add new services that are priced separately from existing services. Some preview services are automatically available, while others require customer action in the [Azure Account portal](https://account.windowsazure.com/PreviewFeatures).

Some services start out with promotional pricing in effect when first introduced which might be increased at a future date.

As services move from preview to general availability (GA), prices might increase as full performance and reliability service level agreements (SLAs) are applied. Such an increase isn't limited by normal baseline price protection. Usage of those services is charged at the increased rate. To avoid charges related to new services, you must opt out of using them.

## Introduction of regional pricing

In addition to adding new services, services also periodically change from a single global basis to a more regional model, as regional support for those services is increased.

When regionalization of a service is first introduced, baseline price protection applies for those new regions. However, if other regions for that same service are introduced at a later time, they're considered new service. They're offered at their own individual rates independent of the baseline price protection.

## Enterprise Dev/Test

Enterprise administrators can create subscriptions. They can also enable account owners to create subscriptions based on the Enterprise Dev/Test offer. The account owner must set up the Enterprise Dev/Test subscriptions that are needed for the underlying  subscribers. This configuration allows active Visual Studio subscribers to run development and testing workloads on Azure at special Enterprise Dev/Test rates. For more information, see [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/).

## Credit process

- EA customers are eligible to receive service credit when they experience an SLA breach or a system issue that affects their Azure services.
- Service credit isn’t a refund issued as cash. Instead, service credit is issued in the form of a credit that can be applied to future Azure usage.
- To request a service credit, indirect EA customers must contact their partner administrator, who is the authorized representative of the EA enrollment.


## Next steps

- Learn more about EA administrative tasks at [EA Billing administration on the Azure portal](direct-ea-administration.md).
