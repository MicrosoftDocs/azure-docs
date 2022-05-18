---
description: In this tutorial, you learn how to use the Calling composite on Android
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-library-quick-start)

### Local Avatar Injection

The UI Library now gives developers the ability to provide a more customized experience. At launch, developers can now inject an optional Local Data Options. This object can contain a bitmap which represents the avatar to render, and a display name they can optionally display instead. None of this information will be sent to Azure Communication Services and will be only held locally in the UI library.

#### Participant View Data

`ParticipantViewData` is a class that set the `renderedDisplayName`, `AvatarBitMap` and `ScaleType`  for avatar control. This class is injected to UI Library to set avatar information.

#### Local Settings

`LocalSettings` is a options wrapper that set the persona data for UI Library components using a `ParticipantViewData` object. By default, the UI library will display the `displayName` injected in `GroupCallOptions` and `TeamsMeetingOptions`. If `ParticipantViewData` is injected, the `renderedDisplayName`, `AvatarBitMap` will be displayed in all avatar controls.

#### Usage

To use the `LocalSettings`, pass the instance of `ParticipantViewData` to `LocalSettings` and inject `LocalSettings` to `callComposite.launch`.

```Kotlin
val viewData= ParticipantViewData("renderedDisplayName", bitmap)
val localSettings= LocalSettings(viewData)
callComposite.launch(
    context,
    callOptions,
    localSettings
)
```

|||
| ---- | ---- |
| :::image type="content" source="media/android_modelinjection.png" alt-text="iOS data custom model injection"::: | :::image type="content" source="media/android_modelinjection_name.png"  alt-text="iOS data custom model injection name"::: |

### Remote Avatar Injection

On remote participant join, developers can now inject the persona data for remote participant. This object can contain a bitmap which represents the avatar to render, and a display name they can optionally display instead. None of this information will be sent to Azure Communication Services and will be only held locally in the UI library.

#### Usage

To set the participant view data for remote participant, set `setOnRemoteParticipantJoinedHandler`. On remote participant join, use callComposite `setRemoteParticipantPersonaData` to inject view data for remote participant. The participant identifier `com.azure.android.communication.common (azure-communication-common 1.1.0-beta.1 API)` is to uniquely identify a remote participant.

```Kotlin
callComposite.setOnRemoteParticipantJoinedHandler { remoteParticipantJoinedEvent ->
    remoteParticipantJoinedEvent.identifiers.forEach { communicationIdentifier ->
        // get persona data for communicationIdentifier
        // set personaData
        val result = callComposite.setRemoteParticipantPersonaData(communicationIdentifier, ParticipantViewData("name", bitmap))
        if (result == SetPersonaDataResult.PARTICIPANT_NOT_IN_CALL) {
           // participant not in call
        }
 
        if (result == SetPersonaDataResult.SUCCESS) {
            // success
        }
    }
}
```

|||
| ---- | ---- |
| :::image type="content" source="media/android_modelinjection_remote.png" alt-text="iOS data custom model remote injection"::: ||
