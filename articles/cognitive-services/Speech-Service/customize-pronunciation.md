---
title: Create phonetic pronunciation data
description: Use phonemes to customize pronunciation of words in Speech-to-Text.
author: ut-karsh
ms.author: umaheshwari
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 03/01/2022
ms.custom: template-concept, ignite-fall-2021
---

# Create phonetic pronunciation data

Custom speech allows you to provide different pronunciations for specific words using the Universal Phone Set. The Universal Phone Set (UPS) is a machine-readable phone set that is based on the International Phonetic Set Alphabet (IPA). The IPA is used by linguists world-wide and is accepted as a standard.

UPS pronunciations consist of a string of UPS phones, each separated by whitespace. The phone set is case-sensitive. UPS phone labels are all defined using ASCII character strings.

For steps on implementing UPS, see [Structured text data for training phone sets](how-to-custom-speech-test-and-train.md#structured-text-data-for-training-public-preview). Structured text data is not the same as [pronunciation files](how-to-custom-speech-test-and-train.md#pronunciation-data-for-training), and they cannot be used together.

See the sections in this article for the Universal Phone Set for each locale.

## en-US
[!INCLUDE [en-US](./includes/phonetic-sets/speech-to-text/en-us.md)]

## Next steps

- [Upload your data](how-to-custom-speech-upload-data.md)
- [Inspect your data](how-to-custom-speech-inspect-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
