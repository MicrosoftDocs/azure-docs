---
author: jsaurezlee-msft
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/30/2023
ms.author: jsaurezlee
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

Call transcription is an extended feature of the core `Call` object. You first need to obtain the transcription feature object:

```csharp
TranscriptionCallFeature transcriptionFeature = call.Features.Transcription;
```

Then, to check if the call is being transcribed, inspect the `IsTranscriptionActive` property of `transcriptionFeature`. It returns `boolean`.

```csharp
boolean isTranscriptionActive = transcriptionFeature.isTranscriptionActive;
```

You can also subscribe to changes in transcription:

```csharp
private async void Call__OnIsTranscriptionActiveChanged(object sender, PropertyChangedEventArgs args)
    boolean isTranscriptionActive = transcriptionFeature.IsTranscriptionActive();
}

transcriptionFeature.IsTranscriptionActiveChanged += Call__OnIsTranscriptionActiveChanged;
```
