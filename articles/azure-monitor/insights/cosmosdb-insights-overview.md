---
title: Monitor Azure Cosmos DB with Azure Monitor for Cosmos DB| Microsoft Docs
description: This article describes the Azure Monitor for Cosmos DB feature that provides Cosmos DB owners with a quick understanding of performance and utilization issues with their CosmosDB accounts.
ms.subservice: 
ms.topic: conceptual
author: mrbullwinkle    
ms.author: mbullwin
ms.date: 05/11/2020

---

# Explore Azure Monitor for Azure Cosmos DB

Azure Monitor for Azure Cosmos DB provides a view of the overall performance, failures, capacity, and operational health of all your Azure Cosmos DB resources in a unified interactive experience. This article will help you understand the benefits of this new monitoring experience, and how you can modify and adapt the experience to fit the unique needs of your organization.   

## Introduction

Before diving into the experience, you should understand how it presents and visualizes information. 

It delivers:

* **At scale perspective** of your Azure Cosmos DB resources across all your subscriptions in a single location, with the ability to selectively scope to only those subscriptions and resources you are interested in evaluating.

* **Drill down analysis** of a particular Azure CosmosDB resource to help diagnose issues or perform detailed analysis by category - utilization, failures, capacity, and operations. Selecting any one of those options provides an in-depth view of the relevant Azure Cosmos DB metrics.  

* **Customizable** - This experience is built on top of Azure Monitor workbook templates allowing you to change what metrics are displayed, modify or set thresholds that align with your limits, and then save into a custom workbook. Charts in the workbooks can then be pinned to Azure dashboards.  

This feature does not require you to enable or configure anything, these Azure Cosmos DB metrics are collected by default.

>[!NOTE]
>There is no charge to access this feature and you will only be charged for the Azure Monitor essential features you configure or enable, as described on the [Azure Monitor pricing details](https://azure.microsoft.com/pricing/details/monitor/) page.

## View utilization and performance metrics for Azure Cosmos DB

To view the utilization and performance of your storage accounts across all of your subscriptions, perform the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Monitor** and select **Monitor**.

    ![Search box with the word "Monitor" and a dropdown that says Services "Monitor" with a speedometer style image](./media/cosmosdb-insights-overview/search-monitor.png)

3. Select **Cosmos DB**.

    ![Screenshot of Cosmos DB overview workbook](./media/cosmosdb-insights-overview/cosmos-db.png)

### Overview

On **Overview**, the table displays interactive Azure Cosmos DB metrics. You can filter the results based on the options you select from the following drop-down lists:

* **Subscriptions** - only subscriptions that have an Azure Cosmos DB resource are listed.  

* **Cosmos DB** - You can select all, a subset, or single Azure Cosmos DB resource.

* **Time Range** - by default, displays the last 4 hours of information based on the corresponding selections made.

The counter tile under the drop-down lists rolls-up the total number of Azure Cosmos DB resources are in the selected subscriptions. There is conditional color-coding or heatmaps for columns in the workbook that report transaction metrics. The deepest color has the highest value and a lighter color is based on the lowest values. 

Selecting a drop-down arrow next to one of the Azure Cosmos DB resources will reveal a breakdown of the performance metrics at the individual database container level:

![Expanded drop down revealing individual database containers and associated performance breakdown](./media/cosmosdb-insights-overview/container-view.png)

Selecting the Azure Cosmos DB resource name highlighted in blue will take you to the default **Overview** for the associated Azure Cosmos DB account. 

### Failures

Select **Failures** at the top of the page and the **Failures** portion of the workbook template opens. It shows you  total requests with the distribution of responses that make up those requests:

![Screenshot of failures with breakdown by HTTP request type](./media/cosmosdb-insights-overview/failures.png)

| Code 		|  Description       | 
|-----------|:--------------------|
| `200 OK`	| One of the following REST operations were successful: </br>- GET on a resource. </br> - PUT on a resource. </br> - POST on a resource. </br> - POST on a stored procedure resource to execute the stored procedure.|
| `201 Created` | A POST operation to create a resource is successful. |
| `404 Not Found` | The operation is attempting to act on a resource that no longer exists. For example, the resource may have already been deleted. |

For a full list of status codes, consult the [Azure Cosmos DB HTTP status code article](https://docs.microsoft.com/rest/api/cosmos-db/http-status-codes-for-cosmosdb).

### Capacity

Select **Capacity** at the top of the page and the **Capacity** portion of the workbook template opens. It shows you how many documents you have, your document growth over time, data usage, and the total amount of available storage that you have left.  This can be used to help identify potential storage and data utilization issues.

![Capacity workbook](./media/cosmosdb-insights-overview/capacity.png) 

As with the overview workbook, selecting the drop-down next to an Azure Cosmos DB resource in the **Subscription** column will reveal a breakdown by the individual containers that make up the database.

### Operations 

Select **Operations** at the top of the page and the **Operations** portion of the workbook template opens. It gives you the ability to see your requests broken down by the type of requests made. 

So in the example below you see that `eastus-billingint` is predominantly receiving read requests, but with a small number of upsert and create requests. Whereas `westeurope-billingint` is read-only from a request perspective, at least over the past four hours that the workbook is currently scoped to via its time range parameter.

![Operations workbook](./media/cosmosdb-insights-overview/operation.png) 

## Pin, export, and expand

You can pin any one of the metric sections to an [Azure Dashboard](https://docs.microsoft.com/azure/azure-portal/azure-portal-dashboards) by selecting the pushpin icon at the top right of the section.

![Metric section pin to dashboard example](./media/cosmosdb-insights-overview/pin.png)

To export your data into the Excel format, select the down arrow icon to the left of the pushpin 
icon.

![Export workbook icon](./media/cosmosdb-insights-overview/export.png)

To expand or collapse all drop-down views in the workbook, select the expand icon to the left of the export icon:

![Expand workbook icon](./media/cosmosdb-insights-overview/expand.png)

## Customize Azure Monitor for Azure Cosmos DB

Since this experience is built on top of Azure Monitor workbook templates, you have the ability to **Customize** > **Edit** and **Save** a copy of your modified version into a custom workbook. 

![Customize bar](./media/cosmosdb-insights-overview/customize.png)

Workbooks are saved within a resource group, either in the **My Reports** section that's private to you or in the **Shared Reports** section that's accessible to everyone with access to the resource group. After you save the custom workbook, you need to go to the workbook gallery to launch it.

![Launch workbook gallery from command bar](./media/cosmosdb-insights-overview/gallery.png)

## Next steps

* Configure [metric alerts](../platform/alerts-metric.md) and [service health notifications](../../service-health/alerts-activity-log-service-notifications.md) to set up automated alerting to aid in detecting issues.

* Learn the scenarios workbooks are designed to support, how to author new and customize existing reports, and more by reviewing [Create interactive reports with Azure Monitor workbooks](../platform/workbooks-overview.md).
