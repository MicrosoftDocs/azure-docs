---
title: "Graph search query syntax"
titleSuffix: Azure Machine Learning
description: Learn how to use the search query syntax in Azure Machine Learning designer to search for nodes in in pipeline graph.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 8/24/2020
---
# Graph search query syntax

In this article, you learn about the graph search query syntax in Azure Machine Learning. The graph search feature lets you search for a node by its name and properties. 

 ![Animated screenshot showing an example graph search experience](media/search/graph-search.gif)

Graph search supports full-text keyword search on node name and comments. You can also filters on node property like runStatus, duration, computeTarget. The keyword search is based on Lucene query. A complete search query looks like this:  

**[lucene query | [filter query]** 

You can use either Lucene query or filter query. To use both, use the **|** separator. The syntax of the filter query is more strict than Lucene query. So if customer input can be parsed as both, the filter query will be applied.

 

## Lucene query

Graph search uses Lucene simple query as full-text search syntax on node "name" and "comment". The following Lucene operators are supported:

 
- AND/OR
- Wildcard matching with **?** and **\*** operators.

### Examples

- Simple search: `JSON Data`

- AND/OR: `JSON AND Validation`

- Multiple AND/OR: `(JSON AND Validation) OR (TSV AND Training)`

 
- Wildcard matching: 
    - `machi?e learning`
    - `mach*ing`
 
>[!NOTE]
> You cannot start a Lucene query with a "*" character.

##  Filter query

 
Filter queries use the following pattern:
 
`**[key1] [operator1] [value1]; [key2] [operator1] [value2];**`

 
You can use the following node properties as keys:

- runStatus
- compute
- duration
- reuse

And use the following operators:

- Greater or equal: `>=`
- Less or equal: `<=`
- Greater: `>`
- Less: `<`
- Equal: `==`
- Contain: `=`
- NotEqual: `!=`
- In: `in`

 
 

### Example

- duration > 100;
- status in { Failed,NotStarted}
- compute in {gpu-cluster}; runStatus in {Completed}

## Technical notes

- The relationship between multiple filters is "AND"
- If `>=,  >,  <, or  <=` is chosen, values will automatically be converted to number type. Otherwise, string types are used for comparison.
- For all string type values, case is insensitive in comparison.
- Operator "In" expects a collection as value, collection syntax is `{name1, name2, name3}`
- Space will be ignored between keywords