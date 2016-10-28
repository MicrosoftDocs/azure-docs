<properties
 pageTitle="Developer guide - query language | Microsoft Azure"
 description="Azure IoT Hub developer guide - description of query language used to retrieve information about twins, methods, and jobs from your IoT hub"
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="elioda"/>

# Reference - query language for twins and jobs

## Overview

IoT Hub provides a powerful SQL-like language to retrieve information regarding [device twins][lnk-twins] and [jobs][lnk-jobs]. This article presents:

* An introduction to the major features of IoT Hub's query language, and
* The detailed description of the language.

## Getting started with twin queries

[Device twins][lnk-twins] can contain arbitrary JSON objects as both tags and properties. IoT Hub allows to query device twins as a single JSON document containing all twin information.
Assume, for instance, that your IoT hub twins have the following structure:

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

> [AZURE.NOTE] [IoT Hub SDKs][lnk-hub-sdks] support paging of large results.

IoT Hub allows to retrieve twins filtering with arbitrary conditions. For instance,

        SELECT * FROM devices
        WHERE tags.location.region = 'US'

retrieves the twins with the **location.region** tag set to **US**.
Boolean operators and arithmetic comparisons are supported as well, e.g.

        SELECT * FROM devices
        WHERE tags.location.region = 'US'
            AND properties.reported.telemetryConfig.sendFrequencyInSecs >= 60

retrieves all twins located in the US configured to send telemetry less often than every minute. As a convenience, it is also possible to use array constants in conjunction with the **IN** and **NIN** (not in) operators. For instance,

        SELECT * FROM devices
        WHERE property.reported.connectivity IN ['wired', 'wifi']

retrieves all twins that reported wifi or wired connectivity. Refer to the [WHERE clause][lnk-query-where] section for the full reference of the filtering capabilities.

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

The example above illustrates a situation where three devices reported successfull configuration, two are still applying the configuration, and one reported an error.

### C# example

