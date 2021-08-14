---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: mikben
---

## Record calls
> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the ACS Calling Android SDK has the `isRecordingActive` and `addOnIsRecordingActiveChangedListener` are part of the `Call` object. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.

> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Android SDK

Call recording is an extended feature of the core `Call` API. You first need to obtain the recording feature API object:

```java
RecordingFeature callRecordingFeature = call.api(RecordingFeature.class);
```

Then, to check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingFeature`. It returns `boolean`.

```java
boolean isRecordingActive = callRecordingFeature.isRecordingActive();
```

You can also subscribe to recording changes:

```java
private void handleCallOnIsRecordingChanged(PropertyChangedEvent args) {
	boolean isRecordingActive = callRecordingFeature.isRecordingActive();
}

callRecordingFeature.addOnIsRecordingActiveChangedListener(handleCallOnIsRecordingChanged);
```

If you want to start recording from your application, please first follow [Calling Recording overview](../../../../concepts/voice-video-calling/call-recording.md) for the steps to set up call recording.

Once you have the call recording setup on your server, from your Android application you need to obtain the `ServerCallId` value from the call and then send it to your server to start the recording process. The `ServerCallId` value can be found using `getServerCallId()` from the `CallInfo` class, which can be found in the class object using `getInfo()`.

```java
try {
	String serverCallId = call.getInfo().getServerCallId().get();
	// Send serverCallId to your recording server to start the call recording.
} catch (ExecutionException | InterruptedException e) {
} catch (UnsupportedOperationException unsupportedOperationException) {
}
```

When recording is started from the server, the event `handleCallOnIsRecordingChanged` will trigger and the value of `callRecordingFeature.isRecordingActive()` will be `true`.

Just like starting the call recording, if you want to stop the call recording you need to get the `ServerCallId` and send it to your recording server so that it can stop the call recording.

```java
try {
	String serverCallId = call.getInfo().getServerCallId().get();
	// Send serverCallId to your recording server to stop the call recording.
} catch (ExecutionException | InterruptedException e) {
} catch (UnsupportedOperationException unsupportedOperationException) {
}
```

When recording is stopped from the server, the event `handleCallOnIsRecordingChanged` will trigger and the value of `callRecordingFeature.isRecordingActive()` will be `false`.


## Call transcription
> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the ACS Calling Android SDK has the `isTranscriptionActive` and `addOnIsTranscriptionActiveChangedListener` are part of the `Call` object. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.
	
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Android SDK

Call transcription is an extended feature of the core `Call` API. You first need to obtain the transcription feature API object:

```java
TranscriptionFeature callTranscriptionFeature = call.api(TranscriptionFeature.class);
```

Then, to check if the call is being transcribed, inspect the `isTranscriptionActive` property of `callTranscriptionFeature`. It returns `boolean`.

```java
boolean isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive();
```

You can also subscribe to changes in transcription:

```java
private void handleCallOnIsTranscriptionChanged(PropertyChangedEvent args) {
	boolean isTranscriptionActive = callTranscriptionFeature.isTranscriptionActive();
}

callTranscriptionFeature.addOnIsTranscriptionActiveChangedListener(handleCallOnIsTranscriptionChanged);

```    

## Eventing model
You can subscribe to most of the properties and collections to be notified when values change.

### Properties
To subscribe to `property changed` events:

```java
// subscribe
PropertyChangedListener callStateChangeListener = new PropertyChangedListener()
{
    @Override
    public void onPropertyChanged(PropertyChangedEvent args)
    {
        Log.d("The call state has changed.");
    }
}
call.addOnStateChangedListener(callStateChangeListener);

//unsubscribe
call.removeOnStateChangedListener(callStateChangeListener);
```

### Collections
To subscribe to `collection updated` events:

```java
LocalVideoStreamsChangedListener localVideoStreamsChangedListener = new LocalVideoStreamsChangedListener()
{
    @Override
    public void onLocalVideoStreamsUpdated(LocalVideoStreamsEvent localVideoStreamsEventArgs) {
        Log.d(localVideoStreamsEventArgs.getAddedStreams().size());
        Log.d(localVideoStreamsEventArgs.getRemovedStreams().size());
    }
}
call.addOnLocalVideoStreamsChangedListener(localVideoStreamsChangedListener);
// To unsubscribe
call.removeOnLocalVideoStreamsChangedListener(localVideoStreamsChangedListener);
```
