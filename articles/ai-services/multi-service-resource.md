---
title: Create a multi-service Cognitive Services resource
titleSuffix: Azure AI services
description: Create and manage a multi-service Cognitive Services resource
services: cognitive-services
keywords: Azure AI services, cognitive
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.topic: quickstart
ms.date: 7/18/2023
ms.author: eur
zone_pivot_groups: programming-languages-portal-cli-sdk
---

# Quickstart: Create a multi-service Cognitive Services resource

Use this quickstart to create and manage a multi-service Cognitive Services resource.

You can access Azure Cognitive Services through two different resources: A multi-service resource, or a single-service one.

* Multi-service resource:
    * Access multiple Azure Cognitive Services with a single key and endpoint.
    * Consolidates billing from the services you use.
* Single-service resource:
    * Access a single Azure Cognitive Service with a unique key and endpoint for each service created. 
    * Use the free tier to try out the service.

Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. They are available through REST APIs and client library SDKs in popular development languages. Azure AI services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

Individual AI services are represented by Azure [resources](../azure-resource-manager/management/manage-resources-portal.md) that you create under your Azure subscription. After you create a resource, you can use the keys and endpoint generated to authenticate your applications.


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
