---
title: How to install and run containers - Computer Vision
titlesuffix: Azure Cognitive Services
description: How to download, install, and run containers for Computer Vision in this walkthrough tutorial.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: dapine
ms.custom: seodec18
---

# Install and run Recognize Text containers

The Recognize Text portion of Computer Vision is also available as a Docker container. It allows you to detect and extract printed text from images of various objects with different surfaces and backgrounds, such as receipts, posters, and business cards.  
> [!IMPORTANT]
> The Recognize Text container currently works only with English.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

You must meet the following prerequisites before using Recognize Text containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Azure `Cognitive Services` resource |In order to use the container, you must have:<br><br>A _Cognitive Services_ Azure resource and the associated billing key the billing endpoint URI. Both values are available on the Overview and Keys pages for the resource and are required to start the container. You need to add the `vision/v2.0` routing to the endpoint URI as shown in the following BILLING_ENDPOINT_URI example. <br><br>**{BILLING_KEY}**: resource key<br><br>**{BILLING_ENDPOINT_URI}**: endpoint URI example is: `https://westus.api.cognitive.microsoft.com/vision/v2.0`|

## Request access to the private container registry

[!INCLUDE [Request access to private preview](../../../includes/cognitive-services-containers-request-access.md)]

### The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]


### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for each Recognize Text container.

| Container | Minimum | Recommended |TPS<br>(Minimum, Maximum)|
|-----------|---------|-------------|--|
|Recognize Text|1 core, 8 GB memory, 0.5 TPS|2 cores, 8 GB memory, 1 TPS|0.5, 1|

* Each core must be at least 2.6 gigahertz (GHz) or faster.
* TPS - transactions per second

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

Container images for Recognize Text are available. 

| Container | Repository |
|-----------|------------|
|Recognize Text | `containerpreview.azurecr.io/microsoft/cognitive-services-recognize-text:latest` |

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image.


### Docker pull for the Recognize Text container

```
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-recognize-text:latest
```

[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required billing settings. More [examples](computer-vision-resource-container-config.md) of the `docker run` command are available. 
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint). 

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. The command uses the following parameters:

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container, and is available on the Azure `Cognitive Services` Keys page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value. Example is: `https://westus.api.cognitive.microsoft.com/vision/v2.0`|

You need to add the `vision/v2.0` routing to the endpoint URI as shown in the following BILLING_ENDPOINT_URI example.

Replace these parameters with your own values in the following example `docker run` command.

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
containerpreview.azurecr.io/microsoft/cognitive-services-recognize-text \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
```

This command:

* Runs a recognize container from the container image
* Allocates one CPU core and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer. 

More [examples](./computer-vision-resource-container-config.md#example-docker-run-commands) of the `docker run` command are available. 

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

[!INCLUDE [Running multiple containers on the same host](../../../includes/cognitive-services-containers-run-multiple-same-host.md)]


## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs. 

Use the host, `http://localhost:5000`, for container APIs.

### Asynchronous text recognition

You can use the `POST /vision/v2.0/recognizeText` and `GET /vision/v2.0/textOperations/*{id}*` operations in concert to asynchronously recognize printed text in an image, similar to how the Computer Vision service uses those corresponding REST operations. The Recognize Text container only recognizes printed text, not handwritten text, at this time, so the `mode` parameter normally specified for the Computer Vision service operation is ignored by the Recognize Text container.

### Synchronous text recognition

You can use the `POST /vision/v2.0/recognizeTextDirect` operation to synchronously recognize printed text in an image. Because this operation is synchronous, the request body for this operation is the same as that for the `POST /vision/v2.0/recognizeText` operation, but the response body for this operation is the same as that returned by the `GET /vision/v2.0/textOperations/*{id}*` operation.

<!--  ## Validate container is running -->

[!INCLUDE [Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]


## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](./computer-vision-resource-container-config.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container. 


## Billing

The Recognize Text containers send billing information to Azure, using a _Recognize Text_ resource on your Azure account. 

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](./computer-vision-resource-container-config.md).

<!--blogs/samples/video coures -->

[!INCLUDE [Discoverability of more container information](../../../includes/cognitive-services-containers-discoverability.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Recognize Text containers. In summary:

* Recognize Text provides a Linux container for Docker, encapsulating recognize text.
* Container images are downloaded from the Microsoft Container Registry (MCR) in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Recognize Text containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](computer-vision-resource-container-config.md) for configuration settings
* Review [Computer Vision overview](Home.md) to learn more about recognizing printed and handwritten text  
* Refer to the [Computer Vision API](//westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa) for details about the methods supported by the container.
* Refer to [Frequently asked questions (FAQ)](FAQ.md) to resolve issues related to Computer Vision functionality.
* Use more [Cognitive Services Containers](../cognitive-services-container-support.md)
