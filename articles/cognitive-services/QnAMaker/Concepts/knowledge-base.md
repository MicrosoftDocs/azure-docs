---
title: Knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: A QnA Maker knowledge base consists of a set of question/answer (QnA) pairs and optional metadata associated with each QnA pair.
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---

# Knowledge base

A QnA Maker knowledge base consists of a set of question/answer (QnA) pairs and optional metadata associated with each QnA pair.

## Key knowledge base concepts

* **Questions** - A question contains text that best represents a user query. 
* **Answers** - An answer is the response that is returned when a user query is matched with the associated question.  
* **Metadata** - Metadata are tags associated with a QnA pair and are represented as key-value pairs. Metadata are used to filter QnA pairs and limit the set over which query matching is performed.

A single QnA, represented by a numeric QnA ID, has multiple variants of a question (alternate questions) that all map to a single answer. Additionally, each such pair can have multiple metadata fields associated with it.

![QnA Maker knowledge bases](../media/qnamaker-concepts-knowledgebase/knowledgebase.png) 

## Knowledge base content format

When you ingest rich content into a knowledge base, QnA Maker attempts to convert the content to markdown. Read [this](https://aka.ms/qnamaker-docs-markdown-support) blog to understand the markdown formats understandable by most chat clients.

Metadata fields consist of key-value pairs separated by a colon **(Product:Shredder)**. Both key and value must be text-only. The metadata key must not contain any spaces.

## Next steps

> [!div class="nextstepaction"]
> [Development lifecycle of a knowledge base](./development-lifecycle-knowledge-base.md)

## See also

[QnA Maker overview](../Overview/overview.md)