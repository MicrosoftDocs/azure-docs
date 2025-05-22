---
title: Azure Service Bus Subscription Rule SQL Action syntax  | Microsoft Docs
description: This article provides a reference for SQL rule action syntax. The actions are written in SQL-language-based syntax that is performed against a message.
ms.topic: article
ms.date: 12/05/2023
---

# Subscription Rule SQL Action Syntax

A *SQL action* is used to manipulate message metadata after a message has been selected by a filter of a subscription rule. It's a text expression that leans on a subset of the SQL-92 standard. Action expressions are used with the `sqlExpression` element of the 'action' property of a Service Bus `Rule` in an [Azure Resource Manager template](service-bus-resource-manager-namespace-topic-with-rule.md), or the Azure CLI `az servicebus topic subscription rule create` command's [`--action-sql-expression`](/cli/azure/servicebus/topic/subscription/rule#az-servicebus-topic-subscription-rule-create) argument, and several SDK functions that allow managing subscription rules.
  
  
```  
<statements> ::=
    <statement> [, ...n]  
  
```  
  
```  
<statement> ::=
    <action> [;]
    Remarks
    -------
    Semicolon is optional.  
  
```  
  
```  
<action> ::=
    SET <property> = <expression>
    REMOVE <property>  
```

```
<expression> ::=
    <constant>
    | <function>
    | <property>
    | <expression> { + | - | * | / | % } <expression>
    | { + | - } <expression>
    | ( <expression> )
``` 

```
<property> := 
    [<scope> .] <property_name>
``` 
  
## Arguments  
  
-   `<scope>` is an optional string indicating the scope of the `<property_name>`. Valid values are `sys` or `user`. 
    - The `sys` value indicates system scope where `<property_name>` is any of the properties on the Service Bus message as described in [Messages, payloads, and serialization](service-bus-messages-payloads.md).
    - The `user` value indicates user scope where `<property_name>` is a key of the custom properties that you can set on the message when sending to Service Bus.
    - The `user` scope is the default scope if `<scope>` isn't specified.  
  
### Remarks  

An attempt to access a nonexistent system property is an error, while an attempt to access a nonexistent user property isn't an error. Instead, a nonexistent user property is internally evaluated as an unknown value. An unknown value is treated specially during operator evaluation.  
  
## property_name  
  
```  
<property_name> ::=  
     <identifier>  
     | <delimited_identifier>  
  
<identifier> ::=  
     <regular_identifier> | <quoted_identifier> | <delimited_identifier>  
  
```  
  
### Arguments  
 `<regular_identifier>` is a string represented by the following regular expression:  
  
```  
[[:IsLetter:]][_[:IsLetter:][:IsDigit:]]*  
```  
  
 It means any string that starts with a letter and is followed by one or more underscore/letter/digit.  
  
 `[:IsLetter:]` means any Unicode character that is categorized as a Unicode letter. `System.Char.IsLetter(c)` returns `true` if `c` is a Unicode letter.  
  
 `[:IsDigit:]` means any Unicode character that is categorized as a decimal digit. `System.Char.IsDigit(c)` returns `true` if `c` is a Unicode digit.  
  
 A `<regular_identifier>` can't be a reserved keyword.  
  
 `<delimited_identifier>` is any string that is enclosed with left/right square brackets ([]). A right square bracket is represented as two right square brackets. The following are examples of `<delimited_identifier>`:  
  
```  
[Property With Space]  
[HR-EmployeeID]  
  
```  
  
 `<quoted_identifier>` is any string that is enclosed with double quotation marks. A double quotation mark in identifier is represented as two double quotation marks. It isn't recommended to use quoted identifiers because it can easily be confused with a string constant. Use a delimited identifier if possible. Here's an example of `<quoted_identifier>`:  
  
```  
"Contoso & Northwind"  
```  
  
## Pattern  
  
```  
<pattern> ::=  
      <expression>  
```  
  
### Remarks
  
 `<pattern>` must be an expression that is evaluated as a string. It's used as a pattern for the LIKE operator. It can contain the following wildcard characters:  
  
-   `%`:  Any string of zero or more characters.    
-   `_`: Any single character.  
  
## escape_char  
  
```  
<escape_char> ::=  
      <expression>  
```  
  
### Remarks
  
 `<escape_char>` must be an expression that is evaluated as a string of length 1. It's used as an escape character for the LIKE operator.  
  
 For example, `property LIKE 'ABC\%' ESCAPE '\'` matches `ABC%` rather than a string that starts with `ABC`.  
  
## Constant  
  
```  
<constant> ::=  
      <integer_constant> | <decimal_constant> | <approximate_number_constant> | <boolean_constant> | NULL  
```  
  
### Arguments  
  
-   `<integer_constant>` is a string of numbers that aren't enclosed in quotation marks and don't contain decimal points. The values are stored as `System.Int64` internally, and follow the same range.  
  
     The following are examples of long constants:  
  
    ```  
    1894  
    2  
    ```  
  
-   `<decimal_constant>` is a string of numbers that aren't enclosed in quotation marks, and contain a decimal point. The values are stored as `System.Double` internally, and follow the same range/precision.  
  
     In a future version, this number might be stored in a different data type to support exact number semantics, so you shouldn't rely on the fact the underlying data type is `System.Double` for `<decimal_constant>`.  
  
     The following are examples of decimal constants:  
  
    ```  
    1894.1204  
    2.0  
    ```  
  
-   `<approximate_number_constant>` is a number written in scientific notation. The values are stored as `System.Double` internally, and follow the same range/precision. The following are examples of approximate number constants:  
  
    ```  
    101.5E5  
    0.5E-2  
    ```  
  
## boolean_constant  
  
```  
<boolean_constant> :=  
      TRUE | FALSE  
```  
  
### Remarks
  
Boolean constants are represented by the keywords `TRUE` or `FALSE`. The values are stored as `System.Boolean`.  
  
## string_constant  
  
```  
<string_constant>  
```  
  
### Remarks
  
String constants are enclosed in single quotation marks and include any valid Unicode characters. A single quotation mark embedded in a string constant is represented as two single quotation marks.  
  
## Function  
  
```  
<function> :=  
      newid() |  
      property(name) | p(name)  
```  

Currently, `newid()` and `property(name)` are the only functions supported. 
  
### Remarks  

- The `newid()` function returns a `System.Guid` generated by the `System.Guid.NewGuid()` method.  
- The `property(name)` function returns the value of the property referenced by `name`. The `name` value can be any valid expression that returns a string value.  

## Examples
For examples, see [Service Bus filter examples](service-bus-filter-examples.md).
  
## Considerations

- SET is used to create a new property or update the value of an existing property.
- REMOVE is used to remove a user property. Only user properties can be removed, not system properties.
- SET performs implicit conversion if possible when the expression type and the existing property type are different.
- Action fails if nonexistent system properties were referenced.
- Action doesn't fail if nonexistent user properties were referenced.
- A nonexistent user property is evaluated as "Unknown" internally, following the same semantics as [SQLRuleFilter](/dotnet/api/azure.messaging.servicebus.administration.sqlrulefilter) when evaluating operators.

## Important points
Here are a few important points: 

- Only properties on a message can be modified. 
- All user properties can be modified. 
- All publicly updatable system properties can also be modified, like `ReplyTo` and `CorrelationId`, but we recommend that you don't alter system properties as part of a rule action. It's still allowed for backward compatibility reasons.
- When setting properties, only numeric, Boolean, and string literals are allowed. A string literal in turn is converted to a type based on the property being modified. If the property being set doesn't already exist, there's no type conversion from string. If the property being modified already exists and its value is one of these types `Guid`, `DateTimeOffset`, `TimeSpan`, `Uri`, `DateTime`, then the string literal is converted to that type and set as the property value. To be more specific, the action tries to convert the string literal to the type of property. If it's successful, the property is set. Otherwise, the rule action evaluation throws an exception and the message is dead-lettered.

## Next steps

- [SQLRuleAction (.NET)](/dotnet/api/azure.messaging.servicebus.administration.sqlruleaction)
- [SqlRuleAction (Java)](/java/api/com.azure.messaging.servicebus.administration.models.sqlruleaction)
- [SqlRuleAction (JavaScript)](/javascript/api/@azure/service-bus/sqlruleaction)
- [`az servicebus topic subscription rule`](/cli/azure/servicebus/topic/subscription/rule)
- [New-AzServiceBusRule](/powershell/module/az.servicebus/new-azservicebusrule)
