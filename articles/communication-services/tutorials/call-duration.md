---
title: Manage the call duration events using Calling SDKs
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services Calling SDKs to handle call duration events
author: garchiro7

ms.author: jorgegarc
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 09/01/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android-windows
---

# Manage call duration

Provides developers with the capability to programmatically trigger and track events when a call starts. Capturing the initiation of a call enables businesses to execute crucial workflows, including logging call metadata, initiating timers for duration tracking, or triggering user interface updates to reflect the real-time call status.

## Start time

The ability to use **call start time events** allows developers to capture and utilize the exact time a call is initiated. By subscribing to these events, developers gain valuable insights that can be applied in various use cases, such as performance tracking and user experience enhancements, among other uses.

### Use cases

#### Enhanced user experience
Developers can use the call start time to display call duration to users in real time, improving the user experience by providing transparency on how long the user has been in the call.

**Example:** In a video conferencing app, the UI can display an active call timer showing how long the participants have been in the meeting, increasing user engagement.

By utilizing the call start time API events, developers can build more robust, feature-rich applications that improve the user experience, ensure compliance, and support detailed performance monitoring.

#### Performance and monitoring analytics
By retrieving the call start time, developers can measure call duration and integrate with monitoring systems to analyze the performance of calls. This information is crucial for identifying call quality issues, optimizing network performance, and understanding user behavior.

**Example:** A customer support center can track how long agents stay on calls and identify trends related to call durations, improving resource management.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- A deployed Communication Services resource. [Create a Communication Services resource](../quickstarts/create-communication-resource.md)
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../quickstarts/voice-video-calling/getting-started-with-calling.md)

::: zone pivot="platform-android"
[!INCLUDE [Manage Call duration events using Android](./includes/call-duration/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Manage Call duration events using iOS](./includes/call-duration/ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Manage Call duration events using Windows](./includes/call-duration/windows.md)]
::: zone-end

## Next steps

- [Learn how to manage calls](../how-tos/calling-sdk/manage-calls.md)
- [Learn about the UI Library](../concepts/ui-library/ui-library-overview.md)
