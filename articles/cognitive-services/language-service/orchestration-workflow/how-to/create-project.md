---
title: How to create projects in orchestration workflow
titleSuffix: Azure Cognitive Services
description: Use this article to learn how to create projects in orchestration workflow
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-orchestration
---

# How to create projects in orchestration workflow

Orchestration workflow allows you to create projects that connect your applications in:
* Custom Language Understanding
* Question Answering
* LUIS
* QnA maker

## Sign in to Language Studio

To get started, you have to first sign in to [Language Studio](https://aka.ms/languageStudio) and create a Language resource. Select **Done** once selection is complete.

In language studio, find the **Understand conversational language** section, and select **Orchestration workflow**.

You will see the orchestration workflow projects page.

<!--:::image type="content" source="../media/projects-page.png" alt-text="A screenshot showing the Conversational Language Understanding projects page." lightbox="../media/projects-page.png":::-->

## Create an orchestration workflow project

Select **Create new project**. When creating your workflow project, you need to provide the following details:
- Name: Project name
- Description: Optional project description
- Text primary language: The primary language of your project. Your training data should be mainly be in this language.
- Enable multiple languages: Whether you would like to enable your project to support multiple languages at once.

Once you're done, you now have the option to connect to the other projects and services you wish to orchestrate to. Each connection is represented by its type and relevant data. The intent needs to have a **name**, a **project type** (LUIS, question answering (QnA), or Conversational Language Understanding), and then selecting the project you want to connect to by name. 

> [!NOTE]
> The list of projects you can connect to are only projects that are owned by the same Language resource you are using to create the orchestration project.

This step is optional and you will still have the option to add intent connections after you create the project.

:::image type="content" source="../media/orchestration-project-detail.png" alt-text="A screenshot showing the Conversational Language Understanding orchestration workflow project modal." lightbox="../media/orchestration-project-detail.png":::

## Add intents

In Orchestration Workflow projects, the data used to train connected intents isn't provided within the project. Instead, the project pulls the data from the connected service (such as connected LUIS applications, Conversational Language Understanding projects, or Custom Question Answering knowledge bases) during training. However, if you create intents that are not connected to any service, you still need to add utterances to those intents.

## Export and import a project

You can export an orchestration workflow project as a JSON file at any time by going to the projects page, selecting a project, and pressing **Export**.
That project can be reimported as a new project. If you import a project with the exact same name, it replaces the project's data with the newly imported project's data.

To import a project, select the arrow button on the projects page next to **Create a new project** and select **Import**. Then select the orchestration workflow JSON file.

## Next Steps

[Build schema](./build-schema.md)
