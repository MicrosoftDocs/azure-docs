---
title: "DNS connector for Microsoft Sentinel"
description: "Learn how to install the connector DNS to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# DNS connector for Microsoft Sentinel

The DNS log connector allows you to easily connect your DNS analytic and audit logs with Microsoft Sentinel, and other related data, to improve investigation.

**When you enable DNS log collection you can:**
-   Identify clients that try to resolve malicious domain names.
-   Identify stale resource records.
-   Identify frequently queried domain names and talkative DNS clients.
-   View request load on DNS servers.
-   View dynamic DNS registration failures.

For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2220127&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | DnsEvents<br/> DnsInventory<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-dns?tab=Overview) in the Azure Marketplace.
