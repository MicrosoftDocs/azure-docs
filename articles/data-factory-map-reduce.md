<properties title="" pageTitle="Invoke MapReduce Program from Azure Data Factory" description="Learn how to process data by running MapReduce programs on an Azure HDInsight cluster from an Azure data factory." metaKeywords="" services="data-factory" solutions="" documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar"/>

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/13/2014" ms.author="spelluru" />

# Invoke MapReduce Programs from Data Factory
This article describes how to invoke a **MapReduce** program from an Azure Data Factory pipeline by using the **HDInsight Activity** with **MapReduce transformation**. 

## Introduction 
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs  a specific processing operation. 

- **Copy Activity** copies data from a source storage to a destination storage. To learn more about the Copy Activity, see [Copy data with Data Factory][data-factory-copy-activity]. 
- **HDInsight Activity** processes data by running Hive/Pig scripts or MapReduce programs on an HDInsight cluster. The HDInsight Activity supports three transformation: **Hive**, **Pig**, and **MapReduce**. The HDInsight Activity can consume 1 or more input and produce 1 or more outputs.
 
See [Use Pig and Hive with Data Factory][data-factory-pig-hive-activities] for details about running Pig/Hive scripts on an HDInsight cluster from an Azure data factory pipeline by using Pig/Hive transformations of the HDInsight Activity. This article describes using the MapReduce transformation of the HDInsight Activity.

## Pipeline JSON
In the JSON file for a pipeline:
 
1. Set the **type** of the **activity** to **HDInsightActivity**.
2. Set the **type** of the **transformation** to **MapReduce**.
3. Specify the name of the class for **className** property.
4. Specify the path to the JAR file including the file name for **jarFilePath** property.
5. Specify the linked service that refers to the Azure Blob Storage that contains the JAR file for **jarLinkedService** property.   
6. Specify any arguments for the MapReduce program in the **arguments** section. 

You can use the MapReduce transformation to run any MapReduce jar file on an HDInsight cluster. In the following sample JSON definition of a pipeline, the HDInsight Activity is configured to run a Mahout JAR file.   
 

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

## Sample
You can download a sample for using the HDInsight Activity with MapReduce Transformation from: [Data Factory Samples on GitHub][data-factory-samples].  

## See Also

Article | Description
------ | ---------------
[Introduction to Azure Data Factory][data-factory-introduction] | This article introduces you to the Azure Data Factory service, concepts, the value it provides, and scenarios it supports.
[Get started with Azure Data Factory][adf-getstarted] | This article provides an end-to-end tutorial that shows you how to create a sample Azure data factory that copies data from an Azure blob to an Azure SQL database.
[Enable your pipelines to work with on-premises data][use-onpremises-datasources] | This article has a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob.
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an end-to-end walkthrough that shows how to implement a near real world scenario using Azure Data Factory to transform data from log files into insights.
[Use custom activities in a Data Factory][use-custom-activities] | This article provides a walkthrough with step-by-step instructions for creating a custom activity and using it in a pipeline. 
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to troubleshoot Azure Data Factory issues.  
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 


[data-factory-samples]: http://go.microsoft.com/fwlink/?LinkId=516907
[data-factory-pig-hive-activities]: ../data-factory-pig-hive-activities
[data-factory-copy-activity]: ..//data-factory-copy-activity
[adf-getstarted]: ../data-factory-get-started
[use-onpremises-datasources]: ../data-factory-use-onpremises-datasources
[adf-tutorial]: ../data-factory-tutorial
[use-custom-activities]: ../data-factory-use-custom-activities
[monitor-manage-using-powershell]: ../data-factory-monitor-manage-using-powershell
[troubleshoot]: ../data-factory-troubleshoot
[data-factory-introduction]: ../data-factory-introduction

[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456


[adfgetstarted]: ../data-factory-get-started
[adfgetstartedmonitoring]:../data-factory-get-started#MonitorDataSetsAndPipeline 
[adftutorial]: ../data-factory-tutorial

[Developer Reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[Azure Portal]: http://portal.azure.com
