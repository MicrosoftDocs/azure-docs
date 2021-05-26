---
title: "Document Translation C#/.NET or Python client library"
titleSuffix: Azure Cognitive Services
description: Use the Translator C#/.NET or Python client library (SDK) for cloud-based batch document translation service and process
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 04/14/2021
ms.author: lajanuar
---

# Document Translation client libraries and  SDKs

Use the Document Translation cloud-based batch document translation service via the C#/.NET or Python SDKs. For the REST API, see our [Quickstart](get-started-with-document-translation.md) guide. You can translate large files and whole documents asynchronously to and from 90 languages and dialects while preserving the original layout and data formats.

### [C#/.NET](#tab/csharp)

[Source code][documenttranslation_client_src] | [Package (NuGet)][documenttranslation_nuget_package] | [API reference documentation][documenttranslation_refdocs] | [Product documentation][documenttranslation_docs] | [Samples][documenttranslation_samples]

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator resource**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) service resource (**not** a Cognitive Services resource).

* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You will create containers to store and organize your blob data within your storage account.

## Setting up

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `batch-document-translation`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*.

```console
dotnet new console -n batch-document-translation
```

Change your directory to the newly created app folder. You can build the application with:

```console
dotnet build
```

The build output should contain no warnings or errors.

```console
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

 ## Get started

Next, explore our [**Azure Document Translation client library for .NET**](/dotnet/api/overview/azure/ai.translation.document-readme-pre) documentation. There you will find code samples for the following operations:

* [**Translate documents**](/dotnet/api/overview/azure/ai.translation.document-readme-pre?branch=main#start-translation)

* [**Translate documents asynchronously**](/dotnet/api/overview/azure/ai.translation.document-readme-pre?branch=main#start-translation-asynchronously)

* [**Get history for all submitted translation operations**](/dotnet/api/overview/azure/ai.translation.document-readme-pre?branch=main#get-operations-history-asynchronously)


<!-- LINKS -->
[documenttranslation_client_src]: https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Translation.Document_1.0.0-beta.1/sdk/translation/Azure.AI.Translation.Document/src
<!--TODO: remove /overview -->
[documenttranslation_docs]: /azure/cognitive-services/translator/document-translation/overview
<!-- TODO: Add correct link when available -->
[documenttranslation_refdocs]: https://aka.ms/azsdk/net/translation/docs
<!-- TODO: Add correct link when available -->
[documenttranslation_nuget_package]: https://www.nuget.org/
[documenttranslation_samples]: https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Translation.Document_1.0.0-beta.1/sdk/translation/Azure.AI.Translation.Document/samples/README.md



### [Python](#tab/python)

[Source code][python-dt-src] | [Package (PyPI)][python-dt-pypi] | [API reference documentation][python-dt-ref-docs] | [Product documentation][python-dt-product-docs] | [Samples][python-dt-samples]

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service access Translator**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) resource (**not** a Cognitive Services resource).

* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You will create containers to store and organize your blob data within your storage account.

## Get started

Next, explore our [**Azure Document Translation client library for Python**](/python/api/overview/azure/ai-translation-document-readme?view=azure-python-preview&preserve-view=true) documentation. There you will find code samples for the following operations:

* [**Translate documents**](/python/api/overview/azure/ai-translation-document-readme?view=azure-python-preview&preserve-view=true#translate-your-documents)

* [**Check status on individual documents**](/python/api/overview/azure/ai-translation-document-readme?view=azure-python-preview&preserve-view=true#check-status-on-individual-documents)

* [**List translation jobs**](/python/api/overview/azure/ai-translation-document-readme?view=azure-python-preview&preserve-view=true#list-translation-jobs)

<!-- LINKS -->

[python-dt-src]: https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-translation-document_1.0.0b1/sdk/translation/azure-ai-translation-document/azure/ai/translation/document
[python-dt-pypi]: https://aka.ms/azsdk/python/texttranslation/pypi
[python-dt-product-docs]: /azure/cognitive-services/translator/document-translation/overview
[python-dt-ref-docs]: https://aka.ms/azsdk/python/documenttranslation/docs
[python-dt-samples]: https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-translation-document_1.0.0b1/sdk/translation/azure-ai-translation-document/samples

---

> [!div class="nextstepaction"]
> [Translate documents with HTTP REST methods](get-started-with-document-translation.md)

