---
# Mandatory fields.
title: Adopting industry-standard ontologies
titleSuffix: Azure Digital Twins
description: Learn about existing industry ontologies that can be adopted for Azure Digital Twins
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

# Adopting an industry ontology

Because it can be easier to start with an open-source DTDL ontology than starting from a blank page, Microsoft is partnering with domain experts to publish ontologies which represent widely accepted industry conventions and empower the majority of customer use cases. 

The result is a set of open-source DTDL-based ontologies which learn from, build on, learn from, or directly use industry standards. These are designed to meet the needs of downstream developers, with the potential to be widely adopted and/or extended by the industry. This is illustrated in the diagram below.

:::image type="content" source="media/concepts-ontologies/industry-path.png" alt-text="Flow diagram illustrating stages of adoption for an industry ontology: Evaluate, Adapt, Validate, Evangelize." lightbox="media/concepts-ontologies/industry-path.png"::: 

At this time, Microsoft has worked with real estate partners to develop an ontology for smart buildings, which provides common ground for modeling smart buildings while leveraging industry standards to prevent reinvention. 

## RealEstateCore smart building ontology

Microsoft has partnered with [RealEstateCore](https://www.realestatecore.io/), a Swedish consortium of real estate owners, software vendors, and research institutions, to deliver an open-source DTDL-based ontology for the real estate industry: the [**DTDL-based RealEstateCore ontology for smart buildings**](https://github.com/Azure/opendigitaltwins-building).

This smart buildings ontology provides common ground for modeling smart buildings, while leveraging industry standards (like [BRICK Schema](https://brickschema.org/ontology/) or [W3C Building Topology Ontology](https://w3c-lbd-cg.github.io/bot/index.html)) to prevent reinvention. The ontology also comes with best practices for how to consume and properly extend it. To learn more about the ontology's structure and modeling conventions, how to use it, how to extend it, and how to contribute, please visit the ontology's [repository on GitHub](https://github.com/Azure/opendigitaltwins-building). 

You can also read more about the partnership with RealEstateCore and goals for this initiative in this blog post and accompanying video: [*RealEstateCore, a smart building ontology for digital twins, is now available*](https://techcommunity.microsoft.com/t5/internet-of-things/realestatecore-a-smart-building-ontology-for-digital-twins-is/ba-p/1914794).

## Next steps

* Learn more about extending industry-standard ontologies to meet your specifications: [*Concepts: Extending industry ontologies*](concepts-ontologies-extend.md).

* Or, continue on the path for developing models based on ontologies: [*Using ontology strategies in a model development path*](concepts-ontologies.md#using-ontology-strategies-in-a-model-development-path).