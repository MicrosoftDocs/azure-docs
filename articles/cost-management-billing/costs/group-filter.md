---
title: Group and filter options in Cost analysis and budgets
titleSuffix: Microsoft Cost Management
description: This article explains how to use group and filter options.
author: bandersmsft
ms.author: banders
ms.date: 08/10/2023
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

## Grouping SQL databases and elastic pools

Get an at-a-glance view of your total SQL costs by grouping SQL databases and elastic pools. They're shown under their parent server in the Resources view.

Understanding what you're being charged for can be complicated. The best place to start for many people is the [Resources view](https://aka.ms/costanalysis/resources). It shows resources that are incurring cost. But even a straightforward list of resources can be hard to follow when a single deployment includes multiple, related resources. To help summarize your resource costs, we're trying to group related resources together. So, we're changing cost analysis to show child resources.

Many Azure services use nested or child resources. SQL servers have databases, storage accounts have containers, and virtual networks have subnets. Most of the child resources are only used to configure services, but sometimes the resources have their own usage and charges. SQL databases are perhaps the most common example.

SQL databases are deployed as part of a SQL server instance, but usage is tracked at the database level. Additionally, you might also have charges on the parent server, like for Microsoft Defender for Cloud. To get the total cost for your SQL deployment in classic cost analysis, you need to manually sum up the cost of the server and each individual database. As an example, you can see the **treyanalyticsengine / aepool** elastic pool in the following list and the **treyanalyticsengine / coreanalytics** server under it. What you don't see is another database even lower in the list. You can imagine how troubling this situation would be when you need the total cost of a large server instance with many databases.

Here's an example showing the Cost by resource view where multiple related resource costs aren't grouped.

:::image type="content" source="./media/group-filter/classic-cost-analysis-ungrouped-costs.png" alt-text="Screenshot showing cost analysis where multiple related resource costs aren't grouped." lightbox="./media/group-filter/classic-cost-analysis-ungrouped-costs.png" :::

In the Resources view, the child resources are grouped together under their parent resource. The grouping shows a quick, at-a-glance view of your deployment and its total cost. Using the same subscription, you can now see all three charges grouped together under the server, offering a one-line summary for your total server costs.

Here's an example showing grouped resource costs in the Resources view.

:::image type="content" source="./media/group-filter/cost-analysis-grouped-database-costs.png" alt-text="Screenshot showing grouped resource costs." lightbox="./media/group-filter/cost-analysis-grouped-database-costs.png" :::

You might also notice the change in row count. Classic cost analysis shows 53 rows where every resource is broken out on its own. The Resources view only shows 25 rows. The difference is that the individual resources are being grouped together, making it easier to get an at-a-glance cost summary.

In addition to SQL servers, you also see other services with child resources, like App Service, Synapse, and VNet gateways. Each is similarly shown grouped together in the Resources view.

**Grouping SQL databases and elastic pools is available by default in the Resources view.**

<a name="resourceparent"></a>

## Group related resources in the Resources view

Group related resources, like disks under VMs or web apps under App Service plans, by adding a `cm-resource-parent` tag to the child resources with a value of the parent resource ID. Wait 24 hours for tags to be available in usage and your resources are grouped. Leave feedback to let us know how we can improve this experience further for you.

Some resources have related dependencies that aren't explicit children or nested under the logical parent in Azure Resource Manager. Examples include disks used by a virtual machine or web apps assigned to an App Service plan. Unfortunately, Cost Management isn't aware of these relationships and can't group them automatically. This feature uses tags to summarize the total cost of your related resources together. You see a single row with the parent resource. When you expand the parent resource, you see each linked resource listed individually with their respective cost.

As an example, let's say you have an Azure Virtual Desktop host pool configured with two VMs. Tagging the VMs and corresponding network/disk resources groups them under the host pool, giving you the total cost of the session host VMs in your host pool deployment. This example gets even more interesting if you want to also include the cost of any cloud solutions made available via your host pool.

:::image type="content" source="./media/group-filter/cost-analysis-resource-parent-virtual-desktop.png" alt-text="Screenshot of the cost analysis showing VMs and disks grouped under an Azure Virtual Desktop host pool." lightbox="./media/group-filter/cost-analysis-resource-parent-virtual-desktop.png" :::

Before you link resources together, think about how you'd like to see them grouped. You can only link a resource to one parent and cost analysis only supports one level of grouping today.

Once you know which resources you'd like to group, use the following steps to tag your resources:

1.	Open the resource that you want to be the parent.
2.	Select **Properties** in the resource menu.
3.	Find the **Resource ID** property and copy its value.
4.	Open **All resources** or the resource group that has the resources you want to link.
5.	Select the checkboxes for every resource you want to link and then select the **Assign tags** command.
6.	Specify a tag key of `cm-resource-parent` (make sure it's typed correctly) and paste the resource ID from step 3.
7.	Wait 24 hours for new usage to be sent to Cost Management with the tags. (Keep in mind resources must be actively running with charges for tags to be updated in Cost Management.)
8.	Open the [Resources view](https://aka.ms/costanalysis/resources).
 
Wait for the tags to load in the Resources view and you should now see your logical parent resource with its linked children. If you don't see them grouped yet, check the tags on the linked resources to ensure they're set. If not, check again in 24 hours.

**Grouping related resources is available by default in the Resources view.**


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
