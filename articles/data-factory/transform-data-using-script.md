---
title: Transform data by using the Script activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Explains how to use the Script Activity to transform data in an Azure Data Factory or Synapse Analytics pipeline.
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.custom: synapse
ms.date: 10/19/2022
---

# Transform data by using the Script activity in Azure Data Factory or Synapse Analytics 

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You use data transformation activities in a Data Factory or Synapse [pipeline](concepts-pipelines-activities.md) to transform and process raw data into predictions and insights. The Script activity is one of the transformation activities that pipelines support. This article builds on the [transform data article](transform-data.md), which presents a general overview of data transformation and the supported transformation activities. 

Using the script activity, you can execute common operations with Data Manipulation Language (DML), and Data Definition Language (DDL). DML statements like INSERT, UPDATE, DELETE and SELECT let users insert, modify, delete and retrieve data in the database. DDL statements like CREATE, ALTER and DROP allow a database manager to create, modify, and remove database objects such as tables, indexes, and users.

You can use the Script activity to invoke a SQL script in one of the following data stores in your enterprise or on an Azure virtual machine (VM): 

- Azure SQL Database 
- Azure Synapse Analytics 
- SQL Server Database. If you are using SQL Server, install Self-hosted integration runtime on the same machine that hosts the database or on a separate machine that has access to the database. Self-Hosted integration runtime is a component that connects data sources on-premises/on Azure VM with cloud services in a secure and managed way. See the [Self-hosted integration runtime](create-self-hosted-integration-runtime.md) article for details. 
- Oracle
- Snowflake

The script may contain either a single SQL statement or multiple SQL statements that run sequentially. You can use the Script task for the following purposes:

- Truncate a table in preparation for inserting data. 
- Create, alter, and drop database objects such as tables and views. 
- Re-create fact and dimension tables before loading data into them. 
- Run stored procedures. If the SQL statement invokes a stored procedure that returns results from a temporary table, use the WITH RESULT SETS option to define metadata for the result set. 
- Save the rowset returned from a query as activity output for downstream consumption. 

## Syntax details

Here is the JSON format for defining a Script activity: 

```json
{ 
   "name": "<activity name>", 
   "type": "Script", 
   "linkedServiceName": { 
      "referenceName": "<name>", 
      "type": "LinkedServiceReference" 
    }, 
   "typeProperties": { 
      "scripts" : [ 
         { 
            "text": "<Script Block>", 
            "type": "<Query> or <NonQuery>", 
            "parameters":[ 
               { 
                  "name": "<name>", 
                  "value": "<value>", 
                  "type": "<type>", 
                  "direction": "<Input> or <Output> or <InputOutput>", 
                  "size": 256 
               }, 
               ... 
            ] 
         }, 
         ... 
      ],     
         ... 
         ] 
      }, 
      "scriptBlockExecutionTimeout": "<time>",  
      "logSettings": { 
         "logDestination": "<ActivityOutput> or <ExternalStore>", 
         "logLocationSettings":{ 
            "linkedServiceName":{ 
               "referenceName": "<name>", 
               "type": "<LinkedServiceReference>" 
            }, 
            "path": "<folder path>" 
         } 
      } 
    } 
} 
```

The following table describes these JSON properties:


|Property name  |Description  |Required  |
|---------|---------|---------|
|name     |The name of the activity.          |Yes         |
|type     |The type of the activity, set to “Script”.          |Yes         |
|typeProperties     |Specify properties to configure the Script Activity.          |Yes         |
|linkedServiceName     |The target database the script runs on. It should be a reference to a linked service.          |Yes         |
|scripts     |An array of objects to represent the script.          |No         |
|scripts.text     |The plain text of a block of queries.        |No         |
|scripts.type     |The type of the block of queries. It can be Query or NonQuery. Default: Query.         |No         |
|scripts.parameter     |The array of parameters of the script.          |No         |
|scripts.parameter.name     |The name of the parameter.          |No         |
|scripts.parameter.value     |The value of the parameter.          |No         |
|scripts.parameter.type     |The data type of the parameter. The type is logical type and follows type mapping of each connector.         |No         |
|scripts.parameter.direction     |The direction of the parameter. It can be Input, Output, InputOutput. The value is ignored if the direction is Output. ReturnValue type is not supported. Set the return value of SP to an output parameter to retrieve it.          |No         |
|scripts.parameter.size     |The max size of the parameter. Only applies to Output/InputOutput direction parameter of type string/byte[].          |No         |
|scriptBlockExecutionTimeout    |The wait time for the script block execution operation to complete before it times out.        |No         |
|logSettings     |The settings to store the output logs. If not specified, script log is disabled.          |No         |
|logSettings.logDestination     |The destination of log output. It can be ActivityOutput or ExternalStore. Default: ActivityOutput.          |No         |
|logSettings.logLocationSettings     |The settings of the target location if logDestination is ExternalStore.          |No         |
|logSettiongs.logLocationSettings.linkedServiceName     |The linked service of the target location. Only blob storage is supported.          |No         |
|logSettings.logLocationSettings.path     |The folder path under which logs will be stored.          |No         |

