---
title: "[Deprecated] Trend Micro Apex One via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] Trend Micro Apex One via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] Trend Micro Apex One via Legacy Agent connector for Microsoft Sentinel

The [Trend Micro Apex One](https://www.trendmicro.com/en_us/business/products/user-protection/sps/endpoint.html) data connector provides the capability to ingest [Trend Micro Apex One events](https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/appendices/syslog-mapping-cef.aspx) into Microsoft Sentinel. Refer to [Trend Micro Apex Central](https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/preface_001.aspx) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (TrendMicroApexOne)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto

TMApexOneEvent

   | sort by TimeGenerated
   ```



## Vendor installation instructions


>This data connector depends on a parser based on a Kusto Function to work as expected [**TMApexOneEvent**](https://aka.ms/sentinel-TMApexOneEvent-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using Trend Micro Apex Central 2019

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

2. Forward Common Event Format (CEF) logs to Syslog agent

[Follow these steps](https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/detections/logs_001/syslog-forwarding.aspx) to configure Apex Central sending alerts via syslog. While configuring, on step 6, select the log format **CEF**.

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

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-trendmicroapexone?tab=Overview) in the Azure Marketplace.
