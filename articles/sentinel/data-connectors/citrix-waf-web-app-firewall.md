---
title: "Citrix WAF (Web App Firewall) connector for Microsoft Sentinel"
description: "Learn how to install the connector Citrix WAF (Web App Firewall) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Citrix WAF (Web App Firewall) connector for Microsoft Sentinel

 Citrix WAF (Web App Firewall) is an industry leading enterprise-grade WAF solution. Citrix WAF mitigates threats against your public-facing assets, including websites, apps, and APIs. From layer 3 to layer 7, Citrix WAF includes protections such as IP reputation, bot mitigation, defense against the OWASP Top 10 application threats, built-in signatures to protect against application stack vulnerabilities, and more. 

Citrix WAF supports Common Event Format (CEF) which is an industry standard format on top of Syslog messages . By connecting Citrix WAF CEF logs to Microsoft Sentinel, you can take advantage of search & correlation, alerting, and threat intelligence enrichment for each log.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (CitrixWAFLogs)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Citrix Systems](https://www.citrix.com/support/) |

## Query samples

**Citrix WAF Logs**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Citrix"

   | where DeviceProduct == "NetScaler"

   ```

**Citrix Waf logs for cross site scripting**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Citrix"

   | where DeviceProduct == "NetScaler"

   | where Activity == "APPFW_XSS"

   ```

**Citrix Waf logs for SQL Injection**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Citrix"

   | where DeviceProduct == "NetScaler"

   | where Activity == "APPFW_SQL"

   ```

**Citrix Waf logs for Bufferoverflow**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Citrix"

   | where DeviceProduct == "NetScaler"

   | where Activity == "APPFW_STARTURL"

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

   `sudo wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward Common Event Format (CEF) logs to Syslog agent

Configure Citrix WAF to send Syslog messages in CEF format to the proxy machine using the steps below. 

1. Follow [this guide](https://support.citrix.com/article/CTX234174) to configure WAF.

2. Follow [this guide](https://support.citrix.com/article/CTX136146) to configure CEF logs.

3. Follow [this guide](https://docs.citrix.com/en-us/citrix-adc/13/system/audit-logging/configuring-audit-logging.html) to forward the logs to proxy . Make sure you to send the logs to port 514 TCP on the Linux machine's IP address.



3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/citrix.citrix_waf_mss?tab=Overview) in the Azure Marketplace.
