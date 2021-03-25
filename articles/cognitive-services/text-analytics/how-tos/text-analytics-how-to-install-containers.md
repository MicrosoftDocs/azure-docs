---
title: Install and run Docker containers for the Text Analytics API
titleSuffix: Azure Cognitive Services
description: Use the Docker containers for the Text Analytics API to perform natural language processing such as sentiment analysis, on-premises.
services: cognitive-services
author: aahill
manager: nitinme
ms.custom: seodec18, cog-serv-seo-aug-2020
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 03/25/2021
ms.author: aahi
keywords: on-premises, Docker, container, sentiment analysis, natural language processing
---

# Install and run Text Analytics containers

> [!NOTE]
> * The container for Sentiment Analysis and language detection are now Generally Available. The key phrase extraction container is available as an ungated public preview.
> * Entity linking and NER are not currently available as a container.
> * Accessing the Text Analytics for health container requires a [request form](https://aka.ms/csgate). Currently, you will not be billed for its usage.
> * The container image locations may have recently changed. Read this article to see the updated location for this container.

Containers enable you to run the Text Analytic APIs in your own environment and are great for your specific security and data governance requirements. The Text Analytics containers provide advanced natural language processing over raw text, and include three main functions: sentiment analysis, key phrase extraction, and language detection. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

> [!IMPORTANT]
> The free account is limited to 5,000 transactions per month and only the **Free** and **Standard** <a href="https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics" target="_blank">pricing tiers </a> are valid for containers. For more information on transaction request rates, see [Data Limits](../overview.md#data-limits).

## Prerequisites

To run any of the Text Analytics containers, you must have the host computer and container environments.

## Preparation

You must meet the following prerequisites before using Text Analytics containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Text Analytics resource |In order to use the container, you must have:<br><br>An Azure [Text Analytics resource](../../cognitive-services-apis-create-account.md) with the free (F0) or standard (S) [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/). You will need to get the associated API key and endpoint URI by navigating to your resource's **Key and endpoint** page in the Azure portal. <br><br>**{API_KEY}**: One of the two available resource keys. <br><br>**{ENDPOINT_URI}**: The endpoint for your resource. |

[!INCLUDE [Gathering required parameters](../../containers/includes/container-gathering-required-parameters.md)]

If you're using the Text Analytics for health container, the [responsible AI](https://docs.microsoft.com/legal/cognitive-services/text-analytics/transparency-note-health)  (RAI) acknowledgement must also be present with a value of `accept`.

## The host computer

[!INCLUDE [Host Computer requirements](../../../../includes/cognitive-services-containers-host-computer.md)]

### Container requirements and recommendations

The following table describes the minimum and recommended specifications for the Text Analytics containers. At least 2 gigabytes (GB) of memory are required, and each CPU core must be at least 2.6 gigahertz (GHz) or faster. The allowable Transactions Per Section (TPS) are also listed.

|  | Minimum host specs | Recommended host specs | Minimum TPS | Maximum TPS|
|---|---------|-------------|--|--|
| **Language detection, key phrase extraction**   | 1 core, 2GB memory | 1 core, 4GB memory |15 | 30|
| **Sentiment Analysis**   | 1 core, 2GB memory | 4 cores, 8GB memory |15 | 30|
| **Text Analytics for health - 1 document/request**   |  4 core, 10GB memory | 6 core, 12GB memory |15 | 30|
| **Text Analytics for health - 10 documents/request**   |  6 core, 16GB memory | 8 core, 20GB memory |15 | 30|

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

[!INCLUDE [Tip for using docker list](../../../../includes/cognitive-services-containers-docker-list-tip.md)]

Container images for Text Analytics are available on the Microsoft Container Registry.

# [Sentiment Analysis ](#tab/sentiment)

[!INCLUDE [docker-pull-sentiment-analysis-container](../includes/docker-pull-sentiment-analysis-container.md)]

# [Key Phrase Extraction (preview)](#tab/keyphrase)

[!INCLUDE [docker-pull-key-phrase-extraction-container](../includes/docker-pull-key-phrase-extraction-container.md)]

# [Language Detection](#tab/language)

[!INCLUDE [docker-pull-language-detection-container](../includes/docker-pull-language-detection-container.md)]

# [Text Analytics for health (preview)](#tab/healthcare)

[!INCLUDE [docker-pull-health-container](../includes/docker-pull-health-container.md)]

***

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required billing settings.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container will continue to run until you stop it.

> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
> * The sentiment analysis and language detection containers are generally available. The key phrase extraction container uses v2 of the API, and is in preview.

# [Sentiment Analysis](#tab/sentiment)

[!INCLUDE [docker-run-sentiment-analysis-container](../includes/docker-run-sentiment-analysis-container.md)]

# [Key Phrase Extraction (preview)](#tab/keyphrase)

[!INCLUDE [docker-run-key-phrase-extraction-container](../includes/docker-run-key-phrase-extraction-container.md)]

# [Language Detection](#tab/language)

[!INCLUDE [docker-run-language-detection-container](../includes/docker-run-language-detection-container.md)]

# [Text Analytics for health (preview)](#tab/healthcare)

[!INCLUDE [docker-run-health-container](../includes/docker-run-health-container.md)]

***

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

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Text Analytics containers. In summary:

* Text Analytics provides three Linux containers for Docker, encapsulating various capabilities:
   * *Sentiment Analysis*
   * *Key Phrase Extraction (preview)* 
   * *Language Detection*
   * *Text Analytics for health (preview)*
* Container images are downloaded from the Microsoft Container Registry (MCR) or preview container repository.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Text Analytics containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](../text-analytics-resource-container-config.md) for configuration settings
* Refer to [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md) to resolve issues related to functionality.
