---
title: Create projects in multiple languages -question answering
description: In this tutorial, you will learn how to create projects with multiple languages.
ms.service: azure-ai-language
ms.topic: tutorial
author: jboback
ms.author: jboback
ms.date: 11/02/2021
ms.custom: language-service-question-answering, ignite-fall-2021
---

# Create projects in multiple languages

In this tutorial, you learn how to:

<!-- green checkmark -->
> [!div class="checklist"]
> * Create a project that supports English
> * Create a project that supports German

This tutorial will walk through the process of creating projects in multiple languages. We use the [Surface Pen FAQ](https://support.microsoft.com/surface/how-to-use-your-surface-pen-8a403519-cd1f-15b2-c9df-faa5aa924e98) URL to create projects in German and English. We then deploy the project and use the question answering REST API to query and get answers to FAQs in the desired language.

## Create project in German

To be able to create a project in more than one language, the multiple language setting must be set at the creation of the first project that is associated with the language resource.

> [!div class="mx-imgBorder"]
> [ ![Screenshot of UI for create project with I want to select the language when I create a project in this resource selected.]( ../media/multiple-languages/multiple-languages.png) ](../media/multiple-languages/multiple-languages.png#lightbox)

1. From the [Language Studio](https://aka.ms/languageStudio) home page, select open custom question answering. Select **Create new project** > **I want to select the language when I create a project in this resource** > **Next**.

2. Fill out enter basic information page and select **Next** > **Create project**.

    |Setting| Value|
    |---|----|
    |Name | Unique name for your project|
    |Description | Unique description to help identify the project |
    |Source language | For this tutorial, select German |
    |Default answer | Default answer when no answer is returned |

    > [!div class="mx-imgBorder"]
    > [ ![Screenshot of UI for create project with the german laungague selected.]( ../media/multiple-languages/choose-german.png) ](../media/multiple-languages/choose-german.png#lightbox)

3. **Add source** > **URLs** > **Add url** > **Add all**.

    |Setting| Value |
    |----|------|
    | Url Name | Surface Pen German |
    | URL | https://support.microsoft.com/de-de/surface/how-to-use-your-surface-pen-8a403519-cd1f-15b2-c9df-faa5aa924e98 |
    | Classify file structure | Auto-detect |
    
    Question answering reads the document and extracts question answer pairs from the source URL to create the project in the German language. If you select the link to the source, the project page opens where we can edit the contents.
    
    > [!div class="mx-imgBorder"]
    > [ ![Screenshot of UI with German questions and answers](../media/multiple-languages/german-language.png) ]( ../media/multiple-languages/german-language.png#lightbox)
    
## Create project in English

We now repeat the above steps from before but this time select English and provide an English URL as a source.

1. From the [Language Studio](https://aka.ms/languageStudio) open the question answering page > **Create new project**.

2. Fill out enter basic information page and select **Next** > **Create project**.

    |Setting| Value|
    |---|----|
    |Name | Unique name for your project|
    |Description | Unique description to help identify the project |
    |Source language | For this tutorial, select English |
    |Default answer | Default answer when no answer is returned |

3. **Add source** > **URLs** > **Add url** > **Add all**.

    |Setting| Value |
    |-----|-----|
    | Url Name | Surface Pen German |
    | URL | https://support.microsoft.com/en-us/surface/how-to-use-your-surface-pen-8a403519-cd1f-15b2-c9df-faa5aa924e98 |
    | Classify file structure | Auto-detect |

## Deploy and query project

We are now ready to deploy the two project and query them in the desired language using the question answering REST API. Once a project is deployed, the following page is shown which provides details to query the project.

> [!div class="mx-imgBorder"]
> [ ![Screenshot of UI with English questions and answers](../media/multiple-languages/get-prediction-url.png) ](../media/multiple-languages/get-prediction-url.png#lightbox)

The language for the incoming user query can be detected with the [Language Detection API](../../language-detection/how-to/call-api.md) and the user can call the appropriate endpoint and project depending on the detected language.
