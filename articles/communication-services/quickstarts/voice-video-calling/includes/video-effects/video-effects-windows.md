---
title: Quickstart - Add video effects to your video calls (Windows)
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

> [!IMPORTANT]
> The Calling Video Effects are available starting on the public preview version [1.0.0-beta.1]([https://central.sonatype.com/artifact/com.azure.android/azure-communication-calling/2.5.1-beta.4](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.0.0-beta.1) of the Windows Calling SDK. Please ensure that you use this or a newer SDK when using Video Effects. This API is provided as a preview ('beta') for developers and may change based on feedback that we receive.

> [!Note]
> In order to use Video Effects on the Android Calling SDK, a machine learning model is downloaded to the customer's device. We encourage you to review the privacy notes in your application and update them accordingly, if necessary.

You can use the Video Effects feature to add effects to your video in video calls. Background blur provides users with the mechanism to remove distractions behind a participant so that participants can communicate without disruptive activity or confidential information in the background. This feature is especially useful the context of telehealth, where a provider or patient might want to obscure their surroundings to protect sensitive information or personal data. Background blur can be applied across all virtual appointment scenarios, including telebanking and virtual hearings, to protect user privacy.

This quickstart builds on [Quickstart: Add 1:1 video calling to your app](../../get-started-with-video-calling.md?pivots=platform-windows) for Windows.

## Using video effects

Currently there's one available Video Effect: Background Blur.

The `VideoEffectsLocalVideoStreamFeature` object has the following API structure:

- `EnableEffect`: Enables a Video Effect on the `LocalVideoStream` instance.
- `DisableEffect`: Disables a Video Effect on the `LocalVideoStream` instance.
- `VideoEffectEnabled`: Event that is triggered when a Video Effect has been enabled successfully.
- `VideoEffectDisabledListener`: Event that is triggered when a Video Effect has been disabled successfully.
- `VideoEffectErrorListener`: Event that is triggered when a Video Effect operation fails.

The `VideoEffectEnabledEvent`, `VideoEffectDisabledEvent` and `VideoEffectErrorEvent` objects have the following API structure:

 - `VideoEffectName`: Gets the name of the Video Effect that triggered the event.

Once you have the `VideoEffectsLocalVideoStreamFeature` object, you can subscribe to the events:

To use Video Effects with the Azure Communication Calling SDK, once you've created a `LocalVideoStream`, you need to get the `VideoEffects` feature API of the `LocalVideoStream` to enable/disable Video Effects:

```C#
// Obtain the Video Effects feature from the LocalVideoStream object that is sending the video.
VideoEffectsLocalVideoStreamFeature videoEffectsFeature = localVideoStream.Features.VideoEffects;
```

```C#
// Create event handlers for the events
private void VideoEffectsFeature_OnVideoEffectEnabled(object sender, VideoEffectEnabledEventArgs args)
{
}

private void VideoEffectsFeature_OnVideoEffectDisabled(object sender, VideoEffectDisabledEventArgs args)
{
}

private void VideoEffectsFeature_OnVideoEffectError(object sender, VideoEffectErrorEventArgs args)
{
}
 
// Subscribe to the events
videoEffectsFeature.VideoEffectEnabled += VideoEffectsFeature_OnVideoEffectEnabled;
videoEffectsFeature.VideoEffectDisabled += VideoEffectsFeature_OnVideoEffectDisabled;
videoEffectsFeature.VideoEffectError += VideoEffectsFeature_OnVideoEffectError;
```

and start using the APIs to enable and disable Video Effects:

```C#
videoEffectsLocalVideoStreamFeature.EnableEffect( {{VIDEO_EFFECT_TO ENABLE}} );
videoEffectsLocalVideoStreamFeature.DisableEffect( {{VIDEO_EFFECT_TO ENABLE}} );
```

### Background blur

Background Blur is a Video Effect that allows a person's background to be blurred. In order to use Background Video Effect, you need to obtain a `VideoEffectsLocalVideoStreamFeature` feature from a valid `LocalVideoStream`.

To enable Background Blur Video Effect:

- Create a method that obtains the `VideoEFfects` Feature subscribes to the events:

```C#
private void VideoEffectsFeature_VideoEffectEnabled(object sender, VideoEffectEnabledEventArgs args)
{
    string effectName = args.VideoEffectName;
    Trace.WriteLine("VideoEffects VideoEffectEnabled on effect " + effectName);
}

private void VideoEffectsFeature_VideoEffectDisabled(object sender, VideoEffectDisabledEventArgs args)
{
    String effectName = args.VideoEffectName;
    Trace.WriteLine("VideoEffects VideoEffectDisabled on effect " + effectName);
}

private void VideoEffectsFeature_VideoEffectError(object sender, VideoEffectErrorEventArgs args)
{
    String effectName = args.VideoEffectName;
    String errorCode = args.Code;
    String errorMessage = args.Message;

    Trace.WriteLine("VideoEffects VideoEffectError on effect " + effectName + "with code "
        + errorCode + "and error message " + errorMessage);
}

VideoEffectsLocalVideoStreamFeature videoEffectsFeature;
public void createVideoEffectsFeature() {
    videoEffectsFeature = localVideoStream.Features.VideoEffects;
    videoEffectsFeature.VideoEffectEnabled += VideoEffectsFeature_VideoEffectEnabled;
    videoEffectsFeature.VideoEffectDisabled += VideoEffectsFeature_VideoEffectDisabled;
    videoEffectsFeature.VideoEffectError += VideoEffectsFeature_VideoEffectError;
}
```

- Create a new Background Blur Video Effect object:

```C#
BackgroundBlurEffect backgroundBlurVideoEffect = new BackgroundBlurEffect();
```

- Call `EnableEffect` on the `videoEffectsFeature` object:
```C#
public void EnableBackgroundBlur() {
    videoEffectsFeature.EnableEffect(backgroundBlurVideoEffect);
}
```

To disable Background Blur Video Effect:

```C#
public void DisableBackgroundBlur() {
    videoEffectsFeature.disableEffect(backgroundBlurVideoEffect);
}
```
