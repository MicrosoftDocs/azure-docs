---
title: Precise answering using answer span detection - question answering
description: Understand Precise answering feature available in question answering.
ms.service: azure-ai-language
ms.topic: conceptual
author: jboback
ms.author: jboback
ms.date: 12/19/2023
ms.custom: language-service-question-answering, ignite-fall-2021
---

# Precise answering

The precise answering feature introduced, allows you to get the precise short answer from the best candidate answer passage present in the project for any user query. This feature uses a deep learning model at runtime, which understands the intent of the user query and detects the precise short answer from the answer passage, if there is a short answer present as a fact in the answer passage.

This feature is beneficial for both content developers as well as end users. Now, content developers don't need to manually curate specific question answer pairs for every fact present in the project, and the end user doesn't need to look through the whole answer passage returned from the service to find the actual fact that answers the user's query.

## Precise answering via the portal

In the [Language Studio portal](https://aka.ms/languageStudio), when you open the test pane, you will see an option to **Include short answer response** on the top above show advanced options.

When you enter a query in the test pane, you will see a short-answer along with the answer passage, if there is a short answer present in the answer passage.

>[!div class="mx-imgBorder"]
>[![Screenshot of test pane with short answer checked and a question containing a short answer response.](../media/precise-answering/short-answer.png)](../media/precise-answering/short-answer.png#lightbox)

You can unselect the **Include short answer response** option, if you want to see only the **Long answer** passage in the test pane.

The service also returns back the confidence score of the precise answer as an **Answer-span confidence score** which you can check by selecting the **Inspect** option and then selection **additional information**.

>[!div class="mx-imgBorder"]
>[![Screenshot of inspect pane with answer-span confidence score displayed.](../media/precise-answering/answer-confidence-score.png)](../media/precise-answering/answer-confidence-score.png#lightbox)

## Deploying a bot

When you publish a bot, you get the precise answer enabled experience by default in your application, where you will see short answer along with the answer passage. Refer to the API reference for REST API to see how to use the precise answer (called AnswerSpan) in the response. User has the flexibility to choose other experiences by updating the template through the Bot app service.
