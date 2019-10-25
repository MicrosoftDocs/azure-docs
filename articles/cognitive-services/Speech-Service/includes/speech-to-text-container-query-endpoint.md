---
title: Query Speech-to-text container endpoint
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 11/04/2019
ms.author: dapine
---

### Speech-to-text or Custom Speech-to-text

The container provides websocket-based query endpoint APIs, that are accessed through the [Speech SDK](../index.md). By default, the Speech SDK uses online speech services. To use the container, you need to change the initialization method.

> [!TIP]
> When using the Speech SDK with containers, you do not need to provide the Azure Speech resource [subscription key or an authentication bearer token](../rest-speech-to-text.md#authentication).

See the examples below.

# [C#](#tab/csharp)

Change from using this Azure-cloud initialization call:

```csharp
var config = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
```

to this call using the container [endpoint](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.fromendpoint?view=azure-dotnet):

```csharp
var config = SpeechConfig.FromEndpoint(
    new Uri("ws://localhost:5000/speech/recognition/dictation/cognitiveservices/v1"));
```
# [Python](#tab/python)

Change from using this Azure-cloud initialization call:

```python
speech_config = speechsdk.SpeechConfig(
    subscription=speech_key, region=service_region)
```

to this call using the container [endpoint](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python):

```python
speech_config = speechsdk.SpeechConfig(
    endpoint="ws://localhost:5000/speech/recognition/dictation/cognitiveservices/v1")
```

***
