---
title: "Quickstart: Document Intelligence (formerly Form Recognizer) SDKs | REST API "
titleSuffix: Azure AI services
description: Use a Document Intelligence SDK or the REST API to create a forms processing app that extracts key data and structure elements from your documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - devx-track-dotnet
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - ignite-2023
ms.topic: quickstart
ms.date: 08/15/2023
ms.author: lajanuar
zone_pivot_groups: programming-languages-set-formre
---


# Get started with Document Intelligence

> [!IMPORTANT]
>
> * Azure Cognitive Services Form Recognizer is now Azure AI Document Intelligence.
> * Some platforms are still awaiting the renaming update.
> * All mention of Form Recognizer or Document Intelligence in our documentation refers to the same Azure service.


::: moniker range="doc-intel-3.1.0"

**This content applies to:** ![checkmark](../media/yes-icon.png) **v3.1 (GA)** **Earlier versions:** ![blue-checkmark](../media/blue-yes-icon.png) [v3.0](?view=doc-intel-3.0.0&preserve-view=true) ![blue-checkmark](../media/blue-yes-icon.png) [v2.1](?view=doc-intel-2.1.0&preserve-view=true)

* Get started with Azure AI Document Intelligence latest GA version (v3.1).

* Azure AI Document Intelligence is a cloud-based Azure AI service that uses machine learning to extract key-value pairs, text, tables and key data from your documents.

* You can easily integrate Document Intelligence models into your workflows and applications by using an SDK in the programming language of your choice or calling the REST API.

* For this quickstart, we recommend that you use the free service while you're learning the technology. Remember that the number of free pages is limited to 500 per month.

To learn more about Document Intelligence features and development options, visit our [Overview](../overview.md) page.

::: moniker-end

::: moniker range="doc-intel-3.0.0"

**This content applies to:** ![checkmark](../media/yes-icon.png) **v3.0 (GA)** **Newer version:** ![blue-checkmark](../media/blue-yes-icon.png) [v3.1](?view=doc-intel-3.1.0&preserve-view=true)   ![blue-checkmark](../media/blue-yes-icon.png) [v2.1](?view=doc-intel-2.1.0&preserve-view=true)

Get started with Azure AI Document Intelligence GA version (3.0). Azure AI Document Intelligence is a cloud-based Azure AI service that uses machine learning to extract key-value pairs, text, tables and key data from your documents. You can easily integrate Document Intelligence models into your workflows and applications by using an SDK in the programming language of your choice or calling the REST API.  For this quickstart, we recommend that you use the free service while you're learning the technology. Remember that the number of free pages is limited to 500 per month.

To learn more about Document Intelligence features and development options, visit our [Overview](../overview.md) page.

> [!TIP]
>
> * For an enhance experience and advanced model quality, try the [Document Intelligence v3.1 (GA) quickstart](?view=doc-intel-3.1.0&preserve-view=true#get-started-with-document-intelligence) and [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio) API version: 2023-07-31 (3.1 General Availability).

::: moniker-end

::: zone pivot="programming-language-csharp"

::: moniker range="doc-intel-4.0.0 || doc-intel-3.1.0 || doc-intel-3.0.0"
[!INCLUDE [C# SDK](includes/v3-csharp-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-java"

::: moniker range="doc-intel-4.0.0 || doc-intel-3.1.0 || doc-intel-3.0.0"
[!INCLUDE [Java SDK](includes/v3-java-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-javascript"

::: moniker range="doc-intel-4.0.0 || doc-intel-3.1.0 || doc-intel-3.0.0"
[!INCLUDE [NodeJS SDK](includes/v3-javascript-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-python"

::: moniker range="doc-intel-4.0.0 || doc-intel-3.1.0 || doc-intel-3.0.0"
[!INCLUDE [Python SDK](includes/v3-python-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-rest-api"

::: moniker range="doc-intel-4.0.0 || doc-intel-3.1.0 || doc-intel-3.0.0"
[!INCLUDE [REST API](includes/v3-rest-api.md)]
::: moniker-end

::: zone-end

::: moniker range="doc-intel-4.0.0 || doc-intel-3.1.0 || doc-intel-3.0.0"

That's it, congratulations!

In this quickstart, you used a document Intelligence model to analyze various forms and documents. Next, explore the Document Intelligence Studio and reference documentation to learn about Document Intelligence API in depth.

## Next steps

>[!div class="nextstepaction"]
> [**Try the Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio)

> [!div class="nextstepaction"]
> [**Explore our how-to documentation and take a deeper dive into Document Intelligence models**](../how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](../includes/applies-to-v21.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"

Get started with Azure AI Document Intelligence using the programming language of your choice or the REST API. Document Intelligence is a cloud-based Azure AI service that uses machine learning to extract key-value pairs, text, and tables from your documents. You can easily call Document Intelligence models by integrating our client library SDKs into your workflows and applications. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

To learn more about Document Intelligence features and development options, visit our [Overview](../overview.md) page.

::: moniker-end

::: zone pivot="programming-language-csharp"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [C# SDK](includes/v2-1/csharp.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-java"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [Java SDK](includes/v2-1/java.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-javascript"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [NodeJS SDK](includes/v2-1/javascript.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-python"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [Python SDK](includes/v2-1/python.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-rest-api"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [REST API](includes/v2-1/rest-api.md)]
::: moniker-end

::: zone-end

::: moniker range="doc-intel-2.1.0"

That's it, congratulations! In this quickstart, you used Document Intelligence models to analyze various forms in different ways.

## Next steps

* For an enhanced experience and advanced model quality, try the [Document Intelligence v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).

* The v3.0 Studio supports any model trained with v2.1 labeled data.

* You can refer to the API migration guide for detailed information about migrating from v2.1 to v3.0.
* *See* our [**REST API**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) or [**C#**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**Java**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**JavaScript**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [**Python**](get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) SDK quickstarts to get started with the v3.0 version.

::: moniker-end
