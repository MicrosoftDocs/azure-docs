---
title: Language identification containers - Speech service
titleSuffix: Azure AI services
description: Install and run language identification containers with Docker to perform speech recognition, transcription, generation, and more on-premises.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.custom: devx-track-extended-java, devx-track-go, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 04/18/2023
ms.author: eur
zone_pivot_groups: programming-languages-speech-sdk-cli
keywords: on-premises, Docker, container
---

# Language identification containers with Docker

The Speech language identification container detects the language spoken in audio files. You can get real-time speech or batch audio recordings with intermediate results. In this article, you'll learn how to download, install, and run a language identification container.

> [!NOTE]
> You must [request and get approval](speech-container-overview.md#request-approval-to-run-the-container) to use a Speech container.
>
> The Speech language identification container is available in public preview. Containers in preview are still under development and don't meet Microsoft's stability and support requirements.

For more information about prerequisites, validating that a container is running, running multiple containers on the same host, and running disconnected containers, see [Install and run Speech containers with Docker](speech-container-howto.md).

> [!TIP]
> To get the most useful results, use the Speech language identification container with the [speech to text](speech-container-stt.md) or [custom speech to text](speech-container-cstt.md) containers.

## Container images

The Speech language identification container image for all supported versions and locales can be found on the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/language-detection/tags) syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `language-detection`. 

:::image type="content" source="./media/containers/mcr-tags-language-detection.png" alt-text="A screenshot of the search connectors and triggers dialog." lightbox="./media/containers/mcr-tags-language-detection.png":::

The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection`. Either append a specific version or append `:latest` to get the most recent version.

| Version | Path |
|-----------|------------|
| Latest | `mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection:latest` |
| 1.11.0 | `mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection:1.11.0-amd64-preview` |

All tags, except for `latest`, are in the following format and are case sensitive:

```
<major>.<minor>.<patch>-<platform>-<prerelease>
```

The tags are also available [in JSON format](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/language-detection/tags/list) for your convenience. The body includes the container path and list of tags. The tags aren't sorted by version, but `"latest"` is always included at the end of the list as shown in this snippet:

```json
{
  "name": "azure-cognitive-services/speechservices/language-detection",
  "tags": [
    "1.1.0-amd64-preview",
    "1.11.0-amd64-preview",
    "1.3.0-amd64-preview",
    "1.5.0-amd64-preview",
    <--redacted for brevity-->
    "1.8.0-amd64-preview",
    "latest"
  ]
}
```

## Get the container image with docker pull

You need the [prerequisites](speech-container-howto.md#prerequisites) including required hardware. Please also see the [recommended allocation of resources](speech-container-howto.md#container-requirements-and-recommendations) for each Speech container. 

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```bash
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection:latest
```


## Run the container with docker run

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. 

The following table represents the various `docker run` parameters and their corresponding descriptions:

| Parameter | Description |
|---------|---------|
| `{ENDPOINT_URI}` | The endpoint is required for metering and billing. For more information, see [billing arguments](speech-container-howto.md#billing-arguments). |
| `{API_KEY}` | The API key is required. For more information, see [billing arguments](speech-container-howto.md#billing-arguments). |

When you run the Speech language identification container, configure the port, memory, and CPU according to the language identification container [requirements and recommendations](speech-container-howto.md#container-requirements-and-recommendations).

Here's an example `docker run` command with placeholder values. You must specify the `ENDPOINT_URI` and `API_KEY` values:

```bash
docker run --rm -it -p 5000:5003 --memory 1g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a Speech language identification container from the container image. 
* Allocates 1 CPU core and 1 GB of memory.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Automatically removes the container after it exits. The container image is still available on the host computer.

For more information about `docker run` with Speech containers, see [Install and run Speech containers with Docker](speech-container-howto.md#run-the-container).

## Run with the speech to text container

If you want to run the language identification container with the [speech to text](speech-container-stt.md) container, you can use this [docker image](https://hub.docker.com/r/antsu/on-prem-client). After both containers have been started, use this `docker run` command to execute `speech-to-text-with-languagedetection-client`:

```bash
docker run --rm -v ${HOME}:/root -ti antsu/on-prem-client:latest ./speech-to-text-with-languagedetection-client ./audio/LanguageDetection_en-us.wav --host localhost --lport 5003 --sport 5000
```

Increasing the number of concurrent calls can affect reliability and latency. For language identification, we recommend a maximum of four concurrent calls using 1 CPU with 1 GB of memory. For hosts with 2 CPUs and 2 GB of memory, we recommend a maximum of six concurrent calls.

## Use the container

[!INCLUDE [Speech container authentication](includes/containers-speech-config-http.md)]

[Try language identification](language-identification.md) using host authentication instead of key and region. When you run language ID in a container, use the `SourceLanguageRecognizer` object instead of `SpeechRecognizer` or `TranslationRecognizer`.

## Next steps

* See the [Speech containers overview](speech-container-overview.md)
* Review [configure containers](speech-container-configuration.md) for configuration settings
* Use more [Azure AI services containers](../cognitive-services-container-support.md)
