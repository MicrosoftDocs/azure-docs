---
title: Troubleshoot the Parquet format connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Parquet format connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 01/11/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Parquet format connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Parquet format connector in Azure Data Factory and Azure Synapse.

## Error code: ParquetJavaInvocationException

- **Message**: `An error occurred when invoking java, message: %javaException;.`

- **Causes and recommendations**: Different causes may lead to this error. Check below list for possible cause analysis and related recommendation.

    | Cause analysis                                               | Recommendation                                               |
    | :----------------------------------------------------------- | :----------------------------------------------------------- |
    | When the error message contains the strings "java.lang.OutOfMemory", "Java heap space", and "doubleCapacity", it's usually a memory management issue in an old version of Integration Runtime. | If you are using Self-hosted IR and the version is earlier than 3.20.7159.1, we recommend that you upgrade to the latest version. |
    | When the error message contains the string "java.lang.OutOfMemory", the integration runtime doesn't have enough resources to process the files. | Limit the concurrent runs on the integration runtime. For Self-hosted IR, scale up to a powerful machine with memory that's equal to or greater than 8 GB. |
    | When the error message contains the string "NullPointerReference", it might be a transient error. | Retry the operation. If the problem persists, contact support. |

## Error code: ParquetInvalidFile

- **Message**: `File is not a valid Parquet file.`

- **Cause**: This is a Parquet file issue.

- **Recommendation**:  Check to see whether the input is a valid Parquet file.

## Error code: ParquetNotSupportedType

- **Message**: `Unsupported Parquet type. PrimitiveType: %primitiveType; OriginalType: %originalType;.`

- **Cause**: The Parquet format is not supported in Azure Data Factory and Synapse pipelines.

- **Recommendation**:  Double-check the source data by going to [Supported file formats and compression codecs by copy activity](./supported-file-formats-and-compression-codecs.md).

## Error code: ParquetMissedDecimalPrecisionScale

- **Message**: `Decimal Precision or Scale information is not found in schema for column: %column;.`

- **Cause**: The number precision and scale were parsed, but no such information was provided.

- **Recommendation**:  The source doesn't return the correct precision and scale information. Check the issue column for the information.

## Error code: ParquetInvalidDecimalPrecisionScale

- **Message**: `Invalid Decimal Precision or Scale. Precision: %precision; Scale: %scale;.`

- **Cause**: The schema is invalid.

- **Recommendation**:  Check the issue column for precision and scale.

## Error code: ParquetColumnNotFound

- **Message**: `Column %column; does not exist in Parquet file.`

- **Cause**: The source schema is a mismatch with the sink schema.

- **Recommendation**:  Check the mappings in the activity. Make sure that the source column can be mapped to the correct sink column.

## Error code: ParquetInvalidDataFormat

- **Message**: `Incorrect format of %srcValue; for converting to %dstType;.`

- **Cause**: The data can't be converted into the type that's specified in mappings.source.

- **Recommendation**:  Double-check the source data or specify the correct data type for this column in the copy activity column mapping. For more information, see [Supported file formats and compression codecs by the copy activity](./supported-file-formats-and-compression-codecs.md).

## Error code: ParquetDataCountNotMatchColumnCount

- **Message**: `The data count in a row '%sourceColumnCount;' does not match the column count '%sinkColumnCount;' in given schema.`

- **Cause**:  A mismatch between the source column count and the sink column count.

- **Recommendation**:  Double-check to ensure that the source column count is same as the sink column count in 'mapping'.

## Error code: ParquetDataTypeNotMatchColumnType

- **Message**: `The data type %srcType; is not match given column type %dstType; at column '%columnIndex;'.`

- **Cause**: The data from the source can't be converted to the type that's defined in the sink.

- **Recommendation**:  Specify a correct type in mapping.sink.

## Error code: ParquetBridgeInvalidData

- **Message**: `%message;`

- **Cause**: The data value has exceeded the limit.

- **Recommendation**:  Retry the operation. If the issue persists, contact us.

