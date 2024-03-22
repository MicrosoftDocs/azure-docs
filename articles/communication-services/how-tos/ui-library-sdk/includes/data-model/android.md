---
description: Learn how to use the Calling composite on Android to customize participant avatars and display names.
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source Android UI Library](https://github.com/Azure/communication-ui-library-android) and the [sample application code](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling).

### Local participant view customization

The UI Library gives developers the ability to provide a customized experience regarding participant information. At launch, you can optionally inject local participant data. This local data isn't shared with the server, and you can use it to customize the display name and avatar of the local user.

#### Local options

`CallCompositeLocalOptions` is the data model that can have `CallCompositeParticipantViewData` and `CallCompositeSetupScreenViewData`. It represents the local participant.

By default, for remote participants, the UI Library displays `displayName` information injected in `RemoteOptions`. This information is sent to the Azure Communication Services back-end server. If `CallCompositeParticipantViewData` is injected, the participant `displayName` and `avatar` information is displayed in all avatar components locally.

Similarly, for `CallCompositeSetupScreenViewData`, `title` and `subtitle` in `CallCompositeSetupScreenViewData` overwrite the navigation bar's title and subtitle on the premeeting screen, respectively. By default, the UI Library displays **Setup** as the title and nothing as the subtitle.

#### Local participant view data

`CallCompositeParticipantViewData` is a class that sets `displayName`, `avatarBitmap`, and `scaleType` for avatar control. This class is passed to `CallCompositeLocalOptions` in order to customize the local participants' view information. This class is held in the `CallCompositeLocalOptions` object that represents options used locally on the device that makes the call.

This instance of `displayName` differs from the `displayName` information passed in via `CallCompositeRemoteOptions`:

- The `CallCompositeParticipantViewData` instance of `displayName` is only used locally as an override.
- The `CallCompositeRemoteOptions` instance of `displayName` is passed to the server and shared with other participants.

If you don't provide the `CallCompositeParticipantViewData` instance of `displayName`, the application uses the `CallCompositeRemoteOptions` instance of `displayName`.

#### Setup screen view data

`CallCompositeSetupScreenViewData` is an object that sets `title` and `subtitle` for the navigation bar on the call setup screen. If `subtitle` isn't defined, the subtitle is hidden. Here, `title` is required to set `subtitle`, but `subtitle` is optional when `title` is set. This class is locally stored, and its information isn't sent to the server.

#### Usage

To use `CallCompositeLocalOptions`, pass the instance of `CallCompositeParticipantViewData` and/or `CallCompositeSetupScreenViewData`, and inject `CallCompositeLocalOptions` to `callComposite.launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
val participantViewData: CallCompositeParticipantViewData = CallCompositeParticipantViewData()
    .setAvatarBitmap((Bitmap) avatarBitmap)
    .setScaleType((ImageView.ScaleType) scaleType)
    .setDisplayName((String) displayName)

val setupScreenViewData: CallCompositeSetupScreenViewData = CallCompositeSetupScreenViewData()
    .setTitle((String) title)
    .setSubtitle((String) subTitle)

val localOptions: CallCompositeLocalOptions = CallCompositeLocalOptions()
    .setParticipantViewData(participantViewData)
    .setSetupScreenViewData(setupScreenViewData)

callComposite.launch(callLauncherActivity, remoteOptions, localOptions)
```

#### [Java](#tab/java)

```java
final CallCompositeParticipantViewData participantViewData = new CallCompositeParticipantViewData()
    .setAvatarBitmap((Bitmap) avatarBitmap)
    .setScaleType((ImageView.ScaleType) scaleType)
    .setDisplayName((String) displayName);

final CallCompositeSetupScreenViewData setupScreenViewData = new CallCompositeSetupScreenViewData()
    .setTitle((String) title)
    .setSubtitle((String) subTitle);

final CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions()
    .setParticipantViewData(participantViewData)
    .setSetupScreenViewData(setupScreenViewData);

callComposite.launch(callLauncherActivity, remoteOptions, localOptions);
```

-----

|Setup view| Calling experience view|
| ---- | ---- |
| :::image type="content" source="media/android-model-injection.png" alt-text="Screenshot of Android data custom model injection."::: | :::image type="content" source="media/android-model-injection-name.png"  alt-text="Screenshot of Android data custom model injection with name."::: |

### Remote participant view customization

In some instances, you might want to provide local overrides for remote participants to allow custom avatars and titles.

The process is similar to the local participant process, but the data is set when participants join the call. As a developer, you would need to add a listener when remote participants join the call, and then call a method to set `CallCompositeParticipantViewData` for those remote users.

#### Usage

To set the view data for remote participants, set `setOnRemoteParticipantJoinedHandler`. On remote participant join, use `setRemoteParticipantViewData` for `callComposite` to inject view data for remote participants. The participant identifier [CommunicationIdentifier](https://azure.github.io/azure-sdk-for-android/azure-communication-common/index.html) uniquely identifies a remote participant.

Calls to `setRemoteParticipantViewData` return a result of `CallCompositeSetParticipantViewDataResult`, which has the following values:

- `CallCompositeSetParticipantViewDataResult.SUCCESS`
- `CallCompositeSetParticipantViewDataResult.PARTICIPANT_NOT_IN_CALL`

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
| :::image type="content" source="media/android-model-injection-remote.png" alt-text="Screenshot of Android remote participant view data injection."::: |
