---
title: How to create custom text classification projects
titleSuffix: Azure AI services
description: Learn about the steps for using Azure resources with custom text classification.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-custom-classification, references_regions, ignite-fall-2021, event-tier1-build-2022
---

# How to create custom text classification project

Use this article to learn how to set up the requirements for starting with custom text classification and create a project.

## Prerequisites

Before you start using custom text classification, you will need:

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Create a Language resource 

Before you start using custom text classification, you will need an Azure AI Language resource. It is recommended to create your Language resource and connect a storage account to it in the Azure portal. Creating a resource in the Azure portal lets you create an Azure storage account at the same time, with all of the required permissions pre-configured. You can also read further in the article to learn how to use a pre-existing resource, and configure it to work with custom text classification.

You also will need an Azure storage account where you will upload your `.txt` documents that will be used to train a model to classify text.

> [!NOTE]
>  * You need to have an **owner** role assigned on the resource group to create a Language resource.
>  * If you will connect a pre-existing storage account, you should have an **owner** role assigned to it.

## Create Language resource and connect storage account


> [!Note]
> You shouldn't move the storage account to a different resource group or subscription once it's linked with the Language resource.

### [Using the Azure portal](#tab/azure-portal)

[!INCLUDE [create a new resource from the Azure portal](../includes/resource-creation-azure-portal.md)]

### [Using Language Studio](#tab/language-studio)

[!INCLUDE [create a new resource from Language Studio](../includes/language-studio/resource-creation-language-studio.md)]

### [Using Azure PowerShell](#tab/azure-powershell)

[!INCLUDE [create a new resource with Azure PowerShell](../includes/resource-creation-powershell.md)]

---

> [!NOTE]
> * The process of connecting a storage account to your Language resource is irreversible, it cannot be disconnected later.
> * You can only connect your language resource to one storage account.

## Using a pre-existing Language resource

[!INCLUDE [use an existing resource](../includes/use-pre-existing-resource.md)]


## Create a custom text classification project

Once your resource and storage container are configured, create a new custom text classification project. A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have access to the Azure resource being used. If you have labeled data, you can [import it](#import-a-custom-text-classification-project) to get started.

### [Language Studio](#tab/studio)

[!INCLUDE [Language Studio project creation](../includes/language-studio/create-project.md)]


### [REST APIs](#tab/apis)

[!INCLUDE [REST APIs project creation](../includes/rest-api/create-project.md)]

---

## Import a custom text classification project

If you have already labeled data, you can use it to get started with the service. Make sure that your labeled data follows the [accepted data formats](../concepts/data-formats.md).

### [Language Studio](#tab/studio)

[!INCLUDE [Import project](../includes/language-studio/import-project.md)]

### [REST APIs](#tab/apis)

[!INCLUDE [Import project](../includes/rest-api/import-project.md)]

---

## Get project details

### [Language Studio](#tab/studio)

[!INCLUDE [Language Studio project details](../includes/language-studio/project-details.md)]

### [REST APIs](#tab/apis)

[!INCLUDE [REST API project details](../includes/rest-api/project-details.md)]

---

## Delete project

### [Language Studio](#tab/studio)

[!INCLUDE [Delete project using Language Studio](../includes/language-studio/delete-project.md)]

### [REST APIs](#tab/apis)

[!INCLUDE [Delete project using the REST API](../includes/rest-api/delete-project.md)]

---

## Next steps

* You should have an idea of the [project schema](design-schema.md) you will use to label your data.

* After your project is created, you can start [labeling your data](tag-data.md), which will inform your text classification model how to interpret text, and is used for training and evaluation.
