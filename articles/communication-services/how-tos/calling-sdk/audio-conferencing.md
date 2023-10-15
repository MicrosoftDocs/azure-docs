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


# Teams Meeting Audio Conferencing 
In this article, you'll learn how to use Azure Communication Services Calling SDK to retrieve Microsoft Teams meeting audio conferencing details. This functionality allows users who are already connected to a Teams Meeting to be able to get the conference ID and dial in phone number associated to the Teams Meeting. At this point in time, the Teams audio conferencing feature will return a conference ID and only one dial-in phone number

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)
- Policy settings to configure service number for audio conferencing [Audio Conferencing Policy Configuration](https://learn.microsoft.com/en-us/microsoftteams/set-up-audio-conferencing-in-teams)

[!INCLUDE [Audio Conferencing Client-side JavaScript](./includes/audio-conferencing/audio-conferencing-web.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
