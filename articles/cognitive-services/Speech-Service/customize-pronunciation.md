---
title: Customize pronunciation
description: Use phonemes to customize pronunciation of words in Speech-to-Text.
author: ut-karsh
ms.author: umaheshwari
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 10/19/2021
ms.custom: template-concept, ignite-fall-2021
---

# Customize pronunciation

Custom speech allows you to provide different pronunciations for specific words using the Universal Phone Set. The Universal Phone Set (UPS) is a machine-readable phone set that is based on the International Phonetic Set Alphabet (IPA). The IPA is used by linguists world-wide and is accepted as a standard.

UPS pronunciations consist of a string of UPS phones, each separated by whitespace. The phone set is case-sensitive. UPS phone labels are all defined using ASCII character strings.

For steps on implementing UPS, see [Structured text data for training phone sets](how-to-custom-speech-test-and-train.md#structured-text-data-for-training-public-preview)

This structured text data is not the same as [pronunciation files](how-to-custom-speech-test-and-train.md#pronunciation-data-for-training), and they cannot be used together.

## Languages Supported

Use the table below to navigate to the UPS for the respective language.

| Language                | Locale  |
|-------------------------|---------|
| [English (United States)](phone-sets.md) | `en-US` |


## Next steps

* [Provide UPS pronunciation to Custom Speech](how-to-custom-speech-test-and-train.md#structured-text-data-for-training-public-preview)
