<properties 
	pageTitle="Hadoop Streaming Activity" 
	description="Learn how you can use the Hadoop Streaming Activity in an Azure data factory to run Hadoop Streaming programs on an on-demand/your own HDInsight cluster." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/05/2016" 
	ms.author="spelluru"/>

# Hadoop Streaming Activity
You can use the HDInsightStreamingActivity Activity invoke a Hadoop Streaming job from an Azure Data Factory pipeline. The following JSON snippet shows the syntax for using the HDInsightStreamingActivity in a pipeline JSON file. 

The HDInsight Streaming Activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes Hadoop Streaming programs on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) Windows/Linux-based HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article which presents a general overview of data transformation and the supported transformation activities.

## JSON sample
The HDInsight cluster is automatically populated with example programs (wc.exe and cat.exe) and data (davinci.txt). By default, name of the container that is used by the HDInsight cluster is the name of the cluster itself. For example, if your cluster name is myhdicluster, name of the blob container associated would be myhdicluster. 

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
	                    "fileLinkedService": "StorageLinkedService",
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

Note the following:

1. Set the **linkedServiceName** to the name of the linked service that points to your HDInsight cluster on which the streaming mapreduce job will be run.
2. Set the type of the activity to **HDInsightStreaming**.
3. For the **mapper** property, specify the name of mapper executable. In the above example, cat.exe is the mapper executable.
4. For the **reducer** property , specify the name of reducer executable. In the above example, wc.exe is the reducer executable.
5. For the **input** type property, specify the input file (including the location) for the mapper. In the example: "wasb://adfsample@<account name>.blob.core.windows.net/example/data/gutenberg/davinci.txt": adfsample is the blob container, example/data/Gutenberg is the folder and davinci.txt is the blob.
6. For the **output** type property, specify the output file (including the location) for the reducer. The output of the Hadoop Streaming job will be written to the location specified for this property.
7. In the **filePaths** section, specify the paths for the mapper and reducer executables. In the example: "adfsample/example/apps/wc.exe", adfsample is the blob container, example/apps is the folder, and wc.exe is the executable.
8. For the **fileLinkedService** property, specify the Azure Storage linked service that represents the Azure storage that contains the files specified in the filePaths section.
9. For the **arguments** property, specify the arguments for the streaming job.
10. The **getDebugInfo** property is an optional element. When it is set to Failure, the logs are downloaded only on failure. When it is set to All, logs are always downloaded irrespective of the execution status.

> [AZURE.NOTE] As shown in the example, you will need to specify an output dataset for the Hadoop Streaming Activity for the **outputs** property. This is just a dummy dataset that is required to drive the pipeline schedule. You do not need to specify any input dataset for the activity for the **inputs** property.  

	
## Example
The pipeline in this walkthrough runs the Word Count streaming Map/Reduce program on your Azure HDInsight cluster. 

### Linked services

#### Azure Storage linked service
First, you create a linked service to link the Azure Storage that is used by the Azure HDInsight cluster to the Azure data factory. If you copy/paste the following code, do not forget to replace account name and account key with the name and key of your Azure Storage. 

	{
	    "name": "StorageLinkedService",
	    "properties": {
	        "type": "AzureStorage",
	        "typeProperties": {
	            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>"
	        }
	    }
	}

#### Azure HDInsight linked service
Next, you create a linked service to link your Azure HDInsight cluster to the Azure data factory. If you copy/paste the following code, replace HDInsight cluster name with the name of your HDInsight cluster, and change user name and password values. 
	
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

### Datasets

#### Output dataset
The pipeline in this example does not take any inputs. You will need to specify an output dataset for the HDInsight Streaming Activity. This is just a dummy dataset that is required to drive the pipeline schedule. 

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

### Pipeline

The pipeline in this example has only one activity that is of type: **HDInsightStreaming**. 

The HDInsight cluster is automatically populated with example programs (wc.exe and cat.exe) and data (davinci.txt). By default, name of the container that is used by the HDInsight cluster is the name of the cluster itself. For example, if your cluster name is myhdicluster, name of the blob container associated would be myhdicluster.  

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
	        "start": "2014-01-04T00:00:00Z",
	        "end": "2014-01-05T00:00:00Z"
	    }
	}

## See Also
- [Hive Activity](data-factory-hive-activity.md)
- [Pig Activity](data-factory-pig-activity.md)
- [MapReduce Activity](data-factory-map-reduce.md)
- [Invoke Spark programs](data-factory-spark.md)
- [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample)

