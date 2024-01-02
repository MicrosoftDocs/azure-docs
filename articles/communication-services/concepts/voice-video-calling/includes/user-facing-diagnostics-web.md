---
title: Azure Communication Services User Facing Diagnostics (Web)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the User Facing Diagnostics feature for Web.
author: lucianopa-msft
ms.author: lucianopa

services: azure-communication-services
ms.date: 04/06/2023
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Diagnostic values
The following user-facing diagnostics are available:

### Network values


| Name                      | Description                                                     | Possible values                                                                                                                                                                                                                  | Use cases                                           | Mitigation steps                                                                                                                                                                                                                                                                                           |
| --------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| noNetwork                 | There's no network available.                                  | - Set to `True` when a call fails to start because there's no network available. <br/> - Set to `False` when there are ICE candidates present.                                                                                   | Device isn't connected to a network.               | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network optimization](../network-requirements.md#network-optimization) section.                                                                                                               |
| networkRelaysNotReachable | Problems with a network.                                        | - Set to `True` when the network has some constraint that isn't allowing you to reach Azure Communication Services relays. <br/> - Set to `False` upon making a new call.                                                                                 | During a call when the WiFi signal goes on and off. | Ensure that firewall rules and network routing allow client to reach Microsoft turn servers. For more information, see the [Firewall configuration](../network-requirements.md#firewall-configuration) section.                                                                                                     |
| networkReconnect          | The connection was lost and we are reconnecting to the network. | - Set to`Bad` when the network is disconnected <br/> - Set to `Poor`when the media transport connectivity is lost <br/> - Set to `Good` when a new session is connected.                                                         | Low bandwidth, no internet                          | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section.                                                                                                  |
| networkReceiveQuality     | An indicator regarding incoming stream quality.                 | - Set to`Bad` when there's a severe problem with receiving the stream.  <br/> - Set to `Poor` when there's a mild problem with receiving the stream. <br/> - Set to `Good` when there's no problem with receiving the stream. | Low bandwidth                                       | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section. Suggest that the end user turn off their camera to conserve available internet bandwidth. |
| networkSendQuality        | An indicator regarding outgoing stream quality.                 | - Set to`Bad` when there's a severe problem with sending the stream. <br/> - Set to `Poor` when there's a mild problem with sending the stream. <br/> - Set to `Good` when there's no problem with sending the stream.        | Low bandwidth                                       | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section. Also, suggest that the end user turn off their camera to conserve available internet bandwidth. |

### Audio values


