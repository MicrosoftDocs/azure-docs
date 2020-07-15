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

* Tutorial: How to [create a custom keyword using Speech Studio](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-devices-sdk-create-kws)
* Tutorial: How to [voice-activate your product with the Speech SDK, using C#](tutorial-voice-enable-your-bot-speech-sdk.md)
* Quickstart: [Recognize keywords with the Speech SDK, on Universal Windows Platform using C#](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/csharp/uwp/keyword-recognizer)
* Quickstart: [Recognize keywords with the Speech SDK, on Android using Java](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/android/keyword-recognizer)

## Next steps

* [Get a Speech service subscription key for free](get-started.md)
* [Get the Speech SDK](speech-sdk.md)
* [Learn more about Voice Assistants](voice-assistants.md)
