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

In this article, you learn about which regions are available for each of the models supporting serverless API endpoint deployments.

Certain models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

## Region availability

Pay-as-you-go billing is available only to users whose Azure subscription belongs to a billing account in a country where the model provider has made the offer available (see "offer availability region" in the table in the next section). If the offer is available in the relevant region, the user then must have a Hub/Project in the Azure region where the model is available for deployment or fine-tuning, as applicable (see "Hub/Project Region" columns in the following tables).

### Cohere models


|Model   |Offer Availability Region  | Hub/Project Region for Deployment  | Hub/Project Region for Fine tuning  |
|---------|---------|---------|---------|
Cohere Command R      | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) <br> Japan <br> Qatar     | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3       | Not available        |
Cohere Command R+     |  [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) <br> Japan <br> Qatar  |East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3  | Not available        |
Cohere Rerank 3 - English   |  [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) <br> Japan <br> Qatar  | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3   | Not available       |
Cohere Rerank 3 - Multilingual   |  [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) <br> Japan <br> Qatar  | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3   | Not available       |
Cohere Embed 3 - English    |  [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) <br> Japan <br> Qatar   |East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3    | Not available       |
Cohere Embed 3 -  Multilingual    |  [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) <br> Japan <br> Qatar   |East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3    | Not available       |


### JAIS models

|Model  |Offer Availability Region  | Hub/Project Region for Deployment  | Hub/Project Region for Fine tuning  |
|---------|---------|---------|---------|
JAIS 30B Chat   |   [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions) <br> Egypt    | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3   | Not available       |

### Meta Llama models

|Model  |Offer Availability Region  | Hub/Project Region for Deployment  | Hub/Project Region for Fine tuning  |
|---------|---------|---------|---------|
Llama 2 7B <br> Llama 2 13B <br> Llama 2 70B     |   [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)     | East US <br> East US 2 <br> North Central US <br> South Central US <br> West US <br> West US 3    | West US 3       |
Llama 2 7B Chat <br> Llama 2 7B Chat <br> Llama 2 70B Chat    | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)    | East US <br> East US 2 <br> North Central US <br> South Central US <br> West US <br> West US 3   | West US 3   |
Llama 3 8B Instruct   | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)    | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3   | Not available   |
Llama 3 70B Instruct     | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)    | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3    | Not available  |
Llama 3.1 8B Instruct  | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)    | East US <br> East US 2 <br> North Central US <br> South Central US <br> West US <br> West US 3     | West US 3  |
Llama 3.1 70B Instruct  | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)    | East US <br> East US 2 <br> North Central US <br> South Central US <br> West US <br> West US 3     | West US 3  |
Llama 3.1 405B Instruct  | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)    | East US <br> East US 2 <br> North Central US <br> South Central US <br> West US <br> West US 3     | Not available  |


### Microsoft Phi-3 models

|Model  |Offer Availability Region  | Hub/Project Region for Deployment  | Hub/Project Region for Fine tuning  |
|---------|---------|---------|---------|
Phi-3-Mini-4k-Instruct    | Not applicable | East US 2 <br> Sweden Central  | East US 2  |
Phi-3-Mini-128K-Instruct     | Not applicable | East US 2 <br> Sweden Central  | East US 2    |
Phi-3-Small-8K-Instruct     | Not applicable | East US 2 <br> Sweden Central  | Not available       |
Phi-3-Small-128K-Instruct     | Not applicable | East US 2 <br> Sweden Central  | Not available      |
Phi-3-Medium-4K-Instruct     | Not applicable | East US 2 <br> Sweden Central  | East US 2      |
Phi-3-Medium-128K-Instruct   | Not applicable | East US 2 <br> Sweden Central  | East US 2       |

### Mistral models

|Model  |Offer Availability Region  | Hub/Project Region for Deployment  | Hub/Project Region for Fine tuning  |
|---------|---------|---------|---------|
Mistral Nemo     | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)  <br> Brazil <br> Hong Kong <br> Israel     | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3           | Not available       |
Mistral Small     | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)   <br> Brazil <br> Hong Kong <br> Israel      | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3           |  Not available       |
Mistral Large (2402)     | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)  <br> Brazil <br> Hong Kong <br> Israel    | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3           | Not available       |
Mistral-Large (2407)     | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)   <br> Brazil <br> Hong Kong <br> Israel   | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3           | Not available       |


### Nixtla models

|Model  |Offer Availability Region  | Hub/Project Region for Deployment  | Hub/Project Region for Fine tuning  |
|---------|---------|---------|---------|
TimeGEN-1     | [Microsoft Managed Countries](/partner-center/marketplace/tax-details-marketplace#microsoft-managed-countriesregions)  <br> Mexico <br> Israel  | East US <br> East US 2 <br> North Central US <br> South Central US <br> Sweden Central <br> West US <br> West US 3        |  Not available       |

## Alternatives to region availability

If most of your infrastructure is in a particular region and you want to take advantage of models available only as serverless API endpoints, you can create a hub or project on the supported region and then consume the endpoint from another region. 

Read [Consume serverless API endpoints from a different hub or project](deploy-models-serverless-connect.md) to learn how to configure an existing serverless API endpoint in a different hub or project than the one where it was deployed.

## Related content

- [Model Catalog and Collections](model-catalog.md)
- [Deploy models as serverless API endpoints](deploy-models-serverless.md)


