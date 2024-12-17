---
title: Control participants' access to media
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to control access to media for individual participants.
author: fuyan
ms.author: fuyan
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 10/24/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to learn how to send and receive Media access state using SDK.
---

# Control participants' access to media
::: zone pivot="platform-android"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end
In this article you are going to learn how you can control audio and video of other attendees in group calls and Teams meetings. You would also learn how to identify, that your audio or video has been enabled or disabled by presenters or organizer.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

## Support

The following tables define support of media access in Azure Communication Services.

### Identities and call types

The following table shows support of media access for specific call type and identity. 

|Identities                   | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|-----------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user	| ✔️	          |      |          |     	     |	                      |	✔️                       |
|Microsoft 365 user	          | ✔️	          |      |          |  	         |                        | ✔️                       |

### SDKs

The following tables show support for the media access feature in individual Azure Communication Services SDKs.

| Support status | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|----------------|-----|--------|--------|--------|----------|--------|---------|
| Is Supported   | ✔️  |        |        |        |          |        |         |		

### Operations

The following table shows support for individual APIs in the calling SDK related to individual identity types.

|Operations                     | Communication Services user | Microsoft 365 user |
|-----------------------------|---------------|--------------------------|
| Forbid audio		              |	✔️           | ✔️                       |
| Permit audio                  | ✔️           | ✔️                       |
| Forbid video		              |	✔️           | ✔️                       |
| Permit video                  | ✔️           | ✔️                       |
| Forbid audio	of all other attendees	        |	✔️[1]           |       ✔️   [1]                |
|permitOthersAudio            | ✔️           |                          |
|forbidOthersVideo		        |	✔️           |                          |
|permitOthersVideo            | ✔️           |                          |
|getAllOthersMediaAccess      | ✔️           |✔️                        |
|mediaAccessChanged           | ✔️           |✔️                        |
|meetingMediaAccessChanged    | ✔️           |                          |

::: zone pivot="platform-web"
[!INCLUDE [Media Access Client-side JavaScript](./includes/media-access/media-access-web.md)]
::: zone-end

Additional resources
For more information about using the Media Access feature in Teams calls and meetings, see the [Microsoft Teams documentation](https://support.microsoft.com/en-us/office/manage-attendee-audio-and-video-permissions-in-microsoft-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a).

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
