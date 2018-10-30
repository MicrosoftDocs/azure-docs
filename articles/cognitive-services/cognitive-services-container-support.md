---
title: "Container support in Azure Cognitive Services"
titleSuffix: "Azure Cognitive Services"
description: Learn how Docker containers can get Cognitive Services closer to your data.
services: cognitive-services
author: deken
manager: nolachar

ms.service: cognitive-services
ms.topic: article
ms.date: 02/01/2018
ms.author: v-deken
#As a potential customer, I want to know more about how Cognitive Services provides and supports Docker containers for each service.
---

# Container support in Azure Cognitive Services

Container support in Azure Cognitive Services allows developers to use the same rich APIs that are available in Azure, but with the flexibility that comes with [Docker containers](https://www.docker.com/what-container). Container support is currently available in preview for a subset of Azure Cognitive Services, including parts of [Computer Vision](Computer-vision/Home.md), [Face](Face/Overview.md), and [Text Analytics](text-analytics/overview.md).

Containerization is an approach to software distribution in which an application or service, including its dependencies & configuration, is packaged together as a container image. With little or no modification, a container image can be deployed on a container host. Containers are isolated from each other and the underlying operating system, with a smaller footprint than a virtual machine. Containers can be instantiated from container images for short-term tasks, and removed when no longer needed.

The [Computer Vision](Computer-vision/Home.md), [Face](Face/Overview.md), and [Text Analytics](text-analytics/overview.md) services are available on [Microsoft Azure](https://azure.microsoft.com). Sign into the [Azure portal](https://portal.azure.com/) to create and explore Azure resources for these services.

## Features and benefits

Azure Cognitive Services containers provide you with functionality that you can run where you need it, when you need it. Some of the benefits of using Azure Cognitive Services containers include:

* Better isolation of your data and models  
  Containerized applications and services run on top of a container host, in either Linux or Windows. Containers are isolated from each other and from the underlying operating system.
* Local deployment with Azure Cognitive Services containers  
  You can deploy to any Docker-enabled host that is connected to Azure. This allows you to run models close to your data.
* More flexibility in deployment targets  
  Containers have a significantly smaller footprint than virtual machines, and can be instantiated on any machine, including virtual machines, that can support a Docker container host. For example, you can run the containers provided by Azure Cognitive Services containers in a Docker container host running on an Azure virtual machine, allowing you to choose the right VM SKU for your needs. Containers can also be deployed directly to [Azure Kubernetes Service](/azure/aks/), [Azure Container Instances](/azure/container-instances/), or to a [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure/azure-stack/). For more information about deploying Kubernetes to Azure Stack, see [Deploy Kubernetes to Azure Stack](/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).
* More flexibility in versioning and update management  
  With Azure Cognitive Services containers, you have more, and more fine-grained, control over what and when services get updated.
* Better composability of services  
  You can now compose services to maximize data locality between multiple services, with minimal cost.

You can typically use the same REST API operations and .NET Core client libraries with both Azure Cognitive Services and the corresponding containers, so your implementation can work seamlessly both in the cloud and on-premises.

## Containers in Azure Cognitive Services

Azure Cognitive Services containers provide the following set of Docker containers, each of which contains a subset of functionality from services in Azure Cognitive Services:

| Service | Container| Description |
|---------|----------|-------------|
|[Computer Vision](Computer-vision/computer-vision-how-to-install-containers.md) |**Recognize Text** |Extracts printed text from images of various objects with different surfaces and backgrounds, such as receipts, posters, and business cards.<br/><br/>**Important:** The Recognize Text container currently works only with English. |
|[Face](Face/face-how-to-install-containers.md) |**Face** |Detects human faces in images, and identifies attributes, including face landmarks (such as noses and eyes), gender, age, and other machine-predicted facial features. In addition to detection, Face can check if two faces in the same image or different images are the same by using a confidence score, or compare faces against a database to see if a similar-looking or identical face already exists. It can also organize similar faces into groups, using shared visual traits. |
|[Text Analytics](text-analytics/how-tos/text-analytics-how-to-install-containers.md) |**Key Phrase Extraction** ([image](https://go.microsoft.com/fwlink/?linkid=2018757)) |Extracts key phrases to identify the main points. For example, for the input text "The food was delicious and there were wonderful staff", the API returns the main talking points: "food" and "wonderful staff". |
|[Text Analytics](text-analytics/how-tos/text-analytics-how-to-install-containers.md)|**Language Detection** ([image](https://go.microsoft.com/fwlink/?linkid=2018759)) |For up to 120 languages, detects which language the input text is written in and report a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the score. |
|[Text Analytics](text-analytics/how-tos/text-analytics-how-to-install-containers.md)|**Sentiment Analysis** ([image](https://go.microsoft.com/fwlink/?linkid=2018654)) |Analyzes raw text for clues about positive or negative sentiment. This API returns a sentiment score between 0 and 1 for each document, where 1 is the most positive. The analysis models are pre-trained using an extensive body of text and natural language technologies from Microsoft. For [selected languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages.md), the API can analyze and score any raw text that you provide, directly returning results to the calling application. |

## Container availability for Azure Cognitive Services

Azure Cognitive Services containers are publicly available through your Azure subscription, and Docker container images can be pulled from either the Microsoft Container Registry or Docker Hub. You can use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from the appropriate registry.

> [!IMPORTANT]
> Currently, you must complete a sign-up process to access the [Face](Face/face-how-to-install-containers.md) and [Recognize Text](Computer-vision/computer-vision-how-to-install-containers.md) containers, in which you fill out and submit a questionnaire with questions about you, your company, and the use case for which you want to implement the containers. Once you're granted access and provided credentials, you can then pull the container images for the Face and Recognize Text containers from a private container registry hosted by Azure Container Registry.

## Prerequisites

You must satisfy the following prerequisites before using Azure Cognitive Services containers:

**Docker Engine**: You must have Docker Engine installed locally. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Linux](https://docs.docker.com/engine/installation/#supported-platforms), and [Windows](https://docs.docker.com/docker-for-windows/). On Windows, Docker must be configured to support Linux containers. Docker containers can also be deployed directly to [Azure Kubernetes Service](/azure/aks/) or [Azure Container Instances](/azure/container-instances/).

Docker must be configured to allow the containers to connect with and send billing data to Azure.

**Familiarity with Microsoft Container Registry and Docker**: You should have a basic understanding of both Microsoft Container Registry and Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.  

For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).

Individual containers can have their own requirements, as well, including server and memory allocation requirements.

## Next steps

Install and explore the functionality provided by containers in Azure Cognitive Services:

* [Install and use Computer Vision containers](Computer-vision/computer-vision-how-to-install-containers.md)
* [Install and use Face containers](Face/face-how-to-install-containers.md)
* [Install and use Text Analytics containers](text-analytics/how-tos/text-analytics-how-to-install-containers.md)