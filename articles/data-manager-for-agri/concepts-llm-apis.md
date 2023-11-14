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

# About Azure Data Manager for Agriculture LLM APIs:

Azure Data Manager for Agriculture provides industry-specific data connectors and capabilities to unify farm data from disparate sources, enabling organizations to leverage high quality datasets and accelerate the development of digital agriculture solutions. With new large language model (LLM) APIs, others can develop copilots that turn data into insights on yield, labor needs, harvest windows and more—bringing generative AI to life in agriculture.

Our LLM capability enables seamless selection of APIs mapped to farm operations today. In the time to come we will add the capability to select APIs mapped to soil sensors, weather, and imagery type of data. The skills in our LLM capability allow for a combination of results, calculation of area, ranking, summarizing to help serve customer prompts. Our B2B customers can take the context from our data manager, add their own knowledge base, and get summaries, insights and answers to their data questions through our data manager LLM plugin using natural language.

> [!NOTE]
>Azure may include preview, beta, or other pre-release features, services, software, or regions offered by Microsoft for optional evaluation ("Previews"). Previews are licensed to you as part of [**your agreement**](https://azure.microsoft.com/support) governing use of Azure, and subject to terms applicable to "Previews".
>
>The Azure Data Manager for Agriculture (Preview) and related Microsoft Generative AI Services Previews of Azure Data Manager for Agriculture are subject to additional terms set forth at [**Preview Terms Of Use | Microsoft Azure**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)
>
>These Previews are made available to you pursuant to these additional terms, which supplement your agreement governing your use of Azure. If you do not agree to these terms, do not use the Preview(s).

## Prerequisites:
- An instance of [Azure Data Manager for Agriculture](quickstart-install-data-manager-for-agriculture.md)
- An instance of [Azure Open AI](../ai-services/openai/how-to/create-resource.md) created in your Azure subscription.
- You will need [Azure Key Vault](../key-vault/general/quick-create-portal.md)
- You will need [Azure Container Registery](../container-registry/container-registry-get-started-portal.md)

> [!TIP]
>To get started with testing our Azure Data Manager for Agriculture LLM Plugin APIs please fill in this onboarding [**form**](https://forms.office.com/r/W4X381q2rd). In case you need help then reach out to us at madma@microsoft.com.

## High level architecture: 
The customer has full control as key component deployment is within the customer tenant.  Our feature is available to customers via a docker container, which they will deploy to their Azure App Service. 

:::image type="content" source="./media/concepts-llm-apis/high-level-architecture.png" alt-text="Screenshot showing high level feature architecture":::

We highly recommend that customers apply content and safety filters on your Azure OpenAI instance to ensure that the LLM capability is aligned with guidelines from Microsoft’s Office of Responsible AI. Please follow instructions on how to use content filters with Azure OpenAI service at this [link](../ai-services/openai/how-to/content-filters.md) to get started.

## Flow diagram:
:::image type="content" source="./media/concepts-llm-apis/flow-diagram.png" alt-text="Screenshot showing high level information flow":::

The LLM capability uses a specialized orchestrator SDK – C# library, that wraps LLM capabilities of taking a user message in a natural language, enriching it with a relevant metadata on the user. Then apply a set of plugins to create natural language responses to the user, that answers his question within a chat experience. 

The SDK is built on top of Semantic Kernel, it supports GPT 4 and uses Azure open AI function calling capability. There are 3 steps in which the developer interacts with the orchestrator: 
1.	System initialization – when the system starts, once for all chat instances. 
2.	Chat initialization – when user starts a new chat, initializes an empty chat history. 
3.	Chat loop – the chat conversation between the user and the system, triggered by user message. 

The orchestrator adds the messages and their responses to the history and returns the updated history to the caller. 

## API design
Chat Initiate
```azurecli
curl -X 'POST' \
  'https://admacopilot.azurewebsites.net/Test/chatSession/create' \
  -H 'accept: text/plain' \
  -H 'Content-Type: application/json' \
  -d '{
  "partyId": "your-demo"
}'

{"chatSession": {"title": "AgCopilot @ 9/19/2023, 2:19:46 PM", "partyId": "your-demo", "id": "<chatId>", "createdOn": "10/4/2023 3:18:29 PM"}}
```
Chat
```azurecli
curl -X 'POST' \
  'https://admacopilot.azurewebsites.net/Test/chat' \
  -H 'accept: text/plain' \
  -H 'Content-Type: application/json' \
  -d '{
  "input": "I would like to see fields that have been planted for partyId your-demo",
  "variables": [
    {
      "key": "chat",
      "value": "true"
    },
    {
      "key": "chatId",
      "value": "<chatId>"
    }
  ]
}'
```
## Next steps

* Fill this onboarding [**form**](https://forms.office.com/r/W4X381q2rd) to get started with testing our LLM feature.
* View our Azure Data Manager for Agriculture APIs [here](/rest/api/data-manager-for-agri).