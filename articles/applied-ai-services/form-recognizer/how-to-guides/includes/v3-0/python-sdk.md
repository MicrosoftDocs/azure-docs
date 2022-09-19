---
title: "Use Form Recognizer SDK for Python (REST API v3.0)"
description: 'Use the Form Recognizer SDK for Python (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/16/2022
ms.author: lajanuar
ms.custom: devx-track-csharp
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Form Recognizer REST API version **3.0**.

[SDK reference](/https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-formrecognizer/3.2.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/3.2.0/) | [Samples](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0/sdk/formrecognizer/azure-ai-formrecognizer/samples/README.md) | [Supported REST API versions](../../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [Python 3.7 or later](https://www.python.org/)

  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. For more information, *see* [Getting Started with Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial).

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

Open a terminal window in your local environment and install the Azure Form Recognizer client library for Python with pip:

```console
pip install azure-ai-formrecognizer==3.2.0
```

## Create your Python application

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.

## Read model

## Layout model

## General document model

## W2 model

## Invoice model

## Receipt-model

## ID document model

## Business card model