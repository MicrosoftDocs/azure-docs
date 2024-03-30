---
title: Create a multi-service resource for Azure AI services
titleSuffix: Azure AI services
description: Create and manage a multi-service resource for Azure AI services.
keywords: Azure AI services, cognitive
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom: devx-track-azurecli, devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python, devx-track-azurepowershell
ms.topic: quickstart
ms.date: 08/02/2023
ms.author: eur
zone_pivot_groups: programming-languages-portal-cli-sdk
---

# Quickstart: Create a multi-service resource for Azure AI services

Learn how to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.

You can access Azure AI services through two different resources: A multi-service resource, or a single-service one.

* Multi-service resource:
    * Access multiple Azure AI services with a single key and endpoint.
    * Consolidates billing from the services you use.
* Single-service resource:
    * Access a single Azure AI service with a unique key and endpoint for each service created. 
    * Most Azure AI services offer a free tier to try it out.

Azure AI services are Azure [resources](../azure-resource-manager/management/manage-resources-portal.md) that you create under your Azure subscription. After you create a resource, you can use the keys and endpoint generated to authenticate your applications.

## Supported services with a multi-service resource

The multi-service resource enables access to the following Azure AI services with a single key and endpoint. Use these links to find quickstart articles, samples, and more to start using your resource.

| Service | Description |
| --- | --- |
| ![Content Moderator icon](./media/service-icons/content-moderator.svg) [Content Moderator](./content-moderator/index.yml) (retired) | Detect potentially offensive or unwanted content. |
| ![Custom Vision icon](./media/service-icons/custom-vision.svg) [Custom Vision](./custom-vision-service/index.yml) | Customize image recognition for your business. |
| ![Document Intelligence icon](./media/service-icons/document-intelligence.svg) [Document Intelligence](./document-intelligence/index.yml) | Turn documents into intelligent data-driven solutions. |
| ![Face icon](./media/service-icons/face.svg) [Face](./computer-vision/overview-identity.md) | Detect and identify people and emotions in images. |
| ![Language icon](./media/service-icons/language.svg) [Language](./language-service/index.yml) | Build apps with industry-leading natural language understanding capabilities. |
| ![Speech icon](./media/service-icons/speech.svg) [Speech](./speech-service/index.yml) | Speech to text, text to speech, translation, and speaker recognition. |
| ![Translator icon](./media/service-icons/translator.svg) [Translator](./translator/index.yml) | Use AI-powered translation technology to translate more than 100 in-use, at-risk, and endangered languages and dialects.. |
| ![Vision icon](./media/service-icons/vision.svg) [Vision](./computer-vision/index.yml) | Analyze content in images and videos. |

::: zone pivot="azportal"

[!INCLUDE [Azure Portal quickstart](includes/quickstarts/management-azportal.md)]

::: zone-end

::: zone pivot="azcli"

[!INCLUDE [Azure CLI quickstart](includes/quickstarts/management-azcli.md)]

::: zone-end

::: zone pivot="azpowershell"

[!INCLUDE [Azure PowerShell quickstart](includes/quickstarts/management-azpowershell.md)]

::: zone-end

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# SDK quickstart](includes/quickstarts/management-csharp.md)]

::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Java SDK quickstart](includes/quickstarts/management-java.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [NodeJS SDK quickstart](includes/quickstarts/management-node.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK quickstart](includes/quickstarts/management-python.md)]

::: zone-end

## Next steps

* Now that you have a resource, you can authenticate your API requests to one of the [supported Azure AI services](#supported-services-with-a-multi-service-resource). 
