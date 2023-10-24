---
title: "[Deprecated] Morphisec UTPP via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] Morphisec UTPP via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] Morphisec UTPP via Legacy Agent connector for Microsoft Sentinel

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



## Vendor installation instructions


These queries and workbooks are dependent on Kusto functions based on Kusto to work as expected. Follow the steps to use the Kusto functions alias "Morphisec" 
in queries and workbooks. [Follow steps to get this Kusto function.](https://aka.ms/sentinel-morphisecutpp-parser)

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



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/morphisec.morphisec_utpp_mss?tab=Overview) in the Azure Marketplace.
