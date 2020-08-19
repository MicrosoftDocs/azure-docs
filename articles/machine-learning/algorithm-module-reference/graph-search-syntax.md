---
title: "Graph search query syntax"
titleSuffix: Azure Machine Learning
description: Learn how to use custom query to search for a node in pipeline graph.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 8/8/2020
---
# Graph search query syntax

The graph search feature support search by full-text keyword on node name and comment. It also supports filter by node's property like runStatus, duration, computeTarget etc.

The keyword search leverages lucene query. The filter recognizes a simple filter query describes below.

The complete search query looks like this:  
**[lucene query] | [filter query]** 

 

Customer can use only one of Lucene query or filter query. If there is need to use both, separator **|** is required.

 
The syntax of the filter query is more strict than Lucene query, so if customer input can be parsed as both, filter query will be applied.

 

## Lucene query


Graph search will use Lucene simple query as full-text search syntax on node "name" and "comment". Following Lucene operator is supported:

 
- AND/OR
- Wildcard matching ? / *

 
### Examples

 

- Simple search


    JSON Data

- AND/OR

 

    JSON AND Validation

 

- Complicated AND/OR

 

    (JSON AND Validation) OR (TSV AND Training)

 

- Wildcard matching (**Please note that * can not be the first character of lucene query**)
    - machi?e learning
    - mach*ing

 


 

##  Filter query

 
Filter query will follow below pattern.

 

**[key1] [operator1] [value1]; [key2] [operator1] [value2];**

 

Following node properties are supported as key:

- Run Status
- Compute Target
- Duration
- Reuse

And following operators are supported:

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

### Technical notes

- The relation between different filters is "AND"
- If `>= / > / < / <=` these 4 operators is chosed, the value will be automatically convert to number type, otherwise string is used for comparison.
- For all string type value, case is insensitive in comparison.
- Operator "In" expect a collection as value, collection syntax is `{name1, name2, name3}`
- Space will be ignored between keywords