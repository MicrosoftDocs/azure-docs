---
title: Enrich your project with active learning
description: In this tutorial, learn how to enrich your question answering projects with active learning
ms.service: azure-ai-language
ms.topic: tutorial
author: jboback
ms.author: jboback
ms.date: 11/02/2021
ms.custom: language-service-question-answering, ignite-fall-2021
---

# Enrich your project with active learning

In this tutorial, you learn how to:

<!-- green checkmark -->
> [!div class="checklist"]
> * Download an active learning test file
> * Import the test file to your existing project
> * Accept/reject active learning suggestions
> * Add alternate questions

This tutorial shows you how to enhance your question answering project with active learning. If you notice that customers are asking questions, which are not part of your project. There are often variations of questions that are paraphrased differently.

These variations when added as alternate questions to the relevant question answer pair, help to optimize the project to answer real world user queries. You can manually add alternate questions to question answer pairs through the editor. At the same time, you can also use the active learning feature to generate active learning suggestions based on user queries. The active learning feature, however, requires that the project receives regular user traffic to generate suggestions.

## Enable active learning

Active learning is turned on by default for question answering enabled resources.

To try out active learning suggestions, you can import the following file as a new project: [SampleActiveLearning.tsv](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/knowledge-bases/SampleActiveLearning.tsv).

## Download file

Run the following command from the command prompt to download a local copy of the `SampleActiveLearning.tsv` file.

```cmd
curl "https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/knowledge-bases/SampleActiveLearning.tsv" --output SampleActiveLearning.tsv
```

## Import file

From the edit project pane for your project, select the `...` (ellipsis) icon from the menu > **Import questions and answers** > **Import as TSV**. The select **Choose file** to browse to the copy of `SampleActiveLearning.tsv` that you downloaded to your computer in the previous step, and then select done.

> [!div class="mx-imgBorder"]
> [ ![Screenshot of edit project menu bar with import as TSV option displayed.]( ../media/active-learning/import-questions.png) ]( ../media/active-learning/import-questions.png#lightbox)

## View and add/reject active learning suggestions

Once the import of the test file is complete, active learning suggestions can be viewed on the review suggestions pane:

> [!div class="mx-imgBorder"]
> [ ![Screenshot with review suggestions page displayed.]( ../media/active-learning/review-suggestions.png) ]( ../media/active-learning/review-suggestions.png#lightbox)

> [!NOTE]
> Active learning suggestions are not real time. There is an approximate delay of 30 minutes before the suggestions can show on this pane. This delay is to ensure that we balance the high cost involved for real time updates to the index and service performance.

We can now either accept these suggestions or reject them using the options on the menu bar to **Accept all suggestions** or **Reject all suggestions**.

Alternatively, to accept or reject individual suggestions, select the checkmark (accept) symbol or trash can (reject) symbol that appears next to individual questions in the **Review suggestions** page.

> [!div class="mx-imgBorder"]
> [ ![Screenshot with option to accept or reject highlighted in red.]( ../media/active-learning/accept-reject.png) ]( ../media/active-learning/accept-reject.png#lightbox)

## Add alternate questions

While active learning automatically suggests alternate questions based on the user queries hitting the project, we can also add variations of a question on the edit project page by selecting **Add alternate phrase** to question answer pairs.

By adding alternate questions along with active learning, we further enrich the project with variations of a question that helps to provide consistent answers to user queries.

> [!NOTE]
> When alternate questions have many stop words, they might negatively impact the accuracy of responses. So, if the only difference between alternate questions is in the stop words, these alternate questions are not required.
> To examine the list of stop words consult the [stop words article](https://github.com/Azure-Samples/azure-search-sample-data/blob/master/STOPWORDS.md).

## Next steps


