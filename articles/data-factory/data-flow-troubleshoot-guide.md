---
title: Troubleshoot data flows
description: Learn how to troubleshoot data flow issues in Azure Data Factory.
services: data-factory
ms.author: makromer
author: kromerm
manager: anandsub
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 04/27/2020
---
# Troubleshoot data flows in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article explores common troubleshooting methods for data flows in Azure Data Factory.

## Common errors and messages

### Error code: DF-Executor-SourceInvalidPayload
- **Message**: Data preview, debug, and pipeline data flow execution failed because container does not exist
- **Causes**: When dataset contains a container that does not exist in the storage
- **Recommendation**: Make sure that the container referenced in your dataset exists or accessible.

### Error code: DF-Executor-SystemImplicitCartesian

- **Message**: Implicit cartesian product for INNER join is not supported, use CROSS JOIN instead. Columns used in join should create a unique key for rows.
- **Causes**: Implicit cartesian product for INNER join between logical plans is not supported. If the columns used in the join creates the unique key, at least one column from both sides of the relationship are required.
- **Recommendation**: For non-equality based joins you have to opt for CUSTOM CROSS JOIN.

### Error code: DF-Executor-SystemInvalidJson

- **Message**: JSON parsing error, unsupported encoding or multiline
- **Causes**: Possible issues with the JSON file: unsupported encoding, corrupt bytes, or using JSON source as single document on many nested lines
- **Recommendation**: Verify the JSON file's encoding is supported. On the Source transformation that is using a JSON dataset, expand 'JSON Settings' and turn on 'Single Document'.
 
### Error code: DF-Executor-BroadcastTimeout

- **Message**: Broadcast join timeout error, make sure broadcast stream produces data within 60 secs in debug runs and 300 secs in job runs
- **Causes**: Broadcast has a default timeout of 60 secs in debug runs and 300 secs in job runs. Stream chosen for broadcast seems to large to produce data within this limit.
- **Recommendation**: Check the Optimize tab on your data flow transformations for Join, Exists, and Lookup. The default option for Broadcast is "Auto". If this is set, or if you are manually setting the left or right side to broadcast under "Fixed", then you can either set a larger Azure Integration Runtime configuration, or switch off broadcast. The recommended approach for best performance in data flows is to allow Spark to broadcast using "Auto" and use a Memory Optimized Azure IR.

### Error code: DF-Executor-Conversion

- **Message**: Converting to a date or time failed due to an invalid character
- **Causes**: Data is not in the expected format
- **Recommendation**: Use the correct data type

### Error code: DF-Executor-InvalidColumn

- **Message**: Column name needs to be specified in the query, set an alias if using a SQL function
- **Causes**: No column name was specified
- **Recommendation**: Set an alias if using a SQL function such as min()/max(), etc.

### Error code: GetCommand OutputAsync failed

- **Message**: During Data Flow debug and data preview: GetCommand OutputAsync failed with ...
- **Causes**: This is a back-end service error. You can retry the operation and also restart your debug session.
- **Recommendation**: If retry and restart do not resolve the issue, contact customer support.

### Error code: Hit unexpected exception and execution failed

- **Message**: During Data Flow activity execution: Hit unexpected exception and execution failed.
- **Causes**: This is a back-end service error. You can retry the operation and also restart your debug session.
- **Recommendation**: If retry and restart do not resolve the issue, contact customer support.

## General troubleshooting guidance

1. Check the status of your dataset connections. In each Source and Sink transformation, visit the Linked Service for each dataset that you are using and test connections.
1. Check the status of your file and table connections from the data flow designer. Switch on Debug and click on Data Preview on your Source transformations to ensure that you are able to access your data.
1. If everything looks good from data preview, go into the Pipeline designer and put your data flow in a pipeline activity. Debug the pipeline for an end-to-end test.

## Next steps

For more troubleshooting help, try these resources:
*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-data-factory.html)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
*  [ADF mapping data flows Performance Guide](concepts-data-flow-performance.md)
