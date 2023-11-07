---
title: "[Recommended] Kaspersky Security Center via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Kaspersky Security Center via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Kaspersky Security Center via AMA connector for Microsoft Sentinel

The [Kaspersky Security Center](https://support.kaspersky.com/KSC/13/en-US/3396.htm) data connector provides the capability to ingest [Kaspersky Security Center logs](https://support.kaspersky.com/KSC/13/en-US/151336.htm) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (KasperskySC)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Destinations**
   ```kusto
KasperskySCEvent
 
   | where isnotempty(DstIpAddr)
    
   | summarize count() by DstIpAddr
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with [Recommended] Kaspersky Security Center via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**KasperskySCEvent**](https://aka.ms/sentinel-kasperskysc-parser) which is deployed with the Microsoft Sentinel Solution.


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-kasperskysc?tab=Overview) in the Azure Marketplace.
