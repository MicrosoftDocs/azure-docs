---
title: Invoke MapReduce Program from Azure Data Factory
description: Learn how to process data by running MapReduce programs on an Azure HDInsight cluster from an Azure data factory.
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.assetid: c34db93f-570a-44f1-a7d6-00390f4dc0fa
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/10/2018
---

# Invoke MapReduce Programs from Data Factory
> [!div class="op_single_selector" title1="Transformation Activities"]
> * [Hive Activity](data-factory-hive-activity.md) 
> * [Pig Activity](data-factory-pig-activity.md)
> * [MapReduce Activity](data-factory-map-reduce.md)
> * [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
> * [Spark Activity](data-factory-spark.md)
> * [Machine Learning Batch Execution Activity](data-factory-azure-ml-batch-execution-activity.md)
> * [Machine Learning Update Resource Activity](data-factory-azure-ml-update-resource-activity.md)
> * [Stored Procedure Activity](data-factory-stored-proc-activity.md)
> * [Data Lake Analytics U-SQL Activity](data-factory-usql-activity.md)
> * [.NET Custom Activity](data-factory-use-custom-activities.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [transform data using MapReduce activity in Data Factory](../transform-data-using-hadoop-map-reduce.md).


The HDInsight MapReduce activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes MapReduce programs on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) Windows/Linux-based HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!NOTE] 
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](data-factory-introduction.md) and do the tutorial: [Build your first data pipeline](data-factory-build-your-first-pipeline.md) before reading this article.  

## Introduction
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs a specific processing operation. This article describes using the HDInsight MapReduce Activity.

See [Pig](data-factory-pig-activity.md) and [Hive](data-factory-hive-activity.md) for details about running Pig/Hive scripts on a Windows/Linux-based HDInsight cluster from a pipeline by using HDInsight Pig and Hive activities. 

## JSON for HDInsight MapReduce Activity
In the JSON definition for the HDInsight Activity: 

1. Set the **type** of the **activity** to **HDInsight**.
2. Specify the name of the class for **className** property.
3. Specify the path to the JAR file including the file name for **jarFilePath** property.
4. Specify the linked service that refers to the Azure Blob Storage that contains the JAR file for **jarLinkedService** property.   
5. Specify any arguments for the MapReduce program in the **arguments** section. At runtime, you see a few extra arguments (for example: mapreduce.job.tags) from the MapReduce framework. To differentiate your arguments with the MapReduce arguments, consider using both option and value as arguments as shown in the following example (-s, --input, --output etc., are options immediately followed by their values).

	```JSON   
    {
        "name": "MahoutMapReduceSamplePipeline",
        "properties": {
            "description": "Sample Pipeline to Run a Mahout Custom Map Reduce Jar. This job calcuates an Item Similarity Matrix to determine the similarity between 2 items",
            "activities": [
                {
                    "type": "HDInsightMapReduce",
                    "typeProperties": {
                        "className": "org.apache.mahout.cf.taste.hadoop.similarity.item.ItemSimilarityJob",
                        "jarFilePath": "adfsamples/Mahout/jars/mahout-examples-0.9.0.2.2.7.1-34.jar",
                        "jarLinkedService": "StorageLinkedService",
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
                    },
                    "inputs": [
                        {
                            "name": "MahoutInput"
                        }
                    ],
                    "outputs": [
                        {
                            "name": "MahoutOutput"
                        }
                    ],
                    "policy": {
                        "timeout": "01:00:00",
                        "concurrency": 1,
                        "retry": 3
                    },
                    "scheduler": {
                        "frequency": "Hour",
                        "interval": 1
                    },
                    "name": "MahoutActivity",
                    "description": "Custom Map Reduce to generate Mahout result",
                    "linkedServiceName": "HDInsightLinkedService"
                }
            ],
            "start": "2017-01-03T00:00:00Z",
            "end": "2017-01-04T00:00:00Z"
        }
    }
    ```
   You can use the HDInsight MapReduce Activity to run any MapReduce jar file on an HDInsight cluster. In the following sample JSON definition of a pipeline, the HDInsight Activity is configured to run a Mahout JAR file.

