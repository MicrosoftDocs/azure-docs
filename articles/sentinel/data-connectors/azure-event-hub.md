---
title: "Azure Event Hub connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Event Hub to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Event Hub connector for Microsoft Sentinel

Azure Event Hubs is a big data streaming platform and event ingestion service. It can receive and process millions of events per second. This connector lets you stream your Azure Event Hub diagnostics logs into Microsoft Sentinel, allowing you to continuously monitor activity. 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (Event Hub)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.EVENTHUB" 

   ```

**Count By Event Hubs**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.EVENTHUB" 

   | summarize count() by Resource
   ```



## Prerequisites

To integrate with Azure Event Hub make sure you have: 

- **Policy**: owner role assigned for each policy assignment scope


## Vendor installation instructions

Connect your Azure Event Hub diagnostics logs into Sentinel.

This connector uses Azure Policy to apply a single Azure Event Hub log-streaming configuration to a collection of instances, defined as a scope. Follow the instructions below to create and apply a policy to all current and future instances. Note, you may already have an active policy for this resource type.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-eventhub?tab=Overview) in the Azure Marketplace.
