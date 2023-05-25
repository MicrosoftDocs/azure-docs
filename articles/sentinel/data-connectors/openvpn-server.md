---
title: "OpenVPN Server connector for Microsoft Sentinel"
description: "Learn how to install the connector OpenVPN Server to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# OpenVPN Server connector for Microsoft Sentinel

The [OpenVPN](https://github.com/OpenVPN) data connector provides the capability to ingest OpenVPN Server logs into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog(OpenVPN)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Sources**
   ```kusto
OpenVpnEvent
 
   | summarize count() by tostring(SrcIpAddr)
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**OpenVpnEvent**](https://aka.ms/sentinel-openvpn-parser) which is deployed with the Microsoft Sentinel Solution.

1. Install and onboard the agent for Linux or Windows

Install the agent on the Server where the OpenVPN are forwarded.

> Logs from OpenVPN Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.

1.  Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
2.  Select **Apply below configuration to my machines** and select the facilities and severities.
3.  Click **Save**.


3. Check your OpenVPN logs.

OpenVPN server logs are written into common syslog file (depending on the Linux distribution used: e.g. /var/log/messages)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-openvpn?tab=Overview) in the Azure Marketplace.
