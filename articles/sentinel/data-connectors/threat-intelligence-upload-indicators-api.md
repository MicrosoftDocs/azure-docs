---
title: "Threat Intelligence Upload Indicators API (Preview) connector for Microsoft Sentinel"
description: "Learn how to install the connector Threat Intelligence Upload Indicators API (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/31/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Threat Intelligence Upload Indicators API (Preview) connector for Microsoft Sentinel

Microsoft Sentinel offer a data plane API to bring in threat intelligence from your Threat Intelligence Platform (TIP), such as Threat Connect, Palo Alto Networks MineMeld, MISP, or other integrated applications. Threat indicators can include IP addresses, domains, URLs, file hashes and email addresses.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ThreatIntelligenceIndicator<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All Threat Intelligence APIs Indicators**
   ```kusto
ThreatIntelligenceIndicator 
   | where SourceSystem !in ('SecurityGraph', 'Azure Sentinel', 'Microsoft Sentinel')
   | sort by TimeGenerated desc
   ```

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-threatintelligence-taxii?tab=Overview) in the Azure Marketplace.
