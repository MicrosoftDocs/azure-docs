---
title: Query expression syntax - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn how to use query expression syntax in the Academic Knowledge API.
services: cognitive-services
author: alch-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: academic-knowledge
ms.topic: conceptual
ms.date: 03/27/2017
ms.author: alch
---

# Query Expression Syntax

We have seen that the response to an **interpret** request includes a query expression. The grammar that interpreted the user’s query created a query expression for each interpretation. A query expression can then be used to issue an **evaluate** request to retrieve entity search results.

You can also construct your own query expressions and use them in an **evaluate** request. This can be useful if you are building your own user interface which creates a query expression in response to the user’s actions. To do this, you need to know the syntax for query expressions.  

Each entity attribute that can be included in a query expression has a specific data type and a set of possible query operators. The set of entity attributes and supported operators for each attribute is specified in [Entity Attributes](EntityAttributes.md). A single-value query requires the attribute to support the *Equals* operation. A prefix query requires the attribute to support the *StartsWith* operation. Numeric range queries requires the attribute to support the *IsBetween* operation.

Some of the entity data are stored as composite attributes, as indicated by a dot '.' in the attribute name. For example, Author/Affiliation information is represented as a composite attribute. It contains 4 components: AuN, AuId, AfN, AfId. These components are separate pieces of data that form a single entity attribute value.


**String Attribute: Single value** (includes matches against synonyms)  
Ti='indexing by latent semantic analysis'  
Composite(AA.AuN='sue dumais')

**String Attribute: Exact single value** (matches only canonical values)  
Ti=='indexing by latent semantic analysis'  
Composite(AA.AuN=='susan t dumais')
	 
**String Attribute: Prefix value**   
Ti='indexing by latent seman'...  
Composite(AA.AuN='sue du'...)

**Numeric Attribute: Single value**  
Y=2010
 
**Numeric Attribute: Range value**  
Y>2005  
Y>=2005  
Y<2010  
Y<=2010  
Y=\[2010, 2012\) (includes only left boundary value: 2010, 2011)  
Y=\[2010, 2012\] (includes both boundary values: 2010, 2011, 2012)
 
**Numeric Attribute: Prefix value**  
Y='19'... (any numeric value that starts with 19) 
 
**Date Attribute: Single value**  
D='2010-02-04'

**Date Attribute: Range value**  
D>'2010-02-03'  
D=['2010-02-03','2010-02-05']

**And/Or Queries:**  
And(Y=1985, Ti='disordered electronic systems')  
Or(Ti='disordered electronic systems', Ti='fault tolerance principles and practice')  
And(Or(Y=1985,Y=2008), Ti='disordered electronic systems')
 
**Composite Queries:**  
To query components of a composite attribute, you need to enclose the part of the query expression that refers to the composite attribute in the Composite() function. 

For example, to query for papers by author name, use the following query:
```
Composite(AA.AuN='mike smith')
```
<br>To query for papers by a particular author while the author was at a particular institution, use the following query:
```
Composite(And(AA.AuN='mike smith',AA.AfN='harvard university'))
```
<br>The Composite() function ties the two parts of the composite attribute together. This means that we only get papers where one of the authors is “Mike Smith” while he was at Harvard. 

To query for papers by a particular author in affiliations with (other) authors from a particular institution, use the following query:
```
And(Composite(AA.AuN='mike smith'),Composite(AA.AfN='harvard university'))
```
<br>In this version, because Composite() is applied to the author and affiliation individually before And(), we get all papers where one of the authors is “Mike Smith” and one of the authors' affiliations is “Harvard”. This sounds similar to the previous query example, but it's not the same thing.

In general, consider the following example: We have a composite attribute C that has two components A and B. An entity may have multiple values for C. These are our entities:
```
E1:	C={A=1, B=1}  C={A=1,B=2}  C={A=2,B=3}
E2:	C={A=1, B=3}  C={A=3,B=2}
```

<br>The query 
```
Composite(And(C.A=1, C.B=2))
```

<br>matches only entities that have a value for C where the component C.A is 1 and the component C.B is 2. Only E1 matches this query.

The query 
```
And(Composite(C.A=1), Composite(C.B=2))
```
<br>matches entities that have a value for C where C.A is 1 and also have a value for C where C.B is 2. Both E1 and E2 match this query.

Please note:  
- You cannot reference a part of a composite attribute outside of a Composite() function.
- You cannot reference parts of two different composite attributes inside the same Composite() function.
- You cannot reference an attribute that is not part of a composite attribute inside a Composite() function.
