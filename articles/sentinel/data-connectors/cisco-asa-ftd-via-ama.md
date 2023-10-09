---
title: "Cisco ASA/FTD via AMA (Preview) connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco ASA/FTD via AMA (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco ASA/FTD via AMA (Preview) connector for Microsoft Sentinel

The Cisco ASA firewall connector allows you to easily connect your Cisco ASA logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All logs**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cisco"

   | where DeviceProduct == "ASA"
            
   | sort by TimeGenerated
   ```

## Prerequisites

To integrate with Cisco ASA/FTD via AMA (Preview) make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)

## Vendor installation instructions

Enable data collection rule​

> Cisco ASA/FTD event logs are collected only from **Linux** agents.

Run the following command to install and apply the Cisco ASA/FTD collector:

```
   sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py
```

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoasa?tab=Overview) in the Azure Marketplace.
