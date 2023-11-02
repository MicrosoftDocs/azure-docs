---
title: "Palo Alto Networks (Firewall) connector for Microsoft Sentinel"
description: "Learn how to install the connector Palo Alto Networks (Firewall) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Palo Alto Networks (Firewall) connector for Microsoft Sentinel

The Palo Alto Networks firewall connector allows you to easily connect your Palo Alto Networks logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (PaloAlto)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Palo Alto Networks"

   | where DeviceProduct has "PAN-OS"

            
   | sort by TimeGenerated
   ```

**THREAT activity**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Palo Alto Networks"

   | where DeviceProduct has "PAN-OS"

            
   | where Activity == "THREAT"
            
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

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward Palo Alto Networks logs to Syslog agent

Configure Palo Alto Networks to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

Go to [configure Palo Alto Networks NGFW for sending CEF events.](https://aka.ms/sentinel-paloaltonetworks-readme)

Go to [Palo Alto CEF Configuration](https://aka.ms/asi-syslog-paloalto-forwarding)  and Palo Alto [Configure Syslog Monitoring](https://aka.ms/asi-syslog-paloalto-configure)  steps 2, 3, choose your version, and follow the instructions using the following guidelines:

1.  Set the Syslog server format to  **BSD**.

2.  The copy/paste operations from the PDF might change the text and insert random characters. To avoid this, copy the text to an editor and remove any characters that might break the log format before pasting it.

[Learn more >](https://aka.ms/CEFPaloAlto)

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

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltopanos?tab=Overview) in the Azure Marketplace.
