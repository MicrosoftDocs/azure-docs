---
title: Troubleshoot mapping data flows
description: Learn how to troubleshoot data flow issues in Azure Data Factory.
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

## Common error codes and messages 

### Error code: DF-Executor-SourceInvalidPayload
- **Message**: Data preview, debug, and pipeline data flow execution failed because container does not exist
- **Causes**: When dataset contains a container that does not exist in the storage
- **Recommendation**: Make sure that the container referenced in your dataset exists or accessible.

### Error code: DF-Executor-SystemImplicitCartesian

- **Message**: Implicit cartesian product for INNER join is not supported, use CROSS JOIN instead. Columns used in join should create a unique key for rows.
- **Causes**: Implicit cartesian product for INNER join between logical plans is not supported. If the columns are used in the join, then the unique key with at least one column from both sides of the relationship is required.
- **Recommendation**: For non-equality based joins you have to opt for CUSTOM CROSS JOIN.

### Error code: DF-Executor-SystemInvalidJson

- **Message**: JSON parsing error, unsupported encoding or multiline
- **Causes**: Possible issues with the JSON file: unsupported encoding, corrupt bytes, or using JSON source as single document on many nested lines
- **Recommendation**: Verify the JSON file's encoding is supported. On the Source transformation that is using a JSON dataset, expand 'JSON Settings' and turn on 'Single Document'.
 
### Error code: DF-Executor-BroadcastTimeout

- **Message**: Broadcast join timeout error, make sure broadcast stream produces data within 60 secs in debug runs and 300 secs in job runs
- **Causes**: Broadcast has a default timeout of 60 secs in debug runs and 300 seconds in job runs. Stream chosen for broadcast seems too large to produce data within this limit.
- **Recommendation**: Check the Optimize tab on your data flow transformations for Join, Exists, and Lookup. The default option for Broadcast is "Auto". If "Auto" is set, or if you are manually setting the left or right side to broadcast under "Fixed", then you can either set a larger Azure Integration Runtime configuration, or switch off broadcast. The recommended approach for best performance in data flows is to allow Spark to broadcast using "Auto" and use a Memory Optimized Azure IR. If you are executing the data flow in a debug test execution from a debug pipeline run, you may run into this condition more frequently. This is because ADF throttles the broadcast timeout to 60 secs in order to maintain a faster debug experience. If you would like to extend that to the 300-seconds timeout from a triggered run, you can use the Debug > Use Activity Runtime option to utilize the Azure IR defined in your Execute Data Flow pipeline activity.

- **Message**: Broadcast join timeout error, you can choose 'Off' of broadcast option in join/exists/lookup transformation to avoid this issue. If you intend to broadcast join option to improve performance then make sure broadcast stream can produce data within 60 secs in debug runs and 300 secs in job runs.
- **Causes**: Broadcast has a default timeout of 60 secs in debug runs and 300 secs in job runs. On broadcast join, the stream chosen for broadcast seems too large to produce data within this limit. If a broadcast join is not used, the default broadcast done by dataflow can reach the same limit
- **Recommendation**: Turn off the broadcast option or avoid broadcasting large data streams where the processing can take more than 60 secs. Choose a smaller stream to broadcast instead. Large SQL/DW tables and source files are typically bad candidates. In the absence of a broadcast join, use a larger cluster if the error occurs.

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

### Error code: DF-Executor-InvalidType
- **Message**: Please make sure that the type of parameter matches with type of value passed in. Passing float parameters from pipelines isn't currently supported.
- **Causes**: Incompatible data types between declared type and actual parameter value
- **Recommendation**: Please check that your parameter values passed into a data flow match the declared type.

### Error code: DF-Executor-ColumnUnavailable
- **Message**: Column name used in expression is unavailable or invalid
- **Causes**: Invalid or unavailable column name used in expressions
- **Recommendation**: Please check column name(s) used in expressions

### Error code: DF-Executor-ParseError
- **Message**: Expression cannot be parsed
- **Causes**: Expression has parsing errors due to formatting
- **Recommendation**: Please check formatting in expression.

### Error code: DF-Executor-SystemImplicitCartesian
- **Message**: Implicit cartesian product for INNER join is not supported, use CROSS JOIN instead. Columns used in join should create a unique key for rows.
- **Causes**: Implicit cartesian product for INNER join between logical plans is not supported. If the columns used in the join creates the unique key
- **Recommendation**: For non-equality based joins you have to opt for CROSS JOIN.

