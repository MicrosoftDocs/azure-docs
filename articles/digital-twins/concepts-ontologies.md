---
# Mandatory fields.
title: What is an ontology?
titleSuffix: Azure Digital Twins
description: Learn about digital twin ontologies, how they're used in Azure Digital Twins, and how these DTDL ontologies can be used for modeling in the context of certain industries.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 04/05/2023
ms.topic: conceptual
ms.service: digital-twins
ms.custom: engagement-fy23

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# What is an ontology? 

This article describes the concept of industry ontologies and how they can be used within the context of Azure Digital Twins.

The vocabulary of an Azure Digital Twins solution is defined using [models](concepts-models.md), which describe the types of entities that exist in your environment. An *ontology* is a set of models that comprehensively describe a given domain, like manufacturing, building structures, IoT systems, smart cities, energy grids, web content, and more.

When you author a model set from scratch that is complete and describes a domain, you're creating your own ontology. Sometimes, however, when modeling standards for an industry already exist, it can be easier and more effective to lean on that existing ontology instead of creating the ontology from scratch yourself. 

The articles in this section explain more about using pre-existing industry ontologies for your Azure Digital Twins scenarios, including what ontologies are available today, and the different strategies for turning industry standards into ontologies for use in Azure Digital Twins.

## Using existing ontologies for Azure Digital Twins

Microsoft has created several [open-source DTDL ontologies](concepts-ontologies-adopt.md) built on widely adopted industry standards. You can use these model sets out-of-the-box in your solutions, or [extend the ontologies](concepts-ontologies-extend.md) with your own additions for a customized solution.

Either way, existing industry ontologies provide a great starting point for digital twin solutions. They encompass a set of domain-specific models and relationships between entities for designing, creating, and parsing a digital twin graph. Industry ontologies enable solution developers to begin a digital twins solution from a proven starting point, and focus on solving business problems. The industry ontologies provided by Microsoft are also designed to be easily extensible, so that you can customize them for your solution. Because models in Azure Digital Twins are represented in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md), ontologies for use with Azure Digital Twins are also written in DTDL.

Using these ontologies in your solutions can also set them up for more seamless integration between different partners and vendors, because ontologies can provide a common vocabulary across solutions.

Here are some other benefits to using industry-standard DTDL ontologies as schemas for your twin graphs:
* Harmonization of software components, documentation, query libraries, and more
* Reduced investment in conceptual modeling and system development
* Easier data interoperability on a semantic level
* Best practice reuse, rather than starting from scratch

## Strategies for integrating ontologies

Here are the main strategies for integrating existing industry-standard ontologies with DTDL for use in Azure Digital Twins. Choose the one that works best for you, depending on how closely the existing materials for your industry already match your solution.

| Strategy | Description | Resources |
| --- | --- | --- |
| Adopt | You can jump-start your solution by adopting one of Microsoft's open-source DTDL ontologies that has been built on widely accepted industry standards. If the ontologies contain all the models you need, you can take these model sets as they are and use them out-of-the-box. | [Adopting&nbsp;industry&nbsp;standard ontologies](concepts-ontologies-adopt.md) |
| Extend | If an existing DTDL ontology has most, but not all, of the models you need in your solution, you can extend the ontology with your own additions to create a customized ontology. | [Adopting&nbsp;industry&nbsp;standard ontologies](concepts-ontologies-adopt.md)<br><br>[Extending&nbsp;ontologies](concepts-ontologies-extend.md) |
| Convert | If you already have existing models represented in another standard industry format, you can convert them to DTDL to use them with Azure Digital Twins. | [Converting&nbsp;ontologies](concepts-ontologies-convert.md) |
| Author | You can always develop your own custom DTDL ontologies from scratch, using any applicable industry standards as inspiration. | [DTDL models](concepts-models.md) |

### Full model development path

No matter which strategy you choose for integrating an ontology into Azure Digital Twins, you can follow the complete path below to guide you through creating and uploading your ontology as DTDL models.

1. Start by reviewing and understand [DTDL modeling in Azure Digital Twins](concepts-models.md).
1. Continue with your chosen ontology integration strategy from above: [Adopt](concepts-ontologies-adopt.md), [Convert](concepts-ontologies-convert.md), or [Author](concepts-models.md) your models based on your ontology.
    1. If necessary, [extend](concepts-ontologies-extend.md) your ontology to customize it to your needs.
1. [Validate](how-to-parse-models.md) your models to verify they're working DTDL documents.
1. Upload your finished models to Azure Digital Twins, using the [APIs](how-to-manage-model.md#upload-models) or a sample like the [Azure Digital Twins model uploader](https://github.com/Azure/opendigitaltwins-tools/tree/master/ADTTools#uploadmodels).

Reading this series of articles will guide you in how to use your models in your Azure Digital Twins instance. 

>[!TIP]
> You can visualize the models in your ontology using the [model graph](how-to-use-azure-digital-twins-explorer.md#explore-models-and-the-model-graph) in Azure Digital Twins Explorer.

## Next steps

Read more about the strategies of adopting, converting, and authoring ontologies:
* [Adopting DTDL-based industry ontologies](concepts-ontologies-adopt.md)
* [Converting ontologies](concepts-ontologies-convert.md)
* [Manage DTDL models](how-to-manage-model.md)

Or, learn about how models are used to create digital twins: [Digital twins and the twin graph](concepts-twins-graph.md).