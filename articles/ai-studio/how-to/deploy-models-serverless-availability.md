---
title: Region availability for models in Serverless API endpoints
titleSuffix: Azure AI Studio
description: Learn about the regions where each model is available for deployment in serverless API endpoints.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.author: mopeakande
author: msakande
ms.reviewer: fasantia
reviewer: santiagxf
ms.custom: 
 - build-2024
 - serverless
 - references_regions
---

# Region availability for models in serverless API endpoints | Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn about which regions are available for each of the models supporting serverless API endpoint deployments.

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

## Region availability

[!INCLUDE [region-availabilitity-serverless-api](../includes/region-availabilitity-serverless-api.md)]

## Alternatives to region availability

If most of your infrastructure is in a particular region and you want to take advantage of models available only as serverless API endpoints, you can create a hub or project on the supported region and then consume the endpoint from another region. 

Read [Consume serverless API endpoints from a different hub or project](deploy-models-serverless-connect.md) to learn how to configure an existing serverless API endpoint in a different hub or project than the one where it was deployed.

## Related content

- [Model Catalog and Collections](model-catalog.md)
- [Deploy models as serverless API endpoints](deploy-models-serverless.md)


