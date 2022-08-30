---
author: ddematheu2
ms.author: dademath
ms.date: 06/30/2021
ms.topic: include
ms.service: azure-communication-services
---

Use the UI Library to create calling and chat experiences through the Azure Communication Services UI components and composites. In a composite, capabilities are built in directly and exposed when the composite is integrated into an application. In a UI components, capabilities are exposed through a combination of UI functionality and underlying stateful libraries. To take full advantage of these capabilities, we recommend that you use UI components with stateful call and chat client libraries.

Visit [UI Library Storybook](https://azure.github.io/communication-ui-library) for more conceptual documentation, quickstarts, and examples.

## Call use cases

| Area                | Use cases                                              |
| ------------------- | ------------------------------------------------------ |
| Call types          | Join a Microsoft Teams meeting                                     |
|                     | Join Azure Communication Services call by using a group ID   |
| [Teams interoperability](../../teams-interop.md)      | Call lobby                                             |
|                     | Transcription and recording alert banner               |
| Call controls       | Mute and unmute call                                       |
|                     | Video on and video off during a call                                   |
|                     | Screen sharing                                         |
|                     | End call                                               |
| Participant gallery | Remote participants are displayed on a grid              |
|                     | Video preview available throughout call for local user |
|                     | Default avatars available when video is off            |
|                     | Shared screen content displayed in participant gallery |
| Call configuration  | Microphone device management                           |
|                     | Camera device management                               |
|                     | Speaker device management                              |
|                     | Local preview available for user to check video        |
| Participants        | Participant roster                                     |

## Chat use cases

| Area         | Use cases                                        |
| ------------ | ------------------------------------------------ |
| Chat types   | Join a Microsoft Teams meeting chat                        |
|              | Join an Azure Communication Services chat thread |
| Chat actions | Send a chat message                                |
|              | Receive a chat message                             |
| Chat events  | Typing indicators                                |
|              | Read receipt                                     |
|              | Participant added or removed                        |
|              | Chat title changed                               |
| Participants | Participant roster                               |

## Supported identities

To initialize a composite and authenticate to the service, a user must have an Azure Communication Services identity. For more information, see [Authenticate to Azure Communication Services](../../authentication.md) and [Quickstart: Create and manage access tokens](../../../quickstarts/access-tokens.md).

## Teams interoperability

For [Teams interoperability](../../teams-interop.md) scenarios, you can use UI Library composites to join a user to a Teams meeting via Communication Services. To enable Teams interoperability, use either call and chat composites directly, or use UI components to build a custom experience.

When you add both calling and chat to an application, it's important to remember that the chat client can't be initialized until the participant is admitted to the call. After the participant is admitted, the chat client can be initialized to join the meeting chat thread. The pattern is demonstrated in the following figure:

:::image type="content" source="../../media/teams-interop-pattern.png" border="false" alt-text="Diagram that shows the Teams interoperability pattern for calling and chat.":::

If you use UI components to deliver Teams interoperability experiences, begin by using UI Library examples to create key pieces of the experience:

- [Lobby Example](https://azure.github.io/communication-ui-library/?path=/story/examples-teams-interop--lobby): A sample lobby where a participant can wait to be admitted to a call.
- [Compliance banner](https://azure.github.io/communication-ui-library/?path=/story/examples-teams-interop--compliance-banner): A sample banner that shows the user if the call is being recorded.
- [Teams theme](https://azure.github.io/communication-ui-library/?path=/story/examples-themes--teams): A sample theme that makes UI Library look like Microsoft Teams.

## Customization

Use UI Library patterns to modify components to fit the look and feel of your application. These capabilities are a key area of differentiation between Communication Services composites and UI components. Composites have fewer customization options so that they have a simpler integration experience.

| Use case                                            | Composites | UI components |
| --------------------------------------------------- | ---------- | ------------- |
| Use Fluent-based theming                                | X          | X             |
| Compose the experience layout                     |            | X             |
| Use CSS styling modify style properties  |            | X             |
| Replace icons                               |            | X             |
| Modify the participant gallery layout          |            | X             |
| Modify the call control layout                 | X          | X             |
| Inject data models can to modify user metadata | X          | X             |

## Observability

The state management architecture of UI Library is decoupled, so you can access the stateful calling and chat clients directly. You can hook into the stateful client to read the state, handle events, and override behavior to pass onto the UI components.

| Use case                                  | Composites | UI components |
| ----------------------------------------- | ---------- | ------------- |
| Access call and chat client state    | X          | X             |
| Access and handle client events | X          | X             |
| Access and handle UI events     | X          | X             |

## Recommended architecture

:::image type="content" source="../../media/ui-library-architecture.png" alt-text="UI Library recommended client-server architecture":::

Initialize a composite and base components by using an Azure Communication Services access token. It's important to get access tokens from Azure Communication Services through a trusted service that you manage. For more information, see [Quickstart: Create and manage access tokens](../../../quickstarts/access-tokens.md) and the [trusted service tutorial](../../../tutorials/trusted-service-tutorial.md).

These client libraries also require the context for the call or chat they join. Like user access tokens, disseminate the context to clients by using your own trusted service. The following table summarizes the initialization and resource management functions to operationalize to add context to a client library:

| Contoso responsibilities                                 | UI Library responsibilities                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| Provide an access token from Azure                          | Pass through the provided access token to initialize components       |
| Provide a refresh function                                 | Refresh access token by using developer-provided function          |
| Retrieve and pass join information for the call or chat          | Pass through call and chat information to initialize components |
| Retrieve and pass user information for any custom data model | Pass through a custom data model to components to render          |

## Platform support

| SDK    | Windows            | macOS                | Ubuntu   | Linux    | Android  | iOS        |
| ------ | ------------------ | -------------------- | -------- | -------- | -------- | ---------- |
| UI SDK | Chrome\*, Microsoft Edge | Chrome\*, Safari\*\* | Chrome\* | Chrome\* | Chrome\* | Safari\*\* |

\* The current version of Chrome and the two preceding releases are supported.

\*\* Safari version 13.1 and later versions are supported. Outgoing video for Safari macOS is not yet supported, but it is supported on iOS. Outgoing screen sharing is supported only on desktop iOS.

## Accessibility

Accessibility by design is a principle across Microsoft products. UI Library follows this principle, and all UI components are fully accessible.

## Localization

Localization is key to making products for users around the world and who speak different languages. UI Library provides default support for some languages and capabilities, including right-to-left languages. You can provide their own localization files to use with UI Library.

> [!div class="nextstepaction"]
> [Visit UI Library Storybook](https://azure.github.io/communication-ui-library)
