---
title: "CyberArk Enterprise Password Vault (EPV) Events connector for Microsoft Sentinel"
description: "Learn how to install the connector CyberArk Enterprise Password Vault (EPV) Events to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# CyberArk Enterprise Password Vault (EPV) Events connector for Microsoft Sentinel

CyberArk Enterprise Password Vault generates an xml Syslog message for every action taken against the Vault.  The EPV will send the xml messages through the Microsoft Sentinel.xsl translator to be converted into CEF standard format and sent to a syslog staging server of your choice (syslog-ng, rsyslog). The Log Analytics agent installed on your syslog staging server will import the messages into Microsoft Log Analytics. Refer to the [CyberArk documentation](https://docs.cyberark.com/Product-Doc/OnlineHelp/PAS/Latest/en/Content/PASIMP/DV-Integrating-with-SIEM-Applications.htm) for more guidance on SIEM integrations.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (CyberArk)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Cyberark](https://www.cyberark.com/services-support/technical-support/) |

## Query samples

**CyberArk Alerts**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cyber-Ark"

   | where DeviceProduct == "Vault"

   | where LogSeverity == "7" or LogSeverity == "10"

   | sort by TimeGenerated desc
   ```



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel this machine can be on your on-prem environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python installed on your machine.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward Common Event Format (CEF) logs to Syslog agent

On the EPV configure the dbparm.ini to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machines IP address.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python installed on your machine using the following command: python -version

>

> 2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget  -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machines security according to your organizations security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cyberark.cyberark_epv_events_mss?tab=Overview) in the Azure Marketplace.
