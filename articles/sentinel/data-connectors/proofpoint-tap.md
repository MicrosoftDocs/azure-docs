---
title: "Proofpoint TAP connector for Microsoft Sentinel"
description: "Learn how to install the connector Proofpoint TAP to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/21/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Proofpoint TAP connector for Microsoft Sentinel

The Proofpoint TAP data connector provides the capability to ingest [Proofpoint TAP events](https://help.proofpoint.com/Threat_Insight_Dashboard/API_Documentation/SIEM_API) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All Proofpoint TAP events**
   ```kusto
{{graphQueriesTableName}}

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Proofpoint TAP make sure you have: 

- **Proofpoint TAP API credentials**: Proofpoint TAP API username and password are required. [See the documentation to learn more about Proofpoint SIEM API](https://help.proofpoint.com/Threat_Insight_Dashboard/API_Documentation/SIEM_API).


## Vendor installation instructions

Connect Proofpoint TAP to Microsoft Sentinel

Enable Proofpoint TAP Logs.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-proofpoint?tab=Overview) in the Azure Marketplace.
