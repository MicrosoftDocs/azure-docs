---
title: Azure AI Studio feature availability across clouds regions
titleSuffix: Azure AI Studio
description: This article lists Azure AI Studio feature availability across clouds regions.
manager: nitinme
ms.service: azure-ai-studio
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: deeikele
ms.author: eur
author: eric-urban
ms.custom: references_regions, build-2024
---

# Azure AI Studio feature availability across clouds regions

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Azure AI Studio brings together various Azure AI capabilities that previously were only available as standalone Azure services. While we strive to make all features available in all regions where Azure AI Studio is supported at the same time, feature availability may vary by region. In this article, you'll learn what Azure AI Studio features are available across cloud regions.  

## Azure Public regions

Azure AI Studio is currently available in preview in the following Azure regions. You can create [Azure AI Studio hubs](../how-to/create-azure-ai-resource.md) and Azure AI Studio projects in these regions.

- Australia East
- Brazil South
- Canada Central
- East US
- East US 2
- France Central
- Germany West Central
- India South
- Japan East
- North Central US
- Norway East
- Poland Central
- South Africa North
- South Central US
- Sweden Central
- Switzerland North
- UK South
- West Europe
- West US
- West US 3

### Azure Government regions

Azure AI Studio preview is currently not available in Azure Government regions or air-gap regions.

## Azure OpenAI

[!INCLUDE [OpenAI Quotas](~/reusable-content/ce-skilling/azure/includes/ai-services/openai/includes/model-matrix/quota.md)]

> [!NOTE]
> Some models might not be available within the AI Studio model catalog.

For more information, see [Azure OpenAI quotas and limits](/azure/ai-services/openai/quotas-limits).

## Speech capabilities

Azure AI Speech capabilities including custom neural voice vary in regional availability due to underlying hardware availability. See [Speech service supported regions](../../ai-services/speech-service/regions.md) for an overview.

## Serverless API deployments

Some models in the model catalog can be deployed as a serverless API with pay-as-you-go billing. For information on the regions where each model is available, see [Region availability for models in Serverless API endpoints](../how-to/deploy-models-serverless-availability.md).

## Next steps

- See [Azure global infrastructure products by region](https://azure.microsoft.com/global-infrastructure/services/).
