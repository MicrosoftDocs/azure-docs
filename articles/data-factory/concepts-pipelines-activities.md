---
title: Pipelines and activities in Azure Data Factory | Microsoft Docs
description: 'Learn about pipelines and activities in Azure Data Factory.'
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 06/12/2018
ms.author: shlo

---

# Pipelines and activities in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-create-pipelines.md)
> * [Current version](concepts-pipelines-activities.md)

This article helps you understand pipelines and activities in Azure Data Factory and use them to construct end-to-end data-driven workflows for your data movement and data processing scenarios.

## Overview
A data factory can have one or more pipelines. A pipeline is a logical grouping of activities that together perform a task. For example, a pipeline could contain a set of activities that ingest and clean log data, and then kick off a Spark job on an HDInsight cluster to analyze the log data. The beauty of this is that the pipeline allows you to manage the activities as a set instead of each one individually. For example, you can deploy and schedule the pipeline, instead of the activities independently.

The activities in a pipeline define actions to perform on your data. For example, you may use a copy activity to copy data from an on-premises SQL Server to an Azure Blob Storage. Then, use a Hive activity that runs a Hive script on an Azure HDInsight cluster to process/transform data from the blob storage to produce output data. Finally, use a second copy activity to copy the output data to an Azure SQL Data Warehouse on top of which business intelligence (BI) reporting solutions are built.

Data Factory supports three types of activities: [data movement activities](copy-activity-overview.md), [data transformation activities](transform-data.md), and [control activities](control-flow-web-activity.md). An activity can take zero or more input [datasets](concepts-datasets-linked-services.md) and produce one or more output [datasets](concepts-datasets-linked-services.md). The following diagram shows the relationship between pipeline, activity, and dataset in Data Factory:

![Relationship between dataset, activity, and pipeline](media/concepts-pipelines-activities/relationship-between-dataset-pipeline-activity.png)

An input dataset represents the input for an activity in the pipeline and an output dataset represents the output for the activity. Datasets identify data within different data stores, such as tables, files, folders, and documents. After you create a dataset, you can use it with activities in a pipeline. For example, a dataset can be an input/output dataset of a Copy Activity or an HDInsightHive Activity. For more information about datasets, see [Datasets in Azure Data Factory](concepts-datasets-linked-services.md) article.

## Data movement activities
Copy Activity in Data Factory copies data from a source data store to a sink data store. Data Factory supports the data stores listed in the table in this section. Data from any source can be written to any sink. Click a data store to learn how to copy data to and from that store.

[!INCLUDE [data-factory-v2-supported-data-stores](../../includes/data-factory-v2-supported-data-stores.md)]

For more information, see [Copy Activity - Overview](copy-activity-overview.md) article.

## Data transformation activities
Azure Data Factory supports the following transformation activities that can be added to pipelines either individually or chained with another activity.

Data transformation activity | Compute environment
---------------------------- | -------------------
[Hive](transform-data-using-hadoop-hive.md) | HDInsight [Hadoop]
[Pig](transform-data-using-hadoop-pig.md) | HDInsight [Hadoop]
[MapReduce](transform-data-using-hadoop-map-reduce.md) | HDInsight [Hadoop]
[Hadoop Streaming](transform-data-using-hadoop-streaming.md) | HDInsight [Hadoop]
[Spark](transform-data-using-spark.md) | HDInsight [Hadoop]
[Machine Learning activities: Batch Execution and Update Resource](transform-data-using-machine-learning.md) | Azure VM
[Stored Procedure](transform-data-using-stored-procedure.md) | Azure SQL, Azure SQL Data Warehouse, or SQL Server
[U-SQL](transform-data-using-data-lake-analytics.md) | Azure Data Lake Analytics
[Custom Code](transform-data-using-dotnet-custom-activity.md) | Azure Batch
[Databricks Notebook](transform-data-databricks-notebook.md) | Azure Databricks

For more information, see the [data transformation activities](transform-data.md) article.

## Control activities
The following control flow activities are supported:

