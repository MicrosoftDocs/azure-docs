---
title: "Quickstart: Create and use learning loop with SDK - Personalizer"
description: This quickstart shows you how to create and manage your knowledge base using the Personalizer client library.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: quickstart
ms.date: 9/1/2022
ms.devlang: csharp, javascript, python
ms.custom: cog-serv-seo-aug-2020, mode-api
keywords: personalizer, Azure personalizer, machine learning
zone_pivot_groups: programming-languages-set-six
---

# Quickstart: Getting started with the Personalizer client library

Imagine a scenario where a grocery e-retailer wishes to increase revenue by showing relevant and personalized products to each customer visiting their website. On the main page, there's a "Featured Product" section that displays a prepared meal product to prospective customers. However, the e-retailer would like to determine how to show the right product to the right customer in order to maximize the likelihood of a purchase.

In this quick-start, you'll learn how to use the Azure Personalizer service to do solve this problem in an automated, scalable, and adaptable fashion using the power of reinforcement learning. You'll learn how to create actions and their features, context features, and reward scores. You'll use the Personalizer client library to make calls to the [Rank and Reward APIs](what-is-personalizer.md#rank-and-reward-apis). You'll also run a cycle of Rank and Reward calls for three example users.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Get intent with C# SDK](./includes/quickstart-sdk-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Get intent with Node.js SDK](./includes/quickstart-sdk-nodejs.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Get intent with Python SDK](./includes/quickstart-sdk-python.md)]
::: zone-end

## Clean up resources

To clean up your Cognitive Services subscription, you can delete the resource or the resource group, which will delete any associated resources.

* [Portal](../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
> [How Personalizer works](how-personalizer-works.md)
> [Where to use Personalizer?](where-can-you-use-personalizer.md)
