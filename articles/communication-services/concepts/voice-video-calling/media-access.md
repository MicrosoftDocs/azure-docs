---
title: Azure Communication Services Calling SDK RAW media overview 
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of media access 
author: laithrodan
manager: 
services: azure-communication-services

ms.author: laithrodan
ms.date: 07/21/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Media access overview

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

Azure Communication Services provides support for developers to get real-time access to media streams to capture, analyze and process audio or video content during active calls. 

Consumption of live audio and video content is very prevalent in our world today in the forms of online meetings, conferences, live events, online classes and customer support. The modern communications world allows people around the globe to connect with anyone anywhere any moment on any matter virtually. With raw media access, developers can analyze audio or video streams for each participant in a call in real-time. In contact centers these streams can be used to run custom AI models for analysis such as your homegrown NLP for conversation analysis or provide real-time insights and suggestions to boost agent productivity. In virtual appointments media streams can be used to analyze sentiment when providing virtual care for patients or provide remote assistance during video calls leveraging Mixed Reality capabilities. This also opens a path for developers to leverage newer innovations with endless possibilities to enhance interaction experiences.   

The Azure Communication Services SDKs provides access to the media streams from the client and server side to enable developers building more inclusive and richer virtual experiences during voice or video interactions. 

:::image type="content" source="../media/raw-media/raw-media-overview-1.png" alt-text="diagram of raw media overview use cases.":::

## The workflow can be split into three operations:
•	Capture Media: Media can be captured locally via the client SDKs or on the server side.

•	Process/Transform: Media can be transformed locally on the client (for example add background blur) or be used for processing in a cloud service (for example to use it with your customer NLPU for conversation insights).

•	Provide context or inject back the Transformed Media: The output of the transformed media streams (ex, sentiment analysis) can be used to provide context  or augmented media streams can be injected into the interaction through the client SDK or through the media streaming API via the server SDK. 

## Media access via the Calling Client SDK
During a call, developers can access the audio and video media streams. Outgoing local audio and video media streams can be pre-processed, before being sent to the encoder. Incoming remote captured media streams can be post-processed before playback on screen or speaker. For incoming audio mixed media access, the client calling SDK can have access to the mixed incoming remote audio stream which includes the mixed audio streams of the top four most dominant speakers on the call. For incoming remote unmixed audio the client calling SDK will have access to the individual audio streams of each participant on the call.  

:::image type="content" source="../media/raw-media/raw-media-overview-2.png" alt-text="diagram of raw media overview architecture.":::


## Media access use cases
•	Screen share: Local outgoing video access can be used to enable screen sharing, developers are able to implement the foreground services to capture the frames and send them to be published using the calling SDK OutgoingVirtualVideoStreamOptions.

•	Background blur: Local outgoing video access can be used to capture the video frames from the camera and implement background blur before sending the blurred frames to be published using the calling SDK OutgoingVirtualVideoStreamOptions.

•	Video filters: Local outgoing video access can be used to capture the video frames from the camera and implement AI video filters on the captured frames before sending the video frames to be published using the calling SDK OutgoingVirtualVideoStreamOptions.

•	Augmented reality/Virtual reality: Remote incoming video media streams can be captured and augmented with a virtual environment before rendering on the screen.

•	Spatial audio: Remote incoming audio access can be used to inject spatial audio into the incoming audio stream.


:::image type="content" source="../media/raw-media/raw-media-overview-3.png" alt-text="diagram of raw media overview client interfaces.":::


## Next steps

> [!div class="nextstepaction"]
> [Get started with raw media](../../quickstarts/voice-video-calling/get-started-raw-media-access.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../call-flows.md)
- Learn about [call types](../voice-video-calling/about-call-types.md)
- [Plan your PSTN solution](../telephony/plan-solution.md)
