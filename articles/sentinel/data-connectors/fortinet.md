---
title: "Fortinet connector for Microsoft Sentinel"
description: "Learn how to install the connector Fortinet to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Fortinet connector for Microsoft Sentinel

The Fortinet firewall connector allows you to easily connect your Fortinet logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (Fortinet)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Fortinet"

   | where DeviceProduct startswith "Fortigate"

            
   | sort by TimeGenerated
   ```

**Summarize by destination IP and port**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Fortinet"

   | where DeviceProduct startswith "Fortigate"

            
   | summarize count() by DestinationIP, DestinationPort, TimeGenerated​
            
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

   sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py &&sudo python cef_installer.py {0} {1}

2. Forward Fortinet logs to Syslog agent

Set your Fortinet to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine’s IP address.


Copy the CLI commands below and:
-   Replace "server &lt;ip address&gt;" with the Syslog agent's IP address.
-   Set the "&lt;facility_name&gt;" to use the facility you configured in the Syslog agent (by default, the agent sets this to local4).
-   Set the Syslog port to 514, the port your agent uses.
-   To enable CEF format in early FortiOS versions, you may need to run the command "set csv disable".

For more information, go to the  [Fortinet Document Library](https://aka.ms/asi-syslog-fortinet-fortinetdocumentlibrary), choose your version, and use the "Handbook" and "Log Message Reference" PDFs.

[Learn more >](https://aka.ms/CEF-Fortinet)

   Set up the connection using the CLI to run the following commands:

   config log syslogd setting
    set status enable
set format cef
set port 514
set server <ip_address_of_Receiver>
end

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python --version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py &&sudo python cef_troubleshoot.py  {0}

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-fortinetfortigate?tab=Overview) in the Azure Marketplace.
