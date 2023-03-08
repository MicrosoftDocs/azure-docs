---
title: "Azure Stream Analytics connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Stream Analytics to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Stream Analytics connector for Microsoft Sentinel

Azure Stream Analytics is a real-time analytics and complex event-processing engine that is designed to analyze and process high volumes of fast streaming data from multiple sources simultaneously. This connector lets you stream your Azure Stream Analytics hub diagnostics logs into Microsoft Sentinel, allowing you to continuously monitor activity. 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (Stream Analytics)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.STREAMANALYTICS" 

   ```

**Count By Stream Analytics**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.STREAMANALYTICS" 

   | summarize count() by Resource
   ```



## Prerequisites

To integrate with Azure Stream Analytics make sure you have: 

- **Policy**: owner role assigned for each policy assignment scope


## Vendor installation instructions

Connect your Azure Stream Analytics diagnostics logs into Sentinel.

This connector uses Azure Policy to apply a single Azure Stream Analytics log-streaming configuration to a collection of instances, defined as a scope. Follow the instructions below to create and apply a policy to all current and future instances. Note, you may already have an active policy for this resource type.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-streamanalytics?tab=Overview) in the Azure Marketplace.
