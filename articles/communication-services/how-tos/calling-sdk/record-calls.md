---
title: Manage call recording on the client
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage call recording on the client.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.topic: how-to
ms.subservice: calling 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to manage call recording on the client so that my users can record calls.
---

# Manage call recording on the client

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

[Call recording](../../concepts/voice-video-calling/call-recording.md) lets your users record calls that they make with Azure Communication Services. In this article, you learn how to manage recording on the client side. Before you start, you need to set up recording on the [server side](../../quickstarts/voice-video-calling/call-recording-sample.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart to add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md).

## Support
The following tables define support of recording in Azure Communication Services.
 
### Identities and call types
The following tables show support of recording for specific call type and identity.

|Identities                   | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|-----------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user	 | ✔️[1][2]     |✔️[3]|          |✔️[3]       |                        |✔️[2][3]|
|Microsoft 365 user	          | ✔️[1][2]     |      |         |            |                         |✔️[2][3]|

[1] These call types support Teams cloud.
[2] These call types support Teams compliance recording.  
[3] These call types support Azure Communication Services recording.
 
### Operations
The following tables show support of individual APIs in calling SDK to individual identity types.

|Operations                   | Communication Services user | Microsoft 365 user |
|-----------------------------|------------------------------|-------------------|
|Get notification that recording started or stopped	| ✔️	| ✔️  |  		
|Get state of recording                | ✔️	| ✔️  | 
|Get notification that recording is available              | ✔️[1]	| ✔️[1] |
|Learn whether explicit consent is required | ✔️[2]	| ✔️[2]  |
|Give explicit consent for being recorded | ✔️[2]	| ✔️[2]  |

[1] A user is not notified that recording is available. You can subscribe to Microsoft Graph's change notifications for notification about availability of Teams cloud recording or you can subscribe to `Microsoft.Communication.RecordingFileStatusUpdated` event in Azure Communication Services to be notified when Azure Communication Services recording is available.
  
[2] This functionality is available only in Teams meetings and group Teams interoperability calls.
 
### SDKs
The following tables show support of recording in individual Azure Communication Services SDKs.

|Platforms   | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|-------------|-----|--------|-----|--------|---------|------------|---------|
|Is Supported | ✔️  |  ✔️[1]| ✔️[1] | ✔️[1]| ✔️[1]| ✔️[1]|  ✔️[1]    |	

[1] These SDKs don't support explicit consent.

::: zone pivot="platform-web"
[!INCLUDE [Record Calls Client-side JavaScript](./includes/record-calls/record-calls-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Record calls client-side Android](./includes/record-calls/record-calls-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Record calls client-side iOS](./includes/record-calls/record-calls-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Record calls client-side Windows](./includes/record-calls/record-calls-windows.md)]
::: zone-end

## Next steps

- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to transcribe calls](./call-transcription.md)
