---
title: "[Recommended] CyberArk Enterprise Password Vault (EPV) Events via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] CyberArk Enterprise Password Vault (EPV) Events via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] CyberArk Enterprise Password Vault (EPV) Events via AMA connector for Microsoft Sentinel

CyberArk Enterprise Password Vault generates an xml Syslog message for every action taken against the Vault.  The EPV will send the xml messages through the Microsoft Sentinel.xsl translator to be converted into CEF standard format and sent to a syslog staging server of your choice (syslog-ng, rsyslog). The Log Analytics agent installed on your syslog staging server will import the messages into Microsoft Log Analytics. Refer to the [CyberArk documentation](https://docs.cyberark.com/Product-Doc/OnlineHelp/PAS/Latest/en/Content/PASIMP/DV-Integrating-with-SIEM-Applications.htm) for more guidance on SIEM integrations.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (CyberArk)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Cyberark](https://www.cyberark.com/services-support/technical-support/) |

## Query samples

**CyberArk Alerts**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cyber-Ark"

   | where DeviceProduct == "Vault"

   | where LogSeverity == "7" or LogSeverity == "10"

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with [Recommended] CyberArk Enterprise Password Vault (EPV) Events via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machines security according to your organizations security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cyberark.cyberark_epv_events_mss?tab=Overview) in the Azure Marketplace.
