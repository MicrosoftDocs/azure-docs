---
title: Using generative AI in Data Manager for Agriculture
description: Provides information on using generative AI feature in Azure Data Manager for Agriculture 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 3/19/2024
ms.custom: template-concept
---

# About Generative AI and Data Manager for Agriculture

The copilot templates for agriculture enable seamless retrieval of data stored in Data Manager for Agriculture so that farming-related context and insights can be queried in conversational context. These capabilities enable customers and partners to build their own agriculture copilots. Customers and partners can deliver insights to users around disease, yield, harvest windows and more, using actual planning, and observational data. While Data Manager for Agriculture isn't required to operationalize copilot templates for agriculture, the Data Manager enables customers to more easily integrate generative AI scenarios for their users. 

Many customers have proprietary data outside of our data manager, for example Agronomy PDFs, market price data etc. These customers can benefit from our orchestration framework that allows for plugins, embedded data structures, and sub processes to be selected as part of the query flow. 

Customers with farm operations data in our data manager can use our plugins that enable seamless selection of APIs mapped to farm operations today. In the time to come we'll add the capability to select APIs mapped to soil sensors, weather, and imagery type of data. Our data manager focused plugin allows for a combination of results, calculation of area, ranking, summarizing to help serve customer prompts.

Our copilot templates for agriculture make generative AI in agriculture a reality.

> [!NOTE]
>Azure might include preview, beta, or other pre-release features, services, software, or regions offered by Microsoft for optional evaluation ("Previews"). Previews are licensed to you as part of [**your agreement**](https://azure.microsoft.com/support) governing use of Azure, and subject to terms applicable to "Previews".
>
>The Azure Data Manager for Agriculture (Preview) and related Microsoft Generative AI Services Previews of Azure Data Manager for Agriculture are subject to additional terms set forth at [**Preview Terms Of Use | Microsoft Azure**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)
>
>These Previews are made available to you pursuant to these additional terms, which supplement your agreement governing your use of Azure. If you do not agree to these terms, do not use the Preview(s).

## Prerequisites
- An instance of [Azure Data Manager for Agriculture](quickstart-install-data-manager-for-agriculture.md)
- An instance of [Azure OpenAI](../ai-services/openai/how-to/create-resource.md) created in your Azure subscription
- You need [Azure Key Vault](../key-vault/general/quick-create-portal.md)
- You need [Azure Container Registry](../container-registry/container-registry-get-started-portal.md)

> [!TIP]
>To get started with testing our Azure Data Manager for Agriculture LLM Plugin APIs please fill in this onboarding [**form**](https://forms.office.com/r/W4X381q2rd). In case you need help then reach out to us at madma@microsoft.com.

## High level architecture 
The customer has full control as key component deployment is within the customer tenant. Our feature is available to customers via a docker container, which needs to be deployed to the customers Azure App Service. 

:::image type="content" source="./media/concepts-llm-apis/high-level-architecture.png" alt-text="Screenshot showing high level feature architecture.":::

We recommend that you apply content and safety filters on your Azure OpenAI instance. Taking this step ensures that the generative AI capability is aligned with guidelines from Microsoft’s Office of Responsible AI. Follow instructions on how to use content filters with Azure OpenAI service at this [link](../ai-services/openai/how-to/content-filters.md) to get started.

## Current farm operations related uses cases

We support seamless selection of APIs mapped to farm operations today. This enables use cases that are based on tillage, planting, applications, and harvesting type of farm operations. Here's a sample list of queries that you can test and use: 

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

These use cases help input providers to plan equipment, seeds, applications, and related services and engage better with the farmer.

## Next steps

* Fill this onboarding [**form**](https://forms.office.com/r/W4X381q2rd) to get started with testing our copilot templates feature.
* View our Azure Data Manager for Agriculture APIs [here](/rest/api/data-manager-for-agri).
