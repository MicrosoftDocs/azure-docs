---
title: "Azure SQL Database connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure SQL Database (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/14/2022
ms.service: microsoft-sentinel
ms.author: cwatson
ms.custom: miss-api-catalog
---

# Azure SQL Database connector for Microsoft Sentinel (preview)

The Azure SQL Database Solution for Microsoft Sentinel enables you to stream Azure SQL database audit and diagnostic logs into Microsoft Sentinel, allowing you to continuously monitor activity in all your instances.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections, managed by Azure Policy](../connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)** <br><br>Also available in the Azure SQL and Microsoft Sentinel for SQL PaaS solutions|
| **Log Analytics table(s)** | SQLSecurityAuditEvents<br>SQLInsights<br>AutomaticTuning<br>QueryStoreWaitStatistics<br>Errors<br>DatabaseWaitStatistics<br>Timeouts<br>Blocks<br>Deadlocks<br>Basic<br>InstanceAndAppAdvanced<br>WorkloadManagement<br>DevOpsOperationsAudit |
| **DCR support** | Not currently supported |
| **Supported by** | Microsoft |

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/sentinel4sql.sentinel4sql?tab=Overview) in the Azure Marketplace.