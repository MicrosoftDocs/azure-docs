---
title: "Azure AI services products and pricing"
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-services
ms.topic: include
ms.date: 10/28/2021
ms.author: pafarley
---

The following tables provide information about products and pricing for Azure AI services.

#### Multi-service

| Service     | Kind    |
|-------------|------------|
| Multiple services. For more information, see the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) page.            | `CognitiveServices`     |

#### Vision

| Service    | Kind    |
|------------|---------|
| Vision            | `ComputerVision`          |
| Custom Vision - Prediction | `CustomVision.Prediction` |
| Custom Vision - Training   | `CustomVision.Training`   |
| Face                       | `Face`                    |
| Document Intelligence            | `FormRecognizer`          |

#### Speech

| Service            | Kind                 |
|--------------------|----------------------|
| Speech    | `SpeechServices`     |

#### Language

| Service            | Kind                |
|--------------------|---------------------|
| Language Understanding (LUIS)               | `LUIS`              |
| QnA Maker          | `QnAMaker`          |
| Language   | `TextAnalytics`     |
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

Pricing tiers (and the amount you're billed) are based on the number of transactions that you send by using your authentication information. Each pricing tier specifies the:

* Maximum number of allowed transactions per second (TPS).
* Service features enabled within the pricing tier.
* Cost for a predefined number of transactions. Going above this number will cause an extra charge, as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for your service.

> [!NOTE]
> Many of the Azure AI services have a free tier that you can use to try the service. To use the free tier, use `F0` as the pricing tier for your resource.
