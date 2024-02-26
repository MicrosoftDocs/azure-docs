---
title: "Azure Logic Apps connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Logic Apps to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Logic Apps connector for Microsoft Sentinel

Azure Logic Apps is a cloud-based platform for creating and running automated workflows that integrate your apps, data, services, and systems. This connector lets you stream your Azure Logic Apps diagnostics logs into Microsoft Sentinel, allowing you to continuously monitor activity. 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (Logic Apps)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.LOGIC" 

   ```

**Count By Workflows**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.LOGIC" 

   | summarize count() by resource_workflowName_s
   ```



## Prerequisites

To integrate with Azure Logic Apps make sure you have: 

- **Policy**: owner role assigned for each policy assignment scope


## Vendor installation instructions

Connect your Logic Apps diagnostics logs into Sentinel.

This connector uses Azure Policy to apply a single Azure Logic Apps log-streaming configuration to a collection of instances, defined as a scope. Follow the instructions below to create and apply a policy to all current and future instances. Note, you may already have an active policy for this resource type.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-logicapps?tab=Overview) in the Azure Marketplace.
