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

The Azure Monitor [Log Ingestion API](../logs/logs-ingestion-api-overview.md) provides more processing power and greater flexibility in ingesting logs and [managing tables](../logs/manage-logs-tables.md) than the legacy [HTTP Data Collector API](../logs/data-collector-api.md). This article describes the differences between the Data Collector API and the Log Ingestion API and provides guidance and best practices for migrating to the new Log Ingestion API.  

> [!NOTE]
> As a Microsoft MVP, [Morten Waltorp Knudsen](https://mortenknudsen.net/) contributed to and provided material feedback for this article. For an example of how you can automate the setup and ongoing use of the Log Ingestion API, see Morten's publicly available [AzLogDcrIngestPS PowerShell module](https://github.com/KnudsenMorten/AzLogDcrIngestPS).

## Prerequisites

The migration procedure described in this article assumes you have:

- A Log Analytics workspace where you have at least [contributor rights](manage-access.md#azure-rbac).
- [Permissions to create data collection rules](../essentials/data-collection-rule-overview.md#permissions) in the Log Analytics workspace.
- [An Azure AD application to authenticate API calls](../logs/tutorial-logs-ingestion-portal.md#create-azure-ad-application) or any other Resource Manager authentication scheme.
## Advantages of the Log Ingestion API

The Log Ingestion API provides the following advantages over the Data Collector API:

- Supports [transformations](../essentials/data-collection-transformations.md), which enable you to modify the data before it's ingested into the destination table, including filtering and data manipulation.
- Lets you send data to multiple destinations.  
- Enables you to manage the destination table schema, including column names, and whether to add new columns to the destination table when the source data schema changes.

## Create required new resources

The Log Ingestion API requires you to create two new types of resources, which the HTTP Data Collector API doesn't require: 

- [Data collection endpoints](../essentials/data-collection-endpoint-overview.md), from which the the data you collect is ingested into the pipeline for processing.
- [Data collection rules](../essentials/data-collection-rule-overview.md), which define [data transformations](../essentials/data-collection-transformations.md) and the destination table to which the data is ingested.

## Prepare destination tables

The Log Ingestion API expects that the destination tables to which you send data already exist. You can use the Log Ingestion API to send data to any custom tables and a few Azure tables, as described in [Supported tables](../logs/logs-ingestion-api-overview.md#supported-tables).

If you have an existing custom table to which you currently send data using the Data Collector API, you have two options:

- Continue ingesting data into the same table using the Log Ingestion API. 
    
    To convert a table that uses the Data Collector API to data collection rules and the Log Ingestion API, issue this API call against the table:  

    ```rest
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}/migrate?api-version=2021-12-01-preview
    ```
    
    This call is idempotent, so it has no effect if the table has already been converted.    

- Maintain the existing table and data and set up a new data into which you ingest data using the Log Ingestion API. You can then delete the old table when you're ready.

> [!IMPORTANT]
> - Column names must start with a letter and can consist of up to 45 alphanumeric characters and the characters `_` and `-`. 
> - The following are reserved column names: `Type`, `TenantId`, `resource`, `resourceid`, `resourcename`, `resourcetype`, `subscriptionid`, `tenanted`. 
> - Custom columns you add to an Azure table must have the suffix `_CF`.
> - If you update the table schema in your Log Analytics workspace, you must also update the table schema you define in the data collection rule to ingest data into new or modified columns.
    
## Call the Log Ingestion API

The Log Ingestion API lets you send up to 1 MB of data per call. If you need to send more than 1 MB of data, you can send multiple calls in parallel. This is a change from the Data Collector API, which lets you send up to 32 MB of data per call.

For information about how to call the Log Ingestion API, see [Send data to Azure Monitor Logs using the Log Ingestion API](../logs/logs-ingestion-api-overview.md#send-data-to-azure-monitor-logs-using-the-log-ingestion-api).

## Modify table schemas and data collection rules based on changes to source data

The Data Collector API automatically adjusts the destination table schema when the source data object schema changes. The Log Ingestion API doesn't automatically adjust the destination table schema. This ensures that you don't collect new data into columns that you didn't intend to create. On the other hand, you can manually [adjust destination table schemas](../logs/create-custom-table.md) and [data collection rules](../essentials/data-collection-rule-edit.md) to align with source data schema changes. 

## Next steps

- [Walk through a tutorial sending custom logs using the Azure portal.](tutorial-logs-ingestion-portal.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API.](tutorial-logs-ingestion-api.md)
