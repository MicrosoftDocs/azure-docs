---
title: Monitor Azure Private 5G Core with Azure Monitor platform metrics
description: Information on using Azure Monitor platform metrics to monitor activity and analyze statistics in your private mobile network. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 11/22/2022
ms.custom: template-concept
---

# Monitor Azure Private 5G Core with Azure Monitor platform metrics

*Platform metrics* are measurements over time collected from Azure resources and stored by [Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics). You can use the Azure Monitor Metrics Explorer to analyze metrics in the Azure portal, or the Azure Monitor REST API to query for metrics that you can then store and analyze elsewhere.

Azure Private 5G Core platform metrics are collected at the site level. Once you create a **Mobile Network Site** resource, Azure Monitor automatically starts gathering metrics about the packet core instance. For more information on creating a mobile network site, see [Collect the required information for a site](collect-required-information-for-a-site.md).

Platform metrics are available for monitoring and retrieval for up to 92 days. If you want to store your data for longer, you can retrieve them using the Azure Monitor REST API and save them to a storage account that allows longer data retention; see [Azure Storage](/azure/storage/) for some examples of storage accounts you can use.

If you want to use the Azure portal to analyze your packet core metrics, see [Visualize metrics using the Azure portal](#visualize-metrics-using-the-azure-portal). If you want to retrieve a subset of the available metrics for longer storage periods or for analysis using your tool of choice, see [Retrieve metrics using the Azure Monitor REST API](#retrieve-metrics-using-the-azure-monitor-rest-api).

## Visualize metrics using the Azure portal

You can use the Azure portal to monitor your deployment's health and performance at the site level.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **Sites**.

    :::image type="content" source="media/resource-menu-sites.png" alt-text="Screenshot of the Azure portal showing the Mobile Network resource menu. The Sites option is highlighted.":::

1. Select the site you're interested in monitoring.
1. Select the **Monitoring** tab.
    <!-- TODO: add screenshot -->

Under **Key Metrics**, you should now see the Azure Monitor dashboards displaying important key performance indicators (KPIs), including the number of connected devices and session establishment failures.

You can select individual dashboards to open an expanded view where you can specify details such as the graph's time range and time granularity. You can also create additional dashboards using the platform metrics available. For detailed information on interacting with the Azure Monitor graphics, see [Get started with metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started).

## Retrieve metrics using the Azure Monitor REST API

In addition to the monitoring functionalities offered by the Azure portal, you can retrieve Azure Private 5G Core metrics using the [Azure Monitor REST API](/rest/api/monitor/). Once this data is retrieved, you may want to sava it in a separate data store that allows longer data retention, or use your tools of choice to monitor and analyze your deployment.

As an example, you can export the platform metrics to data storage and processing services such as [Azure Monitor Log Analytics](/azure/azure-monitor/logs/log-analytics-overview), [Azure Storage](/azure/storage/), or [Azure Event Hubs](/azure/event-hubs/). You can also leverage [Azure Managed Grafana](/azure/managed-grafana/) to create a monitoring experience in the cloud mirroring the capabilities of the local [packet core dashboards](packet-core-dashboards.md).

> [!NOTE]
> Exporting mobile network metrics to another application for third-party application integration or longer data retention period may incur extra costs. See the relevant documentation for each tool you want to use to check the pricing information.

Not all metrics displayed in the Azure portal will be available for retrieval using the Azure Monitor REST API. For more information on which mobile network metrics are available, see [Supported metrics with Azure Monitor](/azure/azure-monitor/essentials/metrics-supported).

You can find more information on using the Azure Monitor REST API to construct queries and retrieve metrics at [Azure monitoring REST API walkthrough](/azure/azure-monitor/essentials/rest-api-walkthrough).

## Next steps

- [Learn more about the Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics)
- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)