---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling)

### Local Participant View Data Injection

The UI Library now gives developers the ability to provide a more customized experience. At launch, developers can now inject an optional Local Data Options. This object can contain a UIimage that represents the avatar to render, and a display name they can optionally display instead. None of this information will be sent to Azure Communication Services and will be only held locally in the UI library.

#### Local Options

`LocalOptions` is data model that consists of `ParticipantViewData` and `SetupScreenViewData`.  By default for `ParticipantViewData`, the UI library displays the `displayName` injected in `RemoteOptions` that is sent to Azure Communication Service backend server. If `ParticipantViewData` is injected, the participant `displayName` and `avatar` will be displayed in all avatar components. 

Similarly, for 'SetupScreenViewData', by default the UI library displays 'Setup' as the title and subtitle is set to hidden. The `title` and `subtitle` in 'SetupScreenViewData' would overwrite the navigation bar's title and subtitle in pre-meeting screen respectively. 

#### Participant View Data

`ParticipantViewData` is an object that sets the `displayName` and `avatar` UIImage for avatar components. This class is injected into the UI Library to set avatar information, and it will always be locally stored and never sent up to the server.

#### Setup Screen View Data

`SetupScreenViewData` is an object that sets the `title` and `subtitle` for the navigationBar on pre-meeting screen (also known as Setup View). If `SetupScreenViewData` is defined, then 'title' must be provided as it's a required field. 'subtitle', however, isn't required. 
If `subtitle` isn't defined, then the subtitle would always be set to hidden. This class is locally stored and its information won't be sent up to the server.

#### Usage

```swift
// LocalOptions (data not sent to server)
let localParticipantViewData = ParticipantViewData(avatar: <Some UIImage>,
                                                   displayName: "<DISPLAY_NAME>")
let localSetupScreenViewData = SetupScreenViewData(title: "<NAV_TITLE>",
                                                               subtitle: "<NAV_SUBTITLE>")
let localOptions = LocalOptions(participantViewData: localParticipantViewData, 
                                setupScreenViewData: localSetupScreenViewData)
// RemoteOptions (data sent to server)
let remoteOptions = RemoteOptions(for: .groupCall(groupId: UUID()),
                                  credential: <Some CommunicationTokenCredential>,
                                  displayName: "<DISPLAY_NAME>")
// Launch
callComposite.launch(remoteOptions: remoteOptions, localOptions: localOptions)
```

|Setup View|Calling Experience View|
| ---- | ---- |
| :::image type="content" source="media/ios-model-injection.png" alt-text="Screenshot of the iOS data custom model injection."::: | :::image type="content" source="media/ios-model-injection-name.png"  alt-text="Screenshot of the iOS data custom model injection with name."::: |

### Remote Participant View Data Injection

On remote participant join, developers can inject the participant view data for remote participant. This participant view data can contain a UIImage that represents the avatar to render, and a display name they can optionally display instead. None of this information will be sent to Azure Communication Services and will be only held locally in the UI library.

#### Usage

To set the participant view data for remote participant, set `onRemoteParticipantJoined` completion for events handler. On remote participant join, use `CallComposite` `set(remoteParticipantViewData:, for:, completionHandler:)` to inject view data for remote participant. The participant identifier `CommunicationIdentifier` is used to uniquely identify a remote participant. The optional completion handler is used for returning result of the set operation.

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
| :::image type="content" source="media/ios-model-injection-remote.png" alt-text="Screenshot of the iOS remote participants view data injection."::: |
