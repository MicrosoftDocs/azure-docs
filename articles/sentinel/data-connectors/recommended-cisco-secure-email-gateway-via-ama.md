---
title: "[Recommended] Cisco Secure Email Gateway via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Cisco Secure Email Gateway via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Cisco Secure Email Gateway via AMA connector for Microsoft Sentinel

The [Cisco Secure Email Gateway (SEG)](https://www.cisco.com/c/en/us/products/security/email-security/index.html) data connector provides the capability to ingest [Cisco SEG Consolidated Event Logs](https://www.cisco.com/c/en/us/td/docs/security/esa/esa14-0/user_guide/b_ESA_Admin_Guide_14-0/b_ESA_Admin_Guide_12_1_chapter_0100111.html#con_1061902) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (CiscoSEG)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Senders**
   ```kusto
CiscoSEGEvent
 
   | where isnotempty(SrcUserName)
    
   | summarize count() by SrcUserName
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with [Recommended] Cisco Secure Email Gateway via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**CiscoSEGEvent**](https://aka.ms/sentinel-CiscoSEG-parser) which is deployed with the Microsoft Sentinel Solution.


2. Secure your machine 

2Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoseg?tab=Overview) in the Azure Marketplace.
