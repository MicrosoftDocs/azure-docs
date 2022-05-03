---
title: How to create projects and build schema in orchestration workflow
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

Orchestration workflow allows you to create projects that connect your applications to:
* Custom Language Understanding
* Question Answering
* LUIS
* QnA maker

## Sign in to Language Studio

To get started, you have to first sign in to [Language Studio](https://aka.ms/languageStudio) and create a Language resource. Select **Done** once selection is complete.

In language studio, find the **Understand questions and conversational language** section, and select **Orchestration workflow**.

You will see the orchestration workflow projects page.

<!--:::image type="content" source="../media/projects-page.png" alt-text="A screenshot showing the Conversational Language Understanding projects page." lightbox="../media/projects-page.png":::-->

## Create an orchestration workflow project

Select **Create new project**. When creating your workflow project, you need to provide the following details:
- Name: Project name
- Description: Optional project description
- Utterances primary language: The primary language of your utterances.

## Building schema and adding intents

Once you're done creating a project, you can connect it to the other projects and services you want to orchestrate to. Each connection is represented by its type and relevant data. 

To create a new intent, click on *+Add* button and start by giving your intent a **name**. You will see two options, to connect to a project or not. You can connect to (LUIS, question answering (QnA), or Conversational Language Understanding) projects, or choose the **no** option. 

> [!NOTE]
> The list of projects you can connect to are only projects that are owned by the same Language resource you are using to create the orchestration project.


:::image type="content" source="../media/quickstart-intent.png" alt-text="A screenshot showing the Conversational Language Understanding orchestration workflow project modal." lightbox="../media/quickstart-intent.png":::

In Orchestration Workflow projects, the data used to train connected intents isn't provided within the project. Instead, the project pulls the data from the connected service (such as connected LUIS applications, Conversational Language Understanding projects, or Custom Question Answering knowledge bases) during training. However, if you create intents that are not connected to any service, you still need to add utterances to those intents.

## Export and import a project

You can export an orchestration workflow project as a JSON file at any time by going to the projects page, selecting a project, and pressing **Export**.
That project can be reimported as a new project. If you import a project with the exact same name, it replaces the project's data with the newly imported project's data.

To import a project, select the arrow button on the projects page next to **Create a new project** and select **Import**. Then select the orchestration workflow JSON file.

## Next Steps

[Build schema](./train-model.md)
