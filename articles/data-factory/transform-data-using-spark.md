---
title: Transform data using Spark activity in Azure Data Factory | Microsoft Docs
description: Learn how to transform data by running Spark programs from an Azure data factory pipeline using the Spark Activity. 
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 05/31/2018
author: nabhishek
ms.author: abnarain
manager: craigg
---
# Transform data using Spark activity in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-spark.md)
> * [Current version](transform-data-using-spark.md)

The Spark activity in a Data Factory [pipeline](concepts-pipelines-activities.md) executes a Spark program on [your own](compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](compute-linked-services.md#azure-hdinsight-on-demand-linked-service)  HDInsight cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. When you use an on-demand Spark linked service, Data Factory automatically creates a Spark cluster for you just-in-time to process the data and then deletes the cluster once the processing is complete. 


## Spark activity properties
Here is the sample JSON definition of a Spark Activity:    

```json
{
    "name": "Spark Activity",
    "description": "Description",
    "type": "HDInsightSpark",
    "linkedServiceName": {
        "referenceName": "MyHDInsightLinkedService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "sparkJobLinkedService": {
            "referenceName": "MyAzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "rootPath": "adfspark",
        "entryFilePath": "test.py",
        "sparkConfig": {
            "ConfigItem1": "Value"
        },
        "getDebugInfo": "Failure",
        "arguments": [
            "SampleHadoopJobArgument1"
        ]
    }
}
```

The following table describes the JSON properties used in the JSON definition:

| Property              | Description                              | Required |
| --------------------- | ---------------------------------------- | -------- |
| name                  | Name of the activity in the pipeline.    | Yes      |
| description           | Text describing what the activity does.  | No       |
| type                  | For Spark Activity, the activity type is HDInsightSpark. | Yes      |
| linkedServiceName     | Name of the HDInsight Spark Linked Service on which the Spark program runs. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article. | Yes      |
| SparkJobLinkedService | The Azure Storage linked service that holds the Spark job file, dependencies, and logs.  If you do not specify a value for this property, the storage associated with HDInsight cluster is used. The value of this property can only be an Azure Storage linked service. | No       |
| rootPath              | The Azure Blob container and folder that contains the Spark file. The file name is case-sensitive. Refer to folder structure section (next section) for details about the structure of this folder. | Yes      |
| entryFilePath         | Relative path to the root folder of the Spark code/package. The entry file must be either a Python file or a .jar file. | Yes      |
| className             | Application's Java/Spark main class      | No       |
| arguments             | A list of command-line arguments to the Spark program. | No       |
| proxyUser             | The user account to impersonate to execute the Spark program | No       |
| sparkConfig           | Specify values for Spark configuration properties listed in the topic: [Spark Configuration - Application properties](https://spark.apache.org/docs/latest/configuration.html#available-properties). | No       |
| getDebugInfo          | Specifies when the Spark log files are copied to the Azure storage used by HDInsight cluster (or) specified by sparkJobLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No       |

## Folder structure
Spark jobs are more extensible than Pig/Hive jobs. For Spark jobs, you can provide multiple dependencies such as jar packages (placed in the java CLASSPATH), python files (placed on the PYTHONPATH), and any other files.

Create the following folder structure in the Azure Blob storage referenced by the HDInsight linked service. Then, upload dependent files to the appropriate sub folders in the root folder represented by **entryFilePath**. For example, upload python files to the pyFiles subfolder and jar files to the jars subfolder of the root folder. At runtime, Data Factory service expects the following folder structure in the Azure Blob storage:     

| Path                  | Description                              | Required | Type   |
| --------------------- | ---------------------------------------- | -------- | ------ |
| `.` (root)            | The root path of the Spark job in the storage linked service | Yes      | Folder |
| &lt;user defined &gt; | The path pointing to the entry file of the Spark job | Yes      | File   |
| ./jars                | All files under this folder are uploaded and placed on the java classpath of the cluster | No       | Folder |
| ./pyFiles             | All files under this folder are uploaded and placed on the PYTHONPATH of the cluster | No       | Folder |
| ./files               | All files under this folder are uploaded and placed on executor working directory | No       | Folder |
| ./archives            | All files under this folder are uncompressed | No       | Folder |
| ./logs                | The folder that contains logs from the Spark cluster. | No       | Folder |

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
## Next steps
See the following articles that explain how to transform data in other ways: 

* [U-SQL activity](transform-data-using-data-lake-analytics.md)
* [Hive activity](transform-data-using-hadoop-hive.md)
* [Pig activity](transform-data-using-hadoop-pig.md)
* [MapReduce activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming activity](transform-data-using-hadoop-streaming.md)
* [Spark activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Machine Learning Batch Execution activity](transform-data-using-machine-learning.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
