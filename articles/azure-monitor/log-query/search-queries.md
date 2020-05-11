---
title: Search queries in Azure Monitor logs | Microsoft Docs
description: This article provides a tutorial for getting started using search in Azure Monitor log queries.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/06/2018

---

# Search queries in Azure Monitor logs
Azure Monitor log queries can start with either a table name or a search command. This tutorial covers search-based queries. There are advantages to each method.

Table-based queries start by scoping the query and therefore tend to be more efficient than search queries. Search queries are less structured which makes them the better choice when searching for a specific value across columns or tables. **search** can scan all columns in a given table, or in all tables, for the specified value. The amount of data being processed could be enormous, which is 
why these queries could take longer to complete and might return very large result sets.

## Search a term
The **search** command is typically used to search a specific term. In the following example, all columns in all tables are scanned for the term "error":

```Kusto
search "error"
| take 100
```

While they're easy to use, unscoped queries like the one showed above are not efficient and are likely to return many irrelevant results. A better practice would be to search in the relevant table, or even a specific column.

### Table scoping
To search a term in a specific table, add `in (table-name)` just after the **search** operator:

```Kusto
search in (Event) "error"
| take 100
```

or in multiple tables:
```Kusto
search in (Event, SecurityEvent) "error"
| take 100
```

### Table and column scoping
By default, **search** will evaluate all columns in the data set. To search only a specific column (named *Source* in the below example), use this syntax:

```Kusto
search in (Event) Source:"error"
| take 100
```

> [!TIP]
> If you use `==` instead of `:`, the results would include records in which the *Source* column has the exact value "error", and in this exact case. Using ':' will include records where *Source* has values such as "error code 404" or "Error".

## Case-sensitivity
By default, term search is case-insensitive, so searching "dns" could yield results such as "DNS", "dns", or "Dns". To make the search case-sensitive, use the `kind` option:

```Kusto
search kind=case_sensitive in (Event) "DNS"
| take 100
```

## Use wild cards
The **search** command supports wild cards, at the beginning, end or middle of a term.

To search terms that start with "win":
```Kusto
search in (Event) "win*"
| take 100
```

To search terms that end with ".com":
```Kusto
search in (Event) "*.com"
| take 100
```

To search terms that contain "www":
```Kusto
search in (Event) "*www*"
| take 100
```

To search terms that starts with "corp" and ends in ".com", such as "corp.mydomain.com""

```Kusto
search in (Event) "corp*.com"
| take 100
```

You can also get everything in a table by using just a wild card: `search in (Event) *`, but that would be the same as writing just `Event`.

> [!TIP]
> While you can use `search *` to get every column from every table, it's recommended that you always scope your queries to specific tables. Unscoped queries may take a while to complete and might return too many results.

## Add *and* / *or* to search queries
Use **and** to search for records that contain multiple terms:

```Kusto
search in (Event) "error" and "register"
| take 100
```

Use **or** to get records that contain at least one of the terms:

```Kusto
search in (Event) "error" or "register"
| take 100
```

If you have multiple search conditions, you can combine them into the same query using parentheses:

```Kusto
search in (Event) "error" and ("register" or "marshal*")
| take 100
```

The results of this example would be records that contain the term "error" and also contain either "register" or something that starts with "marshal".

## Pipe search queries
Just like any other command, **search** can be piped so search results can be filtered, sorted, and aggregated. For example, to get the number of *Event* records that contain "win":

```Kusto
search in (Event) "win"
| count
```




## Next steps

- See further tutorials on the [Kusto query language site](/azure/kusto/query/).
