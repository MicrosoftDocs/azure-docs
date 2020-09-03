---
title: Custom Keywords - Speech service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for custom keywords using the Speech Software Development Kit (SDK).
services: cognitive-services
author: hasyashah
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/06/2020
ms.author: hasshah
ms.custom: devx-track-csharp
---

# What is a keyword?

A keyword is a word or short phrase which allows your product to be voice activated. For example, "Hey Cortana" is the keyword for the Cortana assistant. Voice activation allows your users to start interacting with your product completely hands-free by simply speaking the keyword. As your product continuously listens for the keyword, all audio is processed locally on the user's device until a detection occurs to ensure their data stays as private as possible.

## Core features of Custom Keyword

With Custom Keyword's customization, performance, and integration features, you can tailor voice activation to best suit your product's vision and users' needs.

| Feature | Description |
|----------|----------|
| Keyword customization | As an extension of your brand, a keyword reinforces the equity you've built with your customers. The Custom Keyword portal on Speech Studio allows you to specify any word or short phrase that best represents your brand. You can further personalize your keyword by choosing the right pronunciations, which will be honored by the keyword model generated.
| Keyword verification | When there's high confidence in the keyword being detected locally, audio is sent to the cloud for further verification that a user said the keyword. Keyword verification provides an additional layer of security by reducing the impact of an incorrect local detection and protecting user privacy.
| Voice assistant & Speech SDK integration | Keywords generated from the Custom Keyword on Speech Studio can be easily integrated within your device or application via the Speech SDK. Simply point the SDK to the keyword model provided by Speech Studio and your product will be voice activated, backed by keyword verification. You can complete your product's voice experiences by building your own [voice assistant](voice-assistants.md).

## Get started with custom keywords

* See [custom keyword basics](custom-keyword-basics.md) for basic usage and design patterns.
* How to [voice-activate your product with the Speech SDK, using C#](tutorial-voice-enable-your-bot-speech-sdk.md)

## Choose an effective keyword

Creating an effective keyword is vital to ensuring your device will consistently and accurately respond. Customizing your keyword is an effective way to differentiate your device and strengthen your branding. Consider the following guidelines when you choose a keyword:

> [!div class="checklist"]
> * Your keyword should be an English word or phrase.
> * It should take no longer than two seconds to say.
> * Words of 4 to 7 syllables work best. For example, "Hey, Computer" is a good keyword. Just "Hey" is a poor one.
> * Keywords should follow common English pronunciation rules.
> * A unique or even a made-up word that follows common English pronunciation rules might reduce false positives. For example, "computerama" might be a good keyword.
> * Do not choose a common word. For example, "eat" and "go" are words that people say frequently in ordinary conversation. They might be false triggers for your device.
> * Avoid using a keyword that might have alternative pronunciations. Users would have to know the "right" pronunciation to get their device to respond. For example, "509" can be pronounced "five zero nine," "five oh nine," or "five hundred and nine." "R.E.I." can be pronounced "r-e-i" or "ray." "Live" can be pronounced "/līv/" or "/liv/".
> * Do not use special characters, symbols, or digits. For example, "Go#" and "20 + cats" could be problematic keywords. However, "go sharp" or "twenty plus cats" might work. You can still use the symbols in your branding and use marketing and documentation to reinforce the proper pronunciation.

> [!NOTE]
> If you choose a trademarked word as your keyword, be sure that you own that trademark or that you have permission from the trademark owner to use the word. Microsoft is not liable for any legal issues that might arise from your choice of keyword.

## See samples on GitHub

* [Recognize keywords with the Speech SDK, on Universal Windows Platform using C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/csharp/uwp/keyword-recognizer)
* [Recognize keywords with the Speech SDK, on Android using Java](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/android/keyword-recognizer)

## Next steps

* [Get a Speech service subscription key for free](get-started.md)
* [Get the Speech SDK](speech-sdk.md)
* [Learn more about Voice Assistants](voice-assistants.md)
