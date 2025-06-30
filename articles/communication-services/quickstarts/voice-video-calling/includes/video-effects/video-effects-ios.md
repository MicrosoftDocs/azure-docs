---
title: Enable video background effects
titleSuffix: An Azure Communication Services article
description: This article describes how to add video effects in your video calls using Azure Communication Services.
author: sloanster

ms.author: micahvivion
ms.date: 06/24/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other
---

> [!Note]
> To use Video Effects on the iOS Calling SDK, Azure Communication Services downloads a machine learning model to the customer's device. We encourage you to review the privacy notes in your application and update them accordingly, if necessary.

You can use the Video Effects feature to add effects to your video in video calls. Background blur provides users with the mechanism to remove distractions behind a participant so that participants can communicate without disruptive activity or confidential information in the background.

This feature is most useful the context of telehealth, where a provider or patient might want to obscure their surroundings to protect sensitive information or personal data. Background blur can be applied across all virtual appointment scenarios, including telebanking and virtual hearings, to protect user privacy.

## Implement video effects

> [!Note]
> Video effects support on iOS is limited to the **two** most recent major versions of iOS. For example, when a new, major version of iOS is released, the iOS requirement is the new version and the most recent versions that preceded it.

Currently there's one available Video Effect: Background Blur.

The `LocalVideoEffectsFeature` object has the following API structure:

- `enable`: Enables a Video Effect on the `LocalVideoStream` instance.
- `disable`: Disables a Video Effect on the `LocalVideoStream` instance.
- `isSupported`: Indicates if a Video Effect is supported on the `LocalVideoStream` instance. 
- `onVideoEffectEnabled`: Event that is triggered when a Video Effect is enabled successfully.
- `onVideoEffectDisabled`: Event that is triggered when a Video Effect is disabled successfully.
- `onVideoEffectError`: Event that is triggered when a Video Effect operation fails.

Once you have the `LocalVideoEffectsFeature` object, you can subscribe to the events, events have the following delegates: `didEnableVideoEffect`, `didDisableVideoEffect`, `didReceiveVideoEffectError`. 

To use Video Effects with the Azure Communication Calling SDK, once you create a `LocalVideoStream`, you need to get the `VideoEffects` feature API of the `LocalVideoStream` to enable/disable Video Effects:

```swift
// Obtain the Video Effects feature from the LocalVideoStream object that is sending the video.
@State var localVideoEffectsFeature: LocalVideoEffectsFeature?
localVideoEffectsFeature = self.localVideoStreams.first.feature(Features.localVideoEffects)
```

```swift
// Subscribe to the events
public func localVideoEffectsFeature(_ videoEffectsLocalVideoStreamFeature: LocalVideoEffectsFeature, didEnableVideoEffect args: VideoEffectEnabledEventArgs) {
        os_log("Video Effect Enabled, VideoEffectName: %s", log:log, args.videoEffectName)
    }
public func localVideoEffectsFeature(_ videoEffectsLocalVideoStreamFeature: LocalVideoEffectsFeature, didDisableVideoEffect args: VideoEffectDisabledEventArgs) {
    os_log("Video Effect Disabled, VideoEffectName: %s", log:log, args.videoEffectName)
}
public func localVideoEffectsFeature(_ videoEffectsLocalVideoStreamFeature: LocalVideoEffectsFeature, didReceiveVideoEffectError args: VideoEffectErrorEventArgs) {
    os_log("Video Effect Error, VideoEffectName: %s, Code: %s, Message: %s", log:log, args.videoEffectName, args.code, args.message)
}
```

Then start using the APIs to enable and disable Video Effects:

```swift
localVideoEffectsFeature.enable(effect: backgroundBlurVideoEffect)
localVideoEffectsFeature.disable(effect: backgroundBlurVideoEffect)
```

### Background blur

Background Blur is a Video Effect that enables the application to blur a person's background. To use Background Video Effect, you need to obtain a `LocalVideoEffectsFeature` feature from a valid `LocalVideoStream`.

- Create a new Background Blur Video Effect object:

  ```swift
  @State var backgroundBlurVideoEffect: BackgroundBlurEffect?
  ```

- Check if `BackgroundBlurEffect` is supported and call `Enable` on the `videoEffectsFeature` object:

  ```swift
  if((localVideoEffectsFeature.isSupported(effect: backgroundBlurVideoEffect)) != nil)
  {
      localVideoEffectsFeature.enable(effect: backgroundBlurVideoEffect)
  }
  ```

To disable Background Blur Video Effect:

```swift
localVideoEffectsFeature.disable(effect: backgroundBlurVideoEffect)
```

### Background Replacement

Background Replacement is a Video Effect that enables a person to set their own custom background. To use Background Replacement Effect, you need to obtain a `LocalVideoEffectsFeature` feature from a valid `LocalVideoStream`.

- Create a new Background Replacement Video Effect object:

  ```swift
  @State var backgroundReplacementVideoEffect: BackgroundReplacementEffect?
  ```

- Set a custom background by passing in the image through a buffer.

  ```swift
  let image = UIImage(named:"image.png")
  guard let imageData = image?.jpegData(compressionQuality: 1.0) else {
  return
  }
  backgroundReplacementVideoEffect.buffer = imageData
  ```

- Check if `BackgroundReplacementEffect` is supported and call `Enable` on the `videoEffectsFeature` object:

  ```swift
  if((localVideoEffectsFeature.isSupported(effect: backgroundReplacementVideoEffect)) != nil)
  {
      localVideoEffectsFeature.enable(effect: backgroundReplacementVideoEffect)
  }
  ```

To disable Background Replacement Video Effect:

```swift
localVideoEffectsFeature.disable(effect: backgroundReplacementVideoEffect)
```
