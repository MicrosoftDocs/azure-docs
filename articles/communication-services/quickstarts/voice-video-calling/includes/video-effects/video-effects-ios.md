> [!Note]
> In order to use Video Effects on the iOS Calling SDK, a machine learning model is downloaded to the customer's device. We encourage you to review the privacy notes in your application and update them accordingly, if necessary.

You can use the Video Effects feature to add effects to your video in video calls. Background blur provides users with the mechanism to remove distractions behind a participant so that participants can communicate without disruptive activity or confidential information in the background. This feature is especially useful the context of telehealth, where a provider or patient might want to obscure their surroundings to protect sensitive information or personal data. Background blur can be applied across all virtual appointment scenarios, including telebanking and virtual hearings, to protect user privacy.

## Using video effects

Currently there's one available Video Effect: Background Blur.

The `LocalVideoEffectsFeature` object has the following API structure:

- `enable`: Enables a Video Effect on the `LocalVideoStream` instance.
- `disable`: Disables a Video Effect on the `LocalVideoStream` instance.
- `isSupported`: Indicates if a Video Effect is supported on the `LocalVideoStream` instance. 
- `onVideoEffectEnabled`: Event that is triggered when a Video Effect has been enabled successfully.
- `onVideoEffectDisabled`: Event that is triggered when a Video Effect has been disabled successfully.
- `onVideoEffectError`: Event that is triggered when a Video Effect operation fails.

Once you have the `LocalVideoEffectsFeature` object, you can subscribe to the events, events have the following delegates: `didEnableVideoEffect`, `didDisableVideoEffect`, `didReceiveVideoEffectError`. 

To use Video Effects with the Azure Communication Calling SDK, once you've created a `LocalVideoStream`, you need to get the `VideoEffects` feature API of the `LocalVideoStream` to enable/disable Video Effects:

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

and start using the APIs to enable and disable Video Effects:

```swift
localVideoEffectsFeature.enable(effect: backgroundBlurVideoEffect)
localVideoEffectsFeature.disable(effect: backgroundBlurVideoEffect)
```

### Background blur

Background Blur is a Video Effect that allows a person's background to be blurred. In order to use Background Video Effect, you need to obtain a `LocalVideoEffectsFeature` feature from a valid `LocalVideoStream`.

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
