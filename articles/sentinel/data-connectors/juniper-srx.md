---
title: "Juniper SRX connector for Microsoft Sentinel"
description: "Learn how to install the connector Juniper SRX to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Juniper SRX connector for Microsoft Sentinel

The [Juniper SRX](https://www.juniper.net/us/en/products-services/security/srx-series/) connector allows you to easily connect your Juniper SRX logs with Microsoft Sentinel. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (JuniperSRX)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Users with Failed Passwords**
   ```kusto
JuniperSRX 

   | where EventType == "sshd" 

   | where EventName == "Failed password" 

   | summarize count() by UserName 

   | top 10 by count_
   ```

**Top 10 IDS Detections by Source IP Address**
   ```kusto
JuniperSRX 

   | where EventType == "RT_IDS" 

   | summarize count() by SrcIpAddr 

   | top 10 by count_
   ```



## Prerequisites

To integrate with Juniper SRX make sure you have: 

- **Juniper SRX**: must be configured to export logs via Syslog


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias JuniperSRX and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Juniper%20SRX/Parsers/JuniperSRX.txt), on the second line of the query, enter the hostname(s) of your JuniperSRX device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the Juniper SRX

1. Follow these instructions to configure the Juniper SRX to forward syslog: 
 - [Traffic Logs (Security Policy Logs)](https://kb.juniper.net/InfoCenter/index?page=content&id=KB16509&actp=METADATA) 
 - [System Logs](https://kb.juniper.net/InfoCenter/index?page=content&id=kb16502)
2. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-junipersrx?tab=Overview) in the Azure Marketplace.
