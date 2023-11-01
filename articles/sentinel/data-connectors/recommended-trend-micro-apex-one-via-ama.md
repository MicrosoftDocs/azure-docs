---
title: "[Recommended] Trend Micro Apex One via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Trend Micro Apex One via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Trend Micro Apex One via AMA connector for Microsoft Sentinel

The [Trend Micro Apex One](https://www.trendmicro.com/en_us/business/products/user-protection/sps/endpoint.html) data connector provides the capability to ingest [Trend Micro Apex One events](https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/appendices/syslog-mapping-cef.aspx) into Microsoft Sentinel. Refer to [Trend Micro Apex Central](https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/preface_001.aspx) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (TrendMicroApexOne)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto

TMApexOneEvent

   | sort by TimeGenerated
   ```



## Prerequisites

To integrate with [Recommended] Trend Micro Apex One via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


>This data connector depends on a parser based on a Kusto Function to work as expected [**TMApexOneEvent**](https://aka.ms/sentinel-TMApexOneEvent-parser) which is deployed with the Microsoft Sentinel Solution.


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-trendmicroapexone?tab=Overview) in the Azure Marketplace.
