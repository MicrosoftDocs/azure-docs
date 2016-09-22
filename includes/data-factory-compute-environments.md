The following table provides a list of compute environments supported by Data Factory and the activities that can run on them. 

| Compute environment | activities |
| ------------------- | -------- | 
| [On-demand HDInsight cluster] or [your own HDInsight cluster] | [DotNet](../articles/data-factory/data-factory-use-custom-activities.md), [Hive](../articles/data-factory/data-factory-hive-activity.md), [Pig](../articles/data-factory/data-factory-pig-activity.md), [MapReduce](../articles/data-factory/data-factory-map-reduce.md), [Hadoop Streaming](../articles/data-factory/data-factory-hadoop-streaming-activity.md) | 
| [Azure Batch] | [DotNet](../articles/data-factory/data-factory-use-custom-activities.md) |  
| [Azure Machine Learning] | [Machine Learning activities: Batch Execution and Update Resource](../articles/data-factory/data-factory-azure-ml-batch-execution-activity.md) |
| [Azure Data Lake Analytics] | [Data Lake Analytics U-SQL](../articles/data-factory/data-factory-usql-activity.md)
[Azure SQL], [Azure SQL Data Warehouse], [SQL Server] | [Stored Procedure](../articles/data-factory/data-factory-stored-proc-activity.md)