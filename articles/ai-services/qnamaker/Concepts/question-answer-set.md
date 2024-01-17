---
title: Design knowledge base - QnA Maker concepts
description: Learn how to design a knowledge base - QnA Maker.
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: conceptual
manager: nitinme
ms.author: jboback
author: jboback
ms.date: 12/19/2023
---

# Question and answer pair concepts

A knowledge base consists of question and answer (QnA) pairs.  Each pair has one answer and a pair contains all the information associated with that _answer_. An answer can loosely resemble a database row or a data structure instance.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

## Question and answer pairs

The **required** settings in a question-and-answer (QnA) pair are:

* a **question** - text of user query, used to QnA Maker's machine-learning, to align with text of user's question with different wording but the same answer
* the **answer** - the pair's answer is the response that's returned when a user query is matched with the associated question

Each pair is represented by an **ID**.

The **optional** settings for a pair include:

* **Alternate forms of the question** - this helps QnA Maker return the correct answer for a wider variety of question phrasings
* **Metadata**: Metadata are tags associated with a QnA pair and are represented as key-value pairs. Metadata tags are used to filter QnA pairs and limit the set over which query matching is performed.
* **Multi-turn prompts**, used to continue a multi-turn conversation

![QnA Maker knowledge bases](../media/qnamaker-concepts-knowledgebase/knowledgebase.png)

## Editorially add to knowledge base

If you do not have pre-existing content to populate the knowledge base, you can add QnA pairs editorially in the QnA Maker portal. Learn how to update your knowledge base [here](../how-to/edit-knowledge-base.md).

## Editing your knowledge base locally

Once a knowledge base is created, it is recommended that you make edits to the knowledge base text in the [QnA Maker portal](https://qnamaker.ai), rather than exporting and reimporting through local files. However, there may be times that you need to edit a knowledge base locally.

Export the knowledge base from the **Settings** page, then edit the knowledge base with Microsoft Excel. If you choose to use another application to edit your exported file, the application may introduce syntax errors because it is not fully TSV compliant. Microsoft Excel's TSV files generally don't introduce any formatting errors.

Once you are done with your edits, reimport the TSV file from the **Settings** page. This will completely replace the current knowledge base with the imported knowledge base.

## Next steps

> [!div class="nextstepaction"]
> [Knowledge base lifecycle in QnA Maker](./development-lifecycle-knowledge-base.md)
