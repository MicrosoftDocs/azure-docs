---
title: "[Recommended] FireEye Network Security (NX) via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] FireEye Network Security (NX) via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] FireEye Network Security (NX) via AMA connector for Microsoft Sentinel

The [FireEye Network Security (NX)](https://www.fireeye.com/products/network-security.html) data connector provides the capability to ingest FireEye Network Security logs into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (FireEyeNX)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Sources**
   ```kusto
FireEyeNXEvent
 
   | where isnotempty(SrcIpAddr)
    
   | summarize count() by SrcIpAddr
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with [Recommended] FireEye Network Security (NX) via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**FireEyeNXEvent**](https://aka.ms/sentinel-FireEyeNX-parser) which is deployed with the Microsoft Sentinel Solution.


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-fireeyenx?tab=Overview) in the Azure Marketplace.
