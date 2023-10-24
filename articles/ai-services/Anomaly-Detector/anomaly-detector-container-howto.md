---
title: Install and run Docker containers for the Anomaly Detector API
titleSuffix: Azure AI services
description: Use the Anomaly Detector API's algorithms to find anomalies in your data, on-premises using a Docker container.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: how-to
ms.date: 01/27/2023
ms.author: mbullwin
ms.custom: cog-serv-seo-aug-2020
keywords: on-premises, Docker, container, streaming, algorithms
---

# Install and run Docker containers for the Anomaly Detector API 

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

[!INCLUDE [container image location note](../containers/includes/image-location-note.md)]

Containers enable you to use the Anomaly Detector API your own environment. Containers are great for specific security and data governance requirements. In this article you'll learn how to download, install, and run an Anomaly Detector container.

Anomaly Detector offers a single Docker container for using the API on-premises. Use the container to:
* Use the Anomaly Detector's algorithms on your data
* Monitor streaming data, and detect anomalies as they occur in real-time.
* Detect anomalies throughout your data set as a batch. 
* Detect trend change points in your data set as a batch.
* Adjust the anomaly detection algorithm's sensitivity to better fit your data.

For detailed information about the API, please see:
* [Learn more about Anomaly Detector API service](https://go.microsoft.com/fwlink/?linkid=2080698&clcid=0x409)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

## Prerequisites

You must meet the following prerequisites before using Anomaly Detector containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.|
|Anomaly Detector resource |In order to use these containers, you must have:<br><br>An Azure _Anomaly Detector_ resource to get the associated API key and endpoint URI. Both values are available on the Azure portal's **Anomaly Detector** Overview and Keys pages and are required to start the container.<br><br>**{API_KEY}**: One of the two available resource keys on the **Keys** page<br><br>**{ENDPOINT_URI}**: The endpoint as provided on the **Overview** page|

[!INCLUDE [Gathering required container parameters](../containers/includes/container-gathering-required-parameters.md)]

## The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

<!--* [Azure IoT Edge](../../iot-edge/index.yml). For instructions of deploying Anomaly Detector module in IoT Edge, see [How to deploy Anomaly Detector module in IoT Edge](how-to-deploy-anomaly-detector-module-in-iot-edge.md).-->

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for Anomaly Detector container.

| QPS(Queries per second) | Minimum | Recommended |
|-----------|---------|-------------|
| 10 QPS | 4 core, 1-GB memory | 8 core 2-GB memory |
| 20 QPS | 8 core, 2-GB memory | 16 core 4-GB memory |

Each core must be at least 2.6 gigahertz (GHz) or faster.

Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

The Anomaly Detector container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/decision` repository and is named `anomaly-detector`. The fully qualified container image name is `mcr.microsoft.com/azure-cognitive-services/decision/anomaly-detector`.

To use the latest version of the container, you can use the `latest` tag. You can also find a full list of [image tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/decision/anomaly-detector/tags).

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image.

| Container | Repository |
|-----------|------------|
| cognitive-services-anomaly-detector | `mcr.microsoft.com/azure-cognitive-services/decision/anomaly-detector:latest` |

> [!TIP]
> When using [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/), pay close attention to the casing of the container registry, repository, container image name and corresponding tag. They are case sensitive.

<!--
For a full description of available tags, such as `latest` used in the preceding command, see [anomaly-detector](https://go.microsoft.com/fwlink/?linkid=2083827&clcid=0x409) on Docker Hub.
-->
[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]

### Docker pull for the Anomaly Detector container

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/anomaly-detector:latest
```

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required billing settings. More [examples](anomaly-detector-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint).

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. Refer to [gather required parameters](#gather-required-parameters) for details on how to get the `{ENDPOINT_URI}` and `{API_KEY}` values.

[Examples](anomaly-detector-container-configuration.md#example-docker-run-commands) of the `docker run` command are available.

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/decision/anomaly-detector:latest \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs an Anomaly Detector container from the container image
* Allocates one CPU core and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer.

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

### Running multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different port. For example, run the first container on port 5000 and the second container on port 5001.

Replace the `<container-registry>` and `<container-name>` with the values of the containers you use. These do not have to be the same container. You can have the Anomaly Detector container and the LUIS container running on the HOST together or you can have multiple Anomaly Detector containers running.

Run the first container on host port 5000.

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
<container-registry>/microsoft/<container-name> \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

Run the second container on host port 5001.


```bash
docker run --rm -it -p 5001:5000 --memory 4g --cpus 1 \
<container-registry>/microsoft/<container-name> \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

Each subsequent container should be on a different port.

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs.

Use the host, http://localhost:5000, for container APIs.

<!--  ## Validate container is running -->

[!INCLUDE [Container API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](anomaly-detector-container-configuration.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Azure AI services FAQ note](../containers/includes/cognitive-services-faq-note.md)]

[!INCLUDE [Diagnostic container](../containers/includes/diagnostics-container.md)]


## Billing

The Anomaly Detector containers send billing information to Azure, using an _Anomaly Detector_ resource on your Azure account.

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](anomaly-detector-container-configuration.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Anomaly Detector containers. In summary:

* Anomaly Detector provides one Linux container for Docker, encapsulating anomaly detection with batch vs streaming, expected range inference, and sensitivity tuning.
* Container images are downloaded from a private Azure Container Registry dedicated for containers.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Anomaly Detector containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Azure AI containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Azure AI containers do not send customer data (e.g., the time series data that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](anomaly-detector-container-configuration.md) for configuration settings
* [Deploy an Anomaly Detector container to Azure Container Instances](how-to/deploy-anomaly-detection-on-container-instances.md)
* [Learn more about Anomaly Detector API service](https://go.microsoft.com/fwlink/?linkid=2080698&clcid=0x409)
