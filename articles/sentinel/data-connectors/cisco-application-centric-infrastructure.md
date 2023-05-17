---
title: "Cisco Application Centric Infrastructure connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Application Centric Infrastructure to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Application Centric Infrastructure connector for Microsoft Sentinel

[Cisco Application Centric Infrastructure (ACI)](https://www.cisco.com/c/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-741487.html) data connector provides the capability to ingest [Cisco ACI logs](https://www.cisco.com/c/en/us/td/docs/switches/datacenter/aci/apic/sw/all/syslog/guide/b_ACI_System_Messages_Guide/m-aci-system-messages-reference.html) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (CiscoACIEvent)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Resources (DstResourceId)**
   ```kusto
CiscoACIEvent
 
   | where notempty(DstResourceId)
 
   | summarize count() by DstResourceId
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**CiscoACIEvent**](https://aka.ms/sentinel-CiscoACI-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >   This data connector has been developed using Cisco ACI Release 1.x

1. Configure Cisco ACI system sending logs via Syslog to remote server where you will install the agent.

[Follow these steps](https://www.cisco.com/c/en/us/td/docs/switches/datacenter/aci/apic/sw/1-x/basic-config/b_ACI_Config_Guide/b_ACI_Config_Guide_chapter_010.html#d2933e4611a1635) to configure Syslog Destination, Destination Group, and Syslog Source.

2. Install and onboard the agent for Linux or Windows

Install the agent on the Server to which the logs will be forwarded.

> Logs on Linux or Windows servers are collected by **Linux** or **Windows** agents.




3. Check logs in Microsoft Sentinel

Open Log Analytics to check if the logs are received using the Syslog schema.

>**NOTE:** It may take up to 15 minutes before new logs will appear in Syslog table.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscoaci?tab=Overview) in the Azure Marketplace.
