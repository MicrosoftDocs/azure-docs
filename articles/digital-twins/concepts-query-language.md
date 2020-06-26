---
# Mandatory fields.
title: Query language
titleSuffix: Azure Digital Twins
description: Understand the basics of the Azure Digital Twins Query Store language.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/26/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# About the query language for Azure Digital Twins

Recall that the center of Azure Digital Twins is the [**twin graph**](concepts-twins-graph.md), constructed from **digital twins** and **relationships**. This graph can be queried to get information about the digital twins and relationships it contains. These queries are written in a custom SQL-like query language called **Azure Digital Twins Query Store language**.

To submit a query to the service from a client app, you will use the Azure Digital Twins **Query API**. This lets developers write queries and apply filters to find sets of digital twins in the twin graph, and other information about the Azure Digital Twins scenario.

## Query language features

Azure Digital Twins provides extensive query capabilities against the twin graph. Queries are described using SQL-like syntax, as a superset of the capabilities of the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md).

Here are the operations available in Azure Digital Twins Query Store language:
* Get twins by digital twins' properties.
* Get twins by digital twins' interfaces.
* Get twins by relationship properties.
* Get twins over multiple relationship types (`JOIN` queries). There are limitations on the number of `JOIN`s allowed (one level for public preview).
* Use custom function `IS_OF_MODEL(twinCollection, twinTypeName)`, which allows filtering based on the twin's [model](concepts-models.md). It supports inheritance.
* Use any combination (`AND`, `OR`, `NOT` operator) of the above.
* Use scalar functions: `IS_BOOL`, `IS_DEFINED`, `IS_NULL`, `IS_NUMBER`, `IS_OBJECT`, `IS_PRIMITIVE`, `IS_STRING`, `STARTS_WITH`, `ENDS_WITH`.
* Use query comparison operators: `AND`/`OR`/`NOT`,  `IN`/`NOT IN`, `STARTSWITH`/`ENDSWITH`, `=`, `!=`, `<`, `>`, `<=`, `>=`.
* Use continuation: The query object is instantiated with a page size (up to 100). You can retrieve the digital twins one page at a time, by repeating calls to the `nextAsTwin` method.

## Next steps

Learn how to write queries and see client code examples in [How-to: Query the twin graph](how-to-query-graph.md).