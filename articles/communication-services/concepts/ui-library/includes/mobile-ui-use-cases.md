---
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/14/2021
---

Use `CallComposite` and `ChatComposite` in Azure Communication Services UI Library to create call experiences in your iOS and Android applications. By using a couple lines of code, you can easily integrate an entire call and chat experience in your application. Composites in Azure Communication Services manage the entire lifecycle of the call and chat, from setup until the call and chat end.

## Calling use cases

Use the call composite in Azure Communication Services to create these use cases.

| Area                                                                 | Use cases                                                       |
| -------------------------------------------------------------------- | --------------------------------------------------------------- |
| [Call types](#call-integration)                                                           | Join a Microsoft Teams meeting.                                  |
|                                                                      | Join a Microsoft Teams meeting by using a meeting ID and passcode.    |
|                                                                      | Join a call by using a group ID.                                 |
|                                                                      | Join a call by using a room  ID.                                 |
|                                                                      | [Make and receive 1:1 calls](#one-to-one-call-and-push-notification-support).                                     |
| [Teams interoperability](../../teams-interop.md)                     | Join the call lobby.                                             |
|                                                                                                 | Display a transcription and recording alert banner.               |
|                                                                                                 | Admit or reject lobby participants.                                 |
| [Closed Captions](#closed-captions)                                                             | Teams interoperability.                                      |
|                                                                                                 | Group call, rooms call, and 1:1 call.                                       |
| Participant gallery                                                                   | Show remote participants on a grid.              |
|                                                                                                 | Make video preview available throughout a call for a local user. |
|                                                                                                 | Make default avatars available when video is off.            |
|                                                                                                 | Show shared screen content in the participant gallery. |
|                                                                                                 | Enable participant avatar customization.                |
|                                                                                                 | Show a participant roster.                                     |
| Call management                                                                    | Manage the microphone device.                           |
|                                                                                                 | Manage the camera device.                               |
|                                                                                                 | Manage the speaker device (wired or Bluetooth).                              |
|                                                                                                 | Make local preview available for a user to check video.       |
|                                                                                                 | [Subscribe events](#events).       |
| Call controls                                                                            | Mute and unmute a call.                                       |
|                                                                                                 | Turn video on or off during a call.                                   |
|                                                                                                 | End a call.                                               |
|                                                                                                 | Hold and resume a call after audio interruption.                 |
|                                                                                                 | [CallKit and TelecomManager support](#os-integrations).                 |
| [Customize the experience](#customize-the-call-experience)                                      | Button bar customization.                                        |
|                                                                                                 | Title and subtitle configuration.                                        |
|                                                                                                 | Enable end call confirmation dialogue.                 |
|                                                                                                 | Skip setup screen.                 |

## Call integration

This section discusses integration for calls.

### Teams interoperability

For [Teams interoperability](../../teams-interop.md) scenarios, you can use UI Library composites to add a user to a Teams meeting via Azure Communication Services. To enable Teams interoperability, use the call composite. The composite manages the entire lifecycle of joining a Teams interoperability call.

:::image type="content" source="../../media/mobile-ui/teams-interop-diagram.png" border="false" alt-text="Diagram that shows the Teams interoperability pattern for call and chat.":::

The following figure shows an example of the user experience before a caller is added to a Teams meeting.

:::image type="content" source="../../media/mobile-ui/teams-meet.png" alt-text="Screenshot that shows the user experience before a caller is added to a Teams meeting.":::

### Rooms integration

Azure Communication Services provides a concept of a room for developers who are building structured conversations, such as virtual appointments or virtual events. Rooms currently allow voice and video calling.

A room is a container that manages activity between Azure Communication Services users. A room offers application developers better control over *who* can join a call, *when* they meet, and *how* they collaborate. To learn more about rooms, see the [conceptual documentation](../../rooms/room-concept.md).

A user is invited to a room by using the Rooms API in one of the three following roles:

- Presenter (default)
- Attendee
- Consumer

The distinction between each role lies in the capabilities they possess during a room call when `CallComposite` is used. The specific capabilities associated with each role are described in [Virtual rooms overview](../../rooms/room-concept.md#predefined-participant-roles-and-permissions).

:::image type="content" source="../../media/rooms/rooms-join-call.png" alt-text="Diagram that shows rooms management.":::

> [!NOTE]
> The Rooms API serves the purpose of creating rooms, managing users, and adjusting the lifetime of rooms. The Rooms API is a back-end service that's separate from UI Library.

### One-to-one call and PUSH notification support

UI Library supports one-to-one VoIP calls to dial users by communication identifier. To receive an incoming call, UI Library also supports registering for `PUSH` notifications. To learn more about the integration for Android and iOS platforms and use of the API, see [Make a one-to-one call and receive PUSH notifications](../../../how-tos/ui-library-sdk/one-to-one-calling.md).

## Calling features

Several features are available for calling.

### Accessibility

Accessibility is a key focus of the call libraries. Use a screen reader to make important announcements about call status and to help ensure that visually impaired users can effectively participate when they use the application.

### Closed captions

Closed captions enable a wide range of scenarios, including interoperability with Teams, Azure Communication Services group calls, room calls, and one-on-one calls. This feature ensures that users can follow along with conversations in various calling environments, enhancing accessibility and user experience.

Users need to manually select the language for captions by using UI Library out of the box because the system doesn't automatically detect the spoken language.

:::image type="content" source="../includes/media/mobile-ui-closed-captions.png" alt-text="Screenshot that shows the experience of closed captions integration in UI Library.":::

For more information about closed captions, see [the documentation](../../voice-video-calling/closed-captions.md) to review explanations and usage guidelines. If you want to configure closed captions directly within UI Library, follow the [tutorial](../../../how-tos/ui-library-sdk/closed-captions.md) for easy setup.

### Events

Developers can now subscribe to events within the `CallComposite` property. With this feature, they can attach listeners to specific events throughout the call lifecycle. This enhancement provides greater control and customization opportunities. Developers can trigger custom actions based on events like participant join or participants who left the call. They can also use events for logging interactions, dynamically updating user interfaces, or enhancing overall functionality.

For more information, see [Handle events in UI Library](../../../how-tos/ui-library-sdk/events.md).

### Localization

Localization is key to making products for users around the world who speak different languages. UI Library supports 12 languages: English, Spanish, French, German, Italian, Japanese, Korean, Dutch, Portuguese, Russian, Turkish, and Chinese. It also supports right-to-left languages. For more information, see [Add localization to your app](../../../how-tos/ui-library-sdk/localization.md).

### Multitasking and picture-in-picture mode

UI Library supports the picture-in-picture mode for the call screen. While in a call, users can select the back button on the call screen to enable multitasking to take them back to the previous screen. If the picture-in-picture mode is enabled, a system picture-in-picture appears for the call. To learn more about multitasking and the picture-in-picture mode for both the Android and iOS platforms and use of the API, see [Turn on picture-in-picture by using UI Library](../../../how-tos/ui-library-sdk/picture-in-picture.md).

### Screen orientation

UI Library supports screen orientation setup for each of the screens separately before the start of the library experience. Application developers can set up a fixed orientation for the calling experience, which would align their application orientation. To learn more about the list of supported orientation for both the Android and iOS platforms and use of the API, see [Set screen orientation by using UI Library](../../../how-tos/ui-library-sdk/orientation.md).

### Screen size

Adapt the Azure Communication Services call composite to adapt to screen sizes from five inches to tablet size. Use split mode and tablet mode in the call composite to get the dynamic participants' roster layout, provide clarity on the view, and focus on the conversation.

|Split mode | Tablet mode|
|---------|---------|
| :::image type="content" source="../../media/mobile-ui/meet-splitscreen.png" alt-text="Screenshot that demonstrates a split-screen view."::: |  :::image type="content" source="../../media/mobile-ui/tablet-landscape.png" alt-text="Screenshot that demonstrates tablet mode."::: |

### View data injection

Use UI Library for mobile native platforms to give local and remote participants the option to customize how they appear as users in a call. A local participant can choose a local avatar, custom display name, and navigation's title and subtitle on the setup screen when a call begins. A remote user can create a customized avatar when they join the meeting. For more information, see [Inject a custom data model in UI Library](../../../how-tos/ui-library-sdk/data-model.md).

:::image type="content" source="../../media/mobile-ui/ios-composite.gif" alt-text="GIF animation that shows the premeeting experience and joining experience on iOS.":::

### View shared content

Through UI Library for mobile native platforms, call participants can view shared content when other participants share their screens during a Teams call. A remote participant can use stretch and pinch gestures to zoom in or out on the shared content in the call.

## OS integrations

Integrate with your OS.

### CallKit support

UI Library supports `CallKit` integration to handle interaction with `CallKit` for calls. To learn more about the integration for the iOS platform and use of the API, see [Integrate CallKit into UI Library](../../../how-tos/ui-library-sdk/callkit.md).

### TelecomManager support

UI Library now supports integration with `TelecomManager` and allows for the handling of call hold and resume functions. To learn more about the integration for the Android platform and use of the API, see [Integrate TelecomManager into UI Library](../../../how-tos/ui-library-sdk/telecommanager.md).

## Customize the call experience

You can customize your call experience.

### Audio-only mode

The audio-only mode in UI Library allows participants to join calls by using only their audio, without sharing or receiving video. This feature is used to conserve bandwidth and maximize privacy. When activated, the audio-only mode automatically disables the video functionalities for both sending and receiving streams. It adjusts the UI to reflect this change by removing video-related controls. Enable this mode through the `CallComposite` configuration. For more information, see the [Audio-only quickstart](../../../how-tos/ui-library-sdk/audio-only-mode.md).

### Disable end call prompt

When you develop applications that integrate calling capabilities, it's crucial to ensure a seamless and intuitive user experience. One area where you can streamline the user experience is during the call termination process. Specifically, developers might find it beneficial to disable the left call confirmation prompt that appears when a user wants to end a call. This feature, while useful in preventing accidental call terminations, can sometimes hinder the user experience, especially in environments where speed and efficiency are crucial. For more information, see [Disable the call confirmation](../../../how-tos/ui-library-sdk/leave-call-confirmation.md).

**Fast-paced communication environments**: In settings like trading floors, emergency call centers, or customer service centers, decisions and actions must be carried out rapidly. The extra step of confirming call termination can impede workflow efficiency.

### Button bar customization

The functionality allows developers to add new actions into the contextual menu or remove current buttons in the button bar. They can provide the flexibility to introduce custom actions and tailor the user interface according to specific application needs.

- **Add custom buttons**: Developers can introduce new buttons into the contextual button bar to trigger custom actions.
- **Remove existing buttons**: Developers can remove unnecessary default buttons to streamline the interface, such as camera, microphone, or audio selection.

Consider the following constraints during the implementation of this feature:

- **Icons and labels**: Icons are added only for new actions. The button bar icons keep the predefined icons, and the labels should be concise to fit the menu dimension.
- **Accessibility considerations**: Developers should ensure that all custom buttons are accessible, including appropriate labeling for screen readers.

|Remove buttons | Add custom actions|
|-------------  | ------------------|
| :::image type="content" source="media/ui-library-remove-button.png" alt-text="Screenshot that demonstrates the remove button on the bottom bar."::: |  :::image type="content" source="media/ui-library-add-action-button.png" alt-text="Screenshot that demonstrates adding custom actions into the contextual menu."::: |

#### Use cases

- **Custom in-call actions**: A business application can add a custom **Report Issue** button, which allows users to directly report technical issues during a call.
- **Branding and user experience**: An enterprise app can remove buttons that are irrelevant to its use case and add branded buttons that enhance the user experience.

To ensure a consistent call experience, we recommend that you integrate Fluent UI icons into your project. They're available at the [Fluent UI GitHub repository](https://github.com/microsoft/fluentui-system-icons/). By doing so, your custom icons match the design of the `CallComposite` property and create a cohesive and professional appearance.

#### Best practices

- **Clean design**: Avoid overcrowding the contextual menu bar. Only add buttons that are essential for the user experience.
- **User testing**: Conduct user testing to ensure that the customizations meet user needs and don't confuse or overwhelm them.
- **Feedback mechanism**: Adding buttons like **Report Issue** ensure that a robust back-end system is available to handle the feedback collected. Reuse the [mechanism that UI Library provides by default](../../../tutorials/collecting-user-feedback/collecting-user-feedback.md).

For more information, see [Customize buttons](../../../how-tos/ui-library-sdk/button-injection.md).

### Skip setup screen

UI Library provides the capability to join a call by skipping the setup screen of the call join experience. By default, you go through a setup screen to join a call. Here, you set the call configuration, such as camera turn on or off, microphone turn on or off, and audio device selection before you join a call. This screen requires user interaction to join a call, which might be unnecessary for some users. So we provide the capability to join a call by skipping the setup screen and providing the call configuration APIs. For more information, see [Skip setup screen feature](../../../how-tos/ui-library-sdk/skip-setup-screen.md).

### Theming and colors

Use the UI Library call composite for iOS and Android to create a custom theme of a caller's experience. You have the flexibility to customize the primary colors so that you can tailor the color scheme to match your specific branding needs. By adjusting primary colors, you can ensure that the interface integrates with your brand's visual identity. You can enhance user experience while you maintain consistency across your applications. For more information, see [Create your theme](../../../how-tos/ui-library-sdk/theming.md).

| Android                            | iOS                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="../../media/mobile-ui/android-color.png" alt-text="Screenshot that shows Android theming for a caller experience."::: | :::image type="content" source="../../media/mobile-ui/ios-dark.png" alt-text="Screenshot that shows iOS theming for a caller experience.":::  |

### Title and subtitle

Use UI Library to input custom strings, which make it easier to tailor the call interface to suit your specific needs. You can customize the title and subtitle of a call, both during the setup phase and while the call is in progress.

For example, in a corporate environment, you can set the title to reflect the meeting's agenda and the subtitle to indicate an announcement. For customer support, agents can use titles to display the nature of the inquiry to enhance clarity and communication.

During calls with time-sensitive discussions, you can also use the subtitle to display the call duration to ensure that all participants are aware of the time constraints.

For more information, see [Set up the title and subtitle](../../../how-tos/ui-library-sdk/setup-title-subtitle.md).

-----------------------------------------

## Chat use cases

[!INCLUDE [Public Preview Notice](../../../includes/public-preview-include.md)]

| Area         | Use cases                                         |
| ------------ | ------------------------------------------------  |
| Chat types   | Join an Azure Communication Services chat thread.        |
| Chat actions | Send a chat message.                              |
|              | Receive a chat message.                           |
| Chat events  | Show typing indicators.                           |
|              | Show a read receipt.                              |
|              | Show when a participant is added or removed.      |
|              | Show changes to the chat title.                   |

### Flexibility

The `ChatComposite` property was designed to fit into different layouts and views in your application. For example, you could choose to place Chat in a navigation view, modal view, or some other view. The `ChatComposite` property adjusts itself and ensures that the user has a seamless experience.

| Navigation view                            | Modal view                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="../../media/mobile-ui/chat-fullscreen.png" alt-text="Screenshot that shows the chat experience on iOS in a navigation view."::: | :::image type="content" source="../../media/mobile-ui/chat-modal.png" alt-text="Screenshot that shows the chat experience on iOS in a modal view.":::  |

## Supported identities

To initialize a composite and authenticate to the service, a user must have an Azure Communication Services identity. For more information, see [Authenticate to Azure Communication Services](../../authentication.md) and [Quickstart: Create and manage access tokens](../../../quickstarts/identity/access-tokens.md).

## Recommended architecture

Initialize a composite by using an Azure Communication Services access token. It's important to get access tokens from Azure Communication Services through a trusted service that you manage. For more information, see [Quickstart: Create and manage access tokens](../../../quickstarts/identity/access-tokens.md) and the [trusted service tutorial](../../../tutorials/trusted-service-tutorial.md).

:::image type="content" source="../../media/mobile-ui/ui-library-architecture.png" border="false" alt-text="Diagram that shows the recommended architecture for UI Library.":::

Call and chat client libraries must have the context for the call they join. Disseminate the context to clients by using your own trusted service. For example, use user access tokens. The following table summarizes the initialization and resource management functions that are required to add context to a client library.

| Contoso responsibilities                                 | UI Library responsibilities                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| Provide an access token from Azure.                          | Pass through the provided access token to initialize components.       |
| Provide a refresh function.                                 | Refresh the access token by using a developer-provided function.          |
| Retrieve and pass join information for the call or chat.          | Pass through call and chat information to initialize components. |
| Retrieve and pass user information for any custom data model. | Pass through a custom data model to components to render.          |

## Platform support

|Platform | Versions|
|---------|---------|
| iOS     | iOS 14 and later |
| Android | API 21 and later |

## Troubleshooting guide

When troubleshooting happens for voice or video calls, you might be asked to provide a call ID. This ID is used to identify Azure Communication Services calls.

To retrieve this call ID, use the action bar at the bottom of the call screen. Select the ellipsis button to see **Share diagnostics info**. Use this option to share the diagnostics information that's required to track any issues by the support team.

For programmatic access to the call ID, see [Get debug information programmatically](../../../how-tos/ui-library-sdk/troubleshooting.md).

For more information about troubleshooting, see [Troubleshooting in Azure Communication Services](../../troubleshooting-info.md).

| Calling screen | Diagnostic information menu | Share call ID |
| ------------------| ------------------------| ----------- |
| :::image type="content" source="media/ui-library-callscreen.png" border="false" alt-text="Screenshot that shows the call screen during the call."::: | :::image type="content" source="media/ui-library-callscreen-diagnostics-info.png" border="false" alt-text="Screenshot that shows the call screen with the diagnostic options location."::: |  :::image type="content" source="media/ui-library-callscreen-diagnostics-info-share.png" border="false" alt-text="Screenshot that shows a share call ID with Contoso.":::|

> [!div class="nextstepaction"]
> [Quickstart guides](../../../quickstarts/ui-library/get-started-composites.md)
