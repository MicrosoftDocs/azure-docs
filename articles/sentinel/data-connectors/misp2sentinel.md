---
title: "MISP2Sentinel connector for Microsoft Sentinel"
description: "Learn how to install the connector MISP2Sentinel to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# MISP2Sentinel connector for Microsoft Sentinel

This solution installs the MISP2Sentinel connector that allows you to automatically push threat indicators from MISP to Microsoft Sentinel via the Upload Indicators REST API. After installing the solution, configure and enable this data connector by following guidance in Manage solution view.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ThreatIntelligenceIndicator<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Community](https://github.com/cudeso/misp2sentinel) |

## Query samples

**All Threat Intelligence APIs Indicators**
   ```kusto
ThreatIntelligenceIndicator 
   | where SourceSystem == 'MISP'
   | sort by TimeGenerated desc
   ```



## Vendor installation instructions

Installation and setup instructions

Use the documentation from this GitHub repository to install and configure the MISP to Microsoft Sentinel connector: 

https://github.com/cudeso/misp2sentinel



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-misp2sentinel?tab=Overview) in the Azure Marketplace.
