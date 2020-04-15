---
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

### Speech-to-text or Custom Speech-to-text

The container provides websocket-based query endpoint APIs, that are accessed through the [Speech SDK](../index.yml). By default, the Speech SDK uses online speech services. To use the container, you need to change the initialization method.

> [!TIP]
> When using the Speech SDK with containers, you do not need to provide the Azure Speech resource [subscription key or an authentication bearer token](../rest-speech-to-text.md#authentication).

See the examples below.

# [C#](#tab/csharp)

Change from using this Azure-cloud initialization call:

```csharp
var config = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
```

to this call using the container [host](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.fromhost?view=azure-dotnet):

```csharp
var config = SpeechConfig.FromHost(
    new Uri("ws://localhost:5000"));
```

# [Python](#tab/python)

Change from using this Azure-cloud initialization call:

```python
speech_config = speechsdk.SpeechConfig(
    subscription=speech_key, region=service_region)
```

---

#### Analyze sentiment on the speech-to-text output 

Starting in v2.2.0 of the speech-to-text container, you can analyze sentiment on the output using the Text Analytics API. To call sentiment analysis, you will need a Text Analytics resource endpoint. For example: 
* `https://westus2.api.cognitive.microsoft.com/text/analytics/v3.0-preview.1/sentiment`
* `https://localhost:5000/text/analytics/v3.0-preview.1/sentiment`

If you're accessing a Text analytics endpoint in the cloud, you will need a key. If you're running Text Analytics locally, you may not need to provide this.

The key and endpoint are passed to the Speech container as arguments, as in the following example.

```bash
docker run -it --rm -p 5000:5000 \
containerpreview.azurecr.io/microsoft/cognitive-services-speech-to-text:latest \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} \
CloudAI:SentimentAnalysisSettings:TextAnalyticsHost={TEXT_ANALYTICS_HOST} \
CloudAI:SentimentAnalysisSettings:SentimentAnalysisApiKey={SENTIMENT_APIKEY}
```

to this call using the container [host](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python):

```python
speech_config = speechsdk.SpeechConfig(
    host="ws://localhost:5000")
```

To call sentiment analysis:

> [!NOTE]
> You can send requests for either "detailed" or "simple" responses. 

```python
speech_config.set_service_property(
    name='speechcontext-PhraseOutput.Detailed.Extensions',
    value='["Sentiment"]',
    channel=speechsdk.ServicePropertyChannel.UriQueryParameter
)
speech_config.set_service_property(
    name='speechcontext-phraseDetection.sentimentAnalysis.modelversion',
    value='latest',
    channel=speechsdk.ServicePropertyChannel.UriQueryParameter
)
```

To disable sentiment analysis from appearing in the API response, regardless of other properties specified:

```python
speech_config.set_service_property(
    name='speechcontext-phraseDetection.sentimentanalysis.enabled',
    value='false',
    channel=speechsdk.ServicePropertyChannel.UriQueryParameter
)
```

***
