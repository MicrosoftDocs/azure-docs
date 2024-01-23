---
title: "[Deprecated] Netwrix Auditor via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] Netwrix Auditor via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] Netwrix Auditor via Legacy Agent connector for Microsoft Sentinel

Netwrix Auditor data connector provides the capability to ingest [Netwrix Auditor (formerly Stealthbits Privileged Activity Manager)](https://www.netwrix.com/auditor.html) events into Microsoft Sentinel. Refer to [Netwrix documentation](https://helpcenter.netwrix.com/) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | NetwrixAuditor |
| **Kusto function url** | https://aka.ms/sentinel-netwrixauditor-parser |
| **Log Analytics table(s)** | CommonSecurityLog<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Netwrix Auditor Events - All Activities.**
   ```kusto
NetwrixAuditor
 
   | sort by TimeGenerated desc
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on NetwrixAuditor parser based on a Kusto Function to work as expected. This parser is installed along with solution installation.

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

2.  Configure Netwrix Auditor to send logs using CEF

[Follow the instructions](https://www.netwrix.com/download/QuickStart/Netwrix_Auditor_Add-on_for_HPE_ArcSight_Quick_Start_Guide.pdf) to configure event export from Netwrix Auditor.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-netwrixauditor?tab=Overview) in the Azure Marketplace.