Control activity | Description
---------------- | -----------
[Execute Pipeline Activity](control-flow-execute-pipeline-activity.md) | Execute Pipeline activity allows a Data Factory pipeline to invoke another pipeline.
[ForEachActivity](control-flow-for-each-activity.md) | ForEach Activity defines a repeating control flow in your pipeline. This activity is used to iterate over a collection and executes specified activities in a loop. The loop implementation of this activity is similar to Foreach looping structure in programming languages.
[WebActivity](control-flow-web-activity.md) | Web Activity can be used to call a custom REST endpoint from a Data Factory pipeline. You can pass datasets and linked services to be consumed and accessed by the activity.
[Lookup Activity](control-flow-lookup-activity.md) | Lookup Activity can be used to read or look up a record/ table name/ value from any external source. This output can further be referenced by succeeding activities.
[Get Metadata Activity](control-flow-get-metadata-activity.md) | GetMetadata activity can be used to retrieve metadata of any data in Azure Data Factory.
[Until Activity](control-flow-until-activity.md) | Implements Do-Until loop that is similar to Do-Until looping structure in programming languages. It executes a set of activities in a loop until the condition associated with the activity evaluates to true. You can specify a timeout value for the until activity in Data Factory.
[If Condition Activity](control-flow-if-condition-activity.md) | The If Condition can be used to branch based on condition that evaluates to true or false. The If Condition activity provides the same functionality that an if statement provides in programming languages. It evaluates a set of activities when the condition evaluates to `true` and another set of activities when the condition evaluates to `false`.
[Wait Activity](control-flow-wait-activity.md) | When you use a Wait activity in a pipeline, the pipeline waits for the specified period of time before continuing with execution of subsequent activities.

## Pipeline JSON
Here is how a pipeline is defined in JSON format:

```json
{
    "name": "PipelineName",
    "properties":
    {
        "description": "pipeline description",
        "activities":
        [
        ],
        "parameters": {
         }
    }
}
```

