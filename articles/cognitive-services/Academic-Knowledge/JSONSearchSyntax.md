---
title: JSON search syntax - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn about the JSON search syntax you can use in the Academic Knowledge API.
services: cognitive-services
author: alch-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: academic-knowledge
ms.topic: conceptual
ms.date: 03/23/2017
ms.author: alch
---

# JSON Search Syntax

```javascript
/* Query Object:
   Suppose we have a query path /v0/e0/v1/e1/...
   A query object contains constraints to be applied to graph nodes in a path.
   Constraints are given in <"node identifier", {constraint object}> key-value pairs: 
*/
{
    /* query path can also be set in the query object */
    path: "/v0/e0/v1/e1/.../vn/",
    v0: { /* A Constraint Object */ },
    v1: { /* A Constraint Object */ },
}
```

The node names in a query path (_v0, v1, ..._) serve as node identifiers that can be referenced in the query object; the edge names (_e0, e1, ..._) in the path represent the types of the corresponding edges. We can use an asterisk _*_ as a node or edge name (except for the starting node, which must be given) to declare that there are no constraints on such an element. For example, a query path `/v0/*/v1/e1/*/` retrieves paths from the graph without restricting the type of the edge _(v0, v1)_. Meanwhile, the query does not have constraints on the destination (the last node) of the path either.

When a path contains just one node, say _v0_, the query will simply return all entities that satisfy the constraints. A constraint object applied to the starting node is called a *Starting Query Object*, whose specification is given as follows.

```javascript
/* Starting Query Object:
   Specifies constraints on the starting node
*/
{
    /* "match" operator searches for entities with the specified properties. 
       All properties defined in the graph schema be queried such as "Name" and "NormalizedTitle".
     */
    "match": { 
        "Name" : "some name",
        ...
    },
    /* "id" operator directly specifies the IDs of the starting nodes. 
       When it is present, the "match" operator is ignored. 
     */
    "id": [ id1, id2, id3... ],
    /* "type" operator limits results to a certain type of entities,
       for example, "Author" or "Paper".
     */
    "type": "Author",
    /* "select" operator pulls properties from the database and 
       returns them to the client.
     */
    "select": ["PaperRank", ...]
}
```

When a path contains more than just a starting node, the query processor will perform a graph traversal following the specified path pattern. When it arrives at a node, the user-specified traversal actions will be triggered, that is, whether to stop at the current node and return or to continue to explore the graph. When no traversal action is specified, default actions will be taken. For an intermediate node, the default action is to continue to explore the
graph. For the last node of a path, the default action is to stop and return. A constraint object that specifies traversal actions is called a *Traversal Action Object*. Its specification is given as follows:

```javascript
/* Traversal Action Object:
   Specifies graph traversal actions on a node (except for the starting node).
 */
{
    /* Set the continue condition here. */
    continue: { 
        /* simple property exact match */
        "property_key" : "property_value", 
        /* Advanced query operators */
        /* -- Numerical comparisons */
        "property_key_2" : { "gt" /* or simply ">" */ : 123 },
        /* -- Substring query */
        "property_key_3" : { "substring" : "456" },
        /* -- CellID query */
        "id": [ 111, 222, 333... ],
        /* -- Entity type query */
        "type": "cell_type",
        /* -- Property existance query */
	    "has" : "property_key_4",
        /* -- Logical operators */
        /* ---- Note that, by default the operators are combined with AND semantics */
		
	    /* -- OR operator */
	    "or": {
	      /* Query operators... */
	    },
        /* -- NOT operator */
        "not": {
            /* Query operators... */
        }
    },
    /* Set the return condition here. */
    return: {
        /* Same operators as the continue object */
    },
    /* The selected properties to return. */
    select: ["property_key_1", ...]
}
```

The POST body of a *json* search query should contain at least a *path* pattern. Traverse action objects are optional. Here are two examples.

```JSON
{
  "path": "/series/ConferenceInstanceIDs/conference/FieldOfStudyIDs/field",
  "series": {
    "type": "ConferenceSeries",
    "FullName": "graph",
    "select": [ "FullName", "ShortName" ]
  },
  "conference": {
    "type": "ConferenceInstance",
    "select": [ "FullName" ]
  },
  "field": {
    "type": "FieldOfStudy",
    "select": [ "Name" ],
    "return": { "Name": { "substring" : "World Wide Web" } }
  }
}
```

```JSON
{
  "path": "/author/PaperIDs/paper",
  "author": {
    "type": "Author",
    "select": [ "DisplayAuthorName" ],
    "match": { "Name": "leslie lamport" }
  },
  "paper": {
    "type": "Paper",
    "select": [ "OriginalTitle", "CitationCount" ],
    "return": { "CitationCount": { "gt": 100 } }
  }
}
```

