---
title: Show call transcription state on the client
titleSuffix: An Azure Communication Services article
description: Use Azure Communication Services SDKs to display the call transcription state
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 06/15/2025
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Show call transcription state on the client

You need to collect consent from all participants in the call before you can transcribe them. Microsoft Teams enables users to start transcription in the meetings or calls. You receive an event when transcription starts. You can check the transcription state if transcription started before you joined the call or meeting. You can provide explicit consent to transcription if a meeting or call requires it, and you already collected it.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

## Support

The following tables define support of call transcription in Azure Communication Services.

## Identities and call types

The following tables show support of transcription for specific call type and identity. 

|Identities | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
| --- | --- | --- | --- | --- | --- | --- |
|Communication Services user	| ✔️ | | | |	 ✔️ |	✔️ |
|Microsoft 365 user	 | ✔️ | | | | ✔️ | ✔️ |

## Operations

The following tables show support of individual APIs in calling SDK to individual identity types. 

|Operations | Communication Services user | Microsoft 365 user |
| --- | --- | --- |
|Get event that transcription started	| ✔️	| ✔️ | 		
|Get transcription state	 | ✔️	| ✔️ | 
|Start or stop transcription | 	| |
|Learn whether explicit consent is required | ✔️[1]	| ✔️[1] |
|Give explicit consent for being transcribed | ✔️[1]	| ✔️[1] |

[1] This function is available only in Teams meetings and group Teams interoperability calls.

## SDKs

The following tables show support of transcription in individual Azure Communication Services SDKs.

| Platforms | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|-------------|-----|--------|-----|--------|---------|------------|---------|
|Is Supported | ✔️ | ✔️[1] | ✔️[1] | ✔️[1]| ✔️[1]| ✔️[1]| ✔️[1] |

[1] These SDKs don't support explicit consent.

::: zone pivot="platform-web"
[!INCLUDE [Call transcription client-side Web](./includes/call-transcription/call-transcription-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Call transcription client-side Android](./includes/call-transcription/call-transcription-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Call transcription client-side iOS](./includes/call-transcription/call-transcription-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Call transcription client-side Windows](./includes/call-transcription/call-transcription-windows.md)]
::: zone-end

## SDK compatibility

The following table shows the minimum version of SDKs that support individual APIs. 

| Operations | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows | 
|------------|-----|--------|-----|--------|---------|------------|---------|
| Get event that transcription started | 1.0.0, 1.25.3-beta.1 | 1.0.0, 1.0.0-beta.8 | 2.1.0, 2.1.0-beta.1 | 1.0.0, 1.0.0-beta.8 | 1.1.0, 1.2.0-beta.1 | 1.0.0, 1.0.0-beta.8 | 1.0.0, 1.0.0-beta.31 |
| Get transcription state | 1.0.0, 1.25.3-beta.1 | 1.0.0, 1.0.0-beta.8 | 2.1.0, 2.1.0-beta.1 | 1.0.0, 1.0.0-beta.8 | 1.1.0, 1.2.0-beta.1 | 1.0.0, 1.0.0-beta.8 | 1.0.0, 1.0.0-beta.31 |
| Learn whether explicit consent is required | 1.31.2, 1.32.1-beta.1 | ❌ | 2.16.0-beta.1 | ❌ | 2.14.0-beta.1 | ❌ | 1.12.0-beta.1 |
| Give explicit consent for being recorded | 1.31.2, 1.32.1-beta.1 | ❌ | 2.16.0-beta.1 | ❌ | 2.14.0-beta.1 | ❌ | 1.12.0-beta.1 |

## Next steps

- [Learn how to manage video](./manage-video.md)
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to record calls](./record-calls.md)
