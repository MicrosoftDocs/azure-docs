---
title: "Symantec Endpoint Protection connector for Microsoft Sentinel"
description: "Learn how to install the connector Symantec Endpoint Protection to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Symantec Endpoint Protection connector for Microsoft Sentinel

The [Broadcom Symantec Endpoint Protection (SEP)](https://www.broadcom.com/products/cyber-security/endpoint/end-user/enterprise) connector allows you to easily connect your SEP logs with Microsoft Sentinel. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | SEP |
| **Kusto function url** | https://aka.ms/sentinel-SymantecEndpointProtection-parser |
| **Log Analytics table(s)** | Syslog (SymantecEndpointProtection)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Log Types **
   ```kusto
SymantecEndpointProtection 
 
   | summarize count() by LogType 

   | top 10 by count_
   ```

**Top 10 Users**
   ```kusto
SymantecEndpointProtection 
 
   | summarize count() by UserName 

   | top 10 by count_
   ```



## Prerequisites

To integrate with Symantec Endpoint Protection make sure you have: 

- **Symantec Endpoint Protection (SEP)**: must be configured to export logs via Syslog


## Vendor installation instructions


>This data connector depends on a parser based on a Kusto Function to work as expected. [Follow the steps](https://aka.ms/sentinel-SymantecEndpointProtection-parser) to use the Kusto function alias, **SymantecEndpointProtection**

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the Symantec Endpoint Protection

[Follow these instructions](https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-protection/all/Monitoring-Reporting-and-Enforcing-Compliance/viewing-logs-v7522439-d37e464/exporting-data-to-a-syslog-server-v8442743-d15e1107.html) to configure the Symantec Endpoint Protection to forward syslog. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-symantecendpointprotection?tab=Overview) in the Azure Marketplace.
