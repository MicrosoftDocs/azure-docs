---
author: garchiro7
ms.service: azure-communication-services
ms.topic: include
ms.date: 04/30/2024
ms.author: jorgarcia
---

## Learn how to configure audio filters with the Native Calling SDKs 

The Azure Communication Services audio effects offer filters that can improve your audio call. For native platforms (Android, iOS, and Windows), you can configure the following filters.

### Echo cancellation

You can eliminate acoustic echo caused by the caller's voice echoing back into the microphone after it's emitted from the speaker. Echo cancellation ensures clear communication.

You can configure the filter before and during a call. You can toggle echo cancellation only if music mode is enabled. By default, this filter is enabled.

### Noise suppression

You can improve audio quality by filtering out unwanted background noises such as typing, air conditioning, or street sounds. This technology ensures that the voice is crisp and clear to facilitate more effective communication.

You can configure the filter before and during a call. The currently available modes are **Off**, **Auto**, **Low**, and **High**. By default, this feature is set to **High**.

### Automatic gain control

You can automatically adjust the microphone's volume to ensure consistent audio levels throughout the call.

- Analog automatic gain control is a filter that's available only before a call. By default, this filter is enabled.
- Digital automatic gain control is a filter that's available only before a call. By default, this filter is enabled.

### Music mode

Music mode is a filter that's available before and during a call. To learn more about music mode, see [Music mode on Native Calling SDK](../../../concepts/voice-video-calling/music-mode.md). Music mode works only on native platforms over one-on-one or group calls. It doesn't work in one-to-one calls between native platforms and the web. By default, music mode is disabled.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Azure Communication Services resource. [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../../quickstarts/voice-video-calling/getting-started-with-calling.md).