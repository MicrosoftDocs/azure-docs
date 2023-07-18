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

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

# Retrieval and Sharing of support file tutorial.

In this tutorial, you learn how to implement a basic log sharing mechanism.

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

From here, you want to consider creating a more robust error reporting flow to ensure the correct issues are escalated in a low-friction way. For ideas on how to implement further, refer to the conceptual document.

## You may also like

- [Retrieve log files Conceptual Document](../concepts/voice-video-calling/retrieving-support-files.md)
- [End of call Survey](./end-of-call-survey-tutorial.md)
- [User Facing Diagnostics](../concepts/voice-video-calling/user-facing-diagnostics.md)
