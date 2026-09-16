---
title: Adopting DTDL-based industry ontologies
titleSuffix: Azure Digital Twins
description: Learn about existing industry ontologies that you can adopt for Azure Digital Twins
author: baanders
ms.author: baanders
ms.date: 01/27/2025
ms.topic: concept-article
ms.service: azure-digital-twins
---

# Adopting a DTDL industry ontology

Microsoft partnered with domain experts to create DTDL model sets based on industry standards. These model sets help minimize reinvention and simplify solutions. This article presents the DTDL industry ontologies that are currently available.

## List of ontologies

| Industry | Ontology repository | Description | Learn more |
|  --- |  --- |  --- | --- |
| Smart buildings | [Digital Twins Definition Language-based RealEstateCore ontology for smart buildings](https://github.com/Azure/opendigitaltwins-building) | Microsoft partnered with [RealEstateCore](https://www.realestatecore.io/) to deliver this open-source DTDL ontology for the real estate industry. [RealEstateCore](https://www.realestatecore.io/) is a consortium of real estate owners, software vendors, and research institutions.<br><br>This smart buildings ontology provides common ground for modeling smart buildings, using industry standards (like [BRICK Schema](https://ontology.brickschema.org/) or [W3C Building Topology Ontology](https://w3c-lbd-cg.github.io/bot/index.html)) to avoid reinvention. The ontology also comes with best practices for how to consume and properly extend it. | To learn more about the partnership with RealEstateCore and goals for this initiative, see the following blog post and embedded video: [RealEstateCore, a smart building ontology for digital twins, is now available](https://techcommunity.microsoft.com/t5/internet-of-things/realestatecore-a-smart-building-ontology-for-digital-twins-is/ba-p/1914794). |
| Manufacturing | [Manufacturing Ontologies](https://github.com/digitaltwinconsortium/ManufacturingOntologies) | These ontologies help solution providers accelerate development of digital twin solutions for manufacturing use cases like asset condition monitoring, simulation, OEE calculation, and predictive maintenance. Additionally, the ontologies can be used to enable the digital transformation and modernization of factories and plants. They're adapted from [OPC UA](https://opcfoundation.org), [ISA95](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa95), and the [Asset Administration Shell](https://reference.opcfoundation.org/I4AAS/v100/docs/4.1), three global standards widely used in the manufacturing space. | Visit the repository to learn more about this ontology and explore a sample solution for ingesting OPC UA data into Azure Digital Twins. |

## Next steps

To learn about extending existing industry-standard ontologies for your specific solution, see [Extending industry ontologies](concepts-ontologies-extend.md).

To continue on the path for developing models based on ontologies, see [Full model development path](concepts-ontologies.md#full-model-development-path).
