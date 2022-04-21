---
# Mandatory fields.
title: Azure Digital Twins query language reference - Reserved keywords
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language reserved keywords
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 02/25/2022
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query language reference: Reserved keywords

This document contains the list of *reserved keywords* in the [Azure Digital Twins query language](concepts-query-language.md). These words cannot be used as identifiers in queries unless they are [escaped in double square brackets](#escaping-reserved-keywords-in-queries). 

## List of reserved keywords

Here are the reserved keywords in the Azure Digital Twins query language:

* ALL 
* AND
* AS
* ASC
* AVG
* BY
* COUNT
* DESC
* DEVICES_JOBS
* DEVICES_MODULES
* DEVICES
* ENDS_WITH
* FALSE
* FROM
* GROUP
* IN
* IS_BOOL
* IS_DEFINED
* IS_NULL
* IS_NUMBER
* IS_OBJECT
* IS_PRIMITIVE
* IS_STRING
* MAX
* MIN
* NOT
* NOT_IN
* NULL
* OR
* ORDER
* SELECT
* STARTS_WITH
* SUM
* TOP
* TRUE
* WHERE
* IS_OF_MODEL

## Escaping reserved keywords in queries

To use a reserved keyword as an identifier in a query, escape the keyword by enclosing it with double square brackets like this: `[[<keyword>]]`

For example, consider a set of digital twins with a property called `GROUP`, which is a reserved keyword. To filter on that property value, the property name must be escaped where it is used in the query, as shown below:

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="ReservedKeywordExample":::