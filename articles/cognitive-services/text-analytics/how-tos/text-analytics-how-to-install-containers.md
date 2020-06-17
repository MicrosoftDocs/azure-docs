---
title: Install and run containers - Text Analytics
titleSuffix: Azure Cognitive Services
description: How to download, install, and run containers for Text Analytics in this walkthrough tutorial.
services: cognitive-services
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 05/08/2020
ms.author: aahi
---

# Install and run Text Analytics containers

> [!NOTE]
> * The container for Sentiment Analysis v3 is now Generally Available. The key phrase extraction and language detection containers are available as an ungated public preview.
> * Entity linking and NER are not currently available as a container.

Containers enable you to run the Text Analytic APIs in your own environment and are great for your specific security and data governance requirements. The Text Analytics containers provide advanced natural language processing over raw text, and include three main functions: sentiment analysis, key phrase extraction, and language detection. 

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

The following table describes the minimum and recommended specifications for the Text Analytics containers. At least 2 gigabytes (GB) of memory are required, and each CPU core must be at least 2.6 gigahertz (GHz) or faster. The allowable Transactions Per Section (TPS) are also listed.

|  | Minimum host specs | Recommended host specs | Minimum TPS | Maximum TPS|
|---|---------|-------------|--|--|
| **Language detection, key phrase extraction**   | 1 core, 2GB memory | 1 core, 4GB memory |15 | 30|
| **Sentiment Analysis v3**   | 1 core, 2GB memory | 4 cores, 8GB memory |15 | 30|

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

[!INCLUDE [Tip for using docker list](../../../../includes/cognitive-services-containers-docker-list-tip.md)]

Container images for Text Analytics are available on the Microsoft Container Registry.

# [Sentiment Analysis v3](#tab/sentiment)

[!INCLUDE [docker-pull-sentiment-analysis-container](../includes/docker-pull-sentiment-analysis-container.md)]

# [Key Phrase Extraction (preview)](#tab/keyphrase)

[!INCLUDE [docker-pull-key-phrase-extraction-container](../includes/docker-pull-key-phrase-extraction-container.md)]

# [Language Detection (preview)](#tab/language)

[!INCLUDE [docker-pull-language-detection-container](../includes/docker-pull-language-detection-container.md)]

***

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required billing settings.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container will continue to run until you stop it.

Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the Text Analytics API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).
> * The sentiment analysis v3 container is now generally available, which returns [sentiment labels](../how-tos/text-analytics-how-to-sentiment-analysis.md#sentiment-analysis-versions-and-features) in the response. The key phrase extraction and language detection containers use v2 of the API, and are in preview.

# [Sentiment Analysis v3](#tab/sentiment)

[!INCLUDE [docker-run-sentiment-analysis-container](../includes/docker-run-sentiment-analysis-container.md)]

# [Key Phrase Extraction (preview)](#tab/keyphrase)

[!INCLUDE [docker-run-key-phrase-extraction-container](../includes/docker-run-key-phrase-extraction-container.md)]

# [Language Detection (preview)](#tab/language)

[!INCLUDE [docker-run-language-detection-container](../includes/docker-run-language-detection-container.md)]

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

<!--blogs/samples/video course -->

[!INCLUDE [Discoverability of more container information](../../../../includes/cognitive-services-containers-discoverability.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Text Analytics containers. In summary:

* Text Analytics provides three Linux containers for Docker, encapsulating various capabilities:
   * *Sentiment Analysis*
   * *Key Phrase Extraction (preview)* 
   * *Language Detection (preview)*
   
* Container images are downloaded from the Microsoft Container Registry (MCR) in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Text Analytics containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](../text-analytics-resource-container-config.md) for configuration settings
* Refer to [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md) to resolve issues related to functionality.
