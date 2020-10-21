---
title: Troubleshoot mapping data flows
description: Learn how to troubleshoot data flow issues in Azure Data Factory.
services: data-factory
ms.author: makromer
author: kromerm
ms.reviewer: daperlov
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 09/11/2020
---
# Troubleshoot mapping data flows in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article explores common troubleshooting methods for mapping data flows in Azure Data Factory.

## Common errors and messages

### Error code: DF-Executor-SourceInvalidPayload
- **Message**: Data preview, debug, and pipeline data flow execution failed because container does not exist
- **Causes**: When dataset contains a container that does not exist in the storage
- **Recommendation**: Make sure that the container referenced in your dataset exists or accessible.

### Error code: DF-Executor-SystemImplicitCartesian

- **Message**: Implicit cartesian product for INNER join is not supported, use CROSS JOIN instead. Columns used in join should create a unique key for rows.
- **Causes**: Implicit cartesian product for INNER join between logical plans is not supported. If the columns used in the join create the unique key, at least one column from both sides of the relationship are required.
- **Recommendation**: For non-equality based joins you have to opt for CUSTOM CROSS JOIN.

### Error code: DF-Executor-SystemInvalidJson

- **Message**: JSON parsing error, unsupported encoding or multiline
- **Causes**: Possible issues with the JSON file: unsupported encoding, corrupt bytes, or using JSON source as single document on many nested lines
- **Recommendation**: Verify the JSON file's encoding is supported. On the Source transformation that is using a JSON dataset, expand 'JSON Settings' and turn on 'Single Document'.
 
### Error code: DF-Executor-BroadcastTimeout

- **Message**: Broadcast join timeout error, make sure broadcast stream produces data within 60 secs in debug runs and 300 secs in job runs
- **Causes**: Broadcast has a default timeout of 60 secs in debug runs and 300 seconds in job runs. Stream chosen for broadcast seems too large to produce data within this limit.
- **Recommendation**: Check the Optimize tab on your data flow transformations for Join, Exists, and Lookup. The default option for Broadcast is "Auto". If "Auto" is set, or if you are manually setting the left or right side to broadcast under "Fixed", then you can either set a larger Azure Integration Runtime configuration, or switch off broadcast. The recommended approach for best performance in data flows is to allow Spark to broadcast using "Auto" and use a Memory Optimized Azure IR.

If you are executing the data flow in a debug test execution from a debug pipeline run, you may run into this condition more frequently. This is because ADF throttles the broadcast timeout to 60 secs in order to maintain a faster debug experience. If you would like to extend that to the 300-seconds timeout from a triggered run, you can use the Debug > Use Activity Runtime option to utilize the Azure IR defined in your Execute Data Flow pipeline activity.

### Error code: DF-Executor-Conversion

- **Message**: Converting to a date or time failed due to an invalid character
- **Causes**: Data is not in the expected format
- **Recommendation**: Use the correct data type

### Error code: DF-Executor-InvalidColumn

- **Message**: Column name needs to be specified in the query, set an alias if using a SQL function
- **Causes**: No column name was specified
- **Recommendation**: Set an alias if using a SQL function such as min()/max(), etc.

 ### Error code: DF-Executor-DriverError
- **Message**: INT96 is legacy timestamp type which is not supported by ADF Dataflow. Please consider upgrading the column type to the latest types.
- **Causes**: Driver error
- **Recommendation**: INT96 is legacy timestamp type, which is not supported by ADF Dataflow. Consider upgrading the column type to the latest types.

 ### Error code: DF-Executor-BlockCountExceedsLimitError
- **Message**: The uncommitted block count cannot exceed the maximum limit of 100,000 blocks. Check blob configuration.
- **Causes**: There can be a maximum of 100,000 uncommitted blocks in a blob.
- **Recommendation**: Contact Microsoft product team regarding this issue for more details

 ### Error code: DF-Executor-PartitionDirectoryError
