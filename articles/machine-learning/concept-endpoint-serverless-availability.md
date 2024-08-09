---
title: Region availability for models in Serverless API endpoints
titleSuffix: Azure Machine Learning
description: Learn about the regions where each model is available for deployment in serverless API endpoints.
manager: scottpolly
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 05/09/2024
ms.reviewer: None
ms.author: mopeakande
author: msakande
ms.custom: 
 - build-2024
 - serverless
 - references_regions
---

# Region availability for models in serverless API endpoints | Azure Machine Learning

In this article, you learn about which regions are available for each of the models supporting serverless API endpoint deployments.

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

## Region availability

Pay-as-you-go billing is available only to users whose Azure subscription belongs to a billing account in a country where the model provider has made the offer available (see "offer availability region" in the table in the next section). If the offer is available in the relevant region, the user then must have a Hub/Project in the Azure region where the model is available for deployment or fine-tuning, as applicable (see "Hub/Project Region" columns in the following tables).

[!INCLUDE [region-availability-maas](../ai-studio/includes/region-availability-maas.md)]


## Alternatives to region availability

If most of your infrastructure is in a particular region and you want to take advantage of models available only as serverless API endpoints, you can create a workspace on the supported region and then consume the endpoint from another region. 

Read [Consume serverless API endpoints from a different workspace](how-to-connect-models-serverless.md) to learn how to configure an existing serverless API endpoint in a different workspace than the one where it was deployed.

## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy models as serverless API endpoints](how-to-deploy-models-serverless.md)


