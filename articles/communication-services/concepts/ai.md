---
title: AI in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services AI concepts
author: chpalm
manager: sundraman
services: azure-communication-services
ms.author: chpalm
ms.date: 07/10/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: ai
---

# Artificial intelligence (AI) overview

Artificial intelligence (AI) technologies can be useful for a wide variety of communication experiences. This concept page summarizes availability of AI and AI-adjacent features in Azure Communication Services. AI features can be split into three categories:

1.  **Accessors.** APIs that allow you to access Azure Communication data for the purposes of integrating your own separate transformations and bots.
2.  **Transformers.** APIs that provide a built-in transformation of communication data using a machine learning or language model.
3.  **Bots.** APIs that implement bots that directly communicate with end-users, typically blending structured programming with language models.

Typical communication scenarios integrating these capabilities:

- Transforming audio speech content into text transcriptions
- Transforming a video feed to blur the user's background
- Operating a chat or voice bot that responds to human conversation
- Transforming a corpus of text chat and meeting transcriptions into summaries. This may involve a generative AI interface, where a user asks "summarize all conversations between me and user Joe."

## Messaging: SMS, Chat, Email, WhatsApp

Azure Communication Services capabilities for asynchronous messaging share common patterns for integrating AI listed below.

| | Accessor | Transformer | Bot | |
|--|--|--|--|--|
| REST APIs and SDKs| ✅ | |  | The messaging services center around REST APIs and server-oriented SDKs. You can use these SDKs to export content to an external datastore and attach a language model to summarize conversations. Or you can use the SDKs to integrate a bot that directly engages with human users.  |
| WhatsApp Message Analysis  | | ✅ |  | The Azure Communication Service messaging APIs for WhatsApp provide a built-in integration with Azure OpenAI that analyses and annotates messages. This integration can detect the user’s language, recognize their intent, and extract key phrases. |
| [Azure Bot – Chat Channel Integration](https://learn.microsoft.com/azure/communication-services/quickstarts/chat/quickstart-botframework-integration) | | | ✅  | The Azure Communication Service chat system is directly integrated with Azure Bot services. This integration simplifies creating chat bots that engage with human users.|

## Voice, Video, and Telephony

The patterns for integrating AI into the voice and video system are summarized below.

|  | Accessor | Transformer | Bot ||
|--|--|--|--|--|
| [Call Automation REST APIs and SDKs](https://learn.microsoft.com/azure/communication-services/concepts/call-automation/call-automation) | ✅ | ✅ |  | Call Automation APIs include both accessors and transformers, with REST APIs for playing audio files and recognizing a user’s response. The `recognize` APIs integrate Azure Bot Services to transform users’ audio content into text for easier processing by your service. The most common scenario for these APIs is implementing voice bots, sometimes called interactive voice response (IVR).  |
| [Microsoft Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/voice-overview) | | ✅ | ✅ | Copilot studio is directly integrated with Azure Communciation Services telephony. This integration is designed for voice bots and IVR.  |
| [Azure Portal Co-pilot](https://learn.microsoft.com/en-us/microsoft-copilot-studio/voice-overview) | | ✅ | ✅ | Copilot studio is directly integrated with Azure Communciation Services telephony. This integration is designed for voice bots and IVR.  |
| [Client Raw Audio and Video](https://learn.microsoft.com/azure/communication-services/concepts/voice-video-calling/media-access)  | ✅ | |  | The Calling client SDK provides APIs for accessing and modifying the raw audio and video feed. An example scenario is taking the video feed, detecting the human speaker and their background, and customizing that background. |
| [Client Background effects](https://learn.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/get-started-video-effects?pivots=platform-web)| | ✅ |  | The Calling client SDKs provides APIs for blurring or replacing a user’s background. |
| [Client Captions](https://learn.microsoft.com/azure/communication-services/concepts/voice-video-calling/closed-captions) | | ✅ |  | The Calling client SDK provides APIs for real-time closed captions. These internally integrate Azure Cognitive Services to transform audio content from the call into text in real-time. |
| [Client Noise Enhancement and Effects](https://learn.microsoft.com/azure/communication-services/tutorials/audio-quality-enhancements/add-noise-supression?pivots=platform-web) | | ✅ |  | The Calling client SDK integrates a [DeepVQE](https://arxiv.org/abs/2306.03177) machine learning model to improve audio quality through echo cancellation, noise suppression, and dereverberation. This transformation toggled on and off through the client SDK.|
