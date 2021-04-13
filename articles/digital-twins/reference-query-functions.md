---
# Mandatory fields.
title: Azure Digital Twins query language reference - Functions
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language functions
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/22/2021
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query language reference: Functions

This document contains reference information on **functions** for the [Azure Digital Twins query language](concepts-query-language.md).

## ENDSWITH

A string function used to determine whether a given string ends in a certain other string. 

### Syntax

```sql
ENDSWITH(<string-to-check>,<ending-string>)
```

### Arguments

* `<string-to-check>`: A string to check the ending of
* `<ending-string>`: A string representing the ending to check for

### Returns

A Boolean value indicating whether the first string expression ends with the second.

### Example

The following query returns all digital twins whose IDs end in `-small`.

```sql
SELECT *
FROM DIGITALTWINS T
WHERE ENDSWITH(T.$dtId, '-small')
```

## IS_DEFINED

A type checking and casting function to check whether a property is defined.

This is supported only when the property value is a primitive type. Primitive types include string, Boolean, numeric, or `null`. `DateTime`, object types, and arrays are not supported.

### Syntax

```sql
IS_DEFINED(<property>)
```

### Arguments

`<property>`, a property of a primitive type to determine whether it is defined.

### Returns

A Boolean value indicating if the property has been assigned a value.

### Example

The following query returns all digital twins who have a defined *Location* property.

```sql
SELECT *
FROM DIGITALTWINS
WHERE IS_DEFINED(Location)
```

## IS_OF_MODEL

A type checking and casting function to determine whether a twin is of a particular model type (including models that inherit from the specified model).

### Syntax

```sql
IS_OF_MODEL(<twin-collection>,'<model-ID>', exact)
```

### Arguments

Required:
* `<model-ID>`: The model ID to check for.

Optional:
* `<twin-collection>`: Specify a twin collection to search when there is more than one (like when a `JOIN` is used).
* `exact`: Require an exact match. If this parameter is not set, the result set will include twins with models that inherit from the specified model.

### Returns

A Boolean value indicating if the specified twin matches the specified model type.

### Example

The following query returns twins from the DT collection that are exactly of the model type `dtmi:example:room;1`.

```sql
SELECT ROOM FROM DIGITALTWINS DT WHERE IS_OF_MODEL(DT, 'dtmi:example:room;1', exact)
```

## IS_BOOL

A type checking and casting function for determining whether an expression has a Boolean value.

This function is usually combined with other predicates if the program processing the query results requires a boolean value, and you want to filter out entities for which the property is not a boolean.

### Syntax

```sql
IS_BOOL(<expression>)
```

### Arguments

`<expression>`, an expression to check whether it is a Boolean.

### Returns

A Boolean value indicating if the type of the specified expression is a Boolean.

### Example

The following query selects the digital twins that have a boolean `HasTemperature` property.

```sql
SELECT *
FROM DIGITALTWINS T
WHERE IS_BOOL( HasTemperature )
```

The following query builds on the above example to select the digital twins that have a boolean `HasTemperature` property, and the value of that property is not `false`.

```sql
SELECT *
FROM DIGITALTWINS T
WHERE IS_BOOL( HasTemperature ) AND HasTemperature != false
```

## IS_NUMBER

A type checking and casting function for determining whether an expression has a number value.

This function is usually combined with other predicates if the program processing the query results requires a number value, and you want to filter out entities for which the property is not a number.

### Syntax

```sql
IS_NUMBER(<expression>)
```

### Arguments

`<expression>`, an expression to check whether it is a number.

### Returns

A Boolean value indicating if the type of the specified expression is a number.

### Example

The following query selects the digital twins that have a numeric `Capacity` property and its value is not equal to 0.

```sql
SELECT * 
FROM DIGITALTWINS 
WHERE IS_NUMBER( Capacity ) AND Capacity != 0
```

## IS_STRING

A type checking and casting function for determining whether an expression has a string value. 

This function is usually combined with other predicates if the program processing the query results requires a string value, and you want to filter out entities for which the property is not a string.

### Syntax

```sql
IS_STRING(<expression>)
```

### Arguments

`<expression>`, an expression to check whether it is a string.

### Returns

A Boolean value indicating if the type of the specified expression is a string.

### Example

The following query selects the digital twins that have a string property `Status` property and its value is not equal to `Completed`.

```sql
SELECT * 
FROM DIGITIALTWINS 
WHERE IS_STRING( Status ) AND Status != 'Completed'
```

## IS_NULL

A type checking and casting function for determining whether an expression's value is `null`.

### Syntax

```sql
IS_NULL(<expression>)
```

### Arguments

`<expression>`, an expression to check whether it is null.

### Returns

A Boolean value indicating if the type of the specified expression is `null`.

### Example

The following query returns twins who do not have a null value for Temperature. For more about the `NOT` operator used in this query, see [Azure Digital Twins query language reference: Operators](reference-query-operators.md#logical-operators).

```sql
SELECT *
FROM DIGITALTWINS T
WHERE NOT IS_NULL(T.Temperature)
```

## IS_PRIMITIVE

A type checking and casting function for determining whether an expression's value is of a primitive type (string, Boolean, numeric, or `null`).

This function is usually combined with other predicates if the program processing the query results requires a primitive-typed value, and you want to filter out entities for which the property is not primitive.

### Syntax

```sql
IS_PRIMITIVE(<expression>)
```

### Arguments

`<expression>`, an expression to check whether it is of a primitive type.

### Returns

A Boolean value indicating if the type of the specified expression is one of the primitive types (string, Boolean, numeric, or `null`).

### Example

The following query returns the `area` property of the Factory with the ID of 'ABC,' only if the `area` property is a primitive type. For more about projecting certain columns in the query result like this query does with `area`, see [Azure Digital Twins query language reference: SELECT clause](reference-query-clause-select.md#select-columns-with-projections).

```sql
SELECT Factory.area
FROM DIGITALTWINS Factory
WHERE Factory.$dtId = 'ABC'
AND IS_PRIMITIVE(Factory.area)
```

## IS_OBJECT

A type checking and casting function for determining whether an expression's value is of a JSON object type.

This function is usually combined with other predicates if the program processing the query results requires a JSON object, and you want to filter out entities for which the value is not a JSON object.

### Syntax

```sql
IS_OBJECT<expression>)
```

### Arguments

`<expression>`, an expression to check whether it is of an object type.

### Returns

A Boolean value indicating if the type of the specified expression is a JSON object.

### Example

The following query selects all of the digital twins where this is an object called `MapObject` which does not have a child property `TemperatureReading`.

```sql
SELECT * 
FROM DIGITALTWINS 
WHERE IS_OBJECT( MapObject ) AND NOT IS_DEFINED ( MapObject.TemperatureReading )
```

## STARTSWITH

A string function used to determine whether a given string begins with a certain other string. 

### Syntax

```sql
STARTSWITH(<string-to-check>,<beginning-string>)
```

### Arguments

* `<string-to-check>`: A string to check the beginning of
* `<beginning-string>`: A string representing the beginning to check for

### Returns

A Boolean value indicating whether the first string expression starts with the second.

### Example

The following query returns all digital twins whose IDs begin with `area1-`.

```sql
SELECT *
FROM DIGITALTWINS T
WHERE STARTSWITH(T.$dtId, 'area1-')
```
