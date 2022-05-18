---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-library-quick-start)

### Local Participant View Data Injection

The UI Library now gives developers the ability to provide a more customized experience. At launch, developers can now inject an optional Local Data Options. This object can contain a UIimage that represents the avatar to render, and a display name they can optionally display instead. None of this information will be sent to Azure Communication Services and will be only held locally in the UI library.

#### Local Settings

`LocalSettings` is data model that can have `ParticipantViewData` that will represent the local participant.  By default, the UI library will display the `displayName` injected in `GroupCallOptions` and `TeamsMeetingOptions`. If `ParticipantViewData` is injected, the `renderedDisplayName` and `avatar` will be displayed in all avatar components.

#### Participant View Data

`ParticipantViewData` is an object that sets the `renderedDisplayName` and `avatar` UIImage for avatar components. This class is injected to UI Library to set avatar information. This will always be locally stored and never sent up to the server.

#### Usage

```swift
let participantViewData = ParticipantViewData(avatar: <Some UIImage>, renderDisplayName: <Some Display Name>)
let localSettings = LocalSettings(participantViewData)
callComposite.launch(with: <Some Group Call Options>, localSettings: localSettings)
```

|Setup View|Calling Experience View|
| ---- | ---- |
| :::image type="content" source="media/ios_modelinjection.png" alt-text="iOS data custom model injection"::: | :::image type="content" source="media/ios_modelinjection_name.png"  alt-text="iOS data custom model injection name"::: |
