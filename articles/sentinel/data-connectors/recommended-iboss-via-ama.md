---
title: "[Recommended] iboss via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] iboss via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] iboss via AMA connector for Microsoft Sentinel

The [iboss](https://www.iboss.com) data connector enables you to seamlessly connect your Threat Console to Microsoft Sentinel and enrich your instance with iboss URL event logs. Our logs are forwarded in Common Event Format (CEF) over Syslog and the configuration required can be completed on the iboss platform without the use of a proxy. Take advantage of our connector to garner critical data points and gain insight into security threats.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ibossUrlEvent<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [iboss](https://www.iboss.com/contact-us/) |

## Query samples

**Logs Received from the past week**
   ```kusto
ibossUrlEvent 
   | where TimeGenerated > ago(7d)
   ```



## Prerequisites

To integrate with [Recommended] iboss via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy (Only applicable if a dedicated proxy Linux machine has been configured).


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/iboss.iboss-sentinel-connector?tab=Overview) in the Azure Marketplace.
