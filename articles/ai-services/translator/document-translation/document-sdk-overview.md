---
title: Document Translation SDKs
titleSuffix: Azure AI services
description: Document Translation software development kits (SDKs) expose Document Translation features and capabilities, using C#, Java, JavaScript, and Python programming language.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.custom: devx-track-python
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD051 -->

# Document Translation SDK

Document Translation is a cloud-based REST API feature of the Azure AI Translator service. The Document Translation API enables quick and accurate source-to-target whole document translations, asynchronously, in supported languages and various file formats. The Document Translation software development kit (SDK) is a set of libraries and tools that enable you to easily integrate Document Translation REST API capabilities into your applications.

## Supported languages

Document Translation SDK supports the following programming languages:

| Language → SDK version | Package|Client library| Supported API version|
|:----------------------:|:----------|:----------|:-------------|
|[.NET/C# → 1.0.0](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.Translation.Document/1.0.0/index.html)| [NuGet](https://www.nuget.org/packages/Azure.AI.Translation.Document) | [Azure SDK for .NET](/dotnet/api/overview/azure/AI.Translation.Document-readme?view=azure-dotnet&preserve-view=true) | Document Translation v1.1|
|[Python → 1.0.0](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-translation-document/1.0.0/index.html)|[PyPi](https://pypi.org/project/azure-ai-translation-document/1.0.0/)|[Azure SDK for Python](/python/api/overview/azure/ai-translation-document-readme?view=azure-python&preserve-view=true)|Document Translation v1.1|

## Changelog and release history

This section provides a version-based description of Document Translation feature and capability releases, changes, updates, and enhancements.

### [C#/.NET](#tab/csharp)

**Version 1.0.0 (GA)** </br>
**2022-06-07**

##### [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.Translation.Document_1.0.0/sdk/translation/Azure.AI.Translation.Document/CHANGELOG.md)

##### [README](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.Translation.Document_1.0.0/sdk/translation/Azure.AI.Translation.Document/README.md)

##### [Samples](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Translation.Document_1.0.0/sdk/translation/Azure.AI.Translation.Document/samples)

### [Python](#tab/python)

**Version 1.0.0 (GA)** </br>
**2022-06-07**

##### [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-translation-document_1.0.0/sdk/translation/azure-ai-translation-document/CHANGELOG.md)

##### [README](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-translation-document_1.0.0/sdk/translation/azure-ai-translation-document/README.md)

##### [Samples](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-translation-document_1.0.0/sdk/translation/azure-ai-translation-document/samples)

---

## Use Document Translation SDK in your applications

The Document Translation SDK enables the use and management of the Translation service in your application. The SDK builds on the underlying Document Translation REST APIs for use within your programming language paradigm. Choose your preferred programming language:

### 1. Install the SDK client library

### [C#/.NET](#tab/csharp)

```dotnetcli
dotnet add package Azure.AI.Translation.Document --version 1.0.0
```

```powershell
Install-Package Azure.AI.Translation.Document -Version 1.0.0
```

### [Python](#tab/python)

```python
pip install azure-ai-translation-document==1.0.0
```

---

### 2. Import the SDK client library into your application

### [C#/.NET](#tab/csharp)

```csharp
using System;
using Azure.Core;
using Azure.AI.Translation.Document;
```

### [Python](#tab/python)

```python
from azure.ai.translation.document import DocumentTranslationClient
from azure.core.credentials import AzureKeyCredential
```

---

### 3. Authenticate the client

### [C#/.NET](#tab/csharp)

Create an instance of the `DocumentTranslationClient` object to interact with the Document Translation SDK, and then call methods on that client object to interact with the service. The `DocumentTranslationClient` is the primary interface for using the Document Translation client library. It provides both synchronous and asynchronous methods to perform operations.

```csharp
private static readonly string endpoint = "<your-custom-endpoint>";
private static readonly string key = "<your-key>";

DocumentTranslationClient client = new DocumentTranslationClient(new Uri(endpoint), new AzureKeyCredential(key));

```

### [Python](#tab/python)

Create an instance of the `DocumentTranslationClient` object to interact with the Document Translation SDK, and then call methods on that client object to interact with the service. The `DocumentTranslationClient` is the primary interface for using the Document Translation client library. It provides both synchronous and asynchronous methods to perform operations.

```python
endpoint = "<endpoint>"
key = "<apiKey>"

client = DocumentTranslationClient(endpoint, AzureKeyCredential(key))

```

---

### 4. Build your application

### [C#/.NET](#tab/csharp)

The Document Translation interface requires the following input:

1. Upload your files to an Azure Blob Storage source container (sourceUri).
1. Provide a target container where the translated documents can be written (targetUri).
1. Include the target language code (targetLanguage).

```csharp

Uri sourceUri = new Uri("<your-source container-url");
Uri targetUri = new Uri("<your-target-container-url>");
string targetLanguage = "<target-language-code>";

DocumentTranslationInput input = new DocumentTranslationInput(sourceUri, targetUri, targetLanguage)
```

### [Python](#tab/python)

The Document Translation interface requires the following input:

1. Upload your files to an Azure Blob Storage source container (sourceUri).
1. Provide a target container where the translated documents can be written (targetUri).
1. Include the target language code (targetLanguage).

```python
sourceUrl = "<your-source container-url>"
targetUrl = "<your-target-container-url>"
targetLanguage = "<target-language-code>"

poller = client.begin_translation(sourceUrl, targetUrl, targetLanguage)
result = poller.result()

```

---

## Help options

The [Microsoft Q&A](/answers/tags/132/azure-translator) and [Stack Overflow](https://stackoverflow.com/questions/tagged/microsoft-translator) forums are available for the developer community to ask and answer questions about Azure Text Translation and other services. Microsoft monitors the forums and replies to questions that the community has yet to answer.

> [!TIP]
> To make sure that we see your Microsoft Q&A question, tag it with **`microsoft-translator`**.
> To make sure that we see your Stack Overflow question, tag it with **`Azure AI Translator`**.
>

## Next steps

>[!div class="nextstepaction"]
> [**Document Translation SDK quickstart**](quickstarts/document-translation-sdk.md) [**Document Translation v1.1 REST API reference**](reference/rest-api-guide.md)
