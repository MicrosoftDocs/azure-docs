---
title: Transform data using Hadoop Streaming Activity in Azure Data Factory | Microsoft Docs
description: Explains how to use Hadoop Streaming Activity in Azure Data Factory to transform data by running Hadoop Streaming programs on a Hadoop cluster. 
services: data-factory
documentationcenter: ''
author: shengcmsft
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: shengc

---
# Transform data using Hadoop Streaming Activity in Azure Data Factory

The HDInsight Streaming Activity in a Data Factory [pipeline](concepts-pipelines-activities.md) executes Hadoop Streaming programs on [your own](compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](compute-linked-services.md#azure-hdinsight-on-demand-linked-service) HDInsight cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!NOTE] 
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](introduction.md) and do the tutorial: [Tutorial: transform data](tutorial-transform-data-using-spark-dot-net.md) before reading this article. 

## JSON sample
```json
{
    "name": "Streaming Activity",
    "description": "Description",
    "type": "HDInsightStreaming",
    "linkedServiceName": {
        "referenceName": "MyHDInsightLinkedService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "mapper": "MyMapper.exe",
        "reducer": "MyReducer.exe",
        "combiner": "MyCombiner.exe",
        "fileLinkedService": {
            "referenceName": "MyAzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "filePaths": [
            "<containername>/example/apps/MyMapper.exe",
            "<containername>/example/apps/MyReducer.exe",
            "<containername>/example/apps/MyCombiner.exe"
        ],
        "input": "wasb://<containername>@<accountname>.blob.core.windows.net/example/input/MapperInput.txt",
        "output": "wasb://<containername>@<accountname>.blob.core.windows.net/example/output/ReducerOutput.txt",
        "commandEnvironment": [
            "CmdEnvVarName=CmdEnvVarValue"
        ],
        "getDebugInfo": "Failure",
        "arguments": [
            "SampleHadoopJobArgument1"
        ],
        "defines": {
            "param1": "param1Value"
        }
    }
}
```

## Syntax details

| Property          | Description                              | Required |
| ----------------- | ---------------------------------------- | -------- |
| name              | Name of the activity                     | Yes      |
| description       | Text describing what the activity is used for | No       |
| type              | For Hadoop Streaming Activity, the activity type is HDInsightStreaming | Yes      |
| linkedServiceName | Reference to the HDInsight cluster registered as a linked service in Data Factory | Yes      |
| mapper            | Specifies the name of the mapper executable | Yes      |
| reducer           | Specifies the name of the reducer executable | Yes      |
| combiner          | Specifies the name of the combiner executable | No       |
| fileLinkedService | Reference to an Azure Storage Linked Service used to store the Mapper, Combiner, and Reducer programs to be executed. If you don't specify this Linked Service, the Azure Storage Linked Service defined in the HDInsight Linked Service is used. | No       |
| filePath          | Provide an array of path to the Mapper, Combiner, and Reducer programs stored in the Azure Storage referred by fileLinkedService. The path is case-sensitive. | Yes      |
| input             | Specifies the WASB path to the input file for the Mapper. | Yes      |
| output            | Specifies the WASB path to the output file for the Reducer. | Yes      |
| getDebugInfo      | Specifies when the log files are copied to the Azure Storage used by HDInsight cluster (or) specified by scriptLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No       |
| arguments         | Specifies an array of arguments for a Hadoop job. The arguments are passed as command-line arguments to each task. | No       |
| defines           | Specify parameters as key/value pairs for referencing within the Hive script. | No       | 

## Next steps
See the following articles that explain how to transform data in other ways: 

* [U-SQL Activity](transform-data-using-data-lake-analytics.md)
* [Hive Activity](transform-data-using-hadoop-hive.md)
* [Pig Activity](transform-data-using-hadoop-pig.md)
* [MapReduce Activity](transform-data-using-hadoop-map-reduce.md)
* [Spark Activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Machine Learning Bach Execution Activity](transform-data-using-machine-learning.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
