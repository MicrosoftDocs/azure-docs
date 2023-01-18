---
title: Query Prometheus metrics using Azure workbooks (preview)
description: Query Prometheus metrics in the portal using Azure Workbooks.
author: EdB-MSFT
ms.topic: conceptual
ms.date: 01/18/2023
ms.author: edbaynash
---

# Query Prometheus metrics using Azure workbooks (preview)

Create dashboards powered by Azure Monitor managed service for Prometheus using [Azure Workbooks](../visualize/workbooks-overview.md).
This article introduces workbooks for Azure Monitor workspaces and shows you how to query Prometheus metrics using Azure workbooks and PromQL query language.

## Pre-requisites
To query Prometheus metrics from an Azure Monitor workspace you need the following:
-	An Azure Monitor workspace. To create an Azure Monitor workspace see [Create an Azure Monitor Workspace](./azure-monitor-workspace-overview?tabs=azure-portal.md#create-an-azure-monitor-workspace)
-	Your Azure Monitor workspace must be [collecting Prometheus metrics](./prometheus-metrics-enable.md) from an AKS cluster.
-	You have the Monitoring Data Reader role assigned for the Azure Monitor workspace.

> [!NOTE]
> Querying data from an Azure Monitor workspace is a data plane operation. Even if you are an owner or have elevated control plane access, you still need to assign the Monitoring Data Reader role. For more information, see [Azure control and data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md).

## Prometheus Explorer workbook
Azure Monitor workspaces include an exploration workbook to query your Prometheus metrics. 

1. From the Azure Monitor workspace overviw page, select **Workbooks**
1. Select the **Prometheus Explorer** workbook tile.

![Screenshot that shows Azure Monitor workspace gallery](./media/prometheus-workbooks/prometheus-gallery.png)

A workbook has the following input options:
-	**Time Range**. Select the nuber of hours or days  that you want to include in your query. Select *Custom* to set a start and end time.
-	**PromQL**. Enter the PromQL query to retrieve your data. For more information about PromQL, see Querying Prometheus]](https://prometheus.io/docs/prometheus/latest/querying/basics/#querying-prometheus).
-	**Graph**, **Grid**, and **Dimensions** tabs. Swithc between a graphic , tabular and dimensional view of the query output.

![Screenshot that shows PromQL explorer](./media/prometheus-workbooks/prometheus-explorer.png)

>>>>>>>>>>https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-getting-started
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


