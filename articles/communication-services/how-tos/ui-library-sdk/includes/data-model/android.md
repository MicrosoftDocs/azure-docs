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

### Local Participant View Data Injection

The UI Library now gives developers the ability to provide a more customized experience. At launch, developers can now inject an optional Local Data Options. This object can contain a bitmap that represents the avatar to render, and a display name they can optionally display instead. None of this information will be sent to Azure Communication Services and will be only held locally in the UI library.

#### Participant View Data

`ParticipantViewData` is a class that set the `RenderedDisplayName`, `AvatarBitMap` and `ScaleType`  for avatar control. This class is injected to UI Library to set avatar information.

#### Local Settings

`LocalSettings` is a wrapper that set the persona data for UI Library components using a `ParticipantViewData`. By default, the UI library will display the `displayName` injected in `GroupCallOptions` and `TeamsMeetingOptions`. If `ParticipantViewData` is injected, the `RenderedDisplayName`, `AvatarBitMap` will be displayed for local participant.

#### Usage

To use the `LocalSettings`, pass the instance of `ParticipantViewData` and inject `LocalSettings` to `callComposite.launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
val viewData = ParticipantViewData("user_name", bitmap)
val localSettings = LocalSettings(viewData)
callComposite.launch(callLauncherActivity, groupCallOptions, localSettings)
```

#### [Java](#tab/java)

```java
ParticipantViewData viewData = new ParticipantViewData("user_name", bitmap);
LocalSettings localSettings = new LocalSettings(viewData);
callComposite.launch(callLauncherActivity, groupCallOptions, localSettings);
```
-----

|Setup View| Calling Experience View|
| ---- | ---- |
| :::image type="content" source="media/android-model-injection.png" alt-text="Android data custom model injection"::: | :::image type="content" source="media/android-model-injection-name.png"  alt-text="Android data custom model injection name"::: |

### Remote Participant View Data Injection

On remote participant join, developers can inject the participant view data for remote participant. This participant view data can contain a bitmap that represents the avatar to render, and a display name they can optionally display instead. None of this information will be sent to Azure Communication Services and will be only held locally in the UI library.

#### Usage

To set the participant view data for remote participant, set `setOnRemoteParticipantJoinedHandler`. On remote participant join, use callComposite `setRemoteParticipantViewData` to inject view data for remote participant. The participant identifier [CommunicationIdentifier](https://azure.github.io/azure-sdk-for-android/azure-communication-common/index.html) is to uniquely identify a remote participant.

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.setOnRemoteParticipantJoinedHandler { remoteParticipantJoinedEvent -> 
                remoteParticipantJoinedEvent.identifiers.forEach { identifier ->
                    // get displayName, bitmap for identifier
                    callComposite.setRemoteParticipantViewData(identifier,
                        ParticipantViewData("display_name", bitmap))
                }
            }
```

#### [Java](#tab/java)

```java
    for (CommunicationIdentifier identifier: participantJoinedEvent.getIdentifiers()) {
                    // get displayName, bitmap for identifier
                    callComposite.setRemoteParticipantViewData(identifier, 
                    new ParticipantViewData("display_name", bitmap))
                }
     });
```
-----

|Participants list|
| ---- |
| :::image type="content" source="media/android-model-injection-remote.png" alt-text="Android data custom model remote injection"::: |
