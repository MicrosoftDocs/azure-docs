---
title: Troubleshoot mapping data flows
description: Learn how to troubleshoot data flow problems in Azure Data Factory.
ms.author: makromer
author: kromerm
ms.reviewer: daperlov
ms.service: data-factory
ms.subservice: data-flows
ms.topic: troubleshooting
ms.date: 10/01/2021
---

# Troubleshoot mapping data flows in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for mapping data flows in Azure Data Factory.  Refer to [common data flow error codes and messages](data-flow-troubleshoot-errors.md) for specific error messages and their associated causes and recommendations.

## Miscellaneous troubleshooting tips
- **Issue**: Unexpected exception occurred and execution failed.
	- **Message**: During Data Flow activity execution: Hit unexpected exception and execution failed.
	- **Cause**: This error is a back-end service error. Retry the operation and restart your debugging session.
	- **Recommendation**: If retrying and restarting doesn't resolve the problem, contact customer support.

-  **Issue**: No output data on join during debug data preview.
	- **Message**: There are a high number of null values or missing values which may be caused by having too few rows sampled. Try updating the debug row limit and refreshing the data.
	- **Cause**: The join condition either didn't match any rows or resulted in a large number of null values during the data preview.
	- **Recommendation**: In **Debug Settings**, increase the number of rows in the source row limit. Be sure to select an Azure IR that has a data flow cluster that's large enough to handle more data.
	
- **Issue**: Validation error at source with multiline CSV files. 
	- **Message**: You might see one of these error messages:
		- The last column is null or missing.
		- Schema validation at source fails.
		- Schema import fails to show correctly in the UX and the last column has a new line character in the name.
	- **Cause**: In the Mapping data flow, multiline CSV source files don't currently work when \r\n is used as the row delimiter. Sometimes extra lines at carriage returns can cause errors. 
	- **Recommendation**: Generate the file at the source by using \n as the row delimiter rather than \r\n. Or use the Copy activity to convert the CSV file to use \n as a row delimiter.

## General troubleshooting guidance
1. Check the status of your dataset connections. In each source and sink transformation, go to the linked service for each dataset that you're using and test the connections.
2. Check the status of your file and table connections in the data flow designer. In debug mode, select **Data Preview** on your source transformations to ensure that you can access your data.
3. If everything looks correct in data preview, go into the Pipeline designer and put your data flow in a Pipeline activity. Debug the pipeline for an end-to-end test.

### Improvement on CSV/CDM format in Data Flow 

If you use the **Delimited Text or CDM formatting for mapping data flow in Azure Data Factory V2**, you may face the behavior changes to your existing pipelines because of the improvement for Delimited Text/CDM in data flow starting from **1 May 2021**. 

You may encounter the following issues before the improvement, but after the improvement, the issues were fixed. Read the following content to determine whether this improvement affects you. 

#### Scenario 1: Encounter the unexpected row delimiter issue

 You are affected if you are in the following conditions:
 - Using the Delimited Text with the Multiline setting set to True or CDM as the source.
 - The first row has more than 128 characters. 
 - The row delimiter in data files is not `\n`.

 Before the improvement, the default row delimiter `\n` may be unexpectedly used to parse delimited text files, because when Multiline setting is set to True, it invalidates the row delimiter setting, and the row delimiter is automatically detected based on the first 128 characters. If you fail to detect the actual row delimiter, it would fall back to `\n`.  

 After the improvement, any one of the three-row delimiters: `\r`, `\n`, `\r\n` should  have worked.
 
 The following example shows you one pipeline behavior change after the improvement:

 **Example**:<br/>
   For the following column:<br/>
    `C1, C2, {long first row}, C128\r\n `<br/>
    `V1, V2, {values………………….}, V128\r\n `<br/>
 
   Before the improvement, `\r` is kept in the column value. The parsed column result is:<br/>
   `C1 C2 {long first row} C128`**`\r`**<br/>
   `V1 V2 {values………………….} V128`**`\r`**<br/> 

   After the improvement, the parsed column result should be:<br/>
   `C1 C2 {long first row} C128`<br/>
   `V1 V2 {values………………….} V128`<br/>
  
