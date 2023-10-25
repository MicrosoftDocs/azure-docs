---
title: "[Recommended] Forcepoint NGFW via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Forcepoint NGFW via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Forcepoint NGFW via AMA connector for Microsoft Sentinel

The Forcepoint NGFW (Next Generation Firewall) connector allows you to automatically export user-defined Forcepoint NGFW logs into Microsoft Sentinel in real-time. This enriches visibility into user activities recorded by NGFW, enables further correlation with data from Azure workloads and other feeds, and improves monitoring capability with Workbooks inside Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (ForcePointNGFW)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Community](https://github.com/Azure/Azure-Sentinel/issues) |

## Query samples

**Show all terminated actions from the Forcepoint NGFW**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Forcepoint"

   | where DeviceProduct == "NGFW"

   | where DeviceAction == "Terminate"

   ```

**Show all Forcepoint NGFW with suspected compromise behaviour**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Forcepoint"

   | where DeviceProduct == "NGFW"

   | where Activity contains "compromise"

   ```

**Show chart grouping all Forcepoint NGFW events by Activity type**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Forcepoint"

   | where DeviceProduct == "NGFW"

   | summarize count=count() by Activity
 
   | render barchart

   ```



## Prerequisites

To integrate with [Recommended] Forcepoint NGFW via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)

3. Forcepoint integration installation guide 

To complete the installation of this Forcepoint product integration, follow the guide linked below.

[Installation Guide >](https://frcpnt.com/ngfw-sentinel)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-forcepoint-ngfw?tab=Overview) in the Azure Marketplace.
