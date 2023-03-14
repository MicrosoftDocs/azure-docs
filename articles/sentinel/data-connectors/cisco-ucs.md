---
title: "Cisco UCS connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco UCS to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco UCS connector for Microsoft Sentinel

The [Cisco Unified Computing System (UCS)](https://www.cisco.com/c/en/us/products/servers-unified-computing/index.html) connector allows you to easily connect your Cisco UCS logs with Azure Sentinel This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | CiscoUCS |
| **Kusto function url** | https://aka.ms/sentinel-ciscoucs-function |
| **Log Analytics table(s)** | Syslog (CiscoUCS)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Target User Names for Audit Events**
   ```kusto
CiscoUCS 
 
   | where Mneumonic == "AUDIT" 
 
   | summarize count() by DstUserName 
 
   | top 10 by DstUserName
   ```

**Top 10 Devices generating Audit Events**
   ```kusto
CiscoUCS 
 
   | where Mneumonic == "AUDIT" 
 
   | summarize count() by Computer 
 
   | top 10 by Computer
   ```



## Prerequisites

To integrate with Cisco UCS make sure you have: 

- **Cisco UCS**: must be configured to export logs via Syslog


## Vendor installation instructions


>This data connector depends on a parser based on a Kusto Function to work as expected. [Follow the steps](https://aka.ms/sentinel-ciscoucs-function) to use the Kusto function alias, **CiscoUCS**

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the Cisco UCS

[Follow these instructions](https://www.cisco.com/c/en/us/support/docs/servers-unified-computing/ucs-manager/110265-setup-syslog-for-ucs.html#configsremotesyslog) to configure the Cisco UCS to forward syslog. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoucs?tab=Overview) in the Azure Marketplace.
