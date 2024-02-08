---
# Mandatory fields.
title: Azure Digital Twins Explorer (preview)
titleSuffix: Azure Digital Twins
description: Learn about the capabilities and purpose of Azure Digital Twins Explorer (preview) and when it can be a useful tool for visualizing digital models, twins, and graphs.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/29/2023
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins Explorer (preview)

This article contains information about the Azure Digital Twins Explorer, including its use cases and an overview of its features. For detailed steps on using each feature, see [Use Azure Digital Twins Explorer (preview)](how-to-use-azure-digital-twins-explorer.md).

*Azure Digital Twins Explorer* is a developer tool for visualizing and interacting with the data in your Azure Digital Twins instance, including your [models](concepts-models.md) and [twin graph](concepts-twins-graph.md). 

Here's a view of the explorer window, showing models and twins that have been populated for a sample graph:

:::image type="content" source="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png" alt-text="Screenshot of Azure Digital Twins Explorer showing sample models and twins." lightbox="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-demo.png":::

The visual interface is a great tool for exploring and understanding the shape of your graph and model set. It also allows you to make pointed, on the spot changes to individual twins and relationships.

## When to use

Azure Digital Twins Explorer is a visual tool designed for users who want to explore their twin graph, and modify twins and relationships in the context of their graph.

Developers may find this tool especially useful in the following scenarios:
* Exploration: Use the explorer to learn about Azure Digital Twins and the way it represents your real-world environment. Import sample models and graphs that you can view and edit to familiarize yourself with the service. For guided steps to get started using Azure Digital Twins Explorer, see [Get started with Azure Digital Twins Explorer](quickstart-azure-digital-twins-explorer.md).
* Development: Use the explorer to view and validate your twin graph. You can also use it to investigate specific properties of models, twins, and relationships. Make on the spot modifications to your graph and its data. For detailed instructions on how to use each feature, see [Use Azure Digital Twins Explorer](how-to-use-azure-digital-twins-explorer.md). 

The explorer's main purpose is to help you visualize and understand your graph, and update your graph as needed. For large-scale solutions and for work that should be repeated or automated, consider using the [APIs and SDKs](./concepts-apis-sdks.md) to interact with your instance through code instead.

## How to access

The main way to access Azure Digital Twins Explorer is through the [Azure portal](https://portal.azure.com).

To open Azure Digital Twins Explorer for an Azure Digital Twins instance, first navigate to the instance in the portal, by searching for its name in the portal search bar.

[!INCLUDE [digital-twins-access-explorer.md](../../includes/digital-twins-access-explorer.md)]

## Features and capabilities

Azure Digital Twins Explorer is organized into panels, each with a different set of capabilities for exploring and managing your models, twins, and relationships.

The sections of the explorer are as follows:
* **Query Explorer**: Run queries against the twin graph and see the visual results in the **Twin Graph** panel.
* **Models**: View a list of your models and perform model actions such as add, remove, and view model details.
* **Twins**: View a list of your twins and their associated relationships.
* **Twin Graph**: Visualize your twins and relationships as a customizable twin graph. Create and delete twins and relationships, and view or edit their properties.
* **Model Graph**: Visualize your models and the ways they're interconnected in the form of a customizable model graph.

:::image type="content" source="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-panels.png" alt-text="Screenshot of Azure Digital Twins Explorer, with a highlight around each of the panels described above." lightbox="media/concepts-azure-digital-twins-explorer/azure-digital-twins-explorer-panels.png":::

For detailed instructions on how to use each feature, see [Use Azure Digital Twins Explorer](how-to-use-azure-digital-twins-explorer.md). 

[!INCLUDE [digital-twins-explorer-dtdl](../../includes/digital-twins-explorer-dtdl.md)]

## How to contribute

Azure Digital Twins Explorer is an open-source tool that welcomes contributions to the code and documentation. The hosted application is deployed regularly from a source code repository in GitHub.

To view the source code for the tool and read detailed instructions on how to contribute to the code, visit its GitHub repository: [digital-twins-explorer](https://github.com/Azure-Samples/digital-twins-explorer).

To view instructions for contributing to this documentation, review our [contributor guide](/contribute/).

## Other considerations

### Region support

Azure Digital Twins Explorer is available for use with all instances of Azure Digital Twins in all [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).

During public preview, however, data may be sent for processing through different regions than the region where the instance is hosted. To avoid data being routed in this way in situations where data sovereignty is a concern, you can download the [open source code](#how-to-contribute) to create a locally hosted version of the explorer on your own machine.

### Billing

Azure Digital Twins Explorer is a free tool for interacting with the Azure Digital Twins service. While the tool itself is free, costs may be incurred during use when requests are sent to the Azure Digital Twins service, which follows these pricing guidelines: [Azure Digital Twins pricing](https://azure.microsoft.com/pricing/details/digital-twins/).

## Next steps 

Learn how to use Azure Digital Twins Explorer's features in detail: [Use Azure Digital Twins Explorer](how-to-use-azure-digital-twins-explorer.md).
