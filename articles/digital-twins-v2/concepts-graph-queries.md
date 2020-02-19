---
# Mandatory fields.
title: Using the Azure Digital Twins graph
description: Understand the graph aspect of Azure Digital Twins, and how to query the graph for information.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Understand the Azure Digital Twins graph

At the heart of Digital Twins is a graph constructed from twins and relationships. Every twin in the graph is an instance of a model. Think of a model as a template that describes the characteristics of a particular type of twin in terms of properties, telemetry/events, commands etc. 
Twins are connected via relationships, forming a graph. The model definition for each twin declares which relationships are possible between twins. For example, a Floor twin might have a “contains” relationship that allows it to connect to several instances of Room. A cooling device might have a “cools” relationship with a motor.  
 Need a picture for a graph here

## Query Digital Twins

ADT provides extensive query capabilities against the Digital Twins graph. Queries are described using SQL-LIKE syntax, as a superset of the capabilities of the IoT Hub query language Add references to the Hub Query documentation.

Query capabilities:
* Get twins by properties
* Get twins by Interfaces
* Get twins by relationship properties
* Get twins over multiple relationships types and multiple hops (JOIN queries). Have limitations on number of JOINs allowed (One level for Public Preview)
* Any combination of above (AND, OR, NOT operator) of properties, interfaces, relationship properties and traversing
* Continuation support: The query object is instantiated with a page size (up to 100). Then multiple pages are retrieved by calling the nextAsTwin method multiple times.
* Support for query comparison operators: AND/OR/NOT,  IN/NOT IN, STARTSWITH/ENDSWITH, =, !=, <,  >, <=, >=
* Get twins based on actual state condition (Get twins and their last known property value)
* Scalar Functions support: IS_BOOL, IS_DEFINED, IS_NULL, IS_NUMBER, IS_OBJECT, IS_PRIMITIVE, IS_STRING, STARTS_WITH, ENDS_WITH
