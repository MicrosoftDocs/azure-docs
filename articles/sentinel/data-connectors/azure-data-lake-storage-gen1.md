---
title: "Azure Data Lake Storage Gen1 connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Data Lake Storage Gen1 to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Data Lake Storage Gen1 connector for Microsoft Sentinel

Azure Data Lake Storage Gen1 is an enterprise-wide hyper-scale repository for big data analytic workloads. Azure Data Lake enables you to capture data of any size, type, and ingestion speed in one single place for operational and exploratory analytics. This connector lets you stream your Azure Data Lake Storage Gen1 diagnostics logs into Microsoft Sentinel, allowing you to continuously monitor activity. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2223812&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (Data Lake Storage Gen1)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All logs**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.DATALAKESTORE" 

   ```

**Count By Data Lake Storage**
   ```kusto
AzureDiagnostics 

   | where ResourceProvider == "MICROSOFT.DATALAKESTORE" 

   | summarize count() by Resource
   ```



## Prerequisites

To integrate with Azure Data Lake Storage Gen1 make sure you have: 

- **Policy**: owner role assigned for each policy assignment scope


## Vendor installation instructions

Connect your Azure Data Lake Storage Gen1 diagnostics logs into Sentinel.

This connector uses Azure Policy to apply a single Azure Data Lake Storage Gen1 log-streaming configuration to a collection of instances, defined as a scope. Follow the instructions below to create and apply a policy to all current and future instances. Note, you may already have an active policy for this resource type.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-datalakestoragegen1?tab=Overview) in the Azure Marketplace.
