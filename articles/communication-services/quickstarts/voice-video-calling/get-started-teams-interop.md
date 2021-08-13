---
title: Quickstart - Teams interop on Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to join an Teams meeting with the Azure Communication Calling SDK.
author: chpalm
ms.author: chpalm
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services

zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Quickstart: Join your calling app to a Teams meeting

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

Get started with Azure Communication Services by connecting your calling solution to Microsoft Teams using the JavaScript SDK.

::: zone pivot="platform-web"
[!INCLUDE [Calling with JavaScript](./includes/teams-interop/teams-interop-javascript.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Calling with Windows](./includes/teams-interop/teams-interop-windows.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Calling with Android](./includes/teams-interop/teams-interop-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Calling with iOS](./includes/teams-interop/teams-interop-ios.md)]
::: zone-end

Functionality described in this document uses the General Availability version of the Communication Services SDKs. Teams Interoperability requires the Beta version of the Communication Services SDKs. The Beta SDKs can be explored on the [release notes page](https://github.com/Azure/Communication/tree/master/releasenotes).

When executing the "Install package" step with the Beta SDKs, modify the version of your package to the latest Beta release by specifying version `@1.0.0-beta.10` (version at the moment of writing this article) in the `communication-calling` package name. You don't need to modify the `communication-common` package command. For example:

```console
npm install @azure/communication-calling@1.0.0-beta.10 --save
```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Check out our [calling hero sample](../../samples/calling-hero-sample.md)
- Learn about [Calling SDK capabilities](./calling-client-samples.md)
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
