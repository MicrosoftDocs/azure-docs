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

| Area                                                                 | Use cases                                                       |
| -------------------------------------------------------------------- | --------------------------------------------------------------- |
| [Call types](#call-integration)                                                           | Join a Microsoft Teams meeting                                  |
|                                                                      | Join a Microsoft Teams meeting using Meeting ID and Passcode    |
|                                                                      | Join a call by using a group ID                                 |
|                                                                      | Join a call by using a room  ID                                 |
|                                                                      | [Make and Receive 1:1 Calls](#one-to-one-call-and-push-notification-support)                                     |
| [Teams interoperability](../../teams-interop.md)                     | Join the call lobby                                             |
|                                                                                                 | Display a transcription and recording alert banner               |
|                                                                                                 | Admit/Reject lobby participants                                 |
| [Closed Captions](#closed-captions)                                                             | Teams interoperability                                      |
|                                                                                                 | Group call, Rooms call, and 1:1 call                                       |
| Participant gallery                                                                   | Show remote participants on a grid              |
|                                                                                                 | Make video preview available throughout a call for a local user |
|                                                                                                 | Make default avatars available when video is off            |
|                                                                                                 | Show shared screen content in the participant gallery |
|                                                                                                 | Enable participant avatar customization                |
|                                                                                                 | Show a participant roster                                     |
| Call management                                                                    | Manage the microphone device                           |
|                                                                                                 | Manage the camera device                               |
|                                                                                                 | Manage the speaker device (wired or Bluetooth)                              |
|                                                                                                 | Make local preview available for a user to check video       |
|                                                                                                 | [Subscribe events](#events)       |
| Call controls                                                                            | Mute and unmute a call                                       |
|                                                                                                 | Turn video on or off during a call                                   |
|                                                                                                 | End a call                                               |
|                                                                                                 | Hold and resume a call after audio interruption                 |
|                                                                                                 | [CallKit and TelecomManager Support](#os-integrations)                 |
| [Customize the experience](#customize-the-call-experience)                                      | Button bar customization                                        |
|                                                                                                 | Title and subtitle configuration                                        |
|                                                                                                 | Enable end call confirmation dialogue                 |
|                                                                                                 | Skip setup screen                 |

## Call integration

### Teams interoperability

For [Teams interoperability](../../teams-interop.md) scenarios, you can use UI Library composites to add a user to a Teams meeting via Communication Services. To enable Teams interoperability, use the call composite. The composite manages the entire lifecycle of joining a Teams interoperability call.

:::image type="content" source="../../media/mobile-ui/teams-interop-diagram.png" border="false" alt-text="Diagram that shows the Teams interoperability pattern for call and chat.":::

The following figure shows an example of the user experience before a caller is added to a Teams meeting:

:::image type="content" source="../../media/mobile-ui/teams-meet.png" alt-text="Screenshot that shows the user experience before a caller is added to a Teams meeting.":::

### Rooms integration

Azure Communication Services provides a concept of a room for developers who are building structured conversations such as virtual appointments or virtual events. Rooms currently allow voice and video calling.

A Room is a container that manages activity between Azure Communication Services end-users. A Room offers application developers better control over *who* can join a call, *when* they meet and *how* they collaborate. To learn more about Rooms, see the [conceptual documentation](../../rooms/room-concept.md).

A user is invited to a room using the Rooms API as 1 of 3 following roles:

- Presenter(default)
- Attendee
- Consumer

The distinction between each role lies in the capabilities they possess during a room call when utilizing the `CallComposite`. The specific capabilities associated with each role are detailed [here](../../rooms/room-concept.md#predefined-participant-roles-and-permissions).

:::image type="content" source="../../media/rooms/rooms-join-call.png" alt-text="Diagram showing Rooms Management.":::

> [!NOTE]
> The Rooms API serves the purpose of creating rooms, managing users, and adjusting the lifetime of rooms. It is important to note that the Rooms API is a back-end service that is separate from the UI Library.

### One-to-one call and PUSH notification support

UI Library supports one-to-one VoIP call to dial users by communication identifier. To receive incoming call UI Library also supports registering for PUSH notifications. To learn more about the integration for Android and iOS platform and usage of the API, see [How to make one-to-one call and receive PUSH notifications.](../../../how-tos/ui-library-sdk/one-to-one-calling.md)

## Calling features

### Accessibility

Accessibility is a key focus of the call libraries. You can use a screen reader to make important announcements about call status and to help ensure that visually impaired users can effectively participate when they use the application.

### Closed captions

Closed captions enable a wide range of scenarios, including interoperability with Teams, Azure Communication Services Group calls, Rooms calls, and one-on-one calls. This feature ensures that users can follow along with conversations in various calling environments, **enhancing accessibility** and user experience. However, it's important to note that users need to manually select the language for captions using the UI Library out of the box, as the system doesn't automatically detect the spoken language.

:::image type="content" source="../includes/media/mobile-ui-closed-captions.png" alt-text="Screenshot that shows the experience of closed captions integration in the UI Library.":::

> [!NOTE]
>Closed Captions will not be billed at the beginning of its Public Preview. This is for a limited time only, usage of Captions will likely be billed starting from June.

If you're looking more detailed information about closed captions, feel free to visit [the documentation](../../voice-video-calling/closed-captions.md) to review explanations and usage guidelines. Additionally, if you want to jump directly into the configuration of closed captions directly within the UI Library, you can follow our [tutorial](../../../how-tos/ui-library-sdk/closed-captions.md) for easy setup.

### Events

Developers can now subscribe to events within the Call Composite, enabling them to attach listeners to specific events throughout the call lifecycle. This enhancement provides greater control and customization opportunities, allowing developers to trigger custom actions based on events like  participant join, or participants left the call. Whether it's for logging interactions, dynamically updating user interfaces, or enhancing overall functionality.

For more information, see [How to handle events](../../../how-tos/ui-library-sdk/events.md).

### Localization

Localization is key to making products for users around the world and who speak different languages. UI Library supports 12 languages: English, Spanish, French, German, Italian, Japanese, Korean, Dutch, Portuguese, Russian, Turkish, and Chinese. It also supports right-to-left languages. For more information, see [How to add localization to your app](../../../how-tos/ui-library-sdk/localization.md).

### Multitasking and Picture-in-Picture

UI Library supports picture in picture mode for call screen. While being in the call, user can click back button on call screen to enable multitasking, which takes the user back to previous screen. If Picture-in-Picture is enabled, a system Picture-in-Picture will be displayed for call. To learn more about the multitasking and Picture-in-Picture for both Android and iOS platform and usage of the API, see [How to use Picture-in-Picture.](../../../how-tos/ui-library-sdk/picture-in-picture.md)

### Screen orientation

UI Library supports screen orientation setup for each of the screen separately prior to launch the library experience. This allows application developers to set up a fixed orientation for the calling experience, which would align their application orientation. To learn more about the list of supported orientation for both Android and iOS platform and usage of the API, see [How to use Orientation Feature.](../../../how-tos/ui-library-sdk/orientation.md)

### Screen size

You can adapt the Azure Communication Services call composite to adapt to screen sizes from 5 inches to tablet size. Use split mode and tablet mode in the call composite to get the dynamic participants' roster layout, provide clarity on the view, and focus on the conversation.

|Split mode | Tablet mode|
|---------|---------|
| :::image type="content" source="../../media/mobile-ui/meet-splitscreen.png" alt-text="Screenshot that demonstrates a split-screen view."::: |  :::image type="content" source="../../media/mobile-ui/tablet-landscape.png" alt-text="Screenshot that demonstrates tablet mode."::: |

### View data injection

Use the UI Library for mobile native platforms to give local and remote participants the option to customize how they appear as users in a call. A local participant can choose a local avatar, custom display name, navigation's title and subtitle on Setup screen when a call begins. A remote user can create a customized avatar when they join the meeting. For more information, see [How to customize pre-meeting view](../../../how-tos/ui-library-sdk/data-model.md).

:::image type="content" source="../../media/mobile-ui/ios-composite.gif" alt-text="GIF animation that shows the pre-meeting experience and joining experience on iOS.":::

### View shared content

Through the UI Library for mobile native platforms, call participants can view shared content when other participants share their screens during a Teams call. A remote participant can use stretch and pinch gestures to zoom in or out on the shared content in the call.

## OS integrations

### CallKit support

UI Library supports CallKit Integration to handle interaction with CallKit for calls. To learn more about the integration for iOS platform and usage of the API, see [How to use CallKit.](../../../how-tos/ui-library-sdk/callkit.md)

### TelecomManager support

The UI Library now supports integration with the TelecomManager, allowing for handling of call hold and resume functions. To learn more about the integration for Android platform and usage of the API, see [How to use TelecomManager.](../../../how-tos/ui-library-sdk/telecommanager.md)

## Customize the call experience

### Audio Only Mode

The Audio Only Mode in the UI Library allows participants to join calls using only their audio, without sharing or receiving video. This feature is used to conserve bandwidth and maximize privacy. When activated, the Audio Only Mode automatically disables the video functionalities for both sending and receiving streams, and adjusts the UI to reflect this change by removing video-related controls. This mode can be enabled through the CallComposite configuration, more information available through the [Audio Only Quick Start.](../../../how-tos/ui-library-sdk/audio-only-mode.md)

### Disable end call prompt

When developing applications that integrate calling capabilities, ensuring a seamless and intuitive user experience is crucial. One area where UX can be streamlined is during the call termination process. Specifically, developers might find it beneficial to disable the left call confirmation prompt that appears when a user want to end call. This feature, while useful in preventing accidental call terminations, can sometimes hinder the user experience, especially in environments where speed and efficiency are crucial. [How to disable the call confirmation](../../../how-tos/ui-library-sdk/leave-call-confirmation.md)

Fast-Paced Communication Environments: In settings such as trading floors, emergency call centers, or customer service centers where decisions and actions must be executed rapidly, the additional step of confirming call termination can impede workflow efficiency.

### Button bar customization

The functionality allows developers to add new actions into the contextual menu or remove current buttons in the button bar, providing the flexibility to introduce custom actions and tailor the user interface according to specific application needs.

- Add Custom Buttons: Developers can introduce new buttons into the contextual button bar to trigger custom actions.
- Remove Existing Buttons: Unnecessary default buttons can be removed to streamline the interface: camera, microphone o audio selection.

Consider the following constraints during the implementation of this feature:

- Icons and Labels: Icons are added only for new actions. The button bar icons keep the predefined icons and the labels should be concise to fit the menu dimension.
- Accessibility Considerations: Developers should ensure that all custom buttons are accessible, including appropriate labeling for screen readers.

|Remove buttons | Add custom actions|
|-------------  | ------------------|
| :::image type="content" source="media/ui-library-remove-button.png" alt-text="Screenshot that demonstrates the remove button on the bottom bar."::: |  :::image type="content" source="media/ui-library-add-action-button.png" alt-text="Screenshot that demonstrates add custom action into the contextual menu."::: |

#### Use cases

- Custom In-Call Actions: A business application can add a custom "Report Issue" button, allowing users to directly report technical issues during a call.
- Branding and User Experience: An enterprise app can remove buttons that are irrelevant to its use case and add branded buttons that enhance the user experience.

To ensure a consistent call experience, we recommend that you integrate Fluent UI icons into your project; available at [Fluent UI GitHub repository](https://github.com/microsoft/fluentui-system-icons/). By doing so, your custom icons match the design of the Call Composite, creating a cohesive and professional appearance.

#### Best practices

- Clean design: Avoid overcrowding the contextual menu bar. Only add buttons that are essential for the user experience.
- User Testing: Conduct user testing to ensure the customizations meets user needs and don't confuse or overwhelm them.
- Add a Feedback Mechanism: If adding buttons for actions like "Report Issue," ensure there's a robust backend system to handle the feedback collected, you can reuse the [mechanism that UI Library provides by default](../../../tutorials/collecting-user-feedback/collecting-user-feedback.md).

For more information, see [How to customize the button bar](../../../how-tos/ui-library-sdk/button-injection.md).

### Skip Setup Screen

UI Library provides the capability to join a call skipping the setup screen of the call join experience. By default, user goes through a setup screen to join a call. Here, user sets the call configuration such as camera turn on or off, microphone turn on or off and audio device selection before joining a call. This screen requires user interaction to join a call, which might be unnecessary for some users. So we provide the capability to join a call by skipping the setup screen and providing the call configuration APIs. For more information, see [How to use Skip Setup Screen Feature.](../../../how-tos/ui-library-sdk/skip-setup-screen.md)

### Theming & colors

You can use the UI Library call composite for iOS and Android to create a custom theme of a caller's experience. You have the flexibility to customize the primary colors. This feature allows you to tailor the color scheme to match your specific branding needs. By adjusting primary colors, you can ensure the interface seamlessly integrates with your brand’s visual identity, enhancing user experience while maintaining consistency across your applications. For more information, see [How to create your theme](../../../how-tos/ui-library-sdk/theming.md).

| Android                            | iOS                                     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="../../media/mobile-ui/android-color.png" alt-text="Screenshot that shows Android theming for a caller experience."::: | :::image type="content" source="../../media/mobile-ui/ios-dark.png" alt-text="Screenshot that shows iOS theming for a caller experience.":::  |

### Title and Subtitle

The UI Library allows you to input custom strings, making it easier to tailor the call interface to suit your specific needs. You can customize the title and subtitle of a call, both during the setup phase and while the call is in progress.

For example, in a corporate environment, you can set the title to reflect the meeting's agenda and the subtitle to indicate an announcement, and for customer support, agents can use titles to display the nature of the inquiry, enhancing clarity and communication.

Additionally, during calls with time-sensitive discussions, you can use the subtitle to display the call duration, ensuring all participants are aware of the time constraints.

For more information, visit the tutorial: [How to setup the title and subtitle](../../../how-tos/ui-library-sdk/setup-title-subtitle.md).

-----------------------------------------

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
