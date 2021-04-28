---
title: Monitoring Azure App Configuration
description: Start here to learn how to monitor App Configuration
author: AlexandraKemperMS
ms.author: alkemper
ms.service: azure-app-configuration
ms.topic: subject-monitoring
ms.date: 4/1/2021
---
# Monitoring App Configuration
When you have critical applications and business processes relying on Azure resources, you want to monitor those resources for their availability, performance, and operation. 
This article describes the monitoring data generated by App Configuration. App Configuration uses  [Azure Monitor](/azure/azure-monitor/overview). If you are unfamiliar with the features of Azure Monitor common to all Azure services that use it, read [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).

## Monitoring overview page in Azure portal
The **Overview** page in the Azure portal for each configuration store includes a brief view of the resource usage, such as the total number of requests, number of  throttled requests, and request duration. This information is useful, but only a small amount of the monitoring data is available. Some of this data is collected automatically and is available for analysis as soon as you create the resource. You can enable additional types of data collection with some configuration.

## Monitoring data 
App Configuration collects the same kinds of monitoring data as other Azure resources that are described in [Monitoring data from Azure resources](/azure/azure-monitor/insights/monitor-azure-resource#monitoring-data-from-Azure-resources). 
See [Monitoring App Configuration data reference](monitor-app-configuration-reference.md) for detailed information on the metrics and logs metrics created by App Configuration.

## Collection and routing
Platform metrics and the Activity log are collected and stored automatically, but can be routed to other locations by using a diagnostic setting.  
Resource Logs are not collected and stored until you create a diagnostic setting and route them to one or more locations.For example, to view logs and metrics for a configuration store in near real-time in Azure Monitor, collect the resource logs in a Log Analytics workspace. Follow these steps to create and enable a diagnostic setting:

See [Create diagnostic setting to collect platform logs and metrics in Azure](/azure/azure-monitor/platform/diagnostic-settings) for the detailed process for creating a diagnostic setting using the Azure portal, CLI, or PowerShell. When you create a diagnostic setting, you specify which categories of logs to collect. The categories for *App Configuration* are listed in [App Configuration monitoring data reference](monitor-service-reference.md#resource-logs).
 #### [Portal](#tab/portal)

1. Sign in to the Azure portal.

1. Navigate to your App Configuration store.

1. In the **Monitoring** section, click ** Diagnostic settings **, then click ** +Add diagnostic setting **. 
    ![Add a diagnostic setting](./media/diagnostic-settings-add.png)

1. In the **Diagnostic setting** page, enter a name for your setting, then select **HttpRequest** and **Send to Log Analytics workspace**. 
    ![Details of the diagnostic settings](./media/monitoring-diagnostic-settings-details.png)
1. After selecting the log data you want to collect, click **Save**. 
    

 ### [Powershell](#tab/powershell)
    
    PowerShell commands

    ---
When you create a diagnostic setting, you specify which categories of logs to collect. The categories for *App Configuration* are listed in [App Configuration monitoring data reference](monitor-service-reference.md#resource-logs).

## Analyzing metrics

You can analyze metrics for App Configuration with metrics from other Azure services using metrics explorer by opening **Metrics** from the **Azure Monitor** menu. See [Getting started with Azure Metrics Explorer](/azure/azure-monitor/platform/metrics-getting-started) for details on using this tool. 
For a list of the platform metrics collected for App Configuration, see [Monitoring App Configuration data reference metrics](monitor-service-reference#metrics)   
For reference, you can see a list of [all resource metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Analyzing logs
Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties.  
All resource logs in Azure Monitor have the same fields followed by service-specific fields. The common schema is outlined in [Azure Monitor resource log schema](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-logs-schema#top-level-resource-logs-schema) The schema for [service name] resource logs is found in the [App Configuration Data Reference](monitor-service-reference#schemas) 
The [Activity log](/azure/azure-monitor/platform/activity-log) is a platform login Azure that provides insight into subscription-level events. You can view it independently or route it to Azure Monitor Logs, where you can do much more complex queries using Log Analytics.  
For a list of the types of resource logs collected for App Configuration, see [Monitoring App Configuration data reference](monitor-service-reference#logs)  
For a list of the tables used by Azure Monitor Logs and queryable by Log Analytics, see [Monitoring App Configuration data reference](monitor-service-reference#azuremonitorlogstables)  
 #### [Portal](#tab/portal)

    Various text

 ### [Powershell](#tab/powershell)
    
    PowerShell commands

    ---
### Sample Kusto queries

> [!IMPORTANT]
> When you select **Logs** from the [service-name] menu, Log Analytics is opened with the query scope set to the current [Service resource]. This means that log queries will only include data from that resource. If you want to run a query that includes data from other [resource] or data from other Azure services, select **Logs** from the **Azure Monitor** menu. See [Log query scope and time range in Azure Monitor Log Analytics](/azure/azure-monitor/log-query/scope/) for details.
<!-- REQUIRED: Include queries that are helpful for figuring out the health and state of your service. Ideally, use some of these queries in the alerts section. It's possible that some of your queries may be in the Log Analytics UI (sample or example queries). Check if so.  -->
Following are queries that you can use to help you monitor your [Service] resource. 
<!-- Put in a code section here. -->  
```Kusto
   
```
## Alerts
<!-- SUGGESTED: Include useful alerts on metrics, logs, log conditions or activity log. Ask your PMs if you don't know. 
This information is the BIGGEST request we get in Azure Monitor so do not avoid it long term. People don't know what to monitor for best results. Be prescriptive  
-->
Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](/azure/azure-monitor/platform/alerts-metric-overview), [logs](/azure/azure-monitor/platform/alerts-unified-log), and the [activity log](/azure/azure-monitor/platform/activity-log-alerts). Different types of alerts have benefits and drawbacks
<!-- only include next line if applications run on your service and work with App Insights. --> If you are creating or running an application which run on <*service*> [Azure Monitor Application Insights](/azure/azure-monitor/overview#application-insights) may offer additional types of alerts.
<!-- end -->
The following table lists common and recommended alert rules for [service-name].
<!-- Fill in the table with metric and log alerts that would be valuable for your service. Change the format as necessary to make it more readable -->
| Alert type | Condition | Description  |
|:---|:---|:---|
| | | |
| | | |
## Next steps
<!-- Add additional links. You can change the wording of these and add more if useful.   -->
- See [Monitoring [service-name] data reference](monitor-service-reference.md) for a reference of the metrics, logs, and other important values created by [service name].
*>.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resource) for details on monitoring Azure resources.



