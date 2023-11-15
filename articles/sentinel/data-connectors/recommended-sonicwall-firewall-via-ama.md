---
title: "[Recommended] SonicWall Firewall via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] SonicWall Firewall via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] SonicWall Firewall via AMA connector for Microsoft Sentinel

Common Event Format (CEF) is an industry standard format on top of Syslog messages, used by SonicWall to allow event interoperability among different platforms. By connecting your CEF logs to Microsoft Sentinel, you can take advantage of search & correlation, alerting, and threat intelligence enrichment for each log.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (SonicWall)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [SonicWall](https://www.sonicwall.com/support/) |

## Query samples

**All logs**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "SonicWall"

   | sort by TimeGenerated desc
   ```

**Summarize by destination IP and port**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "SonicWall"

   | summarize count() by DestinationIP, DestinationPort, TimeGenerated

   | sort by TimeGenerated desc
   ```

**Show all dropped traffic from the SonicWall Firewall**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "SonicWall"

   | where AdditionalExtensions contains "fw_action='drop'"
   ```



## Prerequisites

To integrate with [Recommended] SonicWall Firewall via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/sonicwall-inc.sonicwall-networksecurity-azure-sentinal?tab=Overview) in the Azure Marketplace.
