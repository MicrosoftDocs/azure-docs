---
author: garchiro7
ms.service: azure-communication-services
ms.topic: include
ms.date: 04/30/2024
ms.author: jorgarcia
---

## Learn how to configure the audio  filters with the Calling Native SDKs. 

The Azure Communication Services audio effects offer filters that can improve your audio call. For native platforms (Android, iOS & Windows) you can configure the following filters:

### Echo cancellation

It eliminates acoustic echo caused by the caller's voice echoing back into the microphone after being emitted from the speaker, ensuring clear communication.

You can configure the filter before and during a call. You can only toggle echo cancellation only if music mode is enabled. By default, this filter is **enabled**.

### Noise suppression

Improve the audio quality filtering out unwanted background noises such as typing, air conditioning, or street sounds. This technology ensures that the voice is crisp and clear, facilitating more effective communication.

You can configure the filter before and during a call. The currently available modes are `Off`, `Auto`, `Low`, and `High`. By default, this feature is set to **`High` mode**.

### Automatic gain control (AGC)

Automatically adjusts the microphone's volume to ensure consistent audio levels throughout the call.  

- Analog automatic gain control is a filter only available before a call. By default, this filter is **enabled**.
- Digital automatic gain control is a filter only available before a call. By default, this filter is **enabled**.

### Music Mode

Music mode is a filter available before and during a call. Learn more about music mode [here](../../../concepts/voice-video-calling/music-mode.md). Music mode only works on native platforms over 1n1 or group calls and doesn't work in 1:1 calls between native and web. By default, music mode is **disabled**.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- A deployed Communication Services resource. [Create a Communication Services resource](../../../quickstarts/create-communication-resource.md)
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../../quickstarts/voice-video-calling/getting-started-with-calling.md)