---
title: UI Library use cases
titleSuffix: An Azure Communication Services concept document
description: Learn about the UI Library and how it can help you build communication experiences
author: ddematheu2
manager: chrispalm
services: azure-communication-services

ms.author: dademath
ms.date: 05/11/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# UI Library use cases

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

> [!NOTE]
> For detailed documentation on the UI Library visit the [ UI Library Storybook ](https://azure.github.io/communication-ui-sdk). There you will find additional conceptual documentation, quickstarts and examples.


UI Library supports a number of use cases across calling and chat experiences.
These capabilities are available through UI Components and Composites.
For Composites, these capabilities are built directly in and exposed when the composite is integrated into an application.

For UI Components, these capabilities are exposed through a combination of UI functionality and underlying stateful libraries.

To take full advantage of these capabilities we recommend using the UI Components in conjunction with the stateful call and chat client libraries.

## Calling use cases

| Area                | Use Cases                                              |
| ------------------- | ------------------------------------------------------ |
| Call Types          | Join Teams Meeting                                     |
|                     | Join Azure Communication Services call with Group Id   |
| Teams Interop       | Call Lobby                                             |
|                     | Transcription and recording alert banner               |
| Call Controls       | Mute/unmute call                                       |
|                     | Video on/off on call                                   |
|                     | Screen Sharing                                         |
|                     | End call                                               |
| Participant Gallery | Remote participants are displayed on grid              |
|                     | Video preview available throughout call for local user |
|                     | Default avatars available when video is off            |
|                     | Shared screen content displayed on participant gallery |
| Call configuration  | Microphone device management                           |
|                     | Camera device management                               |
|                     | Speaker device management                              |
|                     | Local preview available for user to check video        |
| Participants        | Participant roster                                     |

## Chat use cases

| Area         | Use Cases                                        |
| ------------ | ------------------------------------------------ |
| Chat Types   | Join a Teams Meeting Chat                        |
|              | Join an Azure Communication Services chat thread |
| Chat Actions | Send chat message                                |
|              | Receive chat message                             |
| Chat Events  | Typing Indicators                                |
|              | Read Receipt                                     |
|              | Participant added/removed                        |
|              | Chat title changed                               |
| Participants | Participant roster                               |

## Supported identities

An Azure Communication Services identity is required to initialize the stateful client libraries and authenticate to the service.
For more information on authentication, see [Authentication](../authentication.md) and [Access Tokens](../../quickstarts/access-tokens.md?pivots=programming-language-javascript)

## Customization

UI Library exposes patterns for developers to modify components to fit the look and feel of their application.
This is a key area of differentiation between Composites and UI Components, where Composites provide less customization options in favor of a simpler integration experience.

| Use Case                                            | Composites | UI Components |
| --------------------------------------------------- | ---------- | ------------- |
| Fluent based Theming                                | X          | X             |
| Experience layout is composable                     |            | X             |
| CSS Styling can be used to modify style properties  |            | X             |
| Icons can be replaced                               |            | X             |
| Participant gallery layout can be modified          |            | X             |
| Call control layout can be modified                 | X          | X             |
| Data models can be injected to modify user metadata | X          | X             |

## Observability

As part of the decoupled state management architecture of the UI Library, developers are able to access the stateful calling and chat clients directly.

Developers can hook into the stateful client to read the state, handle events and override behavior to pass onto the UI Components.

| Use Case                                  | Composites | UI Components |
| ----------------------------------------- | ---------- | ------------- |
| Call/Chat client state can be accessed    | X          | X             |
| Client events can be accessed and handled | X          | X             |
| UI events can be accessed and handled     | X          | X             |

## Recommended architecture

:::image type="content" source="../media/ui-library-architecture.png" alt-text="UI Library recommended client-server architecture":::

Composite and Base Components are initialized using an Azure Communication Services access token. Access tokens should be procured from Azure Communication Services through a
trusted service that you manage. See [Quickstart: Create Access Tokens](../../quickstarts/access-tokens.md?pivots=programming-language-javascript) and [Trusted Service Tutorial](../../tutorials/trusted-service-tutorial.md) for more information.

These client libraries also require the context for the call or chat they will join. Similar to user access tokens, this context should be disseminated to clients via your own trusted service. The list below summarizes the initialization and resource management functions that you need to operationalize.

| Contoso Responsibilities                                 | UI Library Responsibilities                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| Provide access token from Azure                          | Pass through given access token to initialize components        |
| Provide refresh function                                 | Refresh access token using developer provided function          |
| Retrieve/Pass join information for call or chat          | Pass through call and chat information to initialize components |
| Retrieve/Pass user information for any custom data model | Pass through custom data model to components to render          |

## Platform support

| SDK    | Windows            | macOS                | Ubuntu   | Linux    | Android  | iOS        |
| ------ | ------------------ | -------------------- | -------- | -------- | -------- | ---------- |
| UI SDK | Chrome\*, new Edge | Chrome\*, Safari\*\* | Chrome\* | Chrome\* | Chrome\* | Safari\*\* |

\*Note that the latest version of Chrome is supported in addition to the
previous two releases.

\*\*Note that Safari versions 13.1+ are supported. Outgoing video for Safari
macOS is not yet supported, but it is supported on iOS. Outgoing screen sharing
is only supported on desktop iOS.

## Accessibility

Accessibility by design is a principle across Microsoft products.
UI Library follows this principle in making sure that all UI Components are fully accessible.
During public preview, the UI Library will continue to improve and add accessibility feature to the UI Components.
We expect to add more details on accessibility ahead of the UI Library being in General Availability.

## Localization

Localization is a key to making products that can be used across the world and by people who who speak different languages.
UI Library will provide out of the box support for some languages and capabilities such as RTL.
Developers can provide their own localization files to be used for the UI Library.
These localization capabilities will be added ahead of General Availability.

> [!div class="nextstepaction"]
> [Visit UI Library Storybook](https://azure.github.io/communication-ui-sdk)
