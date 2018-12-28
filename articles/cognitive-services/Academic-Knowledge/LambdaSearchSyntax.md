---
title: Lambda search syntax - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn about the Lambda search syntax you can use in the Academic Knowledge API.
services: cognitive-services
author: alch-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: academic-knowledge
ms.topic: conceptual
ms.date: 03/23/2017
ms.author: alch
---

# Lambda Search Syntax

Each *lambda* search query string describes a graph pattern. A query must have at least one starting node, specifying from which graph node we start the traversal. To specify a starting node, call the *MAG.StartFrom()* method and pass in the ID(s) of one or more node(s) or a query object that specifies the search constraints. The *StartFrom()* method has three overloads. All of them take two arguments with the second being optional. The first argument can be a long integer, an enumerable collection of long integer, or a string representing a JSON object, with the same semantics as in *json* search:
```
StartFrom(long cellid, IEnumerable<string> select = null)
StartFrom(IEnumerable<long> cellid, IEnumerable<string> select = null)
StartFrom(string queryObject, IEnumerable<string> select = null)
```

The process of writing a lambda search query is to walk from one node to another. To specify the type of the edge to walk through, use *FollowEdge()* and pass in the desired edge types. *FollowEdge()* takes an arbitrary number of string arguments:
```
FollowEdge(params string[] edgeTypes)
```
> [!NOTE]
> If we do not care about the type(s) of the edge(s) to follow, simply omit *FollowEdge()* between two nodes: the query will walk through all the possible edges between these two nodes.

We can specify the traversal actions to be taken on a node via *VisitNode()*, that is, whether to stop at this node and return the current path as the result or to continue to explore the graph.  The enum type *Action* defines two types of actions: *Action.Return* and *Action.Continue*. We can pass such an enum value directly into *VisitNode()*, or combine them with bitwise-and operator '&'. When two action are combined, it means that both actions will be taken. Note: do not use bitwise-or operator '|' on actions. Doing so will cause the query to terminate without returning anything. Skipping *VisitNode()* between two *FollowEdge()* calls will cause the query to unconditionally explore the graph after arriving at a node.

```
VisitNode(Action action, IEnumerable<string> select = null)
```

For *VisitNode()*, we can also pass in a lambda expression of type *Expression\<Func\<INode, Action\>\>*, which takes an *INode* and returns a traversal action:

```
VisitNode(Expression<Func<INode, Action>> action, IEnumerable<string> select = null)
```

## *INode* 

*INode* provides *read-only* data access interfaces and a few built-in helper functions on a node. 

### Basic data access interfaces

##### long CellID

The 64-bit ID of the node. 

##### T GetField\<T\>(string fieldName)

Gets the value of the specified property. *T* is the desired type that the field is supposed to be interpreted as. Automatic type casting will be attempted if the desired type cannot be implicitly converted from the type of the field. Note: when the property is multi-valued, *GetField\<string\>* will cause the list to be serialized to a Json string ["val1", "val2", ...]. If the property does not exist, it will throw an exception and abort the current graph exploration.

##### bool ContainsField(string fieldName)

Tells if a field with the given name exists in the current node.

##### string get(string fieldName)

Works like *GetField\<string\>(fieldName)*. However, it does not throw exceptions when the field is not found, it returns an empty string("") instead.

##### bool has(string fieldName)

Tells if the given property exists in the current node. Same as *ContainsField(fieldName)*.

##### bool has(string fieldName, string value)

Tells if the property has the given value. 

##### int count(string fieldname)

Get the count of values of a given property. When the property does not exist, returns 0.

### Built-in Helper Functions

##### Action return_if(bool condition)

Returns *Action.Return* if the condition is *true*. If the condition is *false* and this expression is not joined with other actions by a bitwise-and operator, the graph exploration will be aborted.

##### Action continue_if(bool condition)

Returns *Action.Continue* if the condition is *true*. If the condition is *false* and this expression is not joined with other actions by a bitwise-and operator, the graph exploration will be aborted.

##### bool dice(double p)

Generates a random number that is greater than or equal to 0.0 and less than 1.0. This function returns *true* only if the number is less than or equal to *p*.

Compared with *json* search, *lambda* search is more expressive: C# lambda expressions can be directly used to specify query patterns. Here are two examples.

```
MAG.StartFrom(@"{
    type  : ""ConferenceSeries"",
    match : {
        FullName : ""graph""
    }
}", new List<string>{ "FullName", "ShortName" })
.FollowEdge("ConferenceInstanceIDs")
.VisitNode(v => v.return_if(v.GetField<DateTime>("StartDate").ToString().Contains("2014")),
        new List<string>{ "FullName", "StartDate" })
```

```
MAG.StartFrom(@"{
    type  : ""Affiliation"",
    match : {
        Name : ""microsoft""
    }
}").FollowEdge("PaperIDs")
.VisitNode(v => v.return_if(v.get("NormalizedTitle").Contains("graph") || v.GetField<int>("CitationCount") > 100),
        new List<string>{ "OriginalTitle", "CitationCount" })
```
