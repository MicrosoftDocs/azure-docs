---
title: Group and filter options in Azure Cost Management
description: This article explains how to use group and filter options in Azure Cost Management.
author: bandersmsft
ms.author: banders
ms.date: 06/08/2020
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Group and filter options in Cost analysis

Cost analysis has many grouping and filtering options. This article helps you understand when to use them.

To watch a video about grouping and filtering options, watch the [Cost Management reporting by dimensions and tags](https://www.youtube.com/watch?v=2Vx7V17zbmk) video. To watch other videos, visit the [Cost Management YouTube channel](https://www.youtube.com/c/AzureCostManagement).

>[!VIDEO https://www.youtube.com/embed/2Vx7V17zbmk]

## Group and filter properties

The following table lists some of the most common grouping and filtering options available in Cost analysis and when you should use them.

| Property | When to use | Notes |
| --- | --- | --- |
| **Availability zones** | Break down AWS costs by availability zone. | Applicable only to AWS scopes and management groups. Azure data doesn't include availability zone and will show as **No availability zone**. |
| **Billing period** | Break down PAYG costs by the month that they were, or will be, invoiced. | Use **Billing period** to get an accurate representation of invoiced PAYG charges. Include 2 extra days before and after the billing period if filtering down to a custom date range. Limiting to the exact billing period dates won't match the invoice. Will show costs from all invoices in the billing period. Use **Invoice ID** to filter down to a specific invoice. Applicable only to PAYG subscriptions because EA and MCA are billed by calendar months. EA/MCA accounts can use calendar months in the date picker or monthly granularity to accomplish the same goal. |
| **Charge type** | Break down usage, purchase, refund, and unused reservation costs. | Reservation purchases and refunds are available only when using actual costs and not when using amortized costs. Unused reservation costs are available only when looking at amortized costs. |
| **Department** | Break down costs by EA department. | Available only for EA and management groups. PAYG subscriptions don't have a department and will show as **No department** or **unassigned**. |
| **Enrollment account** | Break down costs by EA account owner. | Available only for EA billing accounts, departments, and  management groups. PAYG subscriptions don't have EA enrollment accounts and will show as **No enrollment account** or **unassigned**. |
| **Frequency** | Break down usage-based, one-time, and recurring costs. | |
| **Invoice ID** | Break down costs by billed invoice. | Unbilled charges don't have an invoice ID yet and EA costs don't include invoice details and will show as **No invoice ID**.  |
| **Location** | Break down costs by resource location or region. | Purchases and Marketplace usage may be shown as **unassigned**, or **No resource location**. |
| **Meter** | Break down costs by usage meter. | Purchases and Marketplace usage will show as **No meter**. Refer to **Charge type** to identify purchases and **Publisher type** to identify Marketplace charges. |
| **Operation** | Break down AWS costs by operation. | Applicable only to AWS scopes and management groups. Azure data doesn't include operation and will show as **No operation** - use **Meter** instead. |
| **Pricing model** | Break down costs by on-demand, reservation, or spot usage. | Purchases show as **OnDemand**. If you see **Not applicable**, group by **Reservation** to determine whether the usage is reservation or on-demand usage and **Charge type** to identify purchases.
| **Provider** | Break down costs by AWS and Azure. | Available only for management groups. |
| **Publisher type** | Break down AWS, Azure, and Marketplace costs. |  |
| **Reservation** | Break down costs by reservation. | Any usage or purchases that aren't associated with a reservation will show as **No reservation**. Group by **Publisher type** to identify other Azure, AWS, or Marketplace purchases. |
| **Resource** | Break down costs by resource. | Marketplace purchases show as **Other Marketplace purchases** and Azure purchases, like Reservations and Support charges, show as **Other Azure purchases**. Group by or filter on **Publisher type** to identify other Azure, AWS, or Marketplace purchases. |
| **Resource group** | Break down costs by resource group. | Purchases, tenant resources not associated with subscriptions, subscription resources not deployed to a resource group, and classic resources don't have a resource group and will show as **Other Marketplace purchases**, **Other Azure purchases**, **Other tenant resources**, **Other subscription resources**, **$system**, or **Other charges**. |
| **Resource type** | Break down costs by resource type. | Purchases and classic services don't have an Azure Resource Manager resource type and will show as **others**, **classic services**, or **No resource type**. |
| **Service name** or **Meter category** | Break down cost by Azure service. | Purchases and Marketplace usage will show as **No service name** or **unassigned**. |
| **Service tier** or **Meter subcategory** | Break down cost by Azure usage meter subclassification. | Purchases and Marketplace usage will be empty or show as **unassigned**. |
| **Subscription** | Break down costs by Azure subscription and AWS linked account. | Purchases and tenant resources may show as **No subscription**. |
| **Tag** | Break down costs by tag values for a specific tag key. | Purchases, tenant resources not associated with subscriptions, subscription resources not deployed to a resource group, and classic resources cannot be tagged and will show as **Tags not available**. Services that don't include tags in usage data will show as **Tags not supported**. Any remaining cases where tags aren't specified on a resource will show as **Untagged**. Learn more about [tags support for each resource type](../../azure-resource-manager/management/tag-support.md). |

For more information about terms, see [Understand the terms used in the Azure usage and charges file](../understand/understand-usage.md).

## Next steps

- [Start analyzing costs](./quick-acm-cost-analysis.md).
