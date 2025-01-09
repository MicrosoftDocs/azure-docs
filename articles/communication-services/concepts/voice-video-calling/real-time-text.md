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

>[!NOTE]
>RTT is an accessibility compliance requirement for voice and video platforms in the EU. You can find more information about this here: [Directive 2019/882](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882)

Real Time Text (RTT) provides developers with the ability to transmit text in near real-time during a call. This feature is designed to empower individuals who have difficulty speaking, ensuring their text messages are displayed prominently to other meeting participants, similar to spoken communication. RTT enhances accessibility by allowing participants to communicate effectively through typed messages that are broadcast instantly character by character, without having to press a "send" key. 

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

### Privacy Concerns
Real-Time Text (RTT) is only available during the call or meeting. Azure Communication Services doesn't store these text exchanges anywhere. Many countries/regions and states have laws and regulations that apply to the storing of data. It is your responsibility to use RTT in compliance with the law should you choose to store any of the data generated through RTT. You must obtain consent from the parties involved in a manner that complies with the laws applicable to each participant.

Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chats. It is your responsibility to ensure that the users of your application are notified when RTT is enabled in a Teams call or meeting and being stored.

Microsoft indicates to you via the Azure Communication Services API that recording or RTT has commenced, and you must communicate this fact, in real-time, to your users within your application's user interface. You agree to indemnify Microsoft for all costs and damages incurred due to your failure to comply with this obligation.

## Next Steps

- Get started with a [Quickstart Guide](../../quickstarts/voice-video-calling/get-started-with-real-time-text.md)
- Learn more about [Closed captions](../../concepts/voice-video-calling/closed-captions.md)
- Explore the [UI Library](../ui-library/ui-library-overview.md)
