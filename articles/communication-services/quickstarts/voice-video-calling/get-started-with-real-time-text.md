---
title: Real Time Text
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for the Real Time Text feature, enabling near-real-time text communication during calls.
author: ahammer
ms.author: adamhammer
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to
ms.date: 12/4/2024
ms.custom: template-how-to
zone_pivot_groups: acs-programming-languages-java-swift-csharp
---



# Real Time Text

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

Learn how to integrate Real Time Text (RTT) into your calling applications to enhance accessibility and ensure that all participants can communicate effectively during meetings.

RTT allows users who have difficulty speaking to participate actively by typing their messages, which are then broadcast in near real-time to other meeting participants. This feature operates seamlessly alongside existing captions and ensures that typed messages are promptly delivered without disrupting the flow of conversation.

## Real Time Text Feature Overview

Real Time Text (RTT) is designed to facilitate communication for users who may have difficulty speaking during calls. By allowing users to type their messages, RTT ensures that everyone in the meeting can stay engaged and informed. Messages are transmitted over Data Channels (ID 24) and are always active, appearing automatically when the first message is sent.

On supported platforms, RTT data can be displayed alongside captions derived from Speech to Text, providing a comprehensive view of all communications during a call.

## Naming Conventions

Different platforms may use varying terminology for RTT-related properties. Below is a summary of these differences:

| Mobile (Android/iOS) | Windows (C#)  |
| -------------------- | ------------- |
| **Type**             | **Kind**      |
| **Info**             | **Details**   |

These aliases are functionally equivalent and are used to maintain consistency across different platforms.

## RealTimeTextInfo/Details Class

The `RealTimeTextInfo` (or `RealTimeTextDetails` on Windows) class encapsulates information about each RTT message. Below are the key properties:

| Property          | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `SequenceId`      | Unique identifier for the message sequence.          |
| `Text`            | The content of the RTT message.                      |
| `Sender`          | Information about the sender of the message.          |
| `ResultType`/<br>`Kind` | Indicates whether the message is partial or final. |
| `IsLocal`         | Determines if the message was sent by the local user. |
| `ReceivedTime`    | Timestamp when the message was received.              |
| `UpdatedTime`     | Timestamp when the message was last updated.          |


::: zone pivot="programming-language-java"
[!INCLUDE [Real Time Text with Android](./includes/real-time-text/real-time-text-android.md)]
::: zone-end

::: zone pivot="programming-language-swift"
[!INCLUDE [Real Time Text with iOS](./includes/real-time-text/real-time-text-ios.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Real Time Text with Windows](./includes/real-time-text/real-time-text-windows.md)]
::: zone-end


## Next steps

For more information, see the following articles:

- [Azure Communication Services Calling Documentation](../../concepts/voice-video-calling/calling-sdk-features.md)
