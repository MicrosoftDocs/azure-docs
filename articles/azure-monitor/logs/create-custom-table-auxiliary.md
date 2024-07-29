---
title: Set up a table with the Auxiliary plan for low-cost data ingestion and retention in your Log Analytics workspace
description: Create a custom table with the Auxiliary table plan in your Log Analytics workspace for low-cost ingestion and retention of log data. 
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.service: azure-monitor
ms.custom: references_regions
ms.topic: how-to 
ms.date: 07/21/2024
# Customer intent: As a Log Analytics workspace administrator, I want to create a custom table with the Auxiliary table plan, so that I can ingest and retain data at a low cost for auditing and compliance.
---

# Set up a table with the Auxiliary plan in your Log Analytics workspace (Preview) 

The [Auxiliary table plan](../logs/data-platform-logs.md#table-plans) lets you ingest and retain data in your Log Analytics workspace at a low cost. Azure Monitor Logs currently supports the Auxiliary table plan on [data collection rule (DCR)-based custom tables](../logs/manage-logs-tables.md#table-type-and-schema) to which you send data you collect using [Azure Monitor Agent](../agents/agents-overview.md) or the [Logs ingestion API](../logs/logs-ingestion-api-overview.md).

This article explains how to create a custom table with the Auxiliary plan in your Log Analytics workspace and set up a data collection rule that sends data to this table.

> [!IMPORTANT]
> See [public preview limitations](#public-preview-limitations) for supported regions and limitations related to Auxiliary tables and data collection rules.  

## Prerequisites

To create a custom table and collect log data, you need:

- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- A [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md).
- All tables in a Log Analytics workspace have a column named `TimeGenerated`. If your raw log data has a `TimeGenerated` property, Azure Monitor uses this value to identify the creation time of the record. For a table with the Auxiliary plan, the `TimeGenerated` column currently supports ISO8601 format only. For information about the `TimeGenerated` format, see [supported ISO 8601 datetime format](/azure/data-explorer/kusto/query/scalar-data-types/datetime#iso-8601).
    

## Create a custom table with the Auxiliary plan

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
        "plan": "Auxiliary"
    }
}
```

## Send data to a table with the Auxiliary plan

There are currently two ways to ingest data to a custom table with the Auxiliary plan:


- [Collect logs from a text or JSON file with Azure Monitor Agent](../agents/data-sources-custom-logs.md).

    If you use this method, your custom table must only have two columns - `TimeGenerated` and `RawData` (of type `string`). The data collection rule sends the entirety of each log entry you collect to the `RawData` column, and Azure Monitor Logs automatically populates the `TimeGenerated` column with the time the log is ingested.

- Send data to Azure Monitor using Logs ingestion API. 

    To use this method:

    1. [Create a custom table with the Auxiliary plan](#create-a-custom-table-with-the-auxiliary-plan) as described in this article.
    1. Follow the steps described in [Tutorial: Send data to Azure Monitor using Logs ingestion API](../logs/tutorial-logs-ingestion-api.md) to: 
        1. [Create a Microsoft Entra application](../logs/tutorial-logs-ingestion-api.md#create-microsoft-entra-application). 
        1. [Create a data collection rule](../logs/tutorial-logs-ingestion-api.md#create-data-collection-rule) using this ARM template.

        ```json
        {
            "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
                "dataCollectionRuleName": {
                    "type": "string",
                    "metadata": {
                        "description": "Specifies the name of the data collection rule to create."
                    }
                },
                "location": {
                    "type": "string",
                    "metadata": {
                        "description": "Specifies the region in which to create the data collection rule. The must be the same region as the destination Log Analytics workspace."
                    }
                },
                "workspaceResourceId": {
                    "type": "string",
                    "metadata": {
                        "description": "The Azure resource ID of the Log Analytics workspace in which you created a custom table with the Auxiliary plan."
                    }
                }
            },
            "resources": [
                {
                    "type": "Microsoft.Insights/dataCollectionRules",
                    "name": "[parameters('dataCollectionRuleName')]",
                    "location": "[parameters('location')]",
                    "apiVersion": "2023-03-11",
                    "kind": "Direct",
                    "properties": {
                        "streamDeclarations": {
                            "Custom-table_name_CL": {
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
                                        }
                                    },
                        "destinations": {
                            "logAnalytics": [
                                {
                                    "workspaceResourceId": "[parameters('workspaceResourceId')]",
                                    "name": "myworkspace"
                                }
                            ]
                        },
                        "dataFlows": [
                            {
                                "streams": [
                                    "Custom-table_name_CL"
                                ],
                                "destinations": [
                                    "myworkspace"
                                ]
                            }
                        ]
                    }
                }
            ],
            "outputs": {
                "dataCollectionRuleId": {
                    "type": "string",
                    "value": "[resourceId('Microsoft.Insights/dataCollectionRules', parameters('dataCollectionRuleName'))]"
                }
            }
        }
        ```

        Where:
        - `myworkspace` is the name of your Log Analytics workspace.
        - `table_name_CL` is the name of your table.
        -  `columns` includes the same columns you set in [Create a custom table with the Auxiliary plan](#create-a-custom-table-with-the-auxiliary-plan).
    
    1. [Grant your application permission to use your DCR](../logs/tutorial-logs-ingestion-api.md#assign-permissions-to-a-dcr).

## Public preview limitations

During public preview, these limitations apply:

- The Auxiliary plan is gradually being rolled out to all regions and is currently supported in:

    | **Region**      | **Locations**          |
    |-----------------|------------------------|
    | **Americas**        | Canada Central         |
    |                 | Central US             |
    |                 | East US                |
    |                 | East US 2              |
    |                 | West US                |
    |                 | South Central US       |
    |                 | North Central US       |
    | **Asia Pacific**    | Australia East         |
    |                 | Australia South East   |
    | **Europe**          | East Asia              |
    |                 | North Europe           |
    |                 | UK South               |
    |                 | Germany West Central   |
    |                 | Switzerland North      |
    |                 | France Central         |
    | **Middle East**     | Israel Central         |


- You can set the Auxiliary plan only on data collection rule-based custom tables you create using the [Tables - Create Or Update API](/rest/api/loganalytics/tables/create-or-update).
- Tables with the Auxiliary plan: 
    - Are currently unbilled. There's currently no charge for ingestion, queries, search jobs, and long-term retention.
    - Do not support columns with dynamic data.
    - Have a fixed total retention of 365 days.
    - Support ISO 8601 datetime format only.
- A data collection rule that sends data to a table with an Auxiliary plan:
    - Can only send data to a single table.
    - Can't include a [transformation](../essentials/data-collection-transformations.md). 
- Ingestion data for Auxiliary tables isn't currently available in the Azure Monitor Logs [Usage table](/azure/azure-monitor/reference/tables/usage). To estimate data ingestion volume, you can count the number of records in your Auxiliary table using this query:

    ```kusto
    MyTable_CL
    | summarize count()
    ```

## Next steps

Learn more about:

- [Azure Monitor Logs table plans](../logs/data-platform-logs.md#table-plans)
- [Collecting logs with the Log Ingestion API](../logs/logs-ingestion-api-overview.md)
- [Data collection rules](../essentials/data-collection-endpoint-overview.md)
