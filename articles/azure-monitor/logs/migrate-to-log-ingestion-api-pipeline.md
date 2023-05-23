---
title: Migrate from the HTTP Data Collector API to the Log Ingestion API
description: Learn how to migrate from the legacy Azure Monitor Logs pipeline, which uses the Data Collector API, to the new pipeline, which uses the Log Ingestion API and provides more processing power and greater flexibility.
author: guywi-ms
ms.author: guywild
ms.reviewer: ivankh
ms.topic: how-to 
ms.date: 05/23/2023

---

# Migrate from the HTTP Data Collector API to the Log Ingestion API to send data to Azure Monitor Logs

The Azure Monitor [Log Ingestion API](../logs/logs-ingestion-api-overview.md) provides more processing power and greater flexibility in ingesting logs than the legacy [HTTP Data Collector API](../logs/data-collector-api.md). This article describes the differences between the Data Collector API and the Log Ingestion API and provides guidance and best practices for migrating to the new Log Ingestion API.  

> [!NOTE]
> As a Microsoft MVP, [Morten Waltorp Knudsen](https://mortenknudsen.net/) contributed to and provided material feedback for this article. For an example of how you can automate the setup of the Log Ingestion API, see Morten's [AzLogDcrIngestPS PowerShell module](https://github.com/KnudsenMorten/AzLogDcrIngestPS).

## Advantages of the Log Ingestion API

The Log Ingestion API provides the following advantages over the Data Collector API:

- Supports [transformations](../essentials/data-collection-transformations.md), which enable you to modify the data before it's ingested into the destination table, including filtering and data manipulation.
- Lets you send data to multiple destinations.  
- Enables you to manage the the destination table schema, including column names, and whether to add new columns to the destination table when the source data schema changes.

> [!NOTE]
> The Data Collector API automatically adjusts the destination table schema when the source data schema changes. The Log Ingestion API doesn't automatically adjust the destination table schema. This ensures that you don't collect new data into columns that you didn't intend to create. On the other hand, you can manually adjust destination table schemas and data collection rules to align with source data schema changes. 

## Before you use the Log Ingestion API

### Create required new resources

The Log Ingestion API requires you to create two new types of resources, which the HTTP Data Collector API doesn't require: 

- [Data collection endpoints](../essentials/data-collection-endpoint-overview.md), from which the the data you collect is ingested into the pipeline for processing.
- [Data collection rules](../essentials/data-collection-rule-overview.md) which define [data transformations](../essentials/data-collection-transformations.md) and the destination table to which the data is ingested.

### Prepare destination tables

The Log Ingestion API expects that the destination tables to which you send data already exist. You can use the Log Ingestion API to send data to any custom tables and a few Azure tables, as described in [Supported tables](../logs/logs-ingestion-api-overview.md#supported-tables).

If you have an exist custom table to which you currently send data using the Data Collector API, you have two options:

- Continue ingesting data into the same table using the Log Ingestion API. 
    
    To convert a table that uses the Data Collector API to data collection rules and the Log Ingestion API, issue this API call against the table:  

    ```rest
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}/migrate?api-version=2021-12-01-preview
    ```
    
    This call is idempotent, so it has no effect if the table has already been converted.    

- Set up a new destination custom table to ingest data into.

    This lets you maintain the existing table and data while you migrate to the new table. You can then delete the old table when you're ready.

> [!NOTE]
> When you use the Log Ingestion API, column names must start with a letter and can consist of up to 45 alphanumeric characters and the characters `_` and `-`. The following are reserved column names: `Type`, `TenantId`, `resource`, `resourceid`, `resourcename`, `resourcetype`, `subscriptionid`, `tenanted`. Custom columns you add to an Azure table must have the suffix `_CF`.

    
## Call the Log Ingestion API

## Automate the migration


-  pipeline, and schema, which increases complexity and introduces new challenges. These challenges include the creation of DCR + tables before sending data, dependency on the existence of a data collection endpoint, timing/delays when doing automation, defining schema for data in both DCR and custom table (v2), naming conventions & limitations/prohibited names, dealing with new properties – supporting both merge and overwrite, uploading changes (32 mb -> 1 mb) per JSON (batches, calculations), and data manipulations of source data (filtering, remove) .

To ease the transition to the new Log Ingestion API, Knudsen Morten has created a PowerShell module called AzLogDcrIngestPS. This module can help you send any data to Azure LogAnalytics custom logs (v2) using the new features of Azure Log Ingestion Pipeline, Azure Data Collection Rules & Log Ingestion API . The 25 functions included in this module will help you with data manipulation before sending data in table/dcr/schema/transformation management and data upload using Azure Log Ingestion Pipeline/Log Ingestion API support/security .

Some cool features of AzLogDcrIngestPS include the ability to create/update DCRs and tables automatically based on the source object schema, validate schema for naming convention issues and mitigate them if found, update schema of DCRs and tables if the structure of the source object changes, auto-fix if something goes wrong with a DCR or table, remove data from source object if there are columns of data you don’t want to send, convert source objects based on CIM or PS objects into PSCustomObjects/array, and add relevant information to each record like UserLoggedOn, Computer, CollectionTime .

By leveraging tools such as AzLogDcrIngestPS and following best practices for migrating from the HTTP Data Collector API to the Log Ingestion API, you can ensure a smooth transition and continue to effectively monitor your infrastructure and applications.