---
title: Sentence pairing and alignment - Custom Translator
titleSuffix: Azure Cognitive Services
description: During the training execution, sentences present in parallel documents are paired or aligned. Custom Translator learns translations one sentence at a time, by reading a sentence, the translation of this sentence. Then it aligns words and phrases in these two sentences to each other.
author: swmachan
manager: christw
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 02/21/2019
ms.author: swmachan
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to know how sentence alignment works, so that I can have better understanding of underlying process of sentence extraction, pairing, filtering, aligning.
---

# Sentence pairing and alignment in parallel documents

During the training, sentences present in parallel documents are
paired or aligned. Custom Translator reports the number of sentences it was
able to pair as the Aligned Sentences in each of the data sets.

## Pairing and alignment process

Custom Translator learns translations of sentences one sentence at a time. It readings a
sentence from source, and then the translation of this sentence from target. Then it aligns words and phrases
in these two sentences to each other. This process enables it to create a map of the
words and phrases in one sentence to the equivalent words and phrases in the
translation of this sentence. Alignment tries to ensure that the system trains
on sentences that are translations of each other.

## Pre-aligned documents

If you know you have parallel documents, you may override the
sentence alignment by supplying pre-aligned text files. You can extract all
sentences from both documents into text file, organized one sentence per line,
and upload with an `.align` extension. The `.align` extension signals Custom
Translator that it should skip sentence alignment.

For best results, try to make sure that you have one sentence per line in your
files. Don't have newline characters within a sentence as this will cause poor
alignments.

## Suggested minimum number of extracted and aligned sentences

For a training to succeed, the table below shows the minimum number of extracted
sentences and aligned sentences required in each data set. The
suggested minimum number of extracted sentences is much higher than the
suggested minimum number of aligned sentences to take into account the fact that
the sentence alignment may not be able to align all extracted sentences
successfully.

| Data set   | Suggested minimum extracted sentence count | Suggested minimum aligned sentence count | Maximum aligned sentence count |
|------------|--------------------------------------------|------------------------------------------|--------------------------------|
| Training   | 10,000                                     | 2,000                                    | No upper limit                 |
| Tuning     | 2,000                                      | 500                                      | 2,500                          |
| Testing    | 2,000                                      | 500                                      | 2,500                          |
| Dictionary | 0                                          | 0                                        | No upper limit                 |

## Next steps

- Learn how to use a [dictionary](what-is-dictionary.md) in Custom Translator.
