---
title: Install Speech containers
titleSuffix: Azure Cognitive Services
description: Install and run speech containers. Speech-to-text transcribes audio streams to text in real time that your applications, tools, or devices can consume or display. Text-to-speech converts input text into human-like synthesized speech.  
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: dapine
---

# Install and run Speech Service containers

Speech containers enable customers to build one speech application architecture that is optimized to take advantage of both robust cloud capabilities and edge locality. 

The two speech containers are **speech-to-text** and **text-to-speech**. 

|Function|Features|Latest|
|-|-|--|
|Speech-to-text| <li>Transcribes continuous real-time speech or batch audio recordings into text with intermediate results.|1.1.3|
|Text-to-Speech| <li>Converts text to natural-sounding speech. with plain text input or Speech Synthesis Markup Language (SSML). |1.1.0|

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

You must meet the following prerequisites before using Speech containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Speech resource |In order to use these containers, you must have:<br><br>A _Speech_ Azure resource to get the associated billing key and billing endpoint URI. Both values are available on the Azure portal's **Speech** Overview and Keys pages and are required to start the container.<br><br>**{BILLING_KEY}**: resource key<br><br>**{BILLING_ENDPOINT_URI}**: endpoint URI example is: `https://westus.api.cognitive.microsoft.com/sts/v1.0`|

## Request access to the container registry

