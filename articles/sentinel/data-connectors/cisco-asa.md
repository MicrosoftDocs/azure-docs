---
title: "Cisco ASA connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco ASA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco ASA connector for Microsoft Sentinel

The Cisco ASA firewall connector allows you to easily connect your Cisco ASA logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (Cisco)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**All logs**
   ```kusto

CommonSecurityLog​ 

   | where DeviceVendor =~ "Cisco"

   | where DeviceProduct == "ASA"

            
   | sort by TimeGenerated
   ```

**Deny device actions**
   ```kusto

CommonSecurityLog​ 

   | where DeviceVendor =~ "Cisco"

   | where DeviceProduct == "ASA"

            
   | where SimplifiedDeviceAction == "Deny"
            
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

2. Forward Cisco ASA logs to Syslog agent

Configure Cisco ASA to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

Go to [Send Syslog messages to an external Syslog server](https://aka.ms/asi-syslog-cisco-forwarding), and follow the instructions to set up the connection. Use these parameters when prompted:

1.  Set "port" to 514.
2.  Set "syslog_ip" to the IP address of the Syslog agent.


[Learn more >](https://aka.ms/CEFCisco)

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

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoasa?tab=Overview) in the Azure Marketplace.
