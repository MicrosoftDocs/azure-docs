<properties 
	pageTitle="Invoke MapReduce Program from Azure Data Factory" 
	description="Learn how to process data by running MapReduce programs on an Azure HDInsight cluster from an Azure data factory." 
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
	ms.date="09/22/2015" 
	ms.author="spelluru"/>

# Invoke MapReduce Programs from Data Factory
This article describes how to invoke a **MapReduce** program from an Azure Data Factory pipeline by using the **HDInsight MapReduce Activity**. 

## Introduction 
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs  a specific processing operation. This article describes using the MapReduce transformation of the HDInsight Activity.
 
See [Pig](data-factory-pig-activity) and [Hive](data-factory-hive-activity.md) article for details about running Pig/Hive scripts on an HDInsight cluster from an Azure data factory pipeline by using Pig/Hive transformations of the HDInsight Activity. 

## JSON for HDInsight Activity using MapReduce transformation 

In the JSON definition for the HDInsight Activity: 
 
1. Set the **type** of the **activity** to **HDInsight**.
3. Specify the name of the class for **className** property.
4. Specify the path to the JAR file including the file name for **jarFilePath** property.
5. Specify the linked service that refers to the Azure Blob Storage that contains the JAR file for **jarLinkedService** property.   
6. Specify any arguments for the MapReduce program in the **arguments** section. At runtime, you will see a few extra arguments (for example: mapreduce.job.tags) from the MapReduce framework. To differentiate your arguments with the MapReduce arguments, consider using both option and value as arguments as shown in the following example (-s, --input, --output etc... are options immediately followed by  their values).

 

		{
		  "name": "MahoutMapReduceSamplePipeline",
		  "properties": {
		    "description": "Sample Pipeline to Run a Mahout Custom Map Reduce Jar. This job calcuates an Item Similarity Matrix to determine the similarity between 2 items",
		    "activities": [
		      {
		        "name": "MyMahoutActivity",
		        "description": "Custom Map Reduce to generate Mahout result",
		        "inputs": [
		          {
		            "Name": "MahoutInput"
		          }
		        ],
		        "outputs": [
		          {
		            "Name": "MahoutOutput"
		          }
		        ],
		        "linkedServiceName": "HDInsightLinkedService",
		        "type": "HDInsightMapReduce",
		        "typeProperties": {
		          "className": "org.apache.mahout.cf.taste.hadoop.similarity.item.ItemSimilarityJob",
		          "jarFilePath": "<container>/Mahout/Jars/mahout-core-0.9.0.2.1.3.2-0002-job.jar",
		          "jarLinkedService": "StorageLinkedService",
		          "arguments": [
		            "-s",
		            "SIMILARITY_LOGLIKELIHOOD",
		            "--input",
		            "$$Text.Format('wasb://<container>@<accountname>.blob.core.windows.net/Mahout/Input/yearno={0:yyyy}/monthno={0:%M}/dayno={0:%d}/', SliceStart)",
		            "--output",
		            "$$Text.Format('wasb://<container>@<accountname>.blob.core.windows.net/Mahout/Output/yearno={0:yyyy}/monthno={0:%M}/dayno={0:%d}/', SliceStart)",
		            "--maxSimilaritiesPerItem",
		            "500",
		            "--tempDir",
		            "wasb://<container>@<accountname>.blob.core.windows.net/Mahout/temp/mahout"
		          ]
		        },
		        "policy": {
		          "concurrency": 1,
		          "executionPriorityOrder": "OldestFirst",
		          "retry": 3,
		          "timeout": "01:00:00"
		        }
		      }
		    ]
		  }
		}

You can use the MapReduce transformation to run any MapReduce jar file on an HDInsight cluster. In the following sample JSON definition of a pipeline, the HDInsight Activity is configured to run a Mahout JAR file.

## Sample
You can download a sample for using the HDInsight Activity with MapReduce Transformation from: [Data Factory Samples on GitHub](data-factory-samples.md).  


[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456


[adfgetstarted]: data-factory-get-started.md
[adfgetstartedmonitoring]:data-factory-get-started.md#MonitorDataSetsAndPipeline 
[adftutorial]: data-factory-tutorial.md

[Developer Reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[Azure Portal]: http://portal.azure.com
 