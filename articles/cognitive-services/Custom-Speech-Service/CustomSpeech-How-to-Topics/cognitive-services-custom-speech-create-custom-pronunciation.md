---
title: Use custom pronunciation with Custom Speech Service on Azure| Microsoft Docs
description: Learn how to create a language model with the Custom Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: custom-speech-service
ms.topic: article
ms.date: 05/07/2017
ms.author: panosper
---

# Enabling custom pronunciation
Custom pronunciation enables users to define the phonetic form and display for of a word or term. It is intended to enrich the experience of handling custom terms such as product names or acronyms. A pronunciation file is used during language modelling.

Pronunciation is described by users using .txt files. In a single .txt file a user can enter several custom pronunciation entries. The pronunciation file is a .txt file. The structure is as follows:

```
Display form <Tab> Spoken Form <Newline>
```

*Examples*:

| Display form | Spoken form |
|----------|-------|
| C3PO | see three pea o |
| BB8 | bee bee eight |
| L8R | late are |
| CNTK | see n tea k|

## Spoken form
Spoken form must be lower case which can be forced during the import. In addition, we need checks in the data importer. For sure, no tab in the Display Form and Spoken Form is permitted but there might be more forbidden characters such as ~, ^... in the display form
Each .txt file can have several such entries. The picture below shows such as .txt file

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-pronunciation-file.png)

## Display form
A display form can be only a custom word, term, acronym or even compound words which are a combination of existing words. We want to avoid having customers changing the pronunciation of baseline. We will allow users to enter alternative pronunciations for common words. Some customers might misuse this feature by badly reformulating common words, or by making mistakes in the spoken form but we expect most customers will use this feature correctly. The correct usage would be the customer to run the decoder, see that some unusual words (abbreviations, technical words, foreign words...) are not correctly decoded and then add them to the custom pronunciation file.

The spoken form is the phonetic sequence of the display form. It is formulated by the user using letters, words or syllables. Currently we do not have a standard of proposing to express this and guide the user in formulating the spoken form. We will provide plenty of sample to reuse. The size of the .txt file containing the pronunciation entries, is significantly limited in relation to the other data assets. We are not expecting the user to upload large amounts of data through this file. We have therefore set a limit to 1MB although we expect a lot files to be a few KBs, some maybe even less.

## Next steps
* Try to create your [custom acoustic model](cognitive-services-custom-speech-create-acoustic-model.md) to improve recognition accuracy
* [Create a custom speech-to-text endpoint](cognitive-services-custom-speech-create-endpoint.md) which you can use from app
