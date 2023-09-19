---
title: "What are parallel documents? - Custom Translator"
titleSuffix: Azure AI services
description: Parallel documents are pairs of documents where one is the translation of the other. One document in the pair contains sentences in the source language and the other document contains these sentences translated into the target language.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator, I want to understand how to use parallel documents to build a custom translation model.
---

# What are parallel documents?

Parallel documents are pairs of documents where one is the translation of the
other. One document in the pair contains sentences in the source language and
the other document contains these sentences translated into the target language.
It doesn't matter which language is marked as "source" and which language is
marked as "target" – a parallel document can be used to train a translation
system in either direction.

## Requirements

You'll need a minimum of 10,000 unique aligned parallel sentences to train a system. This limitation is a safety net to ensure your parallel sentences contain enough unique vocabulary to successfully train a translation model. As a best practice, continuously add more parallel content and retrain to improve the quality of your translation system. For more information, *see* [Sentence Alignment](./sentence-alignment.md).

Microsoft requires that documents uploaded to the Custom Translator don't violate a third party's copyright or intellectual properties. For more information, please see the [Terms of Use](https://azure.microsoft.com/support/legal/cognitive-services-terms/). Uploading a document using the portal doesn't alter the ownership of the intellectual property in the document itself.

## Use of parallel documents

Parallel documents are used by the system:

1. To learn how words, phrases and sentences are commonly mapped between the
    two languages.

2.  To learn how to process the appropriate context depending on the surrounding
    phrases. A word may not always translate to the exact same word in the other
    language.

As a best practice, make sure that there's a 1:1 sentence correspondence between
the source and target language versions of the documents.

If your project is domain (category) specific, your documents should be
consistent in terminology within that category. The quality of the resulting
translation system depends on the number of sentences in your document set and
the quality of the sentences. The more examples your documents contain with
diverse usages for a word specific to your category, the better job the system
can do during translation.

Documents uploaded are private to each workspace and can be used in as many
projects or trainings as you like. Sentences extracted from your documents are
stored separately in your repository as plain Unicode text files and are
available for you to delete. Don't use the Custom Translator as a document
repository, you won't be able to download the documents you uploaded in the
format you uploaded them.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use a dictionary](dictionaries.md)
