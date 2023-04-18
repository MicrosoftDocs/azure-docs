---
title: "Forescout connector for Microsoft Sentinel"
description: "Learn how to install the connector Forescout to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Forescout connector for Microsoft Sentinel

The [Forescout](https://www.forescout.com/) data connector provides the capability to ingest [Forescout events](https://docs.forescout.com/bundle/syslog-3-6-1-h/page/syslog-3-6-1-h.How-to-Work-with-the-Syslog-Plugin.html) into Microsoft Sentinel. Refer to [Forescout documentation](https://docs.forescout.com/bundle/syslog-msg-3-6-tn/page/syslog-msg-3-6-tn.About-Syslog-Messages-in-Forescout.html) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog(ForescoutEvent)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Sources**
   ```kusto
ForescoutEvent
 
   | summarize count() by tostring(SrcIpAddr)
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**ForescoutEvent**](https://aka.ms/sentinel-forescout-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using Forescout Syslog Plugin version: v3.6

1. Install and onboard the agent for Linux or Windows

Install the agent on the Server where the Forescout logs are forwarded.

> Logs from Forescout Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure Forescout event forwarding

Follow the configuration steps below to get Forescout logs into Microsoft Sentinel.
1. [Select an Appliance to Configure.](https://docs.forescout.com/bundle/syslog-3-6-1-h/page/syslog-3-6-1-h.Select-an-Appliance-to-Configure.html)
2. [Follow these instructions](https://docs.forescout.com/bundle/syslog-3-6-1-h/page/syslog-3-6-1-h.Send-Events-To-Tab.html#pID0E0CE0HA) to forward alerts from the Forescout platform to a syslog server.
3. [Configure](https://docs.forescout.com/bundle/syslog-3-6-1-h/page/syslog-3-6-1-h.Syslog-Triggers.html) the settings in the Syslog Triggers tab.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/forescout.azure-sentinel-solution-forescout?tab=Overview) in the Azure Marketplace.
