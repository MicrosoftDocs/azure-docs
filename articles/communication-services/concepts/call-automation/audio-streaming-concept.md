---
title: Audio streaming overview
titleSuffix: An Azure Communication Services concept document
description: Conceptual information about using Audio Streaming APIs with Call Automation.
author: Alvin
ms.service: azure-communication-services
ms.topic: overview
ms.date: 11/24/2024
ms.author: alvinhan
ms.custom: public_prview
---

# Audio streaming overview - audio subscription

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

Azure Communication Services provides bidirectional audio streaming capabilities, offering developers powerful tools to capture, analyze, and process audio content during active calls. This development paves the way for new possibilities in real-time communication for developers and businesses alike. 

By integrating bidirectional audio streaming with services like Azure OpenAI and other real-time voice APIs, businesses can achieve seamless, low-latency communication. This significantly enhances the development and deployment of conversational AI solutions, allowing for more engaging and efficient interactions. 

With bidirectional streaming, businesses can now elevate their voice solutions to low-latency, human-like, interactive conversational AI agents. Our bidirectional streaming APIs enable developers to stream audio from an ongoing call on Azure Communication Services to their web servers in real-time, and stream audio back into the call. While the initial focus of these features is to help businesses create conversational AI agents, other use cases include Natural Language Processing for conversation analysis or providing real-time insights and suggestions to agents while they are in active interaction with end users. 

This public preview supports the ability for developers to access real-time audio streams over a WebSocket from Azure Communication Services and stream audio back into the call.

### Real-time call assistance

- **Leverage conversational AI Solutions:** Develop sophisticated customer support virtual agents that can interact with customers in real-time, providing immediate responses and solutions.

- **Personalized customer experiences:** By harnessing real-time data, businesses can offer more personalized and dynamic customer interactions in real-time, leading to increased satisfaction and loyalty.

- **Reduce wait times for customers:** By using bidirectional audio streams in combination with Large Language Models (LLMs), you can build virtual agents that can be the first point of contact for customers, reducing the need for them to wait for a human agent to become available.

### Authentication

- **Biometric authentication** – Use the audio streams to carry out voice authentication, by running the audio from the call through your voice recognition/matching engine/tool.

## Sample architecture for subscribing to audio streams from an ongoing call - live agent scenario

[![Screenshot of architecture diagram for audio streaming.](./media/bidirectional-streaming.png)](./media/bidirectional-streaming.png#lightbox)

## Supported formats

### Mixed format
Contains mixed audio of all participants on the call. All audio is flattened into one stream.
	
### Unmixed
Contains audio per participant per channel, with support for up to four channels for the four most dominant speakers at any point in a call. You also get a participantRawID that you can use to determine the speaker. 

## Additional information
The following describes information that helps developers convert the audio packets into audible content that can be used by their applications.
- Framerate: 50 frames per second
- Packet stream rate: 20-ms rate
- Data packet: 64 Kbytes
- Audio metric: 16-bit PCM mono at 16000 hz and 24000 hz
- Public string data is a base64 string that should be converted into a byte array to create raw PCM file.

## Billing
See the [Azure Communication Services pricing page](https://azure.microsoft.com/pricing/details/communication-services/?msockid=3b3359f3828f6cfe30994a9483c76d50) for information on how audio streaming is billed. Prices can be found in the calling category under audio streaming.

## Next Steps
Check out the [audio streaming quickstart](../../how-tos/call-automation/audio-streaming-quickstart.md) to learn more.
