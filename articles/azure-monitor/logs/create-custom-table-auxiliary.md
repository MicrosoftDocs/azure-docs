---
title: Tutorial: Create a custom table with the Auxiliary table plan in your Log Analytics workspace
description: Create a custom table with the Auxiliary table plan in your Log Analytics workspace. 
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.service: azure-monitor
ms.topic: how-to 
ms.date: 07/10/2024
# Customer intent: As a Log Analytics workspace administrator, I want to create a custom table with the Auxiliary table plan, so that I can ingest and retain data at a low cost for auditing and compliance.
---

# Create a custom table with the Auxiliary table plan in your Log Analytics workspace

[Data collection rules](../essentials/data-collection-rule-overview.md) let you [filter and transform log data](../essentials/data-collection-transformations.md) before sending the data to an [Azure table or a custom table](../logs/manage-logs-tables.md#table-type-and-schema). This article explains how to create custom tables and add custom columns to tables in your Log Analytics workspace.  

> [!IMPORTANT]
> Whenever you update a table schema, be sure to [update any data collection rules](../essentials/data-collection-rule-overview.md) that send data to the table. The table schema you define in your data collection rule determines how Azure Monitor streams data to the destination table. Azure Monitor does not update data collection rules automatically when you make table schema changes.  

## Prerequisites

To create a custom table, you need:

- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
   
  ***  All tables in a Log Analytics workspace must have a column named `TimeGenerated`. If your sample data has a column named `TimeGenerated`, then this value will be used to identify the ingestion time of the record. If not, a `TimeGenerated` column will be added to the transformation in your DCR for the table. For information about the `TimeGenerated` format, see [supported datetime formats](/azure/data-explorer/kusto/query/scalar-data-types/datetime#supported-formats).

## Create a custom table

To create a custom table, call the [Tables - Create Or Update API](/rest/api/loganalytics/tables/create-or-update) by using this command:

```http
https://management.azure.com/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.OperationalInsights/workspaces/{workspace_name}/tables/{table name_CL}?api-version=2023-01-01-preview
```

Provide this payload - update the table name and adjust the columns based on your table schema: 

```json
 {
    "properties": {
        "schema": {
            "name": "table_name_CL",
            "columns": [
                {
                    "name": "TimeGenerated",
                    "type": "datetime"
                },
                {
                    "name": "StringProperty",
                    "type": "string"
                },
                {
                    "name": "IntProperty",
                    "type": "int"
                },
                 {
                    "name": "LongProperty",
                    "type": "long"
                },
                 {
                    "name": "RealProperty",
                    "type": "real"
                },
                 {
                    "name": "BooleanProperty",
                    "type": "boolean"
                },
                 {
                    "name": "GuidProperty",
                    "type": "guid"
                },
                 {
                    "name": "DateTimeProperty",
                    "type": "datetime"
                }
            ]
        },
        "totalRetentionInDays": 365,
        "plan": "Bronze"
    }
}
```


## Next steps

Learn more about:

- [Collecting logs with the Log Ingestion API](../logs/logs-ingestion-api-overview.md)
- [Collecting logs with Azure Monitor Agent](../agents/agents-overview.md)
- [Data collection rules](../essentials/data-collection-endpoint-overview.md)
