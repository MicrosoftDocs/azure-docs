---
author: jsaurezlee-msft
ms.service: azure-communication-services
ms.topic: include
ms.date: 30/05/2023
ms.author: jsaurezlee
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

## Record calls

Call recording is an extended feature of the core `Call` object. You first need to obtain the recording feature object:

```csharp
RecordingCallFeature recordingFeature = call.Features.Recording;
```

Then, to check if the call is being recorded, inspect the `IsRecordingActive` property of `recordingFeature`. It returns `boolean`.

```csharp
boolean isRecordingActive = recordingFeature.IsRecordingActive;
```

You can also subscribe to recording changes:

```csharp
private async void Call__OnIsRecordingActiveChanged(object sender, PropertyChangedEventArgs args)
	boolean isRecordingActive = recordingFeature.IsRecordingActive;
}

recordingFeature.IsRecordingActiveChanged += Call__OnIsRecordingActiveChanged;
```
