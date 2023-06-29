---
title: "Aruba ClearPass connector for Microsoft Sentinel"
description: "Learn how to install the connector Aruba ClearPass to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Aruba ClearPass connector for Microsoft Sentinel

The [Aruba ClearPass](https://www.arubanetworks.com/products/security/network-access-control/secure-access/) connector allows you to easily connect your Aruba ClearPass with Microsoft Sentinel, to create custom dashboards, alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (ArubaClearPass)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Top 10 Events by Username**
   ```kusto
ArubaClearPass 
 
   | summarize count() by UserName 

   | top 10 by count_
   ```

**Top 10 Error Codes**
   ```kusto
ArubaClearPass 
 
   | summarize count() by ErrorCode 

   | top 10 by count_
   ```



## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias ArubaClearPass and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Aruba%20ClearPass/Parsers/ArubaClearPass.txt).The function usually takes 10-15 minutes to activate after solution installation/update.

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

2. Forward Aruba ClearPass logs to a Syslog agent

Configure Aruba ClearPass to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.
1. [Follow these instructions](https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm) to configure the Aruba ClearPass to forward syslog.
2. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.

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

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-arubaclearpass?tab=Overview) in the Azure Marketplace.
