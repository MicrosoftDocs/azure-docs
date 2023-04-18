---
title: "Trend Micro TippingPoint connector for Microsoft Sentinel"
description: "Learn how to install the connector Trend Micro TippingPoint to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Trend Micro TippingPoint connector for Microsoft Sentinel

The Trend Micro TippingPoint connector allows you to easily connect your TippingPoint SMS IPS events with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's networks/systems and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function url** | https://aka.ms/sentinel-trendmicrotippingpoint-function |
| **Log Analytics table(s)** | CommonSecurityLog (TrendMicroTippingPoint)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Trend Micro](https://success.trendmicro.com/dcx/s/contactus?language=en_US) |

## Query samples

**TippingPoint IPS Events**
   ```kusto

TrendMicroTippingPoint

            
   | sort by TimeGenerated
   ```

**Top IPS Events**
   ```kusto

TrendMicroTippingPoint

            
   | summarize EventCountTotal = sum(EventCount) by DeviceEventClassID, Activity, SimplifiedDeviceAction
            
   | sort by EventCountTotal desc
   ```

**Top Source IP for IPS Events**
   ```kusto

TrendMicroTippingPoint

            
   | summarize EventCountTotal = sum(EventCount) by SourceIP
            
   | sort by EventCountTotal desc
   ```

**Top Destination IP for IPS Events**
   ```kusto

TrendMicroTippingPoint

            
   | summarize EventCountTotal = sum(EventCount) by DestinationIP
            
   | sort by EventCountTotal desc
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-trendmicrotippingpoint-function) to create the Kusto functions alias, **TrendMicroTippingPoint**

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

2. Forward Trend Micro TippingPoint SMS logs to Syslog agent

Set your TippingPoint SMS to send Syslog messages in ArcSight CEF Format v4.2 format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   sudo wget  -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/trendmicro.trend_micro_tippingpoint_mss?tab=Overview) in the Azure Marketplace.
