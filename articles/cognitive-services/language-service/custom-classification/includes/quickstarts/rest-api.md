---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 01/25/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Create a new Azure resource and Azure Blob Storage account

Before you can use custom text classification, you will need to create a Language resource, which will give you the subscription and credentials you will need to create a project and start training a model. You will also need an Azure blob storage account, which is the required online data storage to hold text for analysis. 

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure Language resource using the steps provided below, which will let you create the resource, and configure a storage account at the same time, which is easier than doing it later. 
>
> If you have a pre-existing resource you'd like to use, you will need to configure it and a storage account separately. See the [**Project requirements**](../../how-to/create-project.md#using-a-pre-existing-azure-resource)  for information.

1. Go to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. If you're asked to select additional features, select **Skip this step**. When you create your resource, ensure it has the following parameters.  

    |Azure resource requirement  |Required value  |
    |---------|---------|
    |Location | "West US 2" or "West Europe"         |
    |Pricing tier     | Standard (**S**) pricing tier        |

2. In the **Custom named entity recognition (NER) & custom text classification (Preview)** section, select **Create a new storage account**. These values are for this quickstart, and not necessarily the [storage account values](../../../../../storage/common/storage-account-overview.md) you will want to use in production environments.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Performance | Standard | 
    | Account kind| Storage (general purpose v1) |
    | Replication | Locally redundant storage (LRS)
    |Location | Any location closest to you, for best latency.        |


## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom text classification](blob-storage-upload.md)]

### Get your resource keys and endpoint

* Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home)

* From the menu on the left side, select **Keys and Endpoint**. You will use the endpoint and key for the API requests 

:::image type="content" source="../../media/get-endpoint-azure.png" alt-text="A screenshot showing the key and endpoint page in the Azure portal" lightbox="../../media/get-endpoint-azure.png":::

## Create project

[!INCLUDE [Create a project using the REST API](../rest-api/create-project.md)]

## Start training your model

[!INCLUDE [train a model using the REST API](../rest-api/train-model.md)]

## Deploy your model

[!INCLUDE [deploy a model using the REST API](../rest-api/deploy-model.md)]

### Submit a custom text classification task

[!INCLUDE [submit a text classification task using the REST API](../rest-api/text-classification-task.md)]

### Get the custom text classification task status and results

[!INCLUDE [Get text classification status and results](../rest-api/get-results.md)]

## Clean up resources

When you no longer need your project, you can delete it with the following **DELETE** request. Replace the placeholder values with your own values.   

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{PROJECT-NAME}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.  | `myProject` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|Ocp-Apim-Subscription-Key| The key to your resource. Used for authenticating your API requests.|
