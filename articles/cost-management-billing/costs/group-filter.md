---
title: Group and filter options in Cost analysis and budgets
titleSuffix: Microsoft Cost Management
description: This article explains how to use group and filter options.
author: bandersmsft
ms.author: banders
ms.date: 03/06/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Group and filter options in Cost analysis and budgets

Cost analysis has many grouping and filtering options. This article helps you understand when to use them.

To watch a video about grouping and filtering options, watch the [Cost Management reporting by dimensions and tags](https://www.youtube.com/watch?v=2Vx7V17zbmk) video. To watch other videos, visit the [Cost Management YouTube channel](https://www.youtube.com/c/AzureCostManagement).

>[!VIDEO https://www.youtube.com/embed/2Vx7V17zbmk]

## Group and filter properties

The following table lists some of the most common grouping and filtering options available in Cost analysis and budgets. See the notes column to learn when to use them.

Some filters are only available to specific offers. For example, a billing profile isn't available for an enterprise agreement. For more information, see [Supported Microsoft Azure offers](understand-cost-mgt-data.md#supported-microsoft-azure-offers).

| Property | When to use | Notes |
| --- | --- | --- |
| **Availability zones** | Break down AWS costs by availability zone. | Applicable only to AWS scopes and management groups. Azure data doesn't include availability zone and will show as **No availability zone**. |
| **Billing period** | Break down PAYG costs by the month that they were, or will be, invoiced. | Use **Billing period** to get a precise representation of invoiced PAYG charges. Include two extra days before and after the billing period if filtering down to a custom date range. Limiting to the exact billing period dates won't match the invoice. Will show costs from all invoices in the billing period. Use **Invoice ID** to filter down to a specific invoice. Applicable only to PAYG subscriptions because EA and MCA are billed by calendar months. EA/MCA accounts can use calendar months in the date picker or monthly granularity to accomplish the same goal. |
| **BillingProfileId** | The ID of the billing profile that is billed for the subscription's charges. | Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| **BillingProfileName** | Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account. | Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| **Charge type** | Break down usage, purchase, refund, and unused reservation and savings plan costs. | Reservation purchases, savings plan purchases, and refunds are available only when using actual costs and not when using amortized costs. Unused reservation and savings plan costs are available only when looking at amortized costs. |
| **Department** | Break down costs by EA department. | Available only for EA and management groups. PAYG subscriptions don't have a department and will show as **No department** or **unassigned**. |
| **Enrollment account** | Break down costs by EA account owner. | Available only for EA billing accounts, departments, and  management groups. PAYG subscriptions don't have EA enrollment accounts and will show as **No enrollment account** or **unassigned**. |
| **Frequency** | Break down usage-based, one-time, and recurring costs. | Indicates whether a charge is expected to repeat. Charges can either happen once **OneTime**, repeat on a monthly or yearly basis **Recurring**, or be based on usage **UsageBased**.|
| **Invoice ID** | Break down costs by billed invoice. | Unbilled charges don't have an invoice ID yet and EA costs don't include invoice details and will show as **No invoice ID**.  |
| **InvoiceSectionId**| Unique identifier for the MCA invoice section. | Unique identifier for the EA department or MCA invoice section. |
| **InvoiceSectionName**| Name of the invoice section. | Name of the EA department or MCA invoice section. |
| **Location** | Break down costs by resource location or region. | Purchases and Marketplace usage may be shown as **unassigned**, or **No resource location**. |
| **Meter** | Break down costs by usage meter. | Purchases and Marketplace usage will show as **unassigned** or **No meter**. Refer to **Charge type** to identify purchases and **Publisher type** to identify Marketplace charges. |
| **Operation** | Break down AWS costs by operation. | Applicable only to AWS scopes and management groups. Azure data doesn't include operation and will show as **No operation** - use **Meter** instead. |
| **Pricing model** | Break down costs by on-demand, reservation, or spot usage. | Purchases show as **OnDemand**. If you see **Not applicable**, group by **Reservation** to determine whether the usage is reservation or on-demand usage and **Charge type** to identify purchases.
| **PartNumber** | The identifier used to get specific meter pricing. | |
| **Product** | Name of the product. | |
| **ProductOrderId** | Unique identifier for the product order | |
| **ProductOrderName** | Unique name for the product order. | |
| **Provider** | Break down costs by the provider type: Azure, Microsoft 365, Dynamics 365, AWS, and so on. | Identifier for product and line of business. |
| **Publisher type** | Break down Microsoft, Azure, AWS, and Marketplace costs. | Values are **Microsoft** for MCA accounts and **Azure** for EA and pay-as-you-go accounts. |
| **Reservation** | Break down costs by reservation. | Any usage or purchases that aren't associated with a reservation will show as **No reservation** or **No values**. Group by **Publisher type** to identify other Azure, AWS, or Marketplace purchases. |
| **ReservationId**| Unique identifier for the purchased reservation instance.  | In actual costs, use ReservationID to know which reservation the charge is for. |
| **ReservationName**| Name of the purchased reservation instance. | In actual costs, use ReservationName to know which reservation the charge is for. |
| **Resource** | Break down costs by resource. | Marketplace purchases show as **Other Marketplace purchases** and Azure purchases, like Reservations and Support charges, show as **Other Azure purchases**. Group by or filter on **Publisher type** to identify other Azure, AWS, or Marketplace purchases. |
| **Resource group** | Break down costs by resource group. | Purchases, tenant resources not associated with subscriptions, subscription resources not deployed to a resource group, and classic resources don't have a resource group and will show as **Other Marketplace purchases**, **Other Azure purchases**, **Other tenant resources**, **Other subscription resources**, **$system**, or **Other charges**. |
| **ResourceId**| Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource. | |
| **Resource type** | Break down costs by resource type. | Type of resource instance. Not all charges come from deployed resources. Charges that don't have a resource type will be shown as null or empty, **Others**, or **Not applicable**. For example, purchases and classic services will show as **others**, **classic services**, or **No resource type**. |
| **ServiceFamily**| Type of Azure service. For example, Compute, Analytics, and Security. | |
| **ServiceName**| Name of the Azure service. | Name of the classification category for the meter. For example, Cloud services and Networking. |
| **Service name** or **Meter category** | Break down cost by Azure service. | Purchases and Marketplace usage will show as **No service name** or **unassigned**. |
| **Service tier** or **Meter subcategory** | Break down cost by Azure usage meter subclassification. | Purchases and Marketplace usage will be empty or show as **unassigned**. |
| **Subscription** | Break down costs by Azure subscription and AWS linked account. | Purchases and tenant resources may show as **No subscription**. |
| **Tag** | Break down costs by tag values for a specific tag key. | Purchases, tenant resources not associated with subscriptions, subscription resources not deployed to a resource group, and classic resources cannot be tagged and will show as **Tags not supported**. Services that don't include tags in usage data will show as **Tags not available**. Any remaining cases where tags aren't specified on a resource will show as **Untagged**. Learn more about [tags support for each resource type](../../azure-resource-manager/management/tag-support.md). |
| **UnitOfMeasure**| The billing unit of measure for the service. For example, compute services are billed per hour. | |

For more information about terms, see [Understand the terms used in the Azure usage and charges file](../understand/understand-usage.md).

## Publisher Type value changes

In Cost Management, the `PublisherType field` indicates whether charges are for Microsoft, Marketplace, or AWS (if you have a [Cross Cloud connector](aws-integration-set-up-configure.md) configured) products.

What changed?

Effective 14 October 2021, the `PublisherType` field with the value `Azure` was updated to `Microsoft` for all customers with a [Microsoft Customer Agreement](../understand/review-customer-agreement-bill.md#check-access-to-a-microsoft-customer-agreement). The change was made to accommodate enhancements to support Microsoft products other than Azure like Microsoft 365 and Dynamics 365.

Values of `Marketplace` and `AWS` remain unchanged.

The change didn't affect customers with an Enterprise Agreement or pay-as-you-go offers.

**Impact and action**
<a name="impact-action"></a>

For any Cost Management data that you've downloaded before 14 October 2021, consider the `PublisherType` change from the older `Azure` and the new `Microsoft` field values. The data could have been downloaded through exports, usage details, or from Cost Management.

If you use Cost Management + Billing REST API calls that filter the `PublisherType` field by the value `Azure`, you need to address the change and filter by the new value `Microsoft` after 14 October 2021. If you make any API calls with a filter for Publisher type = `Azure`, data won't be returned.

There's no impact to Cost analysis or budgets because the changes are automatically reflected in the filters. Any saved views or budgets created with Publisher Type = “Azure” filter will be automatically updated.

## Next steps

- [Start analyzing costs](./quick-acm-cost-analysis.md).
