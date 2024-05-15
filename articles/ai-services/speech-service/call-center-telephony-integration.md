---
title: Call Center Telephony Integration - Speech service
titleSuffix: Azure AI services
description: A common scenario for speech to text is transcribing large volumes of telephony data that come from various systems, such as interactive voice response (IVR) in real-time. This requires an integration with the Telephony System used.
author: goergenj
ms.author: jagoerge
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 1/18/2024
ms.custom: template-concept
---

# Telephony Integration

To support real-time scenarios, like Virtual Agent and Agent Assist in Call Centers, an integration with the Call Centers telephony system is required.

Typically, integration with the Speech service is handled by a telephony client connected to the customers SIP/RTP processor, for example, to a Session Border Controller (SBC).

Usually the telephony client handles the incoming audio stream from the SIP/RTP processor, the conversion to PCM and connects the streams using continuous recognition. It also triages the processing of the results, for example, analysis of speech transcripts for Agent Assist or connect with a dialog processing engine (for example, Azure Botframework or Power Virtual Agent) for Virtual Agent.

For easier integration the Speech service also supports “ALAW in WAV container” and “MULAW in WAV container” for audio streaming. To build this integration, we recommend using the [Speech SDK](./speech-sdk.md).

## Azure Communication Services 

[Azure Communication Services](../../communication-services/overview.md) call automation APIs provide telephony integration. real-time event triggers to perform actions based on custom business logic specific to their domain. Within the Call Automation APIs developers can use simple AI powered APIs, which can be used to play personalized greeting messages, recognize conversational voice inputs to gather information on contextual questions to drive a more self-service model with customers, use sentiment analysis to improve customer service overall. These content specific APIs are orchestrated through Azure AI services with support for customization of AI models without developers needing to terminate media streams on their services and streaming back to Azure for AI functionality. For more information, see [Azure Communication Services](../../communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md?context=/azure/ai-services/speech-service/context/context).

## Next steps

* [Learn about Speech SDK](./speech-sdk.md)
* [How to lower speech synthesis latency](./how-to-lower-speech-synthesis-latency.md)
