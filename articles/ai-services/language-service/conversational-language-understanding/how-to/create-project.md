---
title: How to create projects in Conversational Language Understanding
titleSuffix: Azure AI services
description: Use this article to learn how to create projects in Conversational Language Understanding.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 09/29/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# How to create a CLU project

Use this article to learn how to set up these requirements and create a project. 


## Prerequisites

Before you start using CLU, you will need several things:

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
* An Azure AI Language resource 

### Create a Language resource 

Before you start using CLU, you will need an Azure AI Language resource.

> [!NOTE]
>  * You need to have an **owner** role assigned on the resource group to create a Language resource.

[!INCLUDE [create a new resource from the Azure portal](../includes/resource-creation-azure-portal.md)]

[!INCLUDE [create a new resource from Language Studio](../includes/resource-creation-language-studio.md)]


## Sign in to Language Studio

[!INCLUDE [Sign in to Language studio](../includes/language-studio/sign-in-studio.md)]

## Create a conversation project

Once you have a Language resource created, create a Conversational Language Understanding project. 

### [Language Studio](#tab/language-studio)

[!INCLUDE [Create project](../includes/language-studio/create-project.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [create project](../includes/rest-api/create-project.md)]

---

## Import project

### [Language Studio](#tab/language-studio)

You can export a Conversational Language Understanding project as a JSON file at any time by going to the conversation projects page, selecting a project, and from the top menu, clicking on **Export**.

:::image type="content" source="../media/export.png" alt-text="A screenshot showing the Conversational Language Understanding export button." lightbox="../media/export.png":::

That project can be reimported as a new project. If you import a project with the exact same name, it replaces the project's data with the newly imported project's data.

If you have an existing LUIS application, you can _import_ the LUIS application JSON to Conversational Language Understanding directly, and it will create a Conversation project with all the pieces that are currently available: Intents, ML entities, and utterances. See [the LUIS migration article](../how-to/migrate-from-luis.md) for more information.

To import a project, select the arrow button next to **Create a new project** and select **Import**, then select the LUIS or Conversational Language Understanding JSON file.

:::image type="content" source="../media/import.png" alt-text="A screenshot showing the Conversational Language Understanding import button." lightbox="../media/import.png":::

### [REST APIs](#tab/rest-api)

You can import a CLU JSON into the service

[!INCLUDE [Import project](../includes/rest-api/import-project.md)]

---

## Export project

### [Language Studio](#tab/Language-Studio)

You can export a Conversational Language Understanding project as a JSON file at any time by going to the conversation projects page, selecting a project, and pressing **Export**.

### [REST APIs](#tab/rest-apis)

You can export a Conversational Language Understanding project as a JSON file at any time.

[!INCLUDE [Export project](../includes/rest-api/export-project.md)]

---

## Get CLU project details

### [Language Studio](#tab/language-studio)

[!INCLUDE [Language Studio project details](../includes/language-studio/project-details.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [REST APIs project details](../includes/rest-api/project-details.md)]

---

## Delete project 

### [Language Studio](#tab/language-studio)

[!INCLUDE [Delete project](../includes/language-studio/delete-project.md)]

### [REST APIs](#tab/rest-api)

When you don't need your project anymore, you can delete your project using the APIs.

[!INCLUDE [Delete project](../includes/rest-api/delete-project.md)]

---

## Next Steps

[Build schema](./build-schema.md)

