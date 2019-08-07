---
title: Parsing JSON and AVRO in Azure Stream Analytics
description: This article describes how to operate on complex data types like arrays, JSON, CSV formatted data.
services: stream-analytics
ms.service: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.topic: conceptual
ms.date: 06/21/2019
---
# Parse JSON and Avro data in Azure Stream Analytics

Azure Stream Analytics support processing events in CSV, JSON, and Avro data formats. Both JSON and Avro data can be structured and contain some complex types such as nested objects (records) and arrays. 




## Record data types
Record data types are used to represent JSON and Avro arrays when corresponding formats are used in the input data streams. These examples demonstrate a sample sensor, which is reading input events in JSON format. Here is example of a single event:

```json
{
    "DeviceId" : "12345",
    "Location" :
    {
        "Lat": 47,
        "Long": 122
    },
    "SensorReadings" :
    {
        "Temperature" : 80,
        "Humidity" : 70,
        "CustomSensor01" : 5,
        "CustomSensor02" : 99,
        "SensorMetadata" : 
        {
        "Manufacturer":"ABC",
        "Version":"1.2.45"
        }
    }
}
```


### Access nested fields in known schema
Use dot notation (.) to easily access nested fields directly from your query. For example, this query selects the Latitude and Longitude coordinates under the Location property in the preceding JSON data. The dot notation can be used to navigate multiple levels as shown below.

```SQL
SELECT
    DeviceID,
    Location.Lat,
    Location.Long,
    SensorReadings.SensorMetadata.Version
FROM input
```

### Select all properties
You can select all the properties of a nested record using '*' wildcard. Consider the following example:

```SQL
SELECT input.Location.*
FROM input
```

The result is:

```json
{
    "Lat" : 47,
    "Long" : 122
}
```


### Access nested fields when property name is a variable
Use the [GetRecordPropertyValue](https://docs.microsoft.com/stream-analytics-query/getmetadatapropertyvalue) function if the property name is a variable. 

For example, imagine a sample data stream needs to be joined with reference data containing thresholds for each device sensor. A snippet of such reference data is shown below.

```json
{
    "DeviceId" : "12345",
    "SensorName" : "Temperature",
    "Value" : 75
}
```

```SQL
SELECT
    input.DeviceID,
    thresholds.SensorName
FROM input      -- stream input
JOIN thresholds -- reference data input
ON
    input.DeviceId = thresholds.DeviceId
WHERE
    GetRecordPropertyValue(input.SensorReadings, thresholds.SensorName) > thresholds.Value
    -- the where statement selects the property value coming from the reference data
```

### Convert record fields into separate events
To convert record fields into separate events, use the [APPLY](https://docs.microsoft.com/stream-analytics-query/apply-azure-stream-analytics) operator together with the [GetRecordProperties](https://docs.microsoft.com/stream-analytics-query/getrecordproperties-azure-stream-analytics) function. 
For example, if the previous example had several records for SensorReading, the following query could be used to extract them into different events:

```SQL
SELECT
    event.DeviceID,
    sensorReading.PropertyName,
    sensorReading.PropertyValue
FROM input as event
CROSS APPLY GetRecordProperties(event.SensorReadings) AS sensorReading
```



## Array data types

Array data types are an ordered collection of values. Some typical operations on array values are detailed below. These examples assume the input events have a property named "arrayField" that is  an array datatype.

These examples use the functions [GetArrayElement](https://docs.microsoft.com/stream-analytics-query/getarrayelement-azure-stream-analytics), [GetArrayElements](https://docs.microsoft.com/stream-analytics-query/getarrayelements-azure-stream-analytics), [GetArrayLength](https://docs.microsoft.com/stream-analytics-query/getarraylength-azure-stream-analytics), and the [APPLY](https://docs.microsoft.com/stream-analytics-query/apply-azure-stream-analytics) operator.

### Working with a specific array element
Select array element at a specified index (selecting the first array element):

```SQL
SELECT
    GetArrayElement(arrayField, 0) AS firstElement
FROM input
```

### Select array length

```SQL
SELECT
    GetArrayLength(arrayField) AS arrayLength
FROM input
```

### Convert array elements into separate events
Select all array element as individual events. The [APPLY](https://docs.microsoft.com/stream-analytics-query/apply-azure-stream-analytics) operator together with the [GetArrayElements](https://docs.microsoft.com/stream-analytics-query/getarrayelements-azure-stream-analytics) built-in function extracts all array elements as individual events:

```SQL
SELECT
    arrayElement.ArrayIndex,
    arrayElement.ArrayValue
FROM input as event
CROSS APPLY GetArrayElements(event.arrayField) AS arrayElement
```


## See Also
[Data Types in Azure Stream Analytics](https://docs.microsoft.com/stream-analytics-query/data-types-azure-stream-analytics)
