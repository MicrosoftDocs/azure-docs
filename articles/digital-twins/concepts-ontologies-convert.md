---
title: Converting ontologies
titleSuffix: Azure Digital Twins
description: Understand the process of converting industry-standard models into DTDL for Azure Digital Twins
author: baanders
ms.author: baanders
ms.date: 01/27/2025
ms.topic: concept-article
ms.service: azure-digital-twins
---

# Convert industry-standard ontologies to DTDL for Azure Digital Twins

Most [ontologies](concepts-ontologies.md) are based on semantic web standards such as [OWL](https://www.w3.org/OWL/), [RDF](https://www.w3.org/2001/sw/wiki/RDF), and [RDFS](https://www.w3.org/2001/sw/wiki/RDFS). 

To use a model with Azure Digital Twins, you must convert it to DTDL format. This article describes general design guidance in the form of a conversion pattern for converting RDF-based models to DTDL so that you can use them with Azure Digital Twins. 

Although the examples in this article are building-focused, you can apply similar processes to standard ontologies across different industries to convert them to DTDL as well.

## Conversion pattern

There are several third-party libraries that can be used when converting RDF-based models to DTDL. Some of these libraries allow you to load your model file into a graph. You can loop through the graph looking for specific RDFS and OWL constructs, and convert them to DTDL.   

The following table is an example of how RDFS and OWL constructs can be mapped to DTDL. 

| RDFS/OWL concept | RDFS/OWL construct | DTDL concept | DTDL construct |
| --- | --- | --- | --- |
| Classes | `owl:Class`<br>IRI suffix<br>``rdfs:label``<br>``rdfs:comment`` | Interface | `@type:Interface`<br>`@id`<br>`displayName`<br>`comment` 
| Subclasses | `owl:Class`<br>IRI suffix<br>`rdfs:label`<br>`rdfs:comment`<br>`rdfs:subClassOf` | Interface | `@type:Interface`<br>`@id`<br>`displayName`<br>`comment`<br>`extends` 
| Datatype Properties | `owl:DatatypeProperty`<br>`rdfs:label` or `INode`<br>`rdfs:label`<br>`rdfs:range` | Interface Properties | `@type:Property`<br>`name`<br>`displayName`<br>`schema` 
| Object Properties | `owl:ObjectProperty`<br>`rdfs:label` or `INode`<br>`rdfs:range`<br>`rdfs:comment`<br>`rdfs:label` | Relationship | `type:Relationship`<br>`name`<br>`target` (or omitted if no `rdfs:range`)<br>`comment`<br>`displayName`<br>

The following C# code snippet shows how an RDF model file is loaded into a graph and converted to DTDL, using the [dotNetRDF](https://www.dotnetrdf.org/) library. 

:::code language="csharp" source="~/digital-twins-docs-samples/other/csharp/convertRDF.cs":::

## Next steps 

Continue on the path for developing models based on ontologies: [Full model development path](concepts-ontologies.md#full-model-development-path).