- **Message**: The specified source path has either multiple partitioned directories (for e.g. <Source Path>/<Partition Root Directory 1>/a=10/b=20, <Source Path>/<Partition Root Directory 2>/c=10/d=30) or partitioned directory with other file or non-partitioned directory (for example <Source Path>/<Partition Root Directory 1>/a=10/b=20, <Source Path>/Directory 2/file1), remove partition root directory from source path and read it through separate source transformation.
- **Causes**: Source path has either multiple partitioned directories or partitioned directory with other file or non-partitioned directory.
- **Recommendation**: Remove partitioned root directory from source path and read it through separate source transformation.

 ### Error code: DF-Executor-OutOfMemoryError
- **Message**: Cluster ran into out of memory issue during execution, please retry using an integration runtime with bigger core count and/or memory optimized compute type
- **Causes**: Cluster is running out of memory
- **Recommendation**: Debug clusters are meant for development purposes. Leverage data sampling, appropriate compute type, and size to run the payload. Refer to the [mapping data flow performance guide](concepts-data-flow-performance.md) for tuning to achieve best performance.

 ### Error code: DF-Executor-illegalArgument
- **Message**: Please make sure that the access key in your Linked Service is correct
- **Causes**: Account Name or Access Key incorrect
- **Recommendation**: Ensure the account name or access key specified in your linked service is correct. 

 ### Error code: DF-Executor-InvalidType
- **Message**: Please make sure that the type of parameter matches with type of value passed in. Passing float parameters from pipelines isn't currently supported.
- **Causes**: Incompatible data types between declared type and actual parameter value
- **Recommendation**: Check that your parameter values passed into a data flow match the declared type.

 ### Error code: DF-Executor-ColumnUnavailable
- **Message**: Column name used in expression is unavailable or invalid
- **Causes**: Invalid or unavailable column name used in expressions
- **Recommendation**: Check column name(s) used in expressions

 ### Error code: DF-Executor-ParseError
- **Message**: Expression cannot be parsed
- **Causes**: Expression has parsing errors due to formatting
- **Recommendation**: Check formatting in expression

### Error code: GetCommand OutputAsync failed

- **Message**: During Data Flow debug and data preview: GetCommand OutputAsync failed with ...
- **Causes**: This is a back-end service error. You can retry the operation and also restart your debug session.
- **Recommendation**: If retry and restart do not resolve the issue, contact customer support.

### Error code: Hit unexpected exception and execution failed

- **Message**: During Data Flow activity execution: Hit unexpected exception and execution failed.
- **Causes**: This is a back-end service error. You can retry the operation and also restart your debug session.
- **Recommendation**: If retry and restart do not resolve the issue, contact customer support.

### Error code: Debug data preview No Output Data on Join

- **Message**: There are a high number of null values or missing values which may be caused by having too few rows sampled. Try updating the debug row limit and refreshing the data.
- **Causes**: Join condition did not match any rows or resulted in high number of NULLs during data preview.
- **Recommendation**: Go to Debug Settings and increase the number of rows in the source row limit. Make sure that you have select an Azure IR with a large enough data flow cluster to handle more data.


## General troubleshooting guidance

1. Check the status of your dataset connections. In each Source and Sink transformation, visit the Linked Service for each dataset that you are using and test connections.
1. Check the status of your file and table connections from the data flow designer. Switch on Debug and click on Data Preview on your Source transformations to ensure that you are able to access your data.
1. If everything looks good from data preview, go into the Pipeline designer and put your data flow in a pipeline activity. Debug the pipeline for an end-to-end test.

## Next steps

For more troubleshooting help, try these resources:
*  [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory/bg-p/AzureDataFactoryBlog)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://www.youtube.com/channel/UC2S0k7NeLcEm5_IhHUwpN0g/videos)
*  [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-data-factory.html)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
*  [ADF mapping data flows Performance Guide](concepts-data-flow-performance.md)
