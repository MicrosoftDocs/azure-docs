---
title: Transform data using Hive Activity in Azure Data Factory | Microsoft Docs
description: Learn how you can use the Hive Activity in an Azure data factory to run Hive queries on an on-demand/your own HDInsight cluster.
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
# Transform data using Hive Activity in Azure Data Factory 

The HDInsight Hive activity in a Data Factory [pipeline](concepts-pipelines-activities.md) executes Hive queries on [your own](compute-linked-services.md#azure-hdinsight-linked-service) or [on-demand](compute-linked-services.md#azure-hdinsight-on-demand-linked-service)  HDInsight cluster. This article builds on the [data transformation activities](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!NOTE] 
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](introduction.md) and do the tutorial: [Tutorial: transform data](tutorial-transform-data-using-spark-dot-net.md) before reading this article. 

## Syntax

```json
{
    "name": "Hive Activity",
    "description": "description",
    "type": "HDInsightHive",
    "linkedServiceName": {
        "referenceName": "MyHDInsightLinkedService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "scriptLinkedService": {
            "referenceName": "MyAzureStorageLinkedService",
            "type": "LinkedServiceReference"
        },
        "scriptPath": "MyAzureStorage\\HiveScripts\\MyHiveSript.hql",
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
| Property            | Description                              | Required |
| ------------------- | ---------------------------------------- | -------- |
| name                | Name of the activity                     | Yes      |
| description         | Text describing what the activity is used for | No       |
| type                | For Hive Activity, the activity type is HDinsightHive | Yes      |
| linkedServiceName   | Reference to the HDInsight cluster registered as a linked service in Data Factory | Yes      |
| scriptLinkedService | Reference to an Azure Storage Linked Service used to store the Hive script to be executed. If you don't specify this Linked Service, the Azure Storage Linked Service defined in the HDInsight Linked Service is used. | No       |
| scriptPath          | Provide the path to the script file stored in the Azure Storage referred by scriptLinkedService. The file name is case-sensitive. | Yes      |
| getDebugInfo        | Specifies when the log files are copied to the Azure Storage used by HDInsight cluster (or) specified by scriptLinkedService. Allowed values: None, Always, or Failure. Default value: None. | No       |
| arguments           | Specifies an array of arguments for a Hadoop job. The arguments are passed as command-line arguments to each task. | No       |
| defines             | Specify parameters as key/value pairs for referencing within the Hive script. | No       |

## Next steps
See the following articles that explain how to transform data in other ways: 

* [U-SQL Activity](transform-data-using-data-lake-analytics.md)
* [Pig Activity](transform-data-using-hadoop-pig.md)
* [MapReduce Activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming Activity](transform-data-using-hadoop-streaming.md)
* [Spark Activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Machine Learning Bach Execution Activity](transform-data-using-machine-learning.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)

