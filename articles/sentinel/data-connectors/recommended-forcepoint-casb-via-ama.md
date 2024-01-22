---
title: "[Recommended] Forcepoint CASB via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Forcepoint CASB via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Forcepoint CASB via AMA connector for Microsoft Sentinel

The Forcepoint CASB (Cloud Access Security Broker) Connector allows you to automatically export CASB logs and events into Microsoft Sentinel in real-time. This enriches visibility into user activities across locations and cloud applications, enables further correlation with data from Azure workloads and other feeds, and improves monitoring capability with Workbooks inside Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (ForcepointCASB)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Community](https://github.com/Azure/Azure-Sentinel/issues) |

## Query samples

**Top 5 Users With The Highest Number Of Logs**
   ```kusto
CommonSecurityLog 

   | summarize Count = count() by DestinationUserName

   | top 5 by DestinationUserName

   | render barchart
   ```

**Top 5 Users by Number of Failed Attempts **
   ```kusto
CommonSecurityLog 

   | extend outcome = coalesce(column_ifexists("EventOutcome", ""), tostring(split(split(AdditionalExtensions, ";", 2)[0], "=", 1)[0]), "")

   | extend reason = coalesce(column_ifexists("Reason", ""), tostring(split(split(AdditionalExtensions, ";", 3)[0], "=", 1)[0]), "")

   | where outcome =="Failure"

   | summarize Count= count() by DestinationUserName

   | render barchart
   ```



## Prerequisites

To integrate with [Recommended] Forcepoint CASB via AMA make sure you have: 

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

[Installation Guide >](https://frcpnt.com/casb-sentinel)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-forcepoint-casb?tab=Overview) in the Azure Marketplace.
