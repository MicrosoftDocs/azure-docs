---
title: "Infoblox NIOS connector for Microsoft Sentinel"
description: "Learn how to install the connector Infoblox NIOS to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Infoblox NIOS connector for Microsoft Sentinel

The [Infoblox Network Identity Operating System (NIOS)](https://www.infoblox.com/glossary/network-identity-operating-system-nios/) connector allows you to easily connect your Infoblox NIOS logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (InfobloxNIOS)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Total Count by DHCP Request Message Types**
   ```kusto
union isfuzzy=true 
 Infoblox_dhcpdiscover,Infoblox_dhcprequest,Infoblox_dhcpinform 

   | summarize count() by Log_Type
   ```

**Top 5 Source IP address**
   ```kusto
Infoblox_dnsclient 
 
   | summarize count() by SrcIpAddr 
 
   | top 10 by count_ desc
   ```



## Prerequisites

To integrate with Infoblox NIOS make sure you have: 

- **Infoblox NIOS**: must be configured to export logs via Syslog


## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias Infoblox and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Infoblox%20NIOS/Parser/Infoblox.txt), on the second line of the query, enter the hostname(s) of your Infoblox device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the Infoblox NIOS

[Follow these instructions](https://www.infoblox.com/wp-content/uploads/infoblox-deployment-guide-slog-and-snmp-configuration-for-nios.pdf) to enable syslog forwarding of Infoblox NIOS Logs. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-infobloxnios?tab=Overview) in the Azure Marketplace.
