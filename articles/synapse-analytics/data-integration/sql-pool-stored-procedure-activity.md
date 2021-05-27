---
title: Transform data by using the SQL Pool Stored Procedure activity
description: Explains how to use SQL Pool Stored Procedure Activity to invoke a stored procedure in Azure Synapse Analytics.
ms.service: synapse-analytics 
ms.topic: how-to
ms.subservice: pipeline 
author: linda33wj
ms.author: jingwang
ms.reviewer: jrasnick
ms.date: 05/13/2021
---

# Transform data by using SQL Pool Stored Procedure activity in Azure Synapse Analytics

<Token>**APPLIES TO:** ![not supported](../media/applies-to/no.png)Azure Data Factory ![supported](../media/applies-to/yes.png)Azure Synapse Analytics </Token> 

You use data transformation activities in a [pipeline](../../data-factory/concepts-pipelines-activities.md) to transform and process raw data into predictions and insights. This article builds on the [transform data](../../data-factory/transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

In Azure Synapse Analytics, you can use the SQL Pool Stored Procedure Activity to invoke a stored procedure in a dedicated SQL pool.

## Syntax details

The following settings are supported in SQL Pool Stored Procedure activity:

| Property                  | Description                              | Required |
| ------------------------- | ---------------------------------------- | -------- |
| name                      | Name of the activity                     | Yes      |
| description               | Text describing what the activity is used for | No       |
| type                      | For SQL Pool Stored Procedure Activity, the activity type is **SqlPoolStoredProcedure** | Yes      |
| sqlPool         | Reference to a [dedicated SQL pool](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md) in the current Azure Synapse workspace. | Yes      |
| storedProcedureName       | Specify the name of the stored procedure to invoke. | Yes      |
| storedProcedureParameters | Specify the values for stored procedure parameters. Use `"param1": { "value": "param1Value","type":"param1Type" }` to pass parameter values and their type supported by the data source. If you need to pass null for a parameter, use `"param1": { "value": null }` (all lower case). | No       |

Example:

```json
{
    "name": "SQLPoolStoredProcedureActivity",
    "description":"Description",
    "type": "SqlPoolStoredProcedure",
    "sqlPool": {
        "referenceName": "DedicatedSQLPool",
        "type": "SqlPoolReference"
    },
    "typeProperties": {
        "storedProcedureName": "usp_sample",
        "storedProcedureParameters": {
            "identifier": { "value": "1", "type": "Int" },
            "stringData": { "value": "str1" }

        }
    }
}
```

## Next steps
 
- [Pipeline and activity](../../data-factory/concepts-pipelines-activities.md)
- [Dedicated SQL Pool](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md)
