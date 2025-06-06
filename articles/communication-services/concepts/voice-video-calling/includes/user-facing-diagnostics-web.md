---
title: Azure Communication Services User Facing Diagnostics (Web)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the User Facing Diagnostics feature for Web.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 06/04/2025
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Local vs Remote User Facing Diagnostics
User Facing Diagnostics (UFD) are enabled to expose user-impacting events happening on a users calling device via a programmatic API. Within Azure Communication Services, there are two methods for consuming and generating UFDs: **local UFDs** and **remote UFDs**. **Local UFDs** are generated on the local user's phone or browser. **Remote UFDs** are events occurring in a remote participant's environment, which enables a local user to consume and view those remote user impacting events locally.

[!INCLUDE [Public Preview Disclaimer](../../../includes/private-preview-include.md)]

> [!NOTE]  
> [Version 1.34.1-beta.2](https://www.npmjs.com/package/@azure/communication-calling/v/1.34.1-beta.2) and higher of the public preview calling SDK support sending Remote UFDs from the WebJS calling SDK. Local UFDS emitted by the calling SDK are in general availability (GA).

User Facing Diagnostics (UFD) enable you to see when local or remote participants are experiencing issues that affect audio-video call quality. UFD provides real-time diagnostics on network conditions, device functionality, and media performance. This diagnostic information helps developers identify problems such as poor connectivity, muted microphones, or low bandwidth. While UFD doesn't automatically fix these issues, it enables applications to offer proactive feedback to users, suggesting solutions like checking their internet connection or adjusting device settings. Based on this data, users can either correct the issue themselves (such as turn-off video when the network is weak) or display the information through the User Interface.

There are some minor differences in using **remote UFDs** and **local UFDs**. Those differences are:
- The calling SDK doesn't expose the `speakingWhileMicrophoneIsMuted` via remote UFDs due to privacy concerns.
- The calling SDK only exposes and stream UFDs up to a maximum of 20 participants on the call. When the number of participants exceeds 20, we limit and cease transmission of **remote UFDs** to prevent overloading the network with these events.
- The calling SDK filters so you only see three (3) **remote UFD** events per minute coming from a unique client.
- From the client SDK perspective, you need to enable the functionality for the local UFDs to be sent remotely.

## Diagnostic values
The following user-facing diagnostics are available:

### Network values


| Name                      | Description                                                     | Possible values                                                                                                                                                                                                                  | Use cases                                           | Mitigation steps                                                                                                                                                                                                                                                                                           |
| --------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| noNetwork                 | There's no network available.                                  | - Set to `True` when a call fails to start because there's no network available. <br/> - Set to `False` when there are ICE candidates present.                                                                                   | Device isn't connected to a network.               | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network optimization](../network-requirements.md#network-optimization) section.                                                                                                               |
| networkRelaysNotReachable | Problems with a network.                                        | - Set to `True` when the network has some constraint that isn't allowing you to reach Azure Communication Services relays. <br/> - Set to `False` upon making a new call.                                                                                 | When on an active call and the WiFi signal go on and off. | Ensure that firewall rules and network routing allow client to reach Microsoft turn servers. For more information, see the [Firewall configuration](../network-requirements.md#firewall-configuration) section.                                                                                                     |
| networkReconnect          | The connection was lost and the client is reconnecting to the network. | - Set to`Bad` when the network is disconnected <br/> - Set to `Poor`when the media transport connectivity is lost <br/> - Set to `Good` when a new session is connected.                                                         | Low bandwidth, no internet                          | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section.                                                                                                  |
| networkReceiveQuality     | An indicator regarding incoming stream quality.                 | - Set to `Bad` when there's a severe problem with receiving the stream.  <br/> - Set to `Poor` when there's a mild problem with receiving the stream. <br/> - Set to `Good` when there's no problem with receiving the stream. | Low bandwidth                                       | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section. Suggest that the end user turn-off their camera to conserve available internet bandwidth. |
| networkSendQuality        | An indicator regarding outgoing stream quality.                 | - Set to `Bad` when there's a severe problem with sending the stream. <br/> - Set to `Poor` when there's a mild problem with sending the stream. <br/> - Set to `Good` when there's no problem with sending the stream.        | Low bandwidth                                       | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section. Also, suggest that the end user turn-off their camera to conserve available internet bandwidth. |

### Audio values


| Name                           | Description                                                      | Possible values                                                                                                                                                                                                                                                                                                  | Use cases                                                                                                                                                                                                                       | Mitigation steps                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| noSpeakerDevicesEnumerated     | there's no audio output device (speaker) on the user's system.  | - Set to `True` when there are no speaker devices on the system, and speaker selection is supported. <br/> - Set to `False` when there's a least one speaker device on the system, and speaker selection is supported.                                                                                             | All speakers are unplugged                                                                                                                                                                                                      | When value set to `True`, consider giving visual notification to end user that their current call session doesn't have any speakers available.                                                                                                                                                                    |
| speakingWhileMicrophoneIsMuted | Speaking while being on mute.                                    | - Set to `True` when local microphone is muted and the local user is speaking. <br/> - Set to `False` when local user either stops speaking, or unmutes the microphone. <br/> \* Note: Currently, this option isn't supported on Safari because the audio level samples are taken from WebRTC stats. The audio value 'speakingWhileMicrophoneIsMuted' isn't available as a remote UFD. | During a call, mute your microphone and speak into it.                                                                                                                                                                          | When value set to `True` consider giving visual notification to the end user that they might be talking and not realizing that their audio is muted.                                                                                                                                                                  |
| noMicrophoneDevicesEnumerated  | No audio capture devices (microphone) on the user's system       | - Set to `True` when there are no microphone devices on the system. <br/> - Set to `False` when there's at least one microphone device on the system.                                                                                                                                                              | All microphones are unplugged during the call.                                                                                                                                                                                  | When value set to `True` consider giving visual notification to end user that their current call session doesn't have a microphone. For more information, see [enable microphone from device manager](../../best-practices.md#plug-in-a-microphone-or-enable-a-microphone-from-the-device-manager-when-a-call-is-in-progress) section. |
| microphoneNotFunctioning       | Microphone isn't functioning.                                   | - Set to `True` when we fail to start sending local audio stream because the microphone device may have been disabled in the system or it's being used by another process. This UFD takes about 10 seconds to get raised. <br/> - Set to `False` when microphone starts to successfully send audio stream again. | No microphones available, microphone access disabled in a system                                                                                                                                                                | When value set to `True` give visual notification to end user that there's a problem with their microphone.                                                                                                                                                                                                      |
| microphoneMuteUnexpectedly     | Microphone is muted                                              | - Set to `True` when microphone enters muted state unexpectedly. <br/> - Set to `False` when microphone starts to successfully send audio stream                                                                                                                                                                  | Microphone is muted from the system. Most cases happen when user is on an Azure Communication Services call on a mobile device and a phone call comes in. In most cases, the operating system mutes the Azure Communication Services call so a user can answer the phone call. | When value is set to `True`, give visual notification to end user that their call was muted because a phone call came in. For more information, see how to best handle [OS muting an Azure Communication Services call](../../best-practices.md#handle-the-os-muting-a-call-when-a-phone-call-comes-in) section for more details.                                               |
| microphonePermissionDenied     | there's low volume from device or it's almost silent on macOS. | - Set to `True` when audio permission is denied from the system settings (audio). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.                                                                                                                             | Microphone permissions are disabled in the Settings.                                                                                                                                                                            | When value is set to `True`, give visual notification to end user that they didn't enable permission to use microphone for an Azure Communication Services call.                                                                                                                                                                           |

### Camera values


| Name                      | Description                                            | Possible values                                                                                                                                                                                                                                                                                             | Use cases                                                                       | Mitigation steps                                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraFreeze              | Camera stops producing frames for more than 5 seconds. | - Set to `True` when the local video stream is frozen. This diagnostic means that the remote side is seeing your video frozen on their screen or it means that the remote participants aren't rendering your video on their screen. <br/> - Set to `False` when the freeze ends and users can see your video as per normal. | The Camera was lost during the call, or bad network caused the camera to freeze. | When value is set to `True`, consider giving notification to end user that the remote participant network might be bad. Suggest that the user turn-off their camera to conserve bandwidth. For more information, see [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section on needed internet abilities for an Azure Communication Services call. |
| cameraStartFailed         | Generic camera failure.                                | - Set to `True` when we fail to start sending local video because the camera device may have been disabled in the system or it's being used by another process~. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                   | Camera failures                                                                 | When value is set to `True`, give visual notification to end user that their camera failed to start.                                                                                                                                                                                                                                                       |
| cameraStartTimedOut       | Common scenario where camera is in bad state.          | - Set to `True` when camera device times out to start sending video stream. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                                                                                                         | Camera failures                                                                 | When value is set to `True`, give visual notification to end user that their camera is possibly having problems. (When value is set back to `False` remove notification).                                                                                                                                                                                  |
| cameraPermissionDenied    | Camera permissions were denied in settings.            | - Set to `True` when camera permission is denied from the system settings (video). <br/> - Set to `False` on successful stream acquisition. <br> Note: This diagnostic only works on macOS Chrome.                                                                                                                  | Camera permissions are disabled in the settings.                                | When value is set to `True`, give visual notification to end user that they didn't enable permission to use camera for an Azure Communication Services call.                                                                                                                                                                                                                       |
| cameraStoppedUnexpectedly | Camera malfunction                                     | - Set to `True` when camera enters stopped state unexpectedly. <br/> - Set to `False` when camera starts to successfully send video stream again.                                                                                                                                                            | Check camera is functioning correctly.                                           | When value is set to `True`, give visual notification to end user that their camera is possibly having problems. (When value is set back to `False` remove notification).                                                                                                                                                                                  |

### Misc values


| Name                         | Description                                                  | Possible values                                                                                                                                                                                        | Use cases                                     | Mitigation Steps                                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| screenshareRecordingDisabled | System screen sharing was denied from the preferences in Settings. | - Set to `True` when screen sharing permission is denied from the system settings (sharing). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.Chrome. | Screen recording is disabled in Settings.     | When value is set to `True`, give visual notification to end user that they didn't enable permission to share their screen for an Azure Communication Services call.                                                       |
| capturerStartFailed          | System screen sharing failed.                                | - Set to `True` when we fail to start capturing the screen. <br/> - Set to `False` when capturing the screen can start successfully.                                                                    |                                               | When value is set to `True`, give visual notification to end user that there was possibly a problem sharing their screen. (When value is set back to `False`, remove notification).                 |
| capturerStoppedUnexpectedly  | System screen sharing malfunction                            | - Set to `True` when screen capturer enters stopped state unexpectedly. <br/> - Set to `False` when screen capturer starts to successfully capture again.                                               | Check screen sharing is functioning correctly | When value is set to `True`, give visual notification to end user that there possibly a problem that causes sharing their screen to stop. (When value is set back to `False` remove notification). |

## Accessing diagnostics

User-facing diagnostics is an extended feature of the core [`Call`](/javascript/api/azure-communication-services/@azure/communication-calling/call?view=azure-communication-services-js&preserve-view=true) API. You can understand more about the `UserFacingDiagnosticsFeature` interface [here](/javascript/api/azure-communication-services/@azure/communication-calling/userfacingdiagnosticsfeature?view=azure-communication-services-js&preserve-view=true).

```js
const userFacingDiagnostics = call.feature(Features.UserFacingDiagnostics);
```

## Local User Facing Diagnostic events
Each diagnostic has the following data:
- Diagnostic is the type of UFD diagnostic that has been fired off on the local machine. For example a UFD of `NetworkSendQuality` or `DeviceSpeakWhileMuted`.
- value is `DiagnosticQuality` or `DiagnosticFlag`
- DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
- DiagnosticFlag = `true` | `false`

```js
const diagnosticChangedListener = (diagnosticInfo: NetworkDiagnosticChangedEventArgs | MediaDiagnosticChangedEventArgs) => {
    console.log(`Diagnostic changed: ` +
        `Diagnostic: ${diagnosticInfo.diagnostic}` +
        `Value: ${diagnosticInfo.value}` +
        `Value type: ${diagnosticInfo.valueType}`);

    if (diagnosticInfo.valueType === 'DiagnosticQuality') {
        if (diagnosticInfo.value === DiagnosticQuality.Bad) {
            console.error(`${diagnosticInfo.diagnostic} is bad quality`);

        } else if (diagnosticInfo.value === DiagnosticQuality.Poor) {
            console.error(`${diagnosticInfo.diagnostic} is poor quality`);
        }

    } else if (diagnosticInfo.valueType === 'DiagnosticFlag') {
        if (diagnosticInfo.value === true) {
            console.error(`${diagnosticInfo.diagnostic}`);
        }
    }
};


// Subscribe to the `diagnosticChanged` event to monitor when any local user-facing diagnostic changes.
userFacingDiagnostics.network.on('diagnosticChanged', diagnosticChangedListener);
userFacingDiagnostics.media.on('diagnosticChanged', diagnosticChangedListener);
```

## Accessing Remote User Facing Diagnostic events
To transmit remote UFDs to all participants on a call, it is necessary to enable the function from each client. This can be activated or deactivated on a per-client basis. Once enabled, the client will start transmitting its local UFDs remotely to all participants for their use and processing. It should be noted that if the number of participants exceeds 20, the transmission of remote UFDs from the local client will stop. This measure is implemented to prevent excessive network bandwidth consumption due to UFD traffic.

```js
// Start the local client to send its local UFD to all participants (send local UFD to remote clients).
remoteUfdsFeature.startSendingDiagnostics();
// Stop sending local UFDs to remote clients.
remoteUfdsFeature.stopSendingDiagnostics();
```

For the code sample below, `RemoteParticipantDiagnosticsData` has the following data associated with it:
- `diagnostic` contains array of diagnostics UFD that have been fired from a remote machines. For example a UFD of `NetworkSendQuality`.
- The value of that element will be defined as: `DiagnosticQuality` or `DiagnosticFlag`:
- DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
- DiagnosticFlag = `true` | `false`
- valueType of the array = `DiagnosticQuality` | `DiagnosticFlag`

```js
const remoteDiagnosticChangedListener = (diagnosticInfo: RemoteParticipantDiagnosticsData) => {
    for (const diagnostic of diagnosticInfo.diagnostics) {
        if (diagnostic.valueType === 'DiagnosticQuality') {
            if (diagnostic.value === SDK.DiagnosticQuality.Bad) {
                console.error(`${diagnostic.diagnostic} is bad quality`);

            } else if (diagnostic.value === SDK.DiagnosticQuality.Poor) {
                console.error(`${diagnostic.diagnostic} is poor quality`);
            }

        } else if (diagnostic.valueType === 'DiagnosticFlag') {
            console.error(`${diagnostic.diagnostic} diagnostic flag raised`);
        }
    }
};

// Subscribe to the `diagnosticChanged` event to monitor when any local user-facing diagnostic changes.
userFacingDiagnostics.remote.on('diagnosticChanged', remoteDiagnosticChangedListener);
```


## Raise the latest User Facing Diagnostics event that was received:

Here's sample code to generate the latest diagnostic value raised by the calling SDK. If a diagnostic is undefined, it means the UFD has not been raised.

```js
const latestNetworkDiagnostics = userFacingDiagnostics.network.getLatest();

console.log(
  `noNetwork: ${latestNetworkDiagnostics.noNetwork.value}, ` +
    `value type = ${latestNetworkDiagnostics.noNetwork.valueType}`
);

console.log(
  `networkReconnect: ${latestNetworkDiagnostics.networkReconnect.value}, ` +
    `value type = ${latestNetworkDiagnostics.networkReconnect.valueType}`
);

console.log(
  `networkReceiveQuality: ${latestNetworkDiagnostics.networkReceiveQuality.value}, ` +
    `value type = ${latestNetworkDiagnostics.networkReceiveQuality.valueType}`
);

const latestMediaDiagnostics = userFacingDiagnostics.media.getLatest();

console.log(
  `speakingWhileMicrophoneIsMuted: ${latestMediaDiagnostics.speakingWhileMicrophoneIsMuted.value}, ` +
    `value type = ${latestMediaDiagnostics.speakingWhileMicrophoneIsMuted.valueType}`
);

console.log(
  `cameraStartFailed: ${latestMediaDiagnostics.cameraStartFailed.value}, ` +
    `value type = ${latestMediaDiagnostics.cameraStartFailed.valueType}`
);

console.log(
  `microphoneNotFunctioning: ${latestMediaDiagnostics.microphoneNotFunctioning.value}, ` +
    `value type = ${latestMediaDiagnostics.microphoneNotFunctioning.valueType}`
);
```