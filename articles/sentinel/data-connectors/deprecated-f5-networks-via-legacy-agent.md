---
title: "[Deprecated] F5 Networks via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] F5 Networks via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] F5 Networks via Legacy Agent connector for Microsoft Sentinel

The F5 firewall connector allows you to easily connect your F5 logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (F5)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [F5](https://www.f5.com/services/support) |

## Query samples

**All logs**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "F5"

            
   | sort by TimeGenerated
   ```

**Summarize by time**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "F5"

            
   | summarize count() by TimeGenerated
            
   | sort by TimeGenerated
   ```



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel this machine can be on your on-prem environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python on your machine using the following command: python --version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward Common Event Format (CEF) logs to Syslog agent

Configure F5 to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

Go to [F5 Configuring Application Security Event Logging](https://aka.ms/asi-syslog-f5-forwarding), follow the instructions to set up remote logging, using the following guidelines:

1.  Set the  **Remote storage type**  to CEF.
2.  Set the  **Protocol setting**  to UDP.
3.  Set the  **IP address**  to the Syslog server IP address.
4.  Set the  **port number**  to 514, or the port your agent uses.
5.  Set the  **facility**  to the one that you configured in the Syslog agent (by default, the agent sets this to local4).
6.  You can set the  **Maximum Query String Size**  to be the same as you configured.

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

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/f5-networks.f5_networks_data_mss?tab=Overview) in the Azure Marketplace.
