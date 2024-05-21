---
title: Embedding tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces you to the Embedding tool for flows in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# Embedding tool for flows in Azure AI Studio

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

The prompt flow Embedding tool enables you to convert text into dense vector representations for various natural language processing tasks.

> [!NOTE]
> For chat and completion tools, learn more about the large language model [(LLM) tool](llm-tool.md).

## Build with the Embedding tool

1. Create or open a flow in [Azure AI Studio](https://ai.azure.com). For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Embedding** to add the Embedding tool to your flow.

    :::image type="content" source="../../media/prompt-flow/embedding-tool.png" alt-text="Screenshot that shows the Embedding tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/embedding-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **Default_AzureOpenAI**.
1. Enter values for the Embedding tool input parameters described in the [Inputs table](#inputs).
1. Add more tools to your flow, as needed. Or select **Run** to run the flow.
1. The outputs are described in the [Outputs table](#outputs).

## Inputs

The following input parameters are available.

| Name                   | Type        | Description                                                                             | Required |
|------------------------|-------------|-----------------------------------------------------------------------------------------|----------|
| input                  | string      | The input text to embed.                                                                 | Yes      |
| model, deployment_name | string      | The instance of the text-embedding engine to use.                                            | Yes      |

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
