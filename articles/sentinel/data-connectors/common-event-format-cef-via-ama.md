---
title: "Common Event Format (CEF) via AMA connector for Microsoft Sentinel (preview)"
description: "Learn how to install the connector Common Event Format (CEF) via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/27/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Common Event Format (CEF) via AMA connector for Microsoft Sentinel (preview)

Common Event Format (CEF) is an industry standard format on top of Syslog messages, used by many security vendors to allow event interoperability among different platforms. By connecting your CEF logs to Microsoft Sentinel, you can take advantage of search & correlation, alerting, and threat intelligence enrichment for each log. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2223547&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog<br/> |
| **Data collection rules support** | [Azure Monitor Agent DCR](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-commoneventformat?tab=Overview) in the Azure Marketplace.
