---
title: Transform data using Spark activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data by running Spark programs from an Azure Data Factory or Synapse Analytics pipeline using the Spark Activity. 
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.custom: synapse
ms.date: 08/10/2023
---

# Transform data using Spark activity in Azure Data Factory and Synapse Analytics
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-spark.md)
> * [Current version](transform-data-using-spark.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The Spark activity in a data factory and Synapse [pipelines](concepts-pipelines-activities.md) executes a Spark program on [your own](compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](compute-linked-services.md#azure-hdinsight-on-demand-linked-service)  HDInsight cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities. When you use an on-demand Spark linked service, the service automatically creates a Spark cluster for you just-in-time to process the data and then deletes the cluster once the processing is complete. 

## Add a Spark activity to a pipeline with UI

To use a Spark activity to a pipeline, complete the following steps:

1. Search for _Spark_ in the pipeline Activities pane, and drag a Spark activity to the pipeline canvas.
1. Select the new Spark activity on the canvas if it is not already selected.
1. Select the  **HDI Cluster** tab to select or create a new linked service to an HDInsight cluster that will be used to execute the Spark activity.

   :::image type="content" source="media/transform-data-using-spark/spark-activity.png" alt-text="Shows the UI for a Spark activity.":::

1. Select the **Script / Jar** tab to select or create a new job linked service to an Azure Storage account that will host your script.  Specify a path to the file to be executed there.  You can also configure advanced details including a proxy user, debugging configuration, and arguments and Spark configuration parameters to be passed to the script.

   :::image type="content" source="media/transform-data-using-spark/spark-script-configuration.png" alt-text="Shows the UI for the Script / Jar tab for a Spark activity.":::

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
| SparkJobLinkedService | The Azure Storage linked service that holds the Spark job file, dependencies, and logs. Only **[Azure Blob Storage](./connector-azure-blob-storage.md)** and **[ADLS Gen2](./connector-azure-data-lake-storage.md)** linked services are supported here. If you do not specify a value for this property, the storage associated with HDInsight cluster is used. The value of this property can only be an Azure Storage linked service. | No       |
| rootPath              | The Azure Blob container and folder that contains the Spark file. The file name is case-sensitive. Refer to folder structure section (next section) for details about the structure of this folder. | Yes      |
| entryFilePath         | Relative path to the root folder of the Spark code/package. The entry file must be either a Python file or a .jar file. | Yes      |
| className             | Application's Java/Spark main class      | No       |
| arguments             | A list of command-line arguments to the Spark program. | No       |
| proxyUser             | The user account to impersonate to execute the Spark program | No       |
| sparkConfig           | Specify values for Spark configuration properties listed in the topic: [Spark Configuration - Application properties](https://spark.apache.org/docs/latest/configuration.html#available-properties). | No       |
| getDebugInfo          | Specifies when the Spark log files are copied to the Azure storage used by HDInsight cluster (or) specified by sparkJobLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No       |

## Folder structure
Spark jobs are more extensible than Pig/Hive jobs. For Spark jobs, you can provide multiple dependencies such as jar packages (placed in the Java CLASSPATH), Python files (placed on the PYTHONPATH), and any other files.

Create the following folder structure in the Azure Blob storage referenced by the HDInsight linked service. Then, upload dependent files to the appropriate sub folders in the root folder represented by **entryFilePath**. For example, upload Python files to the pyFiles subfolder and jar files to the jars subfolder of the root folder. At runtime, the service expects the following folder structure in the Azure Blob storage:     

| Path                  | Description                              | Required | Type   |
| --------------------- | ---------------------------------------- | -------- | ------ |
| `.` (root)            | The root path of the Spark job in the storage linked service | Yes      | Folder |
| &lt;user defined &gt; | The path pointing to the entry file of the Spark job | Yes      | File   |
| ./jars                | All files under this folder are uploaded and placed on the Java classpath of the cluster | No       | Folder |
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
	
	archives
	
	pyFiles

SparkJob2
	main.py
	pyFiles
		scrip1.py
		script2.py
	logs
	
	archives
	
	jars
	
	files
	
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
* [Stored procedure activity](transform-data-using-stored-procedure.md)
