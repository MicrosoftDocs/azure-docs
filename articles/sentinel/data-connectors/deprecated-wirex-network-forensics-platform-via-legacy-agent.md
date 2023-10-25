---
title: "[Deprecated] WireX Network Forensics Platform via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] WireX Network Forensics Platform via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] WireX Network Forensics Platform via Legacy Agent connector for Microsoft Sentinel

The WireX Systems data connector allows security professional to integrate with Microsoft Sentinel to allow you to further enrich your forensics investigations; to not only encompass the contextual content offered by WireX but to analyze data from other sources, and to create custom dashboards to give the most complete picture during a forensic investigation and to create custom workflows.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (WireXNFPevents)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [WireX Systems](https://wirexsystems.com/contact-us/) |

## Query samples

**All Imported Events from WireX**
   ```kusto
CommonSecurityLog 
   | where DeviceVendor == "WireX"

   ```

**Imported DNS Events from WireX**
   ```kusto
CommonSecurityLog
   | where DeviceVendor == "WireX"
 and ApplicationProtocol == "DNS"

   ```

**Imported DNS Events from WireX**
   ```kusto
CommonSecurityLog
   | where DeviceVendor == "WireX"
 and ApplicationProtocol == "HTTP"

   ```

**Imported DNS Events from WireX**
   ```kusto
CommonSecurityLog
   | where DeviceVendor == "WireX"
 and ApplicationProtocol == "TDS"

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

  `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward Common Event Format (CEF) logs to Syslog agent

Contact WireX support (https://wirexsystems.com/contact-us/) in order to configure your NFP solution to send Syslog messages in CEF format to the proxy machine. Make sure that they central manager can send the logs to port 514 TCP on the machine's IP address.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/wirexsystems1584682625009.wirex_network_forensics_platform_mss?tab=Overview) in the Azure Marketplace.
