---
title: "Ivanti Unified Endpoint Management connector for Microsoft Sentinel"
description: "Learn how to install the connector Ivanti Unified Endpoint Management to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Ivanti Unified Endpoint Management connector for Microsoft Sentinel

The [Ivanti Unified Endpoint Management](https://www.ivanti.com/products/unified-endpoint-manager) data connector provides the capability to ingest [Ivanti UEM Alerts](https://help.ivanti.com/ld/help/en_US/LDMS/11.0/Windows/alert-c-monitoring-overview.htm) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (IvantiUEMEvent)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Sources**
   ```kusto
IvantiUEMEvent
 
   | summarize count() by tostring(SrcHostname)
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**IvantiUEMEvent**](https://aka.ms/sentinel-ivantiuem-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using Ivanti Unified Endpoint Management Release 2021.1 Version 11.0.3.374

1. Install and onboard the agent for Linux or Windows

Install the agent on the Server where the Ivanti Unified Endpoint Management Alerts are forwarded.

> Logs from Ivanti Unified Endpoint Management Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure Ivanti Unified Endpoint Management alert forwarding.

[Follow the instructions](https://help.ivanti.com/ld/help/en_US/LDMS/11.0/Windows/alert-t-define-action.htm) to set up Alert Actions to send logs to syslog server.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ivantiuem?tab=Overview) in the Azure Marketplace.
