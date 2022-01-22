---
title: How to submit custom classification tasks
titleSuffix: Azure Cognitive Services
description: Learn about sending a request for custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 01/07/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# Deploy a model and classify text using the runtime API

After you're satisfied with your model, and made any necessary improvements, you can deploy it and start classifying text. Deploying a model makes it available for use through the runtime API.

## Prerequisites

* [A custom classification project](create-project.md) with a configured Azure blob storage account, 
* Text data that has [been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md) and successfully [trained model](train-model.md)
* Reviewed the [model evaluation details](view-model-evaluation.md) to determine how your model is performing.
* (optional) [Made improvements](improve-model.md) to your model if its performance isn't satisfactory. 

See the [application development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Deploy your model

1. Go to your project in [Language Studio](https://aka.ms/custom-classification)

2. Select **Deploy model** from the left side menu.

3. Select the model you want to deploy, then select **Deploy model**. If you deploy your model through the Language Studio, your `deployment-name` is `prod`.

> [!TIP]
> You can test your model in Language Studio by sending samples of text for it to classify. 
> 1. Select **Test model** from the menu on the left side of your project in Language Studio.
> 2. Select the model you want to test.
> 3. Add your text to the textbox, you can also upload a `.txt` file. 
> 4. Click on **Run the test**.
> 5. In the **Result** tab, you can see the predicted classes for your text. You can also view the JSON response under the **JSON** tab.

## Send a text classification request to your model

# [Using Language Studio](#tab/language-studio)

### Using Language studio

1. After the deployment is completed, select the model you want to use and from the top menu click on **Get prediction URL** and copy the URL and body.

    :::image type="content" source="../media/get-prediction-url-1.png" alt-text="run-inference" lightbox="../media/get-prediction-url-1.png":::

2. In the window that appears, under the **Submit** pivot, copy the sample request into your command line

3. Replace `<YOUR_DOCUMENT_HERE>` with the actual text you want to classify.

    :::image type="content" source="../media/get-prediction-url-2.png" alt-text="run-inference-2" lightbox="../media/get-prediction-url-2.png":::

4. Submit the request

5. In the response header you receive extract `jobId` from `operation-location`, which has the format: `{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId}>`

6. Copy the retrieve request and replace `<OPERATION-ID>` with `jobId` received form last step and submit the request.

    :::image type="content" source="../media/get-prediction-url-3.png" alt-text="run-inference-3" lightbox="../media/get-prediction-url-3.png":::

[!INCLUDE [JSON result for classification](../includes/classification-result-json.md)]


# [Using the API](#tab/rest-api)

### Using the REST API

First you will need to get your resource key and endpoint

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../media/get-endpoint-azure.png":::

### Submit text classification task

1. Start constructing a POST request by updating the following URL with your endpoint.
    
    `{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze`

2. In the header for the request, add your key to the `Ocp-Apim-Subscription-Key` header.

3. In the JSON body of your request, you will specify The documents you're inputting for analysis, and the parameters for the custom entity recognition task. `project-name` is case-sensitive.
 
    > [!tip]
    > See the [quickstart article](../quickstart.md?pivots=rest-api#submit-text-classification-task) and [reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-2-Preview-2/operations/Analyze) for more information about the JSON syntax.
    
    ```json
    {
        "displayName": "MyJobName",
        "analysisInput": {
            "documents": [
                {
                    "id": "doc1", 
                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus, felis sed vehicula lobortis, lectus ligula facilisis quam, quis aliquet lectus diam id erat. Vivamus eu semper tellus. Integer placerat sem vel eros iaculis dictum. Sed vel congue urna."
                },
                {
                    "id": "doc2",
                    "text": "Mauris dui dui, ultricies vel ligula ultricies, elementum viverra odio. Donec tempor odio nunc, quis fermentum lorem egestas commodo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
                }
            ]
        },
        "tasks": {
            "customMultiClassificationTasks": [      
                {
                    "parameters": {
                          "project-name": "MyProject",
                          "deployment-name": "MyDeploymentName"
                          "stringIndexType": "TextElements_v8"
                    }
                }
            ]
        }
    }
    ```

4. You will receive a 202 response indicating success. In the response headers, extract `operation-location`.
`operation-location` is formatted like this:

    `{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId>`

    You will use this endpoint in the next step to get the custom recognition task results.

5. Use the URL from the previous step to create a **GET** request to query the status/results of the custom recognition task. Add your key to the `Ocp-Apim-Subscription-Key` header for the request.

[!INCLUDE [JSON result for classification](../includes/classification-result-json.md)]

# [Using the client libraries (Azure SDK)](#tab/client)

## Use the client libraries

1. Go to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../../custom-classification/media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../../custom-classification/media/get-endpoint-azure.png":::

3. Download and install the client library package for your language of choice:
    
    |Language  |Package version  |
    |---------|---------|
    |.NET     | [5.2.0-beta.2](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0-beta.2)        |
    |Java     | [5.2.0-beta.2](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0-beta.2)        |
    |JavaScript     |  [5.2.0-beta.2](https://www.npmjs.com/package/@azure/ai-text-analytics/v/5.2.0-beta.2)       |
    |Python     | [5.2.0b2](https://pypi.org/project/azure-ai-textanalytics/5.2.0b2/)         |
    
4. After you've installed the client library, use the following samples on GitHub to start calling the API.
    
    Single label classification:
    * [C#](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample10_SingleCategoryClassify.md)
    * [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/ClassifyDocumentSingleCategory.java)
    * [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js)
    * [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_single_category_classify.py)
    
    Multiple label classification:
    * [C#](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample11_MultiCategoryClassify.md)
    * [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/ClassifyDocumentMultiCategory.java)
    * [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js)
    * [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_multi_category_classify.py)

5. See the following reference documentation for more information on the client, and return object:
    
    * [C#](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)
    * [Java](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)
    * [JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)
    * [Python](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?view=azure-python-preview&preserve-view=true)
---

