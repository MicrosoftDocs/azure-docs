---
title: Azure Translator tool for flows in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces the Azure Translator tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Azure Translator tool for flows in Azure AI Studio

Azure Translator tool can detect and identify the language of input text. The Azure Translator tool uses the [Azure AI Translator](../../../translator/) service. 

## Prerequisites

Create an Azure AI Translator connection:
1. Sign in to [Azure AI Studio](https://studio.azureml.net/).
1. Go to **Settings** > **Connections**.
1. Select **+ New connection**.
1. Complete all steps in the **Create a new connection** dialog box to create a custom connection to your [Azure AI Translator resource](../../../translator/create-translator-resource.md). Specify a connection name such as  **AzureAITranslatorConnection** that will be used in the flow.

## Build with the Azure Translator tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-build.md).
1. Select **+ More tools** > **Azure Language Detector** to add the Azure Translator tool to your flow.

    :::image type="content" source="../../media/prompt-flow/translator-tool.png" alt-text="Screenshot of the playground page of the Azure AI Studio with python sample code in view" lightbox="../../media/prompt-flow/translator-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **AzureAITranslatorConnection**. For example, select **AzureAITranslatorConnection** if you created a connection with that name. See [Prerequisites](#prerequisites) for more information.
1. Enter values for the Azure Translator tool input parameters described [here](#inputs).
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).

## Inputs

The following are available input parameters:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| input_text | string | The text to translate. | Yes |
| source_language | string | The language (code) of the input text. | Yes |
| target_language | string | The language (code) you want the text to be translated too. | Yes |

For more information, please refer to [Translator 3.0: Translate](../../../translator/reference/v3-0-translate.md#request-parameters)

## Outputs

The following is an example output returned by the tool:

input_text = "Is this a leap year?"
source_language = "en"
target_language = "hi"

```
क्या यह एक छलांग वर्ष है?
```


## Next steps

- [Learn more about how to create a flow](../flow-build.md)

