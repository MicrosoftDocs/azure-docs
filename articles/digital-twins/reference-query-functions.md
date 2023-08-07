---
# Mandatory fields.
title: Azure Digital Twins query language reference - Functions
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language functions
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/29/2023
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query language reference: Functions

This document contains reference information on *functions* for the [Azure Digital Twins query language](concepts-query-language.md).

## ARRAY_CONTAINS

A function to determine whether an array property of a twin (supported in DTDL v3) contains another specified value.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="Array_ContainsSyntax":::

### Arguments

* `<array-to-check>`: An array-type twin property that you want to check for the specified value
* `<contained-value>`: A string, integer, double, or boolean representing the value to check for inside the array

### Returns

A Boolean value indicating whether the array contains the specified value.

### Example

The following query returns the name of all digital twins who have an array property `floor_number`, and the array stored in this property contains a value of `2`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="Array_ContainsExample":::

### Limitations

The ARRAY_CONTAINS() function has the following limitations:
* Array indexing isn't supported. 
    - For example, `array-name[index] = 'foo_bar'`
* Subqueries within the ARRAY_CONTAINS() property aren't supported. 
    - For example, `SELECT T.name FROM DIGITALTWINS T WHERE ARRAY_CONTAINS (SELECT S.floor_number FROM DIGITALTWINS S, 4)`
* ARRAY_CONTAINS() isn't supported on properties of relationships. 
    - For example, say `Floor.Contains` is a relationship from Floor to Room and it has a `lift` property with a value of `["operating", "under maintenance", "under construction"]`. Queries like this aren't supported: `SELECT Room FROM DIGITALTWINS Floor JOIN Room RELATED Floor.Contains WHERE 	Floor.$dtId = 'Floor-35' AND ARRAY_CONTAINS(Floor.Contains.lift, "operating")`.
* ARRAY_CONTAINS() doesn't search inside nested arrays. 
    - For example, say a twin has a `tags` property with a value of `[1, [2,3], 3, 4]`. A search for `2` using the query `SELECT * FROM DIGITALTWINS WHERE ARRAY_CONTAINS(tags, 2)` returns `False`. A search for a value in the top level array, like `1` using the query `SELECT * FROM DIGITALTWINS WHERE ARRAY_CONTAINS(tags, 1)`, returns `True`.
* ARRAY_CONTAINS() isn't supported if the array contains objects.
    - For example, say a twin has a `tags` property with a value of `[Room1, Room2]` where `Room1` and `Room2` are objects. Queries like this aren't supported: `SELECT * FROM DIGITALTWINS WHERE ARRAY_CONTAINS(tags, Room2)`.

## CONTAINS

A string function to determine whether a string property of a twin contains another specified string value.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="ContainsSyntax":::

### Arguments

* `<string-to-check>`: A string-type twin property that you want to check for the specified value
* `<contained-string>`: A string representing the value to check for

### Returns

A Boolean value indicating whether the first string expression contains the sequence of characters defined in the second string expression.

### Example

The following query returns all digital twins whose IDs contain `-route`. The string to check is the `$dtId` of each twin in the collection, and the contained string is `-route`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="ContainsExample":::

## ENDSWITH

A string function to determine whether a string property of a twin ends in a certain other string. 

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="EndsWithSyntax":::

### Arguments

* `<string-to-check>`: A string-type twin property that you want to check the ending of
* `<ending-string>`: A string representing the ending to check for

### Returns

A Boolean value indicating whether the first string expression ends with the second.

### Example

The following query returns all digital twins whose IDs end in `-small`. The string to check is the `$dtId` of each twin in the collection, and the ending string is `-small`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="EndsWithExample":::

## IS_BOOL

A type checking function for determining whether a property has a Boolean value.

This function is often combined with other predicates if the program processing the query results requires a boolean value, and you want to filter out cases where the property isn't a boolean.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsBoolSyntax":::

### Arguments

`<property>`, a property to check whether it's a Boolean.

### Returns

A Boolean value indicating if the type of the specified property is a Boolean.

### Example

The following query selects the digital twins that have a boolean `HasTemperature` property.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsBoolExample":::

The following query builds on the above example to select the digital twins that have a boolean `HasTemperature` property, and the value of that property isn't `false`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsBoolNotFalseExample":::

