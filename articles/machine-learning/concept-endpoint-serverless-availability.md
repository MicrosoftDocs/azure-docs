---
title: Region availability for models in Serverless API endpoints
titleSuffix: Azure Machine Learning
description: Learn about the regions where each model is available for deployment in serverless API endpoints.
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 05/09/2024
ms.reviewer: mopeakande
reviewer: msakande
ms.author: fasantia
author: santiagxf
ms.custom: 
 - build-2024
 - serverless
 - references_regions
---

# Region availability for models in serverless API endpoints | Azure Machine Learning

In this article, you learn about which regions are available for each of the models supporting serverless API endpoint deployments.

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

## Region availability

[!INCLUDE [region-availabilitity-serverless-api](../ai-studio/includes/region-availabilitity-serverless-api.md)]

> [!NOTE]
> Models offered through the Azure Marketplace are available for purchase only on [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions), with exception of Cohere family of models, which is also available in Japan.

## Alternatives to region availability

If most of your infrastructure is in a particular region and you want to take advantage of models available only as serverless API endpoints, you can create a workspace on the supported region and then consume the endpoint from another region. 

Read [Consume serverless API endpoints from a different workspace](how-to-connect-models-serverless.md) to learn how to configure an existing serverless API endpoint in a different workspace than the one where it was deployed.

## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy models as serverless API endpoints](how-to-deploy-models-serverless.md)