You must first complete and submit the [Cognitive Services Speech Containers Request form](https://aka.ms/speechcontainerspreview/) to request access to the container. 

[!INCLUDE [Request access to the container registry](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

## The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

### Advanced Vector Extension support

The **host** is the computer that runs the docker container. The host must support [Advanced Vector Extensions](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions#CPUs_with_AVX2) (AVX2). You can check this support on Linux hosts with the following command: 

```console
grep -q avx2 /proc/cpuinfo && echo AVX2 supported || echo No AVX2 support detected
```

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for each Speech container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|cognitive-services-speech-to-text | 2 core<br>2 GB memory  | 4 core<br>4 GB memory  |
|cognitive-services-text-to-speech | 1 core, 0.5 GB memory| 2 core, 1 GB memory |

* Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

**Note**; The minimum and recommended are based off of Docker limits, *not* the host machine resources. For example, speech-to-text containers memory map portions of a large language model, and it is _recommended_ that the entire file fits in memory, which is an additional 4-6 GB. Also, the first run of either container may take longer, since models are being paged into memory.

## Get the container image with `docker pull`

Container images for Speech are available.

| Container | Repository |
|-----------|------------|
| cognitive-services-speech-to-text | `containerpreview.azurecr.io/microsoft/cognitive-services-speech-to-text:latest` |
| cognitive-services-text-to-speech | `containerpreview.azurecr.io/microsoft/cognitive-services-text-to-speech:latest` |

[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]

### Language locale is in container tag

The `latest` tag pulls the `en-us` locale and `jessarus` voice.

#### Speech to text locales

All tags, except for `latest` are in the following format, where the `<culture>` indicates the locale container:

```
<major>.<minor>.<patch>-<platform>-<culture>-<prerelease>
```

The following tag is an example of the format:

```
1.1.3-amd64-en-us-preview
```

The following table lists the supported locales for **speech-to-text** in the 1.1.3 version of the container:

|Language locale|Tags|
|--|--|
|Chinese|`zh-cn`|
|English |`en-us`<br>`en-gb`<br>`en-au`<br>`en-in`|
|French |`fr-ca`<br>`fr-fr`|
|German|`de-de`|
|Italian|`it-it`|
|Japanese|`ja-jp`|
|Korean|`ko-kr`|
|Portuguese|`pt-br`|
|Spanish|`es-es`<br>`es-mx`|

#### Text to speech locales

All tags, except for `latest` are in the following format, where the `<culture>` indicates the locale and the `<voice>` indicates the voice of the container:

```
<major>.<minor>.<patch>-<platform>-<culture>-<voice>-<prerelease>
```

The following tag is an example of the format:

```
1.1.0-amd64-en-us-jessarus-preview
```

The following table lists the supported locales for **text-to-speech** in the 1.1.0 version of the container:

|Language locale|Tags|Supported voices|
|--|--|--|
|Chinese|`zh-cn`|huihuirus<br>kangkang-apollo<br>yaoyao-apollo|
|English |`en-au`|catherine<br>hayleyrus|
|English |`en-gb`|george-apollo<br>hazelrus<br>susan-apollo|
|English |`en-in`|heera-apollo<br>priyarus<br>ravi-apollo<br>|
|English |`en-us`|jessarus<br>benjaminrus<br>jessa24krus<br>zirarus<br>guy24krus|
|French|`fr-ca`|caroline<br>harmonierus|
|French|`fr-fr`|hortenserus<br>julie-apollo<br>paul-apollo|
|German|`de-de`|hedda<br>heddarus<br>stefan-apollo|
|Italian|`it-it`|cosimo-apollo<br>luciarus|
|Japanese|`ja-jp`|ayumi-apollo<br>harukarus<br>ichiro-apollo|
|Korean|`ko-kr`|heamirus|
|Portuguese|`pt-br`|daniel-apollo<br>heloisarus|
|Spanish|`es-es`|elenarus<br>laura-apollo<br>pablo-apollo<br>|
|Spanish|`es-mx`|hildarus<br>raul-apollo|

### Docker pull for the speech containers

#### Speech-to-text

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-speech-to-text:latest
```

#### Text-to-speech

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-text-to-speech:latest
```

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required but not used billing settings. More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run any of the three containers. The command uses the following parameters:

**During the preview**, the billing settings must be valid to start the container, but you aren't billed for usage.

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container, and is available on the Azure portal's Speech Keys page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal's Speech Overview page.|

Replace these parameters with your own values in the following example `docker run` command.

### Text-to-speech

```bash
docker run --rm -it -p 5000:5000 --memory 2g --cpus 1 \
containerpreview.azurecr.io/microsoft/cognitive-services-text-to-speech \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
```

### Speech-to-text

```bash
docker run --rm -it -p 5000:5000 --memory 2g --cpus 2 \
containerpreview.azurecr.io/microsoft/cognitive-services-speech-to-text \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
```

This command:

* Runs a Speech container from the container image
* Allocates 2 CPU cores and 2 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

## Query the container's prediction endpoint

|Container|Endpoint|
|--|--|
|Speech-to-text|ws://localhost:5000/speech/recognition/dictation/cognitiveservices/v1|
|Text-to-speech|http://localhost:5000/speech/synthesize/cognitiveservices/v1|

### Speech-to-text

The container provides websocket-based query endpoint APIs, that are accessed through the [Speech SDK](index.yml).

By default, the Speech SDK uses online speech services. To use the container, you need to change the initialization method. See the examples below.

#### For C#

Change from using this Azure-cloud initialization call:

```C#
var config = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
```

to this call using the container endpoint:

```C#
var config = SpeechConfig.FromEndpoint(
    new Uri("ws://localhost:5000/speech/recognition/dictation/cognitiveservices/v1"),
    "YourSubscriptionKey");
```

#### For Python

Change from using this Azure-cloud initialization call

```python
speech_config = speechsdk.SpeechConfig(
    subscription=speech_key, region=service_region)
```

to this call using the container endpoint:

```python
speech_config = speechsdk.SpeechConfig(
    subscription=speech_key, endpoint="ws://localhost:5000/speech/recognition/dictation/cognitiveservices/v1")
```

### Text-to-speech

The container provides REST endpoint APIs which can be found [here](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-text-to-speech) and samples can be found [here](https://azure.microsoft.com/resources/samples/cognitive-speech-tts/).

[!INCLUDE [Validate container is running - Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

When you run the container, the container uses **stdout** and **stderr** to output information that is helpful to troubleshoot issues that happen while starting or running the container.

## Billing

The Speech containers send billing information to Azure, using a _Speech_ resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](speech-container-configuration.md).

<!--blogs/samples/video coures -->

[!INCLUDE [Discoverability of more container information](../../../includes/cognitive-services-containers-discoverability.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Speech containers. In summary:

* Speech provides two Linux containers for Docker, encapsulating speech to text and text to speech.
* Container images are downloaded from the private container registry in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Speech containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
>  Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](speech-container-configuration.md) for configuration settings
* Use more [Cognitive Services Containers](../cognitive-services-container-support.md)
