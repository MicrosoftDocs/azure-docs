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

> [!Note]
> In order to use Video Effects on the Android Calling SDK, a machine learning model is downloaded to the customer's device. We encourage you to review the privacy notes in your application and update them accordingly, if necessary.

You can use the Video Effects feature to add effects to your video in video calls. Background blur provides users with the mechanism to remove distractions behind a participant so that participants can communicate without disruptive activity or confidential information in the background. This feature is especially useful the context of telehealth, where a provider or patient might want to obscure their surroundings to protect sensitive information or personal data. Background blur can be applied across all virtual appointment scenarios, including telebanking and virtual hearings, to protect user privacy.

This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-android) for Android.

## Using video effects

> [!Note]
> Video effects support on Android is limited to the **last four** major versions of Android. For example, when a new, major version of Android is released, the Android requirement is the new version and the three most recent versions that precede it.

Currently there's one available Video Effect: Background Blur.

The `VideoEffectsLocalVideoStreamFeature` object has the following API structure:

- `enableEffect`: Enables a Video Effect on the `LocalVideoStream` instance.
- `disableEffect`: Disables a Video Effect on the `LocalVideoStream` instance.
- `OnVideoEffectEnabledListener`: Event that is triggered when a Video Effect has been enabled successfully.
- `OnVideoEffectDisabledListener`: Event that is triggered when a Video Effect has been disabled successfully.
- `OnVideoEffectErrorListener`: Event that is triggered when a Video Effect operation fails.

The `VideoEffectEnabledEvent`, `VideoEffectDisabledEvent` and `VideoEffectErrorEvent` objects have the following API structure:

 - `getVideoEffectName`: Gets the name of the Video Effect that triggered the event.

Once you have the `VideoEffectsLocalVideoStreamFeature` object, you can subscribe to the events:

To use Video Effects with the Azure Communication Calling SDK, once you've created a `LocalVideoStream`, you need to get the `VideoEffects` feature API of the `LocalVideoStream` to enable/disable Video Effects:

```java
// Obtain the Video Effects feature from the LocalVideoStream object that is sending the video.
VideoEffectsLocalVideoStreamFeature videoEffectsFeature = currentVideoStream.feature(Features.LOCAL_VIDEO_EFFECTS);
```

```java
// Create event handlers for the events
private void handleOnVideoEffectEnabled(VideoEffectEnabledEvent args) {
}
private void handleOnVideoEffectDisabled(VideoEffectDisabledEvent args) {
}
private void handleOnVideoEffectError(VideoEffectErrorEvent args) {
}
 
// Subscribe to the events
videoEffectsFeature.addOnVideoEffectEnabledListener(this::handleOnVideoEffectEnabled);
videoEffectsFeature.addOnVideoEffectDisabledListener(this::handleOnVideoEffectDisabled);
videoEffectsFeature.addOnVideoEffectErrorListener(this::handleOnVideoEffectError);
```

and start using the APIs to enable and disable Video Effects:

```java
videoEffectsFeature.enableEffect( {{VIDEO_EFFECT_TO_DISABLE}} );
videoEffectsFeature.disableEffect( {{VIDEO_EFFECT_TO_DISABLE}} );
```

### Background blur

Background Blur is a Video Effect that allows a person's background to be blurred. In order to use Background Video Effect, you need to obtain a `VideoEffectsLocalVideoStreamFeature` feature from a valid `LocalVideoStream`.

To enable Background Blur Video Effect:

- Create a method that obtains the `VideoEFfects` Feature subscribes to the events:

```java
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

VideoEffectsLocalVideoStreamFeature videoEffectsFeature;
public void createVideoEffectsFeature() {
    videoEffectsFeature = currentVideoStream.feature(Features.LOCAL_VIDEO_EFFECTS);
    videoEffectsFeature.addOnVideoEffectEnabledListener(this::handleOnVideoEffectEnabled);
    videoEffectsFeature.addOnVideoEffectDisabledListener(this::handleOnVideoEffectDisabled);
    videoEffectsFeature.addOnVideoEffectErrorListener(this::handleOnVideoEffectError);
}

```

- Create a new Background Blur Video Effect object:

```java
BackgroundBlurEffect backgroundBlurVideoEffect = new BackgroundBlurEffect();
```

- Call `EnableEffect` on the `videoEffectsFeature` object:

```java
public void enableBackgroundBlur() {
    videoEffectsFeature.enableEffect(backgroundBlurEffect);
}
```

To disable Background Blur Video Effect:

```java
public void disableBackgroundBlur() {
    videoEffectsFeature.disableEffect(backgroundBlurEffect);
}
```
