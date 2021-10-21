---
title: "Customize pronunciation" #Required; page title is displayed in search results. Include the brand.
description: Use phonemes to customize pronunciation of words in Speech-to-Text. #Required; article description that is displayed in search results. 
author: ut-karsh #Required; your GitHub user alias, with correct capitalization.
ms.author: umaheshwari #Required; microsoft alias of author; optional team alias.
ms.service: cognitive-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 10/19/2021 #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Customize pronunciation

Custom speech allows you to provide different pronunciations for specific words using the Universal Phone Set. The Universal Phone Set (UPS) is a machine-readable phone set that is based on the International Phonetic Set Alphabet (IPA). The IPA is used by linguists world-wide and is accepted as a standard.

UPS pronunciations consist of a string of UPS phones, each separated by whitespace. The phone set is case-sensitive. UPS phone labels are all defined using ASCII character strings.

For steps on implementing UPS, click [here.](how-to-custom-speech-test-and-train.md#structured-text-data-for-training-public-preview)

This structured text data is not the same as [pronunciation files](how-to-custom-speech-test-and-train.md#pronunciation-data-for-training), and they cannot be used together.

## Languages Supported

Use the table below to navigate to the UPS for the respective language.

| Language                | Locale  |
|-------------------------|---------|
| [English (United States)](phone-sets.md) | `en-US` |


## Next steps

* [Provide UPS pronunciation to Custom Speech](how-to-custom-speech-test-and-train.md#structured-text-data-for-training-public-preview)