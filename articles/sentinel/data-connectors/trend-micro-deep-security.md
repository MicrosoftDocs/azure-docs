---
title: "Trend Micro Deep Security connector for Microsoft Sentinel"
description: "Learn how to install the connector Trend Micro Deep Security to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Trend Micro Deep Security connector for Microsoft Sentinel

The Trend Micro Deep Security connector allows you to easily connect your Deep Security logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's networks/systems and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function url** | https://aka.ms/TrendMicroDeepSecurityFunction |
| **Log Analytics table(s)** | CommonSecurityLog (TrendMicroDeepSecurity)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Trend Micro](https://success.trendmicro.com/dcx/s/?language=en_US) |

## Query samples

**Intrusion Prevention Events**
   ```kusto

TrendMicroDeepSecurity

            
   | where DeepSecurityModuleName == "Intrusion Prevention"
            
   | sort by TimeGenerated
   ```

**Integrity Monitoring Events**
   ```kusto

TrendMicroDeepSecurity

            
   | where DeepSecurityModuleName == "Integrity Monitoring"
            
   | sort by TimeGenerated
   ```

**Firewall Events**
   ```kusto

TrendMicroDeepSecurity

            
   | where DeepSecurityModuleName == "Firewall Events"
            
   | sort by TimeGenerated
   ```

**Log Inspection Events**
   ```kusto

TrendMicroDeepSecurity

            
   | where DeepSecurityModuleName == "Log Inspection"
            
   | sort by TimeGenerated
   ```

**Anti-Malware Events**
   ```kusto

TrendMicroDeepSecurity

            
   | where DeepSecurityModuleName == "Anti-Malware"
            
   | sort by TimeGenerated
   ```

**Web Reputation Events**
   ```kusto

TrendMicroDeepSecurity

            
   | where DeepSecurityModuleName == "Web Reputation"
            
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

> 1. Make sure that you have Python on your machine using the following command: python -version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}

2. Forward Trend Micro Deep Security logs to Syslog agent

1. Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure to send the logs to port 514 TCP on the machine's IP address.
2. Forward Trend Micro Deep Security events to the Syslog agent.
3. Define a new Syslog Configuration that uses the CEF format by referencing [this knowledge article](https://aka.ms/Sentinel-trendmicro-kblink)  for additional information.
4. Configure the Deep Security Manager to use this new configuration to forward events to the Syslog agent using [these instructions](https://aka.ms/Sentinel-trendMicro-connectorInstructions).
5. Make sure to save the [TrendMicroDeepSecurity](https://aka.ms/TrendMicroDeepSecurityFunction) function so that it queries the Trend Micro Deep Security data properly.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py {0}

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/trendmicro.trend_micro_deep_security_mss?tab=Overview) in the Azure Marketplace.
