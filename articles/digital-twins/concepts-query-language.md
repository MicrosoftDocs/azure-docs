---
# Mandatory fields.
title: Query language
titleSuffix: Azure Digital Twins
description: Understand the basics of the Azure Digital Twins query language.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/19/2020
ms.topic: conceptual
ms.service: digital-twins
ms.custom: contperf-fy21q2

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# About the query language for Azure Digital Twins

Recall that the center of Azure Digital Twins is the [twin graph](concepts-twins-graph.md), constructed from digital twins and relationships. 

This graph can be queried to get information about the digital twins and relationships it contains. These queries are written in a custom SQL-like query language, referred to as the **Azure Digital Twins query language**. This is similar to the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md) with many comparable features.

This article describes the basics of the query language and its capabilities. For more detailed examples of query syntax and how to run query requests, see [*How-to: Query the twin graph*](how-to-query-graph.md).

## About the queries

You can use the Azure Digital Twins query language to retrieve digital twins according to their...
* properties (including [tag properties](how-to-use-tags.md))
* models
* relationships
  - properties of the relationships

To submit a query to the service from a client app, you will use the Azure Digital Twins [**Query API**](/rest/api/digital-twins/dataplane/query). One way to use the API is through one of the [SDKs](how-to-use-apis-sdks.md#overview-data-plane-apis) for Azure Digital Twins.

### Considerations for querying

When writing queries for Azure Digital Twins, keep the following considerations in mind:
* **Remember case sensitivity**: All Azure Digital Twins query operations are case-sensitive, so take care to use the exact names defined in the models. If property names are misspelled or incorrectly cased, the result set is empty with no errors returned.
* **Escape single quotes**: If your query text includes a single quote character in the data, the quote will need to be escaped with the `\` character. Here is an example that deals with a property value of *D'Souza*:

  :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="EscapedSingleQuote":::

## Reference: Expressions and conditions

This section describes the operators and functions that are available to write Azure Digital Twins queries. For example queries that illustrate use of these features, see [*How-to: Query the twin graph*](how-to-query-graph.md).

### Operators

The following operators are supported:

| Family | Operators |
| --- | --- |
| Logical |`AND`, `OR`, `NOT` |
| Comparison | `=`, `!=`, `<`, `>`, `<=`, `>=` |
| Contains | `IN`, `NIN` |

### Functions

The following type checking and casting functions are supported:

| Function | Description |
| -------- | ----------- |
| `IS_DEFINED` | Returns a Boolean indicating if the property has been assigned a value. This is supported only when the value is a primitive type. Primitive types include string, Boolean, numeric, or `null`. `DateTime`, object types, and arrays are not supported. |
| `IS_OF_MODEL` | Returns a Boolean value indicating if the specified twin matches the specified model type |
| `IS_BOOL` | Returns a Boolean value indicating if the type of the specified expression is a Boolean. |
| `IS_NUMBER` | Returns a Boolean value indicating if the type of the specified expression is a number. |
| `IS_STRING` | Returns a Boolean value indicating if the type of the specified expression is a string. |
| `IS_NULL` | Returns a Boolean value indicating if the type of the specified expression is null. |
| `IS_PRIMITIVE` | Returns a Boolean value indicating if the type of the specified expression is a primitive (string, Boolean, numeric, or `null`). |
| `IS_OBJECT` | Returns a Boolean value indicating if the type of the specified expression is a JSON object. |

The following string functions are supported:

| Function | Description |
| -------- | ----------- |
| `STARTSWITH(x, y)` | Returns a Boolean indicating whether the first string expression starts with the second. |
| `ENDSWITH(x, y)` | Returns a Boolean indicating whether the first string expression ends with the second. |

## Query limitations

This section describes limitations of the query language.

* Timing: There may be a delay of up to 10 seconds before changes in your instance are reflected in queries. For example, if you complete an operation like creating or deleting twins with the DigitalTwins API, the result may not be immediately reflected in Query API requests. Waiting for a short period should be sufficient to resolve.
* No subqueries are supported within the `FROM` statement.
* `OUTER JOIN` semantics are not supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.
* Graph traversal depth is restricted to five `JOIN` levels per query.
* Relationships in Azure Digital Twins can't be queried as independent entities; you also need to provide information about the source twin that the relationship comes from. This means that there are some restrictions on the `JOIN` operation, which is used to query relationships, to make sure that the query declares the twin(s) where the query begins. For examples of this, see [*Query by relationship*](how-to-query-graph.md#query-by-relationship) in the *How-to: Query the twin graph* article.

## Next steps

Learn how to write queries and see client code examples in [*How-to: Query the twin graph*](how-to-query-graph.md).