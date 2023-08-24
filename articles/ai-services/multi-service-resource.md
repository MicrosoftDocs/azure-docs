---
title: Create a multi-service resource for Azure AI services
titleSuffix: Azure AI services
description: Create and manage a multi-service resource for Azure AI services
services: cognitive-services
keywords: Azure AI services, cognitive
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.custom: devx-track-azurecli, devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: quickstart
ms.date: 08/02/2023
ms.author: eur
zone_pivot_groups: programming-languages-portal-cli-sdk
---

# Quickstart: Create a multi-service resource for Azure AI services

Use this quickstart to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.

You can access Azure AI services through two different resources: A multi-service resource, or a single-service one.

* Multi-service resource:
    * Access multiple Azure AI services with a single key and endpoint.
    * Consolidates billing from the services you use.
* Single-service resource:
    * Access a single Azure AI service with a unique key and endpoint for each service created. 
    * Most Azure AI services offer a free tier to try it out.

Azure AI services are represented by Azure [resources](../azure-resource-manager/management/manage-resources-portal.md) that you create under your Azure subscription. After you create a resource, you can use the keys and endpoint generated to authenticate your applications.

::: zone pivot="azportal"

[!INCLUDE [Azure Portal quickstart](includes/quickstarts/management-azportal.md)]

::: zone-end

::: zone pivot="azcli"

[!INCLUDE [Azure CLI quickstart](includes/quickstarts/management-azcli.md)]

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

* Now that you have a resource, you can authenticate your API requests to the following Azure AI services. Use these links to find quickstart articles, samples and more to start using your resource.
    * [Content Moderator](./content-moderator/index.yml) (retired) 
    * [Custom Vision](./custom-vision-service/index.yml) 
    * [Document Intelligence](./document-intelligence/index.yml)
    * [Face](./computer-vision/overview-identity.md) 
    * [Language](./language-service/index.yml)
    * [Speech](./speech-service/index.yml) 
    * [Translator](./translator/index.yml)
    * [Vision](./computer-vision/index.yml) 