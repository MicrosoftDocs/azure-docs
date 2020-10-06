---
title: Container repositories and images
services: cognitive-services
author: aahill
manager: nitinme
description: Two tables representing the container registries, repositories and image names for all Cognitive Service offerings.
ms.service: cognitive-services
ms.topic: include
ms.date: 09/03/2020
ms.author: aahi
---

### Container repositories and images

The tables below are a listing of the available container images offered by Azure Cognitive Services. For a complete list of all the available container image names and their available tags, see [Cognitive Services container image tags](../container-image-tags.md). 

#### Generally available 

The Microsoft Container Registry (MCR) syndicates all of the generally available containers for Cognitive Services. The containers are also available directly from the [Docker hub](https://hub.docker.com/_/microsoft-azure-cognitive-services).

**LUIS**

| Container | Container Registry / Repository / Image Name |
|--|--|
| LUIS | `mcr.microsoft.com/azure-cognitive-services/language/luis` |

See [How to run and install LUIS containers](../../LUIS/luis-container-howto.md) for more information.

**Text Analytics**

| Container | Container Registry / Repository / Image Name |
|--|--|
| Sentiment Analysis v3 (English) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-en` |
| Sentiment Analysis v3 (Spanish) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-es` |
| Sentiment Analysis v3 (French) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-fr` |
| Sentiment Analysis v3 (Italian) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-it` |
| Sentiment Analysis v3 (German) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-de` |
| Sentiment Analysis v3 (Chinese - simplified) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-zh` |
| Sentiment Analysis v3 (Chinese - traditional) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-zht` |
| Sentiment Analysis v3 (Japanese) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-ja` |
| Sentiment Analysis v3 (Portuguese) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-pt` |
| Sentiment Analysis v3 (Dutch) | `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment:3.0-nl` |

See [How to run and install Text Analytics containers](../../text-analytics/how-tos/text-analytics-how-to-install-containers.md) for more information.

**Anomaly Detector** 

| Container | Container Registry / Repository / Image Name |
|--|--|
| Anomaly detector | `mcr.microsoft.com/azure-cognitive-services/decision/anomaly-detector` |

See [How to run and install Anomaly detector containers](../../anomaly-detector/anomaly-detector-container-howto.md) for more information.

**Speech Service**

> [!NOTE]
> To use Speech containers, you will need to complete an [online request form](https://aka.ms/csgate).

| Container | Container Registry / Repository / Image Name |
|--|--|
| [Speech-to-text](../../speech-service/speech-container-howto.md?tab=stt) | `mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text` |
| [Custom Speech-to-text](../../speech-service/speech-container-howto.md?tab=cstt) | `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text` |
| [Text-to-speech](../../speech-service/speech-container-howto.md?tab=tts) | `mcr.microsoft.com/azure-cognitive-services/speechservices/text-to-speech` |

#### "Ungated" preview 

The following preview containers are available publicly. The Microsoft Container Registry (MCR) syndicates all of the publicly available ungated containers for Cognitive Services. The containers are also available directly from the [Docker hub](https://hub.docker.com/_/microsoft-azure-cognitive-services).

| Service | Container | Container Registry / Repository / Image Name |
|--|--|--|
| [Text Analytics](../../text-analytics/how-tos/text-analytics-how-to-install-containers.md) | Key Phrase Extraction | `mcr.microsoft.com/azure-cognitive-services/textanalytics/keyphrase` |
| [Text Analytics](../../text-analytics/how-tos/text-analytics-how-to-install-containers.md) | Language Detection | `mcr.microsoft.com/azure-cognitive-services/textanalytics/language` |


#### "Gated" preview

Previously, gated preview containers were hosted on the `containerpreview.azurecr.io` repository. Starting September 22nd 2020, these containers (except Text Analytics for health) are hosted on the Microsoft Container Registry (MCR), and downloading them doesn't require using the docker login command. To use the container you will need to:

1. Complete a [request form](https://aka.ms/csgate) with your Azure Subscription ID and user scenario. 
2. Upon approval, download the container from the MCR. 
3. Use the key and endpoint from an appropriate Azure resource to authenticate the container at runtime. 

| Service | Container | Container Registry / Repository / Image Name |
|--|--|--|
| [Computer Vision](../../Computer-vision/computer-vision-how-to-install-containers.md) | Read v3.0 | `mcr.microsoft.com/azure-cognitive-services/vision/read:3.0-preview` |
| [Computer Vision](../../Computer-vision/computer-vision-how-to-install-containers.md) | Read v3.1 | `mcr.microsoft.com/azure-cognitive-services/vision/read:3.1-preview` |
| [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/spatial-analysis-container) | Spatial Analysis | `mcr.microsoft.com/azure-cognitive-services/vision/spatial-analysis` |
| [Speech Service API](../../speech-service/speech-container-howto.md?tab=ctts) | Custom Text-to-speech | `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-text-to-speech` |
| [Speech Service API](../../speech-service/speech-container-howto.md?tab=lid) | Language Detection | `mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection` |
| [Speech Service API](../../speech-service/speech-container-howto.md?tab=ntts) | Neural Text-to-speech | `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech` |
| [Text Analytics for health](../../text-analytics/how-tos/text-analytics-how-to-install-containers.md?tabs=health) | Text Analytics for health | `containerpreview.azurecr.io/microsoft/cognitive-services-healthcare` |

