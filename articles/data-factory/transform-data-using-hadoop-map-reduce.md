---
title: Transform data using Hadoop MapReduce activity
description: Learn how to process data by running Hadoop MapReduce programs on an Azure HDInsight cluster with Azure Data Factory or Synapse Analytics.
titleSuffix: Azure Data Factory & Azure Synapse
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.custom: synapse
ms.date: 08/10/2023
---

# Transform data using Hadoop MapReduce activity in Azure Data Factory or Synapse Analytics


[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The HDInsight MapReduce activity in an Azure Data Factory or Synapse Analytics [pipeline](concepts-pipelines-activities.md) invokes MapReduce program on [your own](compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](compute-linked-services.md#azure-hdinsight-on-demand-linked-service) HDInsight cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

To learn more, read through  the introduction articles for [Azure Data Factory](introduction.md) and [Synapse Analytics](../synapse-analytics/overview-what-is.md), and do the tutorial: [Tutorial: transform data](tutorial-transform-data-spark-powershell.md) before reading this article.

See [Pig](transform-data-using-hadoop-pig.md) and [Hive](transform-data-using-hadoop-hive.md) for details about running Pig/Hive scripts on a HDInsight cluster from a pipeline by using HDInsight Pig and Hive activities.

## Add an HDInsight MapReduce activity to a pipeline with UI

To use an HDInsight MapReduce activity to a pipeline, complete the following steps:

1. Search for _MapReduce_ in the pipeline Activities pane, and drag a MapReduce activity to the pipeline canvas.
1. Select the new MapReduce activity on the canvas if it is not already selected.
1. Select the  **HDI Cluster** tab to select or create a new linked service to an HDInsight cluster that will be used to execute the MapReduce activity.

   :::image type="content" source="media/transform-data-using-hadoop-map-reduce/map-reduce-activity.png" alt-text="Shows the UI for a MapReduce activity.":::

1. Select the **Jar** tab to select or create a new Jar linked service to an Azure Storage account that will host your script.  Specify a class name to be executed there, and a file path within the storage location.  You can also configure advanced details including a Jar libs location, debugging configuration, and arguments and parameters to be passed to the script.

   :::image type="content" source="media/transform-data-using-hadoop-map-reduce/map-reduce-script-configuration.png" alt-text="Shows the UI for the Jar tab for a MapReduce activity.":::

## Syntax

```json
{
    "name": "Map Reduce Activity",
    "description": "Description",
    "type": "HDInsightMapReduce",
    "linkedServiceName": {
        "referenceName": "MyHDInsightLinkedService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "className": "org.myorg.SampleClass",
        "jarLinkedService": {
            "referenceName": "MyAzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "jarFilePath": "MyAzureStorage/jars/sample.jar",
        "getDebugInfo": "Failure",
        "arguments": [
            "-SampleHadoopJobArgument1"
        ],
        "defines": {
            "param1": "param1Value"
        }
    }
}
```

## Syntax details

| Property          | Description                              | Required |
| ----------------- | ---------------------------------------- | -------- |
| name              | Name of the activity                     | Yes      |
| description       | Text describing what the activity is used for | No       |
| type              | For MapReduce Activity, the activity type is HDinsightMapReduce | Yes      |
| linkedServiceName | Reference to the HDInsight cluster registered as a linked service. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article. | Yes      |
| className         | Name of the Class to be executed         | Yes      |
| jarLinkedService  | Reference to an Azure Storage Linked Service used to store the Jar files. Only **[Azure Blob Storage](./connector-azure-blob-storage.md)** and **[ADLS Gen2](./connector-azure-data-lake-storage.md)** linked services are supported here. If you don't specify this Linked Service, the Azure Storage Linked Service defined in the HDInsight Linked Service is used. | No       |
| jarFilePath       | Provide the path to the Jar files stored in the Azure Storage referred by jarLinkedService. The file name is case-sensitive. | Yes      |
| jarlibs           | String array of the path to the Jar library files referenced by the job stored in the Azure Storage defined in jarLinkedService. The file name is case-sensitive. | No       |
| getDebugInfo      | Specifies when the log files are copied to the Azure Storage used by HDInsight cluster (or) specified by jarLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No       |
| arguments         | Specifies an array of arguments for a Hadoop job. The arguments are passed as command-line arguments to each task. | No       |
| defines           | Specify parameters as key/value pairs for referencing within the Hive script. | No       |



## Example
You can use the HDInsight MapReduce Activity to run any MapReduce jar file on an HDInsight cluster. In the following sample JSON definition of a pipeline, the HDInsight Activity is configured to run a Mahout JAR file.

```json
{
    "name": "MapReduce Activity for Mahout",
    "description": "Custom MapReduce to generate Mahout result",
    "type": "HDInsightMapReduce",
    "linkedServiceName": {
        "referenceName": "MyHDInsightLinkedService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "className": "org.apache.mahout.cf.taste.hadoop.similarity.item.ItemSimilarityJob",
        "jarLinkedService": {
            "referenceName": "MyStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "jarFilePath": "adfsamples/Mahout/jars/mahout-examples-0.9.0.2.2.7.1-34.jar",
        "arguments": [
            "-s",
            "SIMILARITY_LOGLIKELIHOOD",
            "--input",
            "wasb://adfsamples@spestore.blob.core.windows.net/Mahout/input",
            "--output",
            "wasb://adfsamples@spestore.blob.core.windows.net/Mahout/output/",
            "--maxSimilaritiesPerItem",
            "500",
            "--tempDir",
            "wasb://adfsamples@spestore.blob.core.windows.net/Mahout/temp/mahout"
        ]
    }
}
```
You can specify any arguments for the MapReduce program in the **arguments** section. At runtime, you see a few extra arguments (for example: mapreduce.job.tags) from the MapReduce framework. To differentiate your arguments with the MapReduce arguments, consider using both option and value as arguments as shown in the following example (-s,--input,--output etc., are options immediately followed by their values).

## Next steps
See the following articles that explain how to transform data in other ways:

* [U-SQL activity](transform-data-using-data-lake-analytics.md)
* [Hive activity](transform-data-using-hadoop-hive.md)
* [Pig activity](transform-data-using-hadoop-pig.md)
* [Hadoop Streaming activity](transform-data-using-hadoop-streaming.md)
* [Spark activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
