---
title: Spotlight states
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to send spotlight state.
author: cnwankwo
ms.author: cnwankwo
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 03/01/2023
ms.custom: template-how-to
---

# Spotlight states

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

In this article, you'll learn how to implement Microsoft Teams spotlight capability with Azure Communication Services Calling SDKs. This capability allows users in the call or meeting to pin and unpin videos for everyone. 

Since the video stream resolution of a participant is increased when spotlighted, it should be noted that the settings done on [Video Constraints](../../concepts/voice-video-calling/video-constraints.md) also apply to spotlight.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

Communication Services or Microsoft 365 users can call the spotlight APIs based on role type and conversation type

**In a one to one call or group call scenario, the following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| startSpotlight | ✔️ | ✔️  | ✔️ |
| stopSpotlight | ✔️ | ✔️ | ✔️ |
| stopAllSpotlight |  ✔️ | ✔️ | ✔️ |
| getSpotlightedParticipants |  ✔️ | ✔️ | ✔️ |

**For meeting scenario the following APIs are supported for both Communication Services and Microsoft 365 users**

|APIs| Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|
| startSpotlight | ✔️ | ✔️  |  |
| stopSpotlight | ✔️ | ✔️ | ✔️ |
| stopAllSpotlight |  ✔️ | ✔️ |  |
| getSpotlightedParticipants |  ✔️ | ✔️ | ✔️ |

[!INCLUDE [Spotlight Client-side JavaScript](./includes/spotlight/spotlight-web.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
