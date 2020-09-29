---
title: Quickstart - Call To Phone
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to add PSTN calling capabilities to your app using Azure Communication Services.
author: nikuklic
ms.author: nikuklic
ms.date: 09/11/2020
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-web-ios-android
---

# Quickstart: Call To Phone
[!INCLUDE [Emergency Calling Notice](../../includes/emergency-calling-notice-include.md)]

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

> [!WARNING]
> This document is under construction and needs the following items to be addressed: 
> - Client team should approve android/ios syntax and validate style of JS

Get started with Azure Communication Services by using the Communication Services calling client library to add PSTN calling to your app. 

::: zone pivot="platform-web"
[!INCLUDE [Calling with JavaScript](./includes/pstn-call-js.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Calling with Android](./includes/pstn-call-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Calling with iOS](./includes/pstn-call-ios.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Learn about [calling client library capabilities](./calling-client-samples.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
