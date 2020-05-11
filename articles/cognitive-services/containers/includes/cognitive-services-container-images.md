---
title: Container repositories and images
services: cognitive-services
author: aahill
manager: nitinme
description: Two tables representing the container registries, repositories and image names for all Cognitive Service offerings.
ms.service: cognitive-services
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

### Container repositories and images

The tables below are a listing of the available container images offered by Azure Cognitive Services. For a complete list of all the available container image names and their available tags, see [Cognitive Services container image tags](../container-image-tags.md). Currently, there are no Cognitive Services containers that are generally available (GA). For the time being, until further announcements are made -- containers are available as either *Public Ungated* or *Public Gated Preview*.

 - *Public Ungated*: containers are available publicly without a gating mechanism.
 - *Public Gated Preview*: containers are available publicly, but first require formal request to access the container registry.

#### Public "Ungated" (container registry: `mcr.microsoft.com`)

The Microsoft Container Registry (MCR) syndicates all of the publicly available "ungated" containers for Cognitive Services. The containers are also available directly from the [Docker hub](https://hub.docker.com/_/microsoft-azure-cognitive-services).

| Service | Container | Container Registry / Repository / Image Name |
|--|--|--|
| [LUIS](../../LUIS/luis-container-howto.md) | LUIS | `mcr.microsoft.com/azure-cogni'ive-services/luis` |
| [Text Analytics](../../text-analytics/how-tos/text-analytics-how-to-install-containers.md) | Key Phrase Extraction | `mcr.microsoft.com/azure-cognitive-services/keyphrase` |
| [Text Analytics](../../text-analytics/how-tos/text-analytics-how-to-install-containers.md) | Language Detection | `mcr.microsoft.com/azure-cognitive-services/language` |
| [Text Analytics](../../text-analytics/how-tos/text-analytics-how-to-install-containers.md) | Sentiment Analysis | `mcr.microsoft.com/azure-cognitive-services/sentiment` |

#### Public "Gated" Preview (container registry: `containerpreview.azurecr.io`)

The Container Preview registry hosts all of the publicly available "gated" containers for Cognitive Services. These containers require a formal request for access them via their container registry.

| Service | Container | Container Registry / Repository / Image Name |
|--|--|--|
| [Anomaly detector](../../anomaly-detector/anomaly-detector-container-howto.md) | Anomaly Detector | `containerpreview.azurecr.io/microsoft/cognitive-services-anomaly-detector` |
| [Computer Vision](../../Computer-vision/computer-vision-how-to-install-containers.md) | Read | `containerpreview.azurecr.io/microsoft/cognitive-services-read` |
| [Face](../../face/face-how-to-install-containers.md) | Face | `containerpreview.azurecr.io/microsoft/cognitive-services-face` |
| [Form recognizer](https://go.microsoft.com/fwlink/?linkid=2083826&clcid=0x409) | Form Recognizer | `containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer` |
| [Speech Service API](../../speech-service/speech-container-howto.md?tab=stt) | Speech-to-text | `containerpreview.azurecr.io/microsoft/cognitive-services-speech-to-text` |
| [Speech Service API](../../speech-service/speech-container-howto.md?tab=cstt) | Custom Speech-to-text | `containerpreview.azurecr.io/microsoft/cognitive-services-custom-speech-to-text` |
| [Speech Service API](../../speech-service/speech-container-howto.md?tab=tts) | Text-to-speech | `containerpreview.azurecr.io/microsoft/cognitive-services-text-to-speech` |
| [Speech Service API](../../speech-service/speech-container-howto.md?tab=ctts) | Custom Text-to-speech | `containerpreview.azurecr.io/microsoft/cognitive-services-custom-text-to-speech` |
