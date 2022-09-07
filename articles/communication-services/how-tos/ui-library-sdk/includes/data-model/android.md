---
description: In this tutorial, you learn how to use the Calling composite on Android to customize the Participant Avatars and Display Names
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-library-quick-start)

### Local Participant View Customization

The UI Library gives developers the ability to provide a more customized experience regarding Participant information. At launch, developers can optionally add Participant View Data. This local data isn't shared with the server and can be used to customize the display name and avatar of the local user.

#### Local Participant View Data

`CallCompositeParticipantViewData` is a class that set the `displayName`, `avatarBitmap` and `scaleType` for avatar control. This class is passed to the `CallCompositeLocalOptions` in order to customize the local participants view information.

This class is held in the `CallCompositeLocalOptions` object that represents options used locally on the device making the call.

`displayName` differs from the `displayName` passed in via the `CallCompositeRemoteOptions`. `CallCompositeParticipantViewData` `displayName` is only used locally as an override, where `CallCompositeRemoteOptions` `displayName` is passed to the server and shared with other participants. When `CallCompositeParticipantViewData` `displayName` isn't provided, `CallCompositeRemoteOptions` `displayName` is used.

#### Usage

To use the `CallCompositeLocalOptions`, pass the instance of `CallCompositeParticipantViewData` and inject `CallCompositeLocalOptions` to `callComposite.launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
val viewData = CallCompositeParticipantViewData().setDisplayName("displayName") // setAvatarBitmap for bitmap
val localOptions = CallCompositeLocalOptions(viewData)
callComposite.launch(this, remoteOptions, localOptions)
```

#### [Java](#tab/java)

```java
CallCompositeParticipantViewData viewData = new CallCompositeParticipantViewData().setDisplayName("displayName"); // setAvatarBitmap for bitmap
CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions(viewData);
callComposite.launch(this, remoteOptions, localOptions);
```
-----

|Setup View| Calling Experience View|
| ---- | ---- |
| :::image type="content" source="media/android-model-injection.png" alt-text="Screenshot of an Android data custom model injection."::: | :::image type="content" source="media/android-model-injection-name.png"  alt-text="Screenshot of an Android data custom model injection with name."::: |

### Remote Participant View Customization

In some instances, you may wish to provide local overrides for remote participants to allow custom avatars and titles.

The process is similar to the local participant process, however the data is set when participants join the call. As a developer you would need to add a listener to when remote participants join the call, and then call a method to set the `CallCompositeParticipantViewData` for that remote user.

#### Usage

To set the participant view data for remote participant, set `setOnRemoteParticipantJoinedHandler`. On remote participant join, use callComposite `setRemoteParticipantViewData` to inject view data for remote participant. The participant identifier [CommunicationIdentifier](https://azure.github.io/azure-sdk-for-android/azure-communication-common/index.html) is to uniquely identify a remote participant.

Calls to `setRemoteParticipantViewData` return a result of `CallCompositeSetParticipantViewDataResult`, which has the following values.

- CallCompositeSetParticipantViewDataResult.SUCCESS
- CallCompositeSetParticipantViewDataResult.PARTICIPANT_NOT_IN_CALL

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.addOnRemoteParticipantJoinedEventHandler { remoteParticipantJoinedEvent -> 
                remoteParticipantJoinedEvent.identifiers.forEach { identifier ->
                    // get displayName, bitmap for identifier
                    callComposite.setRemoteParticipantViewData(identifier,
                        CallCompositeParticipantViewData().setDisplayName("displayName")) // setAvatarBitmap for bitmap
                }
            }
```

#### [Java](#tab/java)

```java
    callComposite.addOnRemoteParticipantJoinedEventHandler( (remoteParticipantJoinedEvent) -> {
                for (CommunicationIdentifier identifier: remoteParticipantJoinedEvent.getIdentifiers()) {
                    // get displayName, bitmap for identifier
                    callComposite.setRemoteParticipantViewData(identifier,
                            new CallCompositeParticipantViewData().setDisplayName("displayName")); // setAvatarBitmap for bitmap
                }
            });
```
-----

|Participants list|
| ---- |
| :::image type="content" source="media/android-model-injection-remote.png" alt-text="Screenshot showing the Android data custom model remote injection."::: |
