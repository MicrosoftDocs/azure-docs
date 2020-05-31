---
title: Monitoring data locations in Azure Monitor | Microsoft Docs
description: Describes the different locations where monitoring data is stored in Azure including the Azure Monitor data platform.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/21/2019

---

# Monitoring data locations in Azure Monitor

Azure Monitor is based on a [data platform](data-platform.md) of [Logs](data-platform-logs.md) and [Metrics](data-platform-metrics.md) as described in [Azure Monitor data platform](data-platform.md). Monitoring data from Azure resources may be written to other locations though, either before they are copied to Azure Monitor or to support additional scenarios. 

## Monitoring data locations

The following table identifies the different locations where monitoring data in Azure is sent and the different methods for accessing it.

| Location | Description | Methods of access |
|:---|:---|:---|:--|
| Azure Monitor Metrics | Time-series database which is optimized for analyzing time-stamped data. | [Metrics Explorer](metrics-getting-started.md)<br>[Azure Monitor Metrics API](/rest/api/monitor/metrics) |
| Azure Monitor Logs    | Log Analytics workspace that's based on Azure Data Explorer which provides a powerful analysis engine and rich query language. | [Log Analytics](../log-query/portals.md)<br>[Log Analytics API](https://dev.loganalytics.io/)<br>[Application Insights API](https://dev.applicationinsights.io/reference/get-query) |
| Activity log | Data from the Activity log is most useful when sent to Azure Monitor Logs to analyze it with other data, but it's also collected on its own so it can be directly viewed in the Azure portal. | [Azure portal](activity-log-view.md#azure-portal)<br>[Azure Monitor Events API](/rest/api/monitor/eventcategories) |
| Azure Storage | Some data sources will write directly to Azure storage and require configuration to move data into Logs. You can also send data to Azure storage for archiving and for integration with external systems.  | [Storage Analytics](/rest/api/storageservices/storage-analytics)<br>[Server Explorer](/visualstudio/azure/vs-azure-tools-storage-resources-server-explorer-browse-manage)<br>[Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) |
| Event Hubs | Send data to Azure Event Hubs to stream it to other locations. | [Capture to Storage](../../event-hubs/event-hubs-capture-overview.md)  |
| Azure Monitor for VMs | Azure Monitor for VMs stores workload health data in a custom location that's used by its monitoring experience in the Azure portal. | [Azure portal](../insights/vminsights-overview.md)<br>[Workload monitor REST API](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/components)<br>[Azure Resource health REST API](https://docs.microsoft.com/rest/api/resourcehealth/)  |
| Alerts | Alerts created by Azure Monitor. | [Azure portal](alerts-managing-alert-instances.md)<br>[Alerts Management REST API](https://docs.microsoft.com/rest/api/monitor/alertsmanagement/alerts) |



## Next steps

- See the different sources of [monitoring data collected by Azure Monitor](data-sources.md).
- Learn about the [types of monitoring data collected by Azure Monitor](data-platform.md) and how to view and analyze this data.
