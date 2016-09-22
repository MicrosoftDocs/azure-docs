Azure Data Factory supports the following transformation activities that can be added to [pipelines](data-factory-create-pipelines.md) either individually or chained with another activity.

Data transformation activity |  Compute environment 
:----------------------- | :--------------------
[Hive](data-factory-hive-activity.md) | HDInsight [Hadoop] 
[Pig](data-factory-pig-activity.md) | HDInsight [Hadoop]  
[MapReduce](data-factory-map-reduce.md) | HDInsight [Hadoop]  
[Hadoop Streaming](data-factory-hadoop-streaming-activity.md) | HDInsight [Hadoop]
[Machine Learning activities: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) | Azure VM 
[Stored Procedure](data-factory-stored-proc-activity.md) | Azure SQL, Azure SQL Data Warehouse, or SQL Server |
[Data Lake Analytics U-SQL](data-factory-usql-activity.md) | Azure Data Lake Analytics 
[DotNet](data-factory-use-custom-activities.md) | HDInsight [Hadoop] or Azure Batch
   
> [AZURE.NOTE] 
> You can use MapReduce activity to run Spark programs on your HDInsight Spark cluster. See [Invoke Spark programs from Azure Data Factory](data-factory-spark.md) for details.
> You can create a custom activity to run R scripts on your HDInsight cluster with R installed. See [Run R Script using Azure Data Factory](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/RunRScriptUsingADFSample).