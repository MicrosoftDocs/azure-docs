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

Because it can be easier to start with an open-source DTDL ontology than starting from a blank page, Microsoft is partnering with domain experts to publish ontologies, which represent widely accepted industry conventions and support a variety of customer use cases. 

The result is a set of open-source DTDL-based ontologies, which learn from, build on, learn from, or directly use industry standards. The ontologies are designed to meet the needs of downstream developers, with the potential to be widely adopted and/or extended by the industry.

At this time, Microsoft has worked with partners to develop an ontology for [smart buildings](#realestatecore-smart-building-ontology) and an ontology for [smart cities](#smart-cities-ontology), which provide common ground for modeling based on standards in these industries to avoid reinvention. 

## RealEstateCore smart building ontology

*Find the ontology here: [**Digital Twins Definition Language-based RealEstateCore ontology for smart buildings**](https://github.com/Azure/opendigitaltwins-building)*.

Microsoft has partnered with [RealEstateCore](https://www.realestatecore.io/), a Swedish consortium of real estate owners, software vendors, and research institutions, to deliver this open-source DTDL ontology for the real estate industry.

This smart buildings ontology provides common ground for modeling smart buildings, using industry standards (like [BRICK Schema](https://brickschema.org/ontology/) or [W3C Building Topology Ontology](https://w3c-lbd-cg.github.io/bot/index.html)) to avoid reinvention. The ontology also comes with best practices for how to consume and properly extend it. 

To learn more about the ontology's structure and modeling conventions, how to use it, how to extend it, and how to contribute, visit the ontology's repository on GitHub: [Azure/opendigitaltwins-building](https://github.com/Azure/opendigitaltwins-building). 

You can also read more about the partnership with RealEstateCore and goals for this initiative in this blog post and accompanying video: [RealEstateCore, a smart building ontology for digital twins, is now available](https://techcommunity.microsoft.com/t5/internet-of-things/realestatecore-a-smart-building-ontology-for-digital-twins-is/ba-p/1914794).

## Smart cities ontology

*Find the ontology here: [**Digital Twins Definition Language (DTDL) ontology for Smart Cities**](https://github.com/Azure/opendigitaltwins-smartcities)*.

Microsoft has collaborated with [Open Agile Smart Cities (OASC)](https://oascities.org/) and [Sirus](https://sirus.be/) to provide a DTDL-based ontology for smart cities, starting with [ETSI CIM NGSI-LD](https://www.etsi.org/committee/cim). In addition to ETSI NGSI-LD, we’ve also evaluated Saref4City, CityGML, ISO and others.

The current release of the ontology is focused on an initial set of models. The ontology authors welcome you to contribute to extend the initial set of use cases, as well as improve the existing models. 

To learn more about the ontology, how to use it, and how to contribute, visit the ontology's repository on GitHub: [Azure/opendigitaltwins-smartcities](https://github.com/Azure/opendigitaltwins-smartcities). 

You can also read more about the partnerships and approach for smart cities in this blog post and accompanying video: [Smart Cities Ontology for Digital Twins](https://techcommunity.microsoft.com/t5/internet-of-things/smart-cities-ontology-for-digital-twins/ba-p/2166585).

## Next steps

* Learn more about extending industry-standard ontologies to meet your specifications: [*Concepts: Extending industry ontologies*](concepts-ontologies-extend.md).

* Or, continue on the path for developing models based on ontologies: [*Using ontology strategies in a model development path*](concepts-ontologies.md#using-ontology-strategies-in-a-model-development-path).