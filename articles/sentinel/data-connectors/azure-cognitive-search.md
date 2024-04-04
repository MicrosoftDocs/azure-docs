---
title: "Azure Cognitive Search connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Cognitive Search to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Cognitive Search connector for Microsoft Sentinel

Azure Cognitive Search is a cloud search service that gives developers infrastructure, APIs, and tools for building a rich search experience over private, heterogeneous content in web, mobile, and enterprise applications. This connector lets you stream your Azure Cognitive Search diagnostics logs into Microsoft Sentinel, allowing you to continuously monitor activity. 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (Cognitive Search)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.SEARCH" 

   ```

**Count By Cognitive Search**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.SEARCH" 

   | summarize count() by Resource
   ```



## Prerequisites

To integrate with Azure Cognitive Search make sure you have: 

- **Policy**: owner role assigned for each policy assignment scope


## Vendor installation instructions

Connect your Azure Cognitive Search diagnostics logs into Sentinel.

This connector uses Azure Policy to apply a single Azure Cognitive Search log-streaming configuration to a collection of instances, defined as a scope. Follow the instructions below to create and apply a policy to all current and future instances. Note, you may already have an active policy for this resource type.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-azurecognitivesearch?tab=Overview) in the Azure Marketplace.
