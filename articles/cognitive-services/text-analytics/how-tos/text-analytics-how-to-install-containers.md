---
title: Install and run containers
titleSuffix: Text Analytics - Cognitive Services - Azure
description: How to download, install, and run containers for Text Analytics in this walkthrough tutorial.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 11/14/2018
ms.author: diberry
---

# Install and run containers

Containerization is an approach to software distribution in which an application or service is packaged as a container image. The configuration and dependencies for the application or service are included in the container image. The container image can then be deployed on a container host with little or no modification. Containers are isolated from each other and the underlying operating system, with a smaller footprint than a virtual machine. Containers can be instantiated from container images for short-term tasks, and removed when no longer needed.

Text Analytics provides the following set of Docker containers, each of which contains a subset of functionality:

| Container| Description |
|----------|-------------|
|Key Phrase Extraction | Extracts key phrases to identify the main points. For example, for the input text "The food was delicious and there were wonderful staff", the API returns the main talking points: "food" and "wonderful staff". |
|Language Detection | For up to 120 languages, detects and reports in which language the input text is written. The container reports a single language code for every document that's included in the request. The language code is paired with a score indicating the strength of the score. |
|Sentiment Analysis | Analyzes raw text for clues about positive or negative sentiment. This API returns a sentiment score between 0 and 1 for each document, where 1 is the most positive. The analysis models are pre-trained using an extensive body of text and natural language technologies from Microsoft. For [selected languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages.md), the API can analyze and score any raw text that you provide, directly returning results to the calling application. |

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Preparation

You must meet the following prerequisites before using Text Analytics containers:

**Docker Engine**: You must have Docker Engine installed locally. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Linux](https://docs.docker.com/engine/installation/#supported-platforms), and [Windows](https://docs.docker.com/docker-for-windows/). On Windows, Docker must be configured to support Linux containers. Docker containers can also be deployed directly to [Azure Kubernetes Service](/azure/aks/), [Azure Container Instances](/azure/container-instances/), or to a [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure/azure-stack/). For more information about deploying Kubernetes to Azure Stack, see [Deploy Kubernetes to Azure Stack](/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

Docker must be configured to allow the containers to connect with and send billing data to Azure.

**Familiarity with Microsoft Container Registry and Docker**: You should have a basic understanding of both Microsoft Container Registry and Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.  

For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).

### Server requirements and recommendations

The following table describes the minimum and recommended CPU cores, at least 2.6 gigahertz (GHz) or faster, and memory, in gigabytes (GB), to allocate for each Text Analytics container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
|Key Phrase Extraction | 1 core, 2 GB memory | 1 core, 4 GB memory |
|Language Detection | 1 core, 2 GB memory | 1 core, 4 GB memory |
|Sentiment Analysis | 1 core, 8 GB memory | 1 core, 8 GB memory |

## Download container images from Microsoft Container Registry

Container images for Text Analytics are available from Microsoft Container Registry. The following table lists the repositories available from Microsoft Container Registry for Text Analytics containers. Each repository contains a container image, which must be downloaded to run the container locally.

| Container | Repository |
|-----------|------------|
|Key Phrase Extraction | `mcr.microsoft.com/azure-cognitive-services/keyphrase` |
|Language Detection | `mcr.microsoft.com/azure-cognitive-services/language` |
|Sentiment Analysis | `mcr.microsoft.com/azure-cognitive-services/sentiment` |

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from a repository. For example, to download the latest Key Phrase Extraction container image from the repository, use the following command:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/keyphrase:latest
```

For a full description of available tags for the Text Analytics containers, see the following containers on the Docker Hub:

* [Key Phrase Extraction](https://go.microsoft.com/fwlink/?linkid=2018757)
* [Language Detection](https://go.microsoft.com/fwlink/?linkid=2018759)
* [Sentiment Analysis](https://go.microsoft.com/fwlink/?linkid=2018654)

> [!TIP]
> You can use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>  ```Docker
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>  ```
>

## Instantiate a container from a downloaded container image

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to instantiate a container from a downloaded container image. For example, the following command:

* Instantiates a container from the Sentiment Analysis container image
* Allocates one CPU core and 8 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Automatically removes the container after it exits

```Docker
docker run --rm -it -p 5000:5000 --memory 8g --cpus 1 mcr.microsoft.com/azure-cognitive-services/sentiment Eula=accept Billing=https://westus.api.cognitive.microsoft.com/text/analytics/v2.0 ApiKey=0123456789

```

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` command-line options must be specified to instantiate the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

Once instantiated, you can call operations from the container by using the container's host URI. For example, the following host URI represents the Sentiment Analysis container that was instantiated in the previous example:

```http
http://localhost:5000/
```

> [!TIP]
> You can access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by a instantiated container, from the `/swagger` relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the Sentiment Analysis container that was instantiated in the previous example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```

You can either [call the REST API operations](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-call-api) available from your container, or use the [Azure Cognitive Services Text Analytics SDK](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.TextAnalytics) client library to call those operations.  
> [!IMPORTANT]
> You must have Azure Cognitive Services Text Analytics SDK version 2.1.0 or later if you want to use the client library with your container.

The only difference between calling a given operation from your container and calling that same operation from a corresponding service on Azure is that you'll use the host URI of your container, rather than the host URI of an Azure region, to call the operation. For example, if you wanted to use a Text Analytics instance running in the West US Azure region, you would call the following REST API operation:

```http
POST https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases
```

If you wanted to use a Key Phrase Extraction container running on your local machine under its default configuration, you would call the following REST API operation:

```http
POST http://localhost:5000/text/analytics/v2.0/keyPhrases
```

### Billing

The Text Analytics containers send billing information to Azure, using a corresponding Text Analytics resource on your Azure account. The following command-line options are used by the Text Analytics containers for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Text Analytics resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned Text Analytics Azure resource specified in `Billing`. |
| `Billing` | The endpoint of the Text Analytics resource used to track billing  information.<br/>The value of this option must be set to the endpoint URI of a provisioned Text Analytics Azure resource.|
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
* Review [Text Analytics overview](../overview.md) to learn more about key phrase detection, language detection, and sentiment analysis  
* Refer to the [Text Analytics API](//westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) for details about the methods supported by the container.
* Refer to [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md) to resolve issues related to Computer Vision functionality.