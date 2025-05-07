---
title: Parsing JSON and AVRO in Azure Stream Analytics
description: This article describes how to operate on complex data types like arrays, JSON, CSV formatted data when using Azure Stream Analytics.
ms.service: azure-stream-analytics
author: an-emma
ms.author: raan
ms.topic: concept-article
ms.date: 01/23/2025
# Customer intent: I want to know about Azure Stream Analytics support for parsing JSON and AVRO data. 
---
# Parse JSON and Avro data in Azure Stream Analytics

The Azure Stream Analytics service supports processing events in CSV, JSON, and Avro data formats. Both JSON and Avro data can be structured and contain some complex types such as nested objects (records) and arrays. 

>[!NOTE]
>AVRO files created by Event Hubs Capture use a specific format that requires you to use the *custom deserializer* feature. For more information, see [Read input in any format using .NET custom deserializers](./custom-deserializer-examples.md).



## Record data types
Record data types are used to represent JSON and Avro arrays when corresponding formats are used in the input data streams. These examples demonstrate a sample sensor, which is reading input events in JSON format. Here's example of a single event:

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
Use dot notation (.) to easily access nested fields directly from your query. For example, this query selects the Latitude and Longitude coordinates under the Location property in the preceding JSON data. The dot notation can be used to navigate multiple levels as shown in the following snippet:

```SQL
SELECT
    DeviceID,
    Location.Lat,
    Location.Long,
    SensorReadings.Temperature,
    SensorReadings.SensorMetadata.Version
FROM input
```

The result is:

|DeviceID|Lat|Long|Temperature|Version|
|-|-|-|-|-|
|12345|47|122|80|1.2.45|


### Select all properties
You can select all the properties of a nested record using '*' wildcard. Consider the following example:

```SQL
SELECT
    DeviceID,
    Location.*
FROM input
```

The result is:

|DeviceID|Lat|Long|
|-|-|-|
|12345|47|122|


### Access nested fields when property name is a variable

Use the [GetRecordPropertyValue](/stream-analytics-query/getrecordpropertyvalue-azure-stream-analytics) function if the property name is a variable. It allows for building dynamic queries without hardcoding property names.

For example, imagine the sample data stream needs **to be joined with reference data** containing thresholds for each device sensor. A snippet of such reference data is shown in the following snippet.

```json
{
    "DeviceId" : "12345",
    "SensorName" : "Temperature",
    "Value" : 85
},
{
    "DeviceId" : "12345",
    "SensorName" : "Humidity",
    "Value" : 65
}
```

The goal here's to join our sample dataset from the top of the article to that reference data, and output one event for each sensor measure above its threshold. That means our single event above can generate multiple output events if multiple sensors are above their respective thresholds, thanks to the join. To achieve similar results without a join, see the following example:

```SQL
SELECT
    input.DeviceID,
    thresholds.SensorName,
    "Alert: Sensor above threshold" AS AlertMessage
FROM input      -- stream input
JOIN thresholds -- reference data input
ON
    input.DeviceId = thresholds.DeviceId
WHERE
    GetRecordPropertyValue(input.SensorReadings, thresholds.SensorName) > thresholds.Value
```

**GetRecordPropertyValue** selects the property in *SensorReadings*, which name matches the property name coming from the reference data. Then the associated value from *SensorReadings* is extracted.

The result is:

|DeviceID|SensorName|AlertMessage|
| - | - | - |
| 12345 | Humidity | Alert: Sensor above threshold |

### Convert record fields into separate events

To convert record fields into separate events, use the [APPLY](/stream-analytics-query/apply-azure-stream-analytics) operator together with the [GetRecordProperties](/stream-analytics-query/getrecordproperties-azure-stream-analytics) function.

With the original sample data, the following query could be used to extract properties into different events.

```SQL
SELECT
    event.DeviceID,
    sensorReading.PropertyName,
    sensorReading.PropertyValue
FROM input as event
CROSS APPLY GetRecordProperties(event.SensorReadings) AS sensorReading
```

The result is:

|DeviceID|SensorName|AlertMessage|
|-|-|-|
|12345|Temperature|80|
|12345|Humidity|70|
|12345|CustomSensor01|5|
|12345|CustomSensor02|99|
|12345|SensorMetadata|[object Object]|

Using [WITH](/stream-analytics-query/with-azure-stream-analytics), it's then possible to route those events to different destinations:

```SQL
WITH Stage0 AS
(
    SELECT
        event.DeviceID,
        sensorReading.PropertyName,
        sensorReading.PropertyValue
    FROM input as event
    CROSS APPLY GetRecordProperties(event.SensorReadings) AS sensorReading
)

SELECT DeviceID, PropertyValue AS Temperature INTO TemperatureOutput FROM Stage0 WHERE PropertyName = 'Temperature'
SELECT DeviceID, PropertyValue AS Humidity INTO HumidityOutput FROM Stage0 WHERE PropertyName = 'Humidity'
```