## Activity output

Sample output:
```json
{ 
    "resultSetCount": 2, 
    "resultSets": [ 
        { 
            "rowCount": 10, 
            "rows":[ 
                { 
                    "<columnName1>": "<value1>", 
                    "<columnName2>": "<value2>", 
                    ... 
                } 
            ] 
        }, 
        ... 
    ], 
    "recordsAffected": 123, 
    "outputParameters":{ 
        "<parameterName1>": "<value1>", 
        "<parameterName2>": "<value2>" 
    }, 
    "outputLogs": "<logs>", 
    "outputLogsLocation": "<folder path>", 
    "outputTruncated": true, 
    ... 
} 
```


|Property name  |Description  |Condition  |
|---------|---------|---------|
|resultSetCount     |The count of result sets returned by the script.           |Always         |
|resultSets     |The array which contains all the result sets.           |Always          |
|resultSets.rowCount      |Total rows in the result set.         |Always          |
|resultSets.rows      |The array of rows in the result set.           |Always         |
|recordsAffected      |The row count of affected rows by the script.         |If scriptType is NonQuery.          |
|outputParameters     |The output parameters of the script.         |If parameter type is Output or InputOutput.          |
|outputLogs     |The logs written by the script, for example, print statement.         |If connector supports log statement and enableScriptLogs is true and logLocationSettings is not provided.          |
|outputLogsPath     |The full path of the log file.         |If enableScriptLogs is true and logLocationSettings is provided.          |
|outputTruncated     |Indicator of whether the output exceeds the limits and get truncated.          |If output exceeds the limits.         |

> [!NOTE]
> - The output is collected every time a script block is executed. The final output is the merged result of all script block outputs. The output parameter with same name in different script block will get overwritten. 
> - Since the output has size / rows limitation, the output will be truncated in following order: logs -> parameters -> rows. Note, this applies to a single script block, which means the output rows of next script block won’t evict previous logs. 
> - Any error caused by log won’t fail the activity. 
> - For consuming activity output resultSets in down stream activity please refer to the [Lookup activity result documentation](control-flow-lookup-activity.md#use-the-lookup-activity-result).
> - Use outputLogs when you are using 'PRINT' statements for logging purpose. If query returns resultSets, it will be available in the activity output and will be limited to 5000 rows/ 2MB size limit. 

## Configure the Script activity using UI

### Inline script

:::image type="content" source="media/transform-data-using-script/inline-script.png" alt-text="Screenshot showing the UI to configure an inline script.":::

Inline scripts integrate well with Pipeline CI/CD since the script is stored as part of the pipeline metadata.

### Logging

:::image type="content" source="media/transform-data-using-script/logging-settings.png" alt-text="Screenshot showing the UI for the logging settings for a script.":::

Logging options:

- _Disable_ - No execution output is logged.
- _Activity output_ - The script execution output is appended to the activity output. It can be consumed by downstream activities. The output size is limited to 2MB.  
- _External storage_ - Persists output to storage.  Use this option if the output size is greater than 2MB or you would like to explicitly persist the output on your storage account.
 
> [!NOTE]
> **Billing** - The Script activity will be [billed](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/) as **Pipeline activities**.

## Next steps
See the following articles that explain how to transform data in other ways:

* [U-SQL activity](transform-data-using-data-lake-analytics.md)
* [Hive activity](transform-data-using-hadoop-hive.md)
* [Pig activity](transform-data-using-hadoop-pig.md)
* [MapReduce activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming activity](transform-data-using-hadoop-streaming.md)
* [Spark activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
