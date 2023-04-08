---
title: Language identification containers - Speech service
titleSuffix: Azure Cognitive Services
description: Install and run language identification containers with Docker to perform speech recognition, transcription, generation, and more on-premises.
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

# Language identification containers with Docker

By using containers, you can run _some_ of the Azure Cognitive Services Speech service APIs in your own environment. Containers are great for specific security and data governance requirements. In this article, you'll learn how to download, install, and run a Speech container.

> [!NOTE]
> You must [request and get approval](speech-container-overview.md#request-approval-to-run-the-container) to use a Speech container. 

## Available Speech containers

Detects the language spoken in audio files. 

Latest: 1.11.0. For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/language-detection/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/language-detection/tags/list). 

The container is available in public preview. Containers in preview are still under development and don't meet Microsoft's stability and support requirements.

You need the [prerequisites](speech-container-howto.md#prerequisites).


## Speech container images

The Speech language detection container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `language-detection`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection`.

To use the latest version of the container, you can use the `latest` tag. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/language-detection/tags).

> [!TIP]
> To get the most useful results, use the Speech language identification container with the speech-to-text or custom speech-to-text containers.

| Container | Repository |
|-----------|------------|
| Speech language identification | `mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection:latest` |


### Get the container image with docker pull

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```bash
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection:latest
```

## Use the container

After the container is on the [host computer](#host-computer-requirements-and-recommendations), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run) with the required billing settings. More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with docker run

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. For more information on how to get the `{Endpoint_URI}` and `{API_Key}` values, see [Gather required parameters](#gather-required-parameters). More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are also available.

> [!NOTE]
> For general container requirements, see [Container requirements and recommendations](#container-requirements-and-recommendations).

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

```bash
docker run --rm -v ${HOME}:/root -ti antsu/on-prem-client:latest ./speech-to-text-with-languagedetection-client ./audio/LanguageDetection_en-us.wav --host localhost --lport 5003 --sport 5000
```

Increasing the number of concurrent calls can affect reliability and latency. For language identification, we recommend a maximum of four concurrent calls using 1 CPU with 1 GB of memory. For hosts with 2 CPUs and 2 GB of memory, we recommend a maximum of six concurrent calls.

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container. Otherwise, the container won't start. For more information, see [Billing](#billing).



## Use the container


### Host authentication

[!INCLUDE [Speech container authentication](includes/container-speech-config.md)]



## Next steps

* Review [configure containers](speech-container-configuration.md) for configuration settings.
* Learn how to [use Speech service containers with Kubernetes and Helm](speech-container-howto-on-premises.md).
* Use more [Cognitive Services containers](../cognitive-services-container-support.md).


