---
title: RegexMatch in Azure Cosmos DB query language
description: Learn about the RegexMatch SQL system function in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 10/13/2020
ms.author: tisande
ms.custom: query-reference
---
# REGEXMATCH (Azure Cosmos DB)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Provides regular expression capabilities. Regular expressions are a concise and flexible notation for finding patterns of text. Azure Cosmos DB uses [PERL compatible regular expressions (PCRE)](http://www.pcre.org/). 

## Syntax
  
```sql
RegexMatch(<str_expr1>, <str_expr2>, [, <str_expr3>])  
```  
  
## Arguments
  
*str_expr1*  
   Is the string expression to be searched.  
  
*str_expr2*  
   Is the regular expression.

*str_expr3*  
   Is the string of selected modifiers to use with the regular expression. This string value is optional. If you'd like to run RegexMatch with no modifiers, you can either add an empty string or omit entirely. 

You can learn about [syntax for creating regular expressions in Perl](https://perldoc.perl.org/perlre). 

Azure Cosmos DB supports the following four modifiers:

| Modifier | Description |
| ------ | ----------- |
| `m` | Treat the string expression to be searched as multiple lines. Without this option, "^" and "$" will match at the beginning or end of the string and not each individual line. |
| `s` | Allow "." to match any character, including a newline character. | 
| `i` | Ignore case when pattern matching. |
| `x` | Ignore all whitespace characters. |

## Return types
  
  Returns a Boolean expression. Returns undefined if the string expression to be searched, the regular expression, or the selected modifiers are invalid.
  
## Examples
  
The following simple RegexMatch example checks the string "abcd" for regular expression match using a few different modifiers.
  
```sql
SELECT RegexMatch ("abcd", "ABC", "") AS NoModifiers, 
RegexMatch ("abcd", "ABC", "i") AS CaseInsensitive, 
RegexMatch ("abcd", "ab.", "") AS WildcardCharacter,
RegexMatch ("abcd", "ab c", "x") AS IgnoreWhiteSpace, 
RegexMatch ("abcd", "aB c", "ix") AS CaseInsensitiveAndIgnoreWhiteSpace 
```  
  
 Here is the result set.  
  
```json
[
    {
        "NoModifiers": false,
        "CaseInsensitive": true,
        "WildcardCharacter": true,
        "IgnoreWhiteSpace": true,
        "CaseInsensitiveAndIgnoreWhiteSpace": true
    }
]
```

With RegexMatch, you can use metacharacters to do more complex string searches that wouldn't otherwise be possible with the StartsWith, EndsWith, Contains, or StringEquals system functions. Here are some additional examples:

> [!NOTE] 
> If you need to use a metacharacter in a regular expression and don't want it to have special meaning, you should escape the metacharacter using `\`.

**Check items that have a description that contains the word "salt" exactly once:**

```sql
SELECT * 
FROM c 
WHERE RegexMatch (c.description, "salt{1}","")
```

**Check items that have a description that contain a number between 0 and 99:**

```sql
SELECT * 
FROM c 
WHERE RegexMatch (c.description, "[0-99]","")
```

**Check items that have a description that contain four letter words starting with "S" or "s":**

```sql
SELECT * 
FROM c 
WHERE RegexMatch (c.description, " s... ","i")
```

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy) if the regular expression can be broken down into either StartsWith, EndsWith, Contains, or StringEquals system functions.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
