---
title: Create an Azure AI services resource
titleSuffix: Azure AI services
description: Create and manage an Azure AI services resource.
keywords: Cognitive
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom: devx-track-azurecli, devx-track-azurepowershell, build-2024
ms.topic: quickstart
ms.date: 8/1/2024
ms.author: eur
zone_pivot_groups: programming-languages-portal-cli-ps
---

# Quickstart: Create an Azure AI services resource

Learn how to create and manage an Azure AI services resource. An Azure AI services resource allows you to access multiple Azure AI services with a single set of credentials. 

You can access Azure AI services through two different resources: 

* Azure AI services multi-service resource:
    * Access multiple Azure AI services with a single set of credentials.
    * Consolidates billing from the services you use.
* Single-service resource such as Face and Vision:
    * Access a single Azure AI service with a unique set of credentials for each service created. 
    * Most Azure AI services offer a free tier to try it out.

Azure AI services are Azure [resources](../azure-resource-manager/management/manage-resources-portal.md) that you create under your Azure subscription. After you create a resource, you can use the keys and endpoint generated to authenticate your applications.

## Supported services with a multi-service resource

The multi-service resource enables access to the following Azure AI services with a single set of credentials. Some services are available via the multi-service resource and single-service resource.

> [!TIP]
> We recommend whenever possible to use the **Azure AI services** resource (where the API kind is `AIServices`) to access multiple Azure AI services with a single set of credentials. For services not available via the multi-service resource (such as Face and Custom Vision), you can create a single-service resource.

| Service | Description | Kind (via API) |
| --- | --- | --- |
| ![Azure OpenAI Service icon](~/reusable-content/ce-skilling/azure/media/ai-services/azure-openai.svg) [Azure OpenAI](./openai/index.yml) | Perform a wide variety of natural language tasks. | `AIServices`<br/>`OpenAI` |
| ![Content Safety icon](~/reusable-content/ce-skilling/azure/media/ai-services/content-safety.svg) [Content Safety](./content-safety/index.yml) | An AI service that detects unwanted contents. | `AIServices`<br/>`ContentSafety` |
| ![Custom Vision icon](~/reusable-content/ce-skilling/azure/media/ai-services/custom-vision.svg) [Custom Vision](./custom-vision-service/index.yml) | Customize image recognition for your business. | `CustomVision.Prediction` (Prediction only)<br/>`CustomVision.Training` (Training only) |
| ![Document Intelligence icon](~/reusable-content/ce-skilling/azure/media/ai-services/document-intelligence.svg) [Document Intelligence](./document-intelligence/index.yml) | Turn documents into intelligent data-driven solutions. | `AIServices`<br/>`FormRecognizer` |
| ![Face icon](~/reusable-content/ce-skilling/azure/media/ai-services/face.svg) [Face](./computer-vision/overview-identity.md) | Detect and identify people and emotions in images. | `Face` |
| ![Language icon](~/reusable-content/ce-skilling/azure/media/ai-services/language.svg) [Language](./language-service/index.yml) | Build apps with industry-leading natural language understanding capabilities. | `AIServices`<br/>`TextAnalytics` |
| ![Speech icon](~/reusable-content/ce-skilling/azure/media/ai-services/speech.svg) [Speech](./speech-service/index.yml) | Speech to text, text to speech, translation, and speaker recognition. | `AIServices`<br/>`Speech` |
| ![Translator icon](~/reusable-content/ce-skilling/azure/media/ai-services/translator.svg) [Translator](./translator/index.yml) | Use AI-powered translation technology to translate more than 100 in-use, at-risk, and endangered languages and dialects. | `AIServices`<br/>`TextTranslation` |
| ![Vision icon](~/reusable-content/ce-skilling/azure/media/ai-services/vision.svg) [Vision](./computer-vision/index.yml) | Analyze content in images and videos. | `AIServices` (Training and Prediction)<br/>`ComputerVision` |

::: zone pivot="azportal"

[!INCLUDE [Azure portal quickstart](includes/quickstarts/management-azportal.md)]

::: zone-end

::: zone pivot="azcli"

[!INCLUDE [Azure CLI quickstart](includes/quickstarts/management-azcli.md)]

::: zone-end

::: zone pivot="azpowershell"

[!INCLUDE [Azure PowerShell quickstart](includes/quickstarts/management-azpowershell.md)]

::: zone-end

## Pricing

[!INCLUDE [SKUs and pricing](./includes/quickstarts/sku-pricing.md)]

## Related content

- Go to the [Azure AI services hub](../ai-services/index.yml).
- Try AI services in the [Azure AI Studio](../ai-studio/ai-services/connect-ai-services.md).
