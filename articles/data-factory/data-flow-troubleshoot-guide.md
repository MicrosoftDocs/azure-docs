---
title: Troubleshoot Azure Data Factory Data Flows | Microsoft Docs
description: Learn how to troubleshoot data flow issues in Azure Data Factory. 
services: data-factory
author: kromerm
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 10/08/2019
ms.author: makromer
---

# Troubleshoot Azure Data Factory Data Flows

This article explores common troubleshooting methods for data flows in Azure Data Factory.

## Common errors and messages

### Error message: DF-SYS-01: shaded.databricks.org.apache.hadoop.fs.azure.AzureException: com.microsoft.azure.storage.StorageException: The specified container does not exist.

- **Symptoms**: Data preview, debug, and pipeline data flow execution fails because container does not exist

- **Cause**: When dataset contains a container that does not exist in the storage

- **Resolution**: Make sure that the container you are referencing in your dataset exists

### Error message: DF-SYS-01: java.lang.AssertionError: assertion failed: Conflicting directory structures detected. Suspicious paths

- **Symptoms**: When using wildcards in source transformation with Parquet files

- **Cause**: Incorrect or invalid wildcard syntax

- **Resolution**: Check the wildcard syntax you are using in your source transformation options

### Error message: DF-SRC-002: 'container' (Container name) is required

- **Symptoms**: Data preview, debug, and pipeline data flow execution fails because container does not exist

- **Cause**: When dataset contains a container that does not exist in the storage

- **Resolution**: Make sure that the container you are referencing in your dataset exists

### Error message: DF-UNI-001: PrimaryKeyValue has incompatible types IntegerType and StringType

- **Symptoms**: Data preview, debug, and pipeline data flow execution fails because container does not exist

- **Cause**: Happens when trying to insert incorrect primary key type in database sinks

- **Resolution**: Use a Derived Column to cast the column that you are using for the primary key in your data flow to match the data type of your target database

### Error message: DF-SYS-01: com.microsoft.sqlserver.jdbc.SQLServerException: The TCP/IP connection to the host xxxxx.database.windows.net port 1433 has failed. Error: "xxxx.database.windows.net. Verify the connection properties. Make sure that an instance of SQL Server is running on the host and accepting TCP/IP connections at the port. Make sure that TCP connections to the port are not blocked by a firewall."

- **Symptoms**: Unable to preview data or execute pipeline with database source or sink

- **Cause**: Database is protected by firewall

- **Resolution**: Open the firewall access to the database

### Error message: DF-SYS-01: com.microsoft.sqlserver.jdbc.SQLServerException: There is already an object named 'xxxxxx' in the database.

- **Symptoms**: Sink fails to create table

- **Cause**: There is already an existing table name in the target database with the same name defined in your source or in the dataset

- **Resolution**: Change the name of the table that you are trying to create

### Error message: DF-SYS-01: com.microsoft.sqlserver.jdbc.SQLServerException: String or binary data would be truncated. 

- **Symptoms**: When writing data to a SQL sink, your data flow fails on pipeline execution with possible truncation error.

- **Cause**: A field from your data flow maps to a column in your SQL database is not wide enough to store the value, causing the SQL driver to throw this error

- **Resolution**: You can reduce the length of the data for string columns using ```left()``` in a Derived Column or implement the ["error row" pattern.](how-to-data-flow-error-rows.md)

## General troubleshooting guidance

1. Check the status of your dataset connections. In each Source and Sink transformation, visit the Linked Service for each dataset that you are using and test connections.
2. Check the status of your file and table connections from the data flow designer. Switch on Debug and click on Data Preview on your Source transformations to ensure that you are able to access your data.
3. If everything looks good from data preview, go into the Pipeline designer and put your data flow in a pipeline activity. Debug the pipeline for an end-to-end test.

## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [MSDN forum](https://social.msdn.microsoft.com/Forums/home?sort=relevancedesc&brandIgnore=True&searchTerm=data+factory)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
*  [ADF mapping data flows Performance Guide](concepts-data-flow-performance.md)
