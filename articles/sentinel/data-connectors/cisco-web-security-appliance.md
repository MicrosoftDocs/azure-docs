---
title: "Cisco Web Security Appliance connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Web Security Appliance to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Web Security Appliance connector for Microsoft Sentinel

[Cisco Web Security Appliance (WSA)](https://www.cisco.com/c/en/us/products/security/web-security-appliance/index.html) data connector provides the capability to ingest [Cisco WSA Access Logs](https://www.cisco.com/c/en/us/td/docs/security/wsa/wsa_14-0/User-Guide/b_WSA_UserGuide_14_0/b_WSA_UserGuide_11_7_chapter_010101.html) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (CiscoWSAEvent)<br/> |
| **Data collection rules support** | [Workspace transform DCR](../../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Clients (Source IP)**
   ```kusto
CiscoWSAEvent
 
   | where notempty(SrcIpAddr)
 
   | summarize count() by SrcIpAddr
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**CiscoWSAEvent**](https://aka.ms/sentinel-CiscoWSA-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using AsyncOS 14.0 for Cisco Web Security Appliance

1. Configure Cisco Web Security Appliance to forward logs via Syslog to remote server where you will install the agent.

[Follow these steps](https://www.cisco.com/c/en/us/td/docs/security/esa/esa14-0/user_guide/b_ESA_Admin_Guide_14-0/b_ESA_Admin_Guide_12_1_chapter_0100111.html#con_1134718) to configure Cisco Web Security Appliance to forward logs via Syslog

>**NOTE:** Select **Syslog Push** as a Retrieval Method.

2. Install and onboard the agent for Linux or Windows

Install the agent on the Server to which the logs will be forwarded.

> Logs on Linux or Windows servers are collected by **Linux** or **Windows** agents.




3. Check logs in Microsoft Sentinel

Open Log Analytics to check if the logs are received using the Syslog schema.

>**NOTE:** It may take up to 15 minutes before new logs will appear in Syslog table.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscowsa?tab=Overview) in the Azure Marketplace.