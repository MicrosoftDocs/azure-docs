---
# Mandatory fields.
title: Adopting DTDL-based industry ontologies
titleSuffix: Azure Digital Twins
description: Learn about existing industry ontologies that can be adopted for Azure Digital Twins
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/29/2023
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Adopting a DTDL industry ontology

Microsoft has partnered with domain experts to create DTDL model sets based on industry standards, to help minimize reinvention and simplify solutions. This article presents the DTDL industry ontologies that are currently available. 

## List of ontologies

| Industry | Ontology repository | Description | Learn more |
|  --- |  --- |  --- | --- |
| Smart buildings | [Digital Twins Definition Language-based RealEstateCore ontology for smart buildings](https://github.com/Azure/opendigitaltwins-building) | Microsoft has partnered with [RealEstateCore](https://www.realestatecore.io/) to deliver this open-source DTDL ontology for the real estate industry. [RealEstateCore](https://www.realestatecore.io/) is a consortium of real estate owners, software vendors, and research institutions.<br><br>This smart buildings ontology provides common ground for modeling smart buildings, using industry standards (like [BRICK Schema](https://brickschema.org/ontology/) or [W3C Building Topology Ontology](https://w3c-lbd-cg.github.io/bot/index.html)) to avoid reinvention. The ontology also comes with best practices for how to consume and properly extend it. | You can read more about the partnership with RealEstateCore and goals for this initiative in the following blog post and embedded video: [RealEstateCore, a smart building ontology for digital twins, is now available](https://techcommunity.microsoft.com/t5/internet-of-things/realestatecore-a-smart-building-ontology-for-digital-twins-is/ba-p/1914794). |
| Smart cities | [Digital Twins Definition Language (DTDL) ontology for Smart Cities](https://github.com/Azure/opendigitaltwins-smartcities) | Microsoft has collaborated with [Open Agile Smart Cities (OASC)](https://oascities.org/) and [Sirus](https://sirus.be/) to provide a DTDL-based ontology for smart cities, starting with [ETSI CIM NGSI-LD](https://www.etsi.org/committee/cim). | You can also read more about the partnerships and approach for smart cities in the following blog post and embedded video: [Smart Cities Ontology for Digital Twins](https://techcommunity.microsoft.com/t5/internet-of-things/smart-cities-ontology-for-digital-twins/ba-p/2166585). |
| Energy grids | [Digital Twins Definition Language (DTDL) ontology for Energy Grid](https://github.com/Azure/opendigitaltwins-energygrid/) | This ontology was created to help solution providers accelerate development of digital twin solutions for energy use cases like monitoring grid assets, outage and impact analysis, simulation, and predictive maintenance. Additionally, the ontology can be used to enable the digital transformation and modernization of the energy grid. It's adapted from the [Common Information Model (CIM)](https://cimug.ucaiug.org/), a global standard for energy grid assets management, power system operations modeling, and physical energy commodity market. | You can also read more about the partnerships and approach for energy grids in the following blog post: [Energy Grid Ontology for Digital Twins](https://techcommunity.microsoft.com/t5/internet-of-things/energy-grid-ontology-for-digital-twins-is-now-available/ba-p/2325134). |
| Manufacturing | [Manufacturing Ontologies](https://github.com/digitaltwinconsortium/ManufacturingOntologies) | These ontologies were created to help solution providers accelerate development of digital twin solutions for manufacturing use cases like asset condition monitoring, simulation, OEE calculation, and predictive maintenance. Additionally, the ontologies can be used to enable the digital transformation and modernization of factories and plants. They are adapted from [OPC UA](https://opcfoundation.org), [ISA95](https://en.wikipedia.org/wiki/ANSI/ISA-95) and the [Asset Administration Shell](https://www.plattform-i40.de/IP/Redaktion/EN/Standardartikel/specification-administrationshell.html), three global standards widely used in the manufacturing space. | Visit the repository to read more about this ontology and explore a sample solution for ingesting OPC UA data into Azure Digital Twins. |

Each ontology is focused on an initial set of models. You can contribute to the ontologies by suggesting extensions or other improvements through the GitHub contribution process in each ontology repository.

## Next steps

Learn about extending existing industry-standard ontologies for your specific solution: [Extending industry ontologies](concepts-ontologies-extend.md).

Or, continue on the path for developing models based on ontologies: [Full model development path](concepts-ontologies.md#full-model-development-path).
