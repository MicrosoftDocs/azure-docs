---
title: How to send a Conversational Language Understanding job
titleSuffix: Azure Cognitive Services
description: Learn about sending a request for Conversational Language Understanding.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 01/26/2022
ms.author: aahi
ms.devlang: csharp, python
ms.custom: language-service-clu, ignite-fall-2021
---

# Deploy and test model

After you have [trained a model](./train-model.md) on your dataset, you're ready to deploy it. After deploying your model, you'll be able to query it for predictions. 

## Deploy model

Deploying a model is to host it and make it available for predictions through an endpoint. You can only have 1 deployed model per project, deploying another one will overwrite the previously deployed model.

When a model is deployed, you will be able to test the model directly in the portal or by calling the API associated to it.

Simply select a model and click on deploy model in the Deploy model page. 

:::image type="content" source="../media/deploy-model.png" alt-text="A screenshot showing the model deployment page in Language Studio." lightbox="../media/deploy-model.png":::

> [!TIP]
> If you're using the REST API, see the [quickstart](../quickstart.md?pivots=rest-api#deploy-your-model) and REST API [reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/language-authoring-clu-apis-2021-11-01-preview/operations/Deployments_TriggerDeploymentJob) for examples and more information.

**Orchestration workflow projects deployments**

When you're deploying an orchestration workflow project, A small window will show up for you to confirm your deployment, and configure parameters for connected services.

If you're connecting one or more LUIS applications, specify the deployment name, and whether you're using *slot* or *version* type deployment.       
* The *slot* deployment type requires you to pick between a production and staging slot.
* The *version* deployment type requires you to specify the version you have published.

No configurations are required for custom question answering and conversational language understanding connections, or unlinked intents.

LUIS projects **must be published** to the slot configured during the Orchestration deployment, and custom question answering KBs must also be published to their Production slots.

:::image type="content" source="../media/deploy-connected-services.png" alt-text="A screenshot showing the deployment screen for orchestration workflow projects." lightbox="../media/deploy-connected-services.png":::

## Send a Conversational Language Understanding request

Once your model is deployed, you can begin using the deployed model for predictions. Outside of the test model page, you can begin calling your deployed model via API requests to your provided custom endpoint. This endpoint request obtains the intent and entity predictions defined within the model.

You can get the full URL for your endpoint by going to the **Deploy model** page, selecting your deployed model, and clicking on "Get prediction URL".

:::image type="content" source="../media/prediction-url.png" alt-text="Screenshot showing the prediction request and URL" lightbox="../media/prediction-url.png":::

Add your key to the `Ocp-Apim-Subscription-Key` header value, and replace the query and language parameters.
 
> [!TIP]
> As you construct your requests, see the [quickstart](../quickstart.md?pivots=rest-api#query-model) and REST API [reference documentation](https://aka.ms/clu-apis) for more information.

### Use the client libraries (Azure SDK)

You can also use the client libraries provided by the Azure SDK to send requests to your model. 

> [!NOTE]
> The client library for conversational language understanding is only available for:
> * .NET
> * Python

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../../custom-classification/media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../../custom-classification/media/get-endpoint-azure.png":::

3. Download and install the client library package for your language of choice:
    
    |Language  |Package version  |
    |---------|---------|
    |.NET     | [5.2.0-beta.2](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0-beta.2)        |
    |Python     | [5.2.0b2](https://pypi.org/project/azure-ai-textanalytics/5.2.0b2/)         |
    
4. After you've installed the client library, use the following samples on GitHub to start calling the API.
    
    * [C#](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/cognitivelanguage/Azure.AI.Language.Conversations/samples)
    * [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-conversations/samples)
    
5. See the following reference documentation for more information:
    
    * [C#](/dotnet/api/azure.ai.language.conversations?view=azure-dotnet-preview&preserve-view=true)
    * [Python](/python/api/azure-ai-language-conversations/azure.ai.language.conversations?view=azure-python-preview&preserve-view=true)
    
## API response for a conversations project

In a conversations project, you'll get predictions for both your intents and entities that are present within your project. 
- The intents and entities include a confidence score between 0.0 to 1.0 associated with how confident the model is about predicting a certain element in your project. 
- The top scoring intent is contained within its own parameter.
- Only predicted entities will show up in your response.
- Entities indicate:
    - The text of the entity that was extracted
    - Its start location denoted by an offset value
    - The length of the entity text denoted by a length value.

## API response for an orchestration Workflow Project

Orchestration workflow projects return with the response of the top scoring intent, and the response of the service it is connected to.
- Within the intent, the *targetKind* parameter lets you determine the type of response that was returned by the orchestrator's top intent (conversation, LUIS, or QnA Maker).
- You will get the response of the connected service in the *result* parameter. 

Within the request, you can specify additional parameters for each connected service, in the event that the orchestrator routes to that service.
- Within the project parameters, you can optionally specify a different query to the connected service. If you don't specify a different query, the original query will be used.
- The *direct target* parameter allows you to bypass the orchestrator's routing decision and directly target a specific connected intent to force a response for it.

## Next steps

* [Conversational Language Understanding overview](../overview.md)
