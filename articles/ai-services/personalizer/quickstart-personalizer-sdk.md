---
title: "Quickstart: Create and use learning loop with client SDK - Personalizer"
description: This quickstart shows you how to create and manage a Personalizer learning loop using the client library.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: quickstart
ms.date: 02/02/2023
ms.devlang: csharp, javascript, python
ms.custom: cog-serv-seo-aug-2020, mode-api, devx-track-extended-java, devx-track-js, devx-track-python
keywords: personalizer, Azure AI Personalizer, machine learning
zone_pivot_groups: programming-languages-set-six
---

# Quickstart: Personalizer client library

Get started with the Azure AI Personalizer client libraries to set up a basic learning loop. A learning loop is a system of decisions and feedback: an application requests a decision ranking from the service, then it uses the top-ranked choice and calculates a reward score from the outcome. It returns the reward score to the service. Over time, Personalizer uses AI algorithms to  make better decisions for any given context. Follow these steps to set up a sample application.

## Example scenario

In this quickstart, a grocery e-retailer wants to increase revenue by showing relevant and personalized products to each customer on its website. On the main page, there's a "Featured Product" section that displays a prepared meal product to prospective customers. The e-retailer would like to determine how to show the right product to the right customer in order to maximize the likelihood of a purchase.

The Personalizer service solves this problem in an automated, scalable, and adaptable way using reinforcement learning. You'll learn how to create _actions_ and their features, _context features_, and _reward scores_. You'll use the Personalizer client library to make calls to the [Rank and Reward APIs](what-is-personalizer.md#rank-and-reward-apis).

::: zone pivot="programming-language-csharp"
[!INCLUDE [Get intent with C# SDK](./includes/quickstart-sdk-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Get intent with Node.js SDK](./includes/quickstart-sdk-nodejs.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Get intent with Python SDK](./includes/quickstart-sdk-python.md)]
::: zone-end

## Download the trained model

If you'd like download a Personalizer model that has been trained on 5,000 events from the example above, visit the [Personalizer Samples repository](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/tree/master/quickstarts) and download the _Personalizer_QuickStart_Model.zip_ file. Then go to your Personalizer resource in the Azure portal, go to the **Setup** page and the **Import/export** tab, and import the file.

## Clean up resources

To clean up your Azure AI services subscription, you can delete the resource or delete the resource group, which will delete any associated resources.

* [Portal](../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
> [How Personalizer works](how-personalizer-works.md)
> [Where to use Personalizer](where-can-you-use-personalizer.md)
