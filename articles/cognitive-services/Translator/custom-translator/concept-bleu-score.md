---
title: What is BLEU score - Custom Translator
titlesuffix: Azure Cognitive Services
description: What is BLEU score - Custom Translator
services: cognitive-services
author: rajdeep-in
manager: Chris.Wendt

ms.service: cognitive-services
ms.component: custom-translator
ms.topic: overview
ms.date: 10/03/2018
ms.author: v-rada
Customer intent: As a custom translator user, I want to understand how BLEU score works so that I understand system test outcome better.
---

# What is BLEU score?

BLEU is a measurement of the differences between an automatic translation and
one or more human-created reference translations of the same source sentence.
The BLEU algorithm compares consecutive phrases of the automatic translation
with the consecutive phrases it finds in the reference translation, and counts
the number of matches, in a weighted fashion. These matches are position
independent. A higher match degree indicates a higher degree of similarity with
the reference translation. Intelligibility and grammatical correctness are not
taken into account.

BLEU’s strength is that it correlates well with human judgment by averaging out
individual sentence judgment errors over a test corpus, rather than attempting
to devise the exact human judgment for every sentence.

A more extensive discussion of BLEU scores is [here](https://youtu.be/-UqDljMymMg).

BLEU results depend strongly on the breadth of your domain, the consistency of
the test data with the training and tuning data, and how much data you have
available to train. If your models have been trained on a narrow domain, and
your training data is consistent with your test data, you can expect a high
BLEU score. 

>Note: a comparison between BLEU scores is only
justifiable when BLEU results are compared with the same Test set, the same
language pair, and the same MT engine. A BLEU score from a different test set is
bound to be different.
