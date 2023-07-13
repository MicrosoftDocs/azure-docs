---
title: Create a multi-service resource for Azure AI services
titleSuffix: Azure AI services
description: Create and manage a multi-service resource for Azure AI services
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

# Quickstart: Create a multi-service resource for Azure AI services

Use this quickstart to create and manage a multi-service resource for Azure AI services. A multi-service resource allows you to access multiple Azure AI services with a single key and endpoint. It also consolidates billing from the services you use.

You can access Azure AI services through two different resources: A multi-service resource, or a single-service one.

* Multi-service resource:
    * Access multiple Azure AI services with a single key and endpoint.
    * Consolidates billing from the services you use.
* Single-service resource:
    * Access a single Azure AI service with a unique key and endpoint for each service created. 
    * Most Azure AI servives offer a free tier to try it out.

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

* Explore [Azure AI services](./what-are-ai-services.md) and choose a service to get started.
