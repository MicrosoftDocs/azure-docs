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
	ms.date="10/25/2015" 
	ms.author="spelluru"/>

# Hadoop Streaming Activity
You can use the HDInsightStreamingActivity Activity invoke a Hadoop Streaming job from an Azure Data Factory pipeline. The following JSON snippet shows the syntax for using the HDInsightStreamingActivity in a pipeline JSON file. 

The HDInsight Streaming Activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes Hadoop Streaming programs on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](data-factory-compute-linked-services.md#azure-hdinsight-on-demand-linked-service) HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article which presents a general overview of data transformation and the supported transformation activities.

## Example

	{
	    "name": "HadoopStreamingPipeline",
	    "properties":
	    {
	        "description" : "Hadoop Streaming Demo",
	        "activities":
	        [
	           {
	               "name": "RunHadoopStreamingJob",
	               "description": "Run a Hadoop streaming job",
	               "type": "HDInsightStreaming",
	               "getDebugInfo": "Failure",
	               "inputs": [ ],
	               "outputs": [ {"name": "OutputTable"} ],
	               "linkedServiceName": "HDInsightLinkedService",
	               "typeProperties":
	               {
	                   "mapper": "cat.exe",
	                   "reducer": "wc.exe",
	                   "input":  "wasb://adfsample@<account name>.blob.core.windows.net/example/data/gutenberg/davinci.txt",
	                   "output": " wasb://adfsample@<account name>.blob.core.windows.net/example/data/StreamingOutput/wc.txt",
	                   "filePaths": [ 
	                       "adfsample/example/apps/wc.exe" , 
	                       "adfsample/example/apps/cat.exe" 
	                   ],
	                   "fileLinkedService" : "StorageLinkedService",
	                   "arguments":[
	                   ]
	               },
	               "policy":
	               {
	                   "concurrency": 1,
	                   "executionPriorityOrder": "NewestFirst",
	                   "retry": 1,
	                   "timeout": "01:00:00"
	               }
	            }
	        ]
	    }
	}

Note the following:

1. Set the **linkedServiceName** to the name of the linked service that points to your HDInsight cluster on which the streaming mapreduce job will be run.
2. Set the type of the activity to **HDInsightStreaming**.
3. For the **mapper** property, specify the name of mapper executable. In the above example, cat.exe is the mapper executable.
4. For the **reducer** property , specify the name of reducer executable. In the above example, wc.exe is the reducer executable.
5. For the **input** property, specify the input file (including the location) for the mapper. In the example: "wasb://adfsample@<account name>.blob.core.windows.net/example/data/gutenberg/davinci.txt": adfsample is the blob container, example/data/Gutenberg is the folder and davinci.txt is the blob.
6. For the **output** property, specify the output file (including the location) for the reducer. The output of the Hadoop Streaming job will be written to the location specified for this property.
7. In the **filePaths** section, specify the paths for the mapper and reducer executables. In the example: "adfsample/example/apps/wc.exe", adfsample is the blob container, example/apps is the folder, and wc.exe is the executable.
8. For the **fileLinkedService** property, specify the Azure Storage linked service that represents the Azure storage that contains the files specified in the filePaths section.
9. For the **arguments** property, specify the arguments for the streaming job.
10. The **getDebugInfo** property is an optional element. When it is set to Failure, the logs are downloaded only on failure. When it is set to All, logs are always downloaded irrespective of the execution status. 

	
