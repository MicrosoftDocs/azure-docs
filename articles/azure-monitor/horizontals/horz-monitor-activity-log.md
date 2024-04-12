---
author: rboucher
ms.author: robb
ms.service: azure-monitor
ms.topic: include
ms.date: 02/27/2024
---

## Azure activity log

The activity log contains subscription-level events that track operations for each Azure resource as seen from outside that resource; for example, creating a new resource or starting a virtual machine.

**Collection:** Activity log events are automatically generated and collected in a separate store for viewing in the Azure portal.

**Routing:** You can send activity log data to Azure Monitor Logs so you can analyze it alongside other log data. Other locations such as Azure Storage, Azure Event Hubs, and certain Microsoft monitoring partners are also available. For more information on how to route the activity log, see [Overview of the Azure activity log](/azure/azure-monitor/essentials/activity-log).
