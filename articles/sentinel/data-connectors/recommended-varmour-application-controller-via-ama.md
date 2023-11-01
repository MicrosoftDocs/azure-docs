---
title: "[Recommended] vArmour Application Controller via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] vArmour Application Controller via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] vArmour Application Controller via AMA connector for Microsoft Sentinel

vArmour reduces operational risk and increases cyber resiliency by visualizing and controlling application relationships across the enterprise. This vArmour connector enables streaming of Application Controller Violation Alerts into Microsoft Sentinel, so you can take advantage of search & correlation, alerting, & threat intelligence enrichment for each log.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (vArmour)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [vArmour Networks](https://www.varmour.com/contact-us/) |

## Query samples

**Top 10 App to App violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | extend AppNameSrcDstPair = extract_all("AppName=;(\\w+)", AdditionalExtensions)

   | summarize count() by tostring(AppNameSrcDstPair)

   | top 10 by count_

   ```

**Top 10 Policy names matching violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | summarize count() by DeviceCustomString1

   | top 10 by count_ desc

   ```

**Top 10 Source IPs generating violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | summarize count() by SourceIP

   | top 10 by count_

   ```

**Top 10 Destination IPs generating violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | summarize count() by DestinationIP

   | top 10 by count_

   ```

**Top 10 Application Protocols matching violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | summarize count() by ApplicationProtocol

   | top 10 by count_

   ```



## Prerequisites

To integrate with [Recommended] vArmour Application Controller via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/varmournetworks.varmour_sentinel?tab=Overview) in the Azure Marketplace.
