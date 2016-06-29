<properties 
	pageTitle="Invoke Spark programs from Azure Data Factory" 
	description="Learn how to invoke Spark programs from an Azure data factory using the MapReduce Activity." 
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
	ms.date="06/27/2016" 
	ms.author="spelluru"/>

# Invoke Spark Programs from Data Factory
## Introduction
You can use the MapReduce Activity in a Data Factory pipeline to run Spark programs on your HDInsight Spark cluster. Please see [MapReduce Activity](data-factory-map-reduce.md) article for detailed information on using the activity before reading this article. 

## Spark sample on GitHub
The [Spark - Data Factory sample on GitHub](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/Spark) shows how to use MapReduce activity to invoke a Spark program. The spark program just copies data from one Azure Blob container to another. 

## Data Factory entities
The **Spark-ADF/src/ADFJsons** folder contains files for Data Factory entities (linked services, datasets, pipeline).  

There are two **linked services** in this sample: Azure Storage and Azure HDInsight. You need to specify your Azure storage name and key values in **StorageLinkedService.json** and clusterUri, userName and password in **HDInsightLinkedService.json**.

There are two **datasets** in this sample: **input.json** and **output.json**. These files are located in the **Datasets** folder.  These files represent input and output datasets for the MapReduce activity

There is one **pipeline** in the sample in the **ADFJsons/Pipeline** folder. This is the most important entity that you need to review to understand how to invoke a Spark program by using the MapReduce activity. 

	{
	    "name": "SparkSubmit",
	    "properties": {
	        "description": "Submit a spark job",
	        "activities": [
	            {
	                "type": "HDInsightMapReduce",
	                "typeProperties": {
	                    "className": "com.adf.spark.SparkJob",
	                    "jarFilePath": "libs/spark-adf-job-bin.jar",
	                    "jarLinkedService": "StorageLinkedService",
	                    "arguments": [
	                        "--jarFile",
	                        "libs/sparkdemoapp_2.10-1.0.jar",
	                        "--jars",
	                        "/usr/hdp/current/hadoop-client/hadoop-azure-2.7.1.2.3.3.0-3039.jar,/usr/hdp/current/hadoop-client/lib/azure-storage-2.2.0.jar",
	                        "--mainClass",
	                        "com.adf.spark.demo.Demo",
	                        "--master",
	                        "yarn-cluster",
	                        "--driverMemory",
	                        "2g",
	                        "--driverExtraClasspath",
	                        "/usr/lib/hdinsight-logging/*",
	                        "--executorCores",
	                        "1",
	                        "--executorMemory",
	                        "4g",
	                        "--sparkHome",
	                        "/usr/hdp/current/spark-client",
	                        "--connectionString",
	                        "DefaultEndpointsProtocol=https;AccountName=<YOUR_ACCOUNT>;AccountKey=<YOUR_KEY>",
	                        "input=wasb://input@<YOUR_ACCOUNT>.blob.core.windows.net/data",
	                        "output=wasb://output@<YOUR_ACCOUNT>.blob.core.windows.net/results"
	                    ]
	                },
	                "inputs": [
	                    {
	                        "name": "input"
	                    }
	                ],
	                "outputs": [
	                    {
	                        "name": "output"
	                    }
	                ],
	                "policy": {
	                    "executionPriorityOrder": "OldestFirst",
	                    "timeout": "01:00:00",
	                    "concurrency": 1,
	                    "retry": 1
	                },
	                "scheduler": {
	                    "frequency": "Day",
	                    "interval": 1
	                },
	                "name": "Spark Launcher",
	                "description": "Submits a Spark Job",
	                "linkedServiceName": "HDInsightLinkedService"
	            }
	        ],
	        "start": "2015-11-16T00:00:01Z",
	        "end": "2015-11-16T23:59:00Z",
	        "isPaused": false,
	        "pipelineMode": "Scheduled"
	    }
	}

As you can see, the MapReduce activity is configured to invoke **spark-adf-job-bin.jar** in the **libs** container in your Azure storage (specified in the StorageLinkedService.json). The source code for this program is in Spark-ADF/src/main/java/com/adf/spark folder and it calls spark-submit and run Spark jobs. 

This MapReduce program (spark-adf-job-bin.jar) running on your HDInsight spark cluster invokes a spark program **sparkdemoapp_2.10-1.0.jar** and passes the arguments it receives via MapReduce activity (shown in the JSON above) to the Spark program. **sparkdemoapp_2.10-1.0.jar** contains Scala source code that copies data from one Azure blob container to another. You can replace this demo app jar with any other jar that contains any job that you are trying to run using Spark.

To summarize, the **MapReduce activity** invokes the MapReduce program **spark-adf-job-bin.jar** that invokes the Spark program **sparkdemoapp_2.10-1.0.jar**. To run your own spark program, replace sparkdemoapp_2.10-1.0.jar with your own.

> [AZURE.NOTE] You have to use your own HDInsight Spark cluster with this approach to invoke Spark programs using the MapReduce activity. Using an on-demand HDInsight cluster is not supported.  


## See Also
- [Hive Activity](data-factory-hive-activity.md)
- [Pig Activity](data-factory-pig-activity.md)
- [MapReduce Activity](data-factory-map-reduce.md)
- [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
- [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample)
