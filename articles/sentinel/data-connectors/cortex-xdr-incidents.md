---
title: "Cortex XDR - Incidents connector for Microsoft Sentinel"
description: "Learn how to install the connector Cortex XDR - Incidents to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cortex XDR - Incidents connector for Microsoft Sentinel

Custom Data connector from DEFEND to utilise the Cortex API to ingest incidents from Cortex XDR platform into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [DEFEND Ltd.](https://www.defend.co.nz/) |

## Query samples

**All Cortex XDR Incidents**
   ```kusto
{{graphQueriesTableName}}

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Cortex XDR - Incidents make sure you have: 

- **Cortex API credentials**: **Cortex API Token** is required for REST API. [See the documentation to learn more about API](https://docs.paloaltonetworks.com/cortex/cortex-xdr/cortex-xdr-api.html). Check all requirements and follow the instructions for obtaining credentials.


## Vendor installation instructions

Enable Cortex XDR API

Connect Cortex XDR to Microsoft Sentinel via Cortex API to process Cortex Incidents.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/defendlimited1682894612656.cortex_xdr_connector?tab=Overview) in the Azure Marketplace.
