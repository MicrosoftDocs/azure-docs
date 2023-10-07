---
title: Azure Communication Services End of Call Survey
titleSuffix: An Azure Communication Services tutorial document
description: Learn how to use the End of Call Survey to collect user feedback.
author: amagginetti
ms.author: amagginetti
manager: mvivion
services: azure-communication-services
ms.date: 4/03/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-plat-web-ios-android-windows
---

# Use the End of Call Survey to collect user feedback

This tutorial shows you how to use the Azure Communication Services End of Call Survey.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource. [Create a Communication Services resource](../quickstarts/create-communication-resource.md). Survey results are tied to single Communication Services resources.
- An active Log Analytics Workspace, also known as Azure Monitor Logs. See [End of Call Survey Logs](../concepts/analytics/logs/end-of-call-survey-logs.md).
- To conduct a survey with custom questions using free form text, you need an [App Insight resource](../../azure-monitor/app/create-workspace-resource.md#create-a-workspace-based-resource).

::: zone pivot="platform-web"
[!INCLUDE [End of Call Survey for Web](./includes/end-of-call-survey-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [End of Call Survey for Android](./includes/end-of-call-survey-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [End of Call Survey for iOS](./includes/end-of-call-survey-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [End of Call Survey for Windows](./includes/end-of-call-survey-windows.md)]
::: zone-end