---
title: "McAfee ePolicy Orchestrator (ePO) connector for Microsoft Sentinel"
description: "Learn how to install the connector McAfee ePolicy Orchestrator (ePO) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# McAfee ePolicy Orchestrator (ePO) connector for Microsoft Sentinel

The McAfee ePolicy Orchestrator data connector provides the capability to ingest [McAfee ePO](https://www.mcafee.com/enterprise/en-us/products/epolicy-orchestrator.html) events into Microsoft Sentinel through the syslog. Refer to [documentation](https://docs.mcafee.com/bundle/epolicy-orchestrator-landing/page/GUID-0C40020F-5B7F-4549-B9CC-0E017BC8797F.html) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | McAfeeEPOEvent |
| **Kusto function url** | https://aka.ms/sentinel-McAfeeePO-parser |
| **Log Analytics table(s)** | Syslog(McAfeeePO)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Top 10 Sources**
   ```kusto
McAfeeEPOEvent
 
   | summarize count() by DvcHostname
 
   | top 10 by count_
   ```



## Vendor installation instructions


>This data connector depends on a parser based on a Kusto Function to work as expected [**McAfeeEPOEvent**](https://aka.ms/sentinel-McAfeeePO-parser) which is deployed with the Microsoft Sentinel Solution.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.

1.  Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
2.  Select **Apply below configuration to my machines** and select the facilities and severities.
3.  Click **Save**.


3. Configure McAfee ePolicy Orchestrator event forwarding to Syslog server

[Follow these instructions](https://docs.mcafee.com/bundle/epolicy-orchestrator-5.10.0-product-guide/page/GUID-5C5332B3-837A-4DDA-BE5C-1513A230D90A.html) to add register syslog server.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-mcafeeepo?tab=Overview) in the Azure Marketplace.
