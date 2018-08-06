# Search Queries

<br/>
> [!Note]
> Before you start...<br/>
> If you haven't completed the [Getting started with queries](./getting-started-with-queries.md) tutorial yet, it is recommended that you do so.

Azure Log Analytics queries can start with either a table name or a search command. This tutorial covers search-based queries.</br>
Selecting the preferred query style is somewhat a matter of personal preference, but there are pros and cons to each. </br>
Table-based queries start by scoping the query, and therefore tend to be more efficient than search queries.</br>
</br>
Search queries are less structure by nature, which makes them the better choice when searching for a specific value across columns or tables. In other words, 
*search* can scan all columns in a given table, or in all tables (!), for the defined value. The amount of data being processed could be enormous, which is 
why these queries could take longer to complete, and might return huge result sets (capped by the client to 10K).

For that reason, most examples shown below include a *"take"* clause, making them more efficient.

## Search a term
The typical search use case is searching a specific term. Here, all columns in all tables are scanned for the term "error".
```OQL
search "error"
| take 100
```

While easy to use, unscoped queries (like the one showed above) are not efficient and are likely to return many irrelevant results.
A better practice would be to search in the relevant table, or even a specific column.

### Table scoping
To search a term in a specific table, add `in (table-name)` just after the *search* operator:
```OQL
search in (Event) "error"
| take 100
```

Or in multiple tables:
```OQL
search in (Event, SecurityEvent) "error"
| take 100
```

### Table and column scoping
By default, *search* will evaluate (check if a field contains a value) all columns in the data set. To search only a specific column, use this syntax:
```OQL
search in (Event) Source:"error"
| take 100
```
Note: if you use `==` instead of `:`, the results would include records in which the *Source* column has **the exact** value "error", and in this exact 
case (i.e. will not include records in which *Source* is "error code 404" or "Error").

## Case-sensitivity
By default, term search is case-insensitive, so searching "dns" could yield results that include "DNS", "dns", "Dns" etc.
To make the search case-sensitive, use the `kind` option:
```OQL
search kind=case_sensitive in (Event) "DNS"
| take 100
```

## Use wild cards
The *search* command supports wild cards, at the beginning, end or even middle of a term.<br/>
To search terms that start with "win":
```OQL
search in (Event) "win*"
| take 100
```
To search terms that end with ".com":
```OQL
search in (Event) "*.com"
| take 100
```
To search terms that contain "www":
```OQL
search in (Event) "*www*"
| take 100
```
To search terms that follow the pattern "corp"-something-".com", such as "corp.mydomain.com" and "corp.yourdomain.com"
```OQL
search in (Event) "corp*.com"
| take 100
```
You can also get everything in a table by using just a wild card: `search in (Event) *`, but that would be the same as writing just `Event`.

> [!TIP]
> While you can use "search *" to get every column from every table, it's recommended that you always scope your queries to specific tables.
> Unscoped queries may take a while to complete and might return too many results.

## Add *and* / *or* to search queries
Most basically, use *and* to search for records that contain multiple terms:
```OQL
search in (Event) "error" and "register"
| take 100
```
... and use *or* to get records that contain at least one of the terms:
```OQL
search in (Event) "error" or "register"
| take 100
```

If you have multiple search conditions, you can combine them into the same query:
```OQL
search in (Event) "error" and ("register" or "marshal*")
| take 100
```
The results of this example would be records that contain the term "error", and also contain either "register" or something that starts with "marshal".

## Pipe search queries
Just like any other command, *search* can be piped as well, so search results can be filtered, sorted, aggregated etc. 
For example, to get the number of *Event* records that contain "win":
```OQL
search in (Event) "win"
| count
```


That's it! you're now a search savvy!


## Next steps
Continue with the advanced tutorials:
* [Date and time operations](./datetime-operations.md)
* [String operations](./string-operations.md)
* [Aggregation functions](./aggregations.md)
* [Advanced aggregations](./advanced-aggregations.md)
* [Charts and diagrams](./charts.md)
* [Working with JSON and data structures](./json-and-data-structures.md)
* [Advanced query writing](./advanced-query-writing.md)
* [Joins - cross analysis](./joins.md)