The query functionality is exposed by the [C# service SDK][lnk-hub-sdks] in the the **RegistryManager** class.
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
It is important to note that the query object exposes multiple **Next\***, depending on the deserialization option required by the query, i.e. twin or job objects, or plain Json to be used when using projections.

### Node example

The query functionality is exposed by the [Node service SDK][lnk-hub-sdks] in the the **Registry** object.
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
It is important to note that the query object exposes multiple **next\***, depending on the deserialization option required by the query, i.e. twin or job objects, or plain Json to be used when using projections.

### Limitations

Currently, projections are only supported when using aggregations, i.e. non-aggregated queries can only use `SELECT *`. Also, aggregation are only supported in conjunction with grouping.

## Getting started with jobs queries

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

Currently, this collection is queriable as **devices.jobs** in the IoT Hub query language.

For instance, to get all jobs (past and scheduled) that affect a single device, you can use the following query:

        SELECT * FROM devices.jobs
        WHERE devices.jobs.deviceId = 'myDeviceId'

Note how this query provides the device-specific status (and possibly the direct method response) of each job returned.
It is also possible to filter with arbitrary Boolean conditions on all properties of the objects in the **devices.jobs** collection.
For instance, the following query:

        SELECT * FROM devices.jobs
        WHERE devices.jobs.deviceId = 'myDeviceId'
            AND devices.jobs.jobType = 'scheduleTwinUpdate'
            AND devices.jobs.status = 'completed'
            AND devices.jobs.createdTimeUtc > '2016-09-01'

retrieves all completed twin update jobs for device **myDeviceId** that were created after September 2016.

It is also possible to retrieve the per-device outcomes of a single job.

        SELECT * FROM devices.jobs
        WHERE devices.jobs.jobId = 'myJobId'

### Limitations
Currently, queries on **devices.jobs** do not support:

* Projections, i.e. only `SELECT *` is possible;
* Conditions that refer to the device twin in addition to job properties as shown above;
* Peforming aggregations, e.g. count, avg, group by.

## Basics of an IoT Hub query

Every IoT Hub query consists of a SELECT and FROM clauses and by optional WHERE and GROUP BY clauses. Every query is run on a collection of JSON documents, e.g. device twins. The FROM clause indicates the document collection to be iterated on (**devices** or **devices.jobs**). Then, the filter in the WHERE clause is applied. In the case of aggregations, the results of this step are grouped as specified in the GROUP BY clause and, for each group, a row is generated as specified in the SELECT clause.

        SELECT <select_list>
        FROM <from_specification>
        [WHERE <filter_condition>]
        [GROUP BY <group_specification>]

## FROM clause

The **FROM <from_specification>** clause can assume only two values: **FROM devices**, to query device twins, or **FROM devices.jobs**, to query job per-device details.

## WHERE clause

The **WHERE <filter_condition>** clause is optional. It specifies the condition(s) that the JSON documents in the FROM collection must satisfy in order to be included as part of the result. Any JSON document must evaluate the specified conditions to "true" to be included in the result.

The allowed conditions are described in section [Expressions and conditions][lnk-query-expressions].

## SELECT clause

The SELECT clause (**SELECT <select_list>**) is mandatory and specifies what values will be retrieved from the query. It specifies the JSON values to be used to generate new JSON objects 
For each element of the filtered (and optionally grouped) subset of the FROM collection, the projection phase generates a new JSON object, constructed with the values specified in the SELECT clause.

This is the grammar of the SELECT clause:

        SELECT [TOP <max number>] <projection list>

        <projection_list> ::=
            '*'
            | <projection_element> AS alias [, <projection_element> AS alias]+

        <projection_element> :==
            attribute_name
            | <projection_element> '.' attribute_name
            | <aggregate>

        <aggregate> :==
            count(<projection_element>) | count()
            | avg(<projection_element>) | avg()
            | sum(<projection_element>) | sum()
            | min(<projection_element>) | min()
            | max(<projection_element>) | max()

where **attribute_name** refers to any property of the JSON document in the FROM collection. Some examples of SELECT clauses can be found in the [Getting started with twin queries][lnk-query-getstarted] section.

Currently, selection clauses different than **SELECT \*** are only supported in aggregate queries on twins.

## GROUP BY clause

The **GROUP BY <group_specification>** clause is an optional step that is can be executed after the filter specified in the WHERE clause, and before the projection specified in the SELECT. It groups documents based on the value of an attribute. These groups are used to generate aggregated values as specified in the SELECT clause.

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

Currently, the GROUP BY clause is only supported when querying twins.

## Expressions and conditions

At a high level, an *expression*:

* Evaluates to an instance of a JSON type (i.e. Boolean, number, string, array, or object), and
* Is defined by manipulating data coming from the device JSON document and constants using built-in operators and functions.

*Conditions* are expressions that evaluates to a Boolean, i.e. any constant different than Boolean **true** is considered as **false** (incl. **null**, **undefined**, any object or array instance, any string, and clearly the Boolean **false**).

The syntax for expressions is:

        <expression> ::=
            <constant> |
            attribute_name |
            unary_operator <expression> |
            <expression> binary_operator <expression> |
            <create_array_expression> |
            '(' <expression> ')'

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
| -------------- | -----------------|
| attribute_name | Any property of the JSON document in the FROM collection. |
| unary_operator | Any unary operator as per Operators section. |
| binary_operator | Any binary operator as per Operators section. |
| decimal_literal | A float expressed in decimal notation. |
| hexadecimal_literal | A number expressed by the string ‘0x’ followed by a string of hexadecimal digits. |
| string_literal | String literals are Unicode strings represented by a sequence of zero or more Unicode characters or escape sequences. String literals are enclosed in single quotes (apostrophe: ' ) or double quotes (quotation mark: "). Allowed escapes: `\'`, `\"`, `\\`, `\uXXXX` for Unicode characters defined by 4 hexadecimal digits. |

### Operators

The following operators are supported:

| Family | Operators |
| -------------- | -----------------|
| Arithmetic | +,-,*,/,% |
| Logical | AND, OR, NOT |
| Comparison | 	=, !=, <, >, <=, >=, <> |

## Next steps

Learn how to execute queries in your apps using [IoT Hub SDKs][lnk-hub-sdks].

[lnk-query-where]: iot-hub-devguide-query-language.md#where-clause
[lnk-query-expressions]: iot-hub-devguide-query-language.md#expressions-and-conditions
[lnk-query-getstarted]: iot-hub-devguide-query-language.md#getting-started-with-twin-queries

[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-jobs]: iot-hub-devguide-jobs.md
[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md

[lnk-hub-sdks]: iot-hub-devguide-sdks.md