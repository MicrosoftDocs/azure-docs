---
# Mandatory fields.
title: Azure Digital Twins query language reference - WHERE clause
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language WHERE clause
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

# Azure Digital Twins query language reference: WHERE clause

This document contains reference information on the *WHERE clause* for the [Azure Digital Twins query language](concepts-query-language.md).

The WHERE clause is the last part of a query. It's used to filter the items that are returned based on specific conditions.

This clause is optional while querying.

## Core syntax: WHERE

The WHERE clause is used along with a Boolean condition to filter query results. 

A condition can be a [function](reference-query-functions.md) that evaluates to a Boolean result. You can also create your own Boolean statement using the properties of twins and relationships (accessed with `.`) with a comparison or contains-type [operator](reference-query-operators.md).

### Syntax

With properties and operators:

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="WhereSyntax":::

With a function:

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="WhereFunctionSyntax":::

### Arguments

A condition evaluating to a `Boolean` value.

### Examples

Here's an example using properties and operators. The following query specifies in the WHERE clause to only return the twin with a `$dtId` value of Room1.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="WhereExample":::

Here's an example using a function. The following query uses the `IS_OF_MODEL` function to specify in the WHERE clause to only return the twins with a model of `dtmi:sample:Room;1`. For more about the `IS_OF_MODEL` function, see [Azure Digital Twins query language reference: Functions](reference-query-functions.md#is_of_model).

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="WhereFunctionExample":::