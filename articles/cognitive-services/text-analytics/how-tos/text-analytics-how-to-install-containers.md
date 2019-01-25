---
title: Install and run containers
titleSuffix: Text Analytics -  Azure Cognitive Services
description: How to download, install, and run containers for Text Analytics in this walkthrough tutorial.
services: cognitive-services
author: diberry
manager: cgronlun
ms.custom: seodec18
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 01/02/2019
ms.author: diberry
---

# Install and run Text Analytics containers

The Text Analytics containers provide advanced natural language processing over raw text, and includes three main functions: sentiment analysis, key phrase extraction, and language detection. Entity linking is not currently supported in a container. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

In order to run any of the Text Analytics containers, you must have the following:

## Preparation

You must meet the following prerequisites before using Text Analytics containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> Docker must be configured to allow the containers to connect with and send billing data to Azure. <br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.| 
|Text Analytics resource |In order to use the container, you must have:<br><br>A [_Text Analytics_](text-analytics-how-to-access-key.md) Azure resource to get the associated billing key and billing endpoint URI. Both values are available on the Azure portal's Text Analytics Overview and Keys pages and are required to start the container.<br><br>**{BILLING_KEY}**: resource key<br><br>**{BILLING_ENDPOINT_URI}**: endpoint URI example is: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0`|

### The host computer

The **host** is the computer that runs the docker container. It can be a computer on your premises or a docker hosting service in Azure including:

* [Azure Kubernetes Service](../../../aks/index.yml)
* [Azure Container Instances](../../../container-instances/index.yml)
* [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](../../../azure-stack/index.yml). For more information, see [Deploy Kubernetes to Azure Stack](../../../azure-stack/user/azure-stack-solution-template-kubernetes-deploy.md).


### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores, at least 2.6 gigahertz (GHz) or faster, and memory, in gigabytes (GB), to allocate for each Text Analytics container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|Key Phrase Extraction | 1 core, 2 GB memory | 1 core, 4 GB memory |
|Language Detection | 1 core, 2 GB memory | 1 core, 4 GB memory |
|Sentiment Analysis | 1 core, 2 GB memory | 1 core, 4 GB memory |

Core and memory correspond to the `--cpus` and `--memory` settings which are used as part of the `docker run` command.

## Get the container image with `docker pull`

Container images for Text Analytics are available from Microsoft Container Registry. 

| Container | Repository |
|-----------|------------|
|Key Phrase Extraction | `mcr.microsoft.com/azure-cognitive-services/keyphrase` |
|Language Detection | `mcr.microsoft.com/azure-cognitive-services/language` |
|Sentiment Analysis | `mcr.microsoft.com/azure-cognitive-services/sentiment` |

Use the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry..

For a full description of available tags for the Text Analytics containers, see the following containers on the Docker Hub:

* [Key Phrase Extraction](https://go.microsoft.com/fwlink/?linkid=2018757)
* [Language Detection](https://go.microsoft.com/fwlink/?linkid=2018759)
* [Sentiment Analysis](https://go.microsoft.com/fwlink/?linkid=2018654)


### Docker pull for the Key phrase extraction container

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/keyphrase:latest
```

### Docker pull for the language detection container

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/language:latest
```

### Docker pull for the sentiment container

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/sentiment:latest
```

### Listing the containers

You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:

```Docker
docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
```


## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run), with the required billing settings. More [examples](../text-analytics-resource-container-config.md#example-docker-run-commands) of the `docker run` command are available. 
1. [Query the container's prediction endpoint](#query-the-containers-prediction-endpoint). 

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run any of the three containers. The command uses the following parameters:

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | This key is used to start the container, and is available on the Azure portal's Text Analytics Keys page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal's Text Analytics Overview page.|

Replace these parameters with your own values in the following example `docker run` command.

```bash
docker run --rm -it -p 5000:5000 --memory 4g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/keyphrase \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY}
```

This command:

* Runs a key phrase container from the container image
* Allocates one CPU cores and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits. The container image is still available on the host computer. 

More [examples](../text-analytics-resource-container-config.md#example-docker-run-commands) of the `docker run` command are available. 

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

## Query the container's prediction endpoint

The container provides REST-based query prediction endpoint APIs. 

Use the host, https://localhost:5000, for container APIs.

## Stop the container

[!INCLUDE [How to stop the container](../../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](../text-analytics-resource-container-config.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container. 

## Container's API documentation

The container provides a full set of documentation for the endpoints as well as a `Try it now` feature. This feature allows you to enter your settings into a web-based HTML form and make the query without having to write any code. Once the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format required. 

> [!TIP]
> Read the [OpenAPI specification](https://swagger.io/docs/specification/about/), describing the API operations supported by the container, from the `/swagger` relative URI. For example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

## Billing

The Text Analytics containers send billing information to Azure, using a _Text Analytics_ resource on your Azure account. 

Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data to Microsoft. 

The `docker run` command uses the following arguments for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the _Text Analytics_ resource used to track billing information. |
| `Billing` | The endpoint of the _Text Analytics_ resource used to track billing information.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.

For more information about these options, see [Configure containers](../text-analytics-resource-container-config.md).

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Text Analytics containers. In summary:

* Text Analytics provides three Linux containers for Docker, encapsulating key phrase extraction, language detection, and sentiment analysis.
* Container images are downloaded from the Microsoft Container Registry (MCR) in Azure.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Text Analytics containers by specifying the host URI of the container.
* You must specify billing information when instantiating a container.

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft.

## Next steps

* Review [Configure containers](../text-analytics-resource-container-config.md) for configuration settings
* Refer to [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md) to resolve issues related to functionality.

