---
title: Understand the Azure IoT Hub query language
description: This article provides a description of the SQL-like IoT Hub query language used to retrieve information about device/module twins and jobs from your IoT hub.
author: kgremban

ms.service: iot-hub
ms.topic: concept-article
ms.date: 09/29/2022
ms.author: kgremban
ms.custom: devx-track-csharp
---

# IoT Hub query language for device and module twins, jobs, and message routing

IoT Hub provides a powerful SQL-like language to retrieve information regarding [device twins](iot-hub-devguide-device-twins.md), [module twins](iot-hub-devguide-module-twins.md), [jobs](iot-hub-devguide-jobs.md), and [message routing](iot-hub-devguide-messages-d2c.md). This article presents:

* An introduction to the major features of the IoT Hub query language, and
* The detailed description of the language. For details on query language for message routing, see [queries in message routing](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

For specific examples, see [Queries for device and module twins](query-twins.md) or [Queries for jobs](query-jobs.md).

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Run IoT Hub queries

You can run queries against your IoT hub directly in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
1. Select **Queries** from the **Device management** section of the navigation menu.
1. Enter your query in the text box and select **Run query**.

You also can run queries within your applications using the Azure IoT service SDKs and service APIs.

For example code implementing IoT Hub queries, see the [Query examples with the service SDKs](#query-examples-with-the-service-sdks) section.

For links to SDK reference pages and samples, see [Azure IoT SDKs](iot-hub-devguide-sdks.md).

## Basics of an IoT Hub query

Every IoT Hub query consists of SELECT and FROM clauses, with optional WHERE and GROUP BY clauses.

Queries are run on a collection of JSON documents, for example device twins. The FROM clause indicates the document collection to be iterated on (either **devices**, **devices.modules**, or **devices.jobs**).

Then, the filter in the WHERE clause is applied. With aggregations, the results of this step are grouped as specified in the GROUP BY clause. For each group, a row is generated as specified in the SELECT clause.

```sql
SELECT <select_list>
  FROM <from_specification>
  [WHERE <filter_condition>]
  [GROUP BY <group_specification>]
```

### SELECT clause

The **SELECT <select_list>** clause is required in every IoT Hub query. It specifies what values are retrieved from the query. It specifies the JSON values to be used to generate new JSON objects.
For each element of the filtered (and optionally grouped) subset of the FROM collection, the projection phase generates a new JSON object. This object is constructed with the values specified in the SELECT clause.

For example:

* Return all values

  ```sql
  SELECT *
  ```

* Return specific properties

  ```sql
  SELECT DeviceID, LastActivityTime
  ```

* Aggregate the results of a query to return a count

  ```sql
  SELECT COUNT() as TotalNumber
  ```

Currently, selection clauses different than **SELECT** are only supported in aggregate queries on device twins.

The following syntax is the grammar of the SELECT clause:

```query syntax
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

**Attribute_name** refers to any property of the JSON document in the FROM collection.

### FROM clause

The **FROM <from_specification>** clause is required in every ioT Hub query. It must be one of three values:

* **devices** to query device twins
* **devices.modules** to query module twins
* **devices.jobs** to query job per-device details

For example:

* Retrieve all device twins

  ```sql
  SELECT * FROM devices
  ```

### WHERE clause

The **WHERE <filter_condition>** clause is optional. It specifies one or more conditions that the JSON documents in the FROM collection must satisfy to be included as part of the result. Any JSON document must evaluate the specified conditions to "true" to be included in the result.

For example:

* Retrieve all jobs that target a specific device

  ```sql
  SELECT * FROM devices.jobs
    WHERE devices.jobs.deviceId = 'myDeviceId'
  ```

The allowed conditions are described in the [expressions and conditions](#expressions-and-conditions) section.

### GROUP BY clause

The **GROUP BY <group_specification>** clause is optional. This clause executes after the filter specified in the WHERE clause, and before the projection specified in the SELECT. It groups documents based on the value of an attribute. These groups are used to generate aggregated values as specified in the SELECT clause.

For example:

* Return the count of devices that are reporting each telemetry configuration status

  ```sql
  SELECT properties.reported.telemetryConfig.status AS status,
    COUNT() AS numberOfDevices
  FROM devices
  GROUP BY properties.reported.telemetryConfig.status
  ```

Currently, the GROUP BY clause is only supported when querying device twins.

> [!CAUTION]
> The term `group` is currently treated as a special keyword in queries. In case, you use `group` as your property name, consider surrounding it with double brackets to avoid errors, e.g., `SELECT * FROM devices WHERE tags.[[group]].name = 'some_value'`.

The formal syntax for GROUP BY is:

```query syntax
GROUP BY <group_by_element>
<group_by_element> :==
    attribute_name
    | < group_by_element > '.' attribute_name
```

**Attribute_name** refers to any property of the JSON document in the FROM collection.

### Query results pagination

A query object is instantiated with a max page size of **less than** or **equal to** 100 records. To obtain multiple pages, call the [nextAsTwin](device-twins-node.md#create-a-service-app-that-updates-desired-properties-and-queries-twins) on Node.js SDK or [GetNextAsTwinAsync](device-twins-dotnet.md#create-a-service-app-that-updates-desired-properties-and-queries-twins) on .Net SDK method multiple times.
A query object can expose multiple Next values, depending on the deserialization option required by the query. For example, a query object can return device twin or job objects, or plain JSON when using projections.

## Expressions and conditions

At a high level, an *expression*:

* Evaluates to an instance of a JSON type (such as Boolean, number, string, array, or object).
* Is defined by manipulating data coming from the device JSON document and constants using built-in operators and functions.

*Conditions* are expressions that evaluate to a Boolean. Any constant different than Boolean **true** is considered as **false**. This rule includes **null**, **undefined**, any object or array instance, any string, and the Boolean **false**.

The syntax for expressions is:

```query syntax
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
| hexadecimal_literal |A number expressed by the string '0x' followed by a string of hexadecimal digits. |
| string_literal | Unicode strings represented by a sequence of zero or more Unicode characters or escape sequences. String literals are enclosed in single quotes or double quotes. Allowed escapes: `\'`, `\"`, `\\`, `\uXXXX` for Unicode characters defined by four hexadecimal digits. |

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
| SQUARE(x)    | Returns the square of the specified numeric value. |
| CEILING(x) | Returns the smallest integer value greater than, or equal to, the specified numeric expression. |
| FLOOR(x) | Returns the largest integer less than or equal to the specified numeric expression. |
| SIGN(x) | Returns the positive (+1), zero (0), or negative (-1) sign of the specified numeric expression.|
| SQRT(x) | Returns the square root of the specified numeric value. |

In routes conditions, the following type checking and casting functions are supported:

| Function | Description |
| -------- | ----------- |
| AS_NUMBER | Converts the input string to a number. `noop` if input is a number; `Undefined` if string doesn't represent a number.|
| IS_ARRAY | Returns a Boolean value indicating if the type of the specified expression is an array. |
| IS_BOOL | Returns a Boolean value indicating if the type of the specified expression is a Boolean. |
| IS_DEFINED | Returns a Boolean indicating if the property has been assigned a value. This function is supported only when the value is a primitive type. Primitive types include string, Boolean, numeric, or `null`. DateTime, object types and arrays aren't supported. |
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
| INDEX_OF(string, fragment) | Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string isn't found.|
| STARTSWITH(x, y) | Returns a Boolean indicating whether the first string expression starts with the second. |
| ENDSWITH(x, y) | Returns a Boolean indicating whether the first string expression ends with the second. |
| CONTAINS(x,y) | Returns a Boolean indicating whether the first string expression contains the second. |

## Query examples with the service SDKs

### C# example

The query functionality is exposed by the [C# service SDK](iot-hub-devguide-sdks.md) in the **RegistryManager** class.

Here's an example of a simple query:

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

The query object is instantiated with the parameters mentioned in the [query results pagination](#query-results-pagination) section. Multiple pages are retrieved by calling the **GetNextAsTwinAsync** methods multiple times.

### Node.js example

The query functionality is exposed by the [Azure IoT service SDK for Node.js](iot-hub-devguide-sdks.md) in the **Registry** object.

Here's an example of a simple query:

```javascript
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

The query object is instantiated with the parameters mentioned in the [query results pagination](#query-results-pagination) section. Multiple pages are retrieved by calling the **nextAsTwin** method multiple times.  

## Next steps

* Learn about routing messages based on message properties or message body with the [IoT Hub message routing query syntax](iot-hub-devguide-routing-query-syntax.md).
* Get specific examples of [Queries for device and module twins](query-twins.md) or [Queries for jobs](query-jobs.md).


