---
title: Create orchestration workflow projects and use Azure resources
titleSuffix: Azure Cognitive Services
description: Use this article to learn how to create projects in orchestration workflow
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/23/2023
ms.author: aahi
ms.custom: language-service-orchestration
---

# How to create projects in orchestration workflow

Orchestration workflow allows you to create projects that connect your applications to:
* Custom Language Understanding
* Question Answering
* LUIS

## Prerequisites

Before you start using orchestration workflow, you will need several things:

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
* An Azure Language resource 

### Create a Language resource 

Before you start using orchestration workflow, you will need an Azure Language resource.

> [!NOTE]
>  * You need to have an **owner** role assigned on the resource group to create a Language resource.
>  * If you are planning to use question answering, you have to enable question answering in resource creation

[!INCLUDE [create a new resource from the Azure portal](../includes/resource-creation-azure-portal.md)]

[!INCLUDE [create a new resource from Language Studio](../includes/resource-creation-language-studio.md)]

## Sign in to Language Studio

To create a new intent, click on *+Add* button and start by giving your intent a **name**. You will see two options, to connect to a project or not. You can connect to (LUIS, question answering, or Conversational Language Understanding) projects, or choose the **no** option.


## Create an orchestration workflow project

Once you have a Language resource created, create an orchestration workflow project. 

### [Language Studio](#tab/language-studio)

[!INCLUDE [Create project](../includes/language-studio/create-project.md)]

### [REST APIs](#tab/rest-api)

[!INCLUDE [create project](../includes/rest-api/create-project.md)]

---
## Import an orchestration workflow project

### [Language Studio](#tab/language-studio)

You can export an orchestration workflow project as a JSON file at any time by going to the orchestration workflow projects page, selecting a project, and from the top menu, clicking on **Export**.

That project can be reimported as a new project. If you import a project with the exact same name, it replaces the project's data with the newly imported project's data.

To import a project, click on the arrow button next to **Create a new project** and select **Import**, then select the JSON file.

:::image type="content" source="../media/import-export.png" alt-text="A screenshot showing the Conversational Language Understanding import button." lightbox="../media/import-export.png":::

### [REST APIs](#tab/rest-api)

You can import an orchestration workflow JSON into the service

[!INCLUDE [Import project](../includes/rest-api/import-project.md)]

---

## Export project

### [Language Studio](#tab/language-studio)

You can export an orchestration workflow project as a JSON file at any time by going to the orchestration workflow projects page, selecting a project, and pressing **Export**.

### [REST APIs](#tab/rest-api)

You can export an orchestration workflow project as a JSON file at any time.

[!INCLUDE [Export project](../includes/rest-api/export-project.md)]

---
## Get orchestration project details

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



:::image type="content" source="../media/quickstart-intent.png" alt-text="A screenshot showing how to import orchestration project." lightbox="../media/quickstart-intent.png":::

## Next Steps

[Build schema](./build-schema.md)
