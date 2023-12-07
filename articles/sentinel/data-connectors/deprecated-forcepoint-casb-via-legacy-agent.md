---
title: "[Deprecated] Forcepoint CASB via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] Forcepoint CASB via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] Forcepoint CASB via Legacy Agent connector for Microsoft Sentinel

The Forcepoint CASB (Cloud Access Security Broker) Connector allows you to automatically export CASB logs and events into Microsoft Sentinel in real-time. This enriches visibility into user activities across locations and cloud applications, enables further correlation with data from Azure workloads and other feeds, and improves monitoring capability with Workbooks inside Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (ForcepointCASB)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Community](https://github.com/Azure/Azure-Sentinel/issues) |

## Query samples

**Top 5 Users With The Highest Number Of Logs**
   ```kusto
CommonSecurityLog 

   | summarize Count = count() by DestinationUserName

   | top 5 by DestinationUserName

   | render barchart
   ```

**Top 5 Users by Number of Failed Attempts **
   ```kusto
CommonSecurityLog 

   | extend outcome = coalesce(column_ifexists("EventOutcome", ""), tostring(split(split(AdditionalExtensions, ";", 2)[0], "=", 1)[0]), "")

   | extend reason = coalesce(column_ifexists("Reason", ""), tostring(split(split(AdditionalExtensions, ";", 3)[0], "=", 1)[0]), "")

   | where outcome =="Failure"

   | summarize Count= count() by DestinationUserName

   | render barchart
   ```



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel. This machine can be on your on-prem environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python on your machine using the following command: python -version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward Common Event Format (CEF) logs to Syslog agent

Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version 
 
>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget  -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)

5. Forcepoint integration installation guide 

To complete the installation of this Forcepoint product integration, follow the guide linked below.

[Installation Guide >](https://frcpnt.com/casb-sentinel)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-forcepoint-casb?tab=Overview) in the Azure Marketplace.
