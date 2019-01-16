---
title: Glossary of terms for the Custom Speech Service on Azure | Microsoft Docs
description: Terminology in the glossary defines terms that you'll encounter as you work with the Custom Speech Service.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 02/08/2017
ms.author: panosper
---

# Glossary

[!INCLUDE [Deprecation note](../../../includes/cognitive-services-custom-speech-deprecation-note.md)]

## A

### Acoustic Model

The acoustic model is a classifier that labels short fragments of audio into one of a number of phonemes, or sound units, in a given language. For example, the word “speech” is comprised of four phonemes “s p iy ch”. These classifications are made on the order of 100 times per second

## B

## C

### Conversational Model

A model appropriate for recognizing speech spoken in a conversational style. The Microsoft Conversational AM is adapted for speech typically directed at another person.

## D

### Deployment

The process through which the adapted custom model becomes a service and exposes a URI

## E

## F

## G

## H

## I

### Inverse text normalization

The process of converting “raw” unformatted text back to formatted text, i.e. with capitalization and punctuation, is called inverse text normalization (ITN).

## J

## K

## L

### Language Model

The language model is a probability distribution over sequences of words. The language model helps the system decide among sequences of words that sound similar, based on the likelihood of the word sequences themselves

## M

## N

### Normalization

Normalization (Text) : Transformation of resulting text (i.e. transcription) into a standard, unambiguous form readable by the system.

## O

## P

## Q

## R

## S

### Search and Dictate Model

An acoustic model appropriate for processing commands. The Microsoft Search and Dictation AM is appropriate for speech directed at an application or device, such as such as commands

### Subscription key

Subscription key is a string that you need to specify as a query string parameter in order to invoke any Custom Speech Service model. A subscription key is obtained from [Azure Portal](https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/CustomSpeech) and once obtained it can be found in "My Subscriptions" in the Custom Speech Service portal.

## T

### Transcription

Transcription: The piece of text that results from the process of a piece of audio .wav file

## U

## V

## W

## X

## Y

## Z

* [Overview](cognitive-services-custom-speech-home.md)
* [Get Started](cognitive-services-custom-speech-get-started.md)
* [FAQ](cognitive-services-custom-speech-faq.md)