## Error code: ParquetUnsupportedInterpretation

- **Message**: `The given interpretation '%interpretation;' of Parquet format is not supported.`

- **Cause**: This scenario isn't supported.

- **Recommendation**:  'ParquetInterpretFor' should not be 'sparkSql'.

## Error code: ParquetUnsupportFileLevelCompressionOption

- **Message**: `File level compression is not supported for Parquet.`

- **Cause**: This scenario isn't supported.

- **Recommendation**:  Remove 'CompressionType' in the payload.

## Error code: UserErrorJniException

- **Message**: `Cannot create JVM: JNI return code [-6][JNI call failed: Invalid arguments.]`

- **Cause**: A Java Virtual Machine (JVM) can't be created because some illegal (global) arguments are set.

- **Recommendation**:  Log in to the machine that hosts *each node* of your self-hosted IR. Check to ensure that the system variable is set correctly, as follows: `_JAVA_OPTIONS "-Xms256m -Xmx16g" with memory bigger than 8 G`. Restart all the IR nodes, and then rerun the pipeline.

## Arithmetic overflow

- **Symptoms**: Error message occurred when you copy Parquet files: `Message = Arithmetic Overflow., Source = Microsoft.DataTransfer.Common`

- **Cause**: Currently only the decimal of precision <= 38 and length of integer part <= 20 are supported when you copy files from Oracle to Parquet. 

- **Resolution**: As a workaround, you can convert any columns with this problem into VARCHAR2.

## No enum constant

- **Symptoms**: Error message occurred when you copy data to Parquet format: `java.lang.IllegalArgumentException:field ended by &apos;;&apos;`, or: `java.lang.IllegalArgumentException:No enum constant org.apache.parquet.schema.OriginalType.test`.

- **Cause**: 

    The issue could be caused by white spaces or unsupported special characters (such as,;{}()\n\t=) in the column name, because Parquet doesn't support such a format. 

    For example, a column name such as *contoso(test)* will parse the type in brackets from [code](https://github.com/apache/parquet-mr/blob/master/parquet-column/src/main/java/org/apache/parquet/schema/MessageTypeParser.java) `Tokenizer st = new Tokenizer(schemaString, " ;{}()\n\t");`. The error is thrown because there is no such "test" type.

    To check supported types, go to the GitHub [apache/parquet-mr site](https://github.com/apache/parquet-mr/blob/master/parquet-column/src/main/java/org/apache/parquet/schema/OriginalType.java).

- **Resolution**: 

    Double-check to see whether:
    - There are white spaces in the sink column name.
    - The first row with white spaces is used as the column name.
    - The type OriginalType is supported. Try to avoid using these special characters: `,;{}()\n\t=`. 

## Error code: ParquetDateTimeExceedLimit

- **Message**: `The Ticks value '%ticks;' for the datetime column must be between valid datetime ticks range -621355968000000000 and 2534022144000000000.`

- **Cause**: If the datetime value is '0001-01-01 00:00:00', it could be caused by the difference between Julian Calendar and Gregorian Calendar. For more details, reference [Difference between Julian and proleptic Gregorian calendar dates](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar#Difference_between_Julian_and_proleptic_Gregorian_calendar_dates).

- **Resolution**: Check the ticks value and avoid using the datetime value '0001-01-01 00:00:00'.

## Error code: ParquetInvalidColumnName

- **Message**: `The column name is invalid. Column name cannot contain these character:[,;{}()\n\t=]`

- **Cause**: The column name contains invalid characters.

- **Resolution**: Add or modify the column mapping to make the sink column name valid.

## The file created by the copy data activity extracts a table that contains a varbinary (max) column

- **Symptoms**: The Parquet file created by the copy data activity extracts a table that contains a varbinary (max) column.

- **Cause**: This issue is caused by the Parquet-mr library bug of reading large column. 

- **Resolution**: Try to generate smaller files (size < 1G) with a limitation of 1000 rows per file.

## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
