---
title: "[Recommended] Akamai Security Events via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Akamai Security Events via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Akamai Security Events via AMA connector for Microsoft Sentinel

Akamai Solution for Microsoft Sentinel provides the capability to ingest [Akamai Security Events](https://www.akamai.com/us/en/products/security/) into Microsoft Sentinel. Refer to [Akamai SIEM Integration documentation](https://developer.akamai.com/tools/integrations/siem) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (AkamaiSecurityEvents)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Countries**
   ```kusto
AkamaiSIEMEvent
 
   | summarize count() by SrcGeoCountry
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with [Recommended] Akamai Security Events via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias Akamai Security Events and load the function code or click [here](https://aka.ms/sentinel-akamaisecurityevents-parser), on the second line of the query, enter the hostname(s) of your Akamai Security Events device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-akamai?tab=Overview) in the Azure Marketplace.
