---
title: Use named entity recognition Docker containers on-premises
titleSuffix: Azure AI services
description: Use Docker containers for the Named Entity Recognition API to determine the language of written text, on-premises.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/02/2023
ms.author: jboback
keywords: on-premises, Docker, container
---

# Install and run Named Entity Recognition containers

Containers enable you to host the Named Entity Recognition API on your own infrastructure. If you have security or data governance requirements that can't be fulfilled by calling Named Entity Recognition remotely, then containers might be a good option.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

## Prerequisites

You must meet the following prerequisites before using Named Entity Recognition containers. 

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/).
* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure. 
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of [Docker concepts](https://docs.docker.com/get-started/overview/). 
* A <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language resource </a>

[!INCLUDE [Gathering required parameters](../../../containers/includes/container-gathering-required-parameters.md)]

## Host computer requirements and recommendations

[!INCLUDE [Host Computer requirements](../../../../../includes/cognitive-services-containers-host-computer.md)]

The following table describes the minimum and recommended specifications for the available container. Each CPU core must be at least 2.6 gigahertz (GHz) or faster.

It is recommended to have a CPU with AVX-512 instruction set, for the best experience (performance and accuracy).

|                                | Minimum host specs     | Recommended host specs |
|--------------------------------|------------------------|------------------------|
| **Named Entity Recognition**   | 1 core, 2GB memory     | 4 cores, 8GB memory    |

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

The Named Entity Recognition container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/textanalytics/` repository and is named `ner`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/textanalytics/ner`

 To use the latest version of the container, you can use the `latest` tag, which is for english. You can also find a full list of containers for supported languages using the [tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/ner/tags).

The latest Named Entity Recognition container is available in several languages. To download the container for the English container, use the command below. 

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/ner:latest
```

[!INCLUDE [Tip for using docker list](../../../../../includes/cognitive-services-containers-docker-list-tip.md)]

## Run the container with `docker run`

Once the container is on the host computer, use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container will continue to run until you stop it. Replace the placeholders below with your own values:


> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

To run the Named Entity Recognition container, execute the following `docker run` command. Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your Language resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| **{IMAGE_TAG}** | The image tag representing the language of the container you want to run. Make sure this matches the `docker pull` command you used. | `latest` |

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/textanalytics/ner:{IMAGE_TAG} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a *Named Entity Recognition* container from the container image
* Allocates one CPU core and 8 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.

[!INCLUDE [Running multiple containers on the same host](../../../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, `http://localhost:5000`, for container APIs.

<!-- ## Validate container is running -->

[!INCLUDE [Container's API documentation](../../../../../includes/cognitive-services-containers-api-documentation.md)]

For information on how to call NER see [our guide](../how-to-call.md)

## Run the container disconnected from the internet

[!INCLUDE [configure-disconnected-container](../../../containers/includes/configure-disconnected-container.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](../../concepts/configure-containers.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Azure AI services FAQ note](../../../containers/includes/cognitive-services-faq-note.md)]

## Billing

The Named Entity Recognition containers send billing information to Azure, using a _Language_ resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](../../concepts/configure-containers.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Named Entity Recognition containers. In summary:

* Named Entity Recognition provides Linux containers for Docker
* Container images are downloaded from the Microsoft Container Registry (MCR).
* Container images run in Docker.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Azure AI containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Azure AI containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps

* See [Configure containers](../../concepts/configure-containers.md) for configuration settings.
