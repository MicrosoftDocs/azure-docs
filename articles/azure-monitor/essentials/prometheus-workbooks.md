---
title: Query Prometheus metrics using Azure workbooks (preview)
description: Query Prometheus metrics in the portal using Azure Workbooks.
author: aul
ms.topic: conceptual
ms.date: 01/18/2023
---

# Query Prometheus metrics using Azure workbooks (preview)

Using the power of [Azure Workbooks](../visualize/workbooks-overview.md), you can easily create dashboards powered by Azure Monitor managed service for Prometheus.

## Pre-requisites

-	You must either have an Azure Monitor workspace or create a new one.
-	Your Azure Monitor workspace must be [collecting Prometheus metrics](./prometheus-metrics-enable.md) from an AKS cluster.
-	You must have the Monitoring Data Reader role on the Azure Monitor workspace.

> [!NOTE]
> Querying data from an Azure Monitor workspace is a data plane operation, so even if you are an owner or have elevated control plane access, you must assign the Monitoring Data Reader role. Read more about [Azure control and data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md).

## Prometheus Explorer workbook
Every Azure Monitor workspace comes with an out of the box exploration workbook to query your Prometheus metrics. In the lefthand menu, there will be a menu item titled Prometheus Explorer as well as a workbook with the same name in the Workbooks gallery menu item.

![Screenshot that shows Azure Monitor workspace gallery](./media/prometheus-workbooks/prometheus-gallery.png)

Once you select the Prometheus Explorer, it will open up a workbook with the following input options:
-	Time Range
    - Allows you to change how far back you query the metrics
-	PromQL
    - The inputted query for pulling the Prometheus metrics. Learn more about [PromQL](https://aka.ms/azureprometheus-promio-promql).
-	Graph/Grid/Dimensions
    - Toggles between different output types to match your visualization needs

![Screenshot that shows PromQL explorer](./media/prometheus-workbooks/prometheus-explorer.png)

## Create your own Prometheus workbook

Workbooks supports many other great visualizations and Azure integrations, to set up your own workbook, learn more about [creating your own Azure Workbooks](../visualize/workbooks-create-workbook.md).
Azure Workbooks uses [data sources](../visualize/workbooks-data-sources.md#prometheus-preview) to scope the data it pulls from. To query Prometheus metrics:

1.	Open up a new or existing workbook
2.	Select the “+ Add” button and choose “Add query”
3.	Under the Data source parameter, choose the option “Prometheus (preview)”
4.	From the “Azure Monitor workspace” dropdown, pick your workspace
5.	Following that, update the Prometheus query type dropdown to your desired Query Type
6.	In the primary text field, write your PromQL
7.	Using the “Run Query” button at the top, you should now be able to see your data
8.	(optional) Make additional adjustments and customizations using the various options for time range, visualization type, size, and other settings
9.	Once all changes are finalized, select the “Done Editing” at the bottom of the section and save your work

![Screenshot that shows sample PromQL query](./media/prometheus-workbooks/prometheus-query.png)

## Troubleshooting

If you workbook query does not return data:

-	Double check that you have Monitoring Data Reader role permissions assigned through Access Control (IAM) in your Azure Monitor workspace
-	Verify that you have turned on metrics collection in the Monitored clusters blade of your Azure Monitor workspace


