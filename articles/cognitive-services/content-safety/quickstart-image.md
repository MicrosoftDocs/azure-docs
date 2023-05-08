---
title: "Quickstart: Analyze image content"
titleSuffix: Azure Cognitive Services
description: Get started using Content Safety to analyze image content for objectionable material.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: quickstart
ms.date: 05/08/2023
ms.author: pafarley
zone_pivot_groups: programming-languages-content-safety
keywords: 
---

# QuickStart: Analyze image content

Get started with the Content Studio, REST API, or client SDKs to do basic image moderation. The Content Safety service provides you with AI algorithms for flagging objectionable content. Follow these steps to try it out.

> [!NOTE]
> 
> The sample data and code may contain offensive content. User discretion is advised.

::: zone pivot="programming-language-rest"

[!INCLUDE [REST API quickstart](./includes/quickstarts/rest-quickstart-image.md)]

::: zone-end

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# SDK quickstart](./includes/quickstarts/csharp-quickstart-image.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK quickstart](./includes/quickstarts/python-quickstart-image.md)]

::: zone-end



## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
- [Azure CLI](/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

## Next steps

Become more familiar with the content flags that Content Safety uses to evaluate content.

> [!div class="nextstepaction"]
> [Content flags](./concepts/content-flags.md)