| Name                           | Description                                                      | Possible values                                                                                                                                                                                                                                                                                                  | Use cases                                                                                                                                                                                                                       | Mitigation steps                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| noSpeakerDevicesEnumerated     | there's no audio output device (speaker) on the user's system.  | - Set to `True` when there are no speaker devices on the system, and speaker selection is supported. <br/> - Set to `False` when there's a least one speaker device on the system, and speaker selection is supported.                                                                                             | All speakers are unplugged                                                                                                                                                                                                      | When value set to `True`, consider giving visual notification to end user that their current call session doesn't have any speakers available.                                                                                                                                                                    |
| speakingWhileMicrophoneIsMuted | Speaking while being on mute.                                    | - Set to `True` when local microphone is muted and the local user is speaking. <br/> - Set to `False` when local user either stops speaking, or unmutes the microphone. <br/> \* Note: Currently, this option isn't supported on Safari because the audio level samples are taken from WebRTC stats.              | During a call, mute your microphone and speak into it.                                                                                                                                                                          | When value set to `True` consider giving visual notification to end user that they might be talking and not realizing that their audio is muted.                                                                                                                                                                  |
| noMicrophoneDevicesEnumerated  | No audio capture devices (microphone) on the user's system       | - Set to `True` when there are no microphone devices on the system. <br/> - Set to `False` when there's at least one microphone device on the system.                                                                                                                                                              | All microphones are unplugged during the call.                                                                                                                                                                                  | When value set to `True` consider giving visual notification to end user that their current call session doesn't have a microphone. For more information, see [enable microphone from device manger](../../best-practices.md#plug-in-microphone-or-enable-microphone-from-device-manager-when-azure-communication-services-call-in-progress) section. |
| microphoneNotFunctioning       | Microphone isn't functioning.                                   | - Set to `True` when we fail to start sending local audio stream because the microphone device may have been disabled in the system or it is being used by another process. This UFD takes about 10 seconds to get raised. <br/> - Set to `False` when microphone starts to successfully send audio stream again. | No microphones available, microphone access disabled in a system                                                                                                                                                                | When value set to `True` give visual notification to end user that there's a problem with their microphone.                                                                                                                                                                                                      |
| microphoneMuteUnexpectedly     | Microphone is muted                                              | - Set to `True` when microphone enters muted state unexpectedly. <br/> - Set to `False` when microphone starts to successfully send audio stream                                                                                                                                                                  | Microphone is muted from the system. Most cases happen when user is on an Azure Communication Services call on a mobile device and a phone call comes in. In most cases, the operating system mutes the Azure Communication Services call so a user can answer the phone call. | When value is set to `True`, give visual notification to end user that their call was muted because a phone call came in. For more information, see how to best handle [OS muting an Azure Communication Services call](../../best-practices.md#handle-os-muting-call-when-phone-call-comes-in) section for more details.                                               |
| microphonePermissionDenied     | there's low volume from device or it’s almost silent on macOS. | - Set to `True` when audio permission is denied from the system settings (audio). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.                                                                                                                             | Microphone permissions are disabled in the Settings.                                                                                                                                                                            | When value is set to `True`, give visual notification to end user that they did not enable permission to use microphone for an Azure Communication Services call.                                                                                                                                                                           |

### Camera values


| Name                      | Description                                            | Possible values                                                                                                                                                                                                                                                                                             | Use cases                                                                       | Mitigation steps                                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraFreeze              | Camera stops producing frames for more than 5 seconds. | - Set to `True` when the local video stream is frozen. This diagnostic means that the remote side is seeing your video frozen on their screen or it means that the remote participants are not rendering your video on their screen. <br/> - Set to `False` when the freeze ends and users can see your video as per normal. | The Camera was lost during the call or bad network caused the camera to freeze. | When value is set to `True`, consider giving notification to end user that the remote participant network might be bad - possibly suggest that they turn off their camera to conserve bandwidth. For more information, see [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section on needed internet abilities for an Azure Communication Services call. |
| cameraStartFailed         | Generic camera failure.                                | - Set to `True` when we fail to start sending local video because the camera device may have been disabled in the system or it is being used by another process~. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                   | Camera failures                                                                 | When value is set to `True`, give visual notification to end user that their camera failed to start.                                                                                                                                                                                                                                                       |
| cameraStartTimedOut       | Common scenario where camera is in bad state.          | - Set to `True` when camera device times out to start sending video stream. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                                                                                                         | Camera failures                                                                 | When value is set to `True`, give visual notification to end user that their camera is possibly having problems. (When value is set back to `False` remove notification).                                                                                                                                                                                  |
| cameraPermissionDenied    | Camera permissions were denied in settings.            | - Set to `True` when camera permission is denied from the system settings (video). <br/> - Set to `False` on successful stream acquisition. <br> Note: This diagnostic only works on macOS Chrome.                                                                                                                  | Camera permissions are disabled in the settings.                                | When value is set to `True`, give visual notification to end user that they did not enable permission to use camera for an Azure Communication Services call.                                                                                                                                                                                                                       |
| cameraStoppedUnexpectedly | Camera malfunction                                     | - Set to `True` when camera enters stopped state unexpectedly. <br/> - Set to `False` when camera starts to successfully send video stream again.                                                                                                                                                            | Check camera is functioning correctly.                                           | When value is set to `True`, give visual notification to end user that their camera is possibly having problems. (When value is set back to `False` remove notification).                                                                                                                                                                                  |

### Misc values


| Name                         | Description                                                  | Possible values                                                                                                                                                                                        | Use cases                                     | Mitigation Steps                                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| screenshareRecordingDisabled | System screen sharing was denied from the preferences in Settings. | - Set to `True` when screen sharing permission is denied from the system settings (sharing). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.Chrome. | Screen recording is disabled in Settings.     | When value is set to `True`, give visual notification to end user that they did not enable permission to share their screen for an Azure Communication Services call.                                                       |
| capturerStartFailed          | System screen sharing failed.                                | - Set to `True` when we fail to start capturing the screen. <br/> - Set to `False` when capturing the screen can start successfully.                                                                    |                                               | When value is set to `True`, give visual notification to end user that there was possibly a problem sharing their screen. (When value is set back to `False`, remove notification).                 |
| capturerStoppedUnexpectedly  | System screen sharing malfunction                            | - Set to `True` when screen capturer enters stopped state unexpectedly. <br/> - Set to `False` when screen capturer starts to successfully capture again.                                               | Check screen sharing is functioning correctly | When value is set to `True`, give visual notification to end user that there possibly a problem that causes sharing their screen to stop. (When value is set back to `False` remove notification). |

## Accessing diagnostics

User-facing diagnostics is an extended feature of the core `Call` API and allows you to diagnose an active call.

```js
const userFacingDiagnostics = call.feature(Features.UserFacingDiagnostics);
```

## User Facing Diagnostic events

- Subscribe to the `diagnosticChanged` event to monitor when any user-facing diagnostic changes.

```js
/**
 *  Each diagnostic has the following data:
 * - diagnostic is the type of diagnostic, e.g. NetworkSendQuality, DeviceSpeakWhileMuted, etc...
 * - value is DiagnosticQuality or DiagnosticFlag:
 *     - DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
 *     - DiagnosticFlag = true | false.
 * - valueType = 'DiagnosticQuality' | 'DiagnosticFlag'
 */
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

userFacingDiagnostics.network.on('diagnosticChanged', diagnosticChangedListener);
userFacingDiagnostics.media.on('diagnosticChanged', diagnosticChangedListener);
```

## Get the latest User Facing Diagnostics

- Get the latest diagnostic values that were raised. If a diagnostic is undefined, that is because it was never raised.

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
