---
title: Parse or chunk content
description: How to parse content or chunk content to ingest using Azure AI operations for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 07/26/2024
# Customer intent: As a developer using Azure Logic Apps, I want to parse or chunk content that I want to ingest using Azure AI operations for my Standard workflow in Azure Logic Apps.
---

# Parse or chunk content to ingest using Azure AI operations for Standard workflows in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To ingest content, such as a PDF, CSV, or even an Excel file, for processing with an Azure AI operation, such as **Azure AI Search** or **Azure OpenAI**, you can include the **Data Operations** actions named **Parse a document** and **Chunk text** in your Standard logic app workflow. These actions convert large bodies of content into formats that Azure AI operations can more easily use.

The following table describes these data operations:

| Data operation | Description |
|----------------|-------------|
| **Parse a document** | Convert the specified content into a string with tokens that represent outputs, which you can use with subsequent actions in your workflow. |
| **Chunk text** | Split the specified content into pieces, based on the selected strategy: <br><br>- **FixedLength** - number of characters: Provide the maximum number of characters per chunk and the language to use. <br><br>- **TokenSize** - number of tokens: Provide the maximum number of tokens per chunk and the encoding model to use. |

This how-to guide shows how to add and set up these operations in your workflow.

## Prerequisites


## Parse a document




