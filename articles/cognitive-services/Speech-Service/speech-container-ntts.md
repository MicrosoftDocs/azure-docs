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

By using containers, you can run _some_ of the Azure Cognitive Services Speech service APIs in your own environment. Containers are great for specific security and data governance requirements. In this article, you'll learn how to download, install, and run a Speech container.

> [!NOTE]
> You must [request and get approval](speech-container-overview.md#request-approval-to-run-the-container) to use a Speech container. 

## Available Speech containers

> [!IMPORTANT]
> We retired the standard speech synthesis voices and text-to-speech container on August 31, 2021. Consider migrating your applications to use the neural text-to-speech container instead. For more information on updating your application, see [Migrate from standard voice to prebuilt neural voice](./how-to-migrate-to-prebuilt-neural-voice.md).
Converts text to natural-sounding speech by using deep neural network technology, which allows for more natural synthesized speech. | 

Latest: 2.11.0. For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/neural-text-to-speech/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/neural-text-to-speech/tags/list).


You need the [prerequisites](speech-container-howto.md#prerequisites).

## Speech container images

The Neural Text-to-speech container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `neural-text-to-speech`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech`.

To use the latest version of the container, you can use the `latest` tag. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/neural-text-to-speech/about).

| Container | Repository |
|-----------|------------|
| Neural text-to-speech | `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech:latest` |


### Get the container image with docker pull

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```bash
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
> When you construct a neural text-to-speech HTTP POST, the [SSML](speech-synthesis-markup.md) message requires a `voice` element with a `name` attribute. The value is the corresponding container [locale and voice](language-support.md?tabs=tts). For example, the `latest` tag would have a voice name of `en-US-AriaNeural`.

## Use the container

After the container is on the [host computer](#host-computer-requirements-and-recommendations), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run) with the required billing settings. More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with docker run

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. For more information on how to get the `{Endpoint_URI}` and `{API_Key}` values, see [Gather required parameters](#gather-required-parameters). More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are also available.

> [!NOTE]
> For general container requirements, see [Container requirements and recommendations](#container-requirements-and-recommendations).


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

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container. Otherwise, the container won't start. For more information, see [Billing](#billing).


## Use the container


### Host authentication

[!INCLUDE [Speech container authentication](includes/container-speech-config.md)]



## Next steps

* Review [configure containers](speech-container-configuration.md) for configuration settings.
* Learn how to [use Speech service containers with Kubernetes and Helm](speech-container-howto-on-premises.md).
* Use more [Cognitive Services containers](../cognitive-services-container-support.md).


