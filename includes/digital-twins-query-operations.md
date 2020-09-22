---
author: baanders
description: include file for Azure Digital Twins query operations
ms.service: digital-twins
ms.topic: include
ms.date: 7/28/2020
ms.author: baanders
---

## Query language features

Azure Digital Twins provides extensive query capabilities against the twin graph. Queries are described using SQL-like syntax, in a query language similar to the [IoT Hub query language](../articles/iot-hub/iot-hub-devguide-query-language.md) with many comparable features.

> [!NOTE]
> All Azure Digital Twins query operations are case-sensitive.

Here are the operations available in Azure Digital Twins query language.

Get digital twins by their...
* model (using `IS_OF_MODEL` operator)
* properties (including [tag properties](../articles/digital-twins/how-to-use-tags.md))
* interfaces
* relationships
  - properties of the relationships

You can further enhance your queries with the following operations:
* Get twins over multiple relationship types (`JOIN` queries). 
  - During preview, up to five levels of `JOIN` are allowed.
* Select only the top query results (`Select TOP` operator)
* Use scalar functions: `IS_BOOL`, `IS_DEFINED`, `IS_NULL`, `IS_NUMBER`, `IS_OBJECT`, `IS_PRIMITIVE`, `IS_STRING`, `STARTSWITH`, `ENDSWITH`.
* Use query comparison operators: `IN`/`NIN`, `=`, `!=`, `<`, `>`, `<=`, `>=`.
* Use any combination (`AND`, `OR`, `NOT` operator) of `IS_OF_MODEL`, scalar functions, and comparison operators.
* Use continuation: The query object is instantiated with a page size (up to 100). You can retrieve the digital twins one page at a time by providing the continuation token in subsequent calls to the API.