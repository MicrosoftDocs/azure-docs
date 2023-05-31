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

> [!Note]
> In order to use Video Effects on the Windows Calling SDK, a machine learning model is downloaded to the customer's device. We encourage you to review the privacy notes in your application and update them accordingly, if necessary.

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

To use Video Effects with the Azure Communication Calling SDK, add the variables to MainPage.

```C#
public sealed partial class MainPage : Page
{
    private LocalVideoEffectsFeature localVideoEffectsFeature;
}
```
Once you've created a `LocalVideoStream`, you need to get the `VideoEffects` feature API of the `LocalVideoStream` to enable/disable Video Effects.

```C#
private async void CameraList_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    var selectedCamerea = CameraList.SelectedItem as VideoDeviceDetails;
    cameraStream = new LocalOutgoingVideoStream(selectedCamerea);
    InitVideoEffectsFeature(cameraStream);
    
    var localUri = await cameraStream.StartPreviewAsync();
    await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
    {
        LocalVideo.Source = MediaSource.CreateFromUri(localUri);
    });
}

public void InitVideoEffectsFeature(LocalOutgoingVideoStream videoStream){
    localVideoEffectsFeature = videoStream.Features.VideoEffects;
    localVideoEffectsFeature.VideoEffectEnabled += LocalVideoEffectsFeature_VideoEffectEnabled;
    localVideoEffectsFeature.VideoEffectDisabled += LocalVideoEffectsFeature_VideoEffectDisabled;
    localVideoEffectsFeature.VideoEffectError += LocalVideoEffectsFeature_VideoEffectError;
}

// Create event handlers for the events
private void LocalVideoEffectsFeature_VideoEffectEnabled(object sender, VideoEffectEnabledEventArgs args)
{
}

private void LocalVideoEffectsFeature_VideoEffectDisabled(object sender, VideoEffectDisabledEventArgs args)
{
}

private void LocalVideoEffectsFeature_VideoEffectError(object sender, VideoEffectErrorEventArgs args)
{
}
 
// Subscribe to the events
videoEffectsFeature.VideoEffectEnabled += VideoEffectsFeature_OnVideoEffectEnabled;
videoEffectsFeature.VideoEffectDisabled += VideoEffectsFeature_OnVideoEffectDisabled;
videoEffectsFeature.VideoEffectError += VideoEffectsFeature_OnVideoEffectError;
```

and start using the APIs to enable and disable Video Effects:

```C#
videoEffectsLocalVideoStreamFeature.EnableEffect( {{VIDEO_EFFECT_TO_ENABLE}} );
videoEffectsLocalVideoStreamFeature.DisableEffect( {{VIDEO_EFFECT_TO_DISABLE}} );
```

### Background blur

Background Blur is a Video Effect that allows a person's background to be blurred. In order to use Background Video Effect, you need to obtain a `VideoEffectsLocalVideoStreamFeature` feature from a valid `LocalVideoStream`.

To enable Background Blur Video Effect:

- Add the `BackgroundBlurEffect` instance to the MainPage.

```C#
public sealed partial class MainPage : Page
{
    private BackgroundBlurEffect backgroundBlurVideoEffect = new BackgroundBlurEffect();
}
```

- Create a method that obtains the `VideoEFfects` Feature subscribes to the events:

```C#
private async void LocalVideoEffectsFeature_VideoEffectEnabled(object sender, VideoEffectEnabledEventArgs e)
{
    await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, async () =>
    {
        BackgroundBlur.IsChecked = true;
    });
}

private async void LocalVideoEffectsFeature_VideoEffectDisabled(object sender, VideoEffectDisabledEventArgs e)
{
    await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, async () =>
    {
        BackgroundBlur.IsChecked = false;
    });
}

private void LocalVideoEffectsFeature_VideoEffectError(object sender, VideoEffectErrorEventArgs e)
{
    String effectName = args.VideoEffectName;
    String errorCode = args.Code;
    String errorMessage = args.Message;

    Trace.WriteLine("VideoEffects VideoEffectError on effect " + effectName + "with code "
        + errorCode + "and error message " + errorMessage);
}
```

- Enable and disable the Background Blur effect:

```C#
private async void BackgroundBlur_Click(object sender, RoutedEventArgs e)
{
    if (localVideoEffectsFeature.IsEffectSupported(backgroundBlurVideoEffect))
    {
        var backgroundBlurCheckbox = sender as CheckBox;
        if (backgroundBlurCheckbox.IsChecked.Value)
        {
            localVideoEffectsFeature.EnableEffect(backgroundBlurVideoEffect);
        }
        else
        {
            localVideoEffectsFeature.DisableEffect(backgroundBlurVideoEffect);
        }
    }
}
```
