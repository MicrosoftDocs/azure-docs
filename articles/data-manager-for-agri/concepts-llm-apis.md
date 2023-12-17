---
title: Using LLM APIs in Azure Data Manager for Agriculture
description: Provides information on using natural language to query Azure Data Manager for Agriculture APIs 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 11/14/2023
ms.custom: template-concept
---

# About Azure Data Manager for Agriculture LLM APIs

Azure Data Manager for Agriculture brings together and transforms data to simplify the process of building digital agriculture and sustainability applications. With new large language model (LLM) APIs, others can develop copilots that turn data into insights on yield, labor needs, harvest windows and more—bringing generative AI to life in agriculture.

Our LLM capability enables seamless selection of APIs mapped to farm operations today. In the time to come we'll add the capability to select APIs mapped to soil sensors, weather, and imagery type of data. The skills in our LLM capability allow for a combination of results, calculation of area, ranking, summarizing to help serve customer prompts. Our B2B customers can take the context from our data manager, add their own knowledge base, and get summaries, insights and answers to their data questions through our data manager LLM plugin using natural language.

> [!NOTE]
>Azure might include preview, beta, or other pre-release features, services, software, or regions offered by Microsoft for optional evaluation ("Previews"). Previews are licensed to you as part of [**your agreement**](https://azure.microsoft.com/support) governing use of Azure, and subject to terms applicable to "Previews".
>
>The Azure Data Manager for Agriculture (Preview) and related Microsoft Generative AI Services Previews of Azure Data Manager for Agriculture are subject to additional terms set forth at [**Preview Terms Of Use | Microsoft Azure**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)
>
>These Previews are made available to you pursuant to these additional terms, which supplement your agreement governing your use of Azure. If you do not agree to these terms, do not use the Preview(s).

## Prerequisites
- An instance of [Azure Data Manager for Agriculture](quickstart-install-data-manager-for-agriculture.md)
- An instance of [Azure Open AI](../ai-services/openai/how-to/create-resource.md) created in your Azure subscription.
- You need [Azure Key Vault](../key-vault/general/quick-create-portal.md)
- You need [Azure Container Registry](../container-registry/container-registry-get-started-portal.md)

> [!TIP]
>To get started with testing our Azure Data Manager for Agriculture LLM Plugin APIs please fill in this onboarding [**form**](https://forms.office.com/r/W4X381q2rd). In case you need help then reach out to us at madma@microsoft.com.

## High level architecture 
The customer has full control as key component deployment is within the customer tenant.  Our feature is available to customers via a docker container, which needs to be deployed to the customers Azure App Service. 

:::image type="content" source="./media/concepts-llm-apis/high-level-architecture.png" alt-text="Screenshot showing high level feature architecture.":::

We recommend that you apply content and safety filters on your Azure OpenAI instance. Taking this step ensures that the LLM capability is aligned with guidelines from Microsoft’s Office of Responsible AI. Follow instructions on how to use content filters with Azure OpenAI service at this [link](../ai-services/openai/how-to/content-filters.md) to get started.

## Current uses cases

We support seamless selection of APIs mapped to farm operations today. This enables use cases that are based on tillage, planting, applications and harvesting type of farm operations. Here's a sample list of queries that you can test and use: 

* Show me active fields
* What crop was planted in my field (use field name) 
* Tell me the application details for my field (use field name)
* Give me a list of all fields with planting dates
* Give me a list of all fields with application dates
* What is the delta between planted and harvested fields
* Which farms were harvested
* What is the area of harvested fields
* Convert area to acres/hectares 
* What is the average yield for my field (use field name) with crop (use crop name)
* What is the effect of planting dates on yield for crop (use crop name) 

These use cases help input providers to plan equipment, seeds, applications and related services and engage better with the farmer.

## Next steps

* Fill this onboarding [**form**](https://forms.office.com/r/W4X381q2rd) to get started with testing our LLM feature.
* View our Azure Data Manager for Agriculture APIs [here](/rest/api/data-manager-for-agri).