### Error code: DF-Executor-SystemInvalidJson
- **Message**: JSON parsing error, unsupported encoding or multiline
- **Causes**: Possible issues with the JSON file: unsupported encoding, corrupt bytes, or using JSON source as single document on many nested lines
- **Recommendation**: Verify the JSON file's encoding is supported. On the Source transformation that is using a JSON dataset, expand 'JSON Settings' and turn on 'Single Document'.



### Error code: DF-Executor-Conversion
- **Message**: Converting to a date or time failed due to an invalid character
- **Causes**: Data is not in the expected format
- **Recommendation**:  Please use  the correct data type.


### Error code: DF-Executor-BlockCountExceedsLimitError
- **Message**: The uncommitted block count cannot exceed the maximum limit of 100,000 blocks. Check blob configuration.
- **Causes**: There can be a maximum of 100,000 uncommitted blocks in a blob.
- **Recommendation**: Please contact Microsoft product team regarding this issue for more details

### Error code: DF-Executor-PartitionDirectoryError
- **Message**: The specified source path has either multiple partitioned directories (for e.g. *<Source Path>/<Partition Root Directory 1>/a=10/b=20, <Source Path>/<Partition Root Directory 2>/c=10/d=30*) or partitioned directory with other file or non-partitioned directory (for e.g. *<Source Path>/<Partition Root Directory 1>/a=10/b=20, <Source Path>/Directory 2/file1*), remove partition root directory from source path and read it through separate source transformation.
- **Causes**: Source path has either multiple partitioned directories or partitioned directory with other file or non-partitioned directory.
- **Recommendation**: Remove partitioned root directory from source path and read it through separate source transformation.

### Error code: GetCommand OutputAsync failed
- **Message**: During Data Flow debug and data preview: GetCommand OutputAsync failed with ...
- **Causes**: This is a back-end service error. You can retry the operation and also restart your debug session.
- **Recommendation**: If retry and restart do not resolve the issue, contact customer support. 

### Error code: DF-Executor-OutOfMemoryError
 
- **Message**: Cluster ran into out of memory issue during execution, please retry using an integration runtime with bigger core count and/or memory optimized compute type
- **Causes**: Cluster is running out of memory.
- **Recommendation**: Debug clusters are meant for development purposes. Leverage data sampling appropriate compute type and size to run the payload. Refer to [Dataflow Performance Guide](./concepts-data-flow-performance.md) for tuning the dataflows for best performance.

### Error code: DF-Executor-illegalArgument
- **Message**: Please make sure that the access key in your Linked Service is correct.
- **Causes**: Account Name or Access Key is incorrect.
- **Recommendation**: Please supply right account name or access key.

- **Message**: Please make sure that the access key in your Linked Service is correct
- **Causes**: Account Name or Access Key incorrect
- **Recommendation**: Ensure the account name or access key specified in your linked service is correct. 

### Error code: DF-Executor-InvalidType
- **Message**: Please make sure that the type of parameter matches with type of value passed in. Passing float parameters from pipelines isn't currently supported.
- **Causes**: Incompatible data types between declared type and actual parameter value
- **Recommendation**: Please supply right data types.

### Error code: DF-Executor-ColumnUnavailable
- **Message**: Column name used in expression is unavailable or invalid.
- **Causes**: Invalid or unavailable column name is used in expressions.
- **Recommendation**: Please check column name(s) used in expressions.


### Error code: DF-Executor-ParseError
- **Message**: Expression cannot be parsed.
- **Causes**: Expression has parsing errors due to formatting.
- **Recommendation**: Please check formatting in expression.


 ### Error code: DF-Executor-OutOfDiskSpaceError
- **Message**: Internal server error
- **Causes**: Cluster is running out of disk space.
- **Recommendation**: Please retry the pipeline. If problem persists, contact customer support.


 ### Error code: DF-Executor-StoreIsNotDefined
- **Message**: The store configuration is not defined. This error is potentially caused by invalid parameter assignment in the pipeline.
- **Causes**: Undetermined
- **Recommendation**: Please check parameter value assignment in the pipeline. Parameter expression may contain invalid characters.

