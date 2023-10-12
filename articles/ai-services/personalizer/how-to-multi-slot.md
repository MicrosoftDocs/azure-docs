---
title: How to use multi-slot with Personalizer
description: Learn how to use multi-slot with Personalizer to improve content recommendations provided by the service.
services: cognitive-services
author: jcodella
ms.author: jacodel
manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: how-to
ms.date: 05/24/2021
zone_pivot_groups: programming-languages-set-six
ms.devlang: csharp, javascript, python
ms.custom: mode-other, devx-track-extended-java, devx-track-js, devx-track-python
---

# Get started with multi-slot for Azure AI Personalizer

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Multi-slot personalization (Preview) allows you to target content in web layouts, carousels, and lists where more than one action (such as a product or piece of content) is shown to your users. With Personalizer multi-slot APIs, you can have the AI models in Personalizer learn what user contexts and products drive certain behaviors, considering and learning from the placement in your user interface. For example, Personalizer may learn that certain products or content drive more clicks as a sidebar or a footer than as a main highlight on a page. 

In this guide, you'll learn how to use the Personalizer multi-slot APIs.

::: zone pivot="programming-language-csharp"

[!INCLUDE [Try multi-slot with C#](./includes/quickstart-multislot-csharp.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [Try multi-slot with Node.js](./includes/quickstart-multislot-nodejs.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Try multi-slot with Python](./includes/quickstart-multislot-python.md)]

::: zone-end

## Next steps

* [Learn more about multi-slot](concept-multi-slot-personalization.md)
