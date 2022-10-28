---
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/14/2021
---

Use the call composite in the Azure Communication Services UI Library to create call experiences in your for iOS and Android applications. By using a couple lines of code, you can easily integrate an entire call experience in your application. Composites in Communication Services manage the entire lifecycle of the call, from setup until the call ends.

## Call use cases

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

## Supported identities

To initialize a composite and authenticate to the service, a user must have an Azure Communication Services identity. For more information, see [Authenticate to Azure Communication Services](../../authentication.md) and [Quickstart: Create and manage access tokens](../../../quickstarts/access-tokens.md).

## Teams interoperability

For [Teams interoperability](../../teams-interop.md) scenarios, you can use UI Library composites to add a user to a Teams meeting via Communication Services. To enable Teams interoperability, use the call composite. The composite manages the entire lifecycle of joining a Teams interoperability call.

:::image type="content" source="../../media/mobile-ui/teams-interop-diagram.png" border="false" alt-text="Diagram that shows the Teams interoperability pattern for call and chat.":::

The following figure shows an example of the user experience before a caller is added to a Teams meeting:

:::image type="content" source="../../media/mobile-ui/teams-meet.png" alt-text="Screenshot that shows the user experience before a caller is added to a Teams meeting.":::

## View shared content

Through the UI Library for mobile native platforms, call participants can view shared content when other participants share their screens during a Teams call. A remote participant can use stretch and pinch gestures to zoom in or out on the shared content in the call.

## Theming

You can use the UI Library call composite for iOS and Android to create a custom theme of a caller's experience. To create the platform experience, pass a set of theming colors as shown in the following table. For more information, see [How to create your theme](../../../how-tos/ui-library-sdk/theming.md).

| Android                            | iOS                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="../../media/mobile-ui/android-color.png" alt-text="Screenshot that shows Android theming for a caller experience."::: | :::image type="content" source="../../media/mobile-ui/ios-dark.png" alt-text="Screenshot that shows iOS theming for a caller experience.":::  |

## Screen size

You can adapt the Azure Communication Services call composite to adapt to screen sizes from 5 inches to tablet size. Use split mode and tablet mode in the call composite to get the dynamic participants' roster layout, provide clarity on the view, and focus on the conversation.

|Split mode | Tablet mode|
|---------|---------|
| :::image type="content" source="../../media/mobile-ui/meet-splitscreen.png" alt-text="Screenshot that demonstrates a split-screen view."::: |  :::image type="content" source="../../media/mobile-ui/tablet-landscape.png" alt-text="Screenshot that demonstrates tablet mode."::: |

## Localization

Localization is key to making products for users around the world and who speak different languages. UI Library supports 12 languages: English, Spanish, French, German, Italian, Japanese, Korean, Dutch, Portuguese, Russian, Turkish, and Chinese. It also supports right-to-left languages. For more information, see [How to add localization to your app](../../../how-tos/ui-library-sdk/localization.md).

## Accessibility

Accessibility is a key focus of the call libraries. You can use a screen reader to make important announcements about call status and to help ensure that visually impaired users can effectively participate when they use the application.

## Participant view data injection

Use the UI Library for mobile native platforms to give local and remote participants the option to modify how they appear as users in a call. A local participant can choose a local avatar and custom display name when a call begins. A remote user can create a customized avatar when they join the meeting. For more information, see [How to customize participant views](../../../how-tos/ui-library-sdk/data-model.md).

:::image type="content" source="../../media/mobile-ui/ios-composite.gif" alt-text="GIF animation that shows the pre-meeting experience and joining experience on iOS.":::

## Recommended architecture

Initialize a composite by using an Azure Communication Services access token. It's important to get access tokens from Azure Communication Services through a trusted service that you manage. For more information, see [Quickstart: Create and manage access tokens](../../../quickstarts/access-tokens.md) and the [trusted service tutorial](../../../tutorials/trusted-service-tutorial.md).

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

> [!div class="nextstepaction"]
> [Quickstart guides](../../../quickstarts/ui-library/get-started-composites.md)
