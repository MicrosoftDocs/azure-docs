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

Here are the operations available in Azure Digital Twins Query Store language:
* Get twins by digital twins' properties (including [tags](../articles/digital-twins/how-to-use-tags.md)).
* Get twins by digital twins' interfaces.
* Get twins by relationship properties.
* Get twins over multiple relationship types (`JOIN` queries). There are limitations on the number of `JOIN`s allowed (one level for public preview).
* Use the `IS_OF_MODEL(twinCollection, twinTypeName)` operator to filter based on the twin's [model](../articles/digital-twins/concepts-models.md). It supports inheritance.
  - To do an exact match, pass the `exact` argument as well: `IS_OF_MODEL(twinCollection, twinTypeName, exact)`
* Use the `Select TOP` clause
* Use scalar functions: `IS_BOOL`, `IS_DEFINED`, `IS_NULL`, `IS_NUMBER`, `IS_OBJECT`, `IS_PRIMITIVE`, `IS_STRING`, `STARTSWITH`, `ENDSWITH`.
* Use query comparison operators: `IN`/`NIN`, `=`, `!=`, `<`, `>`, `<=`, `>=`.
* Use any combination (`AND`, `OR`, `NOT` operator) of the above.
* Use continuation: The query object is instantiated with a page size (up to 100). You can retrieve the digital twins one page at a time by providing the continuation token in subsequent calls to the API.