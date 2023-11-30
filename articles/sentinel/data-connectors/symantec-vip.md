---
title: "Symantec VIP connector for Microsoft Sentinel"
description: "Learn how to install the connector Symantec VIP to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Symantec VIP connector for Microsoft Sentinel

The [Symantec VIP](https://vip.symantec.com/) connector allows you to easily connect your Symantec VIP logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (SymantecVIP)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Reasons for Failed RADIUS Authentication **
   ```kusto
SymantecVIP 
 
   | summarize count() by Reason 

   | top 10 by count_
   ```

**Top 10 Users**
   ```kusto
SymantecVIP 
 
   | summarize count() by User 

   | top 10 by count_
   ```



## Prerequisites

To integrate with Symantec VIP make sure you have: 

- **Symantec VIP**: must be configured to export logs via Syslog


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias Symantec VIP and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Symantec%20VIP/Parsers/SymantecVIP.txt), on the second line of the query, enter the hostname(s) of your Symantec VIP device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the Symantec VIP

Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-symantecvip?tab=Overview) in the Azure Marketplace.
