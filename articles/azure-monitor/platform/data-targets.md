---
title: Sources of data in Azure Monitor | Microsoft Docs
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
ms.date: 11/13/2018
ms.author: bwren

---

# Monitoring data targets in Azure

Azure Monitor is based on a data platform of Logs and Metrics as described in [Azure Monitor data platform](data-platform.md). Monitoring data from Azure resources may be written to other locations though, either before they are copied to Logs or to support additional scenarios. The following table identifies the different locations where monitoring data in this article are written and how you can access it.

| Location | Description | Methods of access |
|:---|:---|:---|:--|
| Metrics | Time-series database which is optimized for analyzing time-stamped data. | [Metrics Explorer](metrics-getting-started.md)<br>[Azure Monitor Metrics API](/rest/api/monitor/metrics) |
| Logs    | Log Analytics workspace that's based on Azure Data Explorer which provides a powerful analysis engine and rich query language. | [Log Analytics](../log-query/portals.md)<br>[Log Analytics API](https://dev.loganalytics.io/)<br>[Application Insights API](https://dev.applicationinsights.io/reference/get-query) |
| Activity log | Data from the Activity log is most useful when sent to Azure Monitor Logs to analyze it with other data, but it's also collected on its own so it can be directly viewed in the Azure portal. | [Azure portal](activity-logs-overview.md#query-the-activity-log-in-the-azure-portal)<br>[Azure Monitor Events API](/rest/api/monitor/eventcategories) |
| Azure Storage | Some data sources will write directly to Azure storage and require configuration to move data into Logs. You can also send data to Azure storage for archiving.  | [Storage Analytics](/rest/api/storageservices/storage-analytics)<br>[Server Explorer](/visualstudio/azure/vs-azure-tools-storage-resources-server-explorer-browse-manage)<br>[Storage Explorer](/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) |
| Event Hubs | 
| Insights | Insights such as 





## Next steps

- Learn more about the [types of monitoring data collected by Azure Monitor](data-platform.md) and how to view and analyze this data.
