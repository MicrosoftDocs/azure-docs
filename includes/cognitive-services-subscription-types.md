---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 06/24/2019
ms.author: aahi
---

## Azure Cognitive Service subscription types

> [!NOTE]
> Subscription owners can disable the creation of Cognitive Services accounts for resource groups and subscriptions by applying [Azure policy](https://docs.microsoft.com/azure/governance/policy/overview#policy-definition), assigning a “Not allowed resource types” policy definition, and specifying **Microsoft.CognitiveServices/accounts** as the target resource type.

You can access Azure Cognitive Services through two different subscriptions: A multi-service subscription, or a single-service one. These subscriptions let you connect to either a single service or multiple services at once.

### Multi-service subscription

>[!WARNING]
> At this time, these services **don't** support multi-service keys: QnA Maker, Speech Services, Custom Vision, and Anomaly Detector.

A multi-service subscription for Azure Cognitive Services lets you use a single subscription and Azure resource for most of the Azure Cognitive Services, and consolidates billing from the services you use. See [Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) for additional information.

### Single-service subscription

A subscription to a single service, such as Computer Vision or the Speech Services. A single-service subscription is restricted to that resource. 
