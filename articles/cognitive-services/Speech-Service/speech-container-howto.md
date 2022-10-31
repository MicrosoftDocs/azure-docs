---
title: Install and run Docker containers for the Speech service APIs
titleSuffix: Azure Cognitive Services
description: Use the Docker containers for the Speech service to perform speech recognition, transcription, generation, and more on-premises.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 01/24/2022
ms.author: eur
ms.custom: cog-serv-seo-aug-2020
keywords: on-premises, Docker, container
---

# Install and run Docker containers for the Speech service APIs

By using containers, you can run _some_ of the Azure Cognitive Services Speech service APIs in your own environment. Containers are great for specific security and data governance requirements. In this article, you'll learn how to download, install, and run a Speech container.

With Speech containers, you can build a speech application architecture that's optimized for both robust cloud capabilities and edge locality. Several containers are available, which use the same [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) as the cloud-based Azure Speech services.

> [!IMPORTANT]
> We retired the standard speech synthesis voices and text-to-speech container on August 31, 2021. Consider migrating your applications to use the neural text-to-speech container instead. For more information on updating your application, see [Migrate from standard voice to prebuilt neural voice](./how-to-migrate-to-prebuilt-neural-voice.md).

| Container | Features | Latest | Release status |
|--|--|--|--|
| Speech-to-text | Analyzes sentiment and transcribes continuous real-time speech or batch audio recordings with intermediate results.  | 3.6.0 | Generally available |
| Custom speech-to-text | Using a custom model from the [Custom Speech portal](https://speech.microsoft.com/customspeech), transcribes continuous real-time speech or batch audio recordings into text with intermediate results. | 3.6.0 | Generally available |
| Speech language identification | Detects the language spoken in audio files. | 1.5.0 | Preview |
| Neural text-to-speech | Converts text to natural-sounding speech by using deep neural network technology, which allows for more natural synthesized speech. | 2.5.0 | Generally available |

## Prerequisites

> [!IMPORTANT]
> * To use the Speech containers, you must submit an online request and have it approved. For more information, see the "Request approval to run the container" section.
> * *Generally available* containers meet Microsoft's stability and support requirements. Containers in *preview* are still under development.

You must meet the following prerequisites before you use Speech service containers. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin. You need:

* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure.
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of [Docker concepts](https://docs.docker.com/get-started/overview/). 
* A <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech service resource"  target="_blank">Speech service resource </a> with the free (F0) or standard (S) [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

[!INCLUDE [Gathering required parameters](../containers/includes/container-gathering-required-parameters.md)]

## Host computer requirements and recommendations

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

### Container requirements and recommendations

The following table describes the minimum and recommended allocation of resources for each Speech container:

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| Speech-to-text | 4 core, 4-GB memory | 8 core, 6-GB memory |
| Custom speech-to-text | 4 core, 4-GB memory | 8 core, 6-GB memory |
| Speech language identification | 1 core, 1-GB memory | 1 core, 1-GB memory |
| Neural text-to-speech | 6 core, 12-GB memory | 8 core, 16-GB memory |

Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

> [!NOTE]
> The minimum and recommended allocations are based on Docker limits, *not* the host machine resources. For example, speech-to-text containers memory map portions of a large language model. We recommend that the entire file should fit in memory, which is an additional 4 to 6 GB. Also, the first run of either container might take longer because models are being paged into memory.

### Advanced Vector Extension support

The *host* is the computer that runs the Docker container. The host *must support* [Advanced Vector Extensions](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX2) (AVX2). You can check for AVX2 support on Linux hosts with the following command:

```console
grep -q avx2 /proc/cpuinfo && echo AVX2 supported || echo No AVX2 support detected
```
> [!WARNING]
> The host computer is *required* to support AVX2. The container *will not* function correctly without AVX2 support.

## Request approval to run the container

Fill out and submit the [request form](https://aka.ms/csgate) to request access to the container.

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]

## Get the container image with docker pull

Container images for Speech are available in the following container registry.

# [Speech-to-text](#tab/stt)

| Container | Repository |
|-----------|------------|
| Speech-to-text | `mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text:latest` |

# [Custom speech-to-text](#tab/cstt)

| Container | Repository |
|-----------|------------|
| Custom speech-to-text | `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text:latest` |

# [Neural text-to-speech](#tab/ntts)

| Container | Repository |
|-----------|------------|
| Neural text-to-speech | `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech:latest` |

# [Speech language identification](#tab/lid)

> [!TIP]
> To get the most useful results, use the Speech language identification container with the speech-to-text or custom speech-to-text containers.

| Container | Repository |
|-----------|------------|
| Speech language identification | `mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection:latest` |

***

[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]

### Docker pull for the Speech containers

# [Speech-to-text](#tab/stt)

#### Docker pull for the speech-to-text container

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

# [Custom speech-to-text](#tab/cstt)

#### Docker pull for the custom speech-to-text container

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text:latest
```

> [!NOTE]
> The `locale` and `voice` for custom Speech containers is determined by the custom model ingested by the container.

# [Neural text-to-speech](#tab/ntts)

#### Docker pull for the neural text-to-speech container

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech:latest
```

> [!IMPORTANT]
> The `latest` tag pulls the `en-US` locale and `arianeural` voice. For more locales, see [Neural text-to-speech locales](#neural-text-to-speech-locales).

#### Neural text-to-speech locales

All tags, except for `latest`, are in the following format and are case sensitive:

```
<major>.<minor>.<patch>-<platform>-<locale>-<voice>
```

The following tag is an example of the format:

```
1.3.0-amd64-en-us-arianeural
```

For all the supported locales and corresponding voices of the neural text-to-speech container, see [Neural text-to-speech image tags](../containers/container-image-tags.md#neural-text-to-speech).

> [!IMPORTANT]
> When you construct a neural text-to-speech HTTP POST, the [SSML](speech-synthesis-markup.md) message requires a `voice` element with a `name` attribute. The value is the corresponding container [locale and voice](language-support.md?tabs=stt-tts). For example, the `latest` tag would have a voice name of `en-US-AriaNeural`.

# [Speech language identification](#tab/lid)

#### Docker pull for the Speech language identification container

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection:latest
```

***

## Use the container

After the container is on the [host computer](#host-computer-requirements-and-recommendations), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run) with the required billing settings. More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with docker run

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. For more information on how to get the `{Endpoint_URI}` and `{API_Key}` values, see [Gather required parameters](#gather-required-parameters). More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are also available.

## Run the container in disconnected environments

You must request access to use containers disconnected from the internet. For more information, see [Request access to use containers in disconnected environments](../containers/disconnected-containers.md#request-access-to-use-containers-in-disconnected-environments).

> [!NOTE]
> For general container requirements, see [Container requirements and recommendations](#container-requirements-and-recommendations).

# [Speech-to-text](#tab/stt)

To run the standard speech-to-text container, execute the following `docker run` command:

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 4 \
mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a *speech-to-text* container from the container image.
* Allocates 4 CPU cores and 4 GB of memory.
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

# [Custom speech-to-text](#tab/cstt)

The custom speech-to-text container relies on a Custom Speech model. The custom model has to have been [trained](how-to-custom-speech-train-model.md) by using the [Speech Studio](https://aka.ms/speechstudio/customspeech).

The custom speech **Model ID** is required to run the container. For more information about how to get the model ID, see [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md).

![Screenshot that shows the Custom Speech training page.](media/custom-speech/custom-speech-model-training.png)

Obtain the **Model ID** to use as the argument to the `ModelId` parameter of the `docker run` command.

![Screenshot that shows Custom Speech model details.](media/custom-speech/custom-speech-model-details.png)

The following table represents the various `docker run` parameters and their corresponding descriptions:

| Parameter | Description |
|---------|---------|
| `{VOLUME_MOUNT}` | The host computer [volume mount](https://docs.docker.com/storage/volumes/), which Docker uses to persist the custom model. An example is *C:\CustomSpeech* where the C drive is located on the host machine. |
| `{MODEL_ID}` | The custom speech model ID. For more information, see [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md). |
| `{ENDPOINT_URI}` | The endpoint is required for metering and billing. For more information, see [Gather required parameters](#gather-required-parameters). |
| `{API_KEY}` | The API key is required. For more information, see [Gather required parameters](#gather-required-parameters). |

To run the custom speech-to-text container, execute the following `docker run` command:

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 4 \
-v {VOLUME_MOUNT}:/usr/local/models \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
ModelId={MODEL_ID} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a custom speech-to-text container from the container image.
* Allocates 4 CPU cores and 4 GB of memory.
* Loads the custom speech-to-text model from the volume input mount, for example, *C:\CustomSpeech*.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Downloads the model given the `ModelId` (if not found on the volume mount).
* If the custom model was previously downloaded, the `ModelId` is ignored.
* Automatically removes the container after it exits. The container image is still available on the host computer.

#### Base model download on the custom speech-to-text container

Starting in v2.6.0 of the custom-speech-to-text container, you can get the available base model information by using option `BaseModelLocale={LOCALE}`. This option gives you a list of available base models on that locale under your billing account. For example:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
BaseModelLocale={LOCALE} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a custom speech-to-text container from the container image.
* Checks and returns the available base models of the target locale.

The output gives you a list of base models with the information locale, model ID, and creation date time. You can use the model ID to download and use the specific base model you prefer. For example:
```
Checking available base model for en-us
2020/10/30 21:54:20 [Info] Searching available base models for en-us
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2016-11-04T08:23:42Z, Id: a3d8aab9-6f36-44cd-9904-b37389ce2bfa
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2016-11-04T12:01:02Z, Id: cc7826ac-5355-471d-9bc6-a54673d06e45
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2017-08-17T12:00:00Z, Id: a1f8db59-40ff-4f0e-b011-37629c3a1a53
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-04-16T11:55:00Z, Id: c7a69da3-27de-4a4b-ab75-b6716f6321e5
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-09-21T15:18:43Z, Id: da494a53-0dad-4158-b15f-8f9daca7a412
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-10-19T11:28:54Z, Id: 84ec130b-d047-44bf-a46d-58c1ac292ca7
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-11-26T07:59:09Z, Id: ee5c100f-152f-4ae5-9e9d-014af3c01c56
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-11-26T09:21:55Z, Id: d04959a6-71da-4913-9997-836793e3c115
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2019-01-11T10:04:19Z, Id: 488e5f23-8bc5-46f8-9ad8-ea9a49a8efda
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2019-02-18T14:37:57Z, Id: 0207b3e6-92a8-4363-8c0e-361114cdd719
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2019-03-03T17:34:10Z, Id: 198d9b79-2950-4609-b6ec-f52254074a05
2020/10/30 21:54:21 [Fatal] Please run this tool again and assign --modelId '<one above base model id>'. If no model id listed above, it means currently there is no available base model for en-us
```

#### Display model download on the custom speech-to-text container
Starting in v3.1.0 of the custom-speech-to-text container, you can get the available display models information and choose to download those models into your speech-to-text container to get highly improved final display output. 

You can query or download any or all of these display model types: Rescoring (`Rescore`), Punctuation (`Punct`), resegmentation (`Resegment`), and wfstitn (`Wfstitn`). Otherwise, you can use the `FullDisplay` option (with or without the other types) to query or download all types of display models. 

Set the `BaseModelLocale` to query the latest available display model on the target locale. If you include multiple display model types, the command will return the latest available display models for each type. For example:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
Punct Rescore Resegment Wfstitn \   # Specify `FullDisplay` or a space-separated subset of display models
BaseModelLocale={LOCALE} \           
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

Set the `DisplayLocale` to download the latest available display model on the target locale. When you set `DisplayLocale`, you must also specify `FullDisplay` or a space-separated subset of display models. The command will download the latest available display model for each specified type. For example:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
Punct Rescore Resegment Wfstitn \   # Specify `FullDisplay` or a space-separated subset of display models
DisplayLocale={LOCALE} \           
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

Set one model ID parameter to download a specific display model: Rescoring (`RescoreId`), Punctuation (`PunctId`), resegmentation (`ResegmentId`), or wfstitn (`WfstitnId`). This is similar to how you would download a base model via the `ModelId` parameter. For example, to download a rescoring display model, you can use the following command with the `RescoreId` parameter:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
RescoreId={RESCORE_MODEL_ID} \         
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

> [!NOTE]
> If you set more than one query or download parameter, the command will prioritize in this order: `BaseModelLocale`, model ID, and then `DisplayLocale` (only applicable for display models).

#### Custom pronunciation on the custom speech-to-text container

Starting in v2.5.0 of the custom-speech-to-text container, you can get custom pronunciation results in the output. All you need to do is have your own custom pronunciation rules set up in your custom model and mount the model to a custom-speech-to-text container.

# [Neural text-to-speech](#tab/ntts)

To run the neural text-to-speech container, execute the following `docker run` command:

```bash
docker run --rm -it -p 5000:5000 --memory 12g --cpus 6 \
mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a neural text-to-speech container from the container image.
* Allocates 6 CPU cores and 12 GB of memory.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Automatically removes the container after it exits. The container image is still available on the host computer.

# [Speech language identification](#tab/lid)

To run the Speech language identification container, execute the following `docker run` command:

```bash
docker run --rm -it -p 5003:5003 --memory 1g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a Speech language-detection container from the container image. Currently, you won't be charged for running this image.
* Allocates 1 CPU core and 1 GB of memory.
* Exposes TCP port 5003 and allocates a pseudo-TTY for the container.
* Automatically removes the container after it exits. The container image is still available on the host computer.

If you want to run this container with the speech-to-text container, you can use this [docker image](https://hub.docker.com/r/antsu/on-prem-client). After both containers have been started, use this `docker run` command to execute `speech-to-text-with-languagedetection-client`:

```Docker
docker run --rm -v ${HOME}:/root -ti antsu/on-prem-client:latest ./speech-to-text-with-languagedetection-client ./audio/LanguageDetection_en-us.wav --host localhost --lport 5003 --sport 5000
```

Increasing the number of concurrent calls can affect reliability and latency. For language identification, we recommend a maximum of four concurrent calls using 1 CPU with 1 GB of memory. For hosts with 2 CPUs and 2 GB of memory, we recommend a maximum of six concurrent calls.

***

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container. Otherwise, the container won't start. For more information, see [Billing](#billing).

## Query the container's prediction endpoint

> [!NOTE]
> Use a unique port number if you're running multiple containers.

| Containers | SDK Host URL | Protocol |
|--|--|--|
| Standard speech-to-text and custom speech-to-text | `ws://localhost:5000` | WS |
| Neural Text-to-speech, Speech language identification | `http://localhost:5000` | HTTP |

For more information on using WSS and HTTPS protocols, see [Container security](../cognitive-services-container-support.md#azure-cognitive-services-container-security).

### Speech-to-text (standard and custom)

[!INCLUDE [Query Speech-to-text container endpoint](includes/speech-to-text-container-query-endpoint.md)]

#### Analyze sentiment

If you provided your Language service API credentials [to the container](#analyze-sentiment-on-the-speech-to-text-output), you can use the Speech SDK to send speech recognition requests with sentiment analysis. You can configure the API responses to use either a *simple* or *detailed* format.

> [!NOTE]
> v1.13 of the Speech Service Python SDK has an identified issue with sentiment analysis. Use v1.12.x or earlier if you're using sentiment analysis in the Speech Service Python SDK.

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

### Neural Text-to-Speech

[!INCLUDE [Query Text-to-speech container endpoint](includes/text-to-speech-container-query-endpoint.md)]

### Run multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different exposed port. For example, run the first container on port 5000 and the second container on port 5001.

You can have this container and a different Cognitive Services container running on the HOST together. You also can have multiple containers of the same Cognitive Services container running.

[!INCLUDE [Validate container is running - Container API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

When you start or run the container, you might experience issues. Use an output [mount](speech-container-configuration.md#mount-settings) and enable logging. Doing so allows the container to generate log files that are helpful when you troubleshoot issues.

[!INCLUDE [Cognitive Services FAQ note](../containers/includes/cognitive-services-faq-note.md)]

[!INCLUDE [Diagnostic container](../containers/includes/diagnostics-container.md)]

## Billing

The Speech containers send billing information to Azure by using a Speech resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](speech-container-configuration.md).

## Summary

In this article, you learned concepts and workflow for how to download, install, and run Speech containers. In summary:

* Speech provides four Linux containers for Docker that have various capabilities:
  * Speech-to-text
  * Custom speech-to-text
  * Neural text-to-speech
  * Speech language identification
* Container images are downloaded from the container registry in Azure.
* Container images run in Docker.
* Whether you use the REST API (text-to-speech only) or the SDK (speech-to-text or text-to-speech), you specify the host URI of the container.
* You're required to provide billing information when you instantiate a container.

> [!IMPORTANT]
> Cognitive Services containers aren't licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers don't send customer data (for example, the image or text that's being analyzed) to Microsoft.

## Next steps

* Review [configure containers](speech-container-configuration.md) for configuration settings.
* Learn how to [use Speech service containers with Kubernetes and Helm](speech-container-howto-on-premises.md).
* Use more [Cognitive Services containers](../cognitive-services-container-support.md).