## Sample on GitHub
You can download a sample for using the HDInsight MapReduce Activity from: [Data Factory Samples on GitHub](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/JSON/MapReduce_Activity_Sample).  

## Running the Word Count program
The pipeline in this example runs the Word Count Map/Reduce program on your Azure HDInsight cluster.   

### Linked Services
First, you create a linked service to link the Azure Storage that is used by the Azure HDInsight cluster to the Azure data factory. If you copy/paste the following code, do not forget to replace **account name** and **account key** with the name and key of your Azure Storage. 

#### Azure Storage linked service

```JSON
{
    "name": "StorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>"
        }
    }
}
```

#### Azure HDInsight linked service
Next, you create a linked service to link your Azure HDInsight cluster to the Azure data factory. If you copy/paste the following code, replace **HDInsight cluster name** with the name of your HDInsight cluster, and change user name and password values.   

```JSON
{
    "name": "HDInsightLinkedService",
    "properties": {
        "type": "HDInsight",
        "typeProperties": {
            "clusterUri": "https://<HDInsight cluster name>.azurehdinsight.net",
            "userName": "admin",
            "password": "**********",
            "linkedServiceName": "StorageLinkedService"
        }
    }
}
```

### Datasets
#### Output dataset
The pipeline in this example does not take any inputs. You specify an output dataset for the HDInsight MapReduce Activity. This dataset is just a dummy dataset that is required to drive the pipeline schedule.  

```JSON
{
    "name": "MROutput",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "StorageLinkedService",
        "typeProperties": {
            "fileName": "WordCountOutput1.txt",
            "folderPath": "example/data/",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ","
            }
        },
        "availability": {
            "frequency": "Day",
            "interval": 1
        }
    }
}
```

### Pipeline
The pipeline in this example has only one activity that is of type: HDInsightMapReduce. Some of the important properties in the JSON are: 

| Property | Notes |
|:--- |:--- |
| type |The type must be set to **HDInsightMapReduce**. |
| className |Name of the class is: **wordcount** |
| jarFilePath |Path to the jar file containing the class. If you copy/paste the following code, don't forget to change the name of the cluster. |
| jarLinkedService |Azure Storage linked service that contains the jar file. This linked service refers to the storage that is associated with the HDInsight cluster. |
| arguments |The wordcount program takes two arguments, an input and an output. The input file is the davinci.txt file. |
| frequency/interval |The values for these properties match the output dataset. |
| linkedServiceName |refers to the HDInsight linked service you had created earlier. |

```JSON
{
    "name": "MRSamplePipeline",
    "properties": {
        "description": "Sample Pipeline to Run the Word Count Program",
        "activities": [
            {
                "type": "HDInsightMapReduce",
                "typeProperties": {
                    "className": "wordcount",
                    "jarFilePath": "<HDInsight cluster name>/example/jars/hadoop-examples.jar",
                    "jarLinkedService": "StorageLinkedService",
                    "arguments": [
                        "/example/data/gutenberg/davinci.txt",
                        "/example/data/WordCountOutput1"
                    ]
                },
                "outputs": [
                    {
                        "name": "MROutput"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1,
                    "retry": 3
                },
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1
                },
                "name": "MRActivity",
                "linkedServiceName": "HDInsightLinkedService"
            }
        ],
        "start": "2014-01-03T00:00:00Z",
        "end": "2014-01-04T00:00:00Z"
    }
}
```

## Run Spark programs
You can use MapReduce activity to run Spark programs on your HDInsight Spark cluster. See [Invoke Spark programs from Azure Data Factory](data-factory-spark.md) for details.  

[developer-reference]: https://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: https://go.microsoft.com/fwlink/?LinkId=517456


[adfgetstarted]: data-factory-copy-data-from-azure-blob-storage-to-sql-database.md
[adfgetstartedmonitoring]:data-factory-copy-data-from-azure-blob-storage-to-sql-database.md#monitor-pipelines 

[Developer Reference]: https://go.microsoft.com/fwlink/?LinkId=516908
[Azure Portal]: https://portal.azure.com

## See Also
* [Hive Activity](data-factory-hive-activity.md)
* [Pig Activity](data-factory-pig-activity.md)
* [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
* [Invoke Spark programs](data-factory-spark.md)
* [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/RunRScriptUsingADFSample)

