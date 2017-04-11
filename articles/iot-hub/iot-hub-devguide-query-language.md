---
title: Understand the Azure IoT Hub query language | Microsoft Docs
description: Developer guide - description of the SQL-like IoT Hub query language used to retrieve information about device twins and jobs from your IoT hub.
services: iot-hub
documentationcenter: .net
author: fsautomata
manager: timlt
editor: ''

ms.assetid: 851a9ed3-b69e-422e-8a5d-1d79f91ddf15
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/30/2016
ms.author: elioda

---
# Reference - IoT Hub query language for device twins and jobs
## Overview
IoT Hub provides a powerful SQL-like language to retrieve information regarding [device twins][lnk-twins] and [jobs][lnk-jobs]. This article presents:

* An introduction to the major features of the IoT Hub query language, and
* The detailed description of the language.

## Get started with device twin queries
[Device twins][lnk-twins] can contain arbitrary JSON objects as both tags and properties. IoT Hub enables you to query device twins as a single JSON document containing all device twin information.
Assume, for instance, that your IoT hub device twins have the following structure:

        {                                                                      
            "deviceId": "myDeviceId",                                            
            "etag": "AAAAAAAAAAc=",                                              
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

IoT Hub exposes the device twins as a document collection called **devices**.
So the following query retrieves the whole set of device twins:

        SELECT * FROM devices

> [!NOTE]
> [Azure IoT SDKs][lnk-hub-sdks] support paging of large results.
>
>

IoT Hub allows you to retrieve device twins filtering with arbitrary conditions. For instance,

        SELECT * FROM devices
        WHERE tags.location.region = 'US'

retrieves the device twins with the **location.region** tag set to **US**.
Boolean operators and arithmetic comparisons are supported as well, for example

        SELECT * FROM devices
        WHERE tags.location.region = 'US'
            AND properties.reported.telemetryConfig.sendFrequencyInSecs >= 60

retrieves all device twins located in the US configured to send telemetry less often than every minute. As a convenience, it is also possible to use array constants with the **IN** and **NIN** (not in) operators. For instance,

        SELECT * FROM devices
        WHERE property.reported.connectivity IN ['wired', 'wifi']

retrieves all device twins that reported WiFi or wired connectivity. It is often necessary to identify all device twins that contain a specific property. IoT Hub supports the function `is_defined()` for this purpose. For instance,

        SELECT * FROM devices
        WHERE is_defined(property.reported.connectivity)

retrieved all device twins that define the `connectivity` reported property. Refer to the [WHERE clause][lnk-query-where] section for the full reference of the filtering capabilities.

Grouping and aggregations are also supported. For instance,

        SELECT properties.reported.telemetryConfig.status AS status,
            COUNT() AS numberOfDevices
        FROM devices
        GROUP BY properties.reported.telemetryConfig.status

returns the count of the devices in each telemetry configuration status.

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

The preceding example illustrates a situation where three devices reported successful configuration, two are still applying the configuration, and one reported an error.

### C# example
The query functionality is exposed by the [C# service SDK][lnk-hub-sdks] in the **RegistryManager** class.
Here is an example of a simple query:

        var query = registryManager.CreateQuery("SELECT * FROM devices", 100);
        while (query.HasMoreResults)
        {
            var page = await query.GetNextAsTwinAsync();
            foreach (var twin in page)
            {
                // do work on twin object
            }
        }

Note how the **query** object is instantiated with a page size (up to 1000), and then multiple pages can be retrieved by calling the **GetNextAsTwinAsync** methods multiple times.
Note that the query object exposes multiple **Next\***, depending on the deserialization option required by the query, such as device twin or job objects, or plain JSON to be used when using projections.

### Node.js example
The query functionality is exposed by the [Azure IoT service SDK for Node.js][lnk-hub-sdks] in the **Registry** object.
Here is an example of a simple query:

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

Note how the **query** object is instantiated with a page size (up to 1000), and then multiple pages can be retrieved by calling the **nextAsTwin** methods multiple times.
Note that the query object exposes multiple **next\***, depending on the deserialization option required by the query, such as device twin or job objects, or plain JSON to be used when using projections.

### Limitations
> [!IMPORTANT]
> Query results can have a few minutes of delay with respect to the latest values in device twins. If querying individual device twins by id, it is always preferable to use the retrieve device twin API, which always contains the latest values and has higher throttling limits.
>
>

Currently, comparisons are supported only between primitive types (no objects), for instance `... WHERE properties.desired.config = properties.reported.config` is supported only if those properties have primitive values.

## Get started with jobs queries
[Jobs][lnk-jobs] provide a way to execute operations on sets of devices. Each device twin contains the information of the jobs of which it is part in a collection called **jobs**.
Logically,

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

Currently, this collection is queryable as **devices.jobs** in the IoT Hub query language.

> [!IMPORTANT]
> Currently, the jobs property is never returned when querying device twins (that is, queries that contains 'FROM devices'). It can only be accessed directly with queries using `FROM devices.jobs`.
>
>

For instance, to get all jobs (past and scheduled) that affect a single device, you can use the following query:

        SELECT * FROM devices.jobs
        WHERE devices.jobs.deviceId = 'myDeviceId'

Note how this query provides the device-specific status (and possibly the direct method response) of each job returned.
It is also possible to filter with arbitrary Boolean conditions on all object properties in the **devices.jobs** collection.
For instance, the following query:

        SELECT * FROM devices.jobs
        WHERE devices.jobs.deviceId = 'myDeviceId'
            AND devices.jobs.jobType = 'scheduleTwinUpdate'
            AND devices.jobs.status = 'completed'
            AND devices.jobs.createdTimeUtc > '2016-09-01'

retrieves all completed device twin update jobs for device **myDeviceId** that were created after September 2016.

It is also possible to retrieve the per-device outcomes of a single job.

        SELECT * FROM devices.jobs
        WHERE devices.jobs.jobId = 'myJobId'

### Limitations
Currently, queries on **devices.jobs** do not support:

* Projections, therefore only `SELECT *` is possible.
* Conditions that refer to the device twin in addition to job properties (see the preceding section).
* Performing aggregations, such as count, avg, group by.

## Get started with device-to-cloud message routes query expressions

Using [device-to-cloud routes][lnk-devguide-messaging-routes], you can configure IoT Hub to dispatch device-to-cloud messages to different endpoints based on expressions evaluated against individual messages.

The route [condition][lnk-query-expressions] uses the same IoT Hub query language as conditions in twin and job queries. Route conditions are evaluated on the message properties assuming the following JSON representation:

        {
            "$messageId": "",
            "$enqueuedTime": "",
            "$to": "",
            "$expiryTimeUtc": "",
            "$correlationId": "",
            "$userId": "",
            "$ack": "",
            "$connectionDeviceId": "",
            "$connectionDeviceGenerationId": "",
            "$connectionAuthMethod": "",
            "$content-type": "",
            "$content-encoding": ""

            "userProperty1": "",
            "userProperty2": ""
        }

Message system properties are prefixed with the `'$'` symbol.
User properties are always accessed with their name. If a user property name happens to coincide with a system property (such as `$to`), the user property will be retrieved with the `$to` expression.
You can always access the system property using brackets `{}`: for instance, you can use the expression `{$to}` to access the system property `to`. Bracketed property names always retrieve the corresponding system property.

Remember that property names are case insensitive.

> [!NOTE]
> All message properties are strings. System properties, as described in the [developer guide][lnk-devguide-messaging-format], are currently not available to use in queries.
>

For example, if you use a `messageType` property, you might want to route all telemetry to one endpoint, and all alerts to another endpoint. You can write the following expression to route the telemetry:

        messageType = 'telemetry'

And the following expression to route the alert messages:

        messageType = 'alert'

Boolean expressions and functions are also supported. This feature enables you to distinguish between severity level, for example:

        messageType = 'alerts' AND as_number(severity) <= 2

Refer to the [Expression and conditions][lnk-query-expressions] section for the full list of supported operators and functions.

## Basics of an IoT Hub query
Every IoT Hub query consists of a SELECT and FROM clauses and by optional WHERE and GROUP BY clauses. Every query is run on a collection of JSON documents, for example device twins. The FROM clause indicates the document collection to be iterated on (**devices** or **devices.jobs**). Then, the filter in the WHERE clause is applied. With aggregations, the results of this step are grouped as specified in the GROUP BY clause and, for each group, a row is generated as specified in the SELECT clause.

        SELECT <select_list>
        FROM <from_specification>
        [WHERE <filter_condition>]
        [GROUP BY <group_specification>]

## FROM clause
The **FROM <from_specification>** clause can assume only two values: **FROM devices**, to query device twins, or **FROM devices.jobs**, to query job per-device details.

## WHERE clause
The **WHERE <filter_condition>** clause is optional. It specifies one or more conditions that the JSON documents in the FROM collection must satisfy to be included as part of the result. Any JSON document must evaluate the specified conditions to "true" to be included in the result.

The allowed conditions are described in section [Expressions and conditions][lnk-query-expressions].

## SELECT clause
The SELECT clause (**SELECT <select_list>**) is mandatory and specifies what values are retrieved from the query. It specifies the JSON values to be used to generate new JSON objects.
For each element of the filtered (and optionally grouped) subset of the FROM collection, the projection phase generates a new JSON object, constructed with the values specified in the SELECT clause.

Following is the grammar of the SELECT clause:

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

where **attribute_name** refers to any property of the JSON document in the FROM collection. Some examples of SELECT clauses can be found in the [Getting started with device twin queries][lnk-query-getstarted] section.

Currently, selection clauses different than **SELECT \*** are only supported in aggregate queries on device twins.

## GROUP BY clause
The **GROUP BY <group_specification>** clause is an optional step that can be executed after the filter specified in the WHERE clause, and before the projection specified in the SELECT. It groups documents based on the value of an attribute. These groups are used to generate aggregated values as specified in the SELECT clause.

An example of a query using GROUP BY is:

        SELECT properties.reported.telemetryConfig.status AS status,
            COUNT() AS numberOfDevices
        FROM devices
        GROUP BY properties.reported.telemetryConfig.status

The formal syntax for GROUP BY is:

        GROUP BY <group_by_element>
        <group_by_element> :==
            attribute_name
            | < group_by_element > '.' attribute_name

where **attribute_name** refers to any property of the JSON document in the FROM collection.

Currently, the GROUP BY clause is only supported when querying device twins.

## Expressions and conditions
At a high level, an *expression*:

* Evaluates to an instance of a JSON type (such as Boolean, number, string, array, or object), and
* Is defined by manipulating data coming from the device JSON document and constants using built-in operators and functions.

*Conditions* are expressions that evaluate to a Boolean. Any constant different than Boolean **true** is considered as **false** (including **null**, **undefined**, any object or array instance, any string, and clearly the Boolean **false**).

The syntax for expressions is:

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

where:

| Symbol | Definition |
| --- | --- |
| attribute_name | Any property of the JSON document in the **FROM** collection. |
| binary_operator | Any binary operator listed in the [Operators](#operators) section. |
| function_name| Any function listed in the [Functions](#functions) section. |
| decimal_literal |A float expressed in decimal notation. |
| hexadecimal_literal |A number expressed by the string ‘0x’ followed by a string of hexadecimal digits. |
| string_literal |String literals are Unicode strings represented by a sequence of zero or more Unicode characters or escape sequences. String literals are enclosed in single quotes (apostrophe: ' ) or double quotes (quotation mark: "). Allowed escapes: `\'`, `\"`, `\\`, `\uXXXX` for Unicode characters defined by 4 hexadecimal digits. |

### Operators
The following operators are supported:

| Family | Operators |
| --- | --- |
| Arithmetic |+,-,*,/,% |
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
| SQRT(x) | Returns the square of the specified numeric value. |

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
| IS_PRIMITIVE | Returns a Boolean value indicating if the type of the specified expression is a primitive (string, Boolean, numeric or `null`). |
| IS_STRING | Returns a Boolean value indicating if the type of the specified expression is a string. |

In routes conditions, the following string functions are supported:

| Function | Description |
| -------- | ----------- |
| CONCAT(x, …) | Returns a string that is the result of concatenating two or more string values. |
| LENGTH(x) | Returns the number of characters of the specified string expression.|
| LOWER(x) | Returns a string expression after converting uppercase character data to lowercase. |
| UPPER(x) | Returns a string expression after converting lowercase character data to uppercase. |
| SUBSTRING(string, start [, length]) | Returns part of a string expression starting at the specified character zero-based position and continues to the specified length, or to the end of the string. |
| INDEX_OF(string, fragment) | Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string is not found.|
| STARTS_WITH(x, y) | Returns a Boolean indicating whether the first string expression starts with the second. |
| ENDS_WITH(x, y) | Returns a Boolean indicating whether the first string expression ends with the second. |
| CONTAINS(x,y) | Returns a Boolean indicating whether the first string expression contains the second. |

## Next steps
Learn how to execute queries in your apps using [Azure IoT SDKs][lnk-hub-sdks].

[lnk-query-where]: iot-hub-devguide-query-language.md#where-clause
[lnk-query-expressions]: iot-hub-devguide-query-language.md#expressions-and-conditions
[lnk-query-getstarted]: iot-hub-devguide-query-language.md#get-started-with-device-twin-queries

[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-jobs]: iot-hub-devguide-jobs.md
[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-devguide-messaging-routes]: iot-hub-devguide-messaging.md#routing-rules
[lnk-devguide-messaging-format]: iot-hub-devguide-messaging.md#message-format


[lnk-hub-sdks]: iot-hub-devguide-sdks.md
