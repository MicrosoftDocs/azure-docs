---
title: Enable Closed captions during a call
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide enabling Closed captions during a call.
author: kunaal
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.date: 03/20/2023
ms.author: kpunjabi
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Enable Closed captions for Teams interoperability

Learn how to allow your users to enable closed captions during a Teams interoperability scenario where your users might be in a meeting between an Azure Communication Services user and a Teams client user, or where your users are using Azure Communication Services calling SDK with their Microsoft 365 identity. 

[!INCLUDE [Public Preview](../../../communication-services/includes/public-preview-include.md)]

::: zone pivot="platform-windows"
[!INCLUDE [Closed captions with Windows](./includes/closed-captions/closed-captions-teams-interop-windows.md)]
::: zone-end

::: zone pivot="platform-web"
[!INCLUDE [Closed captions with Typescript](./includes/closed-captions/closed-captions-teams-interop-web.md)]
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

For more information, see the following articles:
- Learn about [Voice](./manage-calls.md) and [Video calling](./manage-video.md).
- Learn about [Teams interoperability](./teams-interoperability.md).
- Learn more about Microsoft Teams [live translated captions](https://support.microsoft.com//office/use-live-captions-in-a-teams-meeting-4be2d304-f675-4b57-8347-cbd000a21260).
