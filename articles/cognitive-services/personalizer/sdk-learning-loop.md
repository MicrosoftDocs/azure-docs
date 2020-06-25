---
title: "Quickstart: Create and use learning loop with SDK - Personalizer"
description: This quickstart shows you how to create and manage your knowledge base using the client SDK.
ms.topic: quickstart
ms.date: 04/27/2020
ms.custom: tracking-python
zone_pivot_groups: programming-languages-set-six
---

# Quickstart: Personalizer client library

Display personalized content in this quickstart with the Personalizer service.

Get started with the Personalizer client library. Follow these steps to install the package and try out the example code for basic tasks.

 * Rank API -  Selects the best item, from actions, based on real-time information you provide about content and context.
 * Reward API - You determine the reward score based on your business needs, then send it to Personalizer with this API. That score can be a single value such as 1 for good, and 0 for bad, or an algorithm you create based on your business needs.

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

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
>[How Personalizer works](how-personalizer-works.md)

* [What is Personalizer?](what-is-personalizer.md)
* [Where can you use Personalizer?](where-can-you-use-personalizer.md)
* [Troubleshooting](troubleshooting.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/blob/master/quickstarts/python/sample.py).
