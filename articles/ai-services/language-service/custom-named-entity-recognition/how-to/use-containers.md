---
title: Use Docker containers for Custom Named Entity Recognition on-premises
titleSuffix: Azure AI services
description: Learn how to use Docker containers for Custom Named Entity Recognition on-premises.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 05/08/2023
ms.author: aahi
ms.custom: language-service-custom-named-entity-recognition
keywords: on-premises, Docker, container, natural language processing
---

# Install and run Custom Named Entity Recognition containers


Containers enable you to host the Custom Named Entity Recognition API on your own infrastructure using your own trained model. If you have security or data governance requirements that can't be fulfilled by calling Custom Named Entity Recognition remotely, then containers might be a good option.

> [!NOTE]
> * The free account is limited to 5,000 text records per month and only the **Free** and **Standard** [pricing tiers](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics) are valid for containers. For more information on transaction request rates, see [Data and service limits](../../concepts/data-limits.md).


## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/).
* [Docker](https://docs.docker.com/) installed on a host computer. Docker must be configured to allow the containers to connect with and send billing data to Azure. 
    * On Windows, Docker must also be configured to support Linux containers.
    * You should have a basic understanding of [Docker concepts](https://docs.docker.com/get-started/overview/). 
* A <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language resource </a> with the free (F0) or standard (S) [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).
* A [trained and deployed Custom Named Entity Recognition model](../quickstart.md)

[!INCLUDE [Gathering required parameters](../../../containers/includes/container-gathering-required-parameters.md)]

## Host computer requirements and recommendations

[!INCLUDE [Host Computer requirements](../../../../../includes/cognitive-services-containers-host-computer.md)]

The following table describes the minimum and recommended specifications for Custom Named Entity Recognition containers. Each CPU core must be at least 2.6 gigahertz (GHz) or faster. The allowable Transactions Per Second (TPS) are also listed.

|  | Minimum host specs | Recommended host specs | Minimum TPS | Maximum TPS|
|---|---------|-------------|--|--|
| **Custom Named Entity Recognition**   | 1 core, 2 GB memory | 1 core, 4 GB memory |15 | 30| 

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Export your Custom Named Entity Recognition model

Before you proceed with running the docker image, you will need to export your own trained model to expose it to your container. Use the following command to extract your model and replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your Custom Named Entity Recognition resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the Custom Named Entity Recognition API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| **{PROJECT_NAME}** | The name of the project containing the model that you want to export. You can find it on your projects tab in the Language Studio portal. |`myProject`|
| **{TRAINED_MODEL_NAME}** | The name of the trained model you want to export. You can find your trained models on your model evaluation tab under your project in the Language Studio portal. |`myTrainedModel`|

```bash
curl --location --request PUT '{ENDPOINT_URI}/language/authoring/analyze-text/projects/{PROJECT_NAME}/exported-models/{TRAINED_MODEL_NAME}?api-version=2023-04-15-preview' \
--header 'Ocp-Apim-Subscription-Key: {API_KEY}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "TrainedmodelLabel": "{TRAINED_MODEL_NAME}"
}'
```

## Get the container image with `docker pull`

The Custom Named Entity Recognition container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/textanalytics/` repository and is named `customner`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/textanalytics/customner`.

To use the latest version of the container, you can use the `latest` tag. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/customner/about).

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry.

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/customner:latest
```

[!INCLUDE [Tip for using docker list](../../../../../includes/cognitive-services-containers-docker-list-tip.md)]

## Run the container with `docker run`

Once the container is on the host computer, use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container will continue to run until you stop it.

> [!IMPORTANT]
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

To run the *Custom Named Entity Recognition* container, execute the following `docker run` command. Replace the placeholders below with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
| **{API_KEY}** | The key for your Custom Named Entity Recognition resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| **{ENDPOINT_URI}** | The endpoint for accessing the Custom Named Entity Recognition API. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| **{PROJECT_NAME}** | The name of the project containing the model that you want to export. You can find it on your projects tab in the Language Studio portal. |`myProject`|
| **{LOCAL_PATH}** | The path where the exported model in the previous step will be downloaded in. You can choose any path of your liking. |`C:/custom-ner-model`|
| **{TRAINED_MODEL_NAME}** | The name of the trained model you want to export. You can find your trained models on your model evaluation tab under your project in the Language Studio portal. |`myTrainedModel`|


```bash
docker run --rm -it -p5000:5000  --memory 4g --cpus 1 \
-v {LOCAL_PATH}:/modelPath \
mcr.microsoft.com/azure-cognitive-services/textanalytics/customner:latest \
EULA=accept \
BILLING={ENDPOINT_URI} \
APIKEY={API_KEY} \
projectName={PROJECT_NAME}
exportedModelName={TRAINED_MODEL_NAME}
```

This command:

* Runs a *Custom Named Entity Recognition* container and downloads your exported model to the local path specified.
* Allocates one CPU core and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.

[!INCLUDE [Running multiple containers on the same host](../../../../../includes/cognitive-services-containers-run-multiple-same-host.md)]

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, `http://localhost:5000`, for container APIs.

[!INCLUDE [Container's API documentation](../../../../../includes/cognitive-services-containers-api-documentation.md)]


## Stop the container

[!INCLUDE [How to stop the container](../../../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](../../concepts/configure-containers.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Azure AI services FAQ note](../../../containers/includes/cognitive-services-faq-note.md)]

## Billing

The Custom Named Entity Recognition containers send billing information to Azure, using a _Custom Named Entity Recognition_ resource on your Azure account. 

[!INCLUDE [Container's Billing Settings](../../../../../includes/cognitive-services-containers-how-to-billing-info.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Custom Named Entity Recognition containers. In summary:

* Custom Named Entity Recognition provides Linux containers for Docker.
* Container images are downloaded from the Microsoft Container Registry (MCR).
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Custom Named Entity Recognition containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Azure AI containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Azure AI containers do not send customer data (e.g. text that is being analyzed) to Microsoft.

## Next steps

* See [Configure containers](../../concepts/configure-containers.md) for configuration settings.
