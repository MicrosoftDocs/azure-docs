---
title: Log file retrieval
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
ms.custom: devx-track-extended-java
zone_pivot_groups: acs-programming-languages-java-swift-csharp
---

# Log File Access tutorial
[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

In this tutorial, you learn how to access the Log Files stored on the device with the Calling SDK.

## Prerequisites

- Access to a `CallClient` instance

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

Refer to the [integrating support document](../concepts/voice-video-calling/retrieve-support-files.md) for more in depth look at how to structure an end to end support flow. This document helps direct you to the tools available to you in order to create an effective support flow in your Applications.

## You may also like

## Tutorials
- [End of call Survey](./end-of-call-survey-tutorial.md)
- [Support form integration with the ACS UI Library](./collecting-user-feedback/collecting-user-feedback.md)

## Concept Docs
- [User feedback in native calling scenarios](../concepts/voice-video-calling/retrieve-support-files.md)
- [User Facing Diagnostics](../concepts/voice-video-calling/user-facing-diagnostics.md)
