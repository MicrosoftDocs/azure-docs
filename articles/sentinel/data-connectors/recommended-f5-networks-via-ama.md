---
title: "[Recommended] F5 Networks via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] F5 Networks via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] F5 Networks via AMA connector for Microsoft Sentinel

The F5 firewall connector allows you to easily connect your F5 logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (F5)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [F5](https://www.f5.com/services/support) |

## Query samples

**All logs**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "F5"

            
   | sort by TimeGenerated
   ```

**Summarize by time**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "F5"

            
   | summarize count() by TimeGenerated
            
   | sort by TimeGenerated
   ```



## Prerequisites

To integrate with [Recommended] F5 Networks via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/f5-networks.f5_networks_data_mss?tab=Overview) in the Azure Marketplace.
