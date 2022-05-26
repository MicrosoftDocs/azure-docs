---
title: Monitor Azure resources with Azure Monitor | Microsoft Docs
description: Describes how to collect and analyze monitoring data from resources in Azure using Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/15/2021

---

# Tutorial: Monitor Azure resources with Azure Monitor
When you have critical applications and business processes relying on Azure resources, you want to monitor those resources for their availability, performance, and operation. This monitoring is provided by Azure Monitor, which is a full stack monitoring service in Azure that provides a complete set of features to monitor your Azure resources in addition to resources in other clouds and on-premises.

In this tutorial, you learn:

> [!div class="checklist"]
> * What Azure Monitor is and how it's integrated into the portal for other Azure services
> * The types of data collected by Azure Monitor for Azure resources
> * Azure Monitor tools used to collect and analyze data

> [!NOTE]
> This tutorial describes Azure Monitor concepts and walks you through different menu items. To jump right into using Azure Monitor features, start with [Tutorial: Analyze metrics for an Azure resource](../essentials/tutorial-metrics.md).


## Monitoring data

### Azure Monitor data collection
As soon as you create an Azure resource, Azure Monitor is enabled and starts collecting metrics and activity logs. With some configuration, you can gather additional monitoring data and enable additional features. The Azure Monitor data platform is made up of Metrics and Logs. Each collects different kinds of data and enables different Azure Monitor features.

- [Azure Monitor Metrics](../essentials/data-platform-metrics.md) stores numeric data from monitored resources into a time series database. The metric database is automatically created for each Azure subscription. Use [metrics explorer](../essentials/tutorial-metrics.md) to analyze data from Azure Monitor Metrics.
- [Azure Monitor Logs](../logs/data-platform-logs.md) collects logs and performance data where they can be retrieved and analyzed in a different ways using log queries. You must create a Log Analytics workspace to collect log data. Use [Log Analytics](../logs/log-analytics-tutorial.md) to analyze data from Azure Monitor Logs.

### <a id="monitoring-data-from-azure-resources"></a> Monitor data from Azure resources
While resources from different Azure services have different monitoring requirements, they generate monitoring data in the same formats so that you can use the same Azure Monitor tools to analyze all Azure resources.

Diagnostic settings define where resource logs and metrics for a particular resource should be sent. Possible destinations are:

- [Activity log](./platform-logs-overview.md) - Subscription level events that track operations for each Azure resource, for example creating a new resource or starting a virtual machine. Activity log events are automatically generated and collected for viewing in the Azure portal. You can create a diagnostic setting to send the Activity log to Azure Monitor Logs.
- [Platform metrics](../essentials/data-platform-metrics.md) - Numerical values that are automatically collected at regular intervals and describe some aspect of a resource at a particular time. Platform metrics are automatically generated and collected in Azure Monitor Metrics.
- [Resource logs](./platform-logs-overview.md) - Provide insight into operations that were performed by an Azure resource, for example getting a secret from a Key Vault or making a request to a database. Resource logs are generated automatically, but you must create a diagnostic setting to send them to Azure Monitor Logs.
- [Virtual machine guest metrics and logs]() - Performance and log data from the guest operating system of Azure virtual machines. You must install an agent on the virtual machine to collect this data and send it to Azure Monitor Metrics and Azure Monitor Logs.


## Menu options
While you can access Azure Monitor features from the **Monitor** menu in the Azure portal, Azure Monitor features can be accessed directly from the menu for different Azure services. While different Azure services may have slightly different experiences, they share a common set of monitoring options in the Azure portal. This includes **Overview** and **Activity log** and multiple options in the **Monitoring** section of the menu. 

:::image type="content" source="media/monitor-azure-resource/menu-01.png" lightbox="media/monitor-azure-resource/menu-01.png" alt-text="Monitor menu 1":::

:::image type="content" source="media/monitor-azure-resource/menu-02.png" lightbox="media/monitor-azure-resource/menu-02.png" alt-text="Monitor menu 2":::


## Overview page
The **Overview** page includes details about the resource and often its current state. For example, a virtual machine will show its current running state. Many Azure services will have a **Monitoring** tab that includes charts for a set of key metrics. This is a quick way to view the operation of the resource, and you can click on any of the charts to open them in metrics explorer for more detailed analysis. 

See [Tutorial: Analyze metrics for an Azure resource](../essentials/tutorial-metrics.md) for a tutorial on using metrics explorer.

![Overview page](media/monitor-azure-resource/overview-page.png)
### Activity log 
The **Activity log** menu item lets you view entries in the [activity log](../essentials/activity-log.md) for the current resource. 

:::image type="content" source="media/monitor-azure-resource/activity-log.png" lightbox="media/monitor-azure-resource/activity-log.png" alt-text="Activity log":::

## Alerts
The **Alerts** page will show you any recent alerts that have been fired for the resource. Alerts proactively notify you when important conditions are found in your monitoring data and can use data from either Metrics or Logs.

See [Tutorial: Create a metric alert for an Azure resource](../alerts/tutorial-metric-alert.md) or [Tutorial: Create a log query alert for an Azure resource](../alerts/tutorial-log-alert.md) for tutorials on create alert rules and viewing alerts.

:::image type="content" source="media/monitor-azure-resource/alerts-view.png" lightbox="media/monitor-azure-resource/alerts-view.png" alt-text="Alerts view":::

## Metrics
The **Metrics** menu item opens [metrics explorer](./metrics-getting-started.md) which allows you to work with individual metrics or combine  multiple to identify correlations and trends. This is the same metrics explorer that's opened when you click on one of the charts in the **Overview** page.

See [Tutorial: Analyze metrics for an Azure resource](../essentials/tutorial-metrics.md) for a tutorial on using metrics explorer.

:::image type="content" source="media/monitor-azure-resource/metrics.png" lightbox="media/monitor-azure-resource/metrics.png" alt-text="Metrics explorer":::


## Diagnostic settings
The **Diagnostic settings** page lets you create a [diagnostic setting](../essentials/diagnostic-settings.md) to collect the resource logs for your resource. You can send them to multiple locations, but the most common is to send to a Log Analytics workspace so you can analyze them with Log Analytics.

See [Tutorial: Collect and analyze resource logs from an Azure resource](../essentials/tutorial-resource-logs.md) for a tutorial on creating a diagnostic setting.

:::image type="content" source="media/monitor-azure-resource/diagnostic-settings.png" lightbox="media/monitor-azure-resource/diagnostic-settings.png" alt-text="Diagnostic settings":::



## Insights 
The **Insights** menu item opens the insight for the resource if the Azure service has one. [Insights](../monitor-reference.md) provide a customized monitoring experience built on the Azure Monitor data platform and standard features. 


See [Insights and Core solutions](../monitor-reference.md#insights-and-curated-visualizations) for a list of insights that are available and links to their documentation.

:::image type="content" source="media/monitor-azure-resource/insights.png" lightbox="media/monitor-azure-resource/insights.png" alt-text="Insights screenshot":::

## Next steps
Now that you have a basic understanding of Azure Monitor, get start analyzing some metrics for an Azure resource.

> [!div class="nextstepaction"]
> [Analyze metrics for an Azure resource](../essentials/tutorial-metrics.md)
