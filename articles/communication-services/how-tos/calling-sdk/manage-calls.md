---
title: Manage calls
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage calls.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to manage calls with the Azure Communication Services sdks so that I can create a calling application that manages calls.
---

# Manage calls

Learn how to manage calls with the Azure Communication Services SDKS. We'll learn how to place calls, manage their participants and properties.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with adding calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

## Support

The following tables define support of breakout rooms in Azure Communication Services.

### Identities and call types

The following table shows support of features for specific call type and identity. 

|Identities                   | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|-----------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user	| ✔️	          |  ✔️    |  ✔️        | ✔️           |	                 ✔️     |	✔️                         |
|Microsoft 365 user	          | ✔️	          |      |          |            |     ✔️                   |  ✔️                        |

### Operations

The following table show support for individual APIs in the calling SDK related to individual identity types. 

|Operations                   | Communication Services user | Microsoft 365 user |
|-----------------------------|------------------------------|-------------------|
|Start a call	to Communication Services user	| ✔️	|   |  		
|Start a call	to Microsoft 365 user	| ✔️	| ✔️  |  		
|Start a call	to phone number	| ✔️	| ✔️  |  		
|Join a room	      |✔️ 	|   | 
|Joina a Teams meeting           | ✔️	| ✔️ |
|Join a call based on groupId | ✔️     |    |
|Accept or reject incoming call | ✔️     | ✔️   |
|Hold and resume call | ✔️     | ✔️   |
|Get participants |  ✔️  | ✔️ |
|Add Communication Services user	| ✔️	|   |  		
|Remove Communication Services user	| ✔️	| ✔️  |  		
|Add or remove Microsoft 365 user	| ✔️	| ✔️  |  		
|Add or remove phone number	| ✔️	| ✔️  |  		
|Mute or unmute remote participant | ✔️[1] | ✔️[1] |
|Hang up | ✔️ | ✔️ |
|End the call for everyone | ✔️[2] | ✔️ |

[1] The API is only supported in group calls, rooms and Teams meetings.
[2] The API is not supported in rooms.


### SDKs

The following tables show support for the features in individual Azure Communication Services SDKs.

| Support status | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|----------------|-----|--------|--------|--------|----------|--------|---------|
| Is Supported   | ✔️  |  ✔️   |  ✔️   | ✔️     | ✔️      |  ✔️    | ✔️      |		

::: zone pivot="platform-web"
[!INCLUDE [Manage Calls JavaScript](./includes/manage-calls/manage-calls-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Manage Calls Android](./includes/manage-calls/manage-calls-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Manage Calls iOS](./includes/manage-calls/manage-calls-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Manage Calls Windows](./includes/manage-calls/manage-calls-windows.md)]
::: zone-end

## Next steps
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
