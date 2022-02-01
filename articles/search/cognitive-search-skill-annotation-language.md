---
title: Skill context and input annotation language
titleSuffix: Azure Cognitive Search
description: Annotation syntax reference for annotation in the context, inputs and outputs of a skillset in an AI enrichment pipeline in Azure Cognitive Search.

author: BertrandLeRoy
ms.author: beleroy
ms.service: cognitive-search
ms.topic: reference
ms.date: 01/27/2022
---
# Skill context and input annotation language

Azure Cognitive Search skills can use and [enrich the data coming from the data source and from the output of other skills](cognitive-search-defining-skillset.md).
During the indexing process, the data is internally organized in a tree-like structure that can be queried to be used as skill inputs or to be added to the index.
The nodes in the tree can be simple values such as strings and numbers, arrays, or complex objects.
Even simple values can be enriched with additional structured information.
For example, a string can be annotated with additional information that is stored beneath it in the enrichment tree.
The expressions used to query that internal structure use a rich syntax that is detailed in this article.

Throughout the article, we'll use the following document tree as an example:

* document
    * pages
        * `[0]`
            * content: "this is page one"
                * words
                    * `[0]`: "this"
                    * `[1]`: "is"
                    * `[2]`: "page"
                    * `[3]`: "one"
        * `[1]`
            * content: "page two"
                * words
                    * `[0]`: "page"
                    * `[1]`: "two"
    * obj
        * property: "value"
        * otherProperty: 42
        * bool: true
    * arr
        * `[0]`
            * `[0]`
                * `[0]`: 1
                * `[1]`: null
            * `[1]`
                * `[0]` null
        * `[1]`
            * `[0]`
            * `[1]`
                * `[0]` 2
                * `[1]` 3

## Document root

All the data is under one root element, for which the path is `"/document"`. The root element is the default context for skills.

## Simple paths

Simple paths through the internal enriched document can be expressed with simple tokens separated by slashes.
This syntax is similar to [the JSON Pointer specification](https://datatracker.ietf.org/doc/html/rfc6901.htmlhttps://datatracker.ietf.org/doc/html/rfc6901.html).

### Object properties

The properties of nodes that represent objects add their values to the tree under the property's name.
Those values can be obtained by appending the property name as a token separated by a slash:

```
/document/obj/property → "value"
```

Property name tokens are case-sensitive.

### Array item index

Specific elements of an array can be referenced by using their numeric index like a property name:

```
/document/arr/1/1/0 → 2
```

### Escape sequences

There are two characters that have special meaning and need to be escaped if they appear in an expression and must be interpreted as is instead of as their special meaning: `'/'` and `'~'`.
Those characters must be escaped respectively as `'~0'` and `'~1'`. 

## Array enumeration

An array of values can be obtained using the `'*'` token:

```
/document/pages/0/content/words/* → ["this", "is", "page", "one"]
```

The `'*'` token doesn't have to be at the end of the path. It's possible to enumerate all nodes matching a path with a star in the middle or with multiple stars:

```
/document/pages/*/content/words/* → ["this", "is", "page", "one", "page", "two"]
```

This example returned a flat list of all matching nodes. It's possible to maintain more structure and get a separate array for the words of each page by using a `'#'` token instead of the second `'*'` token:

```
/document/pages/*/content/words/# → [["this","is","page","one"],["page","two"]]
```

The `'#'` token expresses that the array should be treated as a single value instead of being enumerated.

### Enumerating arrays in context

It is often useful to process each element of an array in isolation and have a different set of skill inputs and outputs for each.
This can be done by setting the context of the skill to an enumeration instead of the default `"/document"`.

In the following example, we use one of the input expressions we used before, but with a different context that changes the resulting value.

Context:
```
/document/pages/*
```

Input source expression:
```
/document/pages/*/content/words/*
```

For this combination of context and input, the skill will get executed twice: once for `"/document/pages/0"` and once for `"/document/pages/1"`.
The input values for each skill execution are respectively:

```
["this","is","page","one"]
```
and:
```
["page","two"]
```

When enumerating an array in context, any outputs the skill produces will also be added to the document as enrichments of the context.
In the above example, an output named `"out"` will have its values for each execution added to the document respectively under `"/document/pages/0/out"` and `"/document/pages/1/out"`.

## Literal values

Skill inputs can take literal values as their inputs instead of dynamic values queried from the existing document. This can be achieved by prefixing the value with an equal sign. Values can be numbers, strings or Boolean.
String values can be enclosed in single `'` or double `"` quotes.

```
=42 → 42
=2.45E-4 → 0.000245
="some string" → "some string"
='some other string' → "some other string"
="unicod\u0065" → "unicode"
=false → false
```

## Composite expressions

It's possible to combine values together using unary, binary and ternary operators.
Operators can combine literal values and values resulting from path evaluation.
When used inside an expression, paths should be enclosed between `"$("` and `")"`.

### Boolean not `'!'`

```
=!false → true
=!$(/document/obj/bool) → false
```

### Negative `'-'`

```
=-42 → -42
=-$(/document/obj/otherProperty) → -42
```

### Addition `'+'`

```
=2+2 → 4
=2+$(/document/obj/otherProperty) → 44
```

### Subtraction `'-'`

```
=2-1 → 1
=$(/document/obj/otherProperty)-2 → 40
```

### Multiplication `'*'`

```
=2*3 → 6
=$(/document/obj/otherProperty)*2 → 84
```

### Division `'/'`

```
=3/2 → 1.5
=$(/document/obj/otherProperty)/2 → 21
```

### Modulo `'%'`

```
=15%4 → 3
=$(/document/obj/otherProperty)%20 → 2
```

### Less than, less than or equal, greater than and greater than or equal `'<'` `'<='` `'>'` `'>='`

```
=15<4 → false
=4<=4 → true
=15>4 → true
=1>=2 → false
```

### Equality and non-equality `'=='` `'!='`

```
=15==4 → false
=4==4 → true
=15!=4 → true
=1!=1 → false
```

### Logical operations and, or and exclusive or `'&&'` `'||'` `'^'`

```
=true&&true → true
=true&&false → false
=true||true → true
=true||false → true
=false||false → false
=true^false → true
=true^true → false
```

### Ternary operator `'?:'`

It is possible to give an input different values based on the evaluation of a Boolean expression using the ternary operator.

```
=true?"true":"false" → "true"
=$(/document/obj/otherProperty)==42?"forty-two":"not forty-two" → "forty-two"
```

### Parentheses and operator priority

Operators are evaluated with priorities that match usual conventions: unary operators, then multiplication, division and modulo, then addition and subtraction, then comparison, then equality, and then logical operators.
Usual associativity rules also apply.

Parentheses can be used to change or disambiguate evaluation order.

```
=3*2+5 → 11
=3*(2+5) → 21
```

## See also
+ [Create a skillset in Azure Cognitive Search](cognitive-search-defining-skillset.md)
+ [Reference annotations in an Azure Cognitive Search skillset](cognitive-search-concept-annotations-syntax.md)