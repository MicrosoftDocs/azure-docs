---
title: Quickstart - Add video effects to your video calls (Android)
titleSuffix: An Azure Communication Services quickstart
description: Learn how to add video effects in your video calls using Azure Communication Services.
author: jsaurezlee

ms.author: micahvivion
ms.date: 04/04/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

You can use the Video Effects feature to add effects to your video in video calls. This feature enables developers to build background visual effects. Background blur provides users with the mechanism to remove distractions behind a participant so that participants can communicate without disruptive activity or confidential information in the background. This is especially useful the context of telehealth, where a provider or patient might want to obscure their surroundings to protect sensitive information or personally identifiable information. Background blur can be applied across all virtual appointment scenarios, including telebanking and virtual hearings, to protect user privacy.

> [!IMPORTANT]
> The Calling Video Effects are available starting on the public preview version [2.5.1-beta.4](https://central.sonatype.com/artifact/com.azure.android/azure-communication-calling/2.5.1-beta.4) of the Android Calling SDK. Please ensure that you use this or a newer SDK when using Video Effects.

> [!IMPORTANT]
> In order to use Video Effects on the Android Calling SDK, a machine learning model is downloaded to the customer's device.

> [!NOTE]
> This API is provided as a preview ('beta') for developers and may change based on feedback that we receive.

## Using video effects

> [!NOTE]
> Currently there's one available Video Effect:
> - Background Blur.

The `VideoEffectsLocalVideoStreamFeature` object have the following API structure:

- `enableEffect`: Enables a Video Effect on the `LocalVideoStream` instance.
- `disableEffects`: Disables all the currently running Video Effects:
- `OnVideoEffectEnabledListener`: Event that is triggered when a Video Effect has been enabled successfully.
- `OnVideoEffectDisabledListener`: Event that is triggered when a Video Effect has been disabled successfully.
- `OnVideoEffectErrorListener`: Event that is triggered when a Video Effect operation fails.

The `VideoEffectEnabledEvent`, `VideoEffectDisabledEvent` and `VideoEffectErrorEvent` objects have the following API structure:

 - `getVideoEffectName`: Gets the name of the Video Effect that triggered the event.

Once you have the `VideoEffectsLocalVideoStreamFeature` object, you can subscribe to the events:

To use Video Effects with the Azure Communication Calling SDK, once you've created a `LocalVideoStream`, you need to get the `VideoEffects` feature API of the `LocalVideoStream` to enable/disable Video Effects:

```java
// Obtain the Video Effects feature from the LocalVideoStream object that is sending the video.
VideoEffectsLocalVideoStreamFeature videoEffectsFeature = localVideoStream.feature(Features.VIDEO_EFFECTS);
```

```java
// Create event handlers for the events
private void handleOnVideoEffectEnabled(VideoEffectEnabledEvent args) {
   Log.i("VideoEfects", "Effect enabled for effect " + args.getVideoEffectName());
}
private void handleOnVideoEffectDisabled(VideoEffectDisabledEvent args) {
   Log.i("VideoEfects", "Effect disabled for effect " + args.getVideoEffectName());
}
private void handleOnVideoEffectError(VideoEffectErrorEvent args) {
   Log.i("VideoEfects", "Error " + args.getCode() + ":" + args.getMessage()
           + " for effect " + args.getVideoEffectName());
}
 
// Subscribe to the events
videoEffectsFeature.addOnVideoEffectEnabledListener(this::handleOnVideoEffectStarted);
videoEffectsFeature.addOnVideoEffectDisabledListener(this::handleOnVideoEffectStopped);
videoEffectsFeature.addOnVideoEffectErrorListener(this::handleOnVideoEffectError);
```

and start using the API's to enable and disable Video Effects:

```java
videoEffectsFeature.enableEffect( {{VIDEO_EFFECT_TO ENABLE}} );
videoEffectsFeature.disableEffects();
```

### Background blur

> [!IMPORTANT]
> Background Blur Video Effect requires a machine learning model that is downloaded to the customer's device.

Backgorund Blur is a Video Effect that allow a person's background to be blurred. In order to use Background Video Effect, you need to obtain a `VideoEffectsLocalVideoStreamFeature` feature from a valid `LocalVideoStream`.

To enable Background Blur Video Effect:

- Create a new Background Blur Video Effect object

```java
// Create a new BackgroundBlur Video Effect object.
BackgroundBlurEffect backgroundBlurEffect = new BackgroundBlurEffect();

// Enable the the Background Blur Video Effect on the Video Effects Feature.
videoEffectsFeature.enableEffect(backgroundBlurEffect);
```

To disable Background Blur Video Effect:

```java
videoEffectsFeature.disableEffects();
```
