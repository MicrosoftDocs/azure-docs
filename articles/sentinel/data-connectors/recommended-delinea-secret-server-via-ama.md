---
title: "[Recommended] Delinea Secret Server via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Delinea Secret Server via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Delinea Secret Server via AMA connector for Microsoft Sentinel

Common Event Format (CEF) from Delinea Secret Server 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog(DelineaSecretServer)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Delinea](https://delinea.com/support/) |

## Query samples

**Get records create new secret**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Delinea Software" or DeviceVendor == "Thycotic Software"

   | where DeviceProduct == "Secret Server"

   | where Activity has "SECRET - CREATE"
   ```

**Get records where view secret**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Delinea Software" or DeviceVendor == "Thycotic Software"

   | where DeviceProduct == "Secret Server"

   | where Activity has "SECRET - VIEW"
   ```



## Prerequisites

To integrate with [Recommended] Delinea Secret Server via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/delineainc1653506022260.delinea_secret_server_mss?tab=Overview) in the Azure Marketplace.
