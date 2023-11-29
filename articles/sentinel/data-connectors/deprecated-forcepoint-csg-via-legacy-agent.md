---
title: "[Deprecated] Forcepoint CSG via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] Forcepoint CSG via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] Forcepoint CSG via Legacy Agent connector for Microsoft Sentinel

Forcepoint Cloud Security Gateway is a converged cloud security service that provides visibility, control, and threat protection for users and data, wherever they are. For more information visit: https://www.forcepoint.com/product/cloud-security-gateway

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (Forcepoint CSG)<br/> CommonSecurityLog (Forcepoint CSG)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Community](https://github.com/Azure/Azure-Sentinel/issues) |

## Query samples

**Top 5 Web requested Domains with log severity equal to 6 (Medium)**
   ```kusto
CommonSecurityLog

   | where TimeGenerated <= ago(0m)

   | where DeviceVendor == "Forcepoint CSG"

   | where DeviceProduct == "Web"

   | where LogSeverity == 6

   | where DeviceCustomString2 != ""

   | summarize Count=count() by DeviceCustomString2

   | top 5 by Count

   | render piechart
   ```

**Top 5 Web Users with 'Action' equal to 'Blocked'**
   ```kusto
CommonSecurityLog

   | where TimeGenerated <= ago(0m)

   | where DeviceVendor == "Forcepoint CSG"

   | where DeviceProduct == "Web"

   | where Activity == "Blocked"

   | where SourceUserID != "Not available"

   | summarize Count=count() by SourceUserID

   | top 5 by Count

   | render piechart
   ```

**Top 5 Sender Email Addresses Where Spam Score Greater Than 10.0**
   ```kusto
CommonSecurityLog

   | where TimeGenerated <= ago(0m)

   | where DeviceVendor == "Forcepoint CSG"

   | where DeviceProduct == "Email"

   | where DeviceCustomFloatingPoint1 > 10.0

   | summarize Count=count() by SourceUserName

   | top 5 by Count

   | render barchart
   ```



## Vendor installation instructions

1. Linux Syslog agent configuration

This integration requires the Linux Syslog agent to collect your Forcepoint Cloud Security Gateway Web/Email logs on port 514 TCP as Common Event Format (CEF) and forward them to Microsoft Sentinel.

   Your Data Connector Syslog Agent Installation Command is:

  `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Implementation options

The integration is made available with two implementations options.

2.1  Splunk Implementation

Leverages splunk images where the integration component is already installed with all necessary dependencies.

Follow the instructions provided in the Integration Guide linked below.

[Integration Guide >](https://forcepoint.github.io/docs/csg_and_splunk/)

2.2  VeloCloud Implementation

Requires the manual deployment of the integration component inside a clean Linux machine.

Follow the instructions provided in the Integration Guide  linked below.

[Integration Guide >](https://forcepoint.github.io/docs/csg_and_velocloud/)

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


[Learn more >](https://aka.ms/SecureCEF).



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-forcepoint-csg?tab=Overview) in the Azure Marketplace.
