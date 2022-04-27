---
title: How to send a API requests to an orchestration workflow project
titleSuffix: Azure Cognitive Services
description: Learn about sending a request to orchestration workflow projects.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/03/2022
ms.author: aahi
ms.devlang: csharp, python
ms.custom: language-service-orchestration
---

# Deploy and test model

After you have [trained a model](./train-model.md) on your dataset, you're ready to deploy it. After deploying your model, you'll be able to query it for predictions. 

> [!Tip]
> Before deploying a model, make sure to view the model details to make sure that the model is performing as expected.
> You can only have ten deployment names.

## Orchestration workflow model deployments

Deploying a model hosts and makes it available for predictions through an endpoint.

When a model is deployed, you will be able to test the model directly in the portal or by calling the API associated to it.

1. From the left side, click on **Deploy model**.

2.	Click on **Add deployment** to submit a new deployment job.

    In the window that appears, you can create a new deployment name by giving the deployment a name or override an existing deployment name. Then, you can add a trained model to this deployment name and press next.

3. If you're connecting one or more LUIS applications or conversational language understanding projects, you have to specify the deployment name.

    No configurations are required for custom question answering or unlinked intents.

    LUIS projects **must be published** to the slot configured during the Orchestration deployment, and custom question answering KBs must also be published to their Production slots.

1.	Click on **Add deployment** to submit a new deployment job.

    Like conversation projects, In the window that appears, you can create a new deployment name by giving the deployment a name or override an existing deployment name. Then, you can add a trained model to this deployment name and press next.

    <!--:::image type="content" source="../media/create-deployment-job-orch.png" alt-text="A screenshot showing deployment job creation in Language Studio." lightbox="../media/create-deployment-job-orch.png":::-->

2. If you're connecting one or more LUIS applications or conversational language understanding projects, specify the deployment name.

    No configurations are required for custom question answering or unlinked intents.

    LUIS projects **must be published** to the slot configured during the Orchestration deployment, and custom question answering KBs must also be published to their Production slots.

    :::image type="content" source="../media/deploy-connected-services.png" alt-text="A screenshot showing the deployment screen for orchestration workflow projects." lightbox="../media/deploy-connected-services.png":::

## Send a request to your model

Once your model is deployed, you can begin using the deployed model for predictions. Outside of the test model page, you can begin calling your deployed model via API requests to your provided custom endpoint. This endpoint request obtains the intent and entity predictions defined within the model.

You can get the full URL for your endpoint by going to the **Deploy model** page, selecting your deployed model, and clicking on "Get prediction URL".

:::image type="content" source="../media/prediction-url.png" alt-text="Screenshot showing the prediction request and URL" lightbox="../media/prediction-url.png":::

Add your key to the `Ocp-Apim-Subscription-Key` header value, and replace the query and language parameters.
 
> [!TIP]
> As you construct your requests, see the [quickstart](../quickstart.md?pivots=rest-api#query-model) and REST API [reference documentation](https://aka.ms/clu-apis) for more information.

### Use the client libraries (Azure SDK)

You can also use the client libraries provided by the Azure SDK to send requests to your model. 

> [!NOTE]
> The client library for Orchestration workflow is only available for:
> * .NET
> * Python

1. Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home)

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
    
## API response for an orchestration workflow project

Orchestration workflow projects return with the response of the top scoring intent, and the response of the service it is connected to.
- Within the intent, the *targetKind* parameter lets you determine the type of response that was returned by the orchestrator's top intent (conversation, LUIS, or QnA Maker).
- You will get the response of the connected service in the *result* parameter. 

Within the request, you can specify additional parameters for each connected service, in the event that the orchestrator routes to that service.
- Within the project parameters, you can optionally specify a different query to the connected service. If you don't specify a different query, the original query will be used.
- The *direct target* parameter allows you to bypass the orchestrator's routing decision and directly target a specific connected intent to force a response for it.

## Next steps

* [Orchestration project overview](../overview.md)
