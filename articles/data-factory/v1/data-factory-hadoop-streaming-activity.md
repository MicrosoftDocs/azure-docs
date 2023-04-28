---
title: Transform data using Hadoop Streaming Activity - Azure 
description: Learn how you can use the Hadoop Streaming Activity in an Azure data factory to transform data by running Hadoop Streaming programs on an on-demand/your own HDInsight cluster.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
---

# Transform data using Hadoop Streaming Activity in Azure Data Factory
> [!div class="op_single_selector" title1="Transformation Activities"]
> * [Hive Activity](data-factory-hive-activity.md) 
> * [Pig Activity](data-factory-pig-activity.md)
> * [MapReduce Activity](data-factory-map-reduce.md)
> * [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
> * [Spark Activity](data-factory-spark.md)
> * [ML Studio (classic) Batch Execution Activity](data-factory-azure-ml-batch-execution-activity.md)
> * [ML Studio (classic) Update Resource Activity](data-factory-azure-ml-update-resource-activity.md)
> * [Stored Procedure Activity](data-factory-stored-proc-activity.md)
> * [Data Lake Analytics U-SQL Activity](data-factory-usql-activity.md)
> * [.NET Custom Activity](data-factory-use-custom-activities.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [transform data using Hadoop streaming activity in Data Factory](../transform-data-using-hadoop-streaming.md).


You can use the HDInsightStreamingActivity Activity invoke a Hadoop Streaming job from an Azure Data Factory pipeline. The following JSON snippet shows the syntax for using the HDInsightStreamingActivity in a pipeline JSON file. 

The HDInsight Streaming Activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes Hadoop Streaming programs on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) Windows/Linux-based HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!NOTE] 
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](data-factory-introduction.md) and do the tutorial: [Build your first data pipeline](data-factory-build-your-first-pipeline.md) before reading this article. 

## JSON sample
The HDInsight cluster is automatically populated with example programs (wc.exe and cat.exe) and data (davinci.txt). By default, name of the container that is used by the HDInsight cluster is the name of the cluster itself. For example, if your cluster name is myhdicluster, name of the blob container associated would be myhdicluster. 

```JSON
{
    "name": "HadoopStreamingPipeline",
    "properties": {
        "description": "Hadoop Streaming Demo",
        "activities": [
            {
                "type": "HDInsightStreaming",
                "typeProperties": {
                    "mapper": "cat.exe",
                    "reducer": "wc.exe",
                    "input": "wasb://<nameofthecluster>@spestore.blob.core.windows.net/example/data/gutenberg/davinci.txt",
                    "output": "wasb://<nameofthecluster>@spestore.blob.core.windows.net/example/data/StreamingOutput/wc.txt",
                    "filePaths": [
                        "<nameofthecluster>/example/apps/wc.exe",
                        "<nameofthecluster>/example/apps/cat.exe"
                    ],
                    "fileLinkedService": "AzureStorageLinkedService",
                    "getDebugInfo": "Failure"
                },
                "outputs": [
                    {
                        "name": "StreamingOutputDataset"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "retry": 1
                },
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1
                },
                "name": "RunHadoopStreamingJob",
                "description": "Run a Hadoop streaming job",
                "linkedServiceName": "HDInsightLinkedService"
            }
        ],
        "start": "2014-01-04T00:00:00Z",
        "end": "2014-01-05T00:00:00Z"
    }
}
```

Note the following points:

