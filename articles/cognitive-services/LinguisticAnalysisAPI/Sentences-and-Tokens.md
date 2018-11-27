---
title: Sentences and tokens - Linguistic Analysis API
titlesuffix: Azure Cognitive Services
description: Learn about sentence separation and tokenization in the Linguistic Analysis API.
services: cognitive-services
author: DavidLiCIG
manager: cgronlun
ms.service: cognitive-services
ms.component: linguistic-analysis
ms.topic: conceptual
ms.date: 03/21/2016
ms.author: davl
ROBOTS: NOINDEX
---

# Sentence Separation and Tokenization

> [!IMPORTANT]
> The Linguistic Analysis preview was decommissioned on August 9, 2018. We recommend using [Azure Machine Learning text analytics modules](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/text-analytics) for text processing and analysis.

## Background and motivation

Given a body of text, the first step of linguistic analysis is to break it into sentences and tokens.

### Sentence Separation

On first glance, it seems that breaking text into sentences is simple: just find the end-of-sentence markers and break sentences there.
However, these marks are often complicated and ambiguous.

Consider the following example text:

> What did you say?!? I didn't hear about the director's "new proposal." It's important to Mr. and Mrs. Smith.

This text contains three sentences:

- What did you say?!?
- I didn't hear about the director's "new proposal."
- It's important to Mr. and Mrs. Smith.

Note how the ends of sentences are marked in very different ways.
The first ends in a combination of question marks and exclamation points (sometimes called an interrobang).
The second ends with a period or full stop, but the following quotation mark should be pulled into the prior sentence.
In the third sentence, you can see how that same period character can be used to mark abbreviations as well.
Looking just at punctuation provides a good candidate set, but further work is required to identify the true sentence boundaries.

### Tokenization

The next task is to break these sentences into tokens.
For the most part, English tokens are delimited by white space.
(Finding tokens or words is much easier in English than in Chinese, where spaces are mostly not used between words.
The first sentence might be written as "Whatdidyousay?")

There are a few difficult cases.
First, punctuation often (but not always) should be split away from it surrounding context.
Second, English has *contractions*, like "didn't" or "it's", where words have been compressed and abbreviated into smaller pieces.
The goal of the tokenizer is to break the character sequence into words.

Let's return to the example sentences from above.
Now we've placed a "center dot" (&middot;) between each distinct token.

- What &middot; did &middot; you &middot; say &middot; ?!?
- I &middot; did &middot; n't &middot; hear &middot; about &middot; the &middot; director &middot; 's &middot; " &middot; new &middot; proposal &middot; . &middot; "
- It &middot; 's &middot; important &middot; to &middot; Mr. &middot; and &middot; Mrs. &middot; Smith &middot; .

Note how most tokens are words you'd find in the dictionary (for example, *important*, *director*).
Others solely consist of punctuation.
Finally, there are more unusual tokens to represent contractions like *n't* for *not*, and possessives like *'s*.
This tokenization allows us to handle the word *didn't* and the phrase *did not* in a more consistent way.

## Specification

It is important to make consistent decisions about what comprises a sentence and a token.
We rely on the specification from the [Penn Treebank](https://catalog.ldc.upenn.edu/ldc99t42) (some additional details are available at ftp://ftp.cis.upenn.edu/pub/treebank/public_html/tokenization.html).
