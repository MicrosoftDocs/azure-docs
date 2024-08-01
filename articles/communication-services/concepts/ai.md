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
---

# Artificial intelligence (AI) overview

Artificial intelligence (AI) technologies can be useful for a wide variety of communication experiences. This concept page summarizes availability of AI and AI-adjacent features in Azure Communication Services. AI features can be split into three categories:

-  **Accessors.** APIs that allow you to access Azure Communication data for the purposes of integrating your own separate transformations and bots.
-  **Transformers.** APIs that provide a built-in transformation of communication data using a machine learning or language model.
-  **Bots.** APIs that implement bots that directly communicate with end-users, typically blending structured programming with language models.

Typical communication scenarios integrating these capabilities:

- Transforming audio speech content into text transcriptions
- Transforming a video feed to blur the user's background
- Operating a chat or voice bot that responds to human conversation
- Transforming a corpus of text chat and meeting transcriptions into summaries. This experience might involve a generative AI interface in which a user asks, "summarize all conversations between me and user Joe."

## Messaging: SMS, Chat, Email, WhatsApp

Azure Communication Services capabilities for asynchronous messaging share common patterns for integrating AI listed here.

| Feature | Accessor | Transformer | Bot | Description |
|--|--|--|--|--|
| REST APIs and SDKs| ✅ | |  | The messaging services center around REST APIs and server-oriented SDKs. You can use these SDKs to export content to an external datastore and attach a language model to summarize conversations. Or you can use the SDKs to integrate a bot that directly engages with human users.  |
| WhatsApp Message Analysis  | | ✅ |  | The Azure Communication Service messaging APIs for WhatsApp provide a built-in integration with Azure OpenAI that analyses and annotates messages. This integration can detect the user’s language, recognize their intent, and extract key phrases. |
| [Azure Bot – Chat Channel Integration](../quickstarts/chat/quickstart-botframework-integration.md) | | | ✅  | The Azure Communication Service chat system is directly integrated with Azure Bot services. This integration simplifies creating chat bots that engage with human users.|

## Voice, Video, and Telephony

The patterns for integrating AI into the voice and video system are summarized here.

| Feature | Accessor | Transformer | Bot | Description |
|--|--|--|--|--|
| [Call Automation REST APIs and SDKs](../concepts/call-automation/call-automation.md) | ✅ | ✅ |  | Call Automation APIs include both accessors and transformers, with REST APIs for playing audio files and recognizing a user’s response. The `recognize` APIs integrate Azure Bot Services to transform users’ audio content into text for easier processing by your service. The most common scenario for these APIs is implementing voice bots, sometimes called interactive voice response (IVR). |
| [Microsoft Copilot Studio](https://learn.microsoft.com/microsoft-copilot-studio/voice-overview) | | ✅ | ✅ | Copilot studio is directly integrated with Azure Communication Services telephony. This integration is designed for voice bots and IVR. |
| [Azure Portal Copilot](https://learn.microsoft.com/azure/communication-services/concepts/voice-video-calling/call-diagnostics#copilot-in-azure-for-call-diagnostics) | | ✅ | ✅ | Copilot in the Azure portal allows you to ask questions about Azure Communication Services. Currently this copilot answers questions using information solely from Azure's technical documentation, and is best used for asking questions about error codes and API behavior. |
| [Client Raw Audio and Video](../concepts/voice-video-calling/media-access.md)  | ✅ | |  | The Calling client SDK provides APIs for accessing and modifying the raw audio and video feed. An example scenario is taking the video feed, detecting the human speaker and their background, and customizing that background. |
| [Client Background effects](../quickstarts/voice-video-calling/get-started-video-effects.md?pivots=platform-web)| | ✅ |  | The Calling client SDKs provides APIs for blurring or replacing a user’s background. |
| [Client Captions](../concepts/voice-video-calling/closed-captions.md) | | ✅ |  | The Calling client SDK provides APIs for real-time closed captions. These internally integrate Azure Cognitive Services to transform audio content from the call into text in real-time. |
| [Client Noise Enhancement and Effects](../tutorials/audio-quality-enhancements/add-noise-supression.md?pivots=platform-web) | | ✅ |  | The Calling client SDK integrates a [DeepVQE](https://arxiv.org/abs/2306.03177) machine learning model to improve audio quality through echo cancellation and background noise suppression.. This transformation is toggled on and off using the client SDK. |
