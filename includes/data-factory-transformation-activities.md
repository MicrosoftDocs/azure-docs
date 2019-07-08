---
author: linda33wj
ms.service: data-factory
ms.topic: include
ms.date: 11/09/2018
ms.author: jingwang
---
Azure Data Factory supports the following transformation activities that can be added to pipelines either individually or chained with another activity.

| Data transformation activity | Compute environment |
|:--- |:--- |
| [Hive](../articles/data-factory/v1/data-factory-hive-activity.md) |HDInsight [Hadoop] |
| [Pig](../articles/data-factory/v1/data-factory-pig-activity.md) |HDInsight [Hadoop] |
| [MapReduce](../articles/data-factory/v1/data-factory-map-reduce.md) |HDInsight [Hadoop] |
| [Hadoop Streaming](../articles/data-factory/v1/data-factory-hadoop-streaming-activity.md) |HDInsight [Hadoop] |
| [Spark](../articles/data-factory/v1/data-factory-spark.md) | HDInsight [Hadoop] |
| [Machine Learning activities: Batch Execution and Update Resource](../articles/data-factory/v1/data-factory-azure-ml-batch-execution-activity.md) |Azure VM |
| [Stored Procedure](../articles/data-factory/v1/data-factory-stored-proc-activity.md) |Azure SQL, Azure SQL Data Warehouse, or SQL Server |
| [Data Lake Analytics U-SQL](../articles/data-factory/v1/data-factory-usql-activity.md) |Azure Data Lake Analytics |
| [DotNet](../articles/data-factory/v1/data-factory-use-custom-activities.md) |HDInsight [Hadoop] or Azure Batch |

> [!NOTE]
> You can use MapReduce activity to run Spark programs on your HDInsight Spark cluster. See [Invoke Spark programs from Azure Data Factory](../articles/data-factory/v1/data-factory-spark.md) for details.
> You can create a custom activity to run R scripts on your HDInsight cluster with R installed. See [Run R Script using Azure Data Factory](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample).
> 
> 

