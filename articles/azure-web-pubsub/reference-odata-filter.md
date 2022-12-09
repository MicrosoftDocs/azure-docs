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

Azure Web PubSub's **filter** parameter defines inclusion or exclusion criteria for sending messages to connections. This parameter is used in the [Send to all](/rest/api/webpubsub/dataplane/web-pub-sub/send-to-all), [Send to group](/rest/api/webpubsub/dataplane/web-pub-sub/send-to-group), and [Send to user](/rest/api/webpubsub/dataplane/web-pub-sub/send-to-user) operations.

This article provides the following resources:

- A description of the OData syntax of the **filter** parameter with examples.
- A description of the complete [Extended Backus-Naur Form](#formal-grammar) grammar.
- A browsable [syntax diagram](https://aka.ms/awps/filter-syntax-diagram) to interactively explore the syntax grammar rules.

## Syntax

A filter in the OData language is boolean expression, which in turn can be one of several types of expression, as shown by the following EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) description:

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

An interactive syntax diagram is available at, [OData syntax diagram for Azure Web PubSub service](https://aka.ms/awps/filter-syntax-diagram).

For the complete EBNF, see [formal grammar section](#formal-grammar) .

### Identifiers

Using the filter syntax, you can control sending messages to connections matching the identifier criteria.  Azure Web PubSub supports below identifiers:

| Identifier | Description | Note | Examples |
| --- | --- |--| --
| `userId` | The userId of the connection. | Case insensitive. It can be used in [string operations](#supported-operations). | `userId eq 'user1'`
| `connectionId` | The connectionId of the connection. | Case insensitive. It can be used in [string operations](#supported-operations). | `connectionId ne '123'`
| `groups` | The collection of groups the connection is currently in. | Case insensitive. It can be used in [collection operations](#supported-operations). | `'group1' in groups`

Identifiers refer to the property value of a connection. Azure Web PubSub supports three identifiers matching the property name of the connection model. and supports identifiers `userId` and `connectionId` in string operations, supports identifier `groups` in [collection operations](#supported-operations). For example, to filter out connections with userId `user1`, we specify the filter as `userId eq 'user1'`. Read through the below sections for more samples using the filter.

### Boolean expressions

The expression for a filter is a boolean expression. Azure Web PubSub sends messages to connections with filter expressions evaluated to `true`.

The types of boolean expressions include:

- Logical expressions that combine other boolean expressions using the operators `and`, `or`, and `not`. 
- Comparison expressions, which compare fields or range variables to constant values using the operators `eq`, `ne`, `gt`, `lt`, `ge`, and `le`.
- The boolean literals `true` and `false`. These constants can be useful sometimes when programmatically generating filters, but otherwise don't tend to be used in practice.
- Boolean expressions in parentheses. Using parentheses helps to explicitly determine the order of operations in a filter. For more information on the default precedence of the OData operators, see [operator precedence section](#operator-precedence).

### Supported operations

The filter syntax supports the following operations:

| Operator | Description | Example
| --- | --- | ---
| **Logical Operators**
| `and` | Logical and | `length(userId) le 10 and length(userId) gt 3`
| `or` | Logical or | `length(userId) gt 10 or length(userId) le 3`
| `not` | Logical negation | `not endswith(userId, 'milk')`
| **Comparison Operators**
| `eq` | Equal | `userId eq 'user1'`, </br> `userId eq null`
| `ne` | Not equal | `userId ne 'user1'`, </br> `userId ne null`
| `gt` | Greater than | `length(userId) gt 10`
| `ge` | Greater than or equal | `length(userId) ge 10`
| `lt` | Less than | `length(userId) lt 3`
| `le` | Less than or equal | `'group1' in groups`, </br> `user in ('user1','user2')`
| **In Operator**
| `in` | The right operand MUST be either a comma-separated list of primitive values, enclosed in parentheses, or a single expression that resolves to a collection.| `userId ne 'user1'`
| **Grouping Operator**
| `()` | Controls the evaluation order of an expression | `userId eq 'user1' or (not (startswith(userId,'user2'))`
| **String Functions**
| `string tolower(string p)` | Get the lower case for the string value | `tolower(userId) eq 'user1'` can match connections for user `USER1` 
| `string toupper(string p)` | Get the upper case for the string value | `toupper(userId) eq 'USER1'` can match connections for user `user1` 
| `string trim(string p)` | Trim the string value | `trim(userId) eq 'user1'` can match connections for user ` user1 ` 
| `string substring(string p, int startIndex)`,</br>`string substring(string p, int startIndex, int length)` | Substring of the string | `substring(userId,5,2) eq 'ab'` can match connections for user `user-ab-de` 
| `bool endswith(string p0, string p1)` | Check if `p0` ends with `p1` | `endswith(userId,'de')` can match connections for user `user-ab-de` 
| `bool startswith(string p0, string p1)` | Check if `p0` starts with `p1` | `startswith(userId,'user')` can match connections for user `user-ab-de` 
| `int indexof(string p0, string p1)` | Get the index of `p1` in `p0`. Returns `-1` if `p0` doesn't contain `p1`. | `indexof(userId,'-ab-') ge 0` can match connections for user `user-ab-de`
| `int length(string p)` | Get the length of the input string | `length(userId) gt 1` can match connections for user `user-ab-de`
| **Collection Functions**
| `int length(collection p)` | Get the length of the collection | `length(groups) gt 1` can match connections in two groups

### Operator precedence

If you write a filter expression with no parentheses around its subexpressions, Azure Web PubSub service will evaluate it according to a set of operator precedence rules. These rules are based on which operators are used to combine subexpressions. The following table lists groups of operators in order from highest to lowest precedence:

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

The `not` operator has the highest precedence of all, even higher than the comparison operators. If you write a filter like this:

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

There are limits to the size and complexity of filter expressions that you can send to Azure Web PubSub service. The limits are based roughly on the number of clauses in your filter expression. A good guideline is that if you have over 100 clauses, you are at risk of exceeding the limit. To avoid exceeding the limit, design your application so that it doesn't generate filters of unbounded size.

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

We can describe the subset of the OData language supported by Azure Web PubSub service using an EBNF ([Extended Backus-Naur Form](https://en.wikipedia.org/wiki/Extended_Backus–Naur_form)) grammar. Rules are listed "top-down", starting with the most complex expressions, then breaking them down into more primitive expressions.  The top is the grammar rule for `$filter` that corresponds to specific parameter `filter` of the Azure Web PubSub service `Send*` REST APIs:


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