## IS_DEFINED

A type checking function to determine whether a property is defined.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsDefinedSyntax":::

### Arguments

`<property>`, a property to determine whether it's defined.

### Returns

A Boolean value indicating if the property has been assigned a value.

### Example

The following query returns all digital twins who have a defined `Location` property.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsDefinedExample":::

## IS_NULL

A type checking function for determining whether a property's value is `null`.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsNullSyntax":::

### Arguments

`<property>`, a property to check whether it's null.

### Returns

A Boolean value indicating if the type of the specified property is `null`.

### Example

The following query returns twins who do not have a null value for Temperature. For more information about the `NOT` operator used in this query, see [Azure Digital Twins query language reference: Operators](reference-query-operators.md#logical-operators).

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsNullExample":::

## IS_NUMBER

A type checking function for determining whether a property has a number value.

This function is often combined with other predicates if the program processing the query results requires a number value, and you want to filter out cases where the property isn't a number.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsNumberSyntax":::

### Arguments

`<property>`, a property to check whether it's a number.

### Returns

A Boolean value indicating if the type of the specified property is a number.

### Example

The following query selects the digital twins that have a numeric `Capacity` property and its value isn't equal to 0.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsNumberExample":::

## IS_OBJECT

A type checking function for determining whether a property's value is of a JSON object type.

This function is often combined with other predicates if the program processing the query results requires a JSON object, and you want to filter out cases where the value isn't a JSON object.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsObjectSyntax":::

### Arguments

`<property>`, a property to check whether it's of an object type.

### Returns

A Boolean value indicating if the type of the specified property is a JSON object.

### Example

The following query selects all of the digital twins where this is an object called `MapObject`, and it doesn't have a child property `TemperatureReading`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsObjectExample":::

## IS_OF_MODEL

A type checking and function to determine whether a twin is of a particular model type. Includes models that inherit from the specified model.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsOfModelSyntax":::

### Arguments

Required:
* `<model-ID>`: The model ID to check for.

Optional:
* `<twin-collection>`: Specify a twin collection to search when there's more than one (like when a `JOIN` is used).
* `exact`: Require an exact match. If this parameter isn't set, the result set includes twins with models that inherit from the specified model.

### Returns

A Boolean value indicating if the specified twin matches the specified model type.

### Example

The following query returns twins from the DT collection that are exactly of the model type `dtmi:example:room;1`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsOfModelExample":::

## IS_PRIMITIVE

A type checking function for determining whether a property's value is of a primitive type (string, Boolean, numeric, or `null`).

This function is often combined with other predicates if the program processing the query results requires a primitive-typed value, and you want to filter out cases where the property isn't primitive.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsPrimitiveSyntax":::

### Arguments

`<property>`, a property to check whether it's of a primitive type.

### Returns

A Boolean value indicating if the type of the specified property is one of the primitive types (string, Boolean, numeric, or `null`).

### Example

The following query returns the `area` property of the Factory with the ID of 'ABC,' only if the `area` property is a primitive type. For more about projecting certain columns in the query result (like this query does with `area`), see [Azure Digital Twins query language reference: SELECT clause](reference-query-clause-select.md#select-columns-with-projections).

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsPrimitiveExample":::

## IS_STRING

A type checking function for determining whether a property has a string value. 

This function is often combined with other predicates if the program processing the query results requires a string value, and you want to filter out cases where the property isn't a string.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsStringSyntax":::

### Arguments

`<property>`, a property to check whether it's a string.

### Returns

A Boolean value indicating if the type of the specified expression is a string.

### Example

The following query selects the digital twins that have a string property `Status` property and its value isn't equal to `Completed`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="IsStringExample":::

## STARTSWITH

A string function to determine whether a string property of a twin begins with a certain other string. 

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="StartsWithSyntax":::

### Arguments

* `<string-to-check>`: A string-type twin property that you want to check the beginning of
* `<beginning-string>`: A string representing the beginning to check for

### Returns

A Boolean value indicating whether the first string expression starts with the second.

### Example

The following query returns all digital twins whose IDs begin with `area1-`. The string to check is the `$dtId` of each twin in the collection, and the beginning string is `area1-`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" ID="StartsWithExample":::