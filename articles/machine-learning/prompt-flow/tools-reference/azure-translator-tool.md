---
title: Azure Translator tool in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Reference on Azure Translator in Prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Azure Translator tool (preview)

Azure AI Translator is a cloud-based machine translation service you can use to translate text in with a simple REST API call. See the [Azure Translator API](../../../ai-services/translator/index.yml) for more information.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Requirements

- requests

## Prerequisites

- [Create a Translator resource](../../../ai-services/translator/create-translator-resource.md).

## Inputs

The following are available input parameters:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| input_text | string | The text to translate. | Yes |
| source_language | string | The language (code) of the input text. | Yes |
| target_language | string | The language (code) you want the text to be translated too. | Yes |

For more information, please refer to [Translator 3.0: Translate](../../../cognitive-services/translator/reference/v3-0-translate.md#required-parameters)

## Outputs

The following is an example output returned by the tool:

input_text = "Is this a leap year?"
source_language = "en"
target_language = "hi"

```
क्या यह एक छलांग वर्ष है?
```
