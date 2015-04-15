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
	ms.date="04/14/2015" 
	ms.author="spelluru"/>

# Invoke MapReduce Programs from Data Factory
This article describes how to invoke a **MapReduce** program from an Azure Data Factory pipeline by using the **HDInsight Activity** with **MapReduce transformation**. 

## Introduction 
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs  a specific processing operation. This article describes using the MapReduce transformation of the HDInsight Activity.
 
See [Use Pig and Hive with Data Factory][data-factory-pig-hive-activities] for details about running Pig/Hive scripts on an HDInsight cluster from an Azure data factory pipeline by using Pig/Hive transformations of the HDInsight Activity. 

## JSON for HDInsight Activity using MapReduce transformation 

In the JSON definition for the HDInsight Activity: 
 
1. Set the **type** of the **activity** to **HDInsightActivity**.
2. Set the **type** of the **transformation** to **MapReduce**.
3. Specify the name of the class for **className** property.
4. Specify the path to the JAR file including the file name for **jarFilePath** property.
5. Specify the linked service that refers to the Azure Blob Storage that contains the JAR file for **jarLinkedService** property.   
6. Specify any arguments for the MapReduce program in the **arguments** section. 

   
 

		{  
		   "name":"MahoutMapReduceSamplePipeline",
		   "properties":{  
		      "description":"Sample Pipeline to Run a Mahout Custom Map Reduce Jar. This job calcuates an Item Similarity Matrix to determine the similarity between 2 items",
		      "activities":[  
		         {  
		            "name":"MyMahoutActivity",
		            "description":"Custom Map Reduce to generate Mahout result",
		            "type":"HDInsightActivity",
		            "inputs":[  
		               {  
		                  "Name":"MahoutInput"
		               }
		            ],
		            "outputs":[  
		               {  
		                  "Name":"MahoutOutput"
		               }
		            ],
		            "linkedServiceName":"HDInsightLinkedService",
		            "transformation":{  
		               "type":"MapReduce",
		               "className":"org.apache.mahout.cf.taste.hadoop.similarity.item.ItemSimilarityJob",
		               "jarFilePath":"<container>/Mahout/Jars/mahout-core-0.9.0.2.1.3.2-0002-job.jar",
		               "jarLinkedService":"StorageLinkedService",
		               "arguments":[  
		                  "-s",
		                  "SIMILARITY_LOGLIKELIHOOD",
		                  "--input",
		                  "wasb://<container>@<accountname>.blob.core.windows.net/Mahout/input",
		                  "--output",
		                  "wasb://<container>@<accountname>.blob.core.windows.net/Mahout/output/",
		                  "--maxSimilaritiesPerItem",
		                  "500",
		                  "--tempDir",
		                  "wasb://<container>@<accountname>.blob.core.windows.net/Mahout/temp/mahout"
		               ]
		            },
		            "policy":{  
		               "concurrency":1,
		               "executionPriorityOrder":"OldestFirst",
		               "retry":3,
		               "timeout":"01:00:00"
		            }
		         }
		      ]
		   }
		}

You can use the MapReduce transformation to run any MapReduce jar file on an HDInsight cluster. In the following sample JSON definition of a pipeline, the HDInsight Activity is configured to run a Mahout JAR file.

## Sample
You can download a sample for using the HDInsight Activity with MapReduce Transformation from: [Data Factory Samples on GitHub][data-factory-samples].  

## See Also

Article | Description
------ | ---------------
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an end-to-end walkthrough that shows how to implement a near real world scenario using Azure Data Factory to transform data from log files into insights. In this tutorial, you will use both Pig and Hive transformations to process data. 
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 


[data-factory-samples]: http://go.microsoft.com/fwlink/?LinkId=516907
[data-factory-pig-hive-activities]: data-factory-pig-hive-activities.md
[data-factory-copy-activity]: ..//data-factory-copy-activity
[adf-getstarted]: data-factory-get-started.md
[use-onpremises-datasources]: data-factory-use-onpremises-datasources.md
[adf-tutorial]: data-factory-tutorial.md
[use-custom-activities]: data-factory-use-custom-activities.md
[monitor-manage-using-powershell]: data-factory-monitor-manage-using-powershell.md
[troubleshoot]: data-factory-troubleshoot.md
[data-factory-introduction]: data-factory-introduction.md

[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456


[adfgetstarted]: data-factory-get-started.md
[adfgetstartedmonitoring]:data-factory-get-started.md#MonitorDataSetsAndPipeline 
[adftutorial]: data-factory-tutorial.md

[Developer Reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[Azure Portal]: http://portal.azure.com
