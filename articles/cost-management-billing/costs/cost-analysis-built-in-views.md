---
title: Use built-in views in Cost analysis
titleSuffix: Microsoft Cost Management
description:  This article helps you understand when to use which view, how each one provides unique insights about your costs and recommended next steps to investigate further.
author: bandersmsft
ms.author: banders
ms.date: 09/09/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: micflan
---

# Use built-in views in Cost analysis

Cost Management includes several tools to help you view and monitor your cloud costs. As you get started, cost analysis is the first one you should familiarize yourself with. And within cost analysis, you'll start with built-in views. This article helps you understand when to use which view, how each one provides unique insights about your costs and recommended next steps to investigate further.

<a name="Resources"></a>
<a name="CostByResource"></a>

## Analyze resource costs

Cost Management offers two views to analyze your resource costs:

- **Cost by resource** (customizable view)
- **Resources** (smart view)

Both views are only available when you have a subscription or resource group scope selected.

The **Cost by resource** customizable view shows a list of all resources. Information is shown in tabular format.

:::image type="content" source="./media/cost-analysis-built-in-views/cost-by-resource.png" alt-text="Screenshot showing an example of the Cost by resource view." lightbox="./media/cost-analysis-built-in-views/cost-by-resource.png" :::

The **Resources** smart view shows a list of all resources, including deleted resources. The view is like the Cost by resource view with the following improvements:

- Optimized performance that loads resources faster.
- Provides smart insights to help you better understand your data, like subscription cost anomalies.
- Includes a simpler custom date range selection with support for relative date ranges.
- Allows you to customize the download to exclude nested details. For example, resources without meters in the Resources view.
- Groups Azure and Marketplace costs for a single resource together on a single row.
- Groups related resources together based on the resource hierarchy in Azure Resource Manager.
- Groups related resources under their logical parent using the `cm-resource-parent` tag (set the value to the parent resource ID). 
- Shows resource types with icons.
- Provides improved troubleshooting details to streamline support.

Use either view to:

- Identify top cost contributors by resource.
- Understand how you're charged for a resource.
- Find the biggest opportunities to save money.
- Stop or delete resources that shouldn't be running.
- Identify significant month-over-month changes.
- Identify and tag untagged resources.

:::image type="content" source="./media/cost-analysis-built-in-views/resources.png" alt-text="Screenshot showing an example of the Resources view." lightbox="./media/cost-analysis-built-in-views/resources.png" :::

<a name="ResourceGroups"></a>

## Analyze resource group costs

The **Resource groups** view separates each resource group in your subscription, management group, or billing account showing nested resources.

Use this view to:

- Identify top cost contributors by resource group.
- Find the biggest opportunities to save money.
- Help perform chargeback by resource group.
- Identify significant month-over-month changes.
- Identify and tag untagged resources using resource group tags.

:::image type="content" source="./media/cost-analysis-built-in-views/resource-groups.png" alt-text="Screenshot showing an example of the Resource groups view." lightbox="./media/cost-analysis-built-in-views/resource-groups.png" :::

<a name="Subscriptions"></a>

## Analyze your subscription costs

The **Subscriptions** view is only available when you have a billing account or management group scope selected. The view separates costs by subscription and resource group.

Use this view to:

- Identify top cost contributors by subscription.
- Find the biggest opportunities to save money.
- Help perform chargeback by resource group.
- Identify significant month-over-month changes.
- Identify and tag untagged resources using resource subscription tags.

:::image type="content" source="./media/cost-analysis-built-in-views/subscriptions.png" alt-text="Screenshot showing an example of the Subscriptions view." lightbox="./media/cost-analysis-built-in-views/subscriptions.png" :::

<a name="Customers"></a>

## Review cost across CSP end customers

The **Customers** view is available for CSP partners when you have a billing account or billing profile scope selected. The view separates costs by customer and subscription.

Use this view to:

- Identify the customers that are incurring the most cost.
- Identify the subscriptions that are incurring the most cost for a specific customer.

<a name="Reservations"></a>

## Review reservation resource utilization

The **Reservations** view provides a breakdown of amortized reservation costs, allowing you to see which resources are consuming each reservation.

The view shows amortized cost for the last 30 days with a breakdown of the resources that utilized each reservation during that time. Any unused portion of the reservation is also available when viewing cost for billing accounts and billing profiles.

Use this view to:

- Identify under-utilized reservations.
- Identify significant month-over-month changes.
- Help perform chargeback for reservations.

### Understand amortized costs

Amortized cost breaks down reservation purchases into daily chunks and spreads them over the duration of the reservation term. For example, instead of seeing a $365 purchase on January 1, you'll see a $1.00 purchase every day from January 1 to December 31. In addition to basic amortization, these costs are also reallocated and associated by using the specific resources that used the reservation. For example, if that $1.00 daily charge was split between two virtual machines, you'd see two $0.50 charges for the day. If part of the reservation isn't utilized for the day, you'd see one $0.50 charge associated with the applicable virtual machine and another $0.50 charge with a charge type of UnusedReservation. Unused reservation costs can be seen only when viewing amortized cost.

Because of the change in how costs are represented, it's important to note that actual cost and amortized cost views will show different total numbers. In general, the total cost of months with a reservation purchase will decrease when viewing amortized costs, and months following a reservation purchase will increase. Amortization is available only for reservation purchases and doesn't apply to any other purchases.

:::image type="content" source="./media/cost-analysis-built-in-views/reservations.png" alt-text="Screenshot showing an example of the Reservations view." lightbox="./media/cost-analysis-built-in-views/reservations.png" :::

<a name="Services"></a>

## Break down product and service costs

The **Services view** shows a list of your services and products. This view is like the Invoice details customizable view. The main difference is that rows are grouped by service, making it simpler to see your total cost at a service level. It also separates individual products you're using in each service.

Use this view to:

- Identify top cost contributors by service.
- Find the biggest opportunities to save money.

:::image type="content" source="./media/cost-analysis-built-in-views/services.png" alt-text="Screenshot showing an example of the Services view." lightbox="./media/cost-analysis-built-in-views/services.png" :::

<a name="AccumulatedCosts"></a>

## Review current cost trends

Use the **Accumulated costs** view to:

- Determine whether your current month's costs are on track with your expectations. For example, forecast, budget, and credit.

:::image type="content" source="./media/cost-analysis-built-in-views/accumulated-costs.png" alt-text="Screenshot showing an example of the Accumulated Costs view." lightbox="./media/cost-analysis-built-in-views/accumulated-costs.png" :::

<a name="CostByService"></a>

## Compare monthly service run rate costs

Use the **Cost by service** view to:

- Review month-over-month changes in cost.

:::image type="content" source="./media/cost-analysis-built-in-views/cost-by-service.png" alt-text="Screenshot showing an example of the Cost by service view." lightbox="./media/cost-analysis-built-in-views/cost-by-service.png" :::

<a name="InvoiceDetails"></a>

## Reconcile invoiced usage charges

Use the **Invoice details** view to:

- Review and reconcile billed charges.

:::image type="content" source="./media/cost-analysis-built-in-views/invoice-details.png" alt-text="Screenshot showing an example of the Invoice details view." lightbox="./media/cost-analysis-built-in-views/invoice-details.png" :::

## Next steps

- Now that you're familiar with using built-in views, read about [Saving and sharing customized views](save-share-views.md).
- Learn about how to [Customize views in cost analysis](customize-cost-analysis-views.md)
