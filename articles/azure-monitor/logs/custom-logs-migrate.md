---
title: Migrate from the HTTP Data Collector API to the Log Ingestion API
description: Migrate from the legacy Azure Monitor Data Collector API to the Log Ingestion API, which provides more processing power and greater flexibility.
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

## Advantages of the Log Ingestion API

The Log Ingestion API provides the following advantages over the Data Collector API:

- Supports [transformations](../essentials/data-collection-transformations.md), which enable you to modify the data before it's ingested into the destination table, including filtering and data manipulation.
- Lets you send data to multiple destinations.  
- Enables you to manage the destination table schema, including column names, and whether to add new columns to the destination table when the source data schema changes.
## Prerequisites

The migration procedure described in this article assumes you have:

- A Log Analytics workspace where you have at least [contributor rights](manage-access.md#azure-rbac).
- [Permissions to create data collection rules](../essentials/data-collection-rule-create-edit.md#permissions) in the Log Analytics workspace.
- [A Microsoft Entra application to authenticate API calls](../logs/tutorial-logs-ingestion-portal.md#create-azure-ad-application) or any other Resource Manager authentication scheme.

## Create new resources required for the Log ingestion API

The Log Ingestion API requires you to create two new types of resources, which the HTTP Data Collector API doesn't require: 

- [Data collection endpoints](../essentials/data-collection-endpoint-overview.md), from which the data you collect is ingested into the pipeline for processing.
- [Data collection rules](../essentials/data-collection-rule-overview.md), which define [data transformations](../essentials/data-collection-transformations.md) and the destination table to which the data is ingested.

## Migrate existing custom tables or create new tables

If you have an existing custom table to which you currently send data using the Data Collector API, you can: 

- Migrate the table to continue ingesting data into the same table using the Log Ingestion API. 
- Maintain the existing table and data and set up a new table into which you ingest data using the Log Ingestion API. You can then delete the old table when you're ready. 

    This is the preferred option, especially if you to need to make changes to the existing table. Changes to existing data types and multiple schema changes to existing Data Collector API custom tables can lead to errors.

This table summarizes considerations to keep in mind for each option:

||Table migration|Side-by-side implementation|
|-|-|-|
|**Table and column naming**|Reuse existing table name.<br>Column naming options: <br>- Use new column names and define a transformation to direct incoming data to the newly named column.<br>- Continue using old names.|Set the new table name freely.<br>Need to adjust integrations, dashboards, and alerts before switching to the new table.|
|**Migration procedure**|One-off table migration. Not possible to roll back a migrated table. |Migration can be done gradually, per table.|
|**Post-migration**|You can continue to ingest data using the HTTP Data Collector API with existing columns, except custom columns.<br>Ingest data into new columns using the Log Ingestion API only.| Data in the old table is available until the end of retention period.<br>When you first set up a new table or make schema changes, it can take 10-15 minutes for the data changes to start appearing in the destination table.|
  
To convert a table that uses the Data Collector API to data collection rules and the Log Ingestion API, issue this API call against the table:  

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}/migrate?api-version=2021-12-01-preview
```
This call is idempotent, so it has no effect if the table has already been converted.    

The API call enables all DCR-based custom logs features on the table. The Data Collector API will continue to ingest data into existing columns, but won't create any new columns. Any previously defined [custom fields](../logs/custom-fields.md) won't continue to be populated. Another way to migrate an existing table to using data collection rules, but not necessarily the Log Ingestion API is applying a [workspace transformation](../logs/tutorial-workspace-transformations-portal.md) to the table.

> [!IMPORTANT]
> - Column names must start with a letter and can consist of up to 45 alphanumeric characters and underscores (`_`). 
> -  `_ResourceId`, `id`, `_ResourceId`, `_SubscriptionId`, `TenantId`, `Type`, `UniqueId`, and `Title` are reserved column names.
> - Custom columns you add to an Azure table must have the suffix `_CF`.
> - If you update the table schema in your Log Analytics workspace, you must also update the input stream definition in the data collection rule to ingest data into new or modified columns.

## Call the Log Ingestion API

The Log Ingestion API lets you send up to 1 MB of compressed or uncompressed data per call. If you need to send more than 1 MB of data, you can send multiple calls in parallel. This is a change from the Data Collector API, which lets you send up to 32 MB of data per call.

For information about how to call the Log Ingestion API, see [Log Ingestion REST API call](../logs/logs-ingestion-api-overview.md#rest-api-call).

## Modify table schemas and data collection rules based on changes to source data object

While the Data Collector API automatically adjusts the destination table schema when the source data object schema changes, the Log Ingestion API doesn't. This ensures that you don't collect new data into columns that you didn't intend to create.  

When the source data schema changes, you can:

- [Modify destination table schemas](../logs/create-custom-table.md) and [data collection rules](../essentials/data-collection-rule-edit.md) to align with source data schema changes.
- [Define a transformation](../essentials/data-collection-transformations.md) in the data collection rule to send the new data into existing columns in the destination table. 
- Leave the destination table and data collection rule unchanged. In this case, you won't ingest the new data.

> [!NOTE]
> You can't reuse a column name with a data type that's different to the original data type defined for the column. 

## Next steps

- [Walk through a tutorial sending custom logs using the Azure portal.](tutorial-logs-ingestion-portal.md)
- [Walk through a tutorial sending custom logs using Resource Manager templates and REST API.](tutorial-logs-ingestion-api.md)
