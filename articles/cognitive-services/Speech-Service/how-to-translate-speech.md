---
title: Translate speech | Microsoft Docs
description: Use Speech Translation in the Speech service.
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 04/28/2018
ms.author: v-jerkin
---
# Speech Translation

The [Speech SDK](speech-sdk.md) is the simplest way to use Speech Translation in your application and provides the full functionality of the service. The basic process is as follows.

1. Create a speech factory, providing a Speech service subscription key or an authorization token. You also configure the source and target translation languages at this point, as well as specifying whether you want text or speech output.

2. Get a recognizer from the factory. The recognizer you want is the translation recognizer. (The others are for Speech to Text.) There are various flavors of translation recognizer based on the audio source you are using.

4. Hook up events for asynchronous operation, if desired. The recognizer will then call your event handlers when it has interim and final results. Otherwise, your application will receive a final translation result.

5. Start recognition and translation.

### SDK samples

You can download code samples demonstrating the use of the SDK for Speech Translation using the links below.

- [Download samples for Windows](https://aka.ms/csspeech/winsample)
- [Download samples for Linux](https://aka.ms/csspeech/linuxsample)
