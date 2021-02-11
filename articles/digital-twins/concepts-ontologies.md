---
# Mandatory fields.
title: Industry-standard ontologies
titleSuffix: Azure Digital Twins
description: Learn about DTDL industry ontologies for modeling in a certain domain
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 1/15/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# What is an industry-standard ontology? 

The vocabulary of an Azure Digital Twins solution is defined using [models](concepts-models.md), which describe the types of entity that exist in your environment.

Sometimes, when your solution is tied to a particular industry, it can be easier and more effective to start with a set of models for that industry that already exist, instead of authoring your own model set from scratch. These pre-existing existing model sets are called **ontologies**. 

In general, an ontology is a set of models for a given domain—like a building structure, IoT systems, a smart city, the energy grid, web content, etc. Ontologies are often used as schemas for knowledge graphs, as they can enable:
* Harmonization of software components, documentation, query libraries, etc.
* Reduced investment in conceptual modeling and system development
* Easier data interoperability on a semantic level
* Best practice reuse, rather than starting from scratch or "reinventing the wheel"

This article explains why and how to use ontologies for your Azure Digital Twins models, as well as what ontologies and tools for them are available today.

## Using ontologies for Azure Digital Twins

Ontologies provide a great starting point for digital twin solutions. They encompass a set of domain-specific models and relationships between entities for designing, creating, and parsing a digital twin graph. Ontologies enable solution developers to begin a digital twins solution from a proven starting point, and focus on solving business problems instead of on constructing models from the ground up. The ontologies provided by Microsoft are also designed to be easily extensible, so that you can customize them for your solution. 

In addition, using these ontologies in your solutions can set them up for more seamless integration between different partners and vendors, because ontologies can provide a common vocabulary across solutions.

Because models in Azure Digital Twins are represented in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md),ontologies for use with Azure Digital Twins are also written in DTDL. 

## Industry ontologies  

Because it can be easier to start with an open-source DTDL ontology than starting from a blank page, Microsoft is partnering with domain experts to publish ontologies which represent widely accepted industry conventions and empower the majority of customer use cases. The result is a set of open-source DTDL-based ontologies, which build on, learn from, or directly use industry standards. These are designed to meet the needs of downstream developers, with the potential to be widely adopted and/or extended by the industry. A possible industry path for using these ontologies is illustrated in the diagram below: 

:::image type="content" source="media/concepts-ontologies/industry-path.png" alt-text="Flow diagram illustrating stages of adoption for an industry ontology: Evaluate, Adapt, Validate, Evangelize." lightbox="media/concepts-ontologies/industry-path.png"::: 

At this time, Microsoft has worked with real estate partners to develop an ontology for smart buildings, which provides common ground for modeling smart buildings while leveraging industry standards to prevent reinvention. 

### Smart building ontology

Microsoft has partnered with [RealEstateCore](https://www.realestatecore.io/), a Swedish consortium of real estate owners, software vendors, and research institutions, to deliver an open-source DTDL-based ontology for the real estate industry: the [**DTDL-based RealEstateCore ontology for smart buildings**](https://github.com/Azure/opendigitaltwins-building).

This smart buildings ontology provides common ground for modeling smart buildings, while leveraging industry standards (like [BRICK Schema](https://brickschema.org/ontology/) or [W3C Building Topology Ontology](https://w3c-lbd-cg.github.io/bot/index.html)) to prevent reinvention. The ontology also comes with best practices for how to consume and properly extend it. To learn more about the ontology's structure and modeling conventions, how to use it, how to extend it, and how to contribute, please visit the ontology's [repository on GitHub](https://github.com/Azure/opendigitaltwins-building). 

You can also read more about the partnership with RealEstateCore and goals for this initiative in this blog post and accompanying video: [*RealEstateCore, a smart building ontology for digital twins, is now available*](https://techcommunity.microsoft.com/t5/internet-of-things/realestatecore-a-smart-building-ontology-for-digital-twins-is/ba-p/1914794).   

## Extending ontologies 

An industry ontology is a great way to jumpstart building your IoT solution. However, it's possible that your solution has specific needs that are not completely covered by the industry ontology, out-of-the-box. For example, you may want to link your digital twins to 3D models stored in a separate system. In this case, you can extend one of these ontologies to add your own capabilities while retaining all the benefits of the original ontology.

For more about on this process, see [*Concepts: Extending industry ontologies*](concepts-extending-ontologies.md).

## OWL2DTDL Converter 

**For converting an existing OWL-based model to DTDL**_

If you already have existing models represented in another standard industry format such as RDF or OWL, you can convert them to DTDL to use them with Azure Digital Twins. For more information on this process, see [Convert existing models to DTDL](how-to-integrate-models.md#convert-existing-models-to-dtdl).

The [**OWL2DTDL Converter**](https://github.com/Azure/opendigitaltwins-building-tools/tree/master/OWL2DTDL) is a sample that translates an OWL ontology into a set of DTDL interface declarations, which can be used with the Azure Digital Twins service. It also works for ontology networks, made of one root ontology reusing other ontologies through `owl:imports` declarations.

This converter was used to translate the [Real Estate Core Ontology](https://doc.realestatecore.io/3.1/full.html) to DTDL and can be used for any OWL-based ontology.

## Next steps

Read more about extending industry-standard ontologies in [*Concepts: Extending industry ontologies*](concepts-extending-ontologies.md).

Or, learn how to manage models in your Azure Digital Twins instance, including update, retrieve, decommission, and delete, see [*How-to: Manage DTDL models*](how-to-manage-model.md).