---
title: RegexMatch
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that provides regular expression capabilities.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# RegexMatch (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

This function provides regular expression capabilities. Regular expressions are a concise and flexible notation for finding patterns of text.

> [!NOTE]
> Azure Cosmos DB for NoSQL uses [PERL compatible regular expressions (PCRE)](https://pcre2project.github.io/pcre2/).

## Syntax

```sql
RegexMatch(<string_expr_1>, <string_expr_2>, [, <string_expr_3>])  
```  

## Arguments

| | Description |
| --- | --- |
| **`string_expr_1`** | A string expression to be searched. |
| **`string_expr_2`** | A string expression with a regular expression defined to use when searching `string_expr_1`. |
| **`string_expr_3`** *(Optional)* | An optional string expression with the selected modifiers to use with the regular expression (`string_expr_2`). If not provided, the default is to run the regular expression match with no modifiers. |

> [!NOTE]
> Providing an empty string for `string_expr_3` is functionally equivalent to omitting the argument.

## Return types

Returns a boolean expression.

## Examples

The following example illustrates regular expression matches using a few different modifiers.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/regexmatch/query.sql" highlight="2-9":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/regexmatch/result.json":::

The next example assumes that you have a container with items including a `name` field.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/regexmatch-field/seed.json" range="1-2,4-7,9-12,14-17" highlight="3,7,11":::

This example uses a regular expression match as a filter to return a subset of items.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/regexmatch-field/query.sql" highlight="7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/regexmatch-field/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy) only if the regular expression can be broken down into either `StartsWith`, `EndsWith`, `Contains`, or `StringEquals` equivalent system functions.
- Returns `undefined` if the string expression to be searched (`string_expr_1`), the regular expression (`string_expr_2`), or the selected modifiers (`string_expr_3`) are invalid.
- This function supports the following four modifiers:
    | | Format | Description |
    | --- | --- | --- |
    | **Multiple lines** | `m` | Treat the string expression to be searched as multiple lines. Without this option, the characters `^` and `$` match at the beginning or end of the string and not each individual line. |
    | **Match any string** | `s` | Allow "." to match any character, including a newline character. |
    | **Ignore case** | `i` | Ignore case when pattern matching. |
    | **Ignore whitespace** | `x` | Ignore all whitespace characters. |
- If you'd like to use a meta-character in a regular expression and don't want it to have special meaning, you should escape the metacharacter using `\`.

## Next steps

- [System functions](system-functions.yml)
- [`IS_STRING`](is-string.md)
