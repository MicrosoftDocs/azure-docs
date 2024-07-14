---
title: Tutorial: Set up a custom table with the Auxiliary plan for low-cost data ingestion and retention in your Log Analytics workspace
description: Create a custom table with the Auxiliary table plan in your Log Analytics workspace. 
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.service: azure-monitor
ms.topic: how-to 
ms.date: 07/14/2024
# Customer intent: As a Log Analytics workspace administrator, I want to create a custom table with the Auxiliary table plan, so that I can ingest and retain data at a low cost for auditing and compliance.
---

# Set up a custom table with the Auxiliary plan in your Log Analytics workspace

The [Auxiliary table plan](../logs/data-platform-logs.md#table-plans) lets you ingest and retain data in your Log Analyics workspace at a low cost. Azure Monitor Logs currently supports the Auxiliary table plan on [data collection rule (DCR)-based custom tables](../logs/manage-logs-tables.md#table-type-and-schema) to which you send data you collect using [Azure Monitor Agent](../agents/agents-overview.md) or the [Logs ingestion API](../logs/logs-ingestion-api-overview.md).

This article explains how to create a custom table with the Auxiliary plan in your Log Analytics workspace and set up a data collection rule that sends data to this table.

## Prerequisites

To create a custom table and collect, you need:

- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- A [data collection endpoint](../essentials/data-collection-endpoint-overview.md).
   
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

## Send data to a custom table with the Auxiliary plan

There are currently two ways to ingest data to a custom table with the Auxiliary plan:

- [Collect logs from a text or JSON file with Azure Monitor Agent](../agents/data-sources-custom-logs.md).

    If you this method, your custom table must only have two columns - `TimeGenerated` and `RawData` (of type `string`). The data collection rule sends the entirety of each log entry you collect to the `RawData` column, and Azure Monitor Logs automatically populates the `TimeGenerated` column with the time the log is ingested.

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
        - `myworkspace` is the name of your 
        `table_name_CL` with the name of your table and the column names and types based on the columns in your table:
    
    1. [Grant your application permission to use your DCR](../logs/tutorial-logs-ingestion-api.md#assign-permissions-to-a-dcr).

## Public preview limitations

During public preview, these limitation apply:

- The Auxiliary plan is supported in the UK South, Israel Center, East US, Australia East and Canada Central regions.
- You can set the Auxiliary plan only on custom tables you create using the [Tables - Create Or Update API](/rest/api/loganalytics/tables/create-or-update).
- Tables with the Auxiliary plan: 
    - Do not support columns with dynamic data.
    - Have a fixed total retention of 365 days.
    - Are currently unbilled.
- A data collection rule that sends data to a table with an Auxiliary plan:
    - Can only send data to a single table.
    - Cannot include a [transformation](../essentials/data-collection-transformations.md). 


## Next steps

Learn more about:

- [Azure Monitor Logs table plans](../logs/data-platform-logs.md#table-plans)
- [Collecting logs with the Log Ingestion API](../logs/logs-ingestion-api-overview.md)
- [Data collection rules](../essentials/data-collection-endpoint-overview.md)
