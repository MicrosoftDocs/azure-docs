---
title: UI Framework Meetings
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to join an Teams meeting with the Azure Communication Calling SDK
author: tophpalmer
ms.author: chpalm
ms.date: 11/16/2020
ms.topic: quickstart
ms.service: azure-communication-services

---

# Meetings

Meetings is an Azure Communication Services capability focused on common business-to-consumer and business-to-business meeting experiences. The core of the meeting system is video and voice calling, but the meetings system includes several unique capabilities:

1. **Together Mode**, allowing multiple participants to be composed in a single video feed
2. [Blurred Backgrounds](https://support.microsoft.com/office/change-your-background-for-a-teams-meeting-f77a2381-443a-499d-825e-509a140f4780), allowing participants to blur or replace their backgrounds
3. **Raised Hands**, allowing participants to non-disruptively respond conversation 

Meeting SDKs are closed source and make these capabilities available to you in a turn-key, composite format; you drop meetings into your app's canvas and the SDK generates a complete user experience. This user experience intentionally very similar to Microsoft Team's meetings, and takes advantage of collaboration between Azure Communication Services and Teams.

For more information about this UI compared to other Azure Communication SDKs, see the [UI SDK concept introduction](ui-sdk-overview.md). 

