---
title: "Azure AI services SKUs and pricing"
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-services
ms.topic: include
ms.date: 10/28/2021
ms.author: pafarley
---

See the list of SKUs and pricing information below. 

#### Multi-service

| Service     | Kind    |
|-------------|------------|
| Multiple services. For more information, see the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) page.            | `CognitiveServices`     |


#### Vision

| Service    | Kind    |
|------------|---------|
| Azure AI Vision            | `ComputerVision`          |
| Custom Vision - Prediction | `CustomVision.Prediction` |
| Custom Vision - Training   | `CustomVision.Training`   |
| Face                       | `Face`                    |
| Document Intelligence            | `FormRecognizer`          |

#### Speech

| Service            | Kind                 |
|--------------------|----------------------|
| Speech Services    | `SpeechServices`     |

#### Language

| Service            | Kind                |
|--------------------|---------------------|
| LUIS               | `LUIS`              |
| QnA Maker          | `QnAMaker`          |
| Language service   | `TextAnalytics`     |
| Text Translation   | `TextTranslation`   |

#### Decision

| Service           | Kind               |
|-------------------|--------------------|
| Anomaly Detector  | `AnomalyDetector`  |
| Content Moderator | `ContentModerator` |
| Personalizer      | `Personalizer`     |

#### Azure OpenAI

| Service           | Kind               |
|-------------------|--------------------|
| Azure OpenAI      | `OpenAI`           |

#### Pricing tiers and billing

Pricing tiers (and the amount you get billed) are based on the number of transactions you send using your authentication information. Each pricing tier specifies the:
* maximum number of allowed transactions per second (TPS).
* service features enabled within the pricing tier.
* cost for a predefined number of transactions. Going above this number will cause an extra charge as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for your service.

> [!NOTE]
> Many of the Azure AI services have a free tier you can use to try the service. To use the free tier, use `F0` as the SKU for your resource.
