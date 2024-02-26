---
title: "Forcepoint DLP connector for Microsoft Sentinel"
description: "Learn how to install the connector Forcepoint DLP to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Forcepoint DLP connector for Microsoft Sentinel

The Forcepoint DLP (Data Loss Prevention) connector allows you to automatically export DLP incident data from Forcepoint DLP into Microsoft Sentinel in real-time. This enriches visibility into user activities and data loss incidents, enables further correlation with data from Azure workloads and other feeds, and improves monitoring capability with Workbooks inside Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ForcepointDLPEvents_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Community](https://github.com/Azure/Azure-Sentinel/issues) |

## Query samples

**Rules triggered in the last three days**
   ```kusto
ForcepointDLPEvents_CL
 
   | where TimeGenerated > ago(3d)
 
   | summarize count(RuleName_1_s) by RuleName_1_s, SourceIpV4_s
 
   | render barchart
   ```

**Rules triggered over time (90 days)**
   ```kusto
ForcepointDLPEvents_CL
 
   | where TimeGenerated > ago(90d)
 
   | sort by CreatedAt_t asc nulls last
 
   | summarize count(RuleName_1_s)  by  CreatedAt_t, RuleName_1_s
 
   | render linechart
   ```

**Count of High, Medium and Low rules triggered over 90 days**
   ```kusto
ForcepointDLPEvents_CL
 
   | where TimeGenerated > ago(90d)
 
   | sort by CreatedAt_t asc nulls last
 
   | summarize count(Severity_s)  by  CreatedAt_t, Severity_s
 
   | render barchart
   ```



## Vendor installation instructions


Follow step by step instructions in the [Forcepoint DLP documentation for Microsoft Sentinel](https://frcpnt.com/dlp-sentinel) to configure this connector.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-forcepoint-dlp?tab=Overview) in the Azure Marketplace.