### Error code: DF-Excel-InvalidConfiguration
- **Message**: Excel sheet name or index is required.
- **Causes**: Undetermined
- **Recommendation**: Please check parameter value and specify sheet name or index to read Excel data.

- **Message**: Excel sheet name and index cannot exist at the same time.
- **Causes**: Undetermined
- **Recommendation**: Please check parameter value and specify sheet name or index to read Excel data.

- **Message**: Invalid range is provided.
- **Causes**: Undetermined
- **Recommendation**: Please check parameter value and specify valid range by reference: [Excel properties](./format-excel.md#dataset-properties).

- **Message**: Invalid excel file is provided while only .xlsx and .xls are supported
- **Causes**: Undetermined
- **Recommendation**: Make sure Excel file extension is either .xlsx or .xls.


 ### Error code: DF-Excel-InvalidData
- **Message**: Excel worksheet does not exist.
- **Causes**: Undetermined
- **Recommendation**: Please check parameter value and specify valid sheet name or index to read Excel data.

- **Message**: Reading excel files with different schema is not supported now.
- **Causes**: Undetermined
- **Recommendation**: Use correct Excel file.

- **Message**: Data type is not supported.
- **Causes**: Undetermined
- **Recommendation**: Please use Excel file right data types.

### Error code: 4502
- **Message**: There are substantial concurrent MappingDataflow executions which are causing failures due to throttling under Integration Runtime.
- **Causes**: A lot of Dataflow Activity runs are going on concurrently on the Integration Runtime. Please learn more about the [Azure Data Factory limits](../azure-resource-manager/management/azure-subscription-service-limits.md#data-factory-limits).
- **Recommendation**: In case you are looking to run more Data flow activities in parallel, please distribute those on multiple integration runtimes.


### Error code: InvalidTemplate
- **Message**: The pipeline expression cannot be evaluated.
- **Causes**: Pipeline expression passed in the dataflow activity is not being processed correctly because of syntax error.
- **Recommendation**: Please check your activity in activity monitoring to verify the expression.

### Error code: 2011
- **Message**: The activity was running on Azure Integration Runtime and failed to decrypt the credential of data store or compute connected via a Self-hosted Integration Runtime. Please check the configuration of linked services associated with this activity, and make sure to use the proper integration runtime type.
- **Causes**: Data flow does not support the linked services with self-hosted integration runtime.
- **Recommendation**: Please configure Data flow to run on integration runtime with 'Managed Virtual Network'.

## Miscellaneous troubleshooting tips
- **Issue**: Hit unexpected exception and execution failed
	- **Message**: During Data Flow activity execution: Hit unexpected exception and execution failed.
	- **Causes**: This is a back-end service error. You can retry the operation and also restart your debug session.
	- **Recommendation**: If retry and restart do not resolve the issue, contact customer support.

-  **Issue**: Debug data preview No Output Data on Join
	- **Message**: There are a high number of null values or missing values which may be caused by having too few rows sampled. Try updating the debug row limit and refreshing the data.
	- **Causes**: Join condition did not match any rows or resulted in high number of NULLs during data preview.
	- **Recommendation**: Go to Debug Settings and increase the number of rows in the source row limit. Make sure that you have select an Azure IR with a large enough data flow cluster to handle more data.
	
- **Issue**: Validation Error at Source with multiline CSV files 
	- **Message**: You might see one of the following error messages:
		- The last column is null or missing.
		- Schema validation at source fails.
		- Schema import fails to show correctly in the UX and the last column has a new line character in the name.
	- **Causes**: In the Mapping data flow, currently, the multiline CSV source does not work with the \r\n as row delimiter. Sometimes extra lines at carriage returns break source values. 
	- **Recommendation**: Either generate the file at the source with \n as row delimiter rather than \r\n. Or, use Copy Activity to convert CSV file with \r\n to \n as a row delimiter.

## General troubleshooting guidance
1. Check the status of your dataset connections. In each Source and Sink transformation, visit the Linked Service for each dataset that you are using and test connections.
2. Check the status of your file and table connections from the data flow designer. Switch on Debug and click on Data Preview on your Source transformations to ensure that you are able to access your data.
3. If everything looks good from data preview, go into the Pipeline designer and put your data flow in a pipeline activity. Debug the pipeline for an end-to-end test.

## Next steps

For more help with troubleshooting, try the following resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Stack overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)