---
title: Monitor Azure Private 5G Core metrics with Azure Monitor
description: Information on using Azure Monitor to monitor activity and analyze statistics in your private mobile network. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 11/22/2022
ms.custom: template-concept
---

# Monitor Azure Private 5G Core metrics with Azure Monitor

You can use the [Azure Monitor](/azure/azure-monitor/) to collect and analyze Azure Private 5G Core logs and metrics in the cloud.

- Logs are records of events collected by [Azure Monitor Logs](/azure/azure-monitor/logs/data-platform-logs). You can use Log Analytics to query for Azure Private 5G Core logs and monitor activity in your private mobile network.
- Metrics are measurements over time stored by [Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics). You can use the Azure Monitor Metrics Explorer to analyze metrics in the Azure portal, or the Azure Monitor REST API to query for metrics which you can then analyze elsewhere.

This article covers monitoring Azure Private 5G Core metrics in the cloud using the Azure Monitor. For more information on monitoring Azure Private 5G Core logs in the cloud, see [Monitor Azure Private 5G Core Preview with Log Analytics](monitor-private-5g-core-with-log-analytics.md). For more information on monitoring Azure Private 5G Core metrics locally, see [Packet core dashboards](packet-core-dashboards.md).

Azure Private 5G Core metrics are collected at the site level. Once you create a **Mobile Network Site** resource, Azure Monitor automatically starts gathering metrics about the packet core instance. For more information on creating a mobile network site, see [Collect the required information for a site](collect-required-information-for-a-site.md).

If you want to use the Azure portal to analyze your packet core metrics, see [Visualize metrics with the Azure portal](#visualize-metrics-with-the-azure-portal). If you want to retrieve a subset of the available metrics for analysis using your tool of choice, see [Retrieve metrics using the Azure Monitor REST API](#retrieve-metrics-using-the-azure-monitor-rest-api).

## Visualize metrics with the Azure portal

You can use the Azure portal to monitor your deployment's health and performance at the site level.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **Sites**.
1. Select the site you're interested in monitoring.
    <!-- TODO: add screenshot -->
1. Select the **Monitoring** tab.
    <!-- TODO: add screenshot -->

Under **Key Metrics**, you should now see the Azure Monitor dashboards displaying important key performance indicators (KPIs), including the number of connected devices and throughput. For detailed information on interacting with the Azure Monitor graphics, see [Get started with metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started).

<!-- TODO: add screenshot -->

## Retrieve metrics using the Azure Monitor REST API

In addition to the monitoring functionalities offered by the Azure portal, you can retrieve Azure Private 5G Core metrics using the [Azure Monitor REST API](/rest/api/monitor/). Once this data is retrieved, you can sava it in a separate data store and use your tools of choice to monitor and analyze your deployment. 

You can find more information on using the Azure Monitor REST API to construct queries and retrieve metrics at [Azure monitoring REST API walkthrough](/azure/azure-monitor/essentials/rest-api-walkthrough). The following are some example queries you can run to retrieve metrics relating to KPIs for your private mobile network. You should run all of these queries at the scope of the **Kubernetes - Azure Arc** resource that represents the Kubernetes cluster on which your packet core instance is running.

<!-- TODO: Add example queries -->

Not all metrics displayed in the Azure portal will be available for retrieval using the Azure Monitor REST API. For more information on which metrics are available, see [Supported metrics with Azure Monitor](/azure/azure-monitor/essentials/metrics-supported). <!-- TODO: link directly to MobileNetwork metrics once manifest is merged. -->

## Next steps

- [Learn more about the Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics)
- [Monitor Azure Private 5G Core Preview with Log Analytics](monitor-private-5g-core-with-log-analytics.md)