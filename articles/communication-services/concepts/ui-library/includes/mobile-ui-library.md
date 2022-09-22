---
title: UI Library for Mobile native platforms
titleSuffix: An Azure Communication Services - UI Library for Mobile native platforms
description: In this document, introduce the UI Library for Mobile native platforms
author: jorgegarc

ms.author: jorgegarc
ms.date: 5/27/2022
ms.topic: include
ms.service: azure-communication-services
ms.custom: kr2b-contr-experiment
---

*Composites* are turn-key solutions that implement common communication scenarios. You can add video calling experiences to your applications. Composites are open-source higher-order components that developers can take advantage of to reduce development time and engineering complexity.

## Composites overview

| Composite | Use Cases |
| :-------- | :-------- |
| [CallComposite](../../../quickstarts/ui-library/get-started-composites.md)  | Calling experience that allows users to start or join a call. Inside the experience, users can configure their devices, participate in the call with video, and see other participants, including those ones with video turned on. For Teams interoperability, `CallComposite` includes lobby functionality so that users can wait to be admitted. |

## Composites scenarios

### Joining a video/audio call

Users can join a call using the *Teams meeting URL* or they can set up an Azure Communication Services Call. This approach offers a simpler experience, just like the Teams application.

:::image type="content" source="../../media/mobile-ui/android-composite.gif" alt-text="Gif animation shows the pre-meeting experience and joining experience on Android.":::

### Pre-call experience

As a participant of the call, you can provide a name and set up a default configuration for audio and video devices. Then you're ready to jump into the call.

:::image type="content" source="../../media/mobile-ui/teams-meet.png" alt-text="Screenshot shows the pre-meeting experience, a page with a message for the participant.":::

### Call experience

The calling composite provides an end-to-end experience, optimizes development time, and focuses on clean layout.  

:::image type="content" source="../../media/mobile-ui/calling-composite.png" alt-text="Screenshot shows the meeting experience, with icons or video of participants.":::

The calling experience provides all these capabilities in one composite component, providing a clear path without complex code, which leads to faster development time.

### Quality and security

Mobile composites are initialized using [Azure Communication Services access tokens](../../../quickstarts/access-tokens.md).

### More details

If you need more details about mobile composites, see [use cases](../ui-library-use-cases.md).

## What UI artifact is best for my project?

These requirements help you choose the right client library:

- **How much customization do you desire?** Azure Communication Services core client libraries don't have a UX and are designed so you can build whatever UX you want. UI Library components provide UI assets at the cost of reduced customization.

- **What platforms are you targeting?** Different platforms have different capabilities.

Here are some key trade-offs:

| Client library / SDK  | Implementation complexity | Customization ability | Calling | [Teams interoperability](../../teams-interop.md) |
| :-------------------- | :-----------------------: | :-------------------: | :-----: | :----------------------------------------------: |
| Composite Components  | Low                       | Low                   | ✔      |  ✔  |
| [Core client libraries](../../voice-video-calling/calling-sdk-features.md#detailed-capabilities) | High | High | ✔    | ✔      |

For more information about feature availability in the UI Library, see [UI Library use cases](../ui-library-use-cases.md).

> [!div class="nextstepaction"]
> [Quickstart guides](../../../quickstarts/ui-library/get-started-composites.md)

## Known issues

- [iOS known issues](https://github.com/Azure/communication-ui-library-ios/wiki/Known-Issues)
- [Android known issues](https://github.com/Azure/communication-ui-library-android/wiki/Known-Issues)
