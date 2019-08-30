---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 06/24/2019
ms.author: aahi
---

## Azure Cognitive Service resource types

[comment]: <> > [!NOTE]
[comment]: <> > Subscription owners can disable the creation of Cognitive Services resources for resource groups and subscriptions by applying [Azure policy](https://docs.microsoft.com/azure/governance/policy/overview#policy-definition), assigning a “Not allowed resource types” policy definition, and specifying **Microsoft.CognitiveServices/accounts** as the target resource type.

You can access Azure Cognitive Services through two different resources: A multi-service resource, or a single-service one. These subscriptions let you connect to either a single service or multiple services at once.

### Multi-service resource

Subscribing to a multi-service Cognitive Services resource:
* Lets you use a single Azure resource for most Azure Cognitive Services.
* You obtain a single key that can be used with multiple Azure Cognitive Services.
* Consolidates billing from the services you use. See [Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) for additional information.

>[!WARNING]
> At this time, these services **don't** support multi-service keys: QnA Maker, Speech Services, Custom Vision, and Anomaly Detector.

### Single-service resource

Subscribing to a single-service Cognitive Services resource:
* Lets you use a specified cognitive service you create the resource for (such as Computer Vision or Speech Services).
*  You obtain a key that is specific to the cognitive service you create a resource for.