---
title: Quickstart - Teams interop on Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to join an Teams meeting with the Azure Communication Calling SDK.
author: chpalm
ms.author: chpalm
ms.date: 03/10/2021
ms.topic: quickstart
ms.service: azure-communication-services

zone_pivot_groups: acs-plat-web-ios-android
---

# Quickstart: Join your calling app to a Teams meeting

> [!IMPORTANT]
> To enable/disable [Teams tenant interoperability](../../concepts/teams-interop.md), complete [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR21ouQM6BHtHiripswZoZsdURDQ5SUNQTElKR0VZU0VUU1hMOTBBMVhESS4u).

Get started with Azure Communication Services by connecting your calling solution to Microsoft Teams using the JavaScript client library.

::: zone pivot="platform-web"
[!INCLUDE [Calling with JavaScript](./includes/teams-interop-javascript.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Calling with Android](./includes/teams-interop-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Calling with iOS](./includes/teams-interop-ios.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Learn about [calling client library capabilities](./calling-client-samples.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
