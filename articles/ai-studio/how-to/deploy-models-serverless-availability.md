---
title: Region availability for models in Serverless API endpoints
titleSuffix: Azure AI Studio
description: Learn about the regions where each model is available for deployment in serverless API endpoints via Azure AI Studio.
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

# Region availability for models in serverless API endpoints

In this article, you learn about which regions are available for each of the models supporting serverless API endpoint deployments.

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

## Region availability

Pay-as-you-go billing is available only to users whose Azure subscription belongs to a billing account in a country where the model provider has made the offer available (see "offer availability region" in the table in the next section). If the offer is available in the relevant region, the user then must have a Hub/Project in the Azure region where the model is available for deployment or fine-tuning, as applicable (see "Hub/Project Region" columns in the following tables).

[!INCLUDE [region-availability-maas](../includes/region-availability-maas.md)]


## Alternatives to region availability

If most of your infrastructure is in a particular region and you want to take advantage of models available only as serverless API endpoints, you can create a hub or project on the supported region and then consume the endpoint from another region. 

Read [Consume serverless API endpoints from a different hub or project](deploy-models-serverless-connect.md) to learn how to configure an existing serverless API endpoint in a different hub or project than the one where it was deployed.

## Related content

- [Model Catalog and Collections](model-catalog.md)
- [Deploy models as serverless API endpoints](deploy-models-serverless.md)


