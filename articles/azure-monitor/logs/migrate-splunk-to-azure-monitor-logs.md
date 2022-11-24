---
title: Migrate from Splunk to Azure Monitor Logs - Getting started
description: Learn how to plan the phases of your migration from Splunk to Azure Monitor Logs and get started importing, collection, and analyzing log data. 
author: guywi-ms
ms.author: guywild
ms.reviewer: MeirMen
ms.topic: how-to 
ms.date: 11/22/2022

---

# Migrate from Splunk to Azure Monitor Logs

This article explains how to plan your migration from Splunk to Azure Monitor Logs for logging and log data analysis, including:  

> [!div class="checklist"]
> * Introduction to basic concepts 
> * Design and deploy a workspace
> * Collect data
> * Migrate applications
> * Ingest historical data
> * Analyze log data

## Introduction to basic concepts

|Azure |Splunk|
|---|---|
|[Workspace](../logs/log-analytics-workspace-overview.md)||
|[Table](../logs/manage-logs-tables.md)|Indexing|
|[Kusto Query Language](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/splunk-cheat-sheet)||
|[Transformation](../essentials/data-collection-transformations.md)
|[Cost calculations and options](../logs/cost-logs.md)||

Cost considerations
## Deploy and configure a workspace

[Design a Log Analytics workspace architecture](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/workspace-design)

[Manage access to Log Analytics workspaces](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access)

[Set a table's log data plan](../logs/basic-logs-configure.md)

## Collect data

[Data sources](https://learn.microsoft.com/en-us/azure/azure-monitor/data-sources)

[Data collection rules]()

[Azure Monitor Agent]()

[Logs Ingestion API]()

## Migrate applications

<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Ingest historical data

<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Analyze log data

[Log Analytics demo environment](https://portal.azure.com/#view/Microsoft_OperationsManagementSuite_Workspace/LogsDemo.ReactView)
[Analyze logs in Azure Monitor with KQL](/training/modules/analyze-logs-with-kql/)

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

