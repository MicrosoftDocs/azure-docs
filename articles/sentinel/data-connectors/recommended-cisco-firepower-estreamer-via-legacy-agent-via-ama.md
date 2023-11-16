---
title: "[Recommended] Cisco Firepower eStreamer via Legacy Agent via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Cisco Firepower eStreamer via Legacy Agent via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Cisco Firepower eStreamer via Legacy Agent via AMA connector for Microsoft Sentinel

eStreamer is a Client Server API designed for the Cisco Firepower NGFW Solution. The eStreamer client requests detailed event data on behalf of the SIEM or logging solution in the Common Event Format (CEF).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (CiscoFirepowerEstreamerCEF)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Cisco](https://www.cisco.com/c/en_in/support/index.html) |

## Query samples

**Firewall Blocked Events**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cisco"

   | where DeviceProduct == "Firepower" 
   | where DeviceAction != "Allow"
   ```

**File Malware Events**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cisco"

   | where DeviceProduct == "Firepower" 
   | where Activity == "File Malware Event"
   ```

**Outbound Web Traffic Port 80**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cisco"

   | where DeviceProduct == "Firepower" 
   | where DestinationPort == "80"
   ```



## Prerequisites

To integrate with [Recommended] Cisco Firepower eStreamer via Legacy Agent via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cisco.cisco-firepower-estreamer?tab=Overview) in the Azure Marketplace.
