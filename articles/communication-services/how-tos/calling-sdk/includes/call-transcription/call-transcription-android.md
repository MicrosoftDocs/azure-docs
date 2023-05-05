---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

> [!WARNING]
> Up until version 1.1.0 and beta release version 1.1.0-beta.1 of the Azure Communication Services Calling Android SDK has the `isTranscriptionActive` and `addOnIsTranscriptionActiveChangedListener` are part of the `Call` object. For new beta releases, those APIs have been moved as an extended feature of `Call` just like described below.

Call transcription is an extended feature of the core `Call` object. You first need to obtain the transcription feature object:

```java
TranscriptionCallFeature callTranscriptionFeature = call.feature(Features.TRANSCRIPTION);
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
