---
title: Install and run Docker containers for Sentiment Analysis
titleSuffix: Azure Cognitive Services
description: Use the Docker containers for the Sentiment Analysis API to perform natural language processing such as sentiment analysis, on-premises.
services: cognitive-services
author: aahill
manager: nitinme
ms.custom: seodec18, cog-serv-seo-aug-2020, devx-track-azurecli
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/21/2021
ms.author: aahi
keywords: on-premises, Docker, container, sentiment analysis, natural language processing
---

# Install and run Text Analytics containers

Containers enable you to run the Text Analytic APIs in your own environment and are great for your specific security and data governance requirements. The following Text Analytics containers are available:

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

## Prerequisites

You must meet the following prerequisites before using Text Analytics containers. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure. 
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of [Docker concepts](https://docs.docker.com/get-started/overview/). 
* A <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language Services resource"  target="_blank">Language Services resource </a> with the free (F0) or standard (S) [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).

[!INCLUDE [Gathering required parameters](../../../containers/includes/container-gathering-required-parameters.md)]

## Host computer requirements and recommendations

[!INCLUDE [Host Computer requirements](../../../../../includes/cognitive-services-containers-host-computer.md)]

The following table describes the minimum and recommended specifications for the available Text Analytics containers. Each CPU core must be at least 2.6 gigahertz (GHz) or faster. The allowable Transactions Per Second (TPS) are also listed.

|  | Minimum host specs | Recommended host specs | Minimum TPS | Maximum TPS|
|---|---------|-------------|--|--|
| **Sentiment Analysis**   | 1 core, 2GB memory | 4 cores, 8GB memory |15 | 30|

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

The sentiment analysis container v3 container is available in several languages. To download the container for the English container, use the command below. 

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-en
```

To download the container for another language, replace `en` with one of the language codes below. 

| Text Analytics Container | Language code |
|--|--|
| Chinese-Simplified    |   `zh-hans`   |
| Chinese-Traditional   |   `zh-hant`   |
| Dutch                 |     `nl`      |
| English               |     `en`      |
| French                |     `fr`      |
| German                |     `de`      |
| Hindi                 |    `hi`       |
| Italian               |     `it`      |
| Japanese              |     `ja`      |
| Korean                |     `ko`      |
| Norwegian  (Bokmål)   |     `no`      |
| Portuguese (Brazil)   |    `pt-BR`    |
| Portuguese (Portugal) |    `pt-PT`    |
| Spanish               |     `es`      |
| Turkish               |     `tr`      |

[!INCLUDE [Tip for using docker list](../../../../includes/cognitive-services-containers-docker-list-tip.md)]

## Run the container with `docker run`

Once the container is on the host computer, use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container will continue to run until you stop it.

> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
>   * If you're using the Text Analytics for health container, the [responsible AI](/legal/cognitive-services/text-analytics/transparency-note-health)  (RAI) acknowledgment must also be present with a value of `accept`.
> * The sentiment analysis and language detection containers use v3 of the API, and are generally available. The key phrase extraction container uses v2 of the API, and is in preview.

To run the *Sentiment Analysis v3* container, execute the following `docker run` command. Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the Text Analytics API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a *Sentiment Analysis* container from the container image
* Allocates one CPU core and 8 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.

[!INCLUDE [Running multiple containers on the same host](../../../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, `http://localhost:5000`, for container APIs.

<!--  ## Validate container is running -->

[!INCLUDE [Container's API documentation](../../../../../includes/cognitive-services-containers-api-documentation.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](../../concepts/configure-containers.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Cognitive Services FAQ note](../../../containers/includes/cognitive-services-faq-note.md)]

## Billing

The Text Analytics containers send billing information to Azure, using a _Text Analytics_ resource on your Azure account. 

[!INCLUDE [Container's Billing Settings](../../../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](../../../containers/includes/cognitive-services-faq-note.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Text Analytics containers. In summary:

* Sentiment Analysis provides Linux containers for Docker
* Container images are downloaded from the Microsoft Container Registry (MCR).
* Container images run in Docker.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps

* See [Configure containers](../../../containers/includes/cognitive-services-faq-note.md) for configuration settings.
