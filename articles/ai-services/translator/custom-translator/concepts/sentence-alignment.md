---
title: "Sentence pairing and alignment - Custom Translator"
titleSuffix: Azure AI services
description: During the training execution, sentences present in parallel documents are paired or aligned. Custom Translator learns translations one sentence at a time, by reading a sentence and translating it. Then it aligns words and phrases in these two sentences to each other.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: conceptual
ms.custom: cogserv-non-critical-translator
#Customer intent: As a Custom Translator user, I want to know how sentence alignment works, so that I can have better understanding of underlying process of sentence extraction, pairing, filtering, aligning.
---

# Sentence pairing and alignment in parallel documents

After documents are uploaded, sentences present in parallel documents are
paired or aligned. Custom Translator reports the number of sentences it was
able to pair as the Aligned Sentences in each of the data sets.

## Pairing and alignment process

Custom Translator learns translations of sentences one sentence at a time. It reads a sentence from the source text, and then the translation of this sentence from the target text. Then it aligns words and phrases in these two sentences to each other. This process enables it to create a map of the words and phrases in one sentence to the equivalent words and phrases in the translation of the sentence. Alignment tries to ensure that the system trains on sentences that are translations of each other.

## Pre-aligned documents

If you know you have parallel documents, you may override the
sentence alignment by supplying pre-aligned text files. You can extract all
sentences from both documents into text file, organized one sentence per line,
and upload with an `.align` extension. The `.align` extension signals Custom
Translator that it should skip sentence alignment.

For best results, try to make sure that you have one sentence per line in your
 files. Don't have newline characters within a sentence, it will cause poor
alignments.

## Suggested minimum number of sentences

For a training to succeed, the table below shows the minimum number of sentences required in each document type. This limitation is a safety net to ensure your parallel sentences contain enough unique vocabulary to successfully train a translation model. The general guideline is having more in-domain parallel sentences of human translation quality should produce higher-quality models.

| Document type   | Suggested minimum sentence count | Maximum sentence count |
|------------|--------------------------------------------|--------------------------------|
| Training   | 10,000                                     | No upper limit                 |
| Tuning     | 500                                      | 2,500       |
| Testing    | 500                                      | 2,500  |
| Dictionary | 0                                          | 250,000                 |

> [!NOTE]
>
> - Training will not start and will fail if the 10,000 minimum sentence count for Training is not met.
> - Tuning and Testing are optional. If you do not provide them, the system will remove an appropriate percentage from Training to use for validation and testing.
> - You can train a model using only dictionary data. Please refer to [What is Dictionary](dictionaries.md).
> - If your dictionary contains more than 250,000 sentences, our Document Translation feature is a better choice. Please refer to [Document Translation](../../document-translation/overview.md).
> - Free (F0) subscription training has a maximum limit of 2,000,000 characters.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to use a dictionary](dictionaries.md)
