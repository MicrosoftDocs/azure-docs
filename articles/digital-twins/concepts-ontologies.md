---
# Mandatory fields.
title: Industry ontologies
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

# What is an ontology and why is it important? 

Now that you’ve learned about models, let’s discuss about ontology. An ontology is a set of models for a given domain, like a building structure, IoT systems, a smart city, the energy grid, web content, etc. Ontologies are often used as schemas for knowledge graphs, as they can enable: 

* Harmonization of software components, documentation, query libraries, etc. 
* Reduced investment in conceptual modeling and system development 
* Easier data interoperability on a semantic level 
* Best practice reuse, rather than starting from scratch or "reinventing the wheel" 

Ontologies provide a great starting point for a digital twins solution. They encompass a set of domain-specific models and relationships between entities for designing, creating, and parsing a digital twin graph. Ontologies enable solution developers to begin a digital twins solution from a proven starting point and focus on solving business problems instead of bootstrapping models. Additionally, they are designed to be easily extensible so that they can be customized for each solution. 

Ontologies used within Azure Digital Twins are written in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md), an open modeling language based on JSON-LD and RDF. Solutions that use these ontologies will be set up for seamless integration between disparate vendors because the ontologies will provide a common vocabulary across solutions. 

Microsoft is partnering with domain experts to publish ontologies which represent widely accepted industry conventions and empower the majority of customers' use cases. The result is to provide an open-source DTDL-based ontologies which learn from, build on, and/or directly use industry standards, meet the needs of downstream developers, and will be widely adopted and/or extended by the industry, as shown in below diagram: 

:::image type="content" source="media/concepts-ontologies/industry-path.png" alt-text="Flow diagram illustrating stages of adoption for an industry ontology: Evaluate, Adapt, Validate, Evangelize."::: 

## Industry ontologies  

It is often easier to start with an open-source DTDL ontology than starting from a blank page. We have developed with partners Smart Building ontology and we are working to release more domain specific ones.  

### Smart Building 

Microsoft has worked with [RealEstateCore](https://www.realestatecore.io/), a Swedish consortium of real estate owners, software vendors, and research institutions, to deliver an open-source DTDL-based ontology for the real estate industry.  This smart buildings ontology provides common ground for modeling smart buildings while leveraging industry standards (like [BRICK Schema](https://brickschema.org/ontology/), [W3C Building Topology Ontology](https://w3c-lbd-cg.github.io/bot/index.html)) to prevent reinvention. As part of the delivery, we also provide best practices for how to consume and properly extend the ontology. We hope it will be widely adopted and/or extended by developers, and strongly encourage active participation and contribution. Learn more from our blog and video, [RealEstateCore blog and video](https://techcommunity.microsoft.com/t5/internet-of-things/realestatecore-a-smart-building-ontology-for-digital-twins-is/ba-p/1914794).  

Please read about [DTDL-based Smart Building ontology](https://github.com/Azure/opendigitaltwins-building), learn about its structure, how to use it, how to extend it, how to contribute an what is the modeling convention we’ve adopted.  

## Extending ontologies 

An industry ontology, such as the [DTDL-based RealEstateCore ontology for smart buildings](https://github.com/Azure/opendigitaltwins-building), is a great way to jumpstart building your IoT solution. These industry ontologies provide a rich set of base interfaces that are designed for your domain and engineered to work out of the box in Azure IoT services, such as Azure Digital Twins. However, it is possibly the case that your solution has specific needs that are not completely covered by the industry ontology. For example, you may want to link your digital twins to 3D models stored in a separate system. In this case, it's easy to extend one of these ontologies to add your own capabilities while retaining all the benefits of the original ontology.

For details on this process, see [*Concepts: Extending industry ontologies*](concepts-extending-ontologies.md).

## Tools for ontologies and models 

There are a few tools we have that can be helpful when dealing with Ontologies. 

For your convenience, we have packaged them all in a [single GitHub repository](https://github.com/Azure/opendigitaltwins-tools).  

We highly advise you to bookmark this repo, as this is the area we will be adding and improving tools that can get you to jumpstart your project. 

Today, we have these tools that we primarily support: 

### ModelUploader 

**Upload the models to Azure Digital Twins**

You can upload an ontology into your own instance of ADT by using [Model Uploader](https://github.com/Azure/opendigitaltwins-building-tools/tree/master/ModelUploader). Follow the instructions on ModelUploader to upload all of these models into your own instance. Here is [an article](how-to-manage-model.md) on how to manage models, update, retrieve, update, decommission and delete models.  

## ModelVisualizer 

**Visualizing the models**

Once you have uploaded these models into your Azure Digital Twins instance, you can view the ontology using [ADT Model Visualizer](https://github.com/Azure/opendigitaltwins-building-tools/tree/master/AdtModelVisualizer). This tool is a draft version and will continue to evolve, but we encourage the digital twins development community to extend and contribute to the tool. 

## OWL2DTDL Converter 

**Converting your existing OWL based Model to DTDL**

The [OWL2DTDL converter](https://github.com/Azure/opendigitaltwins-building-tools/tree/master/OWL2DTDL) is a tool that translates an OWL ontology or an ontology network (one root ontology reusing other ontologies through owl:imports declarations) into a set of DTDL Interface declarations for use, e.g., with the Azure Digital Twins service. This converter was used to translate the [Real Estate Core Ontology](https://doc.realestatecore.io/3.1/full.html) to DTDL and can be used for any OWL-based ontology.

## Next steps

Once you are done writing your models, see how to upload them (and do other management operations) with the DigitalTwinsModels APIs:
* [*How-to: Manage custom models*](how-to-manage-model.md)