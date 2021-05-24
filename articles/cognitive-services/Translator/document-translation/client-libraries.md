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

Use Document Translation to

* [**Create a Document Translation job**](#create-a-document-translation-job)
* [**Check the status of submitted documents**](#check-the-status-of-submitted-documents)
* [**Check the status of all submitted translation jobs**](#check-the-status-of-all-submitted-translation-jobs)

>[!IMPORTANT]
> The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons.

### [C#/.NET](#tab/csharp)

[Reference documentation](/dotnet/api/overview/azure/ai.formrecognizer-readme) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer) | [Samples](/samples/azure/azure-sdk-for-python/documenttranslation-samples/)

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**Translator**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) service resource (**not** a Cognitive Services resource).

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

### Install the client library

Within the application directory, install the Form Recognizer client library for .NET with the following command:

```console
dotnet add package Azure.AI.Translation.Document --version 1.0.0-beta.1
```

## Create a Document Translation job

## Check the status of submitted documents

## Check the status of all submitted translation jobs

---

### [Python](#tab/python)

[Reference documentation](/python/api/azure-ai-translation-document/azure.ai.translation.document.documenttranslationclient?view=azure-python-preview&preserve-view=true) | [Package (PyPi)](https://pypi.org/project/azure-ai-translation-document/) | [Samples](/samples/azure/azure-sdk-for-net/azure-document-translation-client-sdk-samples/)

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**Translator**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) service resource (**not** a Cognitive Services resource).

* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You will create containers to store and organize your blob data within your storage account.

## Setting up

### Install the client library

After installing Python, you can install the latest version of the Form Recognizer client library with:

```console
pip install azure-ai-translation-document
```

## Create a Document Translation job

## Check  the status of submitted documents

## Check the status of all submitted translation jobs

---