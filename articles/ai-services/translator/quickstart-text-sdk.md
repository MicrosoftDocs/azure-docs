---
title: "Quickstart: Azure AI Translator SDKs"
titleSuffix: Azure AI services
description: "Learn to translate text with the Translator service SDks in a programming language of your choice: C#, Java, JavaScript, or Python."
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: quickstart
ms.date: 09/06/2023
ms.author: lajanuar
ms.devlang: csharp, java, javascript, python
ms.custom: mode-other, devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups:  programming-languages-set-translator-sdk
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->

# Quickstart: Azure AI Translator SDKs (preview)

> [!IMPORTANT]
>
> * The Translator text SDKs are currently available in public preview. Features, approaches and processes may change, prior to General Availability (GA), based on user feedback.

In this quickstart, get started using the Translator service to [translate text](reference/v3-0-translate.md) using a programming language of your choice. For this project, we recommend using the free pricing tier (F0), while you're learning the technology, and later upgrading to a paid tier for production.

## Prerequisites

You need an active Azure subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* Once you have your Azure subscription, create a [Translator resource](create-translator-resource.md) in the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation).

* After your resource deploys, select **Go to resource** and retrieve your key and endpoint.

  * Get the key, endpoint, and region from the resource to connect your application to the Translator service. Paste these values into the code later in the quickstart. You can find them on the Azure portal **Keys and Endpoint** page:

    :::image type="content" source="media/quickstarts/keys-and-endpoint-portal.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# programming](includes/text-translation-sdk/csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Java programming](includes/text-translation-sdk/java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [NodeJS programming](includes/text-translation-sdk/javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python programming](includes/text-translation-sdk/python.md)]
::: zone-end

That's it, congratulations! In this quickstart, you used a Text Translation SDK to translate text.

## Next steps

Learn more about Text Translation development options:

> [!div class="nextstepaction"]
>[Text Translation SDK overview](text-sdk-overview.md) </br></br>[Text Translation V3 reference](reference/v3-0-reference.md)
