---
title: "Blackberry CylancePROTECT connector for Microsoft Sentinel"
description: "Learn how to install the connector Blackberry CylancePROTECT to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Blackberry CylancePROTECT connector for Microsoft Sentinel

The [Blackberry CylancePROTECT](https://www.blackberry.com/us/en/products/blackberry-protect) connector allows you to easily connect your CylancePROTECT logs with Microsoft Sentinel. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (CylancePROTECT)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Event Types**
   ```kusto
CylancePROTECT​
            
   | summarize count() by EventName
            
   | top 10 by count_
   ```

**Top 10 Triggered Policies**
   ```kusto
CylancePROTECT​
            
   | where EventType == "Threat" 
            
   | summarize count() by PolicyName 
            
   | top 10 by count_
   ```



## Prerequisites

To integrate with Blackberry CylancePROTECT make sure you have: 

- **CylancePROTECT**: must be configured to export logs via Syslog.


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias CyclanePROTECT and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Blackberry%20CylancePROTECT/Parsers/CylancePROTECT.txt), on the second line of the query, enter the hostname(s) of your CyclanePROTECT device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.

1.  Select the link below to open your workspace **agents configuration**, and select the **Syslog** tab.
2.  Select **Add facility** and choose from the drop-down list of facilities. Repeat for all the facilities you want to add.
3.  Mark the check boxes for the desired severities for each facility.
4.  Click **Apply**.


3. Configure and connect the CylancePROTECT

[Follow these instructions](https://docs.blackberry.com/content/dam/docs-blackberry-com/release-pdfs/en/cylance-products/syslog-guides/Cylance%20Syslog%20Guide%20v2.0%20rev12.pdf) to configure the CylancePROTECT to forward syslog. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-blackberrycylanceprotect?tab=Overview) in the Azure Marketplace.
