---
title: How to create projects in Conversational Language Understanding
titleSuffix: Azure Cognitive Services
description: Use this article to learn how to create projects in Conversational Language Understanding.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
---

## How to create projects in Conversational Language Understanding

Conversational Language Understanding allows you to create two types of projects: **Conversation** and **Orchestration Workflow** projects.

## Sign in to Language Studio
To get started, you have to first sign in to [Language Studio](https://language.azure.com/) and Text Analytics resource. Press Done once selection is complete.

## Navigate to Conversational Language Understanding

In language studio, find the **Understand conversational language** section, and select **Conversational language understanding**.

You will see the Conversational Language Understanding projects page.

:::image type="content" source="../media/projects_page.png" alt-text="A screenshot showing the Conversational Language Understanding projects page." lightbox="../media/projects_page.png":::

## Create a conversation project
After selecting conversation, you need to provide the following details:
- Name: Project name
- Description: Optional project description
- Text primary language: The primary language of your project. Your training data should be mainly be in this language.
- Enable multiple languages: Whether you would like to enable your project to support multiple languages at once.

:::image type="content" source="../media/clu-project-modal.png" alt-text="A screenshot showing the Conversational Language Understanding conversations project creation window." lightbox="../media/clu-project-modal.png":::

Once you're done, click next, review the details, and then click create project to complete the process. 

## Create an orchestration workflow project

After selecting orchestration, you need to provide the following details:
- Name: Project name
- Description: Optional project description
- Text primary language: The primary language of your project. Your training data should be mainly be in this language.
- Enable multiple languages: Whether you would like to enable your project to support multiple languages at once.

Once you're done, you now have the option to connect to the other projects and services you wish to orchestrate to. Each connection is represented by its type and relevant data. The intent needs to have a **name**, a **project type** (LUIS, custom question answering (QnA), or Custom Language Understanding), and then selecting the project you want to connect to by name. 

> [!NOTE]
> The list of projects you can connect to are only projects that are owned by the same Language resource you are using to create the orchestration project.

This step is optional and you will still have the option to add intent connections after you create the project.

:::image type="content" source="../media/orchestration-project-detail.png" alt-text="A screenshot showing the Conversational Language Understanding orchestration workflow project modal." lightbox="../media/orchestration-project-detail.png":::

## Import a project

You can export a Conversational Language Understanding project as a JSON file at any time by going to the conversation projects page, selecting a project, and pressing **Export**.
That project can be reimported as a new project. If you import a project with the exact same name, it replaces the project's data with the newly imported project's data.

:::image type="content" source="../media/export.png" alt-text="A screenshot showing the Conversational Language Understanding export button." lightbox="../media/export.png":::

If you have an existing LUIS application, you can _import_ the LUIS application JSON to Conversational Language Understanding directly, and it will create a Conversation project with all the pieces that are currently available: Intents, ML entities, and utterances. See [backwards compatibility with LUIS](../concepts/backwards-compatibility.md) for more information.

Click on the arrow button next to **Create a new project** and select **Import**, then select the LUIS or Conversational Language Understanding JSON file.

:::image type="content" source="../media/import.png" alt-text="A screenshot showing the Conversational Language Understanding import button." lightbox="../media/import.png":::

# Next Steps
- [Build schema](./build-schema.md)
