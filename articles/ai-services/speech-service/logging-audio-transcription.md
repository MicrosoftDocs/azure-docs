---
title: How to log audio and transcriptions for speech recognition
titleSuffix: Azure AI services
description: Learn how to use audio and transcription logging for speech to text and speech translation.
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: azure-ai-speech
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 03/28/2023
ms.author: alexeyo 
zone_pivot_groups: programming-languages-speech-services-nomore-variant
---

# How to log audio and transcriptions for speech recognition

You can enable logging for both audio input and recognized speech when using [speech to text](get-started-speech-to-text.md) or [speech translation](get-started-speech-to-text.md). For speech translation, only the audio and transcription of the original audio are logged. The translations aren't logged. This article describes how to enable, access and delete the audio and transcription logs.

Audio and transcription logs can be used as input for [Custom Speech](custom-speech-overview.md) model training. You might have other use cases.

> [!WARNING]
> Don't depend on audio and transcription logs when the exact record of input audio is required. In the periods of peak load, the service prioritizes hardware resources for transcription tasks. This may result in minor parts of the audio not being logged. Such occasions are rare, but nevertheless possible. 

Logging is done asynchronously for both base and custom model endpoints. Audio and transcription logs are stored by the Speech service in its internal storage and not written locally. The logs are retained for 30 days. After this period, the logs are automatically deleted. However you can [delete](#delete-audio-and-transcription-logs) specific logs or a range of available logs at any time.

You can also store audio and transcription logs within an Azure Storage account you own and control instead of Speech service premises using [Bring-your-own-storage (BYOS)](bring-your-own-storage-speech-resource.md) technology. See details on how to use BYOS-enabled Speech resource in [this article](bring-your-own-storage-speech-resource-speech-to-text.md).

## Enable audio and transcription logging

Logging is disabled by default. Logging can be enabled [per recognition session](#enable-logging-for-a-single-recognition-session) or [per custom model endpoint](#enable-audio-and-transcription-logging-for-a-custom-model-endpoint). 

### Enable logging for a single recognition session

You can enable logging for a single recognition session, whether using the default base model or [custom model](how-to-custom-speech-deploy-model.md) endpoint.

> [!WARNING]
> For custom model endpoints, the logging setting of your deployed endpoint is prioritized over your session-level setting (SDK or REST API). If logging is enabled for the custom model endpoint, the session-level setting (whether it's set to true or false) is ignored. If logging isn't enabled for the custom model endpoint, the session-level setting determines whether logging is active.

#### Enable logging for speech to text with the Speech SDK

::: zone pivot="programming-language-csharp"

To enable audio and transcription logging with the Speech SDK, you execute the method `EnableAudioLogging()` of the [SpeechConfig](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig) class instance. 

```csharp
speechConfig.EnableAudioLogging();
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` [property](/dotnet/api/microsoft.cognitiveservices.speech.propertyid):

```csharp
string isAudioLoggingEnabled = speechConfig.GetProperty(PropertyId.SpeechServiceConnection_EnableAudioLogging);
```  

Each [SpeechRecognizer](/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer) that uses this `speechConfig` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-cpp"

To enable audio and transcription logging with the Speech SDK, you execute the method `EnableAudioLogging` of the [SpeechConfig](/cpp/cognitive-services/speech/speechconfig) class instance. 

```cpp
speechConfig->EnableAudioLogging();
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` property:

```cpp
string isAudioLoggingEnabled = speechConfig->GetProperty(PropertyId::SpeechServiceConnection_EnableAudioLogging);
```

Each [SpeechRecognizer](/cpp/cognitive-services/speech/speechrecognizer) that uses this `speechConfig` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-java"

To enable audio and transcription logging with the Speech SDK, you execute the method `enableAudioLogging()` of the [SpeechConfig](/java/api/com.microsoft.cognitiveservices.speech.speechconfig) class instance. 

```java
speechConfig.enableAudioLogging();
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` [property](/java/api/com.microsoft.cognitiveservices.speech.propertyid):

```java
String isAudioLoggingEnabled = speechConfig.getProperty(PropertyId.SpeechServiceConnection_EnableAudioLogging);
```

Each [SpeechRecognizer](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer) that uses this `speechConfig` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-javascript"

To enable audio and transcription logging with the Speech SDK, you execute the method `enableAudioLogging()` of the [SpeechConfig](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig) class instance. 

```javascript
speechConfig.enableAudioLogging();
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` [property](/javascript/api/microsoft-cognitiveservices-speech-sdk/propertyid):

```javascript
var SpeechSDK;
SpeechSDK = speechSdk;
// <...>
string isAudioLoggingEnabled = speechConfig.getProperty(SpeechSDK.PropertyId.SpeechServiceConnection_EnableAudioLogging);
```

Each [SpeechRecognizer](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer) that uses this `speechConfig` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-python"

To enable audio and transcription logging with the Speech SDK, you execute the method `enable_audio_logging` of the [SpeechConfig](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig) class instance. 

```python
speech_config.enable_audio_logging()
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` [property](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.propertyid):

```python
import azure.cognitiveservices.speech as speechsdk
# <...>
is_audio_logging_enabled = speech_config.get_property(property_id=speechsdk.PropertyId.SpeechServiceConnection_EnableAudioLogging)
```

Each [SpeechRecognizer](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer) that uses this `speech_config` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-objectivec"

To enable audio and transcription logging with the Speech SDK, you execute the method `enableAudioLogging` of the [SPXSpeechConfiguration](/objectivec/cognitive-services/speech/spxspeechconfiguration) class instance. 

```objectivec
[speechConfig enableAudioLogging];
```

To check whether logging is enabled, get the value of the `SPXSpeechServiceConnectionEnableAudioLogging` [property](/objectivec/cognitive-services/speech/spxpropertyid):

```objectivec
NSString *isAudioLoggingEnabled = [speechConfig getPropertyById:SPXSpeechServiceConnectionEnableAudioLogging];
```

Each [SpeechRecognizer](/objectivec/cognitive-services/speech/spxspeechrecognizer) that uses this `speechConfig` has audio and transcription logging enabled. 

::: zone-end

#### Enable logging for speech translation with the Speech SDK

For speech translation, only the audio and transcription of the original audio are logged. The translations aren't logged.

::: zone pivot="programming-language-csharp"

To enable audio and transcription logging with the Speech SDK, you execute the method `EnableAudioLogging()` of the [SpeechTranslationConfig](/dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig) class instance. 

```csharp
speechTranslationConfig.EnableAudioLogging();
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` [property](/dotnet/api/microsoft.cognitiveservices.speech.propertyid):

```csharp
string isAudioLoggingEnabled = speechTranslationConfig.GetProperty(PropertyId.SpeechServiceConnection_EnableAudioLogging);
```  

Each [TranslationRecognizer](/dotnet/api/microsoft.cognitiveservices.speech.translation.translationrecognizer) that uses this `speechTranslationConfig` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-cpp"

To enable audio and transcription logging with the Speech SDK, you execute the method `EnableAudioLogging` of the [SpeechTranslationConfig](/cpp/cognitive-services/speech/translation-speechtranslationconfig) class instance. 

```cpp
speechTranslationConfig->EnableAudioLogging();
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` property:

```cpp
string isAudioLoggingEnabled = speechTranslationConfig->GetProperty(PropertyId::SpeechServiceConnection_EnableAudioLogging);
```

Each [TranslationRecognizer](/cpp/cognitive-services/speech/translation-translationrecognizer) that uses this `speechTranslationConfig` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-java"

To enable audio and transcription logging with the Speech SDK, you execute the method `enableAudioLogging()` of the [SpeechTranslationConfig](/java/api/com.microsoft.cognitiveservices.speech.translation.speechtranslationconfig) class instance. 

```java
speechTranslationConfig.enableAudioLogging();
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` [property](/java/api/com.microsoft.cognitiveservices.speech.propertyid):

```java
String isAudioLoggingEnabled = speechTranslationConfig.getProperty(PropertyId.SpeechServiceConnection_EnableAudioLogging);
```

Each [TranslationRecognizer](/java/api/com.microsoft.cognitiveservices.speech.translation.translationrecognizer) that uses this `speechTranslationConfig` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-javascript"

To enable audio and transcription logging with the Speech SDK, you execute the method `enableAudioLogging()` of the [SpeechTranslationConfig](/javascript/api/microsoft-cognitiveservices-speech-sdk/speechtranslationconfig) class instance. 

```javascript
speechTranslationConfig.enableAudioLogging();
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` [property](/javascript/api/microsoft-cognitiveservices-speech-sdk/propertyid):

```javascript
var SpeechSDK;
SpeechSDK = speechSdk;
// <...>
string isAudioLoggingEnabled = speechTranslationConfig.getProperty(SpeechSDK.PropertyId.SpeechServiceConnection_EnableAudioLogging);
```

Each [TranslationRecognizer](/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer) that uses this `speechTranslationConfig` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-python"

To enable audio and transcription logging with the Speech SDK, you execute the method `enable_audio_logging` of the [SpeechTranslationConfig](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.translation.speechtranslationconfig) class instance. 

```python
speech_translation_config.enable_audio_logging()
```

To check whether logging is enabled, get the value of the `SpeechServiceConnection_EnableAudioLogging` [property](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.propertyid):

```python
import azure.cognitiveservices.speech as speechsdk
# <...>
is_audio_logging_enabled = speech_translation_config.get_property(property_id=speechsdk.PropertyId.SpeechServiceConnection_EnableAudioLogging)
```

Each [TranslationRecognizer](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.translation.translationrecognizer) that uses this `speech_translation_config` has audio and transcription logging enabled. 

::: zone-end
::: zone pivot="programming-language-objectivec"

To enable audio and transcription logging with the Speech SDK, you execute the method `enableAudioLogging` of the [SPXSpeechTranslationConfiguration](/objectivec/cognitive-services/speech/spxspeechtranslationconfiguration) class instance. 

```objectivec
[speechTranslationConfig enableAudioLogging];
```

To check whether logging is enabled, get the value of the `SPXSpeechServiceConnectionEnableAudioLogging` [property](/objectivec/cognitive-services/speech/spxpropertyid):

```objectivec
NSString *isAudioLoggingEnabled = [speechTranslationConfig getPropertyById:SPXSpeechServiceConnectionEnableAudioLogging];
```

Each [TranslationRecognizer](/objectivec/cognitive-services/speech/spxtranslationrecognizer) that uses this `speechTranslationConfig` has audio and transcription logging enabled. 

::: zone-end

#### Enable logging for Speech to text REST API for short audio

If you use [Speech to text REST API for short audio](rest-speech-to-text-short.md) and want to enable audio and transcription logging, you need to use the query parameter and value `storeAudio=true` as a part of your REST request. A sample request looks like this:

```http
https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&storeAudio=true
```

### Enable audio and transcription logging for a custom model endpoint

This method is applicable for [Custom Speech](custom-speech-overview.md) endpoints only.

Logging can be enabled or disabled in the persistent custom model endpoint settings. When logging is enabled (turned on) for a custom model endpoint, then you don't need to enable logging at the [recognition session level with the SDK or REST API](#enable-logging-for-a-single-recognition-session). Even when logging isn't enabled for a custom model endpoint, you can enable logging temporarily at the recognition session level with the SDK or REST API. 

> [!WARNING]
> For custom model endpoints, the logging setting of your deployed endpoint is prioritized over your session-level setting (SDK or REST API). If logging is enabled for the custom model endpoint, the session-level setting (whether it's set to true or false) is ignored. If logging isn't enabled for the custom model endpoint, the session-level setting determines whether logging is active.

You can enable audio and transcription logging for a custom model endpoint:
- When you create the endpoint using the Speech Studio, REST API, or Speech CLI. For details about how to enable logging for a Custom Speech endpoint, see [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md#add-a-deployment-endpoint).
- When you update the endpoint ([Endpoints_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Update)) using the [Speech to text REST API](rest-speech-to-text.md). For an example of how to update the logging setting for an endpoint, see [Turn off logging for a custom model endpoint](#turn-off-logging-for-a-custom-model-endpoint). But instead of setting the `contentLoggingEnabled` property to `false`, set it to `true` to enable logging for the endpoint.

## Turn off logging for a custom model endpoint

To disable audio and transcription logging for a custom model endpoint, you must update the persistent endpoint logging setting using the [Speech to text REST API](rest-speech-to-text.md). There isn't a way to disable logging for an existing custom model endpoint using the Speech Studio.

To turn off logging for a custom endpoint, use the [Endpoints_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Update) operation of the [Speech to text REST API](rest-speech-to-text.md). Construct the request body according to the following instructions:

- Set the `contentLoggingEnabled` property within `properties`. Set this property to `true` to enable logging of the endpoint's traffic. Set this property to `false` to disable logging of the endpoint's traffic. 

Make an HTTP PATCH request using the URI as shown in the following example. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, replace `YourEndpointId` with your endpoint ID, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X PATCH -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "properties": {
    "contentLoggingEnabled": false
  },
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/YourEndpointId"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/4ef91f9b-7ac9-4c3b-a238-581ef0f8b7e2",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/71b46720-995d-4038-a331-0317e9e7a02f"
  },
  "links": {
    "logs": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/4ef91f9b-7ac9-4c3b-a238-581ef0f8b7e2/files/logs",
    "restInteractive": "https://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=4ef91f9b-7ac9-4c3b-a238-581ef0f8b7e2",
    "restConversation": "https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=4ef91f9b-7ac9-4c3b-a238-581ef0f8b7e2",
    "restDictation": "https://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=4ef91f9b-7ac9-4c3b-a238-581ef0f8b7e2",
    "webSocketInteractive": "wss://eastus.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?cid=4ef91f9b-7ac9-4c3b-a238-581ef0f8b7e2",
    "webSocketConversation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?cid=4ef91f9b-7ac9-4c3b-a238-581ef0f8b7e2",
    "webSocketDictation": "wss://eastus.stt.speech.microsoft.com/speech/recognition/dictation/cognitiveservices/v1?cid=4ef91f9b-7ac9-4c3b-a238-581ef0f8b7e2"
  },
  "project": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/projects/122fd2f7-1d3a-4404-885d-2b24a2a187e8"
  },
  "properties": {
    "loggingEnabled": false
  },
  "lastActionDateTime": "2023-03-28T23:03:15Z",
  "status": "Succeeded",
  "createdDateTime": "2023-03-28T23:02:40Z",
  "locale": "en-US",
  "displayName": "My Endpoint",
  "description": "My Endpoint Description"
}
```

The response body should reflect the new setting. The name of the logging property in the response (`loggingEnabled`) is different from the name of the logging property that you set in the request (`contentLoggingEnabled`).

## Get audio and transcription logs 

You can access audio and transcription logs using [Speech to text REST API](#get-audio-and-transcription-logs-with-speech-to-text-rest-api). For [custom model](how-to-custom-speech-deploy-model.md) endpoints, you can also use [Speech Studio](#get-audio-and-transcription-logs-with-speech-studio). See details in the following sections.

> [!NOTE]
> Logging data is kept for 30 days. After this period the logs are automatically deleted. However you can [delete](#delete-audio-and-transcription-logs) specific logs or a range of available logs at any time.

### Get audio and transcription logs with Speech Studio

This method is applicable for [custom model](how-to-custom-speech-deploy-model.md) endpoints only.

To download the endpoint logs:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select **Custom Speech** > Your project name > **Deploy models**.
1. Select the link by endpoint name.
1. Under **Content logging**, select **Download log**.

With this approach, you can download all available log sets at once. There's no way to download selected log sets in Speech Studio.

### Get audio and transcription logs with Speech to text REST API

You can download all or a subset of available log sets.

This method is applicable for base and [custom model](how-to-custom-speech-deploy-model.md) endpoints. To list and download audio and transcription logs:
- Base models: Use the [Endpoints_ListBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListBaseModelLogs) operation of the [Speech to text REST API](rest-speech-to-text.md). This operation gets the list of audio and transcription logs that have been stored when using the default base model of a given language.
- Custom model endpoints: Use the [Endpoints_ListLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListLogs) operation of the [Speech to text REST API](rest-speech-to-text.md). This operation gets the list of audio and transcription logs that have been stored for a given endpoint.

### Get log IDs with Speech to text REST API

In some scenarios, you may need to get IDs of the available logs. For example, you may want to delete a specific log as described [later in this article](#delete-specific-log).

To get IDs of the available logs:
- Base models: Use the [Endpoints_ListBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListBaseModelLogs) operation of the [Speech to text REST API](rest-speech-to-text.md). This operation gets the list of audio and transcription logs that have been stored when using the default base model of a given language.
- Custom model endpoints: Use the [Endpoints_ListLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListLogs) operation of the [Speech to text REST API](rest-speech-to-text.md). This operation gets the list of audio and transcription logs that have been stored for a given endpoint.

Here's a sample output of [Endpoints_ListLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListLogs). For simplicity, only one log set is shown:

```json
{
  "values": [
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/files/logs/2023-03-13_163715__0420c53d-e6ac-4857-bce0-f39c3f9f5ff9_v2_json",
      "name": "163715__0420c53d-e6ac-4857-bce0-f39c3f9f5ff9.v2.json",
      "kind": "Transcription",
      "properties": {
        "size": 79920
      },
      "createdDateTime": "2023-03-13T16:37:15Z",
      "links": {
        "contentUrl": "<Link to download log file>"
      }
    },
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/files/logs/2023-03-13_163715__0420c53d-e6ac-4857-bce0-f39c3f9f5ff9_wav",
      "name": "163715__0420c53d-e6ac-4857-bce0-f39c3f9f5ff9.wav",
      "kind": "Audio",
      "properties": {
        "size": 932966
      },
      "createdDateTime": "2023-03-13T16:37:15Z",
      "links": {
        "contentUrl": "<Link to download log file>"
      }
    }
  ]
}
```

The locations of each audio and transcription log file are returned in the response body. See the corresponding `kind` property to determine whether the file includes the audio (`"kind": "Audio"`) or the transcription (`"kind": "Transcription"`).

The log ID for each log file is the last part of the URL in the `"self"` element value. The log ID in the following example is `2023-03-13_163715__0420c53d-e6ac-4857-bce0-f39c3f9f5ff9_v2_json`. 

```json
"self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/endpoints/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/files/logs/2023-03-13_163715__0420c53d-e6ac-4857-bce0-f39c3f9f5ff9_v2_json"
```

## Delete audio and transcription logs

Logging data is kept for 30 days. After this period, the logs are automatically deleted. However you can delete specific logs or a range of available logs at any time. 

For any base or [custom model](how-to-custom-speech-deploy-model.md) endpoint you can delete all available logs, logs for a given time frame, or a particular log based on its Log ID. The deletion process is done asynchronously and can take minutes, hours, one day, or longer depending on the number of log files.

To delete audio and transcription logs you must use the [Speech to text REST API](rest-speech-to-text.md). There isn't a way to delete logs using the Speech Studio.

### Delete all logs or logs for a given time frame

To delete all logs or logs for a given time frame:

- Base models: Use the [Endpoints_DeleteBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteBaseModelLogs) operation of the [Speech to text REST API](rest-speech-to-text.md). 
- Custom model endpoints: Use the [Endpoints_DeleteLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteLogs) operation of the [Speech to text REST API](rest-speech-to-text.md).

Optionally, set the `endDate` of the audio logs deletion (specific day, UTC). Expected format: "yyyy-mm-dd". For instance, "2023-03-15" results in deleting all logs on March 15, 2023 and before. 

### Delete specific log

To delete a specific log by ID:

- Base models: Use the [Endpoints_DeleteBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteBaseModelLog) operation of the [Speech to text REST API](rest-speech-to-text.md).
- Custom model endpoints: Use the [Endpoints_DeleteLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteLog) operation of the [Speech to text REST API](rest-speech-to-text.md).

For details about how to get Log IDs, see a previous section [Get log IDs with Speech to text REST API](#get-log-ids-with-speech-to-text-rest-api).

Since audio and transcription logs have separate IDs (such as IDs `2023-03-13_163715__0420c53d-e6ac-4857-bce0-f39c3f9f5ff9_v2_json` and `2023-03-13_163715__0420c53d-e6ac-4857-bce0-f39c3f9f5ff9_wav` from a [previous example in this article](#get-log-ids-with-speech-to-text-rest-api)), when you want to delete both audio and transcription logs you execute separate [delete by ID](#delete-specific-log) requests. 

## Next steps

* [Speech to text quickstart](get-started-speech-to-text.md)
* [Speech translation quickstart](./get-started-speech-translation.md)
* [Create and train custom speech models](custom-speech-overview.md)
