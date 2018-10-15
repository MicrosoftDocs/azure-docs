---
title: Understand the Azure IoT Hub query language | Microsoft Docs
description: Developer guide - description of the SQL-like IoT Hub query language used to retrieve information about device/module twins and jobs from your IoT hub.
author: fsautomata
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 02/26/2018
ms.author: elioda
---

# IoT Hub query language for device and module twins, jobs, and message routing

IoT Hub provides a powerful SQL-like language to retrieve information regarding [device twins](iot-hub-devguide-device-twins.md) and [jobs](iot-hub-devguide-jobs.md), and [message routing](iot-hub-devguide-messages-d2c.md). This article presents:

* An introduction to the major features of the IoT Hub query language, and
* The detailed description of the language. For details on query language for message routing, see [queries in message routing](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Device and module twin queries

[Device twins](iot-hub-devguide-device-twins.md) and module twins can contain arbitrary JSON objects as both tags and properties. IoT Hub enables you to query device twins and module twins as a single JSON document containing all twin information.

Assume, for instance, that your IoT hub device twins have the following structure (module twin would be similar just with an additional moduleId):

```json
{
    "deviceId": "myDeviceId",
    "etag": "AAAAAAAAAAc=",
    "status": "enabled",
    "statusUpdateTime": "0001-01-01T00:00:00",    
    "connectionState": "Disconnected",    
    "lastActivityTime": "0001-01-01T00:00:00",
    "cloudToDeviceMessageCount": 0,
    "authenticationType": "sas",    
    "x509Thumbprint": {    
        "primaryThumbprint": null,
        "secondaryThumbprint": null
    },
    "version": 2,
    "tags": {
        "location": {
            "region": "US",
            "plant": "Redmond43"
        }
    },
    "properties": {
        "desired": {
            "telemetryConfig": {
                "configId": "db00ebf5-eeeb-42be-86a1-458cccb69e57",
                "sendFrequencyInSecs": 300
            },
            "$metadata": {
            ...
            },
            "$version": 4
        },
        "reported": {
            "connectivity": {
                "type": "cellular"
            },
            "telemetryConfig": {
                "configId": "db00ebf5-eeeb-42be-86a1-458cccb69e57",
                "sendFrequencyInSecs": 300,
                "status": "Success"
            },
            "$metadata": {
            ...
            },
            "$version": 7
        }
    }
}
```

### Device twin queries

IoT Hub exposes the device twins as a document collection called **devices**. For example, the following query retrieves the whole set of device twins:

```sql
SELECT * FROM devices
```

> [!NOTE]
> [Azure IoT SDKs](iot-hub-devguide-sdks.md) support paging of large results.

IoT Hub allows you to retrieve device twins filtering with arbitrary conditions. For instance, to receive device twins where the **location.region** tag is set to **US** use the following query:

```sql
SELECT * FROM devices
WHERE tags.location.region = 'US'
```

Boolean operators and arithmetic comparisons are supported as well. For example, to retrieve device twins located in the US and configured to send telemetry less than every minute, use the following query:

```sql
SELECT * FROM devices
  WHERE tags.location.region = 'US'
    AND properties.reported.telemetryConfig.sendFrequencyInSecs >= 60
```

As a convenience, it is also possible to use array constants with the **IN** and **NIN** (not in) operators. For instance, to retrieve device twins that report WiFi or wired connectivity use the following query:

```sql
SELECT * FROM devices
  WHERE properties.reported.connectivity IN ['wired', 'wifi']
```

It is often necessary to identify all device twins that contain a specific property. IoT Hub supports the function `is_defined()` for this purpose. For instance, to retrieve device twins that define the `connectivity` property use the following query:

```SQL
SELECT * FROM devices
  WHERE is_defined(properties.reported.connectivity)
```

Refer to the [WHERE clause](iot-hub-devguide-query-language.md#where-clause) section for the full reference of the filtering capabilities.

Grouping and aggregations are also supported. For instance, to find the count of devices in each telemetry configuration status, use the following query:

```sql
SELECT properties.reported.telemetryConfig.status AS status,
    COUNT() AS numberOfDevices
  FROM devices
  GROUP BY properties.reported.telemetryConfig.status
```

This grouping query would return a result similar to the following example:

```json
[
    {
        "numberOfDevices": 3,
        "status": "Success"
    },
    {
        "numberOfDevices": 2,
        "status": "Pending"
    },
    {
        "numberOfDevices": 1,
        "status": "Error"
    }
]
```

In this example, three devices reported successful configuration, two are still applying the configuration, and one reported an error.

Projection queries allow developers to return only the properties they care about. For example, to retrieve the last activity time of all disconnected devices use the following query:

```sql
SELECT LastActivityTime FROM devices WHERE status = 'enabled'
```

### Module twin queries

Querying on module twins is similar to querying on device twins, but using a different collection/namespace, i.e. instead of “from devices” you can query device.modules:

```sql
SELECT * FROM devices.modules
```

We don't allow join between the devices and devices.modules collections. If you want to query module twins across devices, you do it based on tags. This query will return all module twins across all devices with the scanning status:

```sql
Select * from devices.modules where properties.reported.status = 'scanning'
```

This query will return all module twins with the scanning status, but only on the specified subset of devices:

```sql
Select * from devices.modules 
  where properties.reported.status = 'scanning' 
  and deviceId IN ['device1', 'device2']
```

### C# example

The query functionality is exposed by the [C# service SDK](iot-hub-devguide-sdks.md) in the **RegistryManager** class.

Here is an example of a simple query:

```csharp
var query = registryManager.CreateQuery("SELECT * FROM devices", 100);
while (query.HasMoreResults)
{
    var page = await query.GetNextAsTwinAsync();
    foreach (var twin in page)
    {
        // do work on twin object
    }
}
```

The **query** object is instantiated with a page size (up to 100). Then multiple pages are retrieved by calling the **GetNextAsTwinAsync** methods multiple times.

The query object exposes multiple **Next** values, depending on the deserialization option required by the query. For example, device twin or job objects, or plain JSON when using projections.

### Node.js example

The query functionality is exposed by the [Azure IoT service SDK for Node.js](iot-hub-devguide-sdks.md) in the **Registry** object.

Here is an example of a simple query:

```nodejs
var query = registry.createQuery('SELECT * FROM devices', 100);
var onResults = function(err, results) {
    if (err) {
        console.error('Failed to fetch the results: ' + err.message);
    } else {
        // Do something with the results
        results.forEach(function(twin) {
            console.log(twin.deviceId);
        });

        if (query.hasMoreResults) {
            query.nextAsTwin(onResults);
        }
    }
};
query.nextAsTwin(onResults);
```

The **query** object is instantiated with a page size (up to 100). Then multiple pages are retrieved by calling the **nextAsTwin** method multiple times.

The query object exposes multiple **Next** values, depending on the deserialization option required by the query. For example, device twin or job objects, or plain JSON when using projections.

### Limitations

> [!IMPORTANT]
> Query results can have a few minutes of delay with respect to the latest values in device twins. If querying individual device twins by ID, use the retrieve device twin API. This API always contains the latest values and has higher throttling limits.

Currently, comparisons are supported only between primitive types (no objects), for instance `... WHERE properties.desired.config = properties.reported.config` is supported only if those properties have primitive values.

## Get started with jobs queries

[Jobs](iot-hub-devguide-jobs.md) provide a way to execute operations on sets of devices. Each device twin contains the information of the jobs of which it is part in a collection called **jobs**.

```json
{
    "deviceId": "myDeviceId",
    "etag": "AAAAAAAAAAc=",
    "tags": {
        ...
    },
    "properties": {
        ...
    },
    "jobs": [
        {
            "deviceId": "myDeviceId",
            "jobId": "myJobId",
            "jobType": "scheduleTwinUpdate",
            "status": "completed",
            "startTimeUtc": "2016-09-29T18:18:52.7418462",
            "endTimeUtc": "2016-09-29T18:20:52.7418462",
            "createdDateTimeUtc": "2016-09-29T18:18:56.7787107Z",
            "lastUpdatedDateTimeUtc": "2016-09-29T18:18:56.8894408Z",
            "outcome": {
                "deviceMethodResponse": null
            }
        },
        ...
    ]
}
```

Currently, this collection is queryable as **devices.jobs** in the IoT Hub query language.

> [!IMPORTANT]
> Currently, the jobs property is never returned when querying device twins. That is, queries that contain 'FROM devices'. The jobs property can only be accessed directly with queries using `FROM devices.jobs`.
>
>

For instance, to get all jobs (past and scheduled) that affect a single device, you can use the following query:

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.deviceId = 'myDeviceId'
```

Note how this query provides the device-specific status (and possibly the direct method response) of each job returned.

It is also possible to filter with arbitrary Boolean conditions on all object properties in the **devices.jobs** collection.

For instance, to retrieve all completed device twin update jobs that were created after September 2016 for a specific device, use the following query:

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.deviceId = 'myDeviceId'
    AND devices.jobs.jobType = 'scheduleTwinUpdate'
    AND devices.jobs.status = 'completed'
    AND devices.jobs.createdTimeUtc > '2016-09-01'
```

You can also retrieve the per-device outcomes of a single job.

```sql
SELECT * FROM devices.jobs
  WHERE devices.jobs.jobId = 'myJobId'
```

### Limitations

Currently, queries on **devices.jobs** do not support:

* Projections, therefore only `SELECT *` is possible.
* Conditions that refer to the device twin in addition to job properties (see the preceding section).
* Performing aggregations, such as count, avg, group by.

## Basics of an IoT Hub query

Every IoT Hub query consists of SELECT and FROM clauses, with optional WHERE and GROUP BY clauses. Every query is run on a collection of JSON documents, for example device twins. The FROM clause indicates the document collection to be iterated on (**devices** or **devices.jobs**). Then, the filter in the WHERE clause is applied. With aggregations, the results of this step are grouped as specified in the GROUP BY clause. For each group, a row is generated as specified in the SELECT clause.

```sql
SELECT <select_list>
  FROM <from_specification>
  [WHERE <filter_condition>]
  [GROUP BY <group_specification>]
```

## FROM clause

The **FROM <from_specification>** clause can assume only two values: **FROM devices** to query device twins, or **FROM devices.jobs** to query job per-device details.


## WHERE clause
The **WHERE <filter_condition>** clause is optional. It specifies one or more conditions that the JSON documents in the FROM collection must satisfy to be included as part of the result. Any JSON document must evaluate the specified conditions to "true" to be included in the result.

The allowed conditions are described in section [Expressions and conditions](iot-hub-devguide-query-language.md#expressions-and-conditions).

## SELECT clause

The **SELECT <select_list>** is mandatory and specifies what values are retrieved from the query. It specifies the JSON values to be used to generate new JSON objects.
For each element of the filtered (and optionally grouped) subset of the FROM collection, the projection phase generates a new JSON object. This object is constructed with the values specified in the SELECT clause.

Following is the grammar of the SELECT clause:

```
SELECT [TOP <max number>] <projection list>

<projection_list> ::=
    '*'
    | <projection_element> AS alias [, <projection_element> AS alias]+

<projection_element> :==
    attribute_name
    | <projection_element> '.' attribute_name
    | <aggregate>

<aggregate> :==
    count()
    | avg(<projection_element>)
    | sum(<projection_element>)
    | min(<projection_element>)
    | max(<projection_element>)
```

**Attribute_name** refers to any property of the JSON document in the FROM collection. Some examples of SELECT clauses can be found in the [Getting started with device twin queries](iot-hub-devguide-query-language.md#get-started-with-device-twin-queries) section.

Currently, selection clauses different than **SELECT*** are only supported in aggregate queries on device twins.

## GROUP BY clause
The **GROUP BY <group_specification>** clause is an optional step that executes after the filter specified in the WHERE clause, and before the projection specified in the SELECT. It groups documents based on the value of an attribute. These groups are used to generate aggregated values as specified in the SELECT clause.

An example of a query using GROUP BY is:

```sql
SELECT properties.reported.telemetryConfig.status AS status,
    COUNT() AS numberOfDevices
FROM devices
GROUP BY properties.reported.telemetryConfig.status
```

The formal syntax for GROUP BY is:

```
GROUP BY <group_by_element>
<group_by_element> :==
    attribute_name
    | < group_by_element > '.' attribute_name
```

**Attribute_name** refers to any property of the JSON document in the FROM collection.

Currently, the GROUP BY clause is only supported when querying device twins.

## Expressions and conditions
At a high level, an *expression*:

* Evaluates to an instance of a JSON type (such as Boolean, number, string, array, or object).
* Is defined by manipulating data coming from the device JSON document and constants using built-in operators and functions.

*Conditions* are expressions that evaluate to a Boolean. Any constant different than Boolean **true** is considered as **false**. This rule includes **null**, **undefined**, any object or array instance, any string, and the Boolean **false**.

The syntax for expressions is:

```
<expression> ::=
    <constant> |
    attribute_name |
    <function_call> |
    <expression> binary_operator <expression> |
    <create_array_expression> |
    '(' <expression> ')'

<function_call> ::=
    <function_name> '(' expression ')'

<constant> ::=
    <undefined_constant>
    | <null_constant>
    | <number_constant>
    | <string_constant>
    | <array_constant>

<undefined_constant> ::= undefined
<null_constant> ::= null
<number_constant> ::= decimal_literal | hexadecimal_literal
<string_constant> ::= string_literal
<array_constant> ::= '[' <constant> [, <constant>]+ ']'
```

To understand what each symbol in the expressions syntax stands for, refer to the following table:

| Symbol | Definition |
| --- | --- |
| attribute_name | Any property of the JSON document in the **FROM** collection. |
| binary_operator | Any binary operator listed in the [Operators](#operators) section. |
| function_name| Any function listed in the [Functions](#functions) section. |
| decimal_literal |A float expressed in decimal notation. |
| hexadecimal_literal |A number expressed by the string ‘0x’ followed by a string of hexadecimal digits. |
| string_literal |String literals are Unicode strings represented by a sequence of zero or more Unicode characters or escape sequences. String literals are enclosed in single quotes or double quotes. Allowed escapes: `\'`, `\"`, `\\`, `\uXXXX` for Unicode characters defined by 4 hexadecimal digits. |

### Operators
The following operators are supported:

| Family | Operators |
| --- | --- |
| Arithmetic |+, -, *, /, % |
| Logical |AND, OR, NOT |
| Comparison |=, !=, <, >, <=, >=, <> |

### Functions
When querying twins and jobs the only supported function is:

| Function | Description |
| -------- | ----------- |
| IS_DEFINED(property) | Returns a Boolean indicating if the property has been assigned a value (including `null`). |

In routes conditions, the following math functions are supported:

| Function | Description |
| -------- | ----------- |
| ABS(x) | Returns the absolute (positive) value of the specified numeric expression. |
| EXP(x) | Returns the exponential value of the specified numeric expression (e^x). |
| POWER(x,y) | Returns the value of the specified expression to the specified power (x^y).|
| SQUARE(x)	| Returns the square of the specified numeric value. |
| CEILING(x) | Returns the smallest integer value greater than, or equal to, the specified numeric expression. |
| FLOOR(x) | Returns the largest integer less than or equal to the specified numeric expression. |
| SIGN(x) | Returns the positive (+1), zero (0), or negative (-1) sign of the specified numeric expression.|
| SQRT(x) | Returns the square root of the specified numeric value. |

In routes conditions, the following type checking and casting functions are supported:

| Function | Description |
| -------- | ----------- |
| AS_NUMBER | Converts the input string to a number. `noop` if input is a number; `Undefined` if string does not represent a number.|
| IS_ARRAY | Returns a Boolean value indicating if the type of the specified expression is an array. |
| IS_BOOL | Returns a Boolean value indicating if the type of the specified expression is a Boolean. |
| IS_DEFINED | Returns a Boolean indicating if the property has been assigned a value. |
| IS_NULL | Returns a Boolean value indicating if the type of the specified expression is null. |
| IS_NUMBER | Returns a Boolean value indicating if the type of the specified expression is a number. |
| IS_OBJECT | Returns a Boolean value indicating if the type of the specified expression is a JSON object. |
| IS_PRIMITIVE | Returns a Boolean value indicating if the type of the specified expression is a primitive (string, Boolean, numeric, or `null`). |
| IS_STRING | Returns a Boolean value indicating if the type of the specified expression is a string. |

In routes conditions, the following string functions are supported:

| Function | Description |
| -------- | ----------- |
| CONCAT(x, y, …) | Returns a string that is the result of concatenating two or more string values. |
| LENGTH(x) | Returns the number of characters of the specified string expression.|
| LOWER(x) | Returns a string expression after converting uppercase character data to lowercase. |
| UPPER(x) | Returns a string expression after converting lowercase character data to uppercase. |
| SUBSTRING(string, start [, length]) | Returns part of a string expression starting at the specified character zero-based position and continues to the specified length, or to the end of the string. |
| INDEX_OF(string, fragment) | Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string is not found.|
| STARTS_WITH(x, y) | Returns a Boolean indicating whether the first string expression starts with the second. |
| ENDS_WITH(x, y) | Returns a Boolean indicating whether the first string expression ends with the second. |
| CONTAINS(x,y) | Returns a Boolean indicating whether the first string expression contains the second. |

## Next steps

Learn how to execute queries in your apps using [Azure IoT SDKs](iot-hub-devguide-sdks.md).
