---
title: Install and run containers - Text Analytics
titleSuffix: Azure Cognitive Services
description: How to download, install, and run containers for Text Analytics in this walkthrough tutorial.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 03/10/2020
ms.author: dapine
---

# Install and run Text Analytics containers

Containers enable you to run the Text Analytic APIs in your own environment and are great for your specific security and data governance requirements. The Text Analytics containers provide advanced natural language processing over raw text, and include three main functions: sentiment analysis, key phrase extraction, and language detection. Entity linking is not currently supported in a container.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!IMPORTANT]
> The free account is limited to 5,000 transactions per month and only the **Free** and **Standard** <a href="https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics" target="_blank">pricing tiers <span class="docon docon-navigate-external x-hidden-focus"></span></a> are valid for containers. For more information on transaction request rates, see [Data Limits](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview#data-limits).

## Prerequisites

To run any of the Text Analytics containers, you must have the host computer and container environments.

## Preparation

You must meet the following prerequisites before using Text Analytics containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Text Analytics resource |In order to use the container, you must have:<br><br>An Azure [Text Analytics resource](../../cognitive-services-apis-create-account.md) to get the associated API key and endpoint URI. Both values are available on the Azure portal's Text Analytics Overview and Keys pages and are required to start the container.<br><br>**{API_KEY}**: One of the two available resource keys on the **Keys** page<br><br>**{ENDPOINT_URI}**: The endpoint as provided on the **Overview** page|

[!INCLUDE [Gathering required parameters](../../containers/includes/container-gathering-required-parameters.md)]

## The host computer

[!INCLUDE [Host Computer requirements](../../../../includes/cognitive-services-containers-host-computer.md)]

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores, at least 2.6 gigahertz (GHz) or faster, and memory, in gigabytes (GB), to allocate for each Text Analytics container.

# [Key Phrase Extraction](#tab/keyphrase)

[!INCLUDE [key-phrase-extraction-container-requirements](../includes/key-phrase-extraction-container-requirements.md)]

# [Language Detection](#tab/language)

[!INCLUDE [language-detection-container-requirements](../includes/language-detection-container-requirements.md)]

# [Sentiment Analysis](#tab/sentiment)

[!INCLUDE [sentiment-analysis-container-requirements](../includes/sentiment-analysis-container-requirements.md)]

***

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* TPS - transactions per second

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

Container images for Text Analytics are available on the Microsoft Container Registry.

# [Key Phrase Extraction](#tab/keyphrase)

[!INCLUDE [key-phrase-extraction-container-repository](../includes/key-phrase-extraction-container-repository.md)]

# [Language Detection](#tab/language)

[!INCLUDE [language-detection-container-repository](../includes/language-detection-container-repository.md)]

# [Sentiment Analysis](#tab/sentiment)

[!INCLUDE [sentiment-analysis-container-repository](../includes/sentiment-analysis-container-repository.md)]

***

[!INCLUDE [Tip for using docker list](../../../../includes/cognitive-services-containers-docker-list-tip.md)]

### Docker pull for the Text Analytics containers

# [Key Phrase Extraction](#tab/keyphrase)

[!INCLUDE [docker-pull-key-phrase-extraction-container](../includes/docker-pull-key-phrase-extraction-container.md)]

# [Language Detection](#tab/language)

[!INCLUDE [docker-pull-language-detection-container](../includes/docker-pull-language-detection-container.md)]

# [Sentiment Analysis](#tab/sentiment)

[!INCLUDE [docker-pull-sentiment-analysis-container](../includes/docker-pull-sentiment-analysis-container.md)]

***

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required billing settings. More [examples](../text-analytics-resource-container-config.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run any of the three containers. Refer to [Gathering required parameters](#gathering-required-parameters) for details on how to get the `{ENDPOINT_URI}` and `{API_KEY}` values.

[Examples](../text-analytics-resource-container-config.md#example-docker-run-commands) of the `docker run` command are available.

# [Key Phrase Extraction](#tab/keyphrase)

[!INCLUDE [docker-run-key-phrase-extraction-container](../includes/docker-run-key-phrase-extraction-container.md)]

# [Language Detection](#tab/language)

[!INCLUDE [docker-run-language-detection-container](../includes/docker-run-language-detection-container.md)]

# [Sentiment Analysis](#tab/sentiment)

[!INCLUDE [docker-run-sentiment-analysis-container](../includes/docker-run-sentiment-analysis-container.md)]

***

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

[!INCLUDE [Running multiple containers on the same host](../../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, `http://localhost:5000`, for container APIs.

<!--  ## Validate container is running -->

[!INCLUDE [Container's API documentation](../../../../includes/cognitive-services-containers-api-documentation.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](../text-analytics-resource-container-config.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Cognitive Services FAQ note](../../containers/includes/cognitive-services-faq-note.md)]

## Billing

The Text Analytics containers send billing information to Azure, using a _Text Analytics_ resource on your Azure account. 

[!INCLUDE [Container's Billing Settings](../../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](../text-analytics-resource-container-config.md).

<!--blogs/samples/video course -->

[!INCLUDE [Discoverability of more container information](../../../../includes/cognitive-services-containers-discoverability.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Text Analytics containers. In summary:

* Text Analytics provides three Linux containers for Docker, encapsulating various capabilities:
   * *Key Phrase Extraction*
   * *Language Detection*
   * *Sentiment Analysis*
* Container images are downloaded from the Microsoft Container Registry (MCR) in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Text Analytics containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](../text-analytics-resource-container-config.md) for configuration settings
* Refer to [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md) to resolve issues related to functionality.
