---
title: Neural text-to-speech containers - Speech service
titleSuffix: Azure Cognitive Services
description: Install and run neural text-to-speech containers with Docker to perform speech synthesis and more on-premises.
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

# Text-to-speech containers with Docker

The neural text-to-speech container converts text to natural-sounding speech by using deep neural network technology, which allows for more natural synthesized speech.. In this article, you'll learn how to download, install, and run a Text-to-speech container.

> [!NOTE]
> You must [request and get approval](speech-container-overview.md#request-approval-to-run-the-container) to use a Speech container. 

For more information about prerequisites, validating that a container is running, running multiple containers on the same host, and running disconnected containers, see [Install and run Speech containers with Docker](speech-container-howto.md).

## Container images

The neural text-to-speech container image for all supported versions and locales can be found on the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/neural-text-to-speech/tags) syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `neural-text-to-speech`. 

:::image type="content" source="./media/containers/mcr-tags-neural-text-to-speech.png" alt-text="A screenshot of the search connectors and triggers dialog." lightbox="./media/containers/mcr-tags-neural-text-to-speech.png":::

The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech`. Either append a specific version or append `:latest` to get the most recent version.

| Version | Path |
|-----------|------------|
| Latest | `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech:latest`<br/><br/>The `latest` tag pulls the `en-US` locale and `en-us-arianeural` voice. |
| 3.12.0 | `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech:3.12.0-amd64-mr-in` |

All tags, except for `latest`, are in the following format and are case sensitive:

```
<major>.<minor>.<patch>-<platform>-<voice>-<preview>
```

The tags are also available [in JSON format](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/neural-text-to-speech/tags/list) for your convenience. The body includes the container path and list of tags. The tags aren't sorted by version, but `"latest"` is always included at the end of the list as shown in this snippet:

```json
{
  "name": "azure-cognitive-services/speechservices/neural-text-to-speech",
  "tags": [
    "1.10.0-amd64-cs-cz-antoninneural",
    "1.10.0-amd64-cs-cz-vlastaneural",
    "1.10.0-amd64-de-de-conradneural",
    "1.10.0-amd64-de-de-katjaneural",
    "1.10.0-amd64-en-au-natashaneural",
    <--redacted for brevity-->
    "latest"
  ]
}
```

> [!IMPORTANT]
> We retired the standard speech synthesis voices and standard [text-to-speech](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/text-to-speech/tags) container on August 31, 2021. You should use neural voices with the [neural-text-to-speech](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/neural-text-to-speech/tags) container instead. For more information on updating your application, see [Migrate from standard voice to prebuilt neural voice](./how-to-migrate-to-prebuilt-neural-voice.md).

## Get the container image with docker pull

You need the [prerequisites](speech-container-howto.md#prerequisites).

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```bash
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech:latest
```

> [!IMPORTANT]
> The `latest` tag pulls the `en-US` locale and `en-us-arianeural` voice. For additional locales and voices, see [text-to-speech container images](#container-images).

## Run the container with docker run

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. 

The following table represents the various `docker run` parameters and their corresponding descriptions:

| Parameter | Description |
|---------|---------|
| `{ENDPOINT_URI}` | The endpoint is required for metering and billing. For more information, see [billing arguments](speech-container-howto.md#billing-arguments). |
| `{API_KEY}` | The API key is required. For more information, see [billing arguments](speech-container-howto.md#billing-arguments). |

When you run the text-to-speech container, configure the port, memory, and CPU according to the text-to-speech container [requirements and recommendations](speech-container-howto.md#container-requirements-and-recommendations).

Here's an example `docker run` command with placeholder values. You must specify the `ENDPOINT_URI` and `API_KEY` values:

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

More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are also available.


## Use the container


> [!IMPORTANT]
> When you construct a neural text-to-speech HTTP POST, the [SSML](speech-synthesis-markup.md) message requires a `voice` element with a `name` attribute. The value is the corresponding container [locale and voice](language-support.md?tabs=tts). For example, the `latest` tag would have a voice name of `en-US-AriaNeural`.


### Host authentication

[!INCLUDE [Speech container authentication](includes/container-speech-config.md)]



## Next steps

* Review [configure containers](speech-container-configuration.md) for configuration settings.
* Learn how to [use Speech service containers with Kubernetes and Helm](speech-container-howto-on-premises.md).
* Use more [Cognitive Services containers](../cognitive-services-container-support.md).


