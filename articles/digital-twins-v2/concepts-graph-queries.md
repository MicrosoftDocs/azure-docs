---
# Mandatory fields.
title: Using the Azure Digital Twins graph
description: Understand the graph aspect of Azure Digital Twins, and how to query the graph for information.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Understand the Azure Digital Twins graph

The center of Azure Digital Twins (ADT) is the **digital twin graph**, constructed from [twins](concepts-twins.md) and relationships. Every twin in the graph is an instance of a [model](concepts-models.md), which defines the twin's capabilities and also defines relationships that are possible between twins. Twin instances build out these relationships between them and the result is a graph.

For example, a *Floor* twin might have a *contains* relationship that allows it to connect to several instances of *Room*. A cooling device might have a *cools* relationship with a motor. 

> [!NOTE]
> Need a picture for a graph here

## Query digital twins

ADT provides extensive query capabilities against the Azure Digital Twins graph. Queries are described using SQL-like syntax, as a superset of the capabilities of the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md).

Query capabilities:
* Get twins by properties
* Get twins by interfaces
* Get twins by relationship properties
* Get twins over multiple relationships types and multiple hops (`JOIN` queries). There are limitations on number of `JOIN`s allowed (one level for preview release)
* Any combination (`AND`, `OR`, `NOT` operator) of the above
* Continuation support: The query object is instantiated with a page size (up to 100). Then multiple pages are retrieved by calling the `nextAsTwin` method multiple times.
* Support for query comparison operators: `AND`/`OR`/`NOT`,  `IN`/`NOT IN`, `STARTSWITH`/`ENDSWITH`, `=`, `!=`, `<`, `>`, `<=`, `>=`
* Get twins based on actual state condition (information about twins and their last known property value)
* Scalar Functions support: `IS_BOOL`, `IS_DEFINED`, `IS_NULL`, `IS_NUMBER`, `IS_OBJECT`, `IS_PRIMITIVE`, `IS_STRING`, `STARTS_WITH`, `ENDS_WITH`
