---
title: "Windows DNS Events via AMA (Preview) connector for Microsoft Sentinel"
description: "Learn how to install the connector Windows DNS Events via AMA (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Windows DNS Events via AMA (Preview) connector for Microsoft Sentinel

The Windows DNS log connector allows you to easily filter and stream all analytics logs from your Windows DNS servers to your Microsoft Sentinel workspace using the Azure Monitoring agent (AMA). Having this data in Microsoft Sentinel helps you identify issues and security threats such as:
- Trying to resolve malicious domain names.
- Stale resource records.
- Frequently queried domain names and talkative DNS clients.
- Attacks performed on DNS server.

You can get the following insights into your Windows DNS servers from Microsoft Sentinel:
- All logs centralized in a single place.
- Request load on DNS servers.
- Dynamic DNS registration failures.

Windows DNS events are supported by Advanced SIEM Information Model (ASIM) and stream data into the ASimDnsActivityLogs table. [Learn more](../normalization.md).

For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2225993&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ASimDnsActivityLogs<br/> |
| **Data collection rules support** | [Azure Monitor Agent DCR](/azure/azure-monitor/agents/data-collection-rule-azure-monitor-agent) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-dns?tab=Overview) in the Azure Marketplace.