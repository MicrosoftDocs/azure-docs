---
title: Azure Communication Services feature map
titleSuffix: An Azure Communication Services conceptual article
description: Feature map of Azure Communication Services for comparison with Twilio Video.
author: sloanster
services: azure-communication-services

ms.author: micahvivion
ms.date: 04/04/2024
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: calling
---

# Azure Communication Services Calling SDK feature map

Azure Communication Services Calling SDK enables developers to add voice and video calling to their applications. The SDK has feature parity with Twilio’s Video platform, with several additional features to further improve your communications platform. 

Click any checkmark (✔️) to see the related documentation.

| **Feature** | **Web (JavaScript)** | **iOS** | **Android** | **Windows** | **Platform Neutral** |
| ------------| -------------------- | ------- | ----------- | ----------- | -------------------- |
| **Install** | [✔️](../quickstarts/voice-video-calling/getting-started-with-calling.md?tabs=uwp&pivots=platform-web#install-the-package) | [✔️](../quickstarts/voice-video-calling/getting-started-with-calling.md?tabs=uwp&pivots=platform-ios#install-the-package-and-dependencies-with-cocoapods) | [✔️](../quickstarts/voice-video-calling/getting-started-with-calling.md?tabs=uwp&pivots=platform-android#install-the-package) | [✔️](../quickstarts/voice-video-calling/getting-started-with-calling.md?tabs=uwp&pivots=platform-windows#install-the-package) |     |
| **Import** | [✔️](../quickstarts/voice-video-calling/getting-started-with-calling.md?tabs=uwp&pivots=platform-web#install-the-package) | [✔️](../quickstarts/voice-video-calling/getting-started-with-calling.md?tabs=uwp&pivots=platform-ios#install-the-package-and-dependencies-with-cocoapods) | [✔️](../quickstarts/voice-video-calling/getting-started-with-calling.md?tabs=uwp&pivots=platform-android#install-the-package) | [✔️](../quickstarts/voice-video-calling/getting-started-with-calling.md?tabs=uwp&pivots=platform-windows#install-the-package) |     |
| **Identity/Authentication** |     |     |     |     | [✔️](../quickstarts/identity/access-tokens.md?tabs=windows&pivots=platform-azportal) |
| **Join** | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-web#join-a-room-call) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-ios#join-a-room-call) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-android#join-a-room-call) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-windows#create-callagent-and-place-a-call) |     |
| **Start Audio/Speaker** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web#device-management) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-ios#manage-devices) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-android#device-management) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-windows#place-a-11-call-with-video-camera) |     |
| **Mute** | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-web#mute-and-unmute) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-ios#mute-and-unmute) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-android#mute-and-unmute) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-windows#mute-and-unmute) |     |
| **Unmute** | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-web#mute-and-unmute) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-ios#mute-and-unmute) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-android#mute-and-unmute) | [✔️](../how-tos/calling-sdk/manage-calls.md?pivots=platform-windows#mute-and-unmute) |     |
| **Start Video** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web#start-and-stop-sending-local-video-while-on-a-call) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-ios#get-a-local-camera-preview) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-android#start-and-stop-sending-local-video) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-windows#local-camera-preview) |      |
| **Stop Video** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web#start-and-stop-sending-local-video-while-on-a-call) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-ios#get-a-local-camera-preview) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-android#start-and-stop-sending-local-video) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-windows#local-camera-preview) |    |
| **Virtual Background** | [✔️](../quickstarts/voice-video-calling/get-started-video-effects.md?pivots=platform-web) | [✔️](../quickstarts/voice-video-calling/get-started-video-effects.md?pivots=platform-ios) | [✔️](../quickstarts/voice-video-calling/get-started-video-effects.md?pivots=platform-android) | [✔️](../quickstarts/voice-video-calling/get-started-video-effects.md?pivots=platform-windows) |     |
| **Render User Video** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web#render-remote-participant-videoscreensharing-streams) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-ios#render-remote-participant-video-streams) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-android#render-remote-participant-video-streams) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-windows#render-remote-camera-stream) |     |
| **Recording** |    |     |     |     | [✔️](../concepts/voice-video-calling/call-recording.md) |
| **Network Bandwidth Management** | [✔️](../quickstarts/voice-video-calling/get-started-video-constraints.md?pivots=platform-web) | [✔️](../quickstarts/voice-video-calling/get-started-video-constraints.md?pivots=platform-ios) | [✔️](../quickstarts/voice-video-calling/get-started-video-constraints.md?pivots=platform-android) | [✔️](../quickstarts/voice-video-calling/get-started-video-constraints.md?pivots=platform-windows) |     |
| **Quality of Service** |     |     |     |     | [✔️](../concepts/voice-video-calling/manage-call-quality.md)  |
| **Data Center Selection** |     |     |     |     | [✔️](../concepts/detailed-call-flows.md#call-flow-principles) |
| **Preview** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web.md#local-camera-preview) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-ios#get-a-local-camera-preview) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-android#start-and-stop-sending-local-video) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-windows#local-camera-preview) |     |
| **Security** |     |     |     |     | [✔️](../concepts/detailed-call-flows.md#media-encryption) |
| **Networking** |     |     |     |     | [✔️](../concepts/voice-video-calling/network-requirements.md) |
| **Screen Share** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web#start-and-stop-screen-sharing-while-on-a-call) |     |     |     |     |
| **Rest APIs** |     |     |     |     | [✔️](/rest/api/communication/) |
| **Webhooks**  |     |     |     |     | [✔️](/azure/event-grid/communication-services-voice-video-events) |
| **Raw Data** | [✔️](../quickstarts/voice-video-calling/get-started-raw-media-access.md?pivots=platform-web) | [✔️](../quickstarts/voice-video-calling/get-started-raw-media-access.md?pivots=platform-ios) | [✔️](../quickstarts/voice-video-calling/get-started-raw-media-access.md?pivots=platform-android) | [✔️](../quickstarts/voice-video-calling/get-started-raw-media-access.md?pivots=platform-windows) |     |
| **Codecs** |     |     |     |     | [✔️](../concepts/voice-video-calling/about-call-types.md#supported-video-standards) |
| **WebView** |     | [✔️](../quickstarts/voice-video-calling/get-started-webview.md?pivots=platform-ios) | [✔️](../quickstarts/voice-video-calling/get-started-webview.md?pivots=platform-android) |     |     |
| **Video Devices** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web#device-management) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-ios#manage-devices) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-android#device-management) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-windows#initialize-the-callagent) |     |
| **Speaker Devices** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web#set-the-default-microphone-and-speaker) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-ios#manage-devices) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-android#device-management) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-windows#initialize-the-callagent) |     |
| **Microphone Devices** | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-web#set-the-default-microphone-and-speaker) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-ios#manage-devices) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-android#device-management) | [✔️](../how-tos/calling-sdk/manage-video.md?pivots=platform-windows#initialize-the-callagent) |     |
| **Data Channel API** | [✔️](../quickstarts/voice-video-calling/get-started-data-channel.md?pivots=platform-web) | [✔️](../quickstarts/voice-video-calling/get-started-data-channel.md?pivots=platform-ios) | [✔️](../quickstarts/voice-video-calling/get-started-data-channel.md?pivots=platform-android) | [✔️](../quickstarts/voice-video-calling/get-started-data-channel.md?pivots=platform-windows) |     |
| **Analytics/Video Insights** |     |     |     |     | [✔️](../concepts/analytics/insights/voice-and-video-insights.md) |
| **Diagnostic Tooling** |     |     |     |     | [✔️](../concepts/voice-video-calling/call-diagnostics.md) |
| **Reports** |     |     |     |     | [✔️](../concepts/analytics/enable-logging.md) |
| **CallKit (iOS Only)** |     | [✔️](../how-tos/calling-sdk/callkit-integration.md) |     |     |     |
| **Picture-in-picture** |       | [✔️](../how-tos/ui-library-sdk/picture-in-picture.md?tabs=kotlin&pivots=platform-ios)  | [✔️](../how-tos/ui-library-sdk/picture-in-picture.md?tabs=kotlin&pivots=platform-android) |     |     |

## Next steps

[Migrate from Twilio Video to Azure Communication Services.](../tutorials/migrating-to-azure-communication-services-calling.md)

## Related articles

For more information about using the Calling SDK on different platforms, see [Calling SDK overview > Detailed capabilities](./voice-video-calling/calling-sdk-features.md#detailed-capabilities).

For more information about migrating from Twilio Video, see [Migrate to Azure Communication Services Calling SDK](./migrate-to-azure-communication-services.md).


