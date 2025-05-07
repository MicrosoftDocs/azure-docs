---
title: Azure Communication Services User Facing Diagnostics (Windows)
titleSuffix: An Azure Communication Services concept document
description: Provides usage samples of the User Facing Diagnostics feature for Windows Native.
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
| networkUnavailable                 | There's no network available.                                  | - Set to `True` when a call fails to start because there's no network available. <br/> - Set to `False` when there are ICE candidates present.                                                                                   | Device isn't connected to a network.               | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network optimization](../network-requirements.md#network-optimization) section.                                                                                                               |
| networkRelaysUnreachable | Problems with a network.                                        | - Set to `True` when the network has some constraint that isn't allowing you to reach Azure Communication Services relays. <br/> - Set to `False` upon making a new call.                                                                                 | During a call when the WiFi signal goes on and off. | Ensure that firewall rules and network routing allow client to reach Microsoft turn servers. For more information, see the [Firewall configuration](../network-requirements.md#firewall-configuration) section.                                                                                                     |
| networkReconnectionQuality          | The connection was lost and we're reconnecting to the network. | - Set to`Bad` when the network is disconnected <br/> - Set to `Poor`when the media transport connectivity is lost <br/> - Set to `Good` when a new session is connected.                                                         | Low bandwidth, no internet                          | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section.                                                                                                  |
| networkReceiveQuality     | An indicator regarding incoming stream quality.                 | - Set to`Bad` when there's a severe problem with receiving the stream.  <br/> - Set to `Poor` when there's a mild problem with receiving the stream. <br/> - Set to `Good` when there's no problem with receiving the stream. <br/> - It's only visible if there's an active audio flow in the call, which means a participant is actively speaking for period of time. | Low bandwidth                                       | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section. Suggest that the end user turn-off their camera to conserve available internet bandwidth. |
| networkSendQuality        | An indicator regarding outgoing stream quality.                 | - Set to`Bad` when there's a severe problem with sending the stream. <br/> - Set to `Poor` when there's a mild problem with sending the stream. <br/> - Set to `Good` when there's no problem with sending the stream. <br/> - Similar to receive quality diagnostic it's only visible if there's an active audio flow in the call, which means a participant is actively speaking for period of time. But, it only works in a 1:1 call as it relies on information from the other side in order to verify quality. Where the other side has to signal the data that was received.   | Low bandwidth                                       | Ensure that the call has a reliable internet connection that can sustain a voice call. For more information, see the [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section. Also, suggest that the end user turn-off their camera to conserve available internet bandwidth. |

### Audio values


