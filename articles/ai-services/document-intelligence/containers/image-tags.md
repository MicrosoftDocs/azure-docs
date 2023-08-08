---
title: Document Intelligence (formerly Form Recognizer) container image tags and release notes
titleSuffix: Azure AI services
description: A listing of all Document Intelligence container image tags.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: reference
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-3.1.0'
---






# Document Intelligence container tags

**This article applies to:** ![Document Intelligence v2.1 checkmark](../media/yes-icon.png) **Document Intelligence v2.1**.

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

## Microsoft container registry (MCR)

Document Intelligence container images can be found within the [**Microsoft Container Registry Catalog**](https://mcr.microsoft.com/v2/_catalog) listing, the primary registry for all Microsoft Published Docker images:

  :::image type="content" source="../media/containers/microsoft-container-registry-catalog.png" alt-text="Screenshot of the Microsoft Container Registry (MCR) catalog list.":::

## Document Intelligence tags

The following tags are available for Document Intelligence:

### [Latest version](#tab/current)

Release notes for `v2.1`:

| Container | Tags | Retrieve image |
|------------|:------|------------|
| **Layout**| &bullet; `latest` </br> &bullet; `2.1-preview`| `docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout`|
| **Business Card** | &bullet; `latest` </br> &bullet; `2.1-preview` |`docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/businesscard` |
| **ID Document** | &bullet; `latest` </br> &bullet; `2.1-preview`| `docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/id-document`|
| **Receipt**| &bullet; `latest` </br> &bullet; `2.1-preview`| `docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/receipt` |
| **Invoice**| &bullet; `latest` </br> &bullet; `2.1-preview`|`docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice` |
| **Custom API** | &bullet; `latest` </br> &bullet; `2.1-preview`| `docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-api`|
| **Custom Supervised**| &bullet; `latest` </br> &bullet; `2.1-preview`|`docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-supervised` |

### [Previous versions](#tab/previous)

> [!IMPORTANT]
> The Document Intelligence v1.0 container has been retired.

---






## Next steps

> [!div class="nextstepaction"]
> [Install and run Document Intelligence containers](install-run.md)
>

* [Azure container instance recipe](../../../ai-services/containers/azure-container-instance-recipe.md)
