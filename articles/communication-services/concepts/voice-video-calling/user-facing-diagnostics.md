---
title: Azure Communication Services User Facing Diagnostics
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the User Facing Diagnostics feature.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 06/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-plat-web-ios-android-windows
---
# User Facing Diagnostics
When working with calls in Azure Communication Services, you might encounter issues that affect your customers. To help with this, Azure Communication Services provides a feature called User Facing Diagnostics (UFD) that you can use to examine various properties of a call to determine the issue.

User Facing Diagnostics are events that indicate some underlying issue, such as poor network quality or a user has their microphone muted. The UFDs can cause a user to have a poor experience. After a User Facing Diagnostic fire, consider giving feedback to the end-user about the underlying issue. However, the User Facing Diagnostic output is informational only, and the calling stack doesn't make any changes based on a User Facing Diagnostic being fired.

::: zone pivot="platform-web"
[!INCLUDE [User Facing Diagnostic for Web](./includes/user-facing-diagnostics-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [User Facing Diagnostic for Android](./includes/user-facing-diagnostics-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [User Facing Diagnostic for iOS](./includes/user-facing-diagnostics-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [User Facing Diagnostic for Windows](./includes/user-facing-diagnostics-windows.md)]
::: zone-end
