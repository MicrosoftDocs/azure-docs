---
title: "Zero Networks Segment Audit connector for Microsoft Sentinel"
description: "Learn how to install the connector Zero Networks Segment Audit to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Zero Networks Segment Audit connector for Microsoft Sentinel

The [Zero Networks Segment](https://zeronetworks.com/) Audit data connector provides the capability to ingest Zero Networks Audit events into Microsoft Sentinel through the REST API. This data connector uses Microsoft Sentinel native polling capability.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Zero Networks](https://zeronetworks.com) |

## Query samples

**All Zero Networks Segment Audit events**
   ```kusto
{{graphQueriesTableName}}

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Zero Networks Segment Audit make sure you have: 

- **Zero Networks API Token**: **ZeroNetworksAPIToken** is required for REST API. See the API Guide and follow the instructions for obtaining credentials.


## Vendor installation instructions

Connect Zero Networks to Microsoft Sentinel

Enable Zero Networks audit Logs.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/zeronetworksltd1629013803351.azure-sentinel-solution-znsegmentaudit?tab=Overview) in the Azure Marketplace.
