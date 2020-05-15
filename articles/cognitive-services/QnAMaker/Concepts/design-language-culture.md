---
title: Design for language - QnA Maker
description: The QnA Maker resource and all the knowledge bases inside that resource support a single language. The single language is necessary to provide the best answer results for a query.
ms.topic: conceptual
ms.date: 01/27/2020
---

# Design knowledge base for content language

The QnA Maker resource, and all the knowledge bases inside that resource, support a single language. The single language is necessary to provide the best answer results for a query.

## Single language per resource

QnA Maker considerations for language support:

* A QnA Maker service, and all its knowledge bases, support one language only.
* The language is explicitly set when the first knowledge base of the service is created
* The language is determined from the files and URLs added when the knowledge base is created
* The language can't be changed for any other knowledge bases in the service
* The language is used by the Cognitive Search service (ranker #1) and the QnA Maker service (ranker #2) to generate the best answer to a query

## Supporting multiple languages

If you need to support a knowledge base system, which includes several languages, you can choose one of the following methods:

* Use the [Translation Text service](../../translator/translator-info-overview.md) to translate a question into a single language before sending the question to your knowledge base. This allows you to focus on the quality of a single language and the quality of the alternate questions and answers.
* Create a QnA Maker resource, and a knowledge base inside that resource, for every language. This allows you to manage separate alternate questions and answer text that is more nuanced for each language. This gives you much more flexibility but requires a much higher maintenance cost when the questions or answers change across all languages.

Review [languages supported](../overview/language-support.md) for QnA Maker.

### Support each language with a QnA Maker resource

* Create a QnA Maker resource for every language
* Only add files and URLs for that language
* Use a naming convention for the resource to identify the language. An example is `qna-maker-fr` for all knowledge bases for french documents

## Next steps

Learn [concepts](query-knowledge-base.md) about how to query the knowledge base for an answer.