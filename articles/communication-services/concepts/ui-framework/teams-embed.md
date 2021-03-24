---
title: UI Framework Teams Embed
titleSuffix: An Azure Communication Services quickstart
description: In this document, you'll learn how the Azure Communication Services UI Framework Teams Embed capability can be used to build turnkey calling experiences.
author: tophpalmer
ms.author: chpalm
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Teams Embed

[!INCLUDE [Public Preview Notice](../../includes/private-preview-include.md)]


Teams Embed is an Azure Communication Services capability focused on common business-to-consumer and business-to-business calling interactions. The core of the Teams Embed system is [video and voice calling](../voice-video-calling/calling-sdk-features.md), but the Teams Embed system builds on Azure's calling primitives to deliver a complete user experience based on Microsoft Teams meetings.

Teams Embed client libraries are closed-source and make these capabilities available to you in a turnkey, composite format. You drop Teams Embed into your app's canvas and the client library generates a complete user experience. Because this user experience is very similar to Microsoft Teams meetings you can take advantage of:

- Reduced development time and engineering complexity
- End-user familiarity with Teams
- Ability to re-use [Teams end-user training content](https://support.microsoft.com/office/meetings-in-teams-e0b0ae21-53ee-4462-a50d-ca9b9e217b67)

The Teams Embed provides most features supported in Teams meetings, including:

- Pre-meeting experience where a user configures their audio and video devices
- In-meeting experience for configuring audio and video devices
- [Video Backgrounds](https://support.microsoft.com/office/change-your-background-for-a-teams-meeting-f77a2381-443a-499d-825e-509a140f4780): allowing participants to blur or replace their backgrounds
- [Multiple options for the video gallery](https://support.microsoft.com/office/using-video-in-microsoft-teams-3647fc29-7b92-4c26-8c2d-8a596904cdae) large gallery, together mode, focus, pinning, and spotlight
- [Content Sharing](https://support.microsoft.comoffice/share-content-in-a-meeting-in-teams-fcc2bf59-aecd-4481-8f99-ce55dd836ce8#ID0EABAAA=Mobile): allowing participants to share their screen

For more information about this UI compared to other Azure Communication SDKs, see the [UI SDK concept introduction](ui-sdk-overview.md). 
