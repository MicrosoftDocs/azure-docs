---
title: Azure Communication Services Call Diagnostics
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Call Diagnostics feature.
author: probableprime
ms.author: rifox
manager: chpalm

services: azure-communication-services
ms.date: 08/17/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call diagnostics

When working with calls in Azure Communication Services, issues or problems may arise that cause issues for your customers. To aid with that we have a feature called "Call Diagnostics" which enables you to examine various properties of a Call to determine what the issue might be.

**Call diagnostics, is currently only supported for our JS / Web SDK.**

## Accessing diagnostics

Call diagnostics is an extended feature of the core `Call` API and allows you to diagnose an active call.

```js
const callDiagnostics = call.api(Features.Diagnostics);
```

## Diagnostic values

The following users facing diagnostics are available:

### Network values

| Name                      | Description                                                     | Possible values                                                                                                                                                                                                                                  | Use cases                                           |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| noNetwork                 | There is no network available.                                  | - Set to `True` when a call fails to start because there is no network available. <br/> - Set to `False` when there are ICE candidates present.                                                                                                  | Device is not connected to a network.               |
| networkRelaysNotReachable | Problems with a network.                                        | - Set to `True` when the network has some constraint that is not allowing you to reach ACS relays. <br/> - Set to `False` upon making a new call.                                                                                                | During a call when the WiFi signal goes on and off. |
| networkReconnect          | The connection was lost and we are reconnecting to the network. | - Set to `Poor` when the media transport connectivity is lost <br/> - Set to `Bad` when the network is disconnected <br/> - Set to `Good` when a new session is connected.                                                                       | Low bandwidth, no internet                          |
| networkReceiveQuality     | An indicator regarding incoming stream quality.                 | - Set to `Bad` when there is a severe problem with receiving the stream. quality <br/> - Set to `Poor` when there is a mild problem with receiving the stream. quality <br/> - Set to `Good` when there is no problem with receiving the stream. | Low bandwidth                                       |

### Audio values

| Name                           | Description                                                     | Possible values                                                                                                                                                                                                                                                                                                   | Use cases                                                        |
| ------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| noSpeakerDevicesEnumerated     | There is no audio output device (speaker) on the user's system. | - Set to `True` when there are no speaker devices on the system, and speaker selection is supported. <br/> - Set to `False` when there is a least 1 speaker device on the system, and speaker selection is supported.                                                                                             | All speakers are unplugged                                       |
| speakingWhileMicrophoneIsMuted | Speaking while being on mute.                                   | - Set to `True` when local microphone is muted and the local user is speaking. <br/> - Set to `False` when local user either stops speaking, or un-mutes the microphone. <br/> \* Note: as of today, this isn't supported on safari yet, as the audio level samples are taken from webrtc. stats.                 | During a call, mute your microphone and speak into it.           |
| noMicrophoneDevicesEnumerated  | No audio capture devices (microphone) on the user's system      | - Set to `True` when there are no microphone devices on the system. <br/> - Set to `False` when there is at least 1 microphone device on the system.                                                                                                                                                              | All microphones are unplugged during the call.                   |
| microphoneNotFunctioning       | Microphone is not functioning.                                  | - Set to `True` when we fail to start sending local audio stream because the microphone device may have been disabled in the system or it is being used by another process. This UFD takes about 10 seconds to get raised. <br/> - Set to `False` when microphone starts to successfully send audio stream again. | No microphones available, microphone access disabled in a system |
| microphoneMuteUnexpectedly     | Microphone is muted                                             | - Set to `True` when microphone enters muted state unexpectedly. <br/> - Set to `False` when microphone starts to successfully send audio stream                                                                                                                                                                  | Microphone is muted from the system.                             |
| microphonePermissionDenied     | There is low volume from device or it’s almost silent on macOS. | - Set to `True` when audio permission is denied by system settings (audio). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.                                                                                                                             | Microphone permissions are disabled in the Settings.             |

### Camera values

| Name                   | Description                                            | Possible values                                                                                                                                                                                                                                                                                              | Use cases                                                                       |
| ---------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| cameraFreeze           | Camera stops producing frames for more than 5 seconds. | - Set to `True` when the local video stream is frozen. This means the remote side is seeing your video frozen on their screen or it means that the remote participants are not rendering your video on their screen. <br/> - Set to `False` when the freeze ends and users can see your video as per normal. | The Camera was lost during the call or bad network caused the camera to freeze. |
| cameraStartFailed      | Generic camera failure.                                | - Set to `True` when we fail to start sending local video because the camera device may have been disabled in the system or it is being used by another process~. <br/> - Set to `False` when selected camera device successfully sends local video. again.                                                  | Camera failures                                                                 |
| cameraStartTimedOut    | Common scenario where camera is in bad state.          | - Set to `True` when camera device times out to start sending video stream. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                                                                                                         | Camera failures                                                                 |
| cameraPermissionDenied | Camera permissions were denied in settings.            | - Set to `True` when camera permission is denied by system settings (video). <br/> - Set to `False` on successful stream acquisition. <br> Note: This diagnostic only works on macOS Chrome                                                                                                                  | Camera permissions are disabled in the settings.                                |

### Misc values

| Name                         | Description                                                  | Possible values                                                                                                                                                                                         | Use cases                                 |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| screenshareRecordingDisabled | System screen sharing was denied by preferences in Settings. | - Set to `True` when screen sharing permission is denied by system settings (sharing). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.Chrome. | Screen recording is disabled in Settings. |

## Diagnostic events

- Subscribe to the `diagnosticChanged` event to monitor when any call diagnostic changes.

```js
/**
 *  Each diagnostic has the following data:
 * - diagnostic is the type of diagnostic, e.g. NetworkSendQuality, DeviceSpeakWhileMuted, etc...
 * - value is DiagnosticQuality or DiagnosticFlag:
 *     - DiagnosticQuality = enum { Good = 1, Poor = 2, Bad = 3 }.
 *     - DiagnosticFlag = true | false.
 * - valueType = 'DiagnosticQuality' | 'DiagnosticFlag'
 * - mediaType is the media type associated with the event, e.g. Audio, Video, ScreenShare. These are defined in `CallDiagnosticEventMediaType`.
 */
const diagnosticChangedListener = (diagnosticInfo: NetworkDiagnosticChangedEventArgs | MediaDiagnosticChangedEventArgs) => {
    console.log(`Diagnostic changed: ` +
        `Diagnostic: ${diagnosticInfo.diagnostic}` +
        `Value: ${diagnosticInfo.value}` +
        `Value type: ${diagnosticInfo.valueType}` +
        `Media type: ${diagnosticInfo.mediaType}` +

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

callDiagnostics.network.on('diagnosticChanged', diagnosticChangedListener);
callDiagnostics.media.on('diagnosticChanged', diagnosticChangedListener);
```

## Get the latest diagnostics

- Get the latest call diagnostic values that were raised. If a diagnostic is undefined, that is because it was never raised.

```js
const latestNetworkDiagnostics = callDiagnostics.network.getLatest();

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

const latestMediaDiagnostics = callDiagnostics.media.getLatest();

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
