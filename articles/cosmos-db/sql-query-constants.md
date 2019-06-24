---
title: SQL constants in Azure Cosmos DB
description: Learn about SQL constants in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: tisande

---

# Azure Cosmos DB SQL query constants  

 A constant, also known as a literal or a scalar value, is a symbol that represents a specific data value. The format of a constant depends on the data type of the value it represents.  
  
 **Supported scalar data types:**  
  
|**Type**|**Values order**|  
|-|-|  
|**Undefined**|Single value: **undefined**|  
|**Null**|Single value: **null**|  
|**Boolean**|Values: **false**, **true**.|  
|**Number**|A double-precision floating-point number, IEEE 754 standard.|  
|**String**|A sequence of zero or more Unicode characters. Strings must be enclosed in single or double quotes.|  
|**Array**|A sequence of zero or more elements. Each element can be a value of any scalar data type, except **Undefined**.|  
|**Object**|An unordered set of zero or more name/value pairs. Name is a Unicode string, value can be of any scalar data type, except **Undefined**.|  
  
## <a name="bk_syntax"></a>Syntax
  
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
  
##  <a name="bk_arguments"></a> Arguments
  
* `<undefined_constant>; Undefined`  
  
  Represents undefined value of type Undefined.  
  
* `<null_constant>; null`  
  
  Represents **null** value of type **Null**.  
  
* `<boolean_constant>`  
  
  Represents constant of type Boolean.  
  
* `false`  
  
  Represents **false** value of type Boolean.  
  
* `true`  
  
  Represents **true** value of type Boolean.  
  
* `<number_constant>`  
  
  Represents a constant.  
  
* `decimal_literal`  
  
  Decimal literals are numbers represented using either decimal notation, or scientific notation.  
  
* `hexadecimal_literal`  
  
  Hexadecimal literals are numbers represented using prefix '0x' followed by one or more hexadecimal digits.  
  
* `<string_constant>`  
  
  Represents a constant of type String.  
  
* `string _literal`  
  
  String literals are Unicode strings represented by a sequence of zero or more Unicode characters or escape sequences. String literals are enclosed in single quotes (apostrophe: ' ) or double quotes (quotation mark: ").  
  
  Following escape sequences are allowed:  
  
|**Escape sequence**|**Description**|**Unicode character**|  
|-|-|-|  
|\\'|apostrophe (')|U+0027|  
|\\"|quotation mark (")|U+0022|  
|\\\ |reverse solidus (\\)|U+005C|  
|\\/|solidus (/)|U+002F|  
|\b|backspace|U+0008|  
|\f|form feed|U+000C|  
|\n|line feed|U+000A|  
|\r|carriage return|U+000D|  
|\t|tab|U+0009|  
|\uXXXX|A Unicode character defined by 4 hexadecimal digits.|U+XXXX|  

## Next steps

- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Model document data](modeling-data.md)
