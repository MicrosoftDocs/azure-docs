---
author: RinaRish
ms.author: ektrishi
ms.date: 06/30/2021
ms.topic: include
ms.service: azure-communication-services
---

Use components and composites in the Azure Communication Services UI Library to create call and chat experiences in your applications. 

In a composite, call and chat capabilities are built in directly and exposed when you integrate the composite into an application. In a UI component, call and chat capabilities are exposed through a combination of UI functionality and underlying stateful libraries. To take full advantage of these capabilities, we recommend that you use UI components with stateful call and chat client libraries.

Get more conceptual documentation, quickstarts, and examples in the [UI Library storybook](https://azure.github.io/communication-ui-library).

## Call use cases

| Area                | Use cases                                              |
| ------------------- | ------------------------------------------------------ |
| Call types          | Join a Microsoft Teams meeting                                     |
|                     | Join an Azure Communication Services call by using a group ID   |
|                     | Join an Azure Communication Services [Room](../../rooms/room-concept.md) |
|                     | Start an outbound call to another Azure Communication Services user |
|                     | Start an outbound call to a [phone number](../../telephony/telephony-concept.md#voice-calling-pstn) |
| [Teams interoperability](../../teams-interop.md)      | Join the call lobby                                             |
|                     | Display a transcription and recording alert banner               |
| Call controls       | Mute and unmute a call                                       |
|                     | Turn video on and off during a call                                   |
|                     | Turn on screen sharing                                         |
|                     | End a call                                               |
| Participant gallery | Show remote participants on a grid              |
|                     | Make video preview available throughout a call for a local user |
|                     | Make default avatars available when video is off            |
|                     | Show shared screen content in the participant gallery |
| Call configuration  | Manage the microphone device                          |
|                     | Manage the camera device                               |
|                     | Manage the speaker device                              |
|                     | Make local preview available for user to check video        |
| Participants        | Show a participant roster                                     |

## Chat use cases


| Area         | Azure Communication Services Chat                | Teams Interoperability Chat                 |
| ------------ | ------------------------------------------------ | ------------------------------------------- |
| Chat types   | Join an Azure Communication Services chat thread | Join a Microsoft Teams meeting chat         |
| Chat actions | Send and receive text messages                      | Send and receive text messages                 |
|              | Receive rich text messages                          | Receive rich text messages                     |
|              | -                                                | [Receive inline images\*](../../../tutorials/inline-image-tutorial-interop-chat.md)                        |
|              | [Send and receive file attachments](../../../tutorials/file-sharing-tutorial-acs-chat.md)                   | [Receive file attachments\*](../../../tutorials/file-sharing-tutorial-interop-chat.md)                 |
| Chat events  | Send and receive typing indicators                  | Send and receive typing indicators\*\*             |
|              | Send and receive read receipts                      | Send and receive read receipts                 |
|              | Show when a participant is added or removed      | Show when a participant is added or removed |
| Participants | Show a participant roster                        | Show a participant roster                   |


\*Inline image and file attachment support are currently in public preview. Preview APIs and SDKs are provided without a service-level agreement. We recommend that you don't use them for production workloads. Some features might not be supported, or they might have constrained capabilities. For more information, review [Supplemental Terms of Use for Microsoft Azure Previews.](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

\*\*The display name of typing event from the Teams user might not be shown properly.

## Supported identities

To initialize a composite, and authenticate to the service, a user must have an Azure Communication Services identity. For more information, see [Authenticate to Azure Communication Services](../../authentication.md) and [Quickstart: Create and manage access tokens](../../../quickstarts/identity/access-tokens.md).


## Teams interoperability

For [Teams interoperability](../../teams-interop.md) scenarios, you can use UI Library composites to add a user to a Teams meeting via Communication Services. To enable Teams interoperability, use either the default features in the call composite or the chat composite, or use UI components to build a custom experience.

When you add both calling and chat to an application, it's important to remember that the chat client can't be initialized until the participant is admitted to the call. After the participant is admitted, the chat client can be initialized to join the meeting chat thread. The pattern is demonstrated in the following figure:

:::image type="content" source="../../media/teams-interop-pattern.png" border="false" alt-text="Diagram that shows the Teams interoperability pattern for calling and chat.":::

If you use UI components to deliver Teams interoperability experiences, begin by using UI Library examples to create key pieces of the experience:

- [Lobby example](https://azure.github.io/communication-ui-library/?path=/story/examples-teams-interop--lobby). A sample lobby where a participant can wait to be admitted to a call.
- [Compliance banner](https://azure.github.io/communication-ui-library/?path=/story/examples-teams-interop--compliance-banner). A sample banner that shows the user if the call is being recorded.
- [Teams theme](https://azure.github.io/communication-ui-library/?path=/story/examples-themes--teams). A sample theme that makes UI Library elements look like Microsoft Teams.
- [Image sharing\*](../../../tutorials/inline-image-tutorial-interop-chat.md). A sample of Azure Communication Service end user can receive images sent by the Teams user.
- [File sharing\*](../../../tutorials/file-sharing-tutorial-interop-chat.md). A sample of Azure Communication Service end user can receive file attachments sent by the Teams user. 

## Customization

Use UI Library patterns to modify components to match the look and feel of your application. Customization is a key difference between composites and UI components in Communication Services. Composites have fewer customization options for a simpler integration experience.

The following table compares composites and UI components for customization use cases:

| Use case                                            | Composites | UI components |
| --------------------------------------------------- | ---------- | ------------- |
| Use Fluent-based theming                                | X          | X             |
| Compose the experience layout                     |            | X             |
| Use CSS styling to modify style properties  |            | X             |
| Replace icons                               |            | X             |
| Modify the participant gallery layout          |            | X             |
| Modify the call control layout                 | X          | X             |
| Inject data models to modify user metadata | X          | X             |

## Observability

The state management architecture of UI Library is decoupled, so you can access stateful call and chat clients directly. You can hook into the stateful client to read the state, handle events, and override behavior to pass onto the UI components.

The following table compares composites and UI components for observability use cases:

| Use case                                  | Composites | UI components |
| ----------------------------------------- | ---------- | ------------- |
| Access call and chat client state    | X          | X             |
| Access and handle client events | X          | X             |
| Access and handle UI events     | X          | X             |

## Recommended architecture

Initialize a composite and base component by using an Azure Communication Services access token. It's important to get access tokens from Communication Services through a trusted service that you manage. For more information, see [Quickstart: Create and manage access tokens](../../../quickstarts/identity/access-tokens.md) and the [trusted service tutorial](../../../tutorials/trusted-service-tutorial.md).

:::image type="content" source="../../media/mobile-ui/ui-library-architecture.png" border="false" alt-text="Diagram that shows the recommended UI Library architecture.":::

Call and chat client libraries must have the context for the call or chat they join. Like user access tokens, disseminate the context to clients by using your own trusted service.

The following table summarizes initialization and resource management functions that are required to add context to a client library:

| Contoso responsibilities                                 | UI Library responsibilities                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| Provide an access token from Azure                          | Pass through the provided access token to initialize components       |
| Provide a refresh function                                 | Refresh the access token by using a developer-provided function          |
| Retrieve and pass join information for the call or chat          | Pass through call and chat information to initialize components |
| Retrieve and pass user information for any custom data model | Pass through a custom data model to components to render          |

## Platform support

| SDK    | Windows            | macOS                | Ubuntu   | Linux    | Android  | iOS        |
| ------ | ------------------ | -------------------- | -------- | -------- | -------- | ---------- |
| UI SDK | Chrome\*, Microsoft Edge | Chrome\*, Safari\*\* | Chrome\* | Chrome\* | Chrome\* | Safari\*\* |

\* The current version of Chrome and the two preceding releases are supported.

\*\* Safari version 13.1 and later versions are supported. Outgoing video for Safari macOS isn't yet supported, but it's supported for iOS. Outgoing screen sharing is supported only on desktop iOS.

## Accessibility

Accessibility by design is a principle across Microsoft products. UI Library follows this principle, and all UI components are fully accessible.

## Localization

Localization is key to making products for users around the world and who speak different languages. UI Library provides default support for some languages and capabilities, including right-to-left languages. You can provide their own localization files to use with UI Library.

> [!div class="nextstepaction"]
> [Visit UI Library storybook](https://azure.github.io/communication-ui-library)
