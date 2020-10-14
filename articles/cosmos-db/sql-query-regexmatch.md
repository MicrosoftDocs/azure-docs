---
title: RegexMatch in Azure Cosmos DB query language
description: Learn about the RegexMatch SQL system function in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/13/2020
ms.author: tisande
ms.custom: query-reference
---
# REGEXMATCH (Azure Cosmos DB)

Provides regular expression capabilities. Regular expressions are a concise and flexible notation for finding and replacing patterns of text. Azure Cosmos DB uses [PCRE2 version 10.34](http://www.pcre.org/).

## Syntax
  
```sql
RegexMatch(<str_expr1>, <str_expr2>, <str_expr3>)  
```  
  
## Arguments
  
*str_expr1*  
   Is the string expression to be searched.  
  
*str_expr2*  
   Is the regular expression.

*str_expr3*
   Is the string of selected modifiers to use with the regular expression. This string value is mandatory. If you'd like to run RegexMatch with no modifiers, you should add an empty string. 

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
SELECT REGEXMATCH("abcd", "ABC", "") AS NoModifiers, 
REGEXMATCH("abcd", "ABC", "i") AS CaseInsensitive, 
REGEXMATCH("abcd", "ab.", "") AS WildcardCharacter,
REGEXMATCH("abcd", "ab c", "x") AS IgnoreWhiteSpace, 
REGEXMATCH("abcd", "aB c", "ix") AS CaseInsensitiveAndIgnoreWhiteSpace 
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

With RegexMatch, you can use metacharacters to do more complex string searches than wouldn't otherwise be possible with the StartsWith, EndsWith, Contains, or StringEquals system functions. Here are some additional examples, which you can run using the nutrition data set available through the [Azure Cosmos DB Query Playground](https://www.documentdb.com/sql/demo). If you need to use a metacharacter in a regular expression and don't want it to have special meaning, you should escape the metacharacter using `\`.

**Check items that have a description that contains the "salt" exactly once**

```sql
SELECT * 
FROM c 
WHERE REGEXMATCH(c.description, "salt{1}","")
```

**Check items that have a description that contain a number between 0 and 99**

```sql
SELECT * 
FROM c 
WHERE REGEXMATCH(c.description, "[0-99]","")
```

**Check items that have a description that contain four letter words starting with "S" or "s"**

```sql
SELECT * 
FROM c 
WHERE REGEXMATCH(c.description, " s... ","i")
```

## Remarks

This system function will benefit from a [range index](index-policy.md#includeexclude-strategy) if the regular expression can be broken down into either StartsWith, EndsWith, Contains, or StringEquals system functions.

## Next steps

- [String functions Azure Cosmos DB](sql-query-string-functions.md)
- [System functions Azure Cosmos DB](sql-query-system-functions.md)
- [Introduction to Azure Cosmos DB](introduction.md)
