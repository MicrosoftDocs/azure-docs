---
title: Teams Meeting Audio Conferencing
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to retrieve Teams Meeting Audio Conferencing Details
author: cnwankwo
ms.author: cnwankwo
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 09/28/2023
ms.custom: template-how-to
---


# Microsoft Teams Meeting Audio Conferencing 
In this article, you learn how to use Azure Communication Services Calling SDK to retrieve Microsoft Teams Meeting Audio Conferencing details. This functionality allows users who are already connected to a Microsoft Teams Meeting to be able to get the conference ID and dial in phone number associated with the meeting. Teams Meeting Audio Conferencing feature returns a collection of all toll and toll-free numbers, with concomitant country names and city names, giving users control on what Teams meeting dial-in details to use.

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

## Support
The following tables define support for Audio Conferencing in Azure Communication Services.

### Identities & call types
The following table shows support for call and identity types. 

|Identities                                         | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|--------------------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user	| ✔️	          |      |          |            |	                      |	                         |
|Microsoft 365 user	                        | ✔️	          |      |          |            |                        |                          |

### Operations
The following table shows support for individual APIs in calling SDK for individual identity types. 

|Operations                   | Communication Services user | Microsoft 365 user |
|-----------------------------|------------------------------|-------------------|
|Get audio conferencing details		| ✔️	| ✔️  |  	

### SDKs
The following table shows support for the Audio Conferencing feature in individual Azure Communication Services SDKs.

|  Platforms     | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|---------------|-----|--------|--------|--------|----------|--------|---------|
|Is Supported | ✔️  |        |        |        |          |        |         |		

[!INCLUDE [Audio Conferencing Client-side JavaScript](./includes/audio-conferencing/audio-conferencing-web.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
