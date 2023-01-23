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

*Platform metrics* are measurements over time collected from Azure resources and stored by [Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics). You can use the Azure Monitor Metrics Explorer to analyze metrics in the Azure portal, or query the Azure Monitor REST API for metrics to analyze with third-party monitoring tools.

Azure Private 5G Core platform metrics are collected per site and allow you to monitor key statistics relating to your deployment. For more information on which mobile network metrics are available, see [Supported metrics with Azure Monitor](/azure/azure-monitor/essentials/metrics-supported). 

Once you create a **Mobile Network Site** resource, Azure Monitor automatically starts gathering metrics about the packet core instance. For more information on creating a mobile network site, see [Collect the required information for a site](collect-required-information-for-a-site.md).

Platform metrics are available for monitoring and retrieval for up to 92 days. If you want to store your data for longer, you can export them using the Azure portal or the Azure Monitor REST API. Once exported, metrics can be saved to a storage account that allows longer data retention. See [Azure Storage](/azure/storage/) for some examples of storage accounts you can use.

If you want to use the Azure portal to analyze your packet core metrics, see [Visualize metrics using the Azure portal](#visualize-metrics-using-the-azure-portal). You can export metrics to a set of [destinations](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring&tabs=portal#destinations) by following [Export metrics using the Azure portal](#export-metrics-using-the-azure-portal).

If you want to retrieve metrics for analysis using your tool of choice or for longer storage periods, see [Retrieve metrics using the Azure Monitor REST API](#retrieve-metrics-using-the-azure-monitor-rest-api).

## Visualize metrics using the Azure portal

You can use the Azure portal to monitor your deployment's health and performance on the **Mobile Network Site** resource's **Overview** page.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **Sites**.
1. Select the site you're interested in monitoring.

    :::image type="content" source="media/mobile-network-sites.png" alt-text="Screenshot of the Azure portal showing the Sites view in the Mobile Network resource.":::

1. Select the **Monitoring** tab.

    :::image type="content" source="media/platform-metrics-dashboard.png" alt-text="Screenshot of the Azure portal showing the Site resource's Monitoring tab.":::

You should now see the Azure Monitor dashboards displaying important key performance indicators (KPIs), including the number of connected devices and session establishment failures.

You can select individual dashboards to open an expanded view where you can specify details such as the graph's time range and time granularity. You can also create additional dashboards using the platform metrics available. For detailed information on interacting with the Azure Monitor graphics, see [Get started with metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started).

## Export metrics using the Azure portal

The platform metrics displayed in the **Mobile Network Site** resource combine information captured from two sources:

- The **Packet Core Control Plane** resource emits metrics relating to access, mobility and session management, such as registration and session establishment successes and failures.
- The **Packet Core Data Plane** resource emits metrics relating to the data plane, such as throughput and packet drops.

You can export the platform metrics from each of those resources to [Log Analytics workspace](/azure/azure-monitor/logs/workspace-design), [Azure Storage](/azure/storage/), [Azure Event Hubs](/azure/event-hubs/), and [Azure Monitor partner integrations](/azure/partner-solutions/overview).

1. Navigate to the resource group containing your private mobile network.
1. Select either the site's **Packet Core Control Plane** or the **Packet Core Data Plane** resource, depending on the metrics you're interested in exporting.
1. From the resource menu, select **Diagnostic settings**.
1. Select **Add diagnostic setting** to configure a rule for exporting your metrics. Refer to [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring&tabs=portal) for more details on adding and editing diagnostic settings.

## Retrieve metrics using the Azure Monitor REST API

In addition to the monitoring functionalities offered by the Azure portal, you can retrieve Azure Private 5G Core metrics using the [Azure Monitor REST API](/rest/api/monitor/). Once this data is retrieved, you may want to sava it in a separate data store that allows longer data retention, or use your tools of choice to monitor and analyze your deployment.

As an example, you can export the platform metrics to data storage and processing services such as [Azure Monitor Log Analytics](/azure/azure-monitor/logs/log-analytics-overview), [Azure Storage](/azure/storage/), or [Azure Event Hubs](/azure/event-hubs/). You can also leverage [Azure Managed Grafana](/azure/managed-grafana/) to create a monitoring experience in the cloud mirroring the capabilities of the local [packet core dashboards](packet-core-dashboards.md).

> [!NOTE]
> Exporting metrics to another application for analysis or storage may incur extra costs. Check the pricing information for the applications you want to use.

See [Supported metrics with Azure Monitor](/azure/azure-monitor/essentials/metrics-supported) for the mobile network metrics available for retrieval. You can find more information on using the Azure Monitor REST API to construct queries and retrieve metrics at [Azure monitoring REST API walkthrough](/azure/azure-monitor/essentials/rest-api-walkthrough).

## Next steps

- [Learn more about the Azure Monitor Metrics](/azure/azure-monitor/essentials/data-platform-metrics)