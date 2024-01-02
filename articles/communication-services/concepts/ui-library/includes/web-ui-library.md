---
title: Web UI Library overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Web UI Library.
author: RinaRish
manager: chrispalm
services: azure-communication-services

ms.author: ektrishi
ms.date: 06/30/2021
ms.topic: include
ms.service: azure-communication-services
---

> [!NOTE]
> For detailed documentation on the Web UI Library visit the [**Web UI Library Storybook**](https://azure.github.io/communication-ui-library). There you will find additional conceptual documentation, quickstarts and examples.

- **Composites.** 
  These components are turn-key solutions that implement common communication scenarios. You can quickly add video calling or chat (currently only available over Web UI Library) experiences to your applications. Composites are open-source higher-order components built using UI components.

- **UI Components.**
  These components are open-source building blocks that let you build custom communications experience. Components are offered for both calling and chat capabilities that can be combined to build experiences.

These UI client libraries all use [Microsoft's Fluent design language](https://developer.microsoft.com/fluentui/) and assets. Fluent UI provides a foundational layer for the UI Library and is actively used across Microsoft products.

In conjunction to the UI components, the UI Library exposes a stateful client library for calling and chat.
This client is agnostic to any specific state management framework and can be integrated with common state managers like Redux or React Context.
This stateful client library can be used with the UI Components to pass props and methods for the UI Components to render data. For more information, see [Stateful Client Overview](https://azure.github.io/communication-ui-library/?path=/docs/statefulclient-overview--page).

> [!NOTE]
> The same components and composites offered in the UI Library are available in the [Design Kit for Figma](https://www.figma.com/community/file/1095841357293210472), so you can quickly design and prototype your calling and chat experiences.  

## Composites overview

Composites are higher-level components composed of UI components that deliver turn-key solutions for common communication scenarios using Azure Communication Services.
Developers can easily instantiate the Composite using an Azure Communication Services access token and the required configuration attributed for call or chat.

| Composite    | Use Cases  | 
| ------------ | ---------- |
| [CallwithChatComposite](https://azure.github.io/communication-ui-library/?path=/docs/composites-call-with-chat-basicexample--basic-example) | Experience combining calling and chat features to allow users to start or join a call and chat thread. In the experience, the user has the ability to both communicate using voice and video, and access to a rich chat thread where messages can be exchanged between participants. It includes support for Teams Interop. |
| [CallComposite](https://azure.github.io/communication-ui-library/?path=/docs/composites-call-basicexample--basic-example) | Calling experience that allows users to start or join a call. Inside the experience users can configure their devices, participate in the call with video, and see other participants, including those participants with video turn-on. For Teams Interop, is included lobby functionality for user to wait to be admitted. |
| [ChatComposite](https://azure.github.io/communication-ui-library/?path=/docs/composites-chat-basicexample--basic-example)    | Chat experience where user can send and receive messages. Thread events like typing, reads, participants entering and leaving are displayed to the user as part of the chat thread.                                                                                                                          |
## UI Component overview

Pure UI Components can be used for the developers, to compose communication experiences, from stitching video tiles into a grid to showcase remote participants, to organizing components to fit your applications specifications.
UI Components support customization to give the components the right feel and look to match an applications branding and style.

| Area    | Component    | Description       |
| ------- | ------------ | ----------------- |
| Calling | [Grid Layout](https://azure.github.io/communication-ui-library/?path=/story/ui-components-gridlayout--grid-layout)                | Grid component to organize Video Tiles into an NxN grid                                            |
|         | [Video Tile](https://azure.github.io/communication-ui-library/?path=/story/ui-components-videotile--video-tile)                   | Component that displays video stream when available and a default static component when not        |
|         | [Control Bar](https://azure.github.io/communication-ui-library/?path=/story/ui-components-controlbar--control-bar)                | Container to organize DefaultButtons to hook up to specific call actions like mute or share screen |
|         | [VideoGallery](https://azure.github.io/communication-ui-library/?path=/story/ui-components-video-gallery--video-gallery)                                           | Turn-key video gallery component, which dynamically changes as participants are added               |
|         | [Dialpad](https://azure.github.io/communication-ui-library/?path=/docs/ui-components-dialpad--dialpad) | Component to support phone number input and DTMF tones. |
| Chat    | [Message Thread](https://azure.github.io/communication-ui-library/?path=/story/ui-components-messagethread--message-thread)       | Container that renders chat messages, system messages, and custom messages                          |
|         | [Send Box](https://azure.github.io/communication-ui-library/?path=/story/ui-components-sendbox--send-box)                         | Text input component with a discrete send button                                                   |
|         | [Message Status Indicator](https://azure.github.io/communication-ui-library/?path=/story/ui-components-messagestatusindicator--message-status-indicator)        | Multi-state read receipt component to show state of sent message                                   |
|         | [Typing indicator](https://azure.github.io/communication-ui-library/?path=/story/ui-components-typingindicator--typing-indicator) | Text component to render the participants who are actively typing on a thread                      |
| Common  | [Participant Item](https://azure.github.io/communication-ui-library/?path=/story/ui-components-participantitem--participant-item) | Common component to render a call or chat participant including avatar and display name            |
|         | [Participant List](https://azure.github.io/communication-ui-library/?path=/story/ui-components-participantlist--participant-list)                                 | Common component to render a call or chat participant list including avatar and display name       |

## Installing Web UI Library

Stateful clients are found as part of the `@azure/communication-react` package.

```bash
npm i --save @azure/communication-react
```

## What UI artifact is best for my project?

Understanding these requirements help you choose the right client library:

- **How much customization do you desire?** Azure Communication core client libraries don't have a UX and are designed so you can build whatever UX you want. UI Library components provide UI assets at the cost of reduced customization.
- **What platforms are you targeting?** Different platforms have different capabilities.

Details about feature availability in the [UI Library is available here](https://azure.github.io/communication-ui-library/?path=/story/use-cases--page), but key trade-offs are summarized in the next table.

| Client library / SDK  | Implementation Complexity | Customization Ability | Calling | Chat | [Teams Interop](../../teams-interop.md) |
| --------------------- | ------------------------- | --------------------- | ------- | ---- | ----------------------------------------------------------------------------------------------------- |
| Composite Components  | Low                       | Low                   | ✔       | ✔    | ✔                                                                                                     |
| Base Components       | Medium                    | Medium                | ✔       | ✔    | ✔                                                                                                     |
| Core client libraries | High                      | High                  | ✔       | ✔    | ✔                                                                                                     |

> [!div class="nextstepaction"]
> [Visit UI Library Storybook](https://azure.github.io/communication-ui-library)
 
