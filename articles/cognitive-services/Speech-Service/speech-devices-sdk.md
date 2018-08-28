---
title: About the Speech Devices SDK
description: An introduction to the Speech Devices SDK.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 05/07/2018
ms.author: v-jerkin
---
# About the Speech Devices SDK (Preview)

The [Microsoft Speech service](overview.md) works with a wide variety of devices and audio sources. Now you can take your speech applications to the next level with matched hardware and software. The Speech Devices SDK is a pre-tuned library paired with purpose built microphone array development kits. Giving you the power to rapidly test new voice scenarios, the Speech Devices SDK makes it easy to integrate the cloud-based Microsoft Speech Service into your device and create an exceptional user experience for your customers. 

The Speech Devices SDK consumes the [Speech SDK](speech-sdk.md), and uses the Speech SDK to send the audio processed by our advanced audio processing algorithm from the device's microphone array to the [Microsoft Speech Service](overview.md).  It uses multi-channel audio to provide more accurate far-field [speech recognition](speech-to-text.md) via noise suppression, echo cancellation, beamforming and de-reverberation.

The Speech Devices SDK also allows you to build ambient devices with your own [customized wake word](speech-devices-sdk-create-kws.md)—so the cue that initiates a user interaction is unique to your brand. 

The SDK facilitates a variety of voice-enabled scenarios, such as drive-thru ordering systems, in-store or in-home assistants, and smart speakers. You could respond to users with text, speak back to them in a default or [custom voice](how-to-customize-voice-font.md), provide search results, [translate](speech-translation.md) to other languages, and more. We look forward to seeing what you build!



## Development kit providers

Complete, end-to-end system reference designs. More coming soon!

|||
|-|-|
|[![ROOBO logo](media/speech-devices-sdk/roobo-logo.png)](http://ddk.roobo.com/)|ROOBO provides complete AI system solutions for household electric appliances, automobiles, robots, toys, and other industries. ROOBO's reference designs greatly reduce development time-to-market via integration with the Microsoft Speech service. [Visit ROOBO](http://ddk.roobo.com/)|

## Next steps

To get started, get a [free Azure account](https://azure.microsoft.com/free/ai/) and sign up for the Speech Devices SDK.

> [!div class="nextstepaction"]
> [Sign up for the Speech Devices SDK](get-speech-devices-sdk.md)

