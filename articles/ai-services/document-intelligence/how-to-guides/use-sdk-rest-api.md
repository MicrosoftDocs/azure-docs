---
title: "Use Document Intelligence client library SDKs or REST API "
titleSuffix: Azure AI services
description: Learn how to use Document Intelligence SDKs or REST API and create apps to extract key data from documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 08/21/2023
ms.author: lajanuar
zone_pivot_groups: programming-languages-set-formre
---

<!-- markdownlint-disable MD051 -->

# Use Document Intelligence models

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [applies to v4.0](../includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](../includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](../includes/applies-to-v30.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](../includes/applies-to-v21.md)]
::: moniker-end

::: moniker range=">=doc-intel-3.0.0"
In this guide, you learn how to add Document Intelligence models to your applications and workflows. Use a programming language SDK of your choice or the REST API.

Azure AI Document Intelligence is a cloud-based Azure AI service that uses machine learning to extract key text and structure elements from documents. We recommend that you use the free service while you learn the technology. Remember that the number of free pages is limited to 500 per month.

Choose from the following Document Intelligence models to analyze and extract data and values from forms and documents:

> [!div class="checklist"]
>
> - The [prebuilt-read](../concept-read.md) model is at the core of all Document Intelligence models and can detect lines, words, locations, and languages. Layout, general document, prebuilt, and custom models all use the read model as a foundation for extracting texts from documents.
>
> - The [prebuilt-layout](../concept-layout.md) model extracts text and text locations, tables, selection marks, and structure information from documents and images.
>
> - The [prebuilt-contract](../concept-contract.md) model extracts key information from contractual agreements.
>
> - The [prebuilt-healthInsuranceCard.us](../concept-health-insurance-card.md) model extracts key information from US health insurance cards.
>
> - The [prebuilt-tax.us.w2](../concept-tax-document.md) model extracts information reported on US Internal Revenue Service (IRS) tax forms.
>
> - The [prebuilt-tax.us.1098](../concept-tax-document.md) model extracts information reported on US 1098 tax forms.
>
> - The [prebuilt-tax.us.1098E](../concept-tax-document.md) model extracts information reported on US 1098-E tax forms.
>
> - The [prebuilt-tax.us.1098T](../concept-tax-document.md) model extracts information reported on US 1098-T tax forms.
>
> - The [prebuilt-tax.us.1099(variations)](../concept-tax-document.md) model extracts information reported on US 1099 tax forms.
>
> - The [prebuilt-invoice](../concept-invoice.md) model extracts key fields and line items from sales invoices in various formats and quality. Fields include phone-captured images, scanned documents, and digital PDFs.
>
> - The [prebuilt-receipt](../concept-receipt.md) model extracts key information from printed and handwritten sales receipts.
>
> - The [prebuilt-idDocument](../concept-id-document.md) model extracts key information from US drivers licenses, international passport biographical pages, US state IDs, social security cards, and permanent resident cards or *green cards*.
>
> - The [prebuilt-businessCard](../concept-business-card.md) model extracts key information from business cards.

::: moniker-end

::: zone pivot="programming-language-csharp"

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [C# SDK quickstart](includes/v3-0/csharp-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-java"

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [Java SDK quickstart](includes/v3-0/java-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-javascript"

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [NodeJS SDK quickstart](includes/v3-0/javascript-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-python"

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [Python SDK quickstart](includes/v3-0/python-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-rest-api"

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [REST API quickstart](includes/v3-0/rest-api.md)]
::: moniker-end

::: zone-end

::: moniker range=">=doc-intel-3.0.0"

## Next steps

Congratulations! You've learned to use Document Intelligence models to analyze various documents in different ways. Next, explore the Document Intelligence Studio and reference documentation.

>[!div class="nextstepaction"]
> [Try the Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

> [!div class="nextstepaction"]
> [Explore the Document Intelligence REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](../includes/applies-to-v21.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
In this how-to guide, you learn how to add Document Intelligence to your applications and workflows. Use a programming language of your choice or the REST API. Azure AI Document Intelligence is a cloud-based Azure AI service that uses machine learning to extract key-value pairs, text, and tables from your documents. We recommend that you use the free service while you learn the technology. Remember that the number of free pages is limited to 500 per month.

You use the following APIs to extract structured data from forms and documents:

- [Authenticate the client](#authenticate-the-client)
- [Analyze Layout](#analyze-layout)
- [Analyze receipts](#analyze-receipts)
- [Analyze business cards](#analyze-business-cards)
- [Analyze invoices](#analyze-invoices)
- [Analyze ID documents](#analyze-id-documents)
- [Train a custom model](#train-a-custom-model)
- [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
- [Manage custom models](#manage-custom-models)
::: moniker-end

::: zone pivot="programming-language-csharp"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [C# SDK quickstart](includes/v2-1/csharp-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-java"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [Java SDK quickstart](includes/v2-1/java-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-javascript"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [NodeJS SDK quickstart](includes/v2-1/javascript-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-python"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [Python SDK quickstart](includes/v2-1/python-sdk.md)]
::: moniker-end

::: zone-end

::: zone pivot="programming-language-rest-api"

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [REST API quickstart](includes/v2-1/rest-api.md)]
::: moniker-end

::: zone-end
