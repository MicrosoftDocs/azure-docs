---
title: Mobile UI Library
titleSuffix: An Azure Communication Services - Mobile UI Library
description: In this document, introduce the Mobile UI Library
author: jorgegarc

ms.author: jorgegarc
ms.date: 09/14/2021
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../includes/public-preview-include.md)]

- **Composites.** 
  These components are turn-key solutions that implement common communication scenarios. You can quickly add video calling experience to your applications. Composites are open-source higher-order components this developer can take advantage of the reduced development time and engineering complexity.

## Composites overview

| Composite                                                                   | Use Cases                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [CallComposite](../../../quickstarts/ui-library/get-started-composites.md)  | Calling experience that allows users to start or join a call. Inside the experience users can configure their devices, participate in the call with video, and see other participants, including those ones with video turned on. For Teams Interop, lobby functionality in included so users can wait to be admitted. |

## Scenarios

### Joining a video/audio call

Users can join easily over the call using the *Teams meeting URL* or they can set up an Azure Communication Services Call to a simpler and great experience, just like the Teams application. Adding the capability for the user to be part of extensive live video or audio call, without losing the experience of the simplicity and focusing in what really matters.

### Pre-call experience

As a participant of the calls, you can provide a name and set up a default configuration for audio and video devices, and you're ready to jump into the call.

:::image type="content" source="../../media/mobile-ui/teams-meet.png" alt-text="Pre-meeting experience.":::

### Call experience

The calling composite provide an end two end experience, optimizing development time, and focusing into a clean layout.  

:::image type="content" source="../../media/mobile-ui/calling-composite.png" alt-text="Meeting experience.":::

**The calling experience provides all these capabilities in one single composite component, providing a clear path without complex code which leads to faster development time.**

### Quality and security

Mobile Composites are initialized using [Azure Communication Services access tokens](../../../quickstarts/access-tokens.md).

### More details

If you need more details about mobile composites, please visit [use cases site](../ui-library-use-cases.md) to discover more.

## What UI Artifact is Best for my Project?

Understanding these requirements will help you choose the right client library:

- **How much customization do you desire?** Azure Communication core client libraries don't have a UX and are designed so you can build whatever UX you want. UI Library components provide UI assets at the cost of reduced customization.

- **What platforms are you targeting?** Different platforms have different capabilities.

Details about the feature availability in the [UI Library is available here](../ui-library-use-cases.md), but key trade-offs are summarized below.

| Client library / SDK  | Implementation Complexity | Customization Ability | Calling |  [Teams Interop](../../teams-interop.md) |
| --------------------- | ------------------------- | --------------------- |  ---- | ----------------------------------------------------------------------------------------------- |
| Composite Components  | Low                       | Low                   |         ✔    | ✔                                                                                               |
| [Core client libraries](../../voice-video-calling/calling-sdk-features.md#detailed-capabilities) | High                      | High                  |         ✔    | ✔                                                                                               |

> [!div class="nextstepaction"]
> [Quickstart guides](../../../quickstarts/ui-library/get-started-composites.md)

## Known issues

- [iOS known issues](https://github.com/Azure/communication-ui-library-ios/wiki/Known-Issues)
- [Android known issues](https://github.com/Azure/communication-ui-library-android/wiki/Known-Issues)
