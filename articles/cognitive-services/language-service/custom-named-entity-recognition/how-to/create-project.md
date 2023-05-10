---
title: Create custom NER projects and use Azure resources
titleSuffix: Azure Cognitive Services
description: Learn how to create and manage projects and Azure resources for custom NER.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 06/03/2022
ms.author: aahi
ms.custom: language-service-custom-ner, references_regions, ignite-fall-2021, event-tier1-build-2022
---

# How to create custom NER project

Use this article to learn how to set up the requirements for starting with custom NER and create a project.

## Prerequisites

Before you start using custom NER, you will need:

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Create a Language resource 

Before you start using custom NER, you will need an Azure Language resource. It is recommended to create your Language resource and connect a storage account to it in the Azure portal. Creating a resource in the Azure portal lets you create an Azure storage account at the same time, with all of the required permissions pre-configured. You can also read further in the article to learn how to use a pre-existing resource, and configure it to work with custom named entity recognition.

You also will need an Azure storage account where you will upload your `.txt` documents that will be used to train a model to extract entities.

> [!NOTE]
>  * You need to have an **owner** role assigned on the resource group to create a Language resource.
>  * If you will connect a pre-existing storage account, you should have an owner role assigned to it.

## Create Language resource and connect storage account

You can create a resource in the following ways:

* The Azure portal
* Language Studio
* PowerShell

> [!Note]
> You shouldn't move the storage account to a different resource group or subscription once it's linked with the Language resource.

[!INCLUDE [create a new resource from the Azure portal](../includes/resource-creation-azure-portal.md)]

[!INCLUDE [create a new resource from Language Studio](../includes/language-studio/resource-creation-language-studio.md)]

[!INCLUDE [create a new resource with Azure PowerShell](../includes/resource-creation-powershell.md)]


> [!NOTE]
> * The process of connecting a storage account to your Language resource is irreversible, it cannot be disconnected later.
> * You can only connect your language resource to one storage account.

## Using a pre-existing Language resource

[!INCLUDE [use an existing resource](../includes/use-pre-existing-resource.md)]

## Create a custom named entity recognition project

Once your resource and storage container are configured, create a new custom NER project. A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have access to the Azure resource being used. If you have labeled data, you can use it to get started by [importing a project](#import-project).

### [Language Studio](#tab/language-studio)

[!INCLUDE [Language Studio project creation](../includes/language-studio/create-project.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [REST APIs project creation](../includes/rest-api/create-project.md)]

---

## Import project

If you have already labeled data, you can use it to get started with the service. Make sure that your labeled data follows the [accepted data formats](../concepts/data-formats.md).

### [Language Studio](#tab/language-studio)

[!INCLUDE [Import project](../includes/language-studio/import-project.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [Import project](../includes/rest-api/import-project.md)]

---

## Get project details

### [Language Studio](#tab/language-studio)

[!INCLUDE [Language Studio project details](../includes/language-studio/project-details.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [REST APIs project details](../includes/rest-api/project-details.md)]

---

## Delete project

### [Language Studio](#tab/language-studio)

[!INCLUDE [Delete project using Language studio](../includes/language-studio/delete-project.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [Delete project using the REST API](../includes/rest-api/delete-project.md)]

---

## Next steps

* You should have an idea of the [project schema](design-schema.md) you will use to label your data.

* After your project is created, you can start [labeling your data](tag-data.md), which will inform your entity extraction model how to interpret text, and is used for training and evaluation.
