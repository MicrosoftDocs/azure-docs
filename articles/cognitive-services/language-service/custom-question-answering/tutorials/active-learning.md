---
title: Enrich your knowledge base with Active Learning
description: In this tutorial, learn how to enrich your knowledge bases with action learning
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: tutorial
author: mrbullwinkle
ms.author: mbullwin
ms.date: 11/02/2021
---

# Enrich your knowledge base with active learning

This tutorial shows you how to enhance your knowledge base with active learning. If you notice that customers are asking questions, which are not part of your knowledge base. There are often variations of questions that are paraphrased differently.

These variations when added as alternate questions to the relevant question answer pair, help to optimize the knowledge base to answer real world user queries. You can manually add alternate questions to question answer pairs through the editor. At the same time, you can also use the active learning feature to generate active learning suggestions based on user queries. The active learning feature, however, requires that the knowledge base receives regular user traffic to generate suggestions.

## Enable active learning

Active learning is turned on by default for question answering enabled resources.

To try out active learning suggestions, you can import the following file as a new project: [SampleActiveLearning.tsv](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/knowledge-bases/SampleActiveLearning.tsv).

## Download file

Run the following command from the command prompt to download a local copy of the `SampleActiveLearning.tsv` file.

```cmd
curl "https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/knowledge-bases/SampleActiveLearning.tsv" --output SampleActiveLearning.tsv
```

## Import file

From the edit knowledge base pane for your project, select the `...` (ellipsis) icon from the menu > **Import questions and answers** > **Import as TSV**. The select **Choose file** to browse to the copy of `SampleActiveLearning.tsv` that you downloaded to your computer in the previous step, and then select done.

> [!div class="mx-imgBorder"]
> [ ![Screenshot of edit knowledge base menu bar with import as TSV option displayed.]( ../media/active-learning/import-questions-and-answers.png) ]( ../media/active-learning/import-questions-and-answers.png#lightbox)

## View and add/reject active learning suggestions

Once the import of the test file is complete, active learning suggestions can be viewed on the review suggestions pane:

> [!div class="mx-imgBorder"]
> [ ![Screenshot with review suggestions page displayed.]( ../media/active-learning/review-suggestions.png) ]( ../media/active-learning/review-suggestions.png#lightbox)

We can now either accept these suggestions or reject them using the options on the menu bar to **Accept all suggestions** or **Reject all suggestions**.

Alternatively, to accept or reject individual suggestions, select the checkmark (accept) symbol or trash can (reject) symbol that appears next to individual questions in the **Review suggestions** page.

> [!div class="mx-imgBorder"]
> [ ![Screenshot with option to accept or reject highlighted in red.]( ../media/active-learning/accept-or-reject.png) ]( ../media/active-learning/accept-or-reject.png#lightbox)

## Add alternate questions

While active learning automatically suggests alternate questions based on the user queries hitting the knowledge base, we can also add variations of a question on the edit knowledge base page by selection **Add alternate phrase** to question answer pairs.

By adding alternate questions along with active learning, we further enrich the knowledge base with variations of a question that helps to provide consistent answers to user queries.

> [!NOTE]
> When alternate questions have many stop words, they might negatively impact the accuracy of responses. So, if the only difference between alternate questions is in the stop words, these alternate questions are not required.
> To examine the list of stop words consult the [stop words article](https://github.com/Azure-Samples/azure-search-sample-data/blob/master/STOPWORDS.md).

## Next steps

> [!div class="nextstepaction"]
> [Improve the quality of responses with synonyms](adding-synonyms.md)