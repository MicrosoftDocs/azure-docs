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
> * Introduction to key concepts 
> * Design and deploy a workspace
> * Collect data
> * Migrate applications
> * Ingest historical data
> * Analyze log data

## Introduction to key concepts

|Concept |Description|
|---|---|
|[Log Analytics workspace](../logs/log-analytics-workspace-overview.md)|A unique environment for log data from Azure Monitor and other Azure services, such as Microsoft Sentinel and Microsoft Defender for Cloud. Each Log Analytics workspace has its own data repository and configuration but might combine data from multiple services. |
|[Table management](../logs/manage-logs-tables.md)|Azure Monitor Logs stores log data in tables. Table configuration lets you define the table schema, how long to retain data, and whether you collect the data for auditing and troubleshooting or for ongoing data analysis and regular use by features and services.|
|[Log data plan](../logs/basic-logs-configure.md)| Azure Monitor Logs offers two log data plans that let you reduce log ingestion and retention costs and take advantage of Azure Monitor's advanced features and analytics capabilities based on your needs.<br/> The **Basic** log data plan provides a low-cost way to ingest and retain logs for troubleshooting, debugging, auditing, and compliance. The **Analytics** plan makes log data available for interactive queries and use by features and services. |
|[Data retention and archiving](../logs/data-retention-archive.md)|  |
|[Transformation](../essentials/data-collection-transformations.md)|Transformations let you filter or modify incoming data before it's sent to a Log Analytics workspace. Use transformations to remove sensitive data, enrich data in your Log Analytics workspace with additional or calculated information, and reduce data costs. |
|[Kusto Query Language (KQL)](/azure/kusto/query/)|Azure Monitor Logs uses a large subset of KQL that's suitable for simple log queries but also includes advanced functionality such as aggregations, joins, and smart analytics. Use the [Splunk to Kusto Query Language map](/azure/data-explorer/kusto/query/splunk-cheat-sheet) to build on your existing knowledge from searching in Splunk. You can [learn KQL with tutorials](../logs/get-started-queries.md) and [KQL training modules](/training/modules/analyze-logs-with-kql/)..|
|[Cost optimization](../logs/cost-logs.md)|You can significantly reduce your cost for Azure Monitor by understanding configuration options and ways to filter out data you don't need. |

## 1. Deploy and configure a workspace

[Design a Log Analytics workspace architecture](../logs/workspace-design.md)

[Manage access to Log Analytics workspaces](../logs/manage-access.md)

[Set a table's log data plan](../logs/basic-logs-configure.md)

## 2. Collect data

[Data sources](../data-sources.md)

[Data collection rules]()

[Azure Monitor Agent]()

[Logs Ingestion API]()

## 3. Migrate applications


## 4. Ingest historical data

## 5. Analyze log data

[Log Analytics demo environment](https://portal.azure.com/#view/Microsoft_OperationsManagementSuite_Workspace/LogsDemo.ReactView)
[Analyze logs in Azure Monitor with KQL](/training/modules/analyze-logs-with-kql/)

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

