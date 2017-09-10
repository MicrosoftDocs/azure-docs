---
title: Transform data using MapReduce Activity in Azure Data Factory | Microsoft Docs
description: Learn how to process data by running Hadoop MapReduce programs on an Azure HDInsight cluster from an Azure data factory.
services: data-factory
documentationcenter: ''
author: shengcmsft
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: shengc

---
# Transform data using MapReduce Activity in Azure Data Factory
The HDInsight MapReduce activity in a Data Factory [pipeline](concepts-pipelines-activities.md) invokes MapReduce program on [your own](compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](compute-linked-services.md#azure-hdinsight-on-demand-linked-service)  HDInsight cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!NOTE] 
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](introduction.md) and do the tutorial: [Tutorial: transform data](tutorial-transform-data-using-spark-powershell.md) before reading this article. 

See [Pig](transform-data-using-hadoop-pig.md) and [Hive](transform-data-using-hadoop-hive.md) for details about running Pig/Hive scripts on a HDInsight cluster from a pipeline by using HDInsight Pig and Hive activities. 

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
        "jarlibs": "MyAzureStorage/jars/jar1",
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
| linkedServiceName | Reference to the HDInsight cluster registered as a linked service in Data Factory | Yes      |
| className         | Name of the Class to be executed         | Yes      |
| jarLinkedService  | Reference to an Azure Storage Linked Service used to store the Jar files. If you don't specify this Linked Service, the Azure Storage Linked Service defined in the HDInsight Linked Service is used. | No       |
| jarFilePath       | Provide the path to the Jar files stored in the Azure Storage referred by jarLinkedService. The file name is case-sensitive. | Yes      |
| jarlibs           | Provide the path to the Jar library files referenced by the job stored in the Azure Storage referred by jarLinkedService. The file name is case-sensitive. | No       |
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
You can specify any arguments for the MapReduce program in the **arguments** section. At runtime, you see a few extra arguments (for example: mapreduce.job.tags) from the MapReduce framework. To differentiate your arguments with the MapReduce arguments, consider using both option and value as arguments as shown in the following example (-s, --input, --output etc., are options immediately followed by their values).

## Next steps
See the following articles that explain how to transform data in other ways: 

* [U-SQL Activity](transform-data-using-data-lake-analytics.md)
* [Hive Activity](transform-data-using-hadoop-hive.md)
* [Pig Activity](transform-data-using-hadoop-pig.md)
* [Hadoop Streaming Activity](transform-data-using-hadoop-streaming.md)
* [Spark Activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Machine Learning Bach Execution Activity](transform-data-using-machine-learning.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
