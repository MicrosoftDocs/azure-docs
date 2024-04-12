---
author: rboucher
ms.author: robb
ms.service: azure-monitor
ms.topic: include
ms.date: 02/27/2024
---

<a name="external-tools"></a>
### Azure Monitor export tools

You can get data out of Azure Monitor into other tools by using the following methods:

- **Metrics:** Use the [REST API for metrics](/rest/api/monitor/operation-groups) to extract metric data from the Azure Monitor metrics database. The API supports filter expressions to refine the data retrieved. For more information, see [Azure Monitor REST API reference](/rest/api/monitor/filter-syntax).

- **Logs:** Use the REST API or the [associated client libraries](/rest/api/loganalytics/query/get?tabs=HTTP).
- Another option is the [workspace data export](/azure/azure-monitor/logs/logs-data-export?tabs=portal).

To get started with the REST API for Azure Monitor, see [Azure monitoring REST API walkthrough](/azure/azure-monitor/essentials/rest-api-walkthrough?tabs=portal).

