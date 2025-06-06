---
title: Quickstart - Add pre-call diagnostics to your app
titleSuffix: An Azure Communication Services quickstart
description: This quickstart describes how to add pre-call diagnostics capabilities to your app using Azure Communication Services.
author: yassirbisteni
manager: bobgao
ms.author: yassirb
ms.date: 12/12/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-plat-web-windows-android-ios
ms.custom: mode-other, devx-track-js
---

# Quickstart: Add pre-call diagnostics to your app

::: zone pivot="platform-web"
[!INCLUDE [Pre-call diagnostics with JavaScript](./includes/pre-call-diagnostics/pre-call-diagnostics-javascript.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Pre-call diagnostics with Windows](./includes/pre-call-diagnostics/pre-call-diagnostics-windows.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Pre-call diagnostics with Android](./includes/pre-call-diagnostics/pre-call-diagnostics-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Pre-call diagnostics with iOS](./includes/pre-call-diagnostics/pre-call-diagnostics-ios.md)]
::: zone-end

## Pricing

When the pre-call diagnostic test runs behind the scenes, it uses calling minutes to run the diagnostic. The test lasts for roughly 30 seconds, using up 30 seconds of calling time which is charged at the standard rate of $0.004 per participant per minute. For the case of pre-call diagnostics, the charge is for 1 participant x 30 seconds = $0.002.

## Next steps

- [Check your network condition with the diagnostics tool](../../concepts/developer-tools/network-diagnostic.md).
- [Explore User-Facing Diagnostic APIs](../../concepts/voice-video-calling/user-facing-diagnostics.md).
- [Enable Media Quality Statistics in your application](../../concepts/voice-video-calling/media-quality-sdk.md).
- [Consume call logs with Azure Monitor](../../concepts/analytics/logs/voice-and-video-logs.md).

## Related articles

- Check out the [calling hero sample](../../samples/calling-hero-sample.md).
- Get started with the [UI Library](../../concepts/ui-library/ui-library-overview.md).
- Learn about [Calling SDK capabilities](./getting-started-with-calling.md?pivots=platform-web).
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md).