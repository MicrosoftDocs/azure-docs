---
title: How to send a Conversational Language Understanding job
titleSuffix: Azure Cognitive Services
description: Learn about sending a request for Conversational Language Understanding.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/15/2022
ms.author: aahi
ms.devlang: csharp, python
ms.custom: language-service-clu, ignite-fall-2021, event-tier1-build-2022
---

# Deploy and test a conversational language understanding model

After you have [trained a model](./train-model.md) on your dataset, you're ready to deploy it. After deploying your model, you'll be able to query it for predictions. 

> [!Tip]
> Before deploying a model, make sure to view the model details to make sure that the model is performing as expected.

## Deploy model

Deploying a model hosts and makes it available for predictions through an endpoint.

When a model is deployed, you will be able to test the model directly in the portal or by calling the API associated to it.

### Conversation projects deployments

1.	Click on *Add deployment* to submit a new deployment job

    :::image type="content" source="../media/add-deployment-model.png" alt-text="A screenshot showing the model deployment button in Language Studio." lightbox="../media/add-deployment-model.png":::

2. In the window that appears, you can create a new deployment name by giving the deployment a name or override an existing deployment name. Then, you can add a trained model to this deployment name.

    :::image type="content" source="../media/create-deployment-job.png" alt-text="A screenshot showing the add deployment job screen in Language Studio." lightbox="../media/create-deployment-job.png":::


#### Swap deployments

If you would like to swap the models between two deployments, simply select the two deployment names you want to swap and click on **Swap deployments**. From the window that appears, select the deployment name you want to swap with.

:::image type="content" source="../media/swap-deployment.png" alt-text="A screenshot showing a swapped deployment in Language Studio." lightbox="../media/swap-deployment.png":::

#### Delete deployment

To delete a deployment, select the deployment you want to delete and click on **Delete deployment**.

> [!TIP]
> If you're using the REST API, see the [quickstart](../quickstart.md?pivots=rest-api#deploy-your-model) and REST API [reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/language-authoring-clu-apis-2022-03-01-preview/operations/Projects_TriggerImportProjectJob) for examples and more information.

> [!NOTE]
> You can only have ten deployment names.

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

1. Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../../custom-text-classification/media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../../custom-text-classification/media/get-endpoint-azure.png":::

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

## Next steps

* [Conversational Language Understanding overview](../overview.md)
