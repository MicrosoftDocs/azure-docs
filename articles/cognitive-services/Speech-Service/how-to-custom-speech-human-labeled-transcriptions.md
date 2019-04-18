---
title: "Human-labeled transcriptions guidelines - Speech Services"
titlesuffix: Azure Cognitive Services
description: "If you're looking to improve recognition accuracy, especially issues that are caused when words are deleted or incorrectly substituted, you'll want to provide human-labeled transcriptions along with your audio data. What are human-labeled transcriptions? That's easy, they are word-by-word, verbatim transcriptions of an audio file."
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: erhopf
---

# How to create human-labeled transcriptions

If you're looking to improve recognition accuracy, especially issues that are caused when words are deleted or incorrectly substituted, you'll want to provide human-labeled transcriptions along with your audio data. What are human-labeled transcriptions? That's easy, they are word-by-word, verbatim transcriptions of an audio file.

A large sample of transcription data is required to improve recognition, we suggest providing between 10 and 1,000 hours of transcription data. On this page, we'll review guidelines designed to help you create high-quality transcriptions. This guide is broken up by locale, with sections for US English, Mandarin Chinese, and German.

## US English (en-US)

Human-labeled transcriptions for English audio must be provided as plain text, only using ASCII characters. Avoid the use of Latin-1 or Unicode punctuation characters. These characters are often inadvertently added when copying text from a word processing application or scraping data from web pages. If these characters are present, make sure to update them with the appropriate ASCII substitution.

Here are a few examples:

| Non-ASCII characters | Substitution | Notes |
|----------------------|--------------|-------|
| “Hello world” | "Hello world" | The opening and closing quotations marks have been substituted with appropriate ASCII characters. |
| John’s day | John's day | The apostrophe has been substituted with the appropriate ASCII character. |
| it was good&mdashno, it was great! | it was good--no, it was great! | The emdash was substituted with two hyphens. |

### Text normalization for US English

Text normalization is the transformation of words into a consistent format used when training a model. Some normalization rules are applied to text automatically, however, we recommend using these guidelines as you prepare your human-labeled transcription data:

* Write out abbreviations in words.
* Write out non-standard numeric strings in words (such as accounting terms).
* Non-alphabetic characters or mixed alphanumeric characters should be transcribed as pronounced.
* Abbreviations that are pronounced as words shouldn't be edited (such as "radar", "laser", "RAM", or "NATO").
* Write out abbreviations that are pronounced as separate letters with each letter separated by a spaces.

Here are a few examples of normalization that you should perform on the transcription:

| Original text | Text after normalization |
|---------------|--------------------------|
| Dr. Bruce Banner | Doctor Bruce Banner |
| James Bond, 007 | James Bond, double oh seven |
| Ke$ha | Kesha |
| How long is the 2x4 | How long is the two by four |
| The meeting goes from 1-3pm | The meeting goes from one to three pm |
| My blood type is O+ | My blood type is O positive |
| Water is H20 | Water is H 2 O |
| Play OU812 by Van Halen | Play O U 8 1 2 by Van Halen |
| UTF-8 with BOM | U T F 8 with BOM |

The following normalization rules are automatically applied to transcriptions:

* Use lowercase letters.
* Remove all punctuation except apostrophes within words.
* Expand numbers into words/spoken form, such as dollar amounts.

Here are a few examples of normalization automatically performed on the transcription:

| Original text | Text after normalization |
|---------------|--------------------------|
| "Holy cow!" said Batman. | holy cow said batman |
| "What?" said Batman's sidekick, Robin. | what said batman's sidekick robin |
| Go get -em! | go get em |
| I'm double-jointed | I'm double jointed |
| 104 Elm Street | one oh four Elm street |
| Tune to 102.7 | tune to one oh two seven |
| Pi is about 3.14 | pi is about three point one four |
It costs $3.14| it costs three fourteen |

## Mandarin Chinese (zh-cn)

## German (de-DE)

## Next Steps

* [Prepare and test your data](how-to-custom-speech-test-data.md)
* [Inspect your data](how-to-custom-speech-inspect-data.md)
* [Evaluate your data](how-to-custom-speech-evaluate-data.md)
* [Train your model](how-to-custom-speech-train-model.md)
* [Deploy your model](how-to-custom-speech-deploy-model.md)
