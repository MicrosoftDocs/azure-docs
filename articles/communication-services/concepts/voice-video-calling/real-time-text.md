---
title: Real Time Text (RTT) Overview
titleSuffix: An Azure Communication Services concept document
description: Learn about Real Time Text (RTT) in Azure Communication Services.
author: ahammer
ms.date: 12/4/2024
ms.author: adamhammer
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Real Time Text (RTT) Overview

Real Time Text (RTT) provides developers with the ability to transmit text in near real-time during a call. This feature is designed to empower individuals who have difficulty speaking, ensuring their text messages are displayed prominently to other meeting participants, similar to spoken communication. RTT enhances accessibility by allowing participants to communicate effectively through typed messages that are broadcasted instantly.

Here are the main scenarios where Real Time Text (RTT) is useful:

## Common Use Cases

### Building Accessible Experiences

RTT aids in creating inclusive communication platforms by enabling users with speech impairments to participate fully in calls. By providing a text-based communication channel that operates in real-time, RTT ensures that all participants can engage equally, regardless of their ability to speak.

### Enhancing Communication Clarity

In scenarios where speech clarity is compromised due to background noise or technical limitations, RTT serves as a reliable alternative to convey messages clearly. This ensures that critical information is communicated without misunderstandings.

## When to Use Real Time Text (RTT)

- **Accessibility Requirements:** When developing applications that need to comply with accessibility standards, enabling RTT ensures that users with speech difficulties can participate effectively.
- **High-Noise Environments:** In settings where audio quality may be affected by background noise, RTT provides a clear and reliable means of communication.

## RealTimeTextInfo/Details Class

The `RealTimeTextInfo` (or `RealTimeTextDetails` on certain platforms) class is pivotal in managing RTT messages. It encapsulates all necessary information about each RTT message, including the sender, content, sequence identifier, result type, timestamps, and whether the message originates locally.

### Properties and Fields

- **Sender:** Provides information about the user who sent the RTT message.
- **SequenceId:** A unique identifier that maintains the order of messages.
- **Text:** The actual content of the RTT message.
- **ResultType/Kind:** Indicates whether the message is partial (`ResultType`) or finalized (`Kind`), determining if it can be edited.
- **ReceivedTime:** Timestamp marking when the message was received.
- **UpdatedTime:** Timestamp indicating the last update to the message.
- **IsLocal:** A boolean flag indicating if the message was sent by the local user.

### Usage

Developers can subscribe to RTT events through a single event subscription, allowing them to manage their own list and ordering of RTT messages. This approach aligns with the Captions API, facilitating easier integration and maintenance. The UI is responsible for binding the data to the screen, managing the display list, and handling text input interactions based on message finalization.

## Next Steps

- Get started with a [Quickstart Guide](../../quickstarts/RTTQuickstart.md)
- Learn more about using Real Time Text in [Accessible Communications](../accessible-communications/RTTIntegration.md)
- Explore the [UI Library](../ui-library/ui-library-overview.md)