### Parse JSON record in SQL reference data
When using Azure SQL Database as reference data in your job, it's possible to have a column that has data in JSON format. An example is shown in the following example: 

|DeviceID|Data|
|-|-|
|12345|{"key": "value1"}|
|54321|{"key": "value2"}|

You can parse the JSON record in the *Data* column by writing a simple JavaScript user-defined function.

```javascript
function parseJson(string) {
return JSON.parse(string);
}
```

You can then create a step in your Stream Analytics query as shown here to access the fields of your JSON records.

 ```SQL
 WITH parseJson as
 (
 SELECT DeviceID, udf.parseJson(sqlRefInput.Data) as metadata,
 FROM sqlRefInput
 )
 
 SELECT metadata.key
 INTO output
 FROM streamInput
 JOIN parseJson 
 ON streamInput.DeviceID = parseJson.DeviceID
```

## Array data types

Array data types are an ordered collection of values. Some typical operations on array values are detailed here. These examples use the functions [GetArrayElement](/stream-analytics-query/getarrayelement-azure-stream-analytics), [GetArrayElements](/stream-analytics-query/getarrayelements-azure-stream-analytics), [GetArrayLength](/stream-analytics-query/getarraylength-azure-stream-analytics), and the [APPLY](/stream-analytics-query/apply-azure-stream-analytics) operator.

Here's an example of an event. Both `CustomSensor03` and `SensorMetadata` are of type **array**:

```json
{
    "DeviceId" : "12345",
    "SensorReadings" :
    {
        "Temperature" : 80,
        "Humidity" : 70,
        "CustomSensor01" : 5,
        "CustomSensor02" : 99,
        "CustomSensor03": [12,-5,0]
     },
    "SensorMetadata":[
        {          
            "smKey":"Manufacturer",
            "smValue":"ABC"                
        },
        {
            "smKey":"Version",
            "smValue":"1.2.45"
        }
    ]
}
```

### Working with a specific array element

Select array element at a specified index (selecting the first array element):

```SQL
SELECT
    GetArrayElement(SensorReadings.CustomSensor03, 0) AS firstElement
FROM input
```

The result is:

|firstElement|
|-|
|12|

### Select array length

```SQL
SELECT
    GetArrayLength(SensorReadings.CustomSensor03) AS arrayLength
FROM input
```

The result is:

|arrayLength|
|-|
|3|

### Convert array elements into separate events

Select all array element as individual events. The [APPLY](/stream-analytics-query/apply-azure-stream-analytics) operator together with the [GetArrayElements](/stream-analytics-query/getarrayelements-azure-stream-analytics) built-in function extracts all array elements as individual events:

```SQL
SELECT
    DeviceId,
	CustomSensor03Record.ArrayIndex,
	CustomSensor03Record.ArrayValue
FROM input
CROSS APPLY GetArrayElements(SensorReadings.CustomSensor03) AS CustomSensor03Record

```

The result is:

|DeviceId|ArrayIndex|ArrayValue|
|-|-|-|
|12345|0|12|
|12345|1|-5|
|12345|2|0|

```SQL
SELECT   
    i.DeviceId,	
    SensorMetadataRecords.ArrayValue.smKey as smKey,
    SensorMetadataRecords.ArrayValue.smValue as smValue
FROM input i
CROSS APPLY GetArrayElements(SensorMetadata) AS SensorMetadataRecords
 ```
 
The result is:

|DeviceId|smKey|smValue|
|-|-|-|
|12345|Manufacturer|ABC|
|12345|Version|1.2.45|

If the extracted fields need to appear in columns, it's possible to pivot the dataset using the [WITH](/stream-analytics-query/with-azure-stream-analytics) syntax in addition to the [JOIN](/stream-analytics-query/join-azure-stream-analytics) operation. That join requires a [time boundary](/stream-analytics-query/join-azure-stream-analytics#BKMK_DateDiff) condition that prevents duplication:

```SQL
WITH DynamicCTE AS (
	SELECT   
		i.DeviceId,
		SensorMetadataRecords.ArrayValue.smKey as smKey,
		SensorMetadataRecords.ArrayValue.smValue as smValue
	FROM input i
	CROSS APPLY GetArrayElements(SensorMetadata) AS SensorMetadataRecords 
)

SELECT
	i.DeviceId,
	i.Location.*,
	V.smValue AS 'smVersion',
	M.smValue AS 'smManufacturer'
FROM input i
LEFT JOIN DynamicCTE V ON V.smKey = 'Version' and V.DeviceId = i.DeviceId AND DATEDIFF(minute,i,V) BETWEEN 0 AND 0 
LEFT JOIN DynamicCTE M ON M.smKey = 'Manufacturer' and M.DeviceId = i.DeviceId AND DATEDIFF(minute,i,M) BETWEEN 0 AND 0
```

The result is:

|DeviceId|Lat|Long|smVersion|smManufacturer|
|-|-|-|-|-|
|12345|47|122|1.2.45|ABC|

## Related content
[Data Types in Azure Stream Analytics](/stream-analytics-query/data-types-azure-stream-analytics)
