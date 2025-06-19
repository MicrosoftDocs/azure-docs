---
title: Enable spotlight
titleSuffix: An Azure Communication Services article
description: Use Azure Communication Services SDKs to send spotlight state.
author: sloanster
ms.author: micahvivion
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 06/15/2025
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Enable spotlight

This article describes how to implement spotlight capability with Azure Communication Services Calling SDKs. Spotlight enables users in the call or meeting to signal to other participants that selected user should be **in the spotlight**. Spotlight also enables users to tag other users in the call and notify all the participants that someone is spotlighted and other clients need to change the User Interface layout for that user.

## Overview

Spotlight serves as a signaling feature instead of a media capability. When a participant is spotlighted, applications can determine how to manage or adjust the spotlighted participant User Interface. Spotlight typically results in highlighting the participant, placing them at the center of the UI layout. Spotlight also enlarges their video renderer size while keeping other participant videos smaller. The maximum limit of spotlighted participants in a call is seven, meaning in a single call a total number of distinct users that are spotlighted is seven (7).

Spotlighting a participant is possible in both Azure Communication Services calls and in Teams meetings. In Teams meetings the organizer, coorganizer, or presenter can choose up to seven (7) users (including themselves) to be in the spotlight. Remember that in a Teams meeting scenario, when a call is set to Large gallery or Together mode, participants can't change the UI layout.

To enable higher resolution for a spotlighted user's video, the application must ensure that their video renderer is larger than other users displayed on the screen. Larger rendering enables the Azure Communication Services SDK to request and subscribe to a higher resolution stream, which matches the renderer's size, provided hardware and network conditions permit. If not optimal, the SDK adjusts the resolution for smooth playback. Resolution can also be controlled using via [Video Constraints](../../concepts/voice-video-calling/video-constraints.md), overriding the default Azure Communication Services SDK behavior.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)


## Support

The following tables define support for spotlight in Azure Communication Services.

## Identities and call types

The following table shows support for call and identity types. 

| Identities | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
| --- | --- | --- | --- | --- | --- | --- |
|Communication Services user	| ✔️ |   ✔️   |    |  ✔️  |	   |  ✔️    |
|Microsoft 365 user | ✔️  |   ✔️  |   |   ✔️    |     |  ✔️    |

## Operations

Azure Communication Services or Microsoft 365 users can call spotlight operations based on role type and conversation type.

The following table shows support for individual operations in Calling SDK to individual identity types.

**In one-to-one calls, group calls, and meeting scenarios the following operations are supported for both Communication Services and Microsoft 365 users**

| Operations | Communication Services user | Microsoft 365 user |
| --- | --- | --- |
| `startSpotlight` | ✔️ [1] | ✔️ [1] |
| `stopSpotlight` | ✔️ | ✔️ |
| `stopAllSpotlight` |  ✔️ [1] | ✔️ [1] | 
| `getSpotlightedParticipants` |  ✔️ | ✔️ | 
| `StartSpotlightAsync` |  ✔️ [1] | ✔️ [1] | 
| `StopSpotlightAsync` |  ✔️ [1] | ✔️ [1] | 
| `StopAllSpotlightAsync` |  ✔️ [1] | ✔️ [1] | 
| `SpotlightedParticipants` |  ✔️ [1] | ✔️ [1] | 
| `MaxSupported` |  ✔️ [1] | ✔️ [1] | 

[1] In Teams meeting scenarios, these operations are only available to users with role organizer, co-organizer, or presenter.

## SDKs

The following table shows support for spotlight feature in individual Azure Communication Services SDKs.

| Platforms | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Is Supported | ✔️  |  ✔️  |  ✔️  |     |  ✔️  |    |  ✔️  |

::: zone pivot="platform-web"
[!INCLUDE [Spotlight Client-side JavaScript](./includes/spotlight/spotlight-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Spotlight Client-side Android](./includes/spotlight/spotlight-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Spotlight Client-side IOS](./includes/spotlight/spotlight-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Spotlight Client-side Windows](./includes/spotlight/spotlight-windows.md)]
::: zone-end

## Troubleshooting

| Code | Subcode | Result Category | Reason | Resolution |
| --- | --- | --- | --- | --- |
| 400	| 45900 | ExpectedError  | All provided participant IDs are already spotlighted. | Only participants who aren't currently spotlighted can be spotlighted. |
| 400 | 45902	| ExpectedError | The maximum number of participants are already spotlighted. | Only seven participants can be in the spotlight state at any given time. |
| 403 | 45903	| ExpectedError | Only participants with the roles of organizer, coorganizer, or presenter can initiate a spotlight. | Ensure the participant calling the `startSpotlight` operation has the role of organizer, coorganizer, or presenter. |

## Next steps

- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
