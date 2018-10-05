---
title: Sentence alignment in Custom Translator
titlesuffix: Azure Cognitive Services
description: How sentence alignment works in Custom Translator.
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: sentence alignment
Customer intent: As a custom translator user, I want to know how sentence alignment works, so that I can understand the underlying translation process better.
---

# Sentence alignment in parallel documents

During the training execution, sentences present in parallel documents are
paired or aligned. Custom Translator reports the number of sentences it was
able to pair as the Aligned Sentence Count in each of the data sets.

Custom Translator learns translations one sentence at a time, by reading a
sentence, the translation of this sentence. Then it aligns words and phrases
in these two sentences to each other. This process enables it to create a map of the
words and phrases in one sentence, to the equivalent words and phrases in the
translation of this sentence. Alignment tries to ensure that the system trains
on sentences that are translations of each other.

If you know you have parallel documents, you may override the
sentence alignment by supplying pre-aligned text files: You can extract all
sentences from both documents into text file, organized one sentence per line,
and upload with an “.align” extension. The “.align” extension signals Custom
Translator that it should skip sentence alignment.

For a training run to succeed, the table below shows the minimum \# of extracted
sentences and aligned sentences required in each data set. The
suggested minimum number of extracted sentences is much higher than the
suggested minimum number of aligned sentences to take into account the fact that
the sentence alignment may not be able to align all extracted sentences
successfully.

For best results, try to make sure that you have one sentence per line in your
files.  Do not have newline characters within a sentence as this will cause poor
alignments.

| Data set   | Suggested minimum extracted sentence count | Suggested minimum aligned sentence count | Maximum aligned sentence count |
|------------|--------------------------------------------|------------------------------------------|--------------------------------|
| Training   | 10,000                                     | 2,000                                    | No upper limit                 |
| Tuning     | 2,000                                      | 500                                      | 2,500                          |
| Testing    | 2,000                                      | 500                                      | 2,500                          |
| Dictionary | 0                                          | 0                                        | No upper limit                 |



## Next steps

- Read about [how to manage settings](#).