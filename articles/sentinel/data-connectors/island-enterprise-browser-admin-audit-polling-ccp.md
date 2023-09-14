---
title: "Island Enterprise Browser Admin Audit (Polling CCP) connector for Microsoft Sentinel"
description: "Learn how to install the connector Island Enterprise Browser Admin Audit (Polling CCP) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Island Enterprise Browser Admin Audit (Polling CCP) connector for Microsoft Sentinel

The [Island](https://www.island.io) Admin connector provides the capability to ingest Island Admin Audit logs into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Island](https://www.island.io) |

## Query samples

**Grab 10 Island log entries**
   ```kusto
{{graphQueriesTableName}}
 
   | sort by TimeGenerated
 
   | take 10
   ```



## Prerequisites

To integrate with Island Enterprise Browser Admin Audit (Polling CCP) make sure you have: 

- **Island API Key**: An Island API key is required.


## Vendor installation instructions

Connect Island to Microsoft Sentinel

Provide the Island API URL and Key.  API URL is ```https://management.island.io/api/external/v1/adminActions``` for US or ```https://eu.management.island.io/api/external/v1/adminActions``` for EU.
  Generate the API Key in the Management Console under Settings > API.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/islandtechnologyinc1679434413850.island-sentinel-solution?tab=Overview) in the Azure Marketplace.
