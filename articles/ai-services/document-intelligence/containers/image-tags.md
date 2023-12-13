---
title: Document Intelligence (formerly Form Recognizer) container image tags and release notes
titleSuffix: Azure AI services
description: A listing of all Document Intelligence container image tags.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 12/13/2023
ms.author: lajanuar
---

# Document Intelligence container tags

<!-- markdownlint-disable MD051 -->

:::moniker range="doc-intel-2.1.0 || doc-intel-3.1.0||doc-intel-4.0.0"

Support for containers is currently available with Document Intelligence version `2022-08-31 (GA)` only:

* [REST API `2022-08-31 (GA)`](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
* [SDKs targeting `REST API 2022-08-31 (GA)`](../sdk-overview-v3-0.md)

See [**Document Intelligence container image tags**](?view=doc-intel-3.0.0&preserve-view=true) for supported container documentation.

:::moniker-end

::: moniker range="doc-intel-3.0.0"

**This content applies to:** ![checkmark](../media/yes-icon.png) **v3.0 (GA)**

## Microsoft container registry (MCR)

Document Intelligence container images can be found within the [**Microsoft Artifact Registry** (also know as Microsoft Container Registry(MCR))](https://mcr.microsoft.com/catalog?search=document%20intelligence), the primary registry for all Microsoft published container images.

The following containers support DocumentIntelligence v3.0 models and features:

| Container name |image |
|---|---|
|[**Document Intelligence Studio**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/studio/tags)| `mcr.microsoft.com/azure-cognitive-services/form-recognizer/studio:latest`|
| [**Business Card 3.0**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/businesscard-3.0/tags) | `mcr.microsoft.com/azure-cognitive-services/form-recognizer/businesscard-3.0:latest` |
| [**Custom Template 3.0**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/custom-template-3.0/tags) | `mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-template-3.0:latest` |
| [**Document 3.0**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/document-3.0/tags)| `mcr.microsoft.com/azure-cognitive-services/form-recognizer/document-3.0:latest`|
| [**ID Document 3.0**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/id-document-3.0/tags) |  `mcr.microsoft.com/azure-cognitive-services/form-recognizer/id-document-3.0:latest` |
| [**Invoice 3.0**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/invoice-3.0/tags) |`mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice-3.0:latest`|
| [**Layout 3.0**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/layout/tags) |`mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout-3.0:latest`|
| [**Read 3.0**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/read-3.0/tags) |`mcr.microsoft.com/azure-cognitive-services/form-recognizer/read-3.0:latest`|
| [**Receipt 3.0**](https://mcr.microsoft.com/product/azure-cognitive-services/form-recognizer/receipt-3.0/tags) |`mcr.microsoft.com/azure-cognitive-services/form-recognizer/receipt-3.0:latest`|

::: moniker-end

:::moniker range="doc-intel-2.1.0"

> [!IMPORTANT]
>
> Document Intelligence v3.0 containers are now generally available. If you are getting started with containers, consider using the v3 containers.
The following containers:

## Feature containers

Document Intelligence containers support the following features:

| Container name | Fully qualified image name |
|---|---|
| **Layout** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout |
| **Business Card** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/businesscard |
| **ID Document** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/id-document |
| **Receipt** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/receipt |
| **Invoice** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice |
| **Custom API** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-api |
| **Custom Supervised** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-supervised |

> [!IMPORTANT]
> The Document Intelligence v1.0 container is retired.


## Next steps

> [!div class="nextstepaction"]
> [Install and run Document Intelligence containers](install-run.md)
:::moniker-end
