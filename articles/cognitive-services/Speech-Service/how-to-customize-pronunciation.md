---
title: Azure Cognitive Services Speech Service
description: Learn how to customize pronunciation with the Speech Service Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 07/02/2018
ms.author: panosper
---

# Enable custom pronunciation
Custom pronunciation enables users to define the phonetic form and display of a word or term. It is useful for handling customized terms, such as product names or acronyms. All you need is a pronunciation file (a simple .txt file).

Here's how it works. In a single .txt file, you can enter several custom pronunciation entries. The structure is as follows:

```
Display form <Tab> Spoken form <Newline>
```

*Examples*:

| Display form | Spoken form |
|----------|-------|
| C3PO | see three pea o |
| L8R | late are |
| CNTK | see n tea k|

## Requirements for the spoken form
The spoken form must be lowercase, which can be forced during the import. In addition, you must provide checks in the data importer. No tab in either the spoken form or the display form is permitted. There might, however, be more forbidden characters in the display form (for example, ~ and ^).

Each .txt file can have several entries. For example, see the following screenshot:

![Screenshot of Notepad with several entries for acronym pronunciation](media/stt/custom-speech-pronunciation-file.png)

The spoken form is the phonetic sequence of the display form. It is composed of letters, words, or syllables. Currently, there is no further guidance or set of standards to help you formulate the spoken form. 

## Supported pronunciation characters
Custom Pronunciation is currently supported for English (en-US) and German (de-de). The character set that can be used to express the spoken form of a term (in the custom pronunciation file) is shown in the following table: 

| Language | Characters |
|----------	|----------|
| English (en-US) | a, b, c, d, e, f, g, h, i, j, k, l, o, p, q, r, s, t, u, v, w, x, y, z |
| German (de-de) | ä, ö, ü, ẞ, a, b, c, d, e, f, g, h, i, j, k, l, o, p, q, r, s, t, u, v, w, x, y, z |

> [!NOTE]
> A term's display form (in a pronunciation file) should be written the same way in a language adaptation data set.

## Requirements for the display form
A display form can only be a custom word, term, acronym, or compound words that combine existing words. You can also enter alternative pronunciations for common words. 

>[!NOTE]
>We do not recommend using this feature to reformulate common words or to modify the spoken form. It is better to run the decoder to see if some unusual words (such as abbreviations, technical words, and foreign words) are not correctly decoded. If they are, add them to the custom pronunciation file. In the Language Model, you should always and only use the display form of a word. 

## Requirements for the file size
The size of the .txt file containing the pronunciation entries is limited to 1 MB. Typically, you do not need to upload large amounts of data through this file. Most custom pronunciation files are likely to be just a few KBs in size. The encoding of the .txt file for all locales should be UTF-8 BOM. For the English locale, ANSI is also acceptable.

## Next steps
* Improve recognition accuracy by creating a [custom acoustic model](how-to-customize-acoustic-models.md)
* Improve recognition accuracy by creating a [custom language model](how-to-customize-language-model.md)
