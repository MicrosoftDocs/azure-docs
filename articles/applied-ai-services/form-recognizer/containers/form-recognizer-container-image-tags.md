---
title: Form Recognizer image tags and release notes
titleSuffix: Azure Applied AI Services
description: A listing of all Form Recognizer container image tags.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: reference
ms.date: 11/29/2022
ms.author: lajanuar
monikerRange: 'form-recog-2.1.0'
recommendations: false
---

# Form Recognizer container image tags and release notes

**This article applies to:** ![Form Recognizer v2.1 checkmark](../media/yes-icon.png) **Form Recognizer v2.1**.

## Feature containers

Form Recognizer features are supported by seven containers:

| Container name | Fully qualified image name |
|---|---|
| **Layout** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout |
| **Business Card** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/businesscard |
| **ID Document** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/id-document |
| **Receipt** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/receipt |
| **Invoice** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice |
| **Custom API** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-api |
| **Custom Supervised** | mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-supervised |

## Microsoft container registry

Form Recognizer container images can be found on the Microsoft Container Registry **mcr.microsoft.** **<span></span>com** container registry syndicate, the primary registry for all Microsoft Published Docker images.

* The discovery experience for MCR is provided through [docker hub](https://hub.docker.com/publishers/microsoftowner).

* You can also query [the list of repositories within mcr](https://mcr.microsoft.com/v2/_catalog).

## Form Recognizer tags

The following tags are available for Form Recognizer:

### [Latest version](#tab/current)

Release notes for `v2.1`:

| Container | Tags | Retrieve image |
|------------|:------|------------|
| **Layout**| &bullet; `latest` </br> &bullet; `2.1`| `docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout)`|
| **Business Card** | &bullet; `latest` </br> &bullet; `2.1` |`docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/receipt` |
| **ID Document** | &bullet; `latest` </br> &bullet; `2.1`| `docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/id-document`|
| **Receipt**| &bullet; `latest` </br> &bullet; `2.1`| `docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/receipt` |
| **Invoice**| &bullet; `latest` </br> &bullet; `2.1`|`docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice` |
| **Custom API** | &bullet; `latest` </br> &bullet; `2.1`| `docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-api`|
| **Custom Supervised**| &bullet; `latest` </br> &bullet; `2.1`|`docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/custom-supervised` |

### [Previous versions](#tab/previous)

> [!IMPORTANT]
> The Form Recognizer v1.0 container has been retired.

---

## Next steps

> [!div class="nextstepaction"]
> [Install and run Form Recognizer containers](form-recognizer-container-install-run.md)
>

* [Azure container instance recipe](../../../cognitive-services/containers/azure-container-instance-recipe.md)
