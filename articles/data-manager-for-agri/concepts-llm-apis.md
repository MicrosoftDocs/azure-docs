---
title: Generative AI in Azure Data Manager for Agriculture
description: Learn how to use generative AI features in Azure Data Manager for Agriculture. 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 3/19/2024
ms.custom: template-concept
---

# Generative AI in Azure Data Manager for Agriculture

Microsoft copilot templates empower organizations to build agriculture copilots. Our copilot templates enable seamless retrieval of data stored in Azure Data Manager for Agriculture so that farming-related context and insights can be queried in a conversational context. 

Many customers have proprietary data outside Azure Data Manager for Agriculture; for example, agronomy PDFs or market price data. These customers can benefit from an orchestration framework that allows for plugins, embedded data structures, and subprocesses to be selected as part of the query flow.

Customers who have farm operations data in Azure Data Manager for Agriculture can use plugins that enable seamless selection of APIs mapped to farm operations. These plugins allow for a combination of results, calculation of area, ranking, and summarizing to help serve customer prompts.

Customers and partners can deliver insights to users around disease, yield, harvest windows, and more, by using actual planning and observational data. Although Azure Data Manager for Agriculture isn't required to operationalize copilot templates for agriculture, it enables customers to more easily integrate generative AI scenarios for their users.

Our copilot templates make generative AI in agriculture a reality.

> [!NOTE]
> Azure might include preview, beta, or other prerelease features, services, software, or regions offered by Microsoft for optional evaluation. Previews are licensed to you as part of [your agreement](https://azure.microsoft.com/support) governing the use of Azure, and are subject to terms applicable to previews.
>
> The preview of Azure Data Manager for Agriculture and related Microsoft generative AI services are subject to [additional terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). These additional terms supplement your agreement governing your use of Azure. If you don't agree to these terms, don't use the previews.

## Prerequisites

- An instance of [Azure Data Manager for Agriculture](quickstart-install-data-manager-for-agriculture.md)
- An instance of [Azure OpenAI Service](../ai-services/openai/how-to/create-resource.md) created in your Azure subscription
- [Azure Key Vault](../key-vault/general/quick-create-portal.md)
- [Azure Container Registry](../container-registry/container-registry-get-started-portal.md)

## High-level architecture

You have full control because deployment of key components is within your tenant. The copilot templates for agriculture are available via a Docker container, which is deployed to your Azure App Service instance.

:::image type="content" source="./media/concepts-llm-apis/high-level-architecture.png" alt-text="Screenshot that shows the high-level feature architecture.":::

We recommend that you apply content and safety filters on your Azure OpenAI instance. Taking this step helps ensure that the generative AI capability is aligned with guidelines from Microsoft's Office of Responsible AI. To get started, follow the [instructions on how to use content filters with Azure OpenAI](../ai-services/openai/how-to/content-filters.md).

## Use cases for farm operations

Azure Data Manager for Agriculture supports seamless selection of APIs mapped to farm operations. This support enables use cases that are based on tillage, planting, applications, and harvesting types of farm operations. Here's a sample list of queries that you can test and use:

- Show me active fields
- What crop was planted in my field (use field name)
- Tell me the application details for my field (use field name)
- Give me a list of all fields with planting dates
- Give me a list of all fields with application dates
- What is the delta between planted and harvested fields
- Which farms were harvested
- What is the area of harvested fields
- Convert area to acres/hectares
- What is the average yield for my field (use field name) with crop (use crop name)
- What is the effect of planting dates on yield for crop (use crop name)

These use cases can help input providers to plan equipment, seeds, applications, and related services and engage better with the farmer.

## Next steps

- Fill in [this onboarding form](https://forms.office.com/r/W4X381q2rd) to get started with testing the copilot templates feature.
- Test the [Azure Data Manager for Agriculture REST APIs](/rest/api/data-manager-for-agri).
