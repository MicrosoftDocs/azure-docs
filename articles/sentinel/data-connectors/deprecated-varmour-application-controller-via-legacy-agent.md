---
title: "[Deprecated] vArmour Application Controller via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] vArmour Application Controller via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] vArmour Application Controller via Legacy Agent connector for Microsoft Sentinel

vArmour reduces operational risk and increases cyber resiliency by visualizing and controlling application relationships across the enterprise. This vArmour connector enables streaming of Application Controller Violation Alerts into Microsoft Sentinel, so you can take advantage of search & correlation, alerting, & threat intelligence enrichment for each log.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (vArmour)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [vArmour Networks](https://www.varmour.com/contact-us/) |

## Query samples

**Top 10 App to App violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | extend AppNameSrcDstPair = extract_all("AppName=;(\\w+)", AdditionalExtensions)

   | summarize count() by tostring(AppNameSrcDstPair)

   | top 10 by count_

   ```

**Top 10 Policy names matching violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | summarize count() by DeviceCustomString1

   | top 10 by count_ desc

   ```

**Top 10 Source IPs generating violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | summarize count() by SourceIP

   | top 10 by count_

   ```

**Top 10 Destination IPs generating violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | summarize count() by DestinationIP

   | top 10 by count_

   ```

**Top 10 Application Protocols matching violations**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "vArmour"

   | where DeviceProduct == "AC"

   | where Activity == "POLICY_VIOLATION"

   | summarize count() by ApplicationProtocol

   | top 10 by count_

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

2. Configure the vArmour Application Controller to forward Common Event Format (CEF) logs to the Syslog agent

Send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

2.1 Download the vArmour Application Controller user guide

Download the user guide from https://support.varmour.com/hc/en-us/articles/360057444831-vArmour-Application-Controller-6-0-User-Guide.

2.2 Configure the Application Controller to Send Policy Violations

In the user guide - refer to "Configuring Syslog for Monitoring and Violations" and follow steps 1 to 3.

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

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/varmournetworks.varmour_sentinel?tab=Overview) in the Azure Marketplace.
