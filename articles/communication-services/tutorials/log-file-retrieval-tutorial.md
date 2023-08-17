---
title: Log File Retrieval
titleSuffix: An Azure Communication Services tutorial
description: Learn how to retrieve Log Files from the Calling SDK for enhanced supportability.
author: adamhammer
manager: jamcheng
services: azure-communication-services

ms.author: adamhammer
ms.date: 06/30/2021
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: identity
zone_pivot_groups: acs-programming-languages-java-swift-csharp
---

# Retrieval and Sharing of support file tutorial.
[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

In this tutorial, you will learn how to access the Log Files stored on the device.

## Prerequisites

- Access to a `CallClient` instance, on Windows, iOS or Android

::: zone pivot="programming-language-java"
[!INCLUDE [Android](./includes/log-file-retrieval-android.md)]
::: zone-end

::: zone pivot="programming-language-swift"
[!INCLUDE [iOS](./includes/log-file-retrieval-ios.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Windows](./includes/log-file-retrieval-windows.md)]
::: zone-end

## Next steps

To add enhanced log collection capabilities to your app, please consider the following.

1. Explore support features: 
   - "Report an Issue" prompts
   - End-of-call surveys
   - Shake-to-report
   - Proactive auto-detection
2. Always obtain user consent before submitting data.
3. Customize strategies based on your users.

Please Refer to the [Conceptual Document](../concepts/voice-video-calling/retrieving-support-files.md) for more in-depth guidance.

## You may also like

- [Retrieve log files Conceptual Document](../concepts/voice-video-calling/retrieving-support-files.md)
- [End of call Survey](./end-of-call-survey-tutorial.md)
- [User Facing Diagnostics](../concepts/voice-video-calling/user-facing-diagnostics.md)