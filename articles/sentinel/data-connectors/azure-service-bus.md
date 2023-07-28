---
title: "Azure Service Bus connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Service Bus to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Service Bus connector for Microsoft Sentinel

Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics (in a namespace). This connector lets you stream your Azure Service Bus diagnostics logs into Microsoft Sentinel, allowing you to continuously monitor activity. 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (Service Bus)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.SERVICEBUS" 

   ```

**Count By Service Bus**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.SERVICEBUS" 

   | summarize count() by Resource
   ```



## Prerequisites

To integrate with Azure Service Bus make sure you have: 

- **Policy**: owner role assigned for each policy assignment scope


## Vendor installation instructions

Connect your Azure Service Bus diagnostics logs into Sentinel.

This connector uses Azure Policy to apply a single Azure Service Bus log-streaming configuration to a collection of instances, defined as a scope. Follow the instructions below to create and apply a policy to all current and future instances. Note, you may already have an active policy for this resource type.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-servicebus?tab=Overview) in the Azure Marketplace.
