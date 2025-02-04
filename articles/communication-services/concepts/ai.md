---
title: AI in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Azure Communication Services AI concepts.
author: chpalm
manager: sundraman
services: azure-communication-services
ms.author: chpalm
ms.date: 2/3/2025
ms.topic: conceptual
ms.service: azure-communication-services
---

# Artificial intelligence overview

AI technologies are useful for many communication experiences. AI can help humans communicate better and accomplish their mission more efficiently, for example, a banking employee may use an AI generated meeting summary to help them follow up. AI can reduce human workloads and enable more flexible customer engagement, such as operating a 24/7 phone bot that customers call to check their account balance.

More examples include:
- Operate a chat or voice bot that responds to human conversation.
- Transform audio speech content into text transcriptions.
- Transform a video feed to blur the user's background.
- Annotate and analyze conversations to identify trends and opportunities to improve service.
- Transform a corpus of text chat and meeting transcriptions into summaries. This experience might involve a generative AI interface in which a user asks, "Summarize all conversations between me and user Joe."

This article summarizes the availability of AI and AI-adjacent features in Azure Communication Services. There are two broad categories of AI functionality:

- **Integrated AI**: Azure Communication Services is directly integrated with Azure AI and Microsoft Copilot Studio. Generally these features require you to create and link both Azure Communication Services and Azure AI resources in the Azure portal. After this one-time linking, using these AI features is as straightforward as a single API call.
- **Accessors**: Azure Communication Services provides various APIs that give you raw and transformed access to your communication data making it easy for you to connect your own external services and AI systems. 

## Messaging: SMS, chat, email, WhatsApp

This section summarizes features for integrating AI into Azure Communication messaging. 

### Direct Integrations 

- **[Advanced message analysis](../concepts/advanced-messaging/message-analysis/message-analysis.md)** The Azure Communication Services messaging APIs for WhatsApp provide a built-in integration with Azure OpenAI that analyzes and annotates messages. This integration can detect the user's language, recognize their intent, and extract key phrases. 
- **[Azure Bot Service: Chat channel integration](../quickstarts/chat/quickstart-botframework-integration.md)** - The Azure Communication Services chat system is directly integrated with Azure Bot Service. This integration simplifies creating chat bots that engage with human users.

### Accessors
All Azure Communication Services messaging capabilities are accessible through REST APIs, server-oriented SDKs, and Event Grid notifications. You can use these SDKs to export content to an external datastore and attach a language model to summarize conversations. Or you can use the SDKs to integrate a bot that directly engages with human users. For example, this [GitHub sample](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/chat-nlp-analysis) shows how Azure Communication Services APIs for chat can be accessed through REST APIs and then analyzed by Azure OpenAI.

## Voice, video, and telephony

This section summarizes features for integrating AI into Azure Communication voice and video calling. 

### Direct Integrations 

- **[Call Automation REST APIs and SDKs](../concepts/call-automation/call-automation.md)**- Azure Communication Services has simple APIs for [synthesizing](../concepts/call-automation/play-action.md) and [recognizing](../concepts/call-automation/recognize-action.md) speech. The most common scenario for these APIs is implementing voice bots, which is sometimes called interactive voice response (IVR).
- **[Microsoft Copilot Studio](/microsoft-copilot-studio/voice-overview)** - Copilot Studio is directly integrated with Azure Communication Services telephony. This integration is designed for voice bots and IVR.
- **[Client captions](../concepts/voice-video-calling/closed-captions.md)** The Calling client SDK provides APIs for real-time closed captions, optimized for accessibility.
- **[Copilot in the Azure portal](/azure/communication-services/concepts/voice-video-calling/call-diagnostics#copilot-in-azure-for-call-diagnostics)** - You can use Copilot in the Azure portal to ask questions about Azure Communication Services. Copilot uses Azure technical documentation to answer your questions and is best used for asking questions about error codes and API behavior.
- **[Client background effects](../quickstarts/voice-video-calling/get-started-video-effects.md?pivots=platform-web)** -  The Calling client SDKs provide APIs for blurring or replacing a user's background.
- **[Client noise enhancement and effects](../tutorials/audio-quality-enhancements/add-noise-supression.md?pivots=platform-web)** -  The Calling client SDK integrates a [DeepVQE](https://arxiv.org/abs/2306.03177) machine learning model to improve audio quality through echo cancellation and background noise suppression. This transformation is toggled on and off by using the client SDK.

### Accessors
Similar to Azure Communication Services messaging, there are REST APIs for many voice and video calling features. However the real-time nature of calling requires closed source SDKs and more complex APIs such as websocket streaming.

- **[Call Automation REST APIs and SDKs](../concepts/call-automation/call-automation.md)** - Services and AI applications  use Call Automation REST APIs to answer, route, and manage all types of Azure voice and video calls.
- **[Service-to-service audio streaming](../concepts/call-automation/audio-streaming-concept.md)** - AI applications use Azure's service-to-service WebSockets API to stream audio data. This works in both directions, your AI can listen to a call, and speak.
- **[Service-to-service real-time transcription](../concepts/call-automation/real-time-transcription.md)** - AI applications use Azure's service-to-service WebSockets API to stream a real-time, Azure-generated transcription. Compared to audio or video content, transcript data is often easier for AI models to reason upon.
- **[Client raw audio and video](../concepts/voice-video-calling/media-access.md)** - The Calling client SDK provides APIs for accessing and modifying the raw audio and video feed. An example scenario is taking the video feed, using computer vision to distinguish the human speaker from their background, and customizing that background.
