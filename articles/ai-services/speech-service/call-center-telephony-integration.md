---
title: Call Center Telephony Integration - Speech service
titleSuffix: Azure AI services
description: A common scenario for speech to text is transcribing large volumes of telephony data that come from various systems, such as interactive voice response (IVR) in real-time. This requires an integration with the Telephony System used.
author: goergenj
ms.author: jagoerge
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 08/10/2022
ms.custom: template-concept
---

# Telephony Integration

To support real-time scenarios, like Virtual Agent and Agent Assist in Call Centers, an integration with the Call Centers telephony system is required.

Typically, integration with the Speech service is handled by a telephony client connected to the customers SIP/RTP processor, for example, to a Session Border Controller (SBC).

Usually the telephony client handles the incoming audio stream from the SIP/RTP processor, the conversion to PCM and connects the streams using continuous recognition. It also triages the processing of the results, for example, analysis of speech transcripts for Agent Assist or connect with a dialog processing engine (for example, Azure Botframework or Power Virtual Agent) for Virtual Agent.

For easier integration the Speech service also supports “ALAW in WAV container” and “MULAW in WAV container” for audio streaming.

To build this integration we recommend using the [Speech SDK](./speech-sdk.md).


> [!TIP]
> For guidance on reducing Text to speech latency check out the **[How to lower speech synthesis latency](./how-to-lower-speech-synthesis-latency.md?pivots=programming-language-csharp)** guide.
> 
> In addition, consider implementing a text to speech cache to store all synthesized audio and playback from the cache in case a string has previously been synthesized.

## Next steps

* [Learn about Speech SDK](./speech-sdk.md)
* [How to lower speech synthesis latency](./how-to-lower-speech-synthesis-latency.md)
