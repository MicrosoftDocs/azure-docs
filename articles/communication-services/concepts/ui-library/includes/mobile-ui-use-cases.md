---
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/14/2021
---

Use the `CallComposite` and the `ChatComposite` in the Azure Communication Services UI Library to create call experiences in your iOS and Android applications. By using a couple lines of code, you can easily integrate an entire call and chat experience in your application. Composites in Communication Services manage the entire lifecycle of the call and chat, from setup until the call and chat end.

## Calling use cases

You can use the call composite in Communication Services to create these use cases:

| Area                                                                                            | Use cases                                              |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Call types                                                                                | Join a Microsoft Teams meeting                                     |
|                                                                                                 | Join a call by using a group ID   |
| [Teams interoperability](../../teams-interop.md)                     | Join the call lobby                                             |
|                                                                                                 | Display a transcription and recording alert banner               |
| Participant gallery                                                                   | Show remote participants on a grid              |
|                                                                                                 | Make video preview available throughout a call for a local user |
|                                                                                                 | Make default avatars available when video is off            |
|                                                                                                 | Show shared screen content in the participant gallery |
|                                                                                                 | Enable participant avatar customization                |
|                                                                                                 | Show a participant roster                                     |
| Call configuration                                                                    | Manage the microphone device                           |
|                                                                                                 | Manage the camera device                               |
|                                                                                                 | Manage the speaker device (wired or Bluetooth)                              |
|                                                                                                 | Make local preview available for a user to check video       |
| Call controls                                                                            | Mute and unmute a call                                       |
|                                                                                                 | Turn video on or off during a call                                   |
|                                                                                                 | End a call                                               |
|                                                                                                 | Hold and resume a call after audio interruption                 |

### Teams interoperability

For [Teams interoperability](../../teams-interop.md) scenarios, you can use UI Library composites to add a user to a Teams meeting via Communication Services. To enable Teams interoperability, use the call composite. The composite manages the entire lifecycle of joining a Teams interoperability call.

:::image type="content" source="../../media/mobile-ui/teams-interop-diagram.png" border="false" alt-text="Diagram that shows the Teams interoperability pattern for call and chat.":::

The following figure shows an example of the user experience before a caller is added to a Teams meeting:

:::image type="content" source="../../media/mobile-ui/teams-meet.png" alt-text="Screenshot that shows the user experience before a caller is added to a Teams meeting.":::

### View shared content

Through the UI Library for mobile native platforms, call participants can view shared content when other participants share their screens during a Teams call. A remote participant can use stretch and pinch gestures to zoom in or out on the shared content in the call.

### Theming

You can use the UI Library call composite for iOS and Android to create a custom theme of a caller's experience. To create the platform experience, pass a set of theming colors as shown in the following table. For more information, see [How to create your theme](../../../how-tos/ui-library-sdk/theming.md).

| Android                            | iOS                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="../../media/mobile-ui/android-color.png" alt-text="Screenshot that shows Android theming for a caller experience."::: | :::image type="content" source="../../media/mobile-ui/ios-dark.png" alt-text="Screenshot that shows iOS theming for a caller experience.":::  |

### Screen size

You can adapt the Azure Communication Services call composite to adapt to screen sizes from 5 inches to tablet size. Use split mode and tablet mode in the call composite to get the dynamic participants' roster layout, provide clarity on the view, and focus on the conversation.

|Split mode | Tablet mode|
|---------|---------|
| :::image type="content" source="../../media/mobile-ui/meet-splitscreen.png" alt-text="Screenshot that demonstrates a split-screen view."::: |  :::image type="content" source="../../media/mobile-ui/tablet-landscape.png" alt-text="Screenshot that demonstrates tablet mode."::: |

### Localization

Localization is key to making products for users around the world and who speak different languages. UI Library supports 12 languages: English, Spanish, French, German, Italian, Japanese, Korean, Dutch, Portuguese, Russian, Turkish, and Chinese. It also supports right-to-left languages. For more information, see [How to add localization to your app](../../../how-tos/ui-library-sdk/localization.md).

### Accessibility

Accessibility is a key focus of the call libraries. You can use a screen reader to make important announcements about call status and to help ensure that visually impaired users can effectively participate when they use the application.

### View data injection

Use the UI Library for mobile native platforms to give local and remote participants the option to customize how they appear as users in a call. A local participant can choose a local avatar, custom display name, navigation's title and subtitle on Setup screen when a call begins. A remote user can create a customized avatar when they join the meeting. For more information, see [How to customize pre-meeting view](../../../how-tos/ui-library-sdk/data-model.md).

:::image type="content" source="../../media/mobile-ui/ios-composite.gif" alt-text="GIF animation that shows the pre-meeting experience and joining experience on iOS.":::

