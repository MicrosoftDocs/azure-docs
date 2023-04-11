---
title: "Illusive Platform connector for Microsoft Sentinel"
description: "Learn how to install the connector Illusive Platform to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Illusive Platform connector for Microsoft Sentinel

The Illusive Platform Connector allows you to share Illusive's attack surface analysis data and incident logs with Microsoft Sentinel and view this information in dedicated dashboards that offer insight into your organization's attack surface risk (ASM Dashboard) and track unauthorized lateral movement in your organization's network (ADS Dashboard).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (illusive)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Illusive Networks](https://illusive.com/support) |

## Query samples

**Number of Incidents in in the last 30 days in which Trigger Type is found**
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



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel this machine can be on your on-prem environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python on your machine using the following command: python -version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}

2. Forward Illusive Common Event Format (CEF) logs to Syslog agent

1. Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.
> 2. Log onto the Illusive Console, and navigate to Settings->Reporting.
> 3. Find Syslog Servers
> 4. Supply the following information:
>> 1. Host name: Linux Syslog agent IP address or FQDN host name
>> 2. Port: 514
>> 3. Protocol: TCP
>> 4. Audit messages: Send audit messages to server
> 5. To add the syslog server, click Add.
> 6. For more information about how to add a new syslog server in the Illusive platform, please find the Illusive Networks Admin Guide in here: https://support.illusivenetworks.com/hc/en-us/sections/360002292119-Documentation-by-Version

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   sudo wget O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/illusivenetworks.illusive_platform_mss?tab=Overview) in the Azure Marketplace.
