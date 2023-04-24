---
title: "Windows Firewall Events via AMA (Preview) connector for Microsoft Sentinel"
description: "Learn how to install the connector Windows Firewall Events via AMA (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Windows Firewall Events via AMA (Preview) connector for Microsoft Sentinel

Windows Firewall is a Microsoft Windows application that filters information coming to your system from the internet and blocking potentially harmful programs. The firewall software blocks most programs from communicating through the firewall. Customers wishing to stream their Windows Firewall application logs collected from their machines can now use the AMA to stream those logs to the Microsoft Sentinel workspace.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ASimNetworkSessionLogs<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
ASimNetworkSessionLogs

   | where EventProduct == "Windows Firewall"
            
   | sort by TimeGenerated
   ```



## Prerequisites

To integrate with Windows Firewall Events via AMA (Preview) make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)


## Vendor installation instructions

Enable data collection rule

> Windows Firewall events are collected only from Windows agents.






## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-windowsfirewall?tab=Overview) in the Azure Marketplace.
