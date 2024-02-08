---
title: "[Recommended] Palo Alto Networks Cortex Data Lake (CDL) via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Palo Alto Networks Cortex Data Lake (CDL) via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Palo Alto Networks Cortex Data Lake (CDL) via AMA connector for Microsoft Sentinel

The [Palo Alto Networks CDL](https://www.paloaltonetworks.com/cortex/cortex-data-lake) data connector provides the capability to ingest [CDL logs](https://docs.paloaltonetworks.com/cortex/cortex-data-lake/log-forwarding-schema-reference/log-forwarding-schema-overview.html) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (PaloAltoNetworksCDL)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Destinations**
   ```kusto
PaloAltoCDLEvent
 
   | where isnotempty(DstIpAddr)
    
   | summarize count() by DstIpAddr
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with [Recommended] Palo Alto Networks Cortex Data Lake (CDL) via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**PaloAltoCDLEvent**](https://aka.ms/sentinel-paloaltocdl-parser) which is deployed with the Microsoft Sentinel Solution.


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltocdl?tab=Overview) in the Azure Marketplace.
