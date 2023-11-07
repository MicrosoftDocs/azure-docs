---
title: Embedding tool for flows in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces the Embedding tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Embedding tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *Embedding* tool enables you to convert text into dense vector representations for various natural language processing tasks

> [!NOTE]
> For chat and completion tools, check out the [LLM tool](llm-tool.md).

## Build with the Embedding tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Embedding** to add the Embedding tool to your flow.

    :::image type="content" source="../../media/prompt-flow/embedding-tool.png" alt-text="Screenshot of the Embedding tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/embedding-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **Default_AzureOpenAI**.
1. Enter values for the Embedding tool input parameters described [here](#inputs).
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).


## Inputs

The following are available input parameters:

| Name                   | Type        | Description                                                                             | Required |
|------------------------|-------------|-----------------------------------------------------------------------------------------|----------|
| input                  | string      | the input text to embed                                                                 | Yes      |
| model, deployment_name | string      | instance of the text-embedding engine to use                                            | Yes      |

## Outputs

The output is a list of vector representations for the input text. For example:

```
[
  0.123,
  0.456,
  0.789
]
```

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)

