---
title: About Text to Speech | Microsoft Docs
description: An overview of the capabilities of Text to Speech.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: v-jerkin
---
# About the Text to Speech API

The **Text to Speech** (TTS) API of the Speech service converts input text into natural-sounding speech (also called *speech synthesis*).

To generate speech, your application sends HTTP POST requests to the Speech service. There, text is synthesized into human-sounding speech and returned as an audio file. A variety of voices and languages are supported.

Scenarios in which speech synthesis is being adopted include:

* *Improving accessibility:* **Text to Speech** technology enables content owners and publishers to respond to the different ways people interact with their content. People with visual impairment or reading difficulties appreciate being able to consume content aurally. Voice output also makes it easier for people to enjoy textual content, such as newspapers or blogs, on mobile devices while commuting or exercising.

* *Responding in multitasking scenarios:* **Text to Speech** enables people to absorb important information quickly and comfortably while driving or otherwise outside a convenient reading environment. Navigation is a common application in this area. 

* *Enhancing learning with multiple modes:* Different people learn best in different ways. Online learning experts have shown that providing voice and text together can help make information easier to learn and retain.

* *Delivering intuitive bots or assistants:* The ability to talk can be an integral part of an intelligent chat bot or a virtual assistant. More and more companies are developing chat bots to provide engaging customer service experiences for their customers. Voice adds another dimension by allowing the bot's responses to be received aurally (for example, by phone).

## Voice support

The Microsoft **Text-to-Speech** service offers more than 75 voices in more than 45 languages and locales. To use these standard "voice fonts", you only need to specify the voice name with a few other parameters when you call the service's REST API. For the details of the voices supported, see [Supported languages](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/supported-languages#text-to-speech). 

If you want a unique voice for your application, you can create [custom voice fonts](how-to-customize-voice-font.md) from your own speech samples.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [See how to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