#### Scenario 2: Encounter an issue of incorrectly reading column values containing '\r\n'

 You are affected if you are in the following conditions:
 - Using the Delimited Text with the Multiline setting set to True or CDM as a source. 
 - The row delimiter is `\r\n`.

 Before the improvement, when reading the column value, the `\r\n` in it may be incorrectly replaced by `\n`. 

 After the improvement, `\r\n` in the column value will not be replaced by `\n`.

 The following example shows you one pipeline behavior change after the improvement:
 
 **Example**:<br/>
  
 For the following column：<br/>
  **`"A\r\n"`**`, B, C\r\n`<br/>

 Before the improvement, the parsed column result is:<br/>
  **`A\n`**` B C`<br/>

 After the improvement, the parsed column result should be:<br/>
  **`A\r\n`**` B C`<br/>  

#### Scenario 3: Encounter an issue of incorrectly writing column values containing '\n'

 You are affected if you are in the following conditions:
 - Using the Delimited Text as a sink.
 - The column value contains `\n`.
 - The row delimiter is set to `\r\n`.
 
 Before the improvement, when writing the column value, the `\n` in it may be incorrectly replaced by `\r\n`. 

 After the improvement, `\n` in the column value will not be replaced by `\r\n`.
 
 The following example shows you one pipeline behavior change after the improvement:

 **Example**:<br/>

 For the following column:<br/>
 **`A\n`**` B C`<br/>

 Before the improvement, the CSV sink is:<br/>
  **`"A\r\n"`**`, B, C\r\n` <br/>

 After the improvement, the CSV sink should be:<br/>
  **`"A\n"`**`, B, C\r\n`<br/>

#### Scenario 4: Encounter an issue of incorrectly reading empty string as NULL
 
 You are affected if you are in the following conditions:
 - Using the Delimited Text as a source. 
 - NULL value is set to non-empty value. 
 - The column value is empty string and is unquoted. 
 
 Before the improvement, the column value of unquoted empty string is read as NULL. 

 After the improvement, empty string will not be parsed as NULL value. 
 
 The following example shows you one pipeline behavior change after the improvement:

 **Example**:<br/>

 For the following column:<br/>
  `A, ,B, `<br/>

 Before the improvement, the parsed column result is:<br/>
  `A null B null`<br/>

 After the improvement, the parsed column result should be:<br/>
  `A "" (empty string) B "" (empty string)`<br/>

###  Internal server errors

Specific scenarios that can cause internal server errors are shown as follows.

#### Scenario 1: Not choosing the appropriate compute size/type and other factors

  Successful execution of data flows depends on many factors, including the compute size/type, numbers of source/sinks to process, the partition specification, transformations involved, sizes of datasets, the data skewness and so on.<br/>
  
  For more guidance, see [Integration Runtime performance](concepts-integration-runtime-performance.md).

#### Scenario 2: Using debug sessions with parallel activities

  When triggering a run using the data flow debug session with constructs like ForEach in the pipeline, multiple parallel runs can be submitted to the same cluster. This situation can lead to cluster failure problems while running because of resource issues, such as being out of memory.<br/>
  
  To submit a run with the appropriate integration runtime configuration defined in the pipeline activity after publishing the changes, select **Trigger Now** or **Debug** > **Use Activity Runtime**.

#### Scenario 3: Transient issues

  Transient issues with microservices involved in the execution can cause the run to fail.<br/>
  
  Configuring retries in the pipeline activity can resolve the problems caused by transient issues. For more guidance, see [Activity Policy](concepts-pipelines-activities.md#activity-json).

## Next steps

For more help with troubleshooting, see these resources:

- [Common mapping data flow errors and messages](data-flow-troubleshoot-errors.md)
- [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
