---
title: "[Recommended] Morphisec UTPP via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Morphisec UTPP via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Morphisec UTPP via AMA connector for Microsoft Sentinel

Integrate vital insights from your security products with the Morphisec Data Connector for Microsoft Sentinel and expand your analytical capabilities with search and correlation, threat intelligence, and customized alerts. Morphisec's Data Connector provides visibility into today's most advanced threats including sophisticated fileless attacks, in-memory exploits and zero days. With a single, cross-product view, you can make real-time, data-backed decisions to protect your most important assets

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function url** | https://aka.ms/sentinel-morphisecutpp-parser |
| **Log Analytics table(s)** | CommonSecurityLog (Morphisec)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Morphisec](https://support.morphisec.com/support/home) |

## Query samples

**Threats count by host**
   ```kusto

Morphisec

            
   | summarize Times_Attacked=count() by SourceHostName
   ```

**Threats count by username**
   ```kusto

Morphisec

            
   | summarize Times_Attacked=count() by SourceUserName
   ```

**Threats with high severity**
   ```kusto

Morphisec

            
   | where toint( LogSeverity) > 7  
   | order by TimeGenerated
   ```



## Prerequisites

To integrate with [Recommended] Morphisec UTPP via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


These queries and workbooks are dependent on Kusto functions based on Kusto to work as expected. Follow the steps to use the Kusto functions alias "Morphisec" 
in queries and workbooks. [Follow steps to get this Kusto function.](https://aka.ms/sentinel-morphisecutpp-parser)


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/morphisec.morphisec_utpp_mss?tab=Overview) in the Azure Marketplace.
