---
title: "[Recommended] Netwrix Auditor via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Netwrix Auditor via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Netwrix Auditor via AMA connector for Microsoft Sentinel

Netwrix Auditor data connector provides the capability to ingest [Netwrix Auditor (formerly Stealthbits Privileged Activity Manager)](https://www.netwrix.com/auditor.html) events into Microsoft Sentinel. Refer to [Netwrix documentation](https://helpcenter.netwrix.com/) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | NetwrixAuditor |
| **Kusto function url** | https://aka.ms/sentinel-netwrixauditor-parser |
| **Log Analytics table(s)** | CommonSecurityLog<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Netwrix Auditor Events - All Activities.**
   ```kusto
NetwrixAuditor
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with [Recommended] Netwrix Auditor via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on NetwrixAuditor parser based on a Kusto Function to work as expected. This parser is installed along with solution installation.


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-netwrixauditor?tab=Overview) in the Azure Marketplace.
