---
title: "Azure Batch Account connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Batch Account to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Batch Account connector for Microsoft Sentinel

Azure Batch Account is a uniquely identified entity within the Batch service. Most Batch solutions use Azure Storage for storing resource files and output files, so each Batch account is usually associated with a corresponding storage account. This connector lets you stream your Azure Batch account diagnostics logs into Microsoft Sentinel, allowing you to continuously monitor activity. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2224103&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (Batch Account)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.BATCH" 

   ```

**Count By Batch Accounts**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.BATCH" 

   | summarize count() by Resource
   ```



## Prerequisites

To integrate with Azure Batch Account make sure you have: 

- **Policy**: owner role assigned for each policy assignment scope


## Vendor installation instructions

Connect your Azure Batch Account diagnostics logs into Sentinel.

This connector uses Azure Policy to apply a single Azure Batch Account log-streaming configuration to a collection of instances, defined as a scope. Follow the instructions below to create and apply a policy to all current and future instances. Note, you may already have an active policy for this resource type.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-batchaccount?tab=Overview) in the Azure Marketplace.
