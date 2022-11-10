---
title: OData filter syntax in Azure Web PubSub service
description: OData language reference and full syntax used for creating filter expressions in Azure Web PubSub service queries.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: reference
ms.date: 11/11/2022
---

# OData filter syntax in Azure Web PubSub service

In Azure Web PubSub service, the **filter** parameter specifies inclusion or exclusion criteria for the connections to send messages to. This article describes the OData syntax of **filter** and provides examples.

The complete syntax is described in the [formal grammar](#formal-grammar).

There is also a browsable [syntax diagram](https://aka.ms/awps/filter-syntax-diagram) that allows you to interactively explore the grammar and the relationships between its rules.

## Syntax

A filter in the OData language is a Boolean expression, which in turn can be one of several types of expression, as shown by the following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)):

```
/* Identifiers */
string_identifier ::= 'connectionId' | 'userId' 
collection_identifier ::= 'groups'

/* Rules for $filter */

boolean_expression ::= logical_expression
                     | comparison_expression
                     | in_expression
                     | boolean_literal
                     | boolean_function_call
                     | '(' boolean_expression ')'
```

An interactive syntax diagram is also available:

> [!div class="nextstepaction"]
> [OData syntax diagram for Azure Web PubSub service](https://aka.ms/awps/filter-syntax-diagram)

> [!NOTE]
> See [formal grammar section](#formal-grammar) for the complete EBNF.

### Identifiers

The filter syntax is used to filter out the connections matching the filter expression to send messages to.

The model for a connection is defined as below:

```ts
{
  connectionId : string,
  userId: string,
  groups: string[]
}
```

Identifiers are used to refer to the property value of a connection. For example, to filter out connections with userId `user1`, we specify the filter as `userId eq 'user1'`. Read through the below sections for more samples using the filter.

### Boolean expressions
The types of Boolean expressions include:

- Logical expressions that combine other Boolean expressions using the operators `and`, `or`, and `not`. 
- Comparison expressions, which compare fields or range variables to constant values using the operators `eq`, `ne`, `gt`, `lt`, `ge`, and `le`.
- The Boolean literals `true` and `false`. These constants can be useful sometimes when programmatically generating filters, but otherwise don't tend to be used in practice.
- Boolean expressions in parentheses. Using parentheses can help to explicitly determine the order of operations in a filter. For more information on the default precedence of the OData operators, see the next section.

### Operator precedence in filters

If you write a filter expression with no parentheses around its sub-expressions, Azure Web PubSub service will evaluate it according to a set of operator precedence rules. These rules are based on which operators are used to combine sub-expressions. The following table lists groups of operators in order from highest to lowest precedence:

| Group | Operator(s) |
| --- | --- |
| Logical operators | `not` |
| Comparison operators | `eq`, `ne`, `gt`, `lt`, `ge`, `le` |
| Logical operators | `and` |
| Logical operators | `or` |

An operator that is higher in the above table will "bind more tightly" to its operands than other operators. For example, `and` is of higher precedence than `or`, and comparison operators are of higher precedence than either of them, so the following two expressions are equivalent:

```odata-filter-expr
    length(userId) gt 0 and length(userId) lt 3 or length(userId) gt 7 and length(userId) lt 10
    ((length(userId) gt 0) and (length(userId) lt 3)) or ((length(userId) gt 7) and (length(userId) lt 10))
```

The `not` operator has the highest precedence of all -- even higher than the comparison operators. That's why if you try to write a filter like this:

```odata-filter-expr
    not length(userId) gt 5
```

You'll get this error message:

```text
    Invalid syntax for 'not length(userId)': Type 'null', expect 'bool'. (Parameter 'filter')
```

This error happens because the operator is associated with just the `length(userId)` expression, which is of type `null` when `userId` is `null`, and not with the entire comparison expression. The fix is to put the operand of `not` in parentheses:

```odata-filter-expr
    not (length(userId) gt 5)
```

### Filter size limitations

There are limits to the size and complexity of filter expressions that you can send to Azure Web PubSub service. The limits are based roughly on the number of clauses in your filter expression. A good guideline is that if you have hundreds of clauses, you are at risk of exceeding the limit. We recommend designing your application in such a way that it doesn't generate filters of unbounded size.

## Examples

1. Send to multiple groups

  ```odata-filter-expr
  filter='group1' in groups or 'group2' in groups or 'group3' in groups
  ```
2. Send to multiple users in some specific group
  ```odata-filter-expr
  filter=userId in ('user1', 'user2', 'user3') and 'group1' in groups
  ```
3. Send to some user but not some specific connectionId
  ```odata-filter-expr
  filter=userId eq 'user1' and connectionId ne '123'
  ```
4. Send to some user not in some specific group
  ```odata-filter-expr
  filter=userId eq 'user1' and (not ('group1' in groups))
  ```
5. Escape `'` when userId contains `'`
  ```odata-filter-expr
  filter=userId eq 'user''1'
  ```

## Formal grammar

We can describe the subset of the OData language supported by Azure Web PubSub service using an EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) grammar. Rules are listed "top-down", starting with the most complex expressions, and breaking them down into more primitive expressions. At the top is the grammar rule for `$filter` that correspond to specific parameter `filter` of the Azure Azure Web PubSub service `Send*` REST APIs:


```
/* Top-level rule */

filter_expression ::= boolean_expression

/* Identifiers */
string_identifier ::= 'connectionId' | 'userId' 
collection_identifier ::= 'groups'

/* Rules for $filter */

boolean_expression ::= logical_expression
                     | comparison_expression
                     | in_expression
                     | boolean_literal
                     | boolean_function_call
                     | '(' boolean_expression ')'

logical_expression ::= boolean_expression ('and' | 'or') boolean_expression
                     | 'not' boolean_expression

comparison_expression ::= primary_expression comparison_operator primary_expression

in_expression ::= primary_expression 'in'  ( '(' primary_expression (',' primary_expression)* ')' ) | collection_expression  

collection_expression ::= collection_variable
                        | '(' collection_expression ')'

primary_expression ::= primary_variable 
                     | function_call
                     | constant
                     | '(' primary_expression ')'

string_expression ::= string_literal
                    | 'null'
                    | string_identifier
                    | string_function_call
                    | '(' string_expression ')'

primary_variable ::= string_identifier 
collection_variable ::= collection_identifier

comparison_operator ::= 'gt' | 'lt' | 'ge' | 'le' | 'eq' | 'ne'

/* Rules for constants and literals */
constant     ::=      string_literal
                    | integer_literal
                    | boolean_literal
                    | 'null'

boolean_literal ::= 'true' | 'false'

string_literal ::= "'"([^'] | "''")*"'"

digit ::= [0-9]
sign ::= '+' | '-'
integer_literal ::= sign? digit+

boolean_literal ::= 'true' | 'false'

/* Rules for functions */

function_call ::= indexof_function_call 
                | length_function_call 
                | string_function_call
                | boolean_function_call

boolean_function_call ::= endsWith_function_call 
                        | startsWith_function_call 
                        | contains_function_call
string_function_call  ::= tolower_function_call 
                        | toupper_function_call  
                        | trim_function_call 
                        | substring_function_call 
                        | concat_function_call

/* Rules for string functions */
indexof_function_call    ::= "indexof"     '(' string_expression ',' string_expression ')'
concat_function_call     ::= "concat"     '(' string_expression ',' string_expression ')'
contains_function_call   ::= "contains"   '(' string_expression ',' string_expression ')'
endsWith_function_call   ::= "endswith"   '(' string_expression ',' string_expression ')'
startsWith_function_call ::= "startswith" '(' string_expression ',' string_expression ')'
substring_function_call  ::= "substring"  '(' string_expression ',' integer_literal (',' integer_literal)? ')'
tolower_function_call    ::= "tolower"    '(' string_expression ')'
toupper_function_call    ::= "toupper"    '(' string_expression ')'
trim_function_call       ::= "trim"       '(' string_expression ')'

/* Rules for string and collection functions */
length_function_call     ::= "length"     '(' string_expression | collection_expression ')'
```

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
