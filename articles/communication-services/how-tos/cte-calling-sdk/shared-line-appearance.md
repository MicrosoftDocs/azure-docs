---
title: Tutorial - Teams Shared Line Appearance
description: Use Microsoft Teams Shared Line Appearance with Azure Communication Services Calling SDK.
author: charithgunaratna
ms.author: charithg
ms.service: azure-communication-services
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 02/04/2025
---

# Teams Shared Line Appearance

This article describes how to implement Microsoft Teams Shared Line Appearance with Azure Communication Services. Shared line appearance lets a user choose a delegate to make or handle calls on their behalf. This feature is helpful if a user has an administrative assistant who regularly handles the user's calls.

In the context of shared line appearance, a manager is a Teams user who authorizes a delegate to make or receive calls on their behalf. A delegate is a Microsoft 365 user who can make or receive calls on behalf of the delegator. For more information, see [Share line appearance](/microsoftteams/shared-line-appearance).

## Prerequisites

- An Azure account with an active subscription. See [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. See [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Licensing requirements for delegator and delegates. See [Teams Phone license](/microsoftteams/shared-line-appearance#license-required).
- Enable delegation and shared line appearance. See [Enable delegation](/microsoftteams/shared-line-appearance#enable-delegation-and-shared-line-appearance).
- Assign delegates using [Microsoft Teams Client](https://support.microsoft.com/office/share-a-phone-line-with-a-delegate-in-microsoft-teams-16307929-a51f-43fc-8323-3b1bf115e5a8) or [Teams PowerShell](/microsoftteams/shared-line-appearance#use-powershell).
- Learn more about [Team Shared Line Appearance in Azure Communication Services](../../concepts/interop/teams-user/teams-shared-line-appearance.md).
- Optional: Complete the quickstart to add voice calling to Microsoft Teams user. See [Quickstart: Add voice calling to Microsoft Teams user](../../quickstarts/voice-video-calling/get-started-call-to-teams-user.md).

## Support

### SDKs

The following table shows support for the shared line appearance feature in individual Azure Communication Services SDKs.

| Support status | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
|----------------|-----|--------|--------|--------|----------|--------|---------|
| Is Supported   | ✔️  |        |        |        |          |        |         |

[!INCLUDE [Shared line appearance Client-side JavaScript](./includes/shared-line-appearance/shared-line-appearance-web.md)]

## Next steps

- [Learn how to manage calls](./manage-calls.md)