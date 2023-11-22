---
title: "[Deprecated] ExtraHop Reveal(x) via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] ExtraHop Reveal(x) via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] ExtraHop Reveal(x) via Legacy Agent connector for Microsoft Sentinel

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

To integrate with [Deprecated] ExtraHop Reveal(x) via Legacy Agent make sure you have: 

- **ExtraHop**: ExtraHop Discover or Command appliance with firmware version 7.8 or later with a user account that has Unlimited (administrator) privileges.


## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel this machine can be on your on-premises environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python on your machine using the following command: python --version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward ExtraHop Networks logs to Syslog agent

1.  Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure to send the logs to port 514 TCP on the machine IP address.
2. Follow the directions to install the [ExtraHop Detection SIEM Connector bundle](https://learn.extrahop.com/extrahop-detection-siem-connector-bundle) on your Reveal(x) system. The SIEM Connector is required for this integration.
3. Enable the trigger for **ExtraHop Detection SIEM Connector - CEF**
4. Update the trigger with the ODS syslog targets you created 
5. The Reveal(x) system formats syslog messages in Common Event Format (CEF) and then sends data to Microsoft Sentinel.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python --version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/extrahop.extrahop_revealx_mss?tab=Overview) in the Azure Marketplace.
