---
title: "[Recommended] Citrix WAF (Web App Firewall) via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Citrix WAF (Web App Firewall) via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Citrix WAF (Web App Firewall) via AMA connector for Microsoft Sentinel

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



## Prerequisites

To integrate with [Recommended] Citrix WAF (Web App Firewall) via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/citrix.citrix_waf_mss?tab=Overview) in the Azure Marketplace.
