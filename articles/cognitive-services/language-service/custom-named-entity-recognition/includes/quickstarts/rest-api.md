---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 01/24/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

## Create a new Azure resource and Azure Blob Storage account

Before you can use custom NER, you’ll need to create an Azure Language resource, which will give you the credentials that you need to create a project and start training a model. You’ll also need an Azure storage account, where you can upload your dataset that will be used to building your model.

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure Language resource using the steps provided in this article, which will let you create the resource, and configure a storage account at the same time, which is easier than doing it later.
>
> If you have a pre-existing resource you'd like to use, you will need to configure it and a storage account separately. See [project creation article](../../how-to/create-project.md#using-a-pre-existing-azure-resource)  for information.

1. Go to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. If you're asked to select additional features, select **Custom text classification & custom NER**. When you create your resource, ensure it has the following parameters.

    |Azure resource requirement  |Required value  |
    |---------|---------|
    |Location | "West US 2" or "West Europe"         |
    |Pricing tier     | Standard (**S**) pricing tier        |

2. In the **Custom Named Entity Recognition (NER) & Custom Classification (Preview)** section, select an existing storage account or select **Create a new storage account**. Note that these values are for this quickstart, and not necessarily the [storage account values](../../../../../storage/common/storage-account-overview.md) you’ll want to use in production environments.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Performance | Standard |
    | Account kind| Storage (general purpose v1) |
    | Replication | Locally redundant storage (LRS)
    |Location | Any location closest to you, for best latency.        |


## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom NER](blob-storage-upload.md)]

### Get your resource keys endpoint

* Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home)

* From the menu of the left side of the screen, select **Keys and Endpoint**. Use endpoint for the API requests and you’ll need the key for `Ocp-Apim-Subscription-Key` header.
:::image type="content" source="../../../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint screen for an Azure resource." lightbox="../../../media/azure-portal-resource-credentials.png":::

## Create a custom NER project

Once your resource and storage container are configured, create a new custom NER project. A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have access to the Azure resource being used.

[!INCLUDE [Create a project using the REST API](../rest-api/create-project.md)]

## Start training your model

After your project has been created, you can begin training a custom NER model. Create a **POST** request using the following URL, headers, and JSON body to start training an NER model.
ate a **POST** request using the following URL, headers, and JSON body to start training a text classification model.

[!INCLUDE [Train a model using the REST API](../rest-api/train-model.md)]

## Deploy your model

Create a **PUT** request using the following URL, headers, and JSON body to start deploying a custom NER model.

[!INCLUDE [Deploy a model using the REST API](../rest-api/deploy-model.md)]

### Submit custom NER task

Now that your model is deployed, you can begin sending entity recognition tasks to it. 

[!INCLUDE [Submit a task using the REST API](../rest-api/submit-task.md)]

### Get task status and results

Use the following **GET** request to query the status/results of the custom recognition task. You can use the endpoint you received from the previous step.

[!INCLUDE [Get task status and results using the REST API](../rest-api/get-task-results.md)]
