---
title: "[Recommended] Forcepoint CSG via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Forcepoint CSG via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Forcepoint CSG via AMA connector for Microsoft Sentinel

Forcepoint Cloud Security Gateway is a converged cloud security service that provides visibility, control, and threat protection for users and data, wherever they are. For more information visit: https://www.forcepoint.com/product/cloud-security-gateway

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (Forcepoint CSG)<br/> CommonSecurityLog (Forcepoint CSG)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Community](https://github.com/Azure/Azure-Sentinel/issues) |

## Query samples

**Top 5 Web requested Domains with log severity equal to 6 (Medium)**
   ```kusto
CommonSecurityLog

   | where TimeGenerated <= ago(0m)

   | where DeviceVendor == "Forcepoint CSG"

   | where DeviceProduct == "Web"

   | where LogSeverity == 6

   | where DeviceCustomString2 != ""

   | summarize Count=count() by DeviceCustomString2

   | top 5 by Count

   | render piechart
   ```

**Top 5 Web Users with 'Action' equal to 'Blocked'**
   ```kusto
CommonSecurityLog

   | where TimeGenerated <= ago(0m)

   | where DeviceVendor == "Forcepoint CSG"

   | where DeviceProduct == "Web"

   | where Activity == "Blocked"

   | where SourceUserID != "Not available"

   | summarize Count=count() by SourceUserID

   | top 5 by Count

   | render piechart
   ```

**Top 5 Sender Email Addresses Where Spam Score Greater Than 10.0**
   ```kusto
CommonSecurityLog

   | where TimeGenerated <= ago(0m)

   | where DeviceVendor == "Forcepoint CSG"

   | where DeviceProduct == "Email"

   | where DeviceCustomFloatingPoint1 > 10.0

   | summarize Count=count() by SourceUserName

   | top 5 by Count

   | render barchart
   ```



## Prerequisites

To integrate with [Recommended] Forcepoint CSG via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF).



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-forcepoint-csg?tab=Overview) in the Azure Marketplace.
