---
# Mandatory fields.
title: What is an ontology?
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

# What is an ontology? 

The vocabulary of an Azure Digital Twins solution is defined using [models](concepts-models.md), which describe the types of entities that exist in your environment.

Sometimes, when your solution is tied to a particular industry, it can be easier and more effective to start with a set of models for that industry that already exist, instead of authoring your own model set from scratch. These pre-existing model sets are called **ontologies**. 

In general, an ontology is a set of models for a given domain—like a building structure, IoT system, smart city, the energy grid, web content, etc. Ontologies are often used as schemas for twin graphs, as they can enable:
* Harmonization of software components, documentation, query libraries, etc.
* Reduced investment in conceptual modeling and system development
* Easier data interoperability on a semantic level
* Best practice reuse, rather than starting from scratch or "reinventing the wheel"

This article explains why and how to use ontologies for your Azure Digital Twins models, as well as what ontologies and tools for them are available today.

## Using ontologies for Azure Digital Twins

Ontologies provide a great starting point for digital twin solutions. They encompass a set of domain-specific models and relationships between entities for designing, creating, and parsing a digital twin graph. Ontologies enable solution developers to begin a digital twins solution from a proven starting point, and focus on solving business problems. The ontologies provided by Microsoft are also designed to be easily extensible, so that you can customize them for your solution. 

In addition, using these ontologies in your solutions can set them up for more seamless integration between different partners and vendors, because ontologies can provide a common vocabulary across solutions.

Because models in Azure Digital Twins are represented in [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md), ontologies for use with Azure Digital Twins are also written in DTDL. 

## Strategies for integrating ontologies

There are three possible strategies for integrating industry-standard ontologies with DTDL. You can pick the one that works best for you depending on your needs:

| Strategy | Description | Resources |
| --- | --- | --- |
| **Adopt** | You can start your solution with an open-source DTDL ontology that has been built on widely adopted industry standards. You can either use these model sets out-of-the-box, or extend them with your own additions for a customized solution. | [Adopting&nbsp;industry&nbsp;standard ontologies](concepts-ontologies-adopt.md)<br><br>[Extending&nbsp;ontologies](concepts-ontologies-extend.md) |
| **Convert** | If you already have existing models represented in another standard format, you can convert them to DTDL to use them with Azure Digital Twins. | [Converting&nbsp;ontologies](concepts-ontologies-convert.md)<br><br>[Extending&nbsp;ontologies](concepts-ontologies-extend.md) |
| **Author** | You can always develop your own custom DTDL models from scratch, using any applicable industry standards as inspiration. | [DTDL models](concepts-models.md) |

### Using ontology strategies in a model development path

No matter which strategy you choose for integrating an ontology into Azure Digital Twins, you can follow the complete path below to guide you through creating and uploading your ontology as DTDL models.

1. Start by reviewing and understand [DTDL modeling in Azure Digital Twins](concepts-models.md).
1. Proceed with your chosen ontology integration strategy from above: [Adopt](concepts-ontologies-adopt.md), [Convert](concepts-ontologies-convert.md), or [Author](concepts-models.md) your models based on your ontology.
    1. If necessary, [extend](concepts-ontologies-extend.md) your ontology to customize it to your needs.
1. [Validate](how-to-parse-models.md) your models to verify they are working DTDL documents.
1. Upload your finished models to Azure Digital Twins, using the [APIs](how-to-manage-model.md#upload-models) or a sample like the [Azure Digital Twins model uploader](https://github.com/Azure/opendigitaltwins-tools/tree/master/ADTTools#uploadmodels).

After this, you should be able to use your models in your Azure Digital Twins instance. 

>[!TIP]
> You can visualize the models in your ontology using the [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md) or [Azure Digital Twins Model Visualizer](https://github.com/Azure/opendigitaltwins-building-tools/tree/master/AdtModelVisualizer).

## Next steps

Read more about the strategies of adopting, converting, and authoring ontologies:
* [Adopting industry-standard ontologies](concepts-ontologies-adopt.md)
* [Converting ontologies](concepts-ontologies-convert.md)
* [Manage DTDL models](how-to-manage-model.md)

Or, learn about how models are used to create digital twins: [Digital twins and the twin graph](concepts-twins-graph.md).