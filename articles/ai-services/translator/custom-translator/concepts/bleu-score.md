---
title: "What is a BLEU score? - Custom Translator"
titleSuffix: Azure AI services
description: BLEU is a measurement of the differences between machine translation and human-created reference translations of the same source sentence.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
ms.custom: cogserv-non-critical-translator
#Customer intent: As a Custom Translator user, I want to understand how BLEU score works so that I understand system test outcome better.
---

# What is a BLEU score?

[BLEU (Bilingual Evaluation Understudy)](https://en.wikipedia.org/wiki/BLEU) is a measurement of the difference between an automatic translation and human-created reference translations of the same source sentence.

## Scoring process

The BLEU algorithm compares consecutive phrases of the automatic translation
with the consecutive phrases it finds in the reference translation, and counts
the number of matches, in a weighted fashion. These matches are position
independent. A higher match degree indicates a higher degree of similarity with
the reference translation, and higher score. Intelligibility and grammatical correctness aren't taken into account.

## How BLEU works?

The BLEU score's strength is that it correlates well with human judgment. BLEU averages out
individual sentence judgment errors over a test corpus, rather than attempting
to devise the exact human judgment for every sentence.

A more extensive discussion of BLEU scores is [here](https://youtu.be/-UqDljMymMg).

BLEU results depend strongly on the breadth of your domain; consistency of
test, training and tuning data; and how much data you have
available for training. If your models have been trained on a narrow domain, and
your training data is consistent with your test data, you can expect a high
BLEU score.

>[!NOTE]
>A comparison between BLEU scores is only justifiable when BLEU results are compared with the same Test set, the same language pair, and the same MT engine. A BLEU score from a different test set is bound to be different.

## Next steps

> [!div class="nextstepaction"]
> [BLEU score evaluation](../how-to/test-your-model.md)
