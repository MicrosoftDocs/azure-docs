---
title: "Use Form Recognizer client library SDKs or REST API "
titleSuffix: Azure Applied AI Services
description: How to use Form Recognizer SDKs or REST API and create apps to extract key data from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 10/07/2022
ms.author: lajanuar
zone_pivot_groups: programming-languages-set-formre
recommendations: false
---
<!-- markdownlint-disable MD051 -->

# Use Form Recognizer models

::: moniker range="form-recog-3.0.0"
[!INCLUDE [applies to v3.0](../includes/applies-to-v3-0.md)]
::: moniker-end

::: moniker range="form-recog-3.0.0"
 In this guide, you'll learn how to add Form Recognizer models to your applications and workflows using a programming language SDK of your choice or the REST API. Azure Form Recognizer is a cloud-based Azure Applied AI Service that uses machine learning to extract key text and structure elements from documents. We recommend that you use the free service as you're learning the technology. Remember that the number of free pages is limited to 500 per month.

Choose from the following Form Recognizer models to analyze and extract data and values from forms and documents:

> [!div class="checklist"]
>
> * The [prebuilt-read](../concept-read.md) model is at the core of all Form Recognizer models and can detect lines, words, locations, and languages. Layout, general document, prebuilt, and custom models all use the read model as a foundation for extracting texts from documents.
>
> * The [prebuilt-layout](../concept-layout.md) model extracts text and text locations, tables, selection marks, and structure information from documents and images.
>
> * The [prebuilt-document](../concept-general-document.md) model extracts key-value pairs, tables, and selection marks from documents and can be used as an alternative to training a custom model without labels.
>
> * The [prebuilt-tax.us.w2](../concept-w2.md) model extracts information reported on US Internal Revenue Service (IRS) tax forms.
>
> * The [prebuilt-invoice](../concept-invoice.md) model extracts key fields and line items from sales invoices in various formats and quality including phone-captured images, scanned documents, and digital PDFs.
>
> * The [prebuilt-receipt](../concept-receipt.md) model extracts key information from printed and handwritten sales receipts.
>
> * The [prebuilt-idDocument](../concept-id-document.md) model extracts key information from US drivers licenses, international passport biographical pages, US state IDs, social security cards, and permanent resident (green) cards.
>
> * The [prebuilt-businessCard](../concept-business-card.md) model extracts key information from business card images.

::: moniker-end

::: zone pivot="programming-language-csharp"

::: moniker range="form-recog-3.0.0"
[!INCLUDE [C# SDK quickstart](includes/v3-0/csharp-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-java"

::: moniker range="form-recog-3.0.0"
[!INCLUDE [Java SDK quickstart](includes/v3-0/java-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-javascript"

::: moniker range="form-recog-3.0.0"
[!INCLUDE [NodeJS SDK quickstart](includes/v3-0/javascript-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-python"

::: moniker range="form-recog-3.0.0"
[!INCLUDE [Python SDK quickstart](includes/v3-0/python-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-rest-api"

::: moniker range="form-recog-3.0.0"
[!INCLUDE [REST API quickstart](includes/v3-0/rest-api.md)]
::: moniker-end

::: zone-end

::: moniker range="form-recog-3.0.0"

## Next steps

Congratulations! You've learned to use Form Recognizer models to analyze various documents in different ways. Next, explore the Form Recognizer Studio and reference documentation.
>[!div class="nextstepaction"]
> [**Try the Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio)

> [!div class="nextstepaction"]
> [**Explore the Form Recognizer REST API v3.0**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
::: moniker-end

::: moniker range="form-recog-2.1.0"
[!INCLUDE [applies to v2.1](../includes/applies-to-v2-1.md)]
::: moniker-end

::: moniker range="form-recog-2.1.0"
In this how-to guide, you'll learn how to add Form Recognizer to your applications and workflows using an SDK, in a programming language of your choice, or the REST API. Azure Form Recognizer is a cloud-based Azure Applied AI Service that uses machine learning to extract key-value pairs, text, and tables from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

You'll use the following APIs to extract structured data from forms and documents:

* [Authenticate the client](#authenticate-the-client)
* [Analyze Layout](#analyze-layout)
* [Analyze receipts](#analyze-receipts)
* [Analyze business cards](#analyze-business-cards)
* [Analyze invoices](#analyze-invoices)
* [Analyze ID documents](#analyze-id-documents)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage custom models](#manage-custom-models)
::: moniker-end

::: zone pivot="programming-language-csharp"

::: moniker range="form-recog-2.1.0"
[!INCLUDE [C# SDK quickstart](includes/v2-1/csharp-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-java"

::: moniker range="form-recog-2.1.0"
[!INCLUDE [Java SDK quickstart](includes/v2-1/java-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-javascript"

::: moniker range="form-recog-2.1.0"
[!INCLUDE [NodeJS SDK quickstart](includes/v2-1/javascript-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-python"

::: moniker range="form-recog-2.1.0"
[!INCLUDE [Python SDK quickstart](includes/v2-1/python-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-rest-api"

::: moniker range="form-recog-2.1.0"
[!INCLUDE [REST API quickstart](includes/v2-1/rest-api.md)]
::: moniker-end

::: zone-end
