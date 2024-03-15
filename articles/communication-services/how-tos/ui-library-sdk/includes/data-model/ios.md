---
description: Learn how to use the Calling composite on iOS.
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Local participant view data injection

The UI Library gives developers the ability to provide a customized experience. At launch, you can inject optional local data options. This object can contain a UI image that represents the avatar to render and a display name to optionally display instead. None of this information is sent to Azure Communication Services. It's held locally in the UI Library.

#### Local options

`LocalOptions` is a data model that consists of `ParticipantViewData` and `SetupScreenViewData`.

For `ParticipantViewData`, by default, the UI Library displays `displayName` information injected in `RemoteOptions`. This information is sent to the Azure Communication Services back-end server. If `ParticipantViewData` is injected, the participant `displayName` and `avatar` information is displayed in all avatar components.

For `SetupScreenViewData`, by default, the UI Library displays **Setup** as the title and nothing as the subtitle. The `title` and `subtitle` information in `SetupScreenViewData` overwrites the navigation bar's title and subtitle on the premeeting screen, respectively.

#### Local participant view data

`ParticipantViewData` is an object that sets the `displayName` and `avatar` UI image for avatar components. This class is injected into the UI Library to set avatar information. It's stored locally and never sent to the server.

#### Setup screen view data

`SetupScreenViewData` is an object that sets `title` and `subtitle` for the navigation bar on the premeeting screen (also known as setup view). If you define `SetupScreenViewData`, you must also provide `title` because it's a required field. However, `subtitle` isn't required.

If you don't define `subtitle`, it's hidden. This class is locally stored, and its information isn't sent to the server.

#### Usage

```swift
// LocalOptions (data not sent to the server)
let localParticipantViewData = ParticipantViewData(avatar: <Some UIImage>,
                                                   displayName: "<DISPLAY_NAME>")
let localSetupScreenViewData = SetupScreenViewData(title: "<NAV_TITLE>",
                                                               subtitle: "<NAV_SUBTITLE>")
let localOptions = LocalOptions(participantViewData: localParticipantViewData, 
                                setupScreenViewData: localSetupScreenViewData)
// RemoteOptions (data sent to the server)
let remoteOptions = RemoteOptions(for: .groupCall(groupId: UUID()),
                                  credential: <Some CommunicationTokenCredential>,
                                  displayName: "<DISPLAY_NAME>")
// Launch
callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```

|Setup view|Calling experience view|
| ---- | ---- |
| :::image type="content" source="media/ios-model-injection.png" alt-text="Screenshot of iOS data custom model injection."::: | :::image type="content" source="media/ios-model-injection-name.png"  alt-text="Screenshot of iOS data custom model injection with name."::: |

### Remote participant view data injection

On remote participant join, you can inject the view data for the remote participant. This participant view data can contain a UI image that represents the avatar to render and a display name to optionally display instead. None of this information is sent to Azure Communication Services. It's held locally in the UI Library.

#### Usage

To set the view data for remote participants, set `onRemoteParticipantJoined` completion for the event handler. On remote participant join, use `set(remoteParticipantViewData:, for:, completionHandler:)` for `CallComposite` to inject view data for remote participants. The participant identifier `CommunicationIdentifier` uniquely identifies a remote participant. You use the optional completion handler to return the result of the set operation.

```swift
callComposite.events.onRemoteParticipantJoined = { [weak callComposite] identifiers in
  for identifier in identifiers {
    // map identifier to displayName
    let participantViewData = ParticipantViewData(displayName: "<DISPLAY_NAME>")
    callComposite?.set(remoteParticipantViewData: participantViewData,
                       for: identifier) { result in
      switch result {
      case .success:
        print("Set participant view data succeeded")
      case .failure(let error):
        print("Set participant view data failed with \(error)")
      }
    }
  }
}
```

|Participants list|
| ---- |
| :::image type="content" source="media/ios-model-injection-remote.png" alt-text="Screenshot of iOS remote participants view data injection."::: |
