---
title: Transform data using Hadoop Hive activity
description: Learn how you can use the Hive Activity in an Azure Data Factory or Synapse Analytics pipeline to run Hive queries on an on-demand/your own HDInsight cluster.
titleSuffix: Azure Data Factory & Azure Synapse
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.custom: synapse
ms.date: 08/10/2023
---

# Transform data using Hadoop Hive activity in Azure Data Factory or Synapse Analytics


[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The HDInsight Hive activity in an Azure Data Factory or Synapse Analytics [pipeline](concepts-pipelines-activities.md) executes Hive queries on [your own](compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](compute-linked-services.md#azure-hdinsight-on-demand-linked-service)  HDInsight cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

If you are new to Azure Data Factory and Synapse Analytics, read through the introduction articles for [Azure Data Factory](introduction.md) or [Synapse Analytics](../synapse-analytics/overview-what-is.md), and do the [Tutorial: transform data](tutorial-transform-data-spark-powershell.md) before reading this article. 

## Add an HDInsight Hive activity to a pipeline with UI

To use an HDInsight Hive activity for Azure Data Lake Analytics in a pipeline, complete the following steps:

1. Search for _Hive_ in the pipeline Activities pane, and drag a Hive activity to the pipeline canvas.
1. Select the new Hive activity on the canvas if it is not already selected.
1. Select the  **HDI Cluster** tab to select or create a new linked service to an HDInsight cluster that will be used to execute the Hive activity.

   :::image type="content" source="media/transform-data-using-hadoop-hive/hive-activity.png" alt-text="Shows the UI for a Hive activity.":::

1. Select the **Script** tab to select or create a new storage linked service, and a path within the storage location, which will host the script.

   :::image type="content" source="media/transform-data-using-hadoop-hive/hive-script-configuration.png" alt-text="Shows the UI for the Script tab for a Hive activity.":::

## Syntax

```json
{
    "name": "Hive Activity",
    "description": "description",
    "type": "HDInsightHive",
    "linkedServiceName": {
        "referenceName": "MyHDInsightLinkedService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "scriptLinkedService": {
            "referenceName": "MyAzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "scriptPath": "MyAzureStorage\\HiveScripts\\MyHiveSript.hql",
        "getDebugInfo": "Failure",
        "arguments": [
            "SampleHadoopJobArgument1"
        ],
        "defines": {
            "param1": "param1Value"
        }
    }
}
```
## Syntax details
| Property            | Description                                                  | Required |
| ------------------- | ------------------------------------------------------------ | -------- |
| name                | Name of the activity                                         | Yes      |
| description         | Text describing what the activity is used for                | No       |
| type                | For Hive Activity, the activity type is HDinsightHive        | Yes      |
| linkedServiceName   | Reference to the HDInsight cluster registered as a linked service. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article. | Yes      |
| scriptLinkedService | Reference to an Azure Storage Linked Service used to store the Hive script to be executed. Only **[Azure Blob Storage](./connector-azure-blob-storage.md)** and **[ADLS Gen2](./connector-azure-data-lake-storage.md)** linked services are supported here. If you don't specify this Linked Service, the Azure Storage Linked Service defined in the HDInsight Linked Service is used.  | No       |
| scriptPath          | Provide the path to the script file stored in the Azure Storage referred by scriptLinkedService. The file name is case-sensitive. | Yes      |
| getDebugInfo        | Specifies when the log files are copied to the Azure Storage used by HDInsight cluster (or) specified by scriptLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No       |
| arguments           | Specifies an array of arguments for a Hadoop job. The arguments are passed as command-line arguments to each task. | No       |
| defines             | Specify parameters as key/value pairs for referencing within the Hive script. | No       |
| queryTimeout        | Query timeout value (in minutes). Applicable when the HDInsight cluster is with Enterprise Security Package enabled. | No       |

>[!NOTE]
>The default value for queryTimeout is 120 minutes. 

## Next steps
See the following articles that explain how to transform data in other ways: 

* [U-SQL activity](transform-data-using-data-lake-analytics.md)
* [Pig activity](transform-data-using-hadoop-pig.md)
* [MapReduce activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming activity](transform-data-using-hadoop-streaming.md)
* [Spark activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