### Skip Setup Screen

UI Library provides the capability to join a call skipping the setup screen of the call join experience. By default, user goes through a setup screen to join a call. Here, user sets the call configuration such as camera turn on or off, microphone turn on or off and audio device selection before joining a call. This screen requires user interaction to join a call, which might be unnecessary for some users. So we provide the capability to join a call by skipping the setup screen and providing the call configuration APIs. For more information, see [How to use Skip Setup Screen Feature](../../../how-tos/ui-library-sdk/skip-setup-screen.md)

### Orientation

UI Library supports screen orientation setup for each of the screen separately prior to launch the library experience. This allows application developers to set up a fixed orientation for the calling experience which would align their application orientation. To learn more about the list of supported orientation for both Android and iOS platform and usage of the API, see [How to use Orientation Feature](../../../how-tos/ui-library-sdk/orientation.md)

## Chat use cases

[!INCLUDE [Public Preview Notice](../../../includes/public-preview-include.md)]

| Area         | Use cases                                        |
| ------------ | ------------------------------------------------ |
| Chat types   | Join an Azure Communication Services chat thread |
| Chat actions | Send a chat message                              |
|              | Receive a chat message                           |
| Chat events  | Show typing indicators                           |
|              | Show a read receipt                              |
|              | Show when a participant is added or removed      |
|              | Show changes to the chat title                   |

### Flexibility

The `ChatComposite` was designed to fit into different layouts and views in your application. For example, you could choose to place Chat in a navigation view, modal view or some other view. The `ChatComposite` would adjust itself and ensure the user has a seamless experience. 

| In Navigation View                            | In Modal View                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="../../media/mobile-ui/chat-fullscreen.png" alt-text="an image that shows the chat experience on iOS in a navigation view."::: | :::image type="content" source="../../media/mobile-ui/chat-modal.png" alt-text="an image that shows the chat experience on iOS in a modal view.":::  |

## Supported identities

To initialize a composite, and authenticate to the service, a user must have an Azure Communication Services identity. For more information, see [Authenticate to Azure Communication Services](../../authentication.md) and [Quickstart: Create and manage access tokens](../../../quickstarts/identity/access-tokens.md).

## Recommended architecture

Initialize a composite by using an Azure Communication Services access token. It's important to get access tokens from Azure Communication Services through a trusted service that you manage. For more information, see [Quickstart: Create and manage access tokens](../../../quickstarts/identity/access-tokens.md) and the [trusted service tutorial](../../../tutorials/trusted-service-tutorial.md).

:::image type="content" source="../../media/mobile-ui/ui-library-architecture.png" border="false" alt-text="Diagram that shows the recommended architecture for UI Library.":::

Call and chat client libraries must have the context for the call they join. Like user access tokens, disseminate the context to clients by using your own trusted service. The following table summarizes the initialization and resource management functions that are required to add context to a client library:

| Contoso responsibilities                                 | UI Library responsibilities                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| Provide an access token from Azure                          | Pass through the provided access token to initialize components       |
| Provide a refresh function                                 | Refresh the access token by using a developer-provided function          |
| Retrieve and pass join information for the call or chat          | Pass through call and chat information to initialize components |
| Retrieve and pass user information for any custom data model | Pass through a custom data model to components to render          |

## Platform support

|Platform | Versions|
|---------|---------|
| iOS     | iOS 14 and later |
| Android | API 21 and later |

## Troubleshooting guide

When troubleshooting happens for voice or video calls, you may be asked to provide a **CallID**; this ID is used to identify Communication Services calls.

This CallID can be retrieved via the action bar on the bottom of the call screen; you see an ellipsis button; once the user performs the tap action an option of ***"Share diagnostics info"***; the user can share **the diagnostics info** that's required to track any issues by the support team.

For programmatic access to **CallID**, see ["How to get debug information programmatically"](../../../how-tos/ui-library-sdk/troubleshooting.md).

You can learn more about troubleshooting guidelines here: ["Troubleshooting in Azure Communication Services"](../../troubleshooting-info.md) page.

| Calling screen | Diagnostic info menu | Share CallID |
| ------------------| ------------------------| ----------- |
| :::image type="content" source="media/ui-library-callscreen.png" border="false" alt-text="Screenshot of the call screen during the call."::: | :::image type="content" source="media/ui-library-callscreen-diagnostics-info.png" border="false" alt-text="Screenshot of the call screen with the diagnostic options location."::: |  :::image type="content" source="media/ui-library-callscreen-diagnostics-info-share.png" border="false" alt-text="Screenshot of showing share Call ID with Contoso.":::|

> [!div class="nextstepaction"]
> [Quickstart guides](../../../quickstarts/ui-library/get-started-composites.md)
