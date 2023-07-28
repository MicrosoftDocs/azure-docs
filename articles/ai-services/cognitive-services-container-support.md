---
title: Use Azure AI services containers on-premises
titleSuffix: Azure AI services
description: Learn how to use Docker containers to use Azure AI services on-premises.
services: cognitive-services
author: aahill
manager: nitinme
ms.custom: cog-serv-seo-aug-2020, ignite-fall-2021
ms.service: cognitive-services
ms.topic: overview
ms.date: 07/21/2023
ms.author: aahi
keywords: on-premises, Docker, container, Kubernetes
#Customer intent: As a potential customer, I want to know more about how Azure AI services provides and supports Docker containers for each service.
---

# What are Azure AI services containers?

Azure AI services provides several [Docker containers](https://www.docker.com/what-container) that let you use the same APIs that are available in Azure, on-premises. Using these containers gives you the flexibility to bring Azure AI services closer to your data for compliance, security or other operational reasons. Container support is currently available for a subset of Azure AI services.

> [!VIDEO https://www.youtube.com/embed/hdfbn4Q8jbo]

Containerization is an approach to software distribution in which an application or service, including its dependencies & configuration, is packaged together as a container image. With little or no modification, a container image can be deployed on a container host. Containers are isolated from each other and the underlying operating system, with a smaller footprint than a virtual machine. Containers can be instantiated from container images for short-term tasks, and removed when no longer needed.

## Features and benefits

- **Immutable infrastructure**: Enable DevOps teams to leverage a consistent and reliable set of known system parameters, while being able to adapt to change. Containers provide the flexibility to pivot within a predictable ecosystem and avoid configuration drift.
- **Control over data**: Choose where your data gets processed by Azure AI services. This can be essential if you can't send data to the cloud but need access to Azure AI services APIs. Support consistency in hybrid environments – across data, management, identity, and security.
- **Control over model updates**: Flexibility in versioning and updating of models deployed in their solutions.
- **Portable architecture**: Enables the creation of a portable application architecture that can be deployed on Azure, on-premises and the edge. Containers can be deployed directly to [Azure Kubernetes Service](../aks/index.yml), [Azure Container Instances](../container-instances/index.yml), or to a [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure-stack/operator). For more information, see [Deploy Kubernetes to Azure Stack](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).
- **High throughput / low latency**: Provide customers the ability to scale for high throughput and low latency requirements by enabling Azure AI services to run physically close to their application logic and data. Containers don't cap transactions per second (TPS) and can be made to scale both up and out to handle demand if you provide the necessary hardware resources.
- **Scalability**: With the ever growing popularity of containerization and container orchestration software, such as Kubernetes; scalability is at the forefront of technological advancements. Building on a scalable cluster foundation, application development caters to high availability.

## Containers in Azure AI services

Azure AI services containers provide the following set of Docker containers, each of which contains a subset of functionality from services in Azure AI services. You can find instructions and image locations in the tables below.

> [!NOTE]
> See [Install and run Document Intelligence containers](document-intelligence/containers/install-run.md) for **Azure AI Document Intelligence** container instructions and image locations.

### Decision containers

| Service |  Container | Description | Availability |
|--|--|--|--|
| [Anomaly detector][ad-containers] | **Anomaly Detector** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/decision/anomaly-detector/about))  | The Anomaly Detector API enables you to monitor and detect abnormalities in your time series data with machine learning. | Generally available |

### Language containers

| Service |  Container | Description | Availability |
|--|--|--|--|
| [LUIS][lu-containers] |  **LUIS** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/language/luis/about)) | Loads a trained or published Language Understanding model, also known as a LUIS app, into a docker container and provides access to the query predictions from the container's API endpoints. You can collect query logs from the container and upload these back to the [LUIS portal](https://www.luis.ai) to improve the app's prediction accuracy. | Generally available. <br> This container can also [run in disconnected environments](containers/disconnected-containers.md). |
| [Language service][ta-containers-keyphrase] | **Key Phrase Extraction** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/keyphrase/about)) | Extracts key phrases to identify the main points. For example, for the input text "The food was delicious and there were wonderful staff", the API returns the main talking points: "food" and "wonderful staff". | Generally available. <br> This container can also [run in disconnected environments](containers/disconnected-containers.md). |
| [Language service][ta-containers-language] |  **Text Language Detection** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/language/about)) | For up to 120 languages, detects which language the input text is written in and report a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the score. | Generally available. <br> This container can also [run in disconnected environments](containers/disconnected-containers.md). |
| [Language service][ta-containers-sentiment] | **Sentiment Analysis** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/sentiment/about)) | Analyzes raw text for clues about positive or negative sentiment. This version of sentiment analysis returns sentiment labels (for example *positive* or *negative*) for each document and sentence within it. |  Generally available. <br> This container can also [run in disconnected environments](containers/disconnected-containers.md). |
| [Language service][ta-containers-health] |  **Text Analytics for health** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/healthcare/about))| Extract and label medical information from unstructured clinical text. | Generally available |
| [Language service][ta-containers-cner] |  **Custom Named Entity Recognition** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/textanalytics/customner/about))| Extract named entities from text, using a custom model you create using your data. | Preview |
| [Translator][tr-containers] | **Translator** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/translator/text-translation/about))| Translate text in several languages and dialects. | Generally available. Gated - [request access](https://aka.ms/csgate-translator). <br>This container can also [run in disconnected environments](containers/disconnected-containers.md). | 

### Speech containers

> [!NOTE]
> To use Speech containers, you will need to complete an [online request form](https://aka.ms/csgate).

| Service |  Container | Description | Availability |
|--|--|--|--|
| [Speech Service API][sp-containers-stt] |  **Speech to text** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/speech-to-text/about)) | Transcribes continuous real-time speech into text. | Generally available. <br> This container can also [run in disconnected environments](containers/disconnected-containers.md). |
| [Speech Service API][sp-containers-cstt] | **Custom Speech to text** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/custom-speech-to-text/about)) | Transcribes continuous real-time speech into text using a custom model. | Generally available <br> This container can also [run in disconnected environments](containers/disconnected-containers.md). |
| [Speech Service API][sp-containers-ntts] | **Neural Text to speech** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/neural-text-to-speech/about)) | Converts text to natural-sounding speech using deep neural network technology, allowing for more natural synthesized speech. | Generally available. <br> This container can also [run in disconnected environments](containers/disconnected-containers.md). |
| [Speech Service API][sp-containers-lid] | **Speech language detection** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/language-detection/about)) | Determines the language of spoken audio. | Gated preview |

