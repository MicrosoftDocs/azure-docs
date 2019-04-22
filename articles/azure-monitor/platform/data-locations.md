---
title: Monitoring data targets in Azure | Microsoft Docs
description: Describes the data available to monitor the health and performance of your Azure resources and the applications running on them.
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.service: azure-monitor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/22/2019
ms.author: bwren

---

# Monitoring data locations in Azure

Azure Monitor is based on a [data platform](data-platform.md) of [Logs](data-platform-logs.md) and [Metrics](data-platform-metrics.md) as described in [Azure Monitor data platform](data-platform.md). Monitoring data from Azure resources may be written to other locations though, either before they are copied to Azure Monitor or to support additional scenarios. 

The following table identifies the different locations where monitoring data in this article are written and the different methods for accessing it.

| Location | Description | Methods of access |
|:---|:---|:---|:--|
| Metrics | Time-series database which is optimized for analyzing time-stamped data. | [Metrics Explorer](metrics-getting-started.md)<br>[Azure Monitor Metrics API](/rest/api/monitor/metrics) |
| Logs    | Log Analytics workspace that's based on Azure Data Explorer which provides a powerful analysis engine and rich query language. | [Log Analytics](../log-query/portals.md)<br>[Log Analytics API](https://dev.loganalytics.io/)<br>[Application Insights API](https://dev.applicationinsights.io/reference/get-query) |
| Activity log | Data from the Activity log is most useful when sent to Azure Monitor Logs to analyze it with other data, but it's also collected on its own so it can be directly viewed in the Azure portal. | [Azure portal](activity-logs-overview.md#query-the-activity-log-in-the-azure-portal)<br>[Azure Monitor Events API](/rest/api/monitor/eventcategories) |
| Azure Storage | Some data sources will write directly to Azure storage and require configuration to move data into Logs. You can also send data to Azure storage for archiving.  | [Storage Analytics](/rest/api/storageservices/storage-analytics)<br>[Server Explorer](/visualstudio/azure/vs-azure-tools-storage-resources-server-explorer-browse-manage)<br>[Storage Explorer](/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) |
| Event Hubs | Send data to Azure Event Hubs to forward it to other locations. | Data can't be accessed directly in Event Hubs.  |
| Azure Monitor for VMs | Azure Monitor for VMs stores workload health data in a custom location that's used by its monitoring experience in the Azure portal. | [Azure portal](../insights/vminsights-overview.md)<br>[Workload monitor REST API](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/components)<br>[Azure Resource health REST API](https://docs.microsoft.com/rest/api/resourcehealth/)  |
| Alerts | Alerts created by Azure Monitor. | [Azure portal](alerts-managing-alert-instances.md)<br>[Alerts Management REST API](https://docs.microsoft.com/rest/api/monitor/alertsmanagement/alerts) |



## Next steps

- See the different sources of [monitoring data collected by Azure Monitor](data-sources.md).
- Learn about the [types of monitoring data collected by Azure Monitor](data-platform.md) and how to view and analyze this data.
