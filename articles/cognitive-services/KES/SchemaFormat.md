---
title: Schema format - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Learn about the schema format in the Knowledge Exploration Service (KES) API.
services: cognitive-services
author: bojunehsu
manager: nitinme

ms.service: cognitive-services
ms.subservice: knowledge-exploration
ms.topic: conceptual
ms.date: 03/26/2016
ms.author: paulhsu
---

# Schema Format

The schema is specified in a JSON file that describes the attribute structure of the objects in the data file used to create the index.  For each attribute, the schema specifies the name, data type, optional operations, and optional synonyms list.  An object may have 0 or more values of each attribute.  Below is a simplified example from an academic publication domain:

``` json
{
  "attributes":[
    {"name":"Title", "type":"String"},
    {"name":"Year", "type":"Int32"},
    {"name":"Author", "type":"Composite"},
    {"name":"Author.Id", "type":"Int64", "operations":["equals"]},
    {"name":"Author.Name", "type":"String"},
    {"name":"Author.Affiliation", "type":"String"},
    {"name":"Keyword", "type":"String", "synonyms":"Keyword.syn"}
  ]
}
```

Attribute names are case-sensitive identifiers that start with a letter and consist only of letters (A-Z), numbers (0-9), and underscore (\_).  The reserved "logprob" attribute is used to specify the relative natural log probabilities among objects.

## Attribute Type

Below is a list of supported attribute data types:

| Type | Description | Operations | Example |
|------|-------------|------------|---------|
| `String` | String (1-1024 characters) | equals, starts_with | "hello world" |
| `Int32` | Signed 32-bit integer | equals, starts_with, is_between | 2016 |
| `Int64` | Signed 64-bit integer | equals, starts_with, is_between | 9876543210 |
| `Double` | Double-precision floating-point value | equals, starts_with, is_between | 1.602e-19 |
| `Date` | Date (1400-01-01 to 9999-12-31) | equals, is_between | '2016-03-14' |
| `Guid` | Globally unique identifier | equals | "602DD052-CC47-4B23-A16A-26B52D30C05B" |
| `Blob` | Internally compressed non-indexed data | *None* | "Empower every person and every organization on the planet to achieve more" |
| `Composite` | Composition of multiple sub-attributes| *N/A* | { "Name":"harry shum", "Affiliation":"microsoft" } |

String attributes are used to represent string values that may appear as part of the user query.  They support the exact-match *equals* operation, as well as the *starts_with* operation for query completion scenarios, such as matching "micros" with "microsoft".  Case-insensitive and fuzzy matching to handle spelling errors will be supported in a future release.

Int32/Int64/Double attributes are used to represent numeric values.  The *is_between* operation enables inequality support (lt, le, gt, ge) at run time.  The *starts_with* operation supports query completion scenarios, such as matching "20" with "2016", or "3." with "3.14".

Date attributes are used to efficiently encode date values.  The *is_between* operation enables inequality support (lt, le, gt, ge) at run time.
  
Guid attributes are used to efficiently represent GUID values with default support for the *equals* operation.

Blob attributes are used to efficiently encode potentially large data blobs for runtime lookup from the corresponding object, without support for any indexing operation based on the content of the blob values.

### Composite Attributes

Composite attributes are used to represent a grouping of attribute values.  The name of each sub-attribute starts with the name of the composite attribute followed by ".".  Values for composite attributes are specified as a JSON object containing the nested attribute values.  Composite attributes may have multiple object values.  However, composite attributes may not have sub-attributes that are themselves composite attributes.

In the academic publication example above, this enables the service to query for papers by "harry shum" while he is at "microsoft".  Without composite attributes, the service can only query for papers where one of the authors is "harry shum" and one of the authors is at "microsoft".  For more information, see [Composite Queries](SemanticInterpretation.md#composite-function).

## Attribute Operations

By default, each attribute is indexed to support all operations available to the attribute data type.  If a particular operation is not required, the set of indexed operations can be explicitly specified to reduce the size of the index.  In the following snippet from the example schema above, the Author.Id attribute is indexed to support only the *equals* operation, but not the additional *starts_with* and *is_between* operations for Int32 attributes.
```json
{"name":"Author.Id", "type":"Int32", "operations":["equals"]}
```

When an attribute is referenced inside a grammar, the *starts_with* operation needs to be specified in the schema in order for the service to generate completions from partial queries.  

## Attribute Synonyms

It is often desirable to refer to a particular string attribute value by a synonym.  For example, users may refer to "Microsoft" as "MSFT" or "MS".  In these cases, the attribute definition can specify the name of a schema file located in the same directory as the schema file.  Each line in the synonym file represents a synonym entry in the following JSON format: `["<canonical>", "<synonym>"]`.  In the example schema, "AuthorName.syn" is a JSON file that contains synonym values for the Author.Name attribute.

`{"name":"Author.Name", "type":"String", "synonyms":"AuthorName.syn"}`


A canonical value may have multiple synonyms.  Multiple canonical values may share a common synonym.  In such cases, the service will resolve the ambiguity through multiple interpretations.  Below is an example AuthorName.syn synonyms file corresponding to the schema above:
```json
["harry shum","heung-yeung shum"]
["harry shum","h shum"]
["henry shum","h shum"]
...
```
