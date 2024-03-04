---
title: Constants
titleSuffix: Azure Cosmos DB for NoSQL
description: Use constants to represent specific data values in Azure Cosmos DB for NoSQL.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# Constants in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

A constant, also known as a literal or a scalar value, is a symbol that represents a specific data value. The format of a constant depends on the data type of the value it represents.

## Syntax

```sql
<constant> ::=  
   <undefined_constant>  
     | <null_constant>   
     | <boolean_constant>   
     | <number_constant>   
     | <string_constant>   
     | <array_constant>   
     | <object_constant>   
  
<undefined_constant> ::= undefined  
  
<null_constant> ::= null  
  
<boolean_constant> ::= false | true  
  
<number_constant> ::= decimal_literal | hexadecimal_literal  
  
<string_constant> ::= string_literal  
  
<array_constant> ::=  
    '[' [<constant>][,...n] ']'  
  
<object_constant> ::=   
   '{' [{property_name | "property_name"} : <constant>][,...n] '}'  
```

## Arguments

| | Description |
| --- | --- |
| **``<undefined_constant>; Undefined``** | Represents ``undefined`` values of type **Undefined**. |
| **``<null_constant>; null``** | Represents ``null`` values of type **Null**. |
| **``<boolean_constant>``** | Represents boolean-typed constants. |
| **``false``** | Represents ``false`` value of type **boolean**. |
| **``true``** | Represents ``true`` value of type **boolean**. |
| **``<number_constant>``** | Represents a numeric constant. |
| **``decimal_literal``** | Numbers represented using either decimal notation, or scientific notation. |
| **``hexadecimal_literal``** | Numbers represented using prefix ``0x`` followed by one or more hexadecimal digits. |
| **``<string_constant>``** | Represents a constant of type **string**. |
| **``string _literal``** | **Unicode** strings represented by a sequence of zero or more Unicode characters or escape sequences. String literals are enclosed in single quotes (apostrophe: ``'``) or double quotes (quotation mark: ``"``). |

## Remarks

- Here's a list of the supported scalar data types:

    | | Values order |
    | --- | --- |
    | **Undefined** | Single value: ``undefined`` |
    | **Null** | Single value: ``null`` |
    | **Boolean** | Values: ``false``, ``true``. |
    | **Number** | A double-precision floating-point number, IEEE 754 standard. |
    | **String** | A sequence of zero or more Unicode characters. Strings must be enclosed in single or double quotes.|
    | **Array** | A sequence of zero or more elements. Each element can be a value of any scalar data type, except **undefined**.|
    | **Object** | An unordered set of zero or more name/value pairs. Name is a Unicode string, value can be of any scalar data type, except **undefined**. |

- Here's a list of escape sequences that are allowed for string literals:

    | | Description | Unicode character |
    | --- | --- | --- |
    | **``\'``** | apostrophe (') | ``U+0027`` |
    | **``\"``** | quotation mark (") | ``U+0022`` |
    | **``\\``** | reverse solidus (\) | ``U+005C`` |
    | **``\/``** | solidus (/) | ``U+002F`` |
    | **``\b``** | backspace | ``U+0008`` |
    | **``\f``** | separator feed | ``U+000C`` |
    | **``\n``** | line feed | ``U+000A`` |
    | **``\r``** | carriage return | ``U+000D`` |
    | **``\t``** | tab | ``U+0009`` |
    | **``\uXXXX``** | A Unicode character defined by four hexadecimal digits. | ``U+XXXX`` |

## Next steps

- [Subqueries](subquery.md)
- [Keywords](keywords.md)
