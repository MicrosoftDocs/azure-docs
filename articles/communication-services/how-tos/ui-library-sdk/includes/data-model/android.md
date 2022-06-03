---
description: In this tutorial, you learn how to use the Calling composite on Android to customize the Participant Avatars and Display Names
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-library-quick-start)

### Local Participant View Customization

The UI Library gives developers the ability to provide a more customized experience in regards to Participant information. At launch, developers can optionally add Partipant View Data. This local data is not shared with the server and can be used to customize the display name and avatar of the local user.

#### Local Participant View Data

`ParticipantViewData` is a class that set the `renderedDisplayName`, `avatarBitmap` and `scaleType` for avatar control. This class is passed to the configuration in order to customize the local participants view information.

This class is held in the `LocalSettings` object that represents options used locally on the device making the call.

`renderedDisplayName` differs from the `displayName` passed in via the `TeamsMeetingOptions` and `GroupCallOptions` in that it is only used locally as an override, where `displayName` is passed to the server and shared with other participants. When `renderedDisplayName` is not provided, `displayName` is used.

#### Usage

To use the `LocalSettings`, pass the instance of `CallCompositeParticipantViewData` and inject `LocalSettings` to `callComposite.launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
val viewData = CallCompositeParticipantViewData("LocalUserDisplayName") // bitmap is optional
val localOptions = CallCompositeLocalOptions(viewData)
callComposite.launch(this, remoteOptions, localOptions)
```

#### [Java](#tab/java)

```java
ParticipantViewData viewData = new CallCompositeParticipantViewData("LocalUserDisplayName", bitmap); // bitmap is optional
CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions(viewData);
callComposite.launch(this, remoteOptions, localOptions);
```
-----

|Setup View| Calling Experience View|
| ---- | ---- |
| :::image type="content" source="media/android-model-injection.png" alt-text="Screenshot of a Android data custom model injection."::: | :::image type="content" source="media/android-model-injection-name.png"  alt-text="Screenshot of a Android data custom model injection with name."::: |

### Remote Participant View Customization

In some instances, you may wish to provide local overrides for remote participants to allow custom avatars and titles.

The process is similar to the local participant process, however the data is set when participants join the call. As a developer you would need to add a listener to when remote participants join the call, and then call a method to set the ParticipantViewData for that remote user.

#### Usage

To set the participant view data for remote participant, set `setOnRemoteParticipantJoinedHandler`. On remote participant join, use callComposite `setRemoteParticipantViewData` to inject view data for remote participant. The participant identifier [CommunicationIdentifier](https://azure.github.io/azure-sdk-for-android/azure-communication-common/index.html) is to uniquely identify a remote participant.

Calls to `setRemoteParticipantViewData` return a result of `CallCompositeSetParticipantViewDataResult` which has the following values.

- CallCompositeSetParticipantViewDataResult.SUCCESS
- CallCompositeSetParticipantViewDataResult.PARTICIPANT_NOT_IN_CALL

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.setOnRemoteParticipantJoinedHandler { remoteParticipantJoinedEvent -> 
                remoteParticipantJoinedEvent.identifiers.forEach { identifier ->
                    // get displayName, bitmap for identifier
                    callComposite.setRemoteParticipantViewData(identifier,
                        ParticipantViewData("display_name"))
                }
            }
```

#### [Java](#tab/java)

```java
    callComposite.setOnRemoteParticipantJoinedHandler( (remoteParticipantJoinedEvent) -> {
                for (CommunicationIdentifier identifier: remoteParticipantJoinedEvent.getIdentifiers()) {
                    // get displayName, bitmap for identifier
                    callComposite.setRemoteParticipantViewData(identifier,
                            new ParticipantViewData("display_name"));
                }
            });
```
-----

|Participants list|
| ---- |
| :::image type="content" source="media/android-model-injection-remote.png" alt-text="Screenshot showing the Android data custom model remote injection."::: |
