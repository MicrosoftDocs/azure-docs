---
title: "WatchGuard Firebox connector for Microsoft Sentinel"
description: "Learn how to install the connector WatchGuard Firebox to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# WatchGuard Firebox connector for Microsoft Sentinel

WatchGuard Firebox (https://www.watchguard.com/wgrd-products/firewall-appliances and https://www.watchguard.com/wgrd-products/cloud-and-virtual-firewalls) is security products/firewall-appliances. Watchguard Firebox will send syslog to Watchguard Firebox collector agent.The agent then sends the message to the workspace.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (WatchGuardFirebox)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [WatchGuard](https://www.watchguard.com/wgrd-support/contact-support) |

## Query samples

**Top 10 Fireboxes in last 24 hours**
   ```kusto
WatchGuardFirebox
 
   | where TimeGenerated >= ago(24h)

   | summarize count() by HostName

   | top 10 by count_ desc
   ```

**Firebox Named WatchGuard-XTM top 10 messages in last 24 hours**
   ```kusto
WatchGuardFirebox
 
   | where HostName contains 'WatchGuard-XTM'

   | where TimeGenerated >= ago(24h)

   | summarize count() by MessageId

   | top 10 by count_ desc
   ```

**Firebox Named WatchGuard-XTM top 10 applications in last 24 hours**
   ```kusto
WatchGuardFirebox
 
   | where HostName contains 'WatchGuard-XTM'

   | where TimeGenerated >= ago(24h)

   | summarize count() by Application

   | top 10 by count_ desc
   ```



## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias WatchGuardFirebox and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Watchguard%20Firebox/Parsers/WatchGuardFirebox.txt) on the second line of the query, enter the hostname(s) of your WatchGuard Firebox device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.

1.  Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
2.  Select **Apply below configuration to my machines** and select the facilities and severities.
3.  Click **Save**.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/watchguard-technologies.watchguard_firebox_mss?tab=Overview) in the Azure Marketplace.
