---
# Mandatory fields.
title: Query language
titleSuffix: Azure Digital Twins
description: Understand the basics of the Azure Digital Twins query language.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/26/2020
ms.topic: conceptual
ms.service: digital-twins
ms.custom: contperfq2

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# About the query language for Azure Digital Twins

Recall that the center of Azure Digital Twins is the [**twin graph**](concepts-twins-graph.md), constructed from **digital twins** and **relationships**. This graph can be queried to get information about the digital twins and relationships it contains. These queries are written in a custom SQL-like query language, referred to as the **Azure Digital Twins query language**. This is similar to the [IoT Hub query language](../articles/iot-hub/iot-hub-devguide-query-language.md) with many comparable features.

To submit a query to the service from a client app, you will use the Azure Digital Twins [**Query API**](/dotnet/api/azure.digitaltwins.core.digitaltwinsclient.query?view=azure-dotnet-preview). This lets developers write queries and apply filters to find sets of digital twins in the twin graph, and other information about the Azure Digital Twins scenario.

## Types of query

You can use the Azure Digital Twins query language to retrieve digital twins according to their...
* models
* properties (including [tag properties](../articles/digital-twins/how-to-use-tags.md))
* relationships
  - properties of the relationships

## Reference: Expressions and conditions

This section describes the operators and functions that are available to write Azure Digital Twins queries.

> [!NOTE]
> All Azure Digital Twins query operations are case-sensitive, so take care to use the exact names defined in the models. If property names are misspelled or incorrectly cased, the result set is empty with no errors returned.

### Operators

The following operators are supported:

| Family | Operators |
| --- | --- |
| Logical |AND, OR, NOT |
| Comparison |=, !=, <, >, <=, >= |
| Contains | IN, NIN |

### Functions

The following type checking and casting functions are supported:

| Function | Description |
| -------- | ----------- |
| IS_DEFINED | Returns a Boolean indicating if the property has been assigned a value. This is supported only when the value is a primitive type. Primitive types include string, Boolean, numeric, or `null`. DateTime, object types and arrays are not supported. |
| IS_OF_MODEL | Returns a Boolean value indicating if the specified twin matches the specified model type |
| IS_BOOL | Returns a Boolean value indicating if the type of the specified expression is a Boolean. |
| IS_NUMBER | Returns a Boolean value indicating if the type of the specified expression is a number. |
| IS_STRING | Returns a Boolean value indicating if the type of the specified expression is a string. |
| IS_NULL | Returns a Boolean value indicating if the type of the specified expression is null. |
| IS_PRIMITIVE | Returns a Boolean value indicating if the type of the specified expression is a primitive (string, Boolean, numeric, or `null`). |
| IS_OBJECT | Returns a Boolean value indicating if the type of the specified expression is a JSON object. |

The following string functions are supported:

| Function | Description |
| -------- | ----------- |
| STARTSWITH(x, y) | Returns a Boolean indicating whether the first string expression starts with the second. |
| ENDSWITH(x, y) | Returns a Boolean indicating whether the first string expression ends with the second. |

## Query limitations

This section describes limitations of the query language.

* Timing: There may be a delay of up to 10 seconds before changes in your instance are reflected in queries. For example, if you complete an operation like creating or deleting twins with the DigitalTwins API, the result may not be immediately reflected in Query API requests. Waiting for a short period should be sufficient to resolve.
* No subqueries are supported within the `FROM` statement.
* `OUTER JOIN` semantics are not supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.
* Graph traversal depth is restricted to five `JOIN` levels per query.
* The source for `JOIN` operations is restricted: the query must declare the twins where the query begins.

## Next steps

Learn how to write queries and see client code examples in [*How-to: Query the twin graph*](how-to-query-graph.md).