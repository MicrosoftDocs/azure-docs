---
title: Speech To Text overview on Azure | Microsoft Docs
description:Custom Speech to Text is a cloud-based service that enables users to customize speech models for speech-to-text transcription.
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: custom-speech-service
ms.topic: article
ms.date: 04/04/2018
ms.author: panosper
---

# Custom Speech to Text

Welcome to Microsoft's Custom Speech to Text service part of the Microsoft Unified Speech. Custom Speech to Text is a cloud-based service that provides users with the ability to customize speech models for Speech-to-Text transcription.
To useCustom Speech to Text refer to the [Custom Speech to Text Portal](https://cris.ai)

## What is Custom Speech to Text
The Custom Speech to Text enables you to create customized language models and acoustic models tailored to your application and your users. By uploading your specific speech and/or text data toCustom Speech to Text, you can create custom models that can be used in conjunction with Microsoft’s existing state-of-the-art speech models.

For example, if you’re adding voice interaction to a mobile phone, tablet or PC app, you can create a custom language model that can be combined with Microsoft’s acoustic model to create a speech-to-text endpoint designed especially for your app. If your application is designed for use in a particular environment or by a particular user population, you can also create and deploy a custom acoustic model with this service.


## How do speech recognition systems work?
Speech recognition systems are composed of several components that work together. Two of the most important components are the acoustic model and the language model.

The acoustic model is a classifier that labels short fragments of audio into one of a number of phonemes, or sound units, in a given language. For example, the word “speech” is comprised of four phonemes “s p iy ch”. These classifications are made on the order of 100 times per second.

The language model is a probability distribution over sequences of words. The language model helps the system decide among sequences of words that sound similar, based on the likelihood of the word sequences themselves. For example, “recognize speech” and “wreck a nice beach” sound alike but the first hypothesis is far more likely to occur, and therefore will be assigned a higher score by the language model.

Both the acoustic and language models are statistical models learned from training data. As a result, they perform best when the speech they encounter when used in applications is similar to the data observed during training. The acoustic and language models in the Microsoft Speech-To-Text engine have been trained on an enormous collection of speech and text and provide state-of-the-art performance for the most common usage scenarios, such as interacting with Cortana on your smart phone, tablet or PC, searching the web by voice or dictating text messages to a friend.

## Why useCustom Speech to Text
While the Microsoft Speech-To-Text engine is world-class, it is targeted toward the scenarios described above. However, if you expect voice queries to your application to contain particular vocabulary items, such as product names or jargon that rarely occur in typical speech, it is likely that you can obtain improved performance by customizing the language model.

For example, if you were building an app to search MSDN by voice, it’s likely that terms like “object-oriented” or “namespace” or “dot net” will appear more frequently than in typical voice applications. Customizing the language model will enable the system to learn this.

For more details about how to useCustom Speech to Text, refer to the [Custom Speech to Text Portal] (https://cris.ai).

* [Get Started](cognitive-services-custom-speech-get-started.md)
* [FAQ](cognitive-services-custom-speech-faq.md)
* [Glossary](cognitive-services-custom-speech-glossary.md)
