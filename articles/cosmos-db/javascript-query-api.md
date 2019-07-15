---
title: Working with JavaScript language-integrated query API in Azure Cosmos DB
description: This article introduces the concepts for JavaScript language-integrated query API to create stored procedures and triggers in Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: mjbrown
ms.reviewer: sngun

---

# JavaScript query API in Azure Cosmos DB

In addition to issuing queries using the SQL API in Azure Cosmos DB, the [Cosmos DB server-side SDK](https://azure.github.io/azure-cosmosdb-js-server/) allows you to perform optimized queries using a JavaScript interface. You don't have to be aware of the SQL language to use this JavaScript interface. The JavaScript query API allows you to programmatically build queries by passing predicate functions into sequence of function calls, with a syntax familiar to ECMAScript5's array built-ins and popular JavaScript libraries like Lodash. Queries are parsed by the JavaScript runtime and efficiently executed using Azure Cosmos DB indices.

## Supported JavaScript functions

| **Function** | **Description** |
|---------|---------|
|`chain() ... .value([callback] [, options])`|Starts a chained call that must be terminated with value().|
|`filter(predicateFunction [, options] [, callback])`|Filters the input using a predicate function that returns true/false in order to filter in/out input documents into the resulting set. This function behaves similar to a WHERE clause in SQL.|
|`flatten([isShallow] [, options] [, callback])`|Combines and flattens arrays from each input item into a single array. This function behaves similar to SelectMany in LINQ.|
|`map(transformationFunction [, options] [, callback])`|Applies a projection given a transformation function that maps each input item to a JavaScript object or value. This function behaves similar to a SELECT clause in SQL.|
|`pluck([propertyName] [, options] [, callback])`|This function is a shortcut for a map that extracts the value of a single property from each input item.|
|`sortBy([predicate] [, options] [, callback])`|Produces a new set of documents by sorting the documents in the input document stream in ascending order by using the given predicate. This function behaves similar to an ORDER BY clause in SQL.|
|`sortByDescending([predicate] [, options] [, callback])`|Produces a new set of documents by sorting the documents in the input document stream in descending order using the given predicate. This function behaves similar to an ORDER BY x DESC clause in SQL.|
|`unwind(collectionSelector, [resultSelector], [options], [callback])`|Performs a self-join with inner array and adds results from both sides as tuples to the result projection. For instance, joining a person document with person.pets would produce [person, pet] tuples. This is similar to SelectMany in .NET LINK.|

When included inside predicate and/or selector functions, the following JavaScript constructs get automatically optimized to run directly on Azure Cosmos DB indices:

- Simple operators: `=` `+` `-` `*` `/` `%` `|` `^` `&` `==` `!=` `===` `!===` `<` `>` `<=` `>=` `||` `&&` `<<` `>>` `>>>!` `~`
- Literals, including the object literal: {}
- var, return

The following JavaScript constructs do not get optimized for Azure Cosmos DB indices:

- Control flow (for example, if, for, while)
- Function calls

For more information, see the [Cosmos DB Server Side JavaScript Documentation](https://azure.github.io/azure-cosmosdb-js-server/).

## SQL to JavaScript cheat sheet

The following table presents various SQL queries and the corresponding JavaScript queries. As with SQL queries, properties (for example, item.id) are case-sensitive.

> [!NOTE]
> `__` (double-underscore) is an alias to `getContext().getCollection()` when using the JavaScript query API.

|**SQL**|**JavaScript Query API**|**Description**|
|---|---|---|
|SELECT *<br>FROM docs| __.map(function(doc) { <br>&nbsp;&nbsp;&nbsp;&nbsp;return doc;<br>});|Results in all documents (paginated with continuation token) as is.|
|SELECT <br>&nbsp;&nbsp;&nbsp;docs.id,<br>&nbsp;&nbsp;&nbsp;docs.message AS msg,<br>&nbsp;&nbsp;&nbsp;docs.actions <br>FROM docs|__.map(function(doc) {<br>&nbsp;&nbsp;&nbsp;&nbsp;return {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: doc.id,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msg: doc.message,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;actions:doc.actions<br>&nbsp;&nbsp;&nbsp;&nbsp;};<br>});|Projects the id, message (aliased to msg), and action from all documents.|
|SELECT *<br>FROM docs<br>WHERE<br>&nbsp;&nbsp;&nbsp;docs.id="X998_Y998"|__.filter(function(doc) {<br>&nbsp;&nbsp;&nbsp;&nbsp;return doc.id ==="X998_Y998";<br>});|Queries for documents with the predicate: id = "X998_Y998".|
|SELECT *<br>FROM docs<br>WHERE<br>&nbsp;&nbsp;&nbsp;ARRAY_CONTAINS(docs.Tags, 123)|__.filter(function(x) {<br>&nbsp;&nbsp;&nbsp;&nbsp;return x.Tags && x.Tags.indexOf(123) > -1;<br>});|Queries for documents that have a Tags property and Tags is an array containing the value 123.|
|SELECT<br>&nbsp;&nbsp;&nbsp;docs.id,<br>&nbsp;&nbsp;&nbsp;docs.message AS msg<br>FROM docs<br>WHERE<br>&nbsp;&nbsp;&nbsp;docs.id="X998_Y998"|__.chain()<br>&nbsp;&nbsp;&nbsp;&nbsp;.filter(function(doc) {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return doc.id ==="X998_Y998";<br>&nbsp;&nbsp;&nbsp;&nbsp;})<br>&nbsp;&nbsp;&nbsp;&nbsp;.map(function(doc) {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: doc.id,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;msg: doc.message<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;};<br>&nbsp;&nbsp;&nbsp;&nbsp;})<br>.value();|Queries for documents with a predicate, id = "X998_Y998", and then projects the id and message (aliased to msg).|
|SELECT VALUE tag<br>FROM docs<br>JOIN tag IN docs.Tags<br>ORDER BY docs._ts|__.chain()<br>&nbsp;&nbsp;&nbsp;&nbsp;.filter(function(doc) {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return doc.Tags && Array.isArray(doc.Tags);<br>&nbsp;&nbsp;&nbsp;&nbsp;})<br>&nbsp;&nbsp;&nbsp;&nbsp;.sortBy(function(doc) {<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return doc._ts;<br>&nbsp;&nbsp;&nbsp;&nbsp;})<br>&nbsp;&nbsp;&nbsp;&nbsp;.pluck("Tags")<br>&nbsp;&nbsp;&nbsp;&nbsp;.flatten()<br>&nbsp;&nbsp;&nbsp;&nbsp;.value()|Filters for documents that have an array property, Tags, and sorts the resulting documents by the _ts timestamp system property, and then projects + flattens the Tags array.|

## Next steps

Learn more concepts and how-to write and use stored procedures, triggers, and user-defined functions in Azure Cosmos DB:

- [How to write stored procedures and triggers using Javascript Query API](how-to-write-javascript-query-api.md)
- [Working with Azure Cosmos DB stored procedures, triggers and user-defined functions](stored-procedures-triggers-udfs.md)
- [How to use stored procedures, triggers, user-defined functions in Azure Cosmos DB](how-to-use-stored-procedures-triggers-udfs.md)
- [Azure Cosmos DB JavaScript server-side API reference](https://azure.github.io/azure-cosmosdb-js-server)
- [JavaScript ES6 (ECMA 2015)](https://www.ecma-international.org/ecma-262/6.0/)
