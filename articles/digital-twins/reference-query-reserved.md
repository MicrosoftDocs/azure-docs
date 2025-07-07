---
title: Azure Digital Twins query language reference - Reserved keywords
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language reserved keywords
author: baanders
ms.author: baanders
ms.date: 02/07/2025
ms.topic: reference
ms.service: azure-digital-twins
---

# Azure Digital Twins query language reference: Reserved keywords

This document contains the list of *reserved keywords* in the [Azure Digital Twins query language](concepts-query-language.md). These words can't be used as identifiers in queries unless they're [escaped in double square brackets](#escaping-reserved-keywords-in-queries). 

## List of reserved keywords

Here are the reserved keywords in the Azure Digital Twins query language:

* `ALL`
* `AND`
* `AS`
* `ASC`
* `AVG`
* `BY`
* `COUNT`
* `DESC`
* `DEVICES_JOBS`
* `DEVICES_MODULES`
* `DEVICES`
* `ENDS_WITH`
* `FALSE`
* `FROM`
* `GROUP`
* `IN`
* `IS_BOOL`
* `IS_DEFINED`
* `IS_NULL`
* `IS_NUMBER`
* `IS_OBJECT`
* `IS_PRIMITIVE`
* `IS_STRING`
* `MAX`
* `MIN`
* `NOT`
* `NOT_IN`
* `NULL`
* `OR`
* `ORDER`
* `SELECT`
* `STARTS_WITH`
* `SUM`
* `TOP`
* `TRUE`
* `WHERE`
* `IS_OF_MODEL`

## Escaping reserved keywords in queries

To use a reserved keyword as an identifier in a query, escape the keyword by enclosing it with double square brackets like this: `[[<keyword>]]`

For example, consider a set of digital twins with a property called `GROUP`, which is a reserved keyword. To filter on that property value, the property name must be escaped where it's used in the query, as shown here:

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="ReservedKeywordExample":::