---
title: Enable closed captions for Teams interop
titleSuffix: An Azure Communication Services article
description: This article describes how to enable closed captions during a call.
author: kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.date: 06/28/2025
ms.author: kpunjabi
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Enable closed captions for Teams interop

Provide your users with the option to enable closed captions during a Teams interoperability scenario. If your users are in a meeting between an Azure Communication Services user and a Teams client user, or when your users are using Azure Communication Services calling SDK with their Microsoft 365 identity.

::: zone pivot="platform-windows"
[!INCLUDE [Closed captions with Windows](./includes/closed-captions/closed-captions-teams-interop-windows.md)]
::: zone-end

::: zone pivot="platform-web"
[!INCLUDE [Closed captions with TypeScript](./includes/closed-captions/closed-captions-teams-interop-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Closed captions with Android](./includes/closed-captions/closed-captions-teams-interop-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Closed captions with iOS](./includes/closed-captions/closed-captions-teams-interop-ios.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources here](../../quickstarts/create-communication-resource.md#clean-up-resources). 

## Next steps

- Learn about [Voice](./manage-calls.md) and [Video calling](./manage-video.md).
- Learn about [Teams interoperability](./teams-interoperability.md).
- Learn more about Microsoft Teams [live translated captions](https://support.microsoft.com//office/use-live-captions-in-a-teams-meeting-4be2d304-f675-4b57-8347-cbd000a21260).
- Learn more about the [UI Library](../../concepts//ui-library/ui-library-overview.md).
