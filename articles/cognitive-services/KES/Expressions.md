---
title: Structured query expressions - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Learn how to use structured query expressions in the Knowledge Exploration Service (KES) API.
services: cognitive-services
author: bojunehsu
manager: nitinme

ms.service: cognitive-services
ms.subservice: knowledge-exploration
ms.topic: conceptual
ms.date: 03/26/2016
ms.author: paulhsu
---

# Structured Query Expression

A structured query expression specifies a set of operations to evaluate against the data index.  It consists of attribute query expressions and higher-level functions.  Use the [*evaluate*](evaluateMethod.md) method to compute the objects matching the expression.  The following is an example from the academic publications domain that returns publications authored by Jaime Teevan since the year 2013.

`And(Composite(Author.Name=='jaime teevan'),Y>=2013)`

Structured query expressions may be obtained from [*interpret*](interpretMethod.md) requests, where the semantic output of each interpretation is a structured query expression that returns the index objects matching the input natural language query.  Alternatively, they may be manually authored using the syntax described in this section.

## Attribute Query Expression

An attribute query expression identifies a set of objects based on matching against a specific attribute.  Different matching operations are supported depending on the attribute type and indexed operation specified in the [schema](SchemaFormat.md):

| Type | Operation | Examples |
|------|-------------|------------|
| String | equals | Title='latent semantic analysis'  (canonical + synonyms) |
| String | equals | Author.Name=='susan t dumais'  (canonical only)|
| String | starts_with | Title='latent s'... |
| Int32/Int64/Double | equals | Year=2000 |
| Int32/Int64/Double | starts_with | Year='20'... (any decimal value starting with "20") |
| Int32/Int64/Double | is_between | Year&lt;2000 <br/> Year&lt;=2000 <br/> Year&gt;2000 <br/> Year&gt;=2000 <br/> Year=[2010,2012) *(includes only left boundary value: 2010, 2011)* <br/> Year=[2000,2012] *(includes both boundary values: 2010, 2011, 2012)* |
| Date | equals | BirthDate='1984-05-14' |
| Date | is_between | BirthDate&lt;='2008/03/14' <br/> PublishDate=['2000-01-01','2009-12-31'] |
| Guid | equals | Id='602DD052-CC47-4B23-A16A-26B52D30C05B' |


For example, the expression "Title='latent s'..." matches all academic publications whose title starts with the string "latent s".  In order to evaluate this expression, the attribute Title must specify the "starts_with" operation in the schema used to build the index.

For attributes with associated synonyms, a query expression may specify objects whose canonical value matches a given string using the "==" operator, or objects where any of its canonical/synonym values match using the "=" operator.  Both require the "equals" operator to be specified in the attribute definition.


## Functions

There is a built-in set of functions allowing the construction of more sophisticated query expressions from basic attribute queries.

### And Function

`And(expr1, expr2)`

Returns the intersection of the two input query expressions.

The following example returns academic publications published in the year 2000 about information retrieval:

`And(Year=2000, Keyword=='information retrieval')`

### Or Function

`Or(expr1, expr2)`

Returns the union of the two input query expressions.

The following example returns academic publications published in the year 2000 about information retrieval or user modeling:

`And(Year=2000, Or(Keyword='information retrieval', Keyword='user modeling'))`

### Composite Function

`Composite(expr)`

Returns an expression that encapsulates an inner expression composed of queries against sub-attributes of a common composite attribute.  The encapsulation requires the composite attribute of any matching data object to have at least one value that individually satisfies the inner expression.  Note that a query expression on sub-attributes of a composite attribute has to be encapsulated using the Composite() function before it can be combined with other query expressions.

For example, the following expression returns academic publications by "harry shum" while he was at "microsoft":

```
Composite(And(Author.Name="harry shum", 
              Author.Affiliation="microsoft"))
```

On the other hand, the following expression returns academic publications where one of the authors is "harry shum" and one of the affiliations is "microsoft":

```
And(Composite(Author.Name="harry shum"), 
    Composite(Author.Affiliation="microsoft"))
```