| Name                           | Description                                                      | Possible values                                                                                                                                                                                                                                                                                                  | Use cases                                                                                                                                                                                                                       | Mitigation steps                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| noSpeakerDevicesAvailable    | there's no audio output device (speaker) on the user's system.  | - Set to `True` when there are no speaker devices on the system, and speaker selection is supported. <br/> - Set to `False` when there's a least one speaker device on the system, and speaker selection is supported.                                                                                             | All speakers are unplugged                                                                                                                                                                                                      | When value set to `True`, consider giving visual notification to end user that their current call session doesn't have any speakers available.                                                                                                                                                                    |
| speakingWhileMicrophoneIsMuted | Speaking while being on mute.                                    | - Set to `True` when local microphone is muted and the local user is speaking. <br/> - Set to `False` when local user either stops speaking, or unmutes the microphone. <br/> - This diagnostic event can be automatically disabled if it is triggered for a certain amount of times without any user action to avoid noise and provide a better user experience. It will be re-enabled again when a new mute action occurs. | During a call, mute your microphone and speak into it.     | When value set to `True` consider giving visual notification to end user that they might be talking and not realizing that their audio is muted.                                                                                                                                                                  |
| noMicrophoneDevicesAvailable  | No audio capture devices (microphone) on the user's system       | - Set to `True` when there are no microphone devices on the system. <br/> - Set to `False` when there's at least one microphone device on the system.                                                                                                                                                              | All microphones are unplugged during the call.                                                                                                                                                                                  | When value set to `True` consider giving visual notification to end user that their current call session doesn't have a microphone. For more information, see [enable microphone from device manger](../../best-practices.md#plug-in-a-microphone-or-enable-a-microphone-from-the-device-manager-when-a-call-is-in-progress) section. |
| microphoneNotFunctioning       | Microphone isn't functioning.                                   | - Set to `True` when we fail to start sending local audio stream because the microphone device may have been disabled in the system or it's being used by another process. This UFD takes about 10 seconds to get raised. <br/> - Set to `False` when microphone starts to successfully send audio stream again. | No microphones available, microphone access disabled in a system                                                                                                                                                                | When value set to `True` give visual notification to end user that there's a problem with their microphone.                                                                                                                                                                                                      |
| microphoneMuteUnexpectedly     | Microphone is muted                                              | - Set to `True` when microphone enters muted state unexpectedly. <br/> - Set to `False` when microphone starts to successfully send audio stream                                                                                                                                                                  | Microphone is muted from the system. Most cases happen when user is on an Azure Communication Services call on a mobile device and a phone call comes in. In most cases, the operating system mutes the Azure Communication Services call so a user can answer the phone call. | When value is set to `True`, give visual notification to end user that their call was muted because a phone call came in. For more information, see how to best handle [OS muting an Azure Communication Services call](../../best-practices.md#handle-the-os-muting-a-call-when-a-phone-call-comes-in) section for more details.                                               |
| microphonePermissionDenied     | there's low volume from device or it's almost silent on macOS. | - Set to `True` when audio permission is denied from the system settings (audio). <br/> - Set to `False` on successful stream acquisition. <br/> Note: This diagnostic only works on macOS.                                                                                                                             | Microphone permissions are disabled in the Settings.                                                                                                                                                                            | When value is set to `True`, give visual notification to end user that they didn't enable permission to use microphone for an Azure Communication Services call.                                                                                                                                                                           |

### Camera values


| Name                      | Description                                            | Possible values                                                                                                                                                                                                                                                                                             | Use cases                                                                       | Mitigation steps                                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraFrozen              | Camera stops producing frames for more than 5 seconds. | - Set to `True` when the local video stream is frozen. This diagnostic means that the remote side is seeing your video frozen on their screen or it means that the remote participants aren't rendering your video on their screen. <br/> - Set to `False` when the freeze ends and users can see your video as per normal. | The Camera was lost during the call or bad network caused the camera to freeze. | When value is set to `True`, consider giving notification to end user that the remote participant network might be bad - possibly suggest that they turn off their camera to conserve bandwidth. For more information, see [Network bandwidth requirement](../network-requirements.md#network-bandwidth) section on needed internet abilities for an Azure Communication Services call. |
| cameraStartFailed         | Generic camera failure.                                | - Set to `True` when we fail to start sending local video because the camera device may have been disabled in the system or it's being used by another process~. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                   | Camera failures                                                                 | When value is set to `True`, give visual notification to end user that their camera failed to start.                                                                                                                                                                                                                                                       |
| cameraStartTimedOut       | Common scenario where camera is in bad state.          | - Set to `True` when camera device times out to start sending video stream. <br/> - Set to `False` when selected camera device successfully sends local video again.                                                                                                                                         | Camera failures                                                                 | When value is set to `True`, give visual notification to end user that their camera is possibly having problems. (When value is set back to `False` remove notification).                                                                                                                                                                                  |
| cameraPermissionDenied    | Camera permissions were denied in settings.            | - Set to `True` when camera permission is denied from the system settings (video). <br/> - Set to `False` on successful stream acquisition. <br> Note: This diagnostic only works on macOS Chrome.                                                                                                                  | Camera permissions are disabled in the settings.                                | When value is set to `True`, give visual notification to end user that they didn't enable permission to use camera for an Azure Communication Services call.                                                                                                                                                                                                                       |
| cameraStoppedUnexpectedly | Camera malfunction                                     | - Set to `True` when camera enters stopped state unexpectedly. <br/> - Set to `False` when camera starts to successfully send video stream again.                                                                                                                                                            | Check camera is functioning correctly.                                           | When value is set to `True`, give visual notification to end user that their camera is possibly having problems. (When value is set back to `False` remove notification).                                                                                                                                                                                  |

### Native only


| Name                         | Description                                                  | Possible values                                                                                                                                                                                        | Use cases                                     | Mitigation Steps                                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| speakerVolumeIsZero | Zero volume on a device (speaker). | - Set to `True` when the speaker volume is zero. <br/> - Set to `False` when speaker volume isn't zero. | Not hearing audio from participants on call. | When value is set to `True`, you may have accidentally the volume at lowest(zero). |
| speakerMuted        | Speaker device is muted.           | - Set to `True` when the speaker device is muted. <br/> - Set to `False` when the speaker device isn't muted. | Not hearing audio from participants on call. | When value is set to `True`, you may have accidentally muted the speaker.    |
| speakerBusy | Speaker is already in use. Either the device is being used in exclusive mode, or the device is being used in shared mode and the caller asked to use the device in exclusive mode. | - Set to `True` when the speaker device stream acquisition times out (audio). <br/> - Set to `False` when speaker acquisition is successful. | Not hearing audio from participants on call through speaker. | When value is set to `True`, give visual notification to end user so they can check if another application is using the speaker and try closing it. |
| speakerNotFunctioning | Speaker isn't functioning (failed to initialize the audio device client or device became inactive for more than 5 sec) | - Set to `True` when speaker is unavailable, or device stream acquisition times out (audio). <br/> - Set to `False` when speaker acquisition is successful. | Not hearing audio from participants on call through speaker. | Try checking the state of the speaker device. |
| microphoneBusy  | Microphone is already in use. Either the device is being used in exclusive mode, or the device is being used in shared mode and the caller asked to use the device in exclusive mode. | - Set to `True` when the microphone device stream acquisition times out (audio). <br/> - Set to `False` when microphone acquisition is successful. | Your audio not reaching other participants in the call. | When value is set to `True`, give visual notification to end user so they can check if another application is using the microphone and try closing it. |

## Accessing diagnostics

User-facing diagnostics is an extended feature of the core `Call` API and allows you to diagnose an active call.

```csharp
this.diagnosticsCallFeature = call.Features.LocalUserDiagnostics;
```

## User Facing Diagnostic events

- Implement listeners for diagnostic events.

```csharp
private async void Call__OnNetworkUnavailableChanged(object sender, FlagDiagnosticChangedEventArgs args)
{
  var value = args.Value;
  // Handle the diagnostic event value changed...
}

// Listen to other network diagnostics

private async void Call__OnMediaSpeakerNotFunctioningChanged(object sender, FlagDiagnosticChangedEventArgs args)
{
  var value = args.Value;
  // Handle the diagnostic event value changed...
}

// Listen to other media diagnostics
```

- Set event methods for listening to events.

```csharp
this.diagnosticsCallFeature = call.Features.LocalUserDiagnostics;
this.networkDiagnostics = diagnosticsCallFeature.Network;
this.mediaDiagnostics = diagnosticsCallFeature.Media;

this.networkDiagnostics.NetworkUnavailableChanged += Call__OnNetworkUnavailableChanged;
// Listen to other network events as well ... 

this.mediaDiagnostics.SpeakerNotFunctioningChanged += Call__OnMediaSpeakerNotFunctioningChanged;
// Listen to other media events as well ... 

// Removing listeners

this.networkDiagnostics.NetworkUnavailable -= Call__NetworkUnavailableChanged;
// Remove the other listeners as well ... 

this.mediaDiagnostics.SpeakerNotFunctioningChanged -= Call__OnMediaSpeakerNotFunctioningChanged;
// Remove the other listeners as well ... 

```

## Get the latest User Facing Diagnostics

- Get the latest diagnostic values that were raised in current call. If we still didn't receive a value for the diagnostic, `null` or `.unknown` for is returned.

```csharp
this.diagnosticsCallFeature = call.Features.LocalUserDiagnostics;
this.networkDiagnostics = diagnosticsCallFeature.Network;
this.mediaDiagnostics = diagnosticsCallFeature.Media;

bool? lastSpeakerNotFunctionValue = this.mediaDiagnostics.GetLatestDiagnostics().IsSpeakerNotFunctioning; // Boolean?
bool? lastNetworkRelayNotReachableValue = this.networkDiagnostics.GetLatestDiagnostics().IsNetworkRelaysUnreachable; // Boolean?
DiagnosticQuality lastReceiveQualityValue = this.networkDiagnostics.GetLatestDiagnostics().NetworkReceiveQuality; // DiagnosticQuality (.good, .poor, .bad)
// or .unknown if there isn't a diagnostic for this.

```
