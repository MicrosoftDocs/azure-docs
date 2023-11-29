---
title: "[Recommended] WireX Network Forensics Platform via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] WireX Network Forensics Platform via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] WireX Network Forensics Platform via AMA connector for Microsoft Sentinel

The WireX Systems data connector allows security professional to integrate with Microsoft Sentinel to allow you to further enrich your forensics investigations; to not only encompass the contextual content offered by WireX but to analyze data from other sources, and to create custom dashboards to give the most complete picture during a forensic investigation and to create custom workflows.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (WireXNFPevents)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [WireX Systems](https://wirexsystems.com/contact-us/) |

## Query samples

**All Imported Events from WireX**
   ```kusto
CommonSecurityLog 
   | where DeviceVendor == "WireX"

   ```

**Imported DNS Events from WireX**
   ```kusto
CommonSecurityLog
   | where DeviceVendor == "WireX"
 and ApplicationProtocol == "DNS"

   ```

**Imported DNS Events from WireX**
   ```kusto
CommonSecurityLog
   | where DeviceVendor == "WireX"
 and ApplicationProtocol == "HTTP"

   ```

**Imported DNS Events from WireX**
   ```kusto
CommonSecurityLog
   | where DeviceVendor == "WireX"
 and ApplicationProtocol == "TDS"

   ```



## Prerequisites

To integrate with [Recommended] WireX Network Forensics Platform via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/wirexsystems1584682625009.wirex_network_forensics_platform_mss?tab=Overview) in the Azure Marketplace.
