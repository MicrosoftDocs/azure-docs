---
# Mandatory fields.
title: Azure Digital Twins query language reference - Operators
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language operators
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

# Azure Digital Twins query language reference: Operators

This document contains reference information on **operators** for the [Azure Digital Twins query language](concepts-query-language.md).

## Comparison operators

The following operators from the comparison family are supported.

* `=`, `!=`: Used to compare equality of expressions.
* `<`, `>`: Used for ordered comparison of expressions.
* `<=`, `>=`: Used for ordered comparison of expressions, including equality.

### Example

Here is an example using `=`. The following query returns twins whose Temperature value is equal to 80.

```sql
SELECT * 
FROM DIGITALTWINS DT
WHERE DT.Temperature = 80
```

Here is an example using `<`. The following query returns twins whose Temperature value is less than 80.

```sql
SELECT * 
FROM DIGITALTWINS DT
WHERE DT.Temperature < 80
```

Here is an example using `<=`. The following query returns twins whose Temperature value is less than or equal to 80.

```sql
SELECT * 
FROM DIGITALTWINS DT
WHERE NOT DT.Temperature <= 80
```

## Contains operators

The following operators from the contains family are supported.

* `IN`: Evaluates to true if a given value is in a set of values.
* `NIN`: Evaluates to true if a given value is not in a set of values.

### Example

Here is an example using `IN`. The following query returns twins whose `owner` property is one of several options from a list.

```sql
SELECT * 
FROM DIGITALTWINS DT
WHERE DT.owner IN ['John', 'Anil', 'Bailey', 'Alex']
```

## Logical operators

The following operators from the logical family are supported:
* `AND`: Used to connect two expressions, evaluates to true if they are both true.
* `OR`: Used to connect two expressions, evaluates to true if at least one of them is true.
* `NOT`: Used to negate an expression, evaluates to true if the expression condition is not met.

### Example

Here is an example using `AND`. The following query returns twins who meet both conditions of Temperature less than 80 and Humidity less than 50.

```sql
SELECT * 
FROM DIGITALTWINS DT
WHERE DT.Temperature < 80 AND DT.Humidity < 50
```

Here is an example using `OR`. The following query returns twins who meet at least one of the conditions of Temperature less than 80 and Humidity less than 50.

```sql
SELECT * 
FROM DIGITALTWINS DT
WHERE DT.Temperature < 80 OR DT.Humidity < 50
```


Here is an example using `NOT`. The following query returns twins who do not meet the conditions of Temperature less than 80.

```sql
SELECT * 
FROM DIGITALTWINS DT
WHERE NOT DT.Temperature < 80
```

## Limitations

The following limits apply to queries using operators.
* [Limit for IN/NIN](#limit-for-in-nin)

See the section below for more details.

### Limit for IN/NIN

The limit for the number of values that can be included in an `IN` or `NIN` set is 50 values.