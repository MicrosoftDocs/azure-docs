---
title: Azure Language Detector tool for flows in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces the Azure Language Detector tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Azure Language Detector tool for flows in Azure AI Studio

Azure Language Detector tool can detect and identify the language of input text. The Azure Language Detector tool uses the [Azure AI Translator](/azure/ai-services/translator/) service. For more information, see the [Azure AI Translator: Detect API](../../../translator/reference/v3-0-detect.md).

## Prerequisites

Create an Azure AI Translator connection:
1. Sign in to [Azure AI Studio](https://studio.azureml.net/).
1. Go to **Settings** > **Connections**.
1. Select **+ New connection**.
1. Complete all steps in the **Create a new connection** dialog box to create a custom connection to your [Azure AI Translator resource](../../../translator/create-translator-resource.md). Specify a connection name such as  **AzureAITranslatorConnection** that is used later in the flow.

## Build with the Azure Language Detector tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-build.md).
1. Select **+ More tools** > **Azure Language Detector** to add the Azure Language Detector tool to your flow.

    :::image type="content" source="../../media/prompt-flow/language-detector-tool.png" alt-text="Screenshot of the Azure Language Detector tool added to a flow in Azure AI Studio" lightbox="../../media/prompt-flow/language-detector-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **AzureAITranslatorConnection**. For example, select **AzureAITranslatorConnection** if you created a connection with that name. For more information, see [Prerequisites](#prerequisites).
1. Enter values for the Azure Language Detector tool input parameters described [here](#inputs).
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).

## Inputs

The following are available input parameters:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| input_text | string | Identify the language of the input text. | Yes |

For more information, see to [Translator 3.0: Detect](../../../translator/reference/v3-0-detect.md)


## Outputs

For example, if the input text is "Is this year a leap year?", the output is `en` (English).

```
en
```

## Next steps

- [Learn more about how to create a flow](../flow-build.md)
