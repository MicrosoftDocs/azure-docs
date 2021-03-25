---
title: Voice and video concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services call types.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Voice and video concepts

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


You can use Azure Communication Services to make and receive one to one or group voice and video calls. Your calls can be made to other Internet-connected devices and to plain-old telephones. You can use the Communication Services JavaScript, Android, or iOS SDKs to build applications that allow your users to speak to one another in private conversations or in group discussions. Azure Communication Services supports calls to and from services or Bots.

## Call types in Azure Communication Services

There are multiple types of calls you can make in Azure Communication Services. The type of calls that you make determine your signaling schema, media traffic flows, and pricing model.

### Voice Over IP (VoIP)

When a user of your application calls another user of your application over an internet or data connection, the call is made over Voice Over IP (VoIP). In this case, both signaling and media flow over the internet.

### Public switched telephone network (PSTN)

Any time your users interact with a traditional telephone number, calls are facilitated by PSTN (Public Switched Telephone Network) voice calling. To make and receive PSTN calls, you need to add telephony capabilities to your Azure Communication Services resource. In this case, signaling and media use a combination of IP-based and PSTN-based technologies to connect your users.

### One-to-one call

A one-to-one call on Azure Communication Services happens when one of your users connects to another user using one of our SDKs. The call can be either VoIP or PSTN.

### Group call

A group call on Azure Communication Services happens when three or more participants connect to one another. Any combination of VoIP and PSTN-connected users can be present on a group call. A one-to-one call can be converted into a group call by adding more participants to the call. One of those participants can be a bot.

### Supported video standards
We support H.264 (MPEG-4)

### Video quality
We support up to Full HD 1080p on the native (iOS, Android) SDKs. For Web (JS) SDK we support Standard HD 720p. The quality depends on the available bandwidth.

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../call-flows.md)
- [Phone number types](../telephony-sms/plan-solution.md)
- Learn about the [Calling SDK capabilities](../voice-video-calling/calling-sdk-features.md)
