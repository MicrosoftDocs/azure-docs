---
title: How to pass contextual data between calls
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to pass contextual data between calls.
author: sloanster
ms.author: micahvivion
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 09/13/2024
ms.custom: template-how-to
---

# Using the ACS calling SDK to pass contextual User-to-User Information (UUI) data between calls

In this article, you learn how to pass along custom contextual information when routing calls with Azure Communication Services Calling SDKs. This capability allows users to pass metadata about the call, callee, or any other information that is relevant to their application or business logic.

The Azure Communication Services (ACS) WebJS SDK provides developers to include custom contextual data (included as a header on the calling object) when directing and routing calls from one person to another.  This information, also known as User-to-User Information (UUI) data or call control UUI data, is a small piece of data inserted by an application initiating the call. The UUI data is opaque to end users making a call.

Contextual information supported includes both freeform custom headers and the standard User-to-User Information (UUI) SIP header. Also when you receive an inbound call, the custom headers and UUI are included in the incomingCall payload.

All custom context data is opaque to Calling SDK or SIP protocols and its content is unrelated to any basic functions.

Developers can pass this context by using custom headers, which consist of optional key-value pairs. These pairs can be included in the 'AddParticipant' or 'Transfer' actions within the calling SDK. Once added, you can read the data payload as the call moves between endpoints. By efficiently looking up this metadata and associating it with the call, developers can avoid external database lookups and have the content information readily available within the call object.

The custom call context can be transmitted to SIP endpoints using the SIP protocol. This transmission includes both the custom headers and the standard User-to-User Information (UUI) SIP header. When an inbound call is routed from your telephony network, the data from your Session Border Controller (SBC) in the custom headers and UUI is also included in the IncomingCall event payload.

It’s important to note that all custom context data remains transparent to the calling SDK and isn't related to any of the SDK’s fundamental functions when used in SIP protocols. Here's a tutorial to assist you in adding custom context headers when using the WebJS SDK.


> [!IMPORTANT]
> To use the ability to pass User-to-User Information (UUI) data using the calling SDK you must use the calling WebJS SDK GA or public preview version `1.29.1` or later.

[!INCLUDE [Passing Contextual Data - Client-side JavaScript](./includes/call-context/call-context-web.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)