### Vision containers


| Service |  Container | Description | Availability |
|--|--|--|--|
| [Azure AI Vision][cv-containers] | **Read OCR** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/vision/read/about)) | The Read OCR container allows you to extract printed and handwritten text from images and documents with support for JPEG, PNG, BMP, PDF, and TIFF file formats. For more information, see the [Read API documentation](./computer-vision/overview-ocr.md). | Generally Available. Gated - [request access](https://aka.ms/csgate). <br>This container can also [run in disconnected environments](containers/disconnected-containers.md). |
| [Spatial Analysis][spa-containers] | **Spatial analysis** ([image](https://mcr.microsoft.com/product/azure-cognitive-services/vision/spatial-analysis/about)) | Analyzes real-time streaming video to understand spatial relationships between people, their movement, and interactions with objects in physical environments. | Preview |

<!--
|[Personalizer](./personalizer/what-is-personalizer.md) |F0, S0|**Personalizer** ([image](https://go.microsoft.com/fwlink/?linkid=2083928&clcid=0x409))|Azure AI Personalizer is a cloud-based API service that allows you to choose the best experience to show to your users, learning from their real-time behavior.|
-->

Additionally, some containers are supported in the Azure AI services [multi-service resource](multi-service-resource.md?pivots=azportal) offering. You can create one single Azure AI services All-In-One resource and use the same billing key across supported services for the following services:

* Azure AI Vision
* LUIS
* Language service

## Prerequisites

You must satisfy the following prerequisites before using Azure AI services containers:

**Docker Engine**: You must have Docker Engine installed locally. Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Linux](https://docs.docker.com/engine/installation/#supported-platforms), and [Windows](https://docs.docker.com/docker-for-windows/). On Windows, Docker must be configured to support Linux containers. Docker containers can also be deployed directly to [Azure Kubernetes Service](../aks/index.yml) or [Azure Container Instances](../container-instances/index.yml).

Docker must be configured to allow the containers to connect with and send billing data to Azure.

**Familiarity with Microsoft Container Registry and Docker**: You should have a basic understanding of both Microsoft Container Registry and Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.

For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).

Individual containers can have their own requirements, as well, including server and memory allocation requirements.

[!INCLUDE [Azure AI container security](containers/includes/cognitive-services-container-security.md)]

## Developer samples

Developer samples are available at our [GitHub repository](https://github.com/Azure-Samples/cognitive-services-containers-samples).

## Next steps

Learn about [container recipes](containers/container-reuse-recipe.md) you can use with the Azure AI services.

Install and explore the functionality provided by containers in Azure AI services:

* [Anomaly Detector containers][ad-containers]
* [Azure AI Vision containers][cv-containers]
* [Language Understanding (LUIS) containers][lu-containers]
* [Speech Service API containers][sp-containers]
* [Language service containers][ta-containers]
* [Translator containers][tr-containers]

<!--* [Personalizer containers](https://go.microsoft.com/fwlink/?linkid=2083928&clcid=0x409)
-->

[ad-containers]: anomaly-Detector/anomaly-detector-container-howto.md
[cv-containers]: computer-vision/computer-vision-how-to-install-containers.md
[lu-containers]: luis/luis-container-howto.md
[sp-containers]: speech-service/speech-container-howto.md
[spa-containers]: ./computer-vision/spatial-analysis-container.md
[sp-containers-lid]: speech-service/speech-container-lid.md
[sp-containers-stt]: speech-service/speech-container-stt.md
[sp-containers-cstt]: speech-service/speech-container-cstt.md
[sp-containers-ntts]: speech-service/speech-container-ntts.md
[ta-containers]: language-service/overview.md#deploy-on-premises-using-docker-containers
[ta-containers-keyphrase]: language-service/key-phrase-extraction/how-to/use-containers.md
[ta-containers-language]: language-service/language-detection/how-to/use-containers.md
[ta-containers-sentiment]: language-service/sentiment-opinion-mining/how-to/use-containers.md
[ta-containers-health]: language-service/text-analytics-for-health/how-to/use-containers.md
[ta-containers-cner]: language-service/custom-named-entity-recognition/how-to/use-containers.md
[tr-containers]: translator/containers/translator-how-to-install-container.md
[request-access]: https://aka.ms/csgate
