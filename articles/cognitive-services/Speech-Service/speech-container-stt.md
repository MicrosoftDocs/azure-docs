---
title: Speech-to-text containers - Speech service
titleSuffix: Azure Cognitive Services
description: Install and run speech-to-text containers with Docker to perform speech recognition, transcription, generation, and more on-premises.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 04/06/2023
ms.author: eur
zone_pivot_groups: programming-languages-speech-services
keywords: on-premises, Docker, container
---

# Speech-to-text containers with Docker

By using containers, you can run _some_ of the Azure Cognitive Services Speech service APIs in your own environment. Containers are great for specific security and data governance requirements. In this article, you'll learn how to download, install, and run a Speech container.

With Speech containers, you can build a speech application architecture that's optimized for both robust cloud capabilities and edge locality. Several containers are available, which use the same [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) as the cloud-based Azure Speech services.

## Available Speech containers


Analyzes sentiment and transcribes continuous real-time speech or batch audio recordings with intermediate results.

Latest: 3.12.0. For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/speech-to-text/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/speech-to-text/tags/list).

You need the [prerequisites](speech-container-howto.md#prerequisites).

## Speech container images

The Speech-to-text container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `speech-to-text`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text`. You can find a full list of [tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/speech-to-text/tags).

| Container | Repository |
|-----------|------------|
| Speech-to-text | `mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text:latest` |


### Get the container image with docker pull

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text:latest
```

> [!IMPORTANT]
> The `latest` tag pulls the `en-US` locale. For additional locales, see [Speech-to-text locales](#speech-to-text-locales).

#### Speech-to-text locales

All tags, except for `latest`, are in the following format and are case sensitive:

```
<major>.<minor>.<patch>-<platform>-<locale>-<prerelease>
```

The following tag is an example of the format:

```
2.6.0-amd64-en-us
```

For all the supported locales of the speech-to-text container, see [Speech-to-text image tags](../containers/container-image-tags.md#speech-to-text).

## Use the container

After the container is on the [host computer](#host-computer-requirements-and-recommendations), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run) with the required billing settings. More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with docker run

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. For more information on how to get the `{Endpoint_URI}` and `{API_Key}` values, see [Gather required parameters](#gather-required-parameters). More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are also available.

> [!NOTE]
> For general container requirements, see [Container requirements and recommendations](#container-requirements-and-recommendations).


To run the standard speech-to-text container, execute the following `docker run` command:

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 4 \
mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a *speech-to-text* container from the container image.
* Allocates 4 CPU cores and 8 GB of memory.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Automatically removes the container after it exits. The container image is still available on the host computer.

> [!NOTE]
> Containers support compressed audio input to the Speech SDK by using GStreamer.
> To install GStreamer in a container, 
> follow Linux instructions for GStreamer in [Use codec compressed audio input with the Speech SDK](how-to-use-codec-compressed-audio-input-streams.md).

#### Diarization on the speech-to-text output

Diarization is enabled by default. To get diarization in your response, use `diarize_speech_config.set_service_property`.

1. Set the phrase output format to `Detailed`.
2. Set the mode of diarization. The supported modes are `Identity` and `Anonymous`.
    
    ```python
    diarize_speech_config.set_service_property(
        name='speechcontext-PhraseOutput.Format',
        value='Detailed',
        channel=speechsdk.ServicePropertyChannel.UriQueryParameter
    )
    
    diarize_speech_config.set_service_property(
        name='speechcontext-phraseDetection.speakerDiarization.mode',
        value='Identity',
        channel=speechsdk.ServicePropertyChannel.UriQueryParameter
    )
    ```

    > [!NOTE]
    > "Identity" mode returns `"SpeakerId": "Customer"` or `"SpeakerId": "Agent"`.
    > "Anonymous" mode returns `"SpeakerId": "Speaker 1"` or `"SpeakerId": "Speaker 2"`.
    
#### Analyze sentiment on the speech-to-text output

Starting in v2.6.0 of the speech-to-text container, you should use Language service 3.0 API endpoint instead of the preview one. For example:

* `https://eastus.api.cognitive.microsoft.com/text/analytics/v3.0/sentiment`
* `https://localhost:5000/text/analytics/v3.0/sentiment`

> [!NOTE]
> The Language service `v3.0` API isn't backward compatible with `v3.0-preview.1`. To get the latest sentiment feature support, use `v2.6.0` of the speech-to-text container image and Language service `v3.0`.

Starting in v2.2.0 of the speech-to-text container, you can call the [sentiment analysis v3 API](../text-analytics/how-tos/text-analytics-how-to-sentiment-analysis.md) on the output. To call sentiment analysis, you'll need a Language service API resource endpoint. For example:

* `https://eastus.api.cognitive.microsoft.com/text/analytics/v3.0-preview.1/sentiment`
* `https://localhost:5000/text/analytics/v3.0-preview.1/sentiment`

If you're accessing a Language service endpoint in the cloud, you'll need a key. If you're running Language service features locally, you might not need to provide this.

The key and endpoint are passed to the Speech container as arguments, as in the following example:

```bash
docker run -it --rm -p 5000:5000 \
mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text:latest \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY} \
CloudAI:SentimentAnalysisSettings:TextAnalyticsHost={TEXT_ANALYTICS_HOST} \
CloudAI:SentimentAnalysisSettings:SentimentAnalysisApiKey={SENTIMENT_APIKEY}
```

This command:

* Performs the same steps as the preceding command.
* Stores a Language service API endpoint and key, for sending sentiment analysis requests.

#### Phraselist v2 on the speech-to-text output

Starting in v2.6.0 of the speech-to-text container, you can get the output with your own phrases, either the whole sentence or phrases in the middle. For example, *the tall man* in the following sentence:

* "This is a sentence **the tall man** this is another sentence."

To configure a phrase list, you need to add your own phrases when you make the call. For example:

```python
    phrase="the tall man"
    recognizer = speechsdk.SpeechRecognizer(
        speech_config=dict_speech_config,
        audio_config=audio_config)
    phrase_list_grammer = speechsdk.PhraseListGrammar.from_recognizer(recognizer)
    phrase_list_grammer.addPhrase(phrase)
    
    dict_speech_config.set_service_property(
        name='setflight',
        value='xonlineinterp',
        channel=speechsdk.ServicePropertyChannel.UriQueryParameter
    )
```

If you have multiple phrases to add, call `.addPhrase()` for each phrase to add it to the phrase list.

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container. Otherwise, the container won't start. For more information, see [Billing](#billing).


## Use the container


### Host authentication

[!INCLUDE [Speech container authentication](includes/container-speech-config.md)]



### Speech-to-text (standard and custom)

#### Analyze sentiment

If you provided your Language service API credentials [to the container](#analyze-sentiment-on-the-speech-to-text-output), you can use the Speech SDK to send speech recognition requests with sentiment analysis. You can configure the API responses to use either a *simple* or *detailed* format.


# [Simple format](#tab/simple-format)

To configure the Speech client to use a simple format, add `"Sentiment"` as a value for `Simple.Extensions`. If you want to choose a specific Language service model version, replace `'latest'` in the `speechcontext-phraseDetection.sentimentAnalysis.modelversion` property configuration.

```python
speech_config.set_service_property(
    name='speechcontext-PhraseOutput.Simple.Extensions',
    value='["Sentiment"]',
    channel=speechsdk.ServicePropertyChannel.UriQueryParameter
)
speech_config.set_service_property(
    name='speechcontext-phraseDetection.sentimentAnalysis.modelversion',
    value='latest',
    channel=speechsdk.ServicePropertyChannel.UriQueryParameter
)
```

`Simple.Extensions` returns the sentiment result in the root layer of the response.

```json
{
   "DisplayText":"What's the weather like?",
   "Duration":13000000,
   "Id":"6098574b79434bd4849fee7e0a50f22e",
   "Offset":4700000,
   "RecognitionStatus":"Success",
   "Sentiment":{
      "Negative":0.03,
      "Neutral":0.79,
      "Positive":0.18
   }
}
```

# [Detailed format](#tab/detailed-format)

To configure the Speech client to use a detailed format, add `"Sentiment"` as a value for `Detailed.Extensions`, `Detailed.Options`, or both. If you want to choose a specific sentiment analysis model version, replace `'latest'` in the `speechcontext-phraseDetection.sentimentAnalysis.modelversion` property configuration.

```python
speech_config.set_service_property(
    name='speechcontext-PhraseOutput.Detailed.Options',
    value='["Sentiment"]',
    channel=speechsdk.ServicePropertyChannel.UriQueryParameter
)
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

`Detailed.Extensions` provides the sentiment result in the root layer of the response. `Detailed.Options` provides the result in the `NBest` layer of the response. They can be used separately or together.

```json
{
   "DisplayText":"What's the weather like?",
   "Duration":13000000,
   "Id":"6a2aac009b9743d8a47794f3e81f7963",
   "NBest":[
      {
         "Confidence":0.973695,
         "Display":"What's the weather like?",
         "ITN":"what's the weather like",
         "Lexical":"what's the weather like",
         "MaskedITN":"What's the weather like",
         "Sentiment":{
            "Negative":0.03,
            "Neutral":0.79,
            "Positive":0.18
         }
      },
      {
         "Confidence":0.9164971,
         "Display":"What is the weather like?",
         "ITN":"what is the weather like",
         "Lexical":"what is the weather like",
         "MaskedITN":"What is the weather like",
         "Sentiment":{
            "Negative":0.02,
            "Neutral":0.88,
            "Positive":0.1
         }
      }
   ],
   "Offset":4700000,
   "RecognitionStatus":"Success",
   "Sentiment":{
      "Negative":0.03,
      "Neutral":0.79,
      "Positive":0.18
   }
}
```

---
If you want to completely disable sentiment analysis, add a `false` value to `sentimentanalysis.enabled`.

```python
speech_config.set_service_property(
    name='speechcontext-phraseDetection.sentimentanalysis.enabled',
    value='false',
    channel=speechsdk.ServicePropertyChannel.UriQueryParameter
)
```



## Next steps

* Use more [Cognitive Services containers](../cognitive-services-container-support.md).


