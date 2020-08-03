---
title: Artificial intelligence
description: LUIS uses artificial intelligence to provide language understanding to your data, based on the schema you defined.
ms.topic: conceptual
ms.date: 06/29/2020
---

# Artificial intelligence in Language Understanding (LUIS)

LUIS uses artificial intelligence to provide natural language understanding (NLU) to your data, based on the schema you defined.

## Natural language processing

Natural Language Understanding (NLU) is a specific subtopic of Natural Language Processing (NLP).

Natural language processing is a broader concept that handles any form of processing of textual data, this includes things like:

* Tokenization,
* Part of Speech (pos) Tagging
* Segmentation
* Morphological analysis
* Semantic similarity
* Discourse
* Translation

## Natural language processing in LUIS

Natural language processing is available to your LUIS app in the following ways:
* [Natural language understanding](#natural-language-understanding) (LUIS)
* Configurable NLP aspects in LUIS:
    * [Tokenization](luis-language-support.md#tokenization)
    * Morphology through diacritics, punctuation, and word forms [API settings](luis-reference-application-settings.md)
* Pre- or post-processing of the query utterance provided by other [Cognitive Services](../Welcome.md) such as:
    * [Translation](../translator/translator-info-overview.md)

## Natural language understanding

NLU is the ability to _transform_ a linguistic statement to a representation that enables you to understand your users naturally. Natural language understanding remains a very challenging problem and is defined as an _AI-hard_ problem.

LUIS is intended to focus on intention and extraction, this includes being able to identify:
* What the user wants
* What they are talking about.

LUIS has little or no knowledge of the broader _NLP_ aspects, such as semantic similarity, without explicit identification in examples. For example, the following tokens (words) are three different things until they are used in similar contexts in the examples provided:

* buy
* buying
* bought

## Next steps

* Learn about the [development lifecycle](luis-concept-app-iteration.md) for a LUIS app