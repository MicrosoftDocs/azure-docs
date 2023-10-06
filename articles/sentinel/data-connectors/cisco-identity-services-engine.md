---
title: "Cisco Identity Services Engine connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Identity Services Engine to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Identity Services Engine connector for Microsoft Sentinel

The Cisco Identity Services Engine (ISE) data connector provides the capability to ingest [Cisco ISE](https://www.cisco.com/c/en/us/products/security/identity-services-engine/index.html) events into Microsoft Sentinel. It helps you gain visibility into what is happening in your network, such as who is connected, which applications are installed and running, and much more. Refer to [Cisco ISE logging mechanism documentation](https://www.cisco.com/c/en/us/td/docs/security/ise/2-7/admin_guide/b_ise_27_admin_guide/b_ISE_admin_27_maintain_monitor.html#reference_BAFBA5FA046A45938810A5DF04C00591) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | CiscoISEEvent |
| **Kusto function url** | https://aka.ms/sentinel-ciscoise-parser |
| **Log Analytics table(s)** | Syslog(CiscoISE)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Reporting Devices**
   ```kusto
CiscoISEEvent
 
   | summarize count() by DvcHostname
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-ciscoise-parser) to create the Kusto Functions alias, **CiscoISEEvent**

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.

1.  Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
2.  Select **Apply below configuration to my machines** and select the facilities and severities.
3.  Click **Save**.


3. Configure Cisco ISE Remote Syslog Collection Locations

[Follow these instructions](https://www.cisco.com/c/en/us/td/docs/security/ise/2-7/admin_guide/b_ise_27_admin_guide/b_ISE_admin_27_maintain_monitor.html#ID58) to configure remote syslog collection locations in your Cisco ISE deployment.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoise?tab=Overview) in the Azure Marketplace.
