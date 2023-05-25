---
title: "Azure Storage Account connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Storage Account to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Storage Account connector for Microsoft Sentinel

Azure Storage account is a cloud solution for modern data storage scenarios. It contains all your data objects: blobs, files, queues, tables, and disks. This connector lets you stream Azure Storage accounts diagnostics logs into your Microsoft Sentinel workspace, allowing you to continuously monitor activity in all your instances, and detect malicious activity in your organization. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2220068&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureMetrics (Azure Storage)<br/> StorageBlobLogs<br/> StorageQueueLogs<br/> StorageTableLogs<br/> StorageFileLogs<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
StorageBlobLogs
 
   | where TimeGenerated > ago(3d) 
 
   | project TimeGenerated, OperationName, StatusCode, StatusText, _ResourceId
 
   | sort by TimeGenerated
   ```



## Prerequisites

To integrate with Azure Storage Account make sure you have: 

- **Policy**: owner role assigned for each policy assignment scope


## Vendor installation instructions

Connect your Azure Storage Account diagnostics logs into Sentinel.

This connector uses a set of Azure Policies to apply a log-streaming configuration to a collection of instances, defined as a scope. Follow the instructions below to create and apply policies to all current and future instances. To get most out of the Storage Account Diagnostic logging from the Azure Storage Account, we recommend that you enable Diagnostic logging from all services within the Azure Storage Account - Blob, Queue, Table and File. Note, you may already have an active policy for this resource type.








## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-azurestorageaccount?tab=Overview) in the Azure Marketplace.
