---
title: "[Recommended] ExtraHop Reveal(x) via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] ExtraHop Reveal(x) via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] ExtraHop Reveal(x) via AMA connector for Microsoft Sentinel

The ExtraHop Reveal(x) data connector enables you to easily connect your Reveal(x) system with Microsoft Sentinel to view dashboards, create custom alerts, and improve investigation. This integration gives you the ability to gain insight into your organization's network and improve your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (‘ExtraHop’)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [ExtraHop](https://www.extrahop.com/support/) |

## Query samples

**All logs**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "ExtraHop"

            
   | sort by TimeGenerated
   ```

**All detections, de-duplicated**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "ExtraHop"

            
   | extend categories = iif(DeviceCustomString2 != "", split(DeviceCustomString2, ","),dynamic(null))
                
   | extend StartTime = extract("start=([0-9-]+T[0-9:.]+Z)", 1, AdditionalExtensions,typeof(datetime))
                
   | extend EndTime = extract("end=([0-9-]+T[0-9:.]+Z)", 1, AdditionalExtensions,typeof(datetime))
                
   | project      
                DeviceEventClassID="ExtraHop Detection",
                Title=Activity,
                Description=Message,
                riskScore=DeviceCustomNumber2,     
                SourceIP,
                DestinationIP,
                detectionID=tostring(DeviceCustomNumber1),
                updateTime=todatetime(ReceiptTime),
                StartTime,
                EndTime,
                detectionURI=DeviceCustomString1,
                categories,
                Computer
                
   | summarize arg_max(updateTime, *) by detectionID
                
   | sort by detectionID desc
   ```



## Prerequisites

To integrate with [Recommended] ExtraHop Reveal(x) via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/extrahop.extrahop_revealx_mss?tab=Overview) in the Azure Marketplace.
