---
title: Use summarization Docker containers on-premises
titleSuffix: Azure AI services
description: Use Docker containers for the summarization API to summarize text, on-premises.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: jboback
keywords: on-premises, Docker, container
---

# Use summarization Docker containers on-premises

Containers enable you to host the Summarization API on your own infrastructure. If you have security or data governance requirements that can't be fulfilled by calling Summarization remotely, then containers might be a good option.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/).
* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure. 
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of [Docker concepts](https://docs.docker.com/get-started/overview/). 
* A <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language resource </a> with the free (F0) or standard (S) [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/). For disconnected containers, the DC0 tier is required.

[!INCLUDE [Gathering required parameters](../../../containers/includes/container-gathering-required-parameters.md)]

## Host computer requirements and recommendations

[!INCLUDE [Host Computer requirements](../../../../../includes/cognitive-services-containers-host-computer.md)]

The following table describes the minimum and recommended specifications for the summarization container skills. Listed CPU/memory combinations are for a 4000 token input (conversation consumption is for all the aspects in the same request).

| Container Type             | Recommended number of CPU cores  | Recommended memory | Notes |
|----------------------------|----------------------------------|--------------------|-------|
| Summarization CPU container| 16                               | 48 GB              |       |
| Summarization GPU container| 2                                | 24 GB              | Requires an Nvidia GPU that supports Cuda 11.8 with 16GB VRAM.|

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.


## Get the container image with `docker pull`

The Summarization container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/textanalytics/` repository and is named `summarization`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization`

To use the latest version of the container, you can use the `latest` tag. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization).

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the Microsoft Container Registry.

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu
```
for CPU containers,
```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:gpu
```
for GPU containers.

[!INCLUDE [Tip for using docker list](../../../../../includes/cognitive-services-containers-docker-list-tip.md)]

## Download the summarization container models

A pre-requisite for running the summarization container is to download the models first. This can be done by running one of the following commands using a CPU container image as an example:

```bash
docker run -v {HOST_MODELS_PATH}:/models mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu downloadModels=ExtractiveSummarization billing={ENDPOINT_URI} apikey={API_KEY}
docker run -v {HOST_MODELS_PATH}:/models mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu downloadModels=AbstractiveSummarization billing={ENDPOINT_URI} apikey={API_KEY}
docker run -v {HOST_MODELS_PATH}:/models mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu downloadModels=ConversationSummarization billing={ENDPOINT_URI} apikey={API_KEY}
```
It's not recommended to download models for all skills inside the same `HOST_MODELS_PATH`, as the container loads all models inside the `HOST_MODELS_PATH`. Doing so would use a large amount of memory. It's recommended to only download the model for the skill you need in a particular `HOST_MODELS_PATH`.

In order to ensure compatibility between models and the container, re-download the utilized models whenever you create a container using a new image version. When using a disconnected container, the license should be downloaded again after downloading the models.

## Run the container with `docker run`

Once the *Summarization* container is on the host computer, use the following `docker run` command to run the containers. The container will continue to run until you stop it. Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{HOST_MODELS_PATH}** | The host computer [volume mount](https://docs.docker.com/storage/volumes/), which Docker uses to persist the model. |An example is c:\SummarizationModel where the c:\ drive is located on the host machine.|
| **{ENDPOINT_URI}** | The endpoint for accessing the summarization API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com`|
| **{API_KEY}** | The key for your Language resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|

```bash
docker run -p 5000:5000 -v {HOST_MODELS_PATH}:/models mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu eula=accept rai_terms=accept billing={ENDPOINT_URI} apikey={API_KEY}
```

Or if you are running a GPU container, use this command instead.
```bash
docker run -p 5000:5000 --gpus all -v {HOST_MODELS_PATH}:/models mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:gpu eula=accept rai_terms=accept billing={ENDPOINT_URI} apikey={API_KEY}
```
If there is more  than one GPU on the machine, replace `--gpus all` with `--gpus device={DEVICE_ID}`.

> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `Eula`, `Billing`, `rai_terms` and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

This command:

* Runs a *Summarization* container from the container image
* Allocates one CPU core and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.

[!INCLUDE [Running multiple containers on the same host](../../../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, `http://localhost:5000`, for container APIs.

<!--  ## Validate container is running -->

[!INCLUDE [Container's API documentation](../../../../../includes/cognitive-services-containers-api-documentation.md)]

## Run the container disconnected from the internet

[!INCLUDE [configure-disconnected-container](../includes/configure-disconnected-summarization.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](../../concepts/configure-containers.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Azure AI services FAQ note](../../../containers/includes/cognitive-services-faq-note.md)]

## Billing

The summarization containers send billing information to Azure, using a _Language_ resource on your Azure account. 

[!INCLUDE [Container's Billing Settings](../../../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](../../concepts/configure-containers.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running summarization containers. In summary:

* Summarization provides Linux containers for Docker
* Container images are downloaded from the Microsoft Container Registry (MCR).
* Container images run in Docker.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> This container is not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Azure AI containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps

* See [Configure containers](../../concepts/configure-containers.md) for configuration settings.
