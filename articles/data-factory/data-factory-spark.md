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

## Introduction
The HDInsight Spark activity in a Data Factory [pipeline](data-factory-create-pipelines.md) executes Spark programs on [your own](data-factory-compute-linked-services.md#azure-hdinsight-linked-service) HDInsight cluster. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!IMPORTANT]
> If you are new to Azure Data Factory, we recommend you go through the [Build your first pipeline](data-factory-build-your-first-pipeline.md) tutorial before you read this article. For an overview of Data Factory service, see [Introduction to Azure Data Factory](data-factory-introduction.md). 

## Apache Spark cluster in Azure HDInsight
First, create an Apache Spark cluster in Azure HDInsight by following instructions in the tutorial: [Create Apache Spark cluster in Azure HDInsight](../hdinsight/hdinsight-apache-spark-jupyter-spark-sql.md). 

## Create data factory 
Here are the typical steps to create a Data Factory pipeline with a Spark Activity.  

1. Create a data factory.
2. Create a linked service that links the Apache Spark cluster in Azure HDInsight to your data factory.
3. Currently, you must specify an output dataset for an activity even if there is no output being produced. To create an Azure Blob dataset, do the following steps:
	1. Create a linked service that links your Azure Storage account to the data factory.
	2. Create a dataset that refers to the Azure Storage linked service.  
3. Create a pipeline with Spark Activity that refers to the Apache HDInsight linked service created in #2. The activity is configured with the dataset you created in the previous step as an output dataset. The output dataset is what drives the schedule (hourly, daily, etc.). Therefore, you must specify the output dataset even though the activity does not really produce an output.

For detailed step-by-step instructions to create a data factory, see the tutorial: [Build your first pipeline](data-factory-build-your-first-pipeline.md). This tutorial uses a Hive Activity with a HDInsight Hadoop cluster but the steps are similar for using a Spark Activity with a HDInsight Spark cluster.   

The following sections provide information about Data Factory entities to use Apache Spark cluster and Spark Activity in your data factory.   

## HDInsight linked service
Before you use a Spark activity in a Data Factory pipeline, create a HDInsight (your own) linked service. The following JSON snippet shows the definition of a HDInsight linked service that points to an Azure HDInsight Spark cluster.   

```json
{
	"name": "HDInsightLinkedService",
	"properties": {
		"type": "HDInsight",
		"typeProperties": {
			"clusterUri": "https://<nameofyoursparkcluster>.azurehdinsight.net/",
	  		"userName": "admin",
	  		"password": "password",
	  		"linkedServiceName": "MyHDInsightStoragelinkedService"
		}
	}
}
```

> [!NOTE]
> Currently, the Spark Activity does not support Spark clusters that use an Azure Data Lake Store as a primary storage or an on-demand HDInsight linked service. 

For details about the HDInsight linked service and other compute linked services, see [Data Factory compute linked services](data-factory-compute-linked-services.md) article. 

## Spark Activity JSON
Here is the sample JSON definition of a pipeline with Spark Activity:    

```json
{
    "name": "SparkPipeline",
    "properties": {
        "activities": [
            {
                "type": "HDInsightSpark",
                "typeProperties": {
                    "rootPath": "adfspark\\pyFiles",
                    "entryFilePath": "test.py",
					"arguments": [ "arg1", "arg2" ],
					"sparkConfig": {
						"spark.python.worker.memory": "512m"
					}
                    "getDebugInfo": "Always"
                },
                "outputs": [
                    {
                        "name": "OutputDataset"
                    }
                ],
                "name": "MySparkActivity",
                "description": "This activity invokes the Spark program",
                "linkedServiceName": "HDInsightLinkedService"
            }
        ],
        "start": "2017-02-01T00:00:00Z",
        "end": "2017-02-02T00:00:00Z"
    }
}
```

Note the following points: 
- The type property is set to HDInsightSpark. 
- The rootPath is set to adfspark\\pyFiles where adfspark is the Azure Blob container and pyFiles is fine folder in that container. In this example, the Azure Blob Storage is the one that is associated with the Spark cluster. You can upload the file to a different Azure Storage. If you do so, create an Azure Storage linked service to link that storage account to the data factory. Then, specify the name of the linked service as a value for the sparkJobLinkedService property. See [Spark Activity properties](#spark-activity-properties) for details about this property and other properties supported by the Spark Activity.  
- The entryFilePath is set to the test.py, which is the python file. 
- The values for parameters for the Spark program are passed by using the arguments property. In this example, there are two arguments: arg1 and arg2. 
- The getDebugInfo property is set to Always, which means the log files are always generated (success or failure). 
- The sparkConfig section specifies one python environment setting: worker.memory. 
- The outputs section has one output dataset. You must specify an output dataset even if the spark program does not produce any output. The output dataset drives the schedule for the pipline (hourly, daily, etc.).     

The type properties (in the typeProperties section) are described later in this article in the [Spark Activity properties](#spark-activity-properties) section. 

As mentioned earlier, you must specify an output dataset for the activity as that is what drives the schedule for the pipeline (hourly, daily, etc.). In this example, an Azure Blob dataset is used. To create an Azure Blob dataset, you need to create an Azure Storage linked service first. 

Here are the sample definitions of Azure Storage linked service and Azure Blob dataset: 

**Azure Storage Linked service:**
```json
{
    "name": "AzureStorageLinkedService",
    "properties": {
        "type": "AzureStorage",
        "typeProperties": {
            "connectionString": "DefaultEndpointsProtocol=https;AccountName=<storageaccountname>;AccountKey=<storageaccountkey>"
        }
    }
}
```
 

**Azure Blob dataset:** 
```json
{
    "name": "OutputDataset",
    "properties": {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties": {
            "fileName": "sparkoutput.txt",
            "folderPath": "spark/output/",
            "format": {
                "type": "TextFormat",
                "columnDelimiter": "\t"
            }
        },
        "availability": {
            "frequency": "Day",
            "interval": 1
        }
    }
}
```

This dataset is more of a dummy dataset. Data Factory uses the frequency and interval settings and runs the pipeline daily within the start and end times of a pipeline. In the sample pipeline definition, the start and end times are only one day apart, so the pipeline runs only once. 

## Spark Activity properties

The following table describes the JSON properties used in the JSON definition: 

| Property | Description | Required |
| -------- | ----------- | -------- |
| name | Name of the activity in the pipeline. | Yes |
| description | Text describing what the activity does. | No |
| type | This property must be set to HDInsightSpark. | Yes |
| linkedServiceName | Name of the HDInsight linked service on which the Spark program runs. | Yes |
| rootPath | The Azure Blob container and folder that contains the Spark file. The file name is case-sensitive. | Yes |
| entryFilePath | Relative path to the root folder of the Spark code/package. | Yes |
| className | Application's Java/Spark main class | No | 
| arguments | A list of command-line arguments to the Spark program. | No | 
| proxyUser | The user account to impersonate to execute the Spark program | No | 
| sparkConfig | Spark configuration properties. | No | 
| getDebugInfo | Specifies when the Spark log files are copied to the Azure storage used by HDInsight cluster (or) specified by sparkJobLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No | 
| sparkJobLinkedService | The Azure Storage linked service that holds the Spark job file, dependencies, and logs.  If you do not specify a value for this property, the storage associated with HDInsight cluster is used. | No |

## Folder structure
The Spark activity does not support an in-line script as Pig and Hive activities do. Spark jobs are also more extensible than Pig/Hive jobs. For Spark jobs, you can provide multiple dependencies such as jar packages (placed in the java CLASSPATH), python files (placed on the PYTHONPATH), and any other files.

Create the following folder structure in the Azure Blob storage referenced by the HDInsight linked service. Then, upload dependent files to the appropriate sub folders in the root folder represented by **entryFilePath**. For example, upload python files to the pyFiles subfolder and jar files to the jars subfolder of the root folder. At runtime, Data Factory service expects the following folder structure in the Azure Blob storage:     

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



## See Also
* [Hive Activity](data-factory-hive-activity.md)
* [Pig Activity](data-factory-pig-activity.md)
* [MapReduce Activity](data-factory-map-reduce.md)
* [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md)
* [Invoke R scripts](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample)

