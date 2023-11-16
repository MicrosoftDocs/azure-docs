---
title: "[Recommended] Illusive Platform via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Illusive Platform via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Illusive Platform via AMA connector for Microsoft Sentinel

The Illusive Platform Connector allows you to share Illusive's attack surface analysis data and incident logs with Microsoft Sentinel and view this information in dedicated dashboards that offer insight into your organization's attack surface risk (ASM Dashboard) and track unauthorized lateral movement in your organization's network (ADS Dashboard).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (illusive)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Illusive Networks](https://illusive.com/support) |

## Query samples

**Number of Incidents in the last 30 days in which Trigger Type is found**
   ```kusto
union CommonSecurityLog 
   | where (DeviceEventClassID == "illusive:login" or DeviceEventClassID == "illusive:access" or DeviceEventClassID == "illusive:suspicious") 
   | where Message !contains "hasForensics"  
   | where TimeGenerated > ago(30d)  
   | extend DeviceCustomNumber2 = coalesce(column_ifexists("FieldDeviceCustomNumber2", long(null)), DeviceCustomNumber2, long(null)) 
   | summarize by DestinationServiceName, DeviceCustomNumber2  
   | summarize incident_count=count() by DestinationServiceName
   ```

**Top 10 alerting hosts in the last 30 days**
   ```kusto
union CommonSecurityLog  
   | where (DeviceEventClassID == "illusive:login" or DeviceEventClassID == "illusive:access" or DeviceEventClassID == "illusive:suspicious") 
   | where Message !contains "hasForensics"  
   | where TimeGenerated > ago(30d)  
   | extend DeviceCustomNumber2 = coalesce(column_ifexists("FieldDeviceCustomNumber2", long(null)), DeviceCustomNumber2, long(null))   
   | summarize by AlertingHost=iff(SourceHostName != "" and SourceHostName != "Failed to obtain", SourceHostName, SourceIP)   ,DeviceCustomNumber2  
   | where AlertingHost != "" and AlertingHost != "Failed to obtain"  
   | summarize incident_count=count() by AlertingHost  
   | order by incident_count  
   | limit 10
   ```



## Prerequisites

To integrate with [Recommended] Illusive Platform via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/illusivenetworks.illusive_platform_mss?tab=Overview) in the Azure Marketplace.
