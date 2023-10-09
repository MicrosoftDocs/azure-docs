---
title: Structured text phonetic pronunciation data
description: Use phonemes to customize pronunciation of words in Speech to text.
author: ut-karsh
ms.author: umaheshwari
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 05/08/2022
ms.custom: template-concept, ignite-fall-2021
---

# Structured text phonetic pronunciation data

You can specify the phonetic pronunciation of words using the Universal Phone Set (UPS) in a [structured text data](how-to-custom-speech-test-and-train.md#structured-text-data-for-training) file. The UPS is a machine-readable phone set that is based on the International Phonetic Set Alphabet (IPA). The IPA is a standard used by linguists world-wide.

UPS pronunciations consist of a string of UPS phonemes, each separated by whitespace. UPS phoneme labels are all defined using ASCII character strings.

For steps on implementing UPS, see [Structured text phonetic pronunciation](how-to-custom-speech-test-and-train.md#structured-text-data-for-training). Structured text phonetic pronunciation data is separate from [pronunciation data](how-to-custom-speech-test-and-train.md#pronunciation-data-for-training), and they cannot be used together. The first one is "sounds-like" or spoken-form data, and is input as a separate file, and trains the model what the spoken form sounds like 

 [Structured text phonetic pronunciation data](how-to-custom-speech-test-and-train.md#structured-text-data-for-training) is specified per syllable in a markdown file. Separately, [pronunciation data](how-to-custom-speech-test-and-train.md#pronunciation-data-for-training) it input on its own, and trains the model what the spoken form sounds like. You can either use a pronunciation data file on its own, or you can add pronunciation within a structured text data file. The Speech service doesn't support training a model with both of those datasets as input.

See the sections in this article for the Universal Phone Set for each locale.

## :::no-loc text="en-US":::

[!INCLUDE [en-US](./includes/phonetic-sets/speech-to-text/en-us.md)]

## Next steps

- [Upload your data](how-to-custom-speech-upload-data.md)
- [Test recognition quality](how-to-custom-speech-inspect-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
