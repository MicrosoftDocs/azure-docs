---
title: "ISC Bind connector for Microsoft Sentinel"
description: "Learn how to install the connector ISC Bind to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# ISC Bind connector for Microsoft Sentinel

The [ISC Bind](https://www.isc.org/bind/) connector allows you to easily connect your ISC Bind logs with Microsoft Sentinel. This gives you more insight into your organization's network traffic data, DNS query data, traffic statistics and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (ISCBind)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Top 10 Domains Queried**
   ```kusto
ISCBind 

   | where EventSubType == "request" 

   | summarize count() by DnsQuery 

   | top 10 by count_
   ```

**Top 10 clients by Source IP Address**
   ```kusto
ISCBind 

   | where EventSubType == "request" 

   | summarize count() by SrcIpAddr 

   | top 10 by count_
   ```



## Prerequisites

To integrate with ISC Bind make sure you have: 

- **ISC Bind**: must be configured to export logs via Syslog


## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias ISCBind and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/ISC%20Bind/Parsers/ISCBind.txt).The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the ISC Bind

1. Follow these instructions to configure the ISC Bind to forward syslog: 
 - [DNS Logs](https://kb.isc.org/docs/aa-01526) 
2. Configure Syslog to send the Syslog traffic to Agent. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-iscbind?tab=Overview) in the Azure Marketplace.
