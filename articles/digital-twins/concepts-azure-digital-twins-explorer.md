---
# Mandatory fields.
title: Azure Digital Twins Explorer
titleSuffix: Azure Digital Twins
description: Understand the capabilities and purpose of Azure Digital Twins Explorer
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/28/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins Explorer (preview)

**Azure Digital Twins Explorer** is a developer tool for visualizing and interacting with the data in your Azure Digital Twins instance, including your [models](concepts-models.md) and [twin graph](concepts-twins-graph.md). This tool is currently in **public preview**.

Here is a view of the explorer window, showing models and twins that have been populated for a sample graph:

:::image type="content" source="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png" alt-text="Screenshot of Azure Digital Twins Explorer showing sample models and twins." lightbox="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png":::

The visual interface is a great tool for exploring and understanding the shape of your graph and model set, as well as making pointed, ad hoc changes to individual twins and relationships.

This article contains more information about the Azure Digital Twins Explorer, including its use cases and an overview of its features. For detailed steps on using each feature, see [How-to: Use Azure Digital Twins Explorer](how-to-use-azure-digital-twins-explorer.md).

## When to use

Azure Digital Twins Explorer is a visual, UI-based tool, designed for the experience of a manual user who wants to explore and perhaps make specific edits to their models and graphs.

It is recommended for the following stages of development:
* **Exploration**: Use the explorer to learn about Azure Digital Twins and the way it represents data from your real-world environment. Import sample models and graphs to quickly get familiar with the features of Azure Digital Twins and try out editing capabilities to explore the experience of using the service. For a guided walkthrough of early exploration using Azure Digital Twins Explorer, see [Quickstart: Get started with Azure Digital Twins Explorer](quickstart-azure-digital-twins-explorer.md).
* **Development**: Use the explorer to view and validate your twin graph, as well as investigate specific properties of models, twins, and relationships. Make ad hoc modifications to your graph and its data.

The explorer's main purpose is to help you visualize and understand your graph, and be able to make changes while you do so. For large-scale solutions and for work that should be repeated or automated, consider using the [APIs and SDKs](how-to-use-apis-sdks.md) to interact with your instance through code instead.

## How to access

Azure Digital Twins Explorer can be accessed from the [Azure portal](https://portal.azure.com)...
<Add more detail about how to access it in the portal/>

It can also be accessed directly at this URL:

## Features and capabilities

<Open to other suggestions of how to organize this section. Thought describing the layout of the interface might help orient/ground the information and be as good a place as any to start./>

Azure Digital Twins Explorer is organized into panels, each with a different set of capabilities for exploring and managing your models, twins, and relationships.

The sections of the explorer are as follows:
* **MODELS**: Add, remove, and view details of your models from a list view
* **MODEL GRAPH**: Visualize your models and the ways they're interconnected in the form of a customizable model graph
* **TWIN GRAPH**: Visualize your twins and relationships as a customizable twin graph. Create and delete twins and relationships, and view or edit their properties.
* **QUERY EXPLORER**: Run queries against the twin graph and see the visual results

:::image type="content" source="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-panels.png" alt-text="Screenshot of Azure Digital Twins Explorer, with a highlight around each of the panels described above." lightbox="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-panels.png":::

For detailed instructions on how to use each feature, see [How-to: Use Azure Digital Twins Explorer](how-to-use-azure-digital-twins-explorer.md). 

## How to contribute

Azure Digital Twins Explorer is an **open-source** tool that welcomes contributions to the code and documentation. The hosted application is deployed regularly from a source code repository in GitHub.

To view the source code for the tool and read detailed instructions on how to contribute to the code, visit its GitHub repository: [digital-twins-explorer](https://github.com/Azure-Samples/digital-twins-explorer).

To view instructions for contributing to this documentation, visit the [Microsoft Docs contributor guide](https://docs.microsoft.com/contribute/).

## Other considerations

### Pricing

Azure Digital Twins Explorer is a free tool for interacting with the Azure Digital Twins service. While the tool itself is free, costs may be incurred during use when requests are sent to the Azure Digital Twins service, which follows these pricing guidelines: [Azure Digital Twins pricing](https://azure.microsoft.com/pricing/details/digital-twins/).

### Region support

Azure Digital Twins Explorer is available for use with all instances of Azure Digital Twins in all [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).

During public preview, however, data may be sent for processing through different regions than the region where the instance is hosted. To avoid this in situations where data sovereignty is a concern, you can download the [open source code](#how-to-contribute) to create a locally-hosted version of the explorer on your own machine.

## Next steps 

Learn how to use Azure Digital Twins Explorer's features in detail: [*How-to: Use Azure Digital Twins Explorer*](how-to-use-azure-digital-twins-explorer.md).