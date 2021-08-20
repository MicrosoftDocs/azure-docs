---
# Mandatory fields.
title: Adopting industry-standard ontologies
titleSuffix: Azure Digital Twins
description: Learn about existing industry ontologies that can be adopted for Azure Digital Twins
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/26/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Adopting an industry ontology

Because it can be easier to start with an open-source Digital Twins Definition Language (DTDL) ontology than from a blank page, Microsoft is partnering with domain experts to publish ontologies. These ontologies represent widely accepted industry conventions and support various customer use cases. 

The result is a set of open-source DTDL-based ontologies, which learn from, build on, or directly use industry standards. The ontologies are designed to meet the needs of downstream developers, with the potential to be widely adopted and extended by the industry.

At this time, Microsoft has worked with partners to develop ontologies for [smart buildings](#realestatecore-smart-building-ontology), [smart cities](#smart-cities-ontology), and [energy grids](#energy-grid-ontology). These ontologies provide common ground for modeling based on standards in these industries to avoid the need for reinvention. 

Each ontology is focused on an initial set of models. The ontology authors welcome you to contribute to extend the initial set of use cases and improve the existing models. 

## RealEstateCore smart building ontology

*Get the ontology from the following repository:* [Digital Twins Definition Language-based RealEstateCore ontology for smart buildings](https://github.com/Azure/opendigitaltwins-building).

Microsoft has partnered with [RealEstateCore](https://www.realestatecore.io/) to deliver this open-source DTDL ontology for the real estate industry. [RealEstateCore](https://www.realestatecore.io/) is a Swedish consortium of real estate owners, software vendors, and research institutions.

This smart buildings ontology provides common ground for modeling smart buildings, using industry standards (like [BRICK Schema](https://brickschema.org/ontology/) or [W3C Building Topology Ontology](https://w3c-lbd-cg.github.io/bot/index.html)) to avoid reinvention. The ontology also comes with best practices for how to consume and properly extend it. 

To learn more about the ontology's structure and modeling conventions, how to use it, how to extend it, and how to contribute, visit the ontology's repository on GitHub: [Azure/opendigitaltwins-building](https://github.com/Azure/opendigitaltwins-building). 

You can also read more about the partnership with RealEstateCore and goals for this initiative in the following blog post and embedded video: [RealEstateCore, a smart building ontology for digital twins, is now available](https://techcommunity.microsoft.com/t5/internet-of-things/realestatecore-a-smart-building-ontology-for-digital-twins-is/ba-p/1914794).

## Smart cities ontology

*Get the ontology from the following repository:* [Digital Twins Definition Language (DTDL) ontology for Smart Cities](https://github.com/Azure/opendigitaltwins-smartcities).

Microsoft has collaborated with [Open Agile Smart Cities (OASC)](https://oascities.org/) and [Sirus](https://sirus.be/) to provide a DTDL-based ontology for smart cities, starting with [ETSI CIM NGSI-LD](https://www.etsi.org/committee/cim). Apart from ETSI NGSI-LD, we’ve also evaluated Saref4City, CityGML, ISO, and others.

To learn more about the ontology, how to use it, and how to contribute, visit the ontology's repository on GitHub: [Azure/opendigitaltwins-smartcities](https://github.com/Azure/opendigitaltwins-smartcities). 

You can also read more about the partnerships and approach for smart cities in the following blog post and embedded video: [Smart Cities Ontology for Digital Twins](https://techcommunity.microsoft.com/t5/internet-of-things/smart-cities-ontology-for-digital-twins/ba-p/2166585).

## Energy grid ontology

*Get the ontology from the following repository:* [Digital Twins Definition Language (DTDL) ontology for Energy Grid](https://github.com/Azure/opendigitaltwins-energygrid/).

This ontology was created to help solution providers accelerate development of digital twin solutions for energy use cases like monitoring grid assets, outage and impact analysis, simulation, and predictive maintenance. Additionally, the ontology can be used to enable the digital transformation and modernization of the energy grid. It's adapted from the [Common Information Model (CIM)](https://cimug.ucaiug.org/), a global standard for energy grid assets management, power system operations modeling, and physical energy commodity market.

To learn more about the ontology, how to use it, and how to contribute, visit the ontology's repository on GitHub: [Azure/opendigitaltwins-energygrid](https://github.com/Azure/opendigitaltwins-energygrid/). 

You can also read more about the partnerships and approach for energy grids in the following blog post: [Energy Grid Ontology for Digital Twins](https://techcommunity.microsoft.com/t5/internet-of-things/energy-grid-ontology-for-digital-twins-is-now-available/ba-p/2325134).

## Next steps

* Learn more about extending industry-standard ontologies to meet your specifications: [Extending industry ontologies](concepts-ontologies-extend.md).

* Or, continue on the path for developing models based on ontologies: [Using ontology strategies in a model development path](concepts-ontologies.md#using-ontology-strategies-in-a-model-development-path).