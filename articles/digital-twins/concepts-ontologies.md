---
# Mandatory fields.
title: What are ontologies?
titleSuffix: Azure Digital Twins
description: Learn about DTDL industry ontologies for modeling in a certain domain
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/12/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# What are ontologies? 

The vocabulary of an Azure Digital Twins solution is defined using [models](concepts-models.md), which describe the types of entity that exist in your environment.

Sometimes, when your solution is tied to a particular industry, it can be easier and more effective to start with a set of models for that industry that already exist, instead of authoring your own model set from scratch. These pre-existing existing model sets are called **ontologies**. 

In general, an ontology is a set of models for a given domain—like a building structure, IoT system, smart city, the energy grid, web content, etc. Ontologies are often used as schemas for knowledge graphs, as they can enable:
* Harmonization of software components, documentation, query libraries, etc.
* Reduced investment in conceptual modeling and system development
* Easier data interoperability on a semantic level
* Best practice reuse, rather than starting from scratch or "reinventing the wheel"

This article explains why and how to use ontologies for your Azure Digital Twins models, as well as what ontologies and tools for them are available today.

## Using ontologies for Azure Digital Twins

Ontologies provide a great starting point for digital twin solutions. They encompass a set of domain-specific models and relationships between entities for designing, creating, and parsing a digital twin graph. Ontologies enable solution developers to begin a digital twins solution from a proven starting point, and focus on solving business problems instead of on constructing models from the ground up. The ontologies provided by Microsoft are also designed to be easily extensible, so that you can customize them for your solution. 

In addition, using these ontologies in your solutions can set them up for more seamless integration between different partners and vendors, because ontologies can provide a common vocabulary across solutions.

Because models in Azure Digital Twins are represented in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md), ontologies for use with Azure Digital Twins are also written in DTDL. 

## Paths to integrating ontologies

There are three possible paths to integrating industry-standard ontologies with DTDL. You can pick the one that works best for you depending on your needs:

| Path | Description | Read more |
| --- | --- | --- |
| **Adopt** | You can start your solution with an open-source DTDL ontology that has been built on widely adopted industry standards. You can either use these model sets out-of-the-box, or extend them with your own additions for a customized solution. | [*Concepts:&nbsp;Adopting&nbsp;industry&nbsp;standard ontologies*](concepts-ontologies-adopt.md)<br><br>[*Concepts:&nbsp;Extending&nbsp;ontologies*](concepts-ontologies-extend.md) |
| **Convert** | If you already have existing models represented in another standard format, you can convert them to DTDL to use them with Azure Digital Twins. | [*Concepts:&nbsp;Converting&nbsp;ontologies*](concepts-ontologies-convert.md)<br><br>[*Concepts:&nbsp;Extending&nbsp;ontologies*](concepts-ontologies-extend.md) |
| **Author** | You can always develop your own custom DTDL models from scratch, using any applicable industry standards as inspiration. | [*How-to: Manage DTDL models*](how-to-manage-model.md) |

Here are the steps you should follow for each path: 
1.	Adopt: 
a.	Understand models (pre-req) -> 
b.	Chose from Industry-standard ontologies -> 
c.	Validate -> 
d.	Extend (optional) -> 
e.	Upload to Azure Digital Twins (Simple API, Model Uploader)
f.	Visualize (ADT Explorer, Model Visualizer)
2.	Convert: 
a.	Understand models (pre-req) -> 
b.	Sample converters (RDF converter, OWL converter)  -> 
c.	Validate -> 
d.	Extend (optional) -> 
e.	Upload to Azure Digital Twins -> 
f.	Visualize (ADT Explorer, Model Visualizer)
3.	Author: 
a.	Understand models (Prereq) -> 
b.	Validate -> 
c.	Model Uploader 
d.	Visualize (ADT Explorer, Model Visualizer)

## Next steps

Read more about extending industry-standard ontologies in [*Concepts: Extending industry ontologies*](concepts-ontologies-extend.md).

Or, learn how to manage models in your Azure Digital Twins instance, including update, retrieve, decommission, and delete, see [*How-to: Manage DTDL models*](how-to-manage-model.md).