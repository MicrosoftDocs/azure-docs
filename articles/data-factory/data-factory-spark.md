---
title: Invoke Spark programs from Azure Data Factory
description: Learn how to invoke Spark programs from an Azure data factory using the MapReduce Activity.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: fd98931c-cab5-4d66-97cb-4c947861255c
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/21/2017
ms.author: spelluru

---
# Invoke Spark Programs from Data Factory
## Introduction
The HDInsight Spark activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes Spark programs on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article, which presents a general overview of data transformation and the supported transformation activities.

## HDInsight linked service
Before you use a Spark activity in a Data Factory pipeline, create a HDInsight (your own) linked service. The following JSON snippet shows the definition of a HDInsight linked service to point to your own Azure HDInsight Spark cluster.   

```json
{
	"name": "HDInsightLinkedService",
	"properties": {
		"type": "HDInsight",
		"typeProperties": {
			"clusterUri": "https://MyHdinsightSparkcluster.azurehdinsight.net/",
	  		"userName": "admin",
	  		"password": "password",
	  		"linkedServiceName": "MyHDInsightStoragelinkedService"
		}
	}
}
```

> [!NOTE]
> Currently, the Spark Activity does not support using an on-demand HDInsight linked service.  

For details about the HDInsight linked service and other compute linked services, see [Data Factory compute linked services](data-factory-compute-linked-services.md) article. 

## Spark Activity JSON
Here is the sample JSON definition of a Spark activity:    

```json
{
	"name": "MySparkActivity",
	"description": "This activity invokes the Spark program",
	"type": "HDInsightSpark",
	"outputs": [
    	{
        	"name": "PlaceholderDataset"
    	}
	],
	"linkedServiceName": "HDInsightLinkedService",
	"typeProperties": {
		"rootPath": "mycontainer\\myfolder",
		"entryFilePath": "main.py",
		"arguments": [ "arg1", "arg2" ],
		"sparkConfig": {
  			"spark.python.worker.memory": "512m"
		}
	}
}
```
The following table describes the JSON properties used in the JSON definition: 

| Property | Description | Required |
| -------- | ----------- | -------- |
| name | Name for the activity in the pipeline. | Yes |
| description | Text describing what the activity does. | No |
| type | This property must be set to HDInsightSpark. | Yes |
| linkedServiceName | Reference to a HDInsight linked service on which the Spark program runs. | Yes |
| rootPath | The Azure Blob container and folder that contains the Spark file. The file name is case-sensitive. | Yes |
| entryFilePath | Relative path to the root folder of the Spark code/package | Yes |
| className | Application's Java/Spark main class | No | 
| arguments | A list of command-line arguments to the Spark program. | No | 
| proxyUser | The user account to impersonate to execute the Spark program | No | 
| sparkConfig | Spark configuration properties | No | 
| getDebugInfo | Specifies when the Spark log files are copied to the Azure storage used by HDInsight cluster (or) specified by sparkJobLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No | 
| sparkJobLinkedService | The Azure Storage linked service that holds the Spark job file, dependencies, and logs.  If you do not specify a value for this property, the storage associated with HDInsight cluster is used. | No |

## Folder structure
The Spark activity does not support an in-line script as Pig and Hive activities do. Spark jobs are also more extensible than Pig/Hive jobs. For Spark jobs, you can provide multiple dependencies such as jar packages (placed in the java CLASSPATH), python files (placed on the PYTHONPATH), and any other files.

Create the following folder structure in the Azure Blob storage referenced by the the HDInsight linked service. Then, upload dependent files to the appropriate sub folders in the root folder represented by **entryFilePath**. For example, upload python files to the pyFiles subfolder and jars to the jars subfolder in the root folder. At runtime, Data Factory service expects the following folder structure in the Azure Blob storage:     

| Path | Description | Required | Type |
| ---- | ----------- | -------- | ---- | 
| .	| The root path of the Spark job in the storage linked service	| Yes | Folder |
| &lt;user defined &gt; | The path pointing to the entry file of the Spark job | Yes | File | 
| ./jars | All files under this folder are uploaded and placed on the java classpath of the cluster | No | Folder |
| ./pyFiles | All files under this folder are uploaded and placed on the PYTHONPATH of the cluster | No | Folder |
| ./files | All files under this folder are uploaded and placed on executor working directory | No | Folder |
| ./archives | All files under this folder are uncompressed | No | Folder |
| ./logs | The folder where logs from the Spark cluster are stored.| No | Folder |

Here is an example for a storage containing two Spark job files in the Azure Blob Storage referenced by the HDInsight linked service. 

```
SparkJob1
	main.jar
	files
		input1.txt
		input2.txt
	jars
		package1.jar
		package2.jar
	logs

SparkJob2
	main.py
	pyFiles
		scrip1.py
		script2.py
	logs	
```

> [!IMPORTANT]
> For a complete walkthrough of creating a pipeline with a transformation activity, see [Create a pipeline to transform data](data-factory-build-your-first-pipeline-using-editor.md) article. 

## Spark sample on GitHub
Before the Spark Activity was supported, the work-around to run Spark programs from Data Factory pipeline was to use a MapReduce activity. You can still use the [MapReduce Activity](data-factory-map-reduce.md) in a Data Factory pipeline to run Spark programs on your HDInsight Spark cluster. We recommend you use the Spark Activity instead of using the MapReduce activity. 

The [Spark - Data Factory sample on GitHub](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/Spark) shows how to use MapReduce activity to invoke a Spark program. The spark program just copies data from one Azure Blob container to another. 

## See Also
* [Hive Activity](data-factory-hive-activity.md)
* [Pig Activity](data-factory-pig-activity.md)
* [MapReduce Activity](data-factory-map-reduce.md)
* [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
* [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample)

