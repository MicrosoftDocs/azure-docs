---
title: Monitor Azure Managed Grafana metrics
description: Learn how to monitor an Azure Managed Grafana workspace using Azure Monitor's metric chart
author: maud-lv 
ms.author: malev 
ms.service: azure-managed-grafana
ms.topic: how-to 
ms.date: 02/18/2025
#customer intent: I want to monitor my Azure Managed Grafana workspace.
---

# Monitor Azure Managed Grafana using Azure Monitor's metric chart

In this article, you learn how to leverage Azure Monitor's metric chart feature to monitor an Azure Managed Grafana workspace. 

In Azure Monitor, metrics are a series of measured values and counts that are collected and stored over time. These metrics reflect the health and usage statistics of your Azure resources.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana workspace. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md) 

## Supported metrics

The following metrics are available for the Microsoft.Dashboard/grafana resource type.

* *HttpRequestCount*: The number of HTTP requests to the Azure Managed Grafana server.
* *MemoryUsagePercentage*: The Azure Managed Grafana workspace memory usage in percent.

For more details about supported metrics, go to [Supported metrics for Microsoft.Dashboard/grafana](/azure/azure-monitor/reference/supported-metrics/microsoft-dashboard-grafana-metrics).

## Create a metric chart

These metrics can be accessed from your Azure Managed Grafana workspace, from Azure Monitor, and through the Azure Monitor API. The following section details how to create a metric chart in an Azure Managed Grafana workspace, in the Azure portal.

1. Open a Managed Grafana resource and go to **Monitoring** > **Metrics**.
1. Configure your chart:
    * The scope and metric namespace are prepopulated.
    * Select a metric from the list.
    * Select an aggregation type among: **Count**, **Avg**, **Min**, **Max**, **Sum**.
    * Select the time range and granularity that are relevant for your investigation.

   :::image type="content" source="media/monitoring-metrics/metric-chart.png" alt-text="Screenshot of the Azure platform showing a metric chart.":::

1. Optionally create a new alert rule to be notified if the metric you configured exceeds or drops below a threshold, or pin your dashboard to an Azure Dashboard, Grafana workspace or a Workbook.

## Next step

> [!div class="nextstepaction"]
> [Monitor a workspace using diagnostic settings](./how-to-monitor-managed-grafana-workspace.md)
