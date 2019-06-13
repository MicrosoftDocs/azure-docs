---
title: Azure Stream Analytics diagnostic log data errors
description: This article explains the different input and output data errors that can occur when using Azure Stream Analytics.
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/09/2019
---

# Azure Stream Analytics data errors

When there's a discrepancy in the data that is processed by an Azure Stream Analytics job, Stream Analytics sends a data error event to the diagnostic logs. Stream Analytics writes detailed information and example events, to its diagnostic logs when data errors occur. A summary of this information is also provided through portal notifications for some errors.

This article outlines the different error types, causes, and diagnostic log details for input and output data errors.

## Diagnostic log schema

See [Troubleshoot Azure Stream Analytics by using diagnostics logs](stream-analytics-job-diagnostic-logs.md#diagnostics-logs-schema) to see the schema for diagnostic logs. The following JSON is an example value for the **Properties** field of a diagnostic log for a data error.

```json
{
    "Source": "InputTelemetryData",
    "Type": "DataError",
    "DataErrorType": "InputDeserializerError.InvalidData",
    "BriefMessage": "Json input stream should either be an array of objects or line separated objects. Found token type: Integer",
    "Message": "Input Message Id: https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt Error: Json input stream should either be an array of objects or line separated objects. Found token type: Integer",
    "ExampleEvents": "[\"1,2\\\\u000d\\\\u000a3,4\\\\u000d\\\\u000a5,6\"]",
    "FromTimestamp": "2019-03-22T22:34:18.5664937Z",
    "ToTimestamp": "2019-03-22T22:34:18.5965248Z",
    "EventCount": 1
}
```

## Input data errors

### InputDeserializerError.InvalidCompressionType

* Cause: The input compression type selected doesn't match the data.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Input message identifier. For Event Hub, the identifier is the PartitionId, Offset, and Sequence Number.

**Error message**

```json
"BriefMessage": "Unable to decompress events from resource 'https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt'. Please ensure compression setting fits the data being processed."
```

### InputDeserializerError.InvalidHeader

* Cause: The header of input data is invalid. For example, a CSV has columns with duplicate names.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Input message identifier. 
   * Actual payload up to few kilobytes.

**Error message**

```json
"BriefMessage": "Invalid CSV Header for resource 'https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt'. Please make sure there are no duplicate field names."
```

### InputDeserializerError.MissingColumns

* Cause: The input columns defined with CREATE TABLE or through TIMESTAMP BY doesn't exist.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Input message identifier. 
   * Names of the columns that are missing. 
   * Actual payload up to a few kilobytes.

**Error messages**

```json
"BriefMessage": "Could not deserialize the input event(s) from resource 'https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt' as Csv. Some possible reasons: 1) Malformed events 2) Input source configured with incorrect serialization format" 
```

```json
"Message": "Missing fields specified in query or in create table. Fields expected:ColumnA Fields found:ColumnB"
```

### InputDeserializerError.TypeConversionError

* Cause: Unable to convert the input to the type specified in the CREATE TABLE statement.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Input message identifier. 
   * Name of the column and expected type.

**Error messages**

```json
"BriefMessage": "Could not deserialize the input event(s) from resource '''https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt ' as Csv. Some possible reasons: 1) Malformed events 2) Input source configured with incorrect serialization format" 
```

```json
"Message": "Unable to convert column: dateColumn to expected type."
```

### InputDeserializerError.InvalidData

* Cause: Input data is not in the right format. For example, the input isn't valid JSON.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Input message identifier. 
   * Actual payload up to few kilobytes.

**Error messages**

```json
"BriefMessage": "Json input stream should either be an array of objects or line separated objects. Found token type: String"
```

```json
"Message": "Json input stream should either be an array of objects or line separated objects. Found token type: String"
```

### InvalidInputTimeStamp

* Cause: The value of the TIMESTAMP BY expression can't be converted to datetime.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Input message identifier. 
   * Error message. 
   * Actual payload up to few kilobytes.

**Error message**

```json
"BriefMessage": "Unable to get timestamp for resource 'https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt ' due to error 'Cannot convert string to datetime'"
```

### InvalidInputTimeStampKey

* Cause: The value of TIMESTAMP BY OVER timestampColumn is NULL.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * The actual payload up to few kilobytes.

**Error message**

```json
"BriefMessage": "Unable to get value of TIMESTAMP BY OVER COLUMN"
```

### LateInputEvent

* Cause: The difference between application time and arrival time is greater than late arrival tolerance window.
* Portal notification provided: No
* Diagnostic log level: Information
* Log details
   * Application time and arrival time. 
   * Actual payload up to few kilobytes.

**Error message**

```json
"BriefMessage": "Input event with application timestamp '2019-01-01' and arrival time '2019-01-02' was sent later than configured tolerance."
```

### EarlyInputEvent

* Cause: The difference between Application time and Arrival time is greater than 5 minutes.
* Portal notification provided: No
* Diagnostic log level: Information
* Log details
   * Application time and arrival time. 
   * Actual payload up to few kilobytes.

**Error message**

```json
"BriefMessage": "Input event arrival time '2019-01-01' is earlier than input event application timestamp '2019-01-02' by more than 5 minutes."
```

### OutOfOrderEvent

* Cause: Event is considered out of order according to the out of order tolerance window defined.
* Portal notification provided: No
* Diagnostic log level: Information
* Log details
   * Actual payload up to few kilobytes.

**Error message**

```json
"Message": "Out of order event(s) received."
```

## Output data errors

### OutputDataConversionError.RequiredColumnMissing

* Cause: The column required for the output doesn't exist. For example, a column defined as Azure Table PartitionKey does't exist.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Name of the column and either the record identifier or part of the record.

**Error message**

```json
"Message": "The output record does not contain primary key property: [deviceId] Ensure the query output contains the column [deviceId] with a unique non-empty string less than '255' characters."
```

### OutputDataConversionError.ColumnNameInvalid

* Cause: The column value doesn't conform with the output. For example, the column name isn't a valid Azure table column.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Name of the column and either record identifier or part of the record.

**Error message**

```json
"Message": "Invalid property name #deviceIdValue. Please refer MSDN for Azure table property naming convention."
```

### OutputDataConversionError.TypeConversionError

* Cause: A column can't be converted to a valid type in the output. For example, the value of column is incompatible with constraints or type defined in SQL table.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Name of the column.
   * Either record identifier or part of the record.

**Error message**

```json
"Message": "The column [id] value null or its type is invalid. Ensure to provide a unique non-empty string less than '255' characters."
```

### OutputDataConversionError.RecordExceededSizeLimit

* Cause: The value of the message is greater than the supported output size. For example, a record is larger than 1 MB for an Event Hub output.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Either record identifier or part of the record.

**Error message**

```json
"BriefMessage": "Single output event exceeds the maximum message size limit allowed (262144 bytes) by Event Hub."
```

### OutputDataConversionError.DuplicateKey

* Cause: A record already contains a column with the same name as a System column. For example, CosmosDB output with a column named ID when ID column is to a different column.
* Portal notification provided: Yes
* Diagnostic log level: Warning
* Log details
   * Name of the column.
   * Either record identifier or part of the record.

```json
"BriefMessage": "Column 'devicePartitionKey' is being mapped to multiple columns."
```

## Next steps

* [Troubleshoot Azure Stream Analytics by using diagnostics logs](stream-analytics-job-diagnostic-logs.md)

* [Understand Stream Analytics job monitoring and how to monitor queries](stream-analytics-monitoring.md)
