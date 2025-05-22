---
title: Control participant access to media
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

# Control participant access to media
::: zone pivot="platform-android"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]
::: zone-end

This article describes how you can enable organizers, co-organizers, or presenters to prevent attendees from unmuting themselves or turning on their video during Microsoft Teams meetings or group calls. Implement this feature to enable selected roles to control the ability of other attendees to send audio and video. You can't control media access for other roles. This article also describes how to determine if your audio or video is enabled or disabled. This includes providing attendees with the ability to check the media access status of other participants.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the article [Add voice calling to your app](../../quickstarts/voice-video-calling/getting-started-with-calling.md).

## Support

The following tables define support for media access in Azure Communication Services.

### Identities and call types

The following table shows media access support for specific call types and identities. 

|Identities                   | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|-----------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user	| ✔️	          |      |          |     	     |	                      |	✔️                       |
|Microsoft 365 user	          | ✔️	          |      |          |  	         |                        | ✔️                       |

### Operations

The following table shows support for individual APIs in the Calling SDK related to individual identity types. The media access feature only supports these operations in Teams meetings.

|Operations                     | Communication Services user | Microsoft 365 user | Equivalent Teams UI action|
|-----------------------------|---------------|--------------------------|--------------------------|
| Permit audio                  | ✔️ [1]       | ✔️ [1]                      | Enable mic |
| Forbid audio		              |	✔️ [1]          | ✔️ [1]                      | Disable mic |
| Permit video                  | ✔️ [1]          | ✔️ [1]                      | Enable camera |
| Forbid video		              |	✔️ [1]          | ✔️ [1]                      | Disable camera |
| Permit audio of all attendees | ✔️[1] [2]           |             ✔️[1] [2]            | Meeting option: Enable mic for all attendees |
| Forbid audio	of all attendees	        |	✔️[1] [2]          |       ✔️ [1] [2]                | Meeting option: Disable mic for all attendees |
| Permit video of all attendees |	✔️[1] [2]           |     ✔️[1] [2]                    | Meeting option: Enable camera for all attendees |
| Forbid video of all attendees |	✔️[1] [2]           |     ✔️[1] [2]                     | Meeting option: Disable camera for all attendees |
| Get media access of other participants | ✔️           |✔️                        ||
| Get media access of Teams meeting | ✔️[2]           |✔️[2]                        ||
| Get notification that media access changed          | ✔️           |✔️                        ||
| Get notification that Teams meeting's media access changed    | ✔️[2]           |    ✔️[2]                      ||

[1] Only user with role organizer, co-organizer, or presenter.

[2] This operation is only supported in Microsoft Teams meetings.

### SDKs

The following tables show support for the media access feature in individual Azure Communication Services SDKs.

| Support status | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|----------------|-----|--------|--------|--------|----------|--------|---------|
| Is Supported   | ✔️  |        |        |        |          |        |         |		

::: zone pivot="platform-web"
[!INCLUDE [Media Access Client-side JavaScript](./includes/media-access/media-access-web.md)]
::: zone-end


## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)

## Related articles

For more information about using the media access feature, see [Manage attendee audio and video permissions in Microsoft Teams meetings](https://support.microsoft.com/en-us/office/manage-attendee-audio-and-video-permissions-in-microsoft-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a).
