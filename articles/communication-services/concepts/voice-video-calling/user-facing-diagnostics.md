---
title: Azure Communication Services User Facing Diagnostics
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the User Facing Diagnostics feature.
author: tophpalmer
ms.author: chpalm
manager: chpalm

services: azure-communication-services
ms.date: 10/21/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-plat-web-ios-android-windows
---
# User Facing Diagnostics
When working with calls in Azure Communication Services, you may encounter issues that affect your customers. To help with this, Azure Communication Services provides a feature called "User Facing Diagnostics" (UFD) that can be used to examine various properties of a call to determine what the issue might be. User Facing Diagnostics are events that are fired off that could indicate due to some underlying issue (poor network, user has their microphone muted) that a user might have a poor experience. After a User Facing Diagnostic is fired, you should consider giving feedback to an end-user that they might be having some underlying issue. However, the User Facing Diagnostic output is informational only, and the calling stack does not make any changes based on a User Facing Diagnostic being fired.

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
