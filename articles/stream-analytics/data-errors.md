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

When there is a discrepancy in the data processed by an Azure Stream Analytics job, a data error event is sent to the diagnostic logs for that job. Stream Analytics writes detailed information, as well as example events, to its diagnostic logs when data errors occur. A summary of this information is also provided through portal notifications for some errors.

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

|Error kind|Cause|Portal notification|Diagnostic log level|Log details|Example error message|
|----------|-----|-------------------|--------------------|-----------|---------------------|
|InputDeserializerError.InvalidCompressionType|Input compression type selected does not match data|Yes|Warning|The message identifier of the input message. For Event Hub, this is PartitionId, Offset, and Sequence Number.|BriefMessage: "Unable to decompress events from resource 'https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt'. Please ensure compression setting fits the data being processed."|
|InputDeserializerError.InvalidHeader|The header of input data is invalid. For example, a CSV has columns with duplicate names.|Yes|Warning|Input message identifier. Actual payload up to few KBs.|BriefMessage:
"Invalid CSV Header for resource ‘'https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt '. Please make sure there are no duplicate field names."|
|InputDeserializerError.MissingColumns|The input columns defined with CREATE TABLE or through TIMESTAMP BY does not exist.|Yes|Warning|Input message identifier. Names of the columns that are missing. Actual payload up to few KBs.|BriefMessage: "Could not deserialize the input event(s) from resource '''https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt ' as Csv. Some possible reasons: 1) Malformed events 2) Input source configured with incorrect serialization format" Message: Missing fields specified in query or in create table. Fields expected:ColumnA Fields expected:ColumnB|
|InputDeserializerError.TypeConversionError|Unable to convert input to the type specified in the CREATE TABLE statement.|Yes|Warning|Input message identifier. Name of the column and expected type.|BriefMessage:"Could not deserialize the input event(s) from resource '''https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt ' as Csv. Some possible reasons: 1) Malformed events 2) Input source configured with incorrect serialization format" Message: Unable to convert column: dateColumn to expected type.|
|InputDeserializerError.InvalidData|Input data is not in the right format. For example, the input is not valid JSON|Yes|Warning|Input message identifier. Actual payload up to few KBs.|BriefMessage: Json input stream should either be an array of objects or line separated objects. Found token type: String Message: Json input stream should either be an array of objects or line separated objects. Found token type: String|
|InvalidInputTimeStamp|The value of the TIMESTAMP BY expression cannot be converted to datetime.|Yes|Warning|Input message identifier. Error message. Actual payload up to few KBs.|BriefMessage:Unable to get timestamp for resource 'https:\\/\\/exampleBlob.blob.core.windows.net\\/inputfolder\\/csv.txt ' due to error 'Cannot convert string to datetime'|
|InvalidInputTimeStampKey|The value of TIMESTAMP BY OVER timestampColumn is NULL.|Yes|Warning|The actual payload up to few KBs.|BriefMessage: Unable to get value of TIMESTAMP BY OVER COLUMN|
|LateInputEvent|The difference between application time and arrival time is greater than late arrival tolerance window.|No|Information.|Application time and arrival time. Actual payload up to few KBs.|BriefMessage: Input event with application timestamp '2019-01-01' and arrival time '2019-01-02' was sent later than configured tolerance.|
|EarlyInputEvent|The difference between Application time and Arrival time is greater than 5 minutes.|No|Information.|The application time and arrival time. Actual payload up to few KBs.|BriefMessage: Input event arrival time '2019-01-01' is earlier than input event application timestamp '2019-01-02' by more than 5 minutes.|
|OutOfOrderEvent|Event is considered out of order according to the out of order tolerance window defined.|No|Information|Actual payload up to few KBs.|Message: Out of order event(s) received.|

## Output data errors

|Error kind|Cause|Portal notification|Diagnostic log level|Log details|Example error message|
|----------|-----|-------------------|--------------------|-----------|---------------------|
|OutputDataConversionError.RequiredColumnMissing|The column required for the output does not exist. For example, a column defined as Azure Table PartitionKey does not exist.|Yes|Warning|Name of the column and either the record identifier or part of the record.|Message: The output record does not contain primary key property: [deviceId] Ensure the query output contains the column [deviceId] with a unique non-empty string less than '255' characters.|
|OutputDataConversionError. ColumnNameInvalid|Column value is does not conform with output. For example, the column name is not a valid Azure table column.|Yes|Warning|Name of the column and either record identifier or part of the record.|Message: Invalid property name #deviceIdValue. Please refer MSDN for Azure table property naming convention.|
|OutputDataConversionError.TypeConversionError|A column cannot be converted to a valid type in the output. For example, the value of column is incompatible with constraints or type defined in SQL table.|Yes|Warning|Name of the column and either record identifier or part of the record.|Message: The column [id] value null or its type is invalid. Ensure to provide a unique non-empty string less than '255' characters.|
|OutputDataConversionError.RecordExceededSizeLimit|Value of the message is greater than the supported size in output. For example, a record is larger than 1 MB for an Event Hub output.|Yes|Warning|Either record identifier or part of the record.|BriefMessage: Single output event exceeds the maximum message size limit allowed (262144 bytes) by Event Hub.|
|OutputDataConversionError.DuplicateKey|A record already contains a column with the same name as a System column. For example, CosmosDB output with a column named Id when Id column is to a different column.|Yes|Warning|Name of the column and either record identifier or part of the record.|BriefMessage: Column 'devicePartitionKey' is being mapped to multiple columns.|

## Next steps

* [Troubleshoot Azure Stream Analytics by using diagnostics logs](stream-analytics-job-diagnostic-logs.md)

* [Understand Stream Analytics job monitoring and how to monitor queries](stream-analytics-monitoring.md)