Tag | Description | Type | Required
--- | ----------- | ---- | --------
name | Name of the pipeline. Specify a name that represents the action that the pipeline performs. <br/><ul><li>Maximum number of characters: 140</li><li>Must start with a letter, number, or an underscore (\_)</li><li>Following characters are not allowed: “.”, “+”, “?”, “/”, “<”,”>”,”*”,”%”,”&”,”:”,”\”</li></ul> | String | Yes
description | Specify the text describing what the pipeline is used for. | String | No
activities | The **activities** section can have one or more activities defined within it. See the [Activity JSON](#activity-json) section for details about the activities JSON element. | Array | Yes
parameters | The **parameters** section can have one or more parameters defined within the pipeline, making your pipeline flexible for reuse. | List | No

## Activity JSON
The **activities** section can have one or more activities defined within it. There are two main types of activities: Execution and Control Activities.

### Execution activities
Execution activities include [data movement](#data-movement-activities) and [data transformation activities](#data-transformation-activities). They have the following top-level structure:

```json
{
    "name": "Execution Activity Name",
    "description": "description",
    "type": "<ActivityType>",
    "typeProperties":
    {
    },
    "linkedServiceName": "MyLinkedService",
    "policy":
    {
    },
    "dependsOn":
    {
    }
}
```

Following table describes properties in the activity JSON definition:

Tag | Description | Required
--- | ----------- | ---------
name | Name of the activity. Specify a name that represents the action that the activity performs. <br/><ul><li>Maximum number of characters: 55</li><li>Must start with a letter number, or an underscore (\_)</li><li>Following characters are not allowed: “.”, “+”, “?”, “/”, “<”,”>”,”*”,”%”,”&”,”:”,”\” | Yes</li></ul>
description | Text describing what the activity or is used for | Yes
type | Type of the activity. See the [Data Movement Activities](#data-movement-activities), [Data Transformation Activities](#data-transformation-activities), and [Control Activities](#control-activities) sections for different types of activities. | Yes
linkedServiceName | Name of the linked service used by the activity.<br/><br/>An activity may require that you specify the linked service that links to the required compute environment. | Yes for HDInsight Activity, Azure Machine Learning Batch Scoring Activity, Stored Procedure Activity. <br/><br/>No for all others
typeProperties | Properties in the typeProperties section depend on each type of activity. To see type properties for an activity, click links to the activity in the previous section. | No
policy | Policies that affect the run-time behavior of the activity. This property includes timeout and retry behavior. If it is not specified, default values are used. For more information, see [Activity policy](#activity-policy) section. | No
dependsOn | This property is used to define activity dependencies, and how subsequent activities depend on previous activities. For more information, see [Activity dependency](#activity-dependency) |	No

### Activity policy
Policies affect the run-time behavior of an activity, giving configurability options. Activity Policies are only available for execution activities.

### Activity policy JSON definition

```json
{
    "name": "MyPipelineName",
    "properties": {
      "activities": [
        {
          "name": "MyCopyBlobtoSqlActivity"
          "type": "Copy",
          "typeProperties": {
            ...
          },
         "policy": {
            "timeout": "00:10:00",
            "retry": 1,
            "retryIntervalInSeconds": 60,
            "secureOutput": true
         }
        }
      ],
        "parameters": {
           ...
        }
    }
}
```

JSON name | Description | Allowed Values | Required
--------- | ----------- | -------------- | --------
timeout | Specifies the timeout for the activity to run. | Timespan | No. Default timeout is 7 days.
retry | Maximum retry attempts | Integer | No. Default is 0
retryIntervalInSeconds | The delay between retry attempts in seconds | Integer | No. Default is 30 seconds
secureOutput | When set to true, output from activity is considered as secure and will not be logged to monitoring. | Boolean | No. Default is false.

### Control activity
Control activities have the following top-level structure:

```json
{
    "name": "Control Activity Name",
    "description": "description",
    "type": "<ActivityType>",
    "typeProperties":
    {
    },
    "dependsOn":
    {
    }
}
```

Tag | Description | Required
--- | ----------- | --------
name | Name of the activity. Specify a name that represents the action that the activity performs.<br/><ul><li>Maximum number of characters: 55</li><li>Must start with a letter number, or an underscore (\_)</li><li>Following characters are not allowed: “.”, “+”, “?”, “/”, “<”,”>”,”*”,”%”,”&”,”:”,”\” | Yes</li><ul>
description | Text describing what the activity or is used for | Yes
type | Type of the activity. See the [data movement activities](#data-movement-activities), [data transformation activities](#data-transformation-activities), and [control activities](#control-activities) sections for different types of activities. | Yes
typeProperties | Properties in the typeProperties section depend on each type of activity. To see type properties for an activity, click links to the activity in the previous section. | No
dependsOn | This property is used to define Activity Dependency, and how subsequent activities depend on previous activities. For more information, see [activity dependency](#activity-dependency). | No

### Activity dependency
Activity Dependency defines how subsequent activities depend on previous activities, determining the condition whether to continue executing the next task. An activity can depend on one or multiple previous activities with different dependency conditions.

The different dependency conditions are: Succeeded, Failed, Skipped, Completed.

For example, if a pipeline has Activity A -> Activity B, the different scenarios that can happen are:

- Activity B has dependency condition on Activity A with **succeeded**: Activity B only runs if Activity A has a final status of succeeded
- Activity B has dependency condition on Activity A with **failed**: Activity B only runs if Activity A has a final status of failed
- Activity B has dependency condition on Activity A with **completed**: Activity B runs if Activity A has a final status of succeeded or failed
- Activity B has dependency condition on Activity A with **skipped**: Activity B runs if Activity A has a final status of skipped. Skipped occurs in the scenario of Activity X -> Activity Y -> Activity Z, where each activity runs only if the previous activity succeeds. If Activity X fails, then Activity Y has a status of “Skipped” because it never executes. Similarly, Activity Z has a status of “Skipped” as well.

#### Example: Activity 2 depends on the Activity 1 succeeding

```json
{
    "name": "PipelineName",
    "properties":
    {
        "description": "pipeline description",
        "activities": [
         {
            "name": "MyFirstActivity",
            "type": "Copy",
            "typeProperties": {
            },
            "linkedServiceName": {
            }
        },
        {
            "name": "MySecondActivity",
            "type": "Copy",
            "typeProperties": {
            },
            "linkedServiceName": {
            },
            "dependsOn": [
            {
                "activity": "MyFirstActivity",
                "dependencyConditions": [
                    "Succeeded"
                ]
            }
          ]
        }
      ],
      "parameters": {
       }
    }
}

```

## Sample copy pipeline
In the following sample pipeline, there is one activity of type **Copy** in the **activities** section. In this sample, the [copy activity](copy-activity-overview.md) copies data from an Azure Blob storage to an Azure SQL database.

```json
{
  "name": "CopyPipeline",
  "properties": {
    "description": "Copy data from a blob to Azure SQL table",
    "activities": [
      {
        "name": "CopyFromBlobToSQL",
        "type": "Copy",
        "inputs": [
          {
            "name": "InputDataset"
          }
        ],
        "outputs": [
          {
            "name": "OutputDataset"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "SqlSink",
            "writeBatchSize": 10000,
            "writeBatchTimeout": "60:00:00"
          }
        },
        "policy": {
          "retry": 2,
          "timeout": "01:00:00"
        }
      }
    ]
  }
}
```
Note the following points:

- In the activities section, there is only one activity whose **type** is set to **Copy**.
- Input for the activity is set to **InputDataset** and output for the activity is set to **OutputDataset**. See [Datasets](concepts-datasets-linked-services.md) article for defining datasets in JSON.
- In the **typeProperties** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type. In the [data movement activities](#data-movement-activities) section, click the data store that you want to use as a source or a sink to learn more about moving data to/from that data store.

For a complete walkthrough of creating this pipeline, see [Quickstart: create a data factory](quickstart-create-data-factory-powershell.md).

## Sample transformation pipeline
In the following sample pipeline, there is one activity of type **HDInsightHive** in the **activities** section. In this sample, the [HDInsight Hive activity](transform-data-using-hadoop-hive.md) transforms data from an Azure Blob storage by running a Hive script file on an Azure HDInsight Hadoop cluster.

```json
{
    "name": "TransformPipeline",
    "properties": {
        "description": "My first Azure Data Factory pipeline",
        "activities": [
            {
                "type": "HDInsightHive",
                "typeProperties": {
                    "scriptPath": "adfgetstarted/script/partitionweblogs.hql",
                    "scriptLinkedService": "AzureStorageLinkedService",
                    "defines": {
                        "inputtable": "wasb://adfgetstarted@<storageaccountname>.blob.core.windows.net/inputdata",
                        "partitionedtable": "wasb://adfgetstarted@<storageaccountname>.blob.core.windows.net/partitioneddata"
                    }
                },
                "inputs": [
                    {
                        "name": "AzureBlobInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutput"
                    }
                ],
                "policy": {
                    "retry": 3
                },
                "name": "RunSampleHiveActivity",
                "linkedServiceName": "HDInsightOnDemandLinkedService"
            }
        ]
    }
}
```
Note the following points:

- In the activities section, there is only one activity whose **type** is set to **HDInsightHive**.
- The Hive script file, **partitionweblogs.hql**, is stored in the Azure storage account (specified by the scriptLinkedService, called AzureStorageLinkedService), and in script folder in the container `adfgetstarted`.
- The `defines` section is used to specify the runtime settings that are passed to the hive script as Hive configuration values (for example, $`{hiveconf:inputtable}`, `${hiveconf:partitionedtable}`).

The **typeProperties** section is different for each transformation activity. To learn about type properties supported for a transformation activity, click the transformation activity in the [Data transformation activities](#data-transformation-activities).

For a complete walkthrough of creating this pipeline, see [Tutorial: transform data using Spark](tutorial-transform-data-spark-powershell.md).

## Multiple activities in a pipeline
The previous two sample pipelines have only one activity in them. You can have more than one activity in a pipeline. If you have multiple activities in a pipeline and subsequent activities are not dependent on previous activities, the activities may run in parallel.

You can chain two activities by using [activity dependency](#activity-dependency), which defines how subsequent activities depend on previous activities, determining the condition whether to continue executing the next task. An activity can depend on one or more previous activities with different dependency conditions.

## Scheduling pipelines
Pipelines are scheduled by triggers. There are different types of triggers (scheduler trigger, which allows pipelines to be triggered on a wall-clock schedule, as well as manual trigger, which triggers pipelines on-demand). For more information about triggers, see [pipeline execution and triggers](concepts-pipeline-execution-triggers.md) article.

To have your trigger kick off a pipeline run, you must include a pipeline reference of the particular pipeline in the trigger definition. Pipelines & triggers have an n-m relationship. Multiple triggers can kick off a single pipeline and the same trigger can kick off multiple pipelines. Once the trigger is defined, you must start the trigger to have it start triggering the pipeline. For more information about triggers, see [pipeline execution and triggers](concepts-pipeline-execution-triggers.md) article.

For example, say you have a scheduler trigger, “Trigger A” that I wish to kick off my pipeline, “MyCopyPipeline.” You define the trigger as shown in the following example:

### Trigger A definition

```json
{
  "name": "TriggerA",
  "properties": {
    "type": "ScheduleTrigger",
    "typeProperties": {
      ...
      }
    },
    "pipeline": {
      "pipelineReference": {
        "type": "PipelineReference",
        "referenceName": "MyCopyPipeline"
      },
      "parameters": {
        "copySourceName": "FileSource"
      }
    }
  }
}
```



## Next steps
See the following tutorials for step-by-step instructions for creating pipelines with activities:

- [Build a pipeline with a copy activity](quickstart-create-data-factory-powershell.md)
- [Build a pipeline with a data transformation activity](tutorial-transform-data-spark-powershell.md)
