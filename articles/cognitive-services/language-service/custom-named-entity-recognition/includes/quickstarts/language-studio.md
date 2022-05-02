---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 02/04/2022
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
> If you have a pre-existing resource you'd like to use, you will need to configure it and a storage account separately. See [create project](../../how-to/create-project.md#using-a-pre-existing-azure-resource)  for information.

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

## Create a custom named entity recognition project

Once your resource and storage container are configured, create a new custom NER project. A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have access to the Azure resource being used.

[!INCLUDE [Create custom NER project](../create-project.md)]

Under **Are your files already tagged with entities**, select **Yes** and choose the available file. Then click **Next**. Review the data you entered and select **Create Project**.

## Train your model

[!INCLUDE [Train a model using Language Studio](../train-model-language-studio.md)]

## Deploy your model

Generally after training a model you would review it's [evaluation details](../../how-to/view-model-evaluation.md) and [make improvements](../../how-to/improve-model.md) if necessary. In this quickstart, you’ll just deploy your model, and make it available for you to try.

After your model is trained, you can deploy it. Deploying your model lets you start using it to extract named entities, using [Analyze API](https://aka.ms/ct-runtime-swagger).

[!INCLUDE [Deploy a model using Language Studio](../deploy-model-language-studio.md)]


## Test your model

After your model is deployed, you can start using it for entity extraction. Use the following steps to send your first entity extraction request.

1. Select **Test model** from the left side menu.

2. Select the model you want to test.

3. Using one of the files you downloaded earlier, add the file's text to the textbox. You can also upload a `.txt` file. 

4. Click on **Run the test**.

5. In the **Result** tab, you can see the extracted entities from your text and their types. You can also view the JSON response under the **JSON** tab.

    :::image type="content" source="../../media/test-model-results.png" alt-text="View the test results" lightbox="../../media/test-model-results.png":::


## Clean up resources

When you don't need your project anymore, you can delete your project using [Language Studio](https://aka.ms/custom-extraction). Select **Custom Named Entity Recognition (NER)** in the left navigation menu, select project you want to delete and click on **Delete**.