1. Set the **linkedServiceName** to the name of the linked service that points to your HDInsight cluster on which the streaming mapreduce job is run.
2. Set the type of the activity to **HDInsightStreaming**.
3. For the **mapper** property, specify the name of mapper executable. In the example, cat.exe is the mapper executable.
4. For the **reducer** property, specify the name of reducer executable. In the example, wc.exe is the reducer executable.
5. For the **input** type property, specify the input file (including the location) for the mapper. In the example: `wasb://adfsample@<account name>.blob.core.windows.net/example/data/gutenberg/davinci.txt`: adfsample is the blob container, example/data/Gutenberg is the folder, and davinci.txt is the blob.
6. For the **output** type property, specify the output file (including the location) for the reducer. The output of the Hadoop Streaming job is written to the location specified for this property.
7. In the **filePaths** section, specify the paths for the mapper and reducer executables. In the example: "adfsample/example/apps/wc.exe", adfsample is the blob container, example/apps is the folder, and wc.exe is the executable.
8. For the **fileLinkedService** property, specify the Azure Storage linked service that represents the Azure storage that contains the files specified in the filePaths section.
9. For the **arguments** property, specify the arguments for the streaming job.
10. The **getDebugInfo** property is an optional element. When it is set to Failure, the logs are downloaded only on failure. When it is set to Always, logs are always downloaded irrespective of the execution status.

> [!NOTE]
> As shown in the example, you specify an output dataset for the Hadoop Streaming Activity for the **outputs** property. This dataset is just a dummy dataset that is required to drive the pipeline schedule. You do not need to specify any input dataset for the activity for the **inputs** property.  
> 
> 

## Example
The pipeline in this walkthrough runs the Word Count streaming Map/Reduce program on your Azure HDInsight cluster. 

### Linked services
#### Azure Storage linked service
First, you create a linked service to link the Azure Storage that is used by the Azure HDInsight cluster to the Azure data factory. If you copy/paste the following code, do not forget to replace account name and account key with the name and key of your Azure Storage. 

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
Next, you create a linked service to link your Azure HDInsight cluster to the Azure data factory. If you copy/paste the following code, replace HDInsight cluster name with the name of your HDInsight cluster, and change user name and password values. 

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
The pipeline in this example does not take any inputs. You specify an output dataset for the HDInsight Streaming Activity. This dataset is just a dummy dataset that is required to drive the pipeline schedule. 

```JSON
{
    "name": "StreamingOutputDataset",
    "properties": {
        "published": false,
        "type": "AzureBlob",
        "linkedServiceName": "StorageLinkedService",
        "typeProperties": {
            "folderPath": "adftutorial/streamingdata/",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": ","
            },
        },
        "availability": {
            "frequency": "Day",
            "interval": 1
        }
    }
}
```

### Pipeline
The pipeline in this example has only one activity that is of type: **HDInsightStreaming**. 

The HDInsight cluster is automatically populated with example programs (wc.exe and cat.exe) and data (davinci.txt). By default, name of the container that is used by the HDInsight cluster is the name of the cluster itself. For example, if your cluster name is myhdicluster, name of the blob container associated would be myhdicluster.  

```JSON
{
    "name": "HadoopStreamingPipeline",
    "properties": {
        "description": "Hadoop Streaming Demo",
        "activities": [
            {
                "type": "HDInsightStreaming",
                "typeProperties": {
                    "mapper": "cat.exe",
                    "reducer": "wc.exe",
                    "input": "wasb://<blobcontainer>@spestore.blob.core.windows.net/example/data/gutenberg/davinci.txt",
                    "output": "wasb://<blobcontainer>@spestore.blob.core.windows.net/example/data/StreamingOutput/wc.txt",
                    "filePaths": [
                        "<blobcontainer>/example/apps/wc.exe",
                        "<blobcontainer>/example/apps/cat.exe"
                    ],
                    "fileLinkedService": "StorageLinkedService"
                },
                "outputs": [
                    {
                        "name": "StreamingOutputDataset"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "retry": 1
                },
                "scheduler": {
                    "frequency": "Day",
                    "interval": 1
                },
                "name": "RunHadoopStreamingJob",
                "description": "Run a Hadoop streaming job",
                "linkedServiceName": "HDInsightLinkedService"
            }
        ],
        "start": "2017-01-03T00:00:00Z",
        "end": "2017-01-04T00:00:00Z"
    }
}
```
## See Also
* [Hive Activity](data-factory-hive-activity.md)
* [Pig Activity](data-factory-pig-activity.md)
* [MapReduce Activity](data-factory-map-reduce.md)
* [Invoke Spark programs](data-factory-spark.md)
* [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/RunRScriptUsingADFSample)

