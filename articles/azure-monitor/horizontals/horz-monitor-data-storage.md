---
author: rboucher
ms.author: robb
ms.service: azure-monitor
ms.topic: include
ms.date: 03/28/2024
---

## Data storage

For Azure Monitor:

- Metrics data is stored in the Azure Monitor metrics database.
- Log data is stored in the Azure Monitor logs store. Log Analytics is a tool in the Azure portal that can query this store.
- The Azure activity log is a separate store with its own interface in the Azure portal.

You can optionally route metric and activity log data to the Azure Monitor logs store. You can then use Log Analytics to query the data and correlate it with other log data.

Many services can use diagnostic settings to send metric and log data to other storage locations outside Azure Monitor. Examples include Azure Storage, [hosted partner systems](/azure/partner-solutions/overview), and [non-Azure partner systems, by using Event Hubs](/azure/azure-monitor/essentials/stream-monitoring-data-event-hubs).

For detailed information on how Azure Monitor stores data, see [Azure Monitor data platform](/azure/azure-monitor/platform/data-platform).
