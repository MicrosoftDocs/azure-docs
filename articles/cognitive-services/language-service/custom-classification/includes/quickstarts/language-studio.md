---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 02/28/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Create a new Azure resource and Azure Blob Storage account

Before you can use custom text classification, you will need to create an Azure Language resource, which will give you the credentials needed to create a project and start training a model. You will also need an Azure storage account, where you can upload your dataset that will be used to building your model.

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure Language resource using the steps provided below, which will let you create the resource, and configure a storage account at the same time, which is easier than doing it later.
>
> If you have a pre-existing resource you'd like to use, you will need to configure it and a storage account separately. See the [**project requirements**](../../how-to/create-project.md#using-a-pre-existing-azure-resource)  for information.

1. Go to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. If you're asked to select additional features, select **Custom text classification & custom NER**. When you create your resource, ensure it has the following parameters.

    |Azure resource requirement  |Required value  |
    |---------|---------|
    |Location | "West US 2" or "West Europe"         |
    |Pricing tier     | Standard (**S**) pricing tier        |

2. In the **Custom named entity recognition (NER) & custom text classification (Preview)** section, select an existing storage account or select **Create a new storage account**. Note that these values are for this quickstart, and not necessarily the [storage account values](../../../../../storage/common/storage-account-overview.md) you will want to use in production environments.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Performance | Standard |
    | Account kind| Storage (general purpose v1) |
    | Replication | Locally redundant storage (LRS)
    |Location | Any location closest to you, for best latency.        |


## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom tex classification](blob-storage-upload.md)]

## Create a custom text classification project

[!INCLUDE [Create a project using Language Studio](../create-project.md)]

## Train your model

[!INCLUDE [Train a model using Language Studio](../train-model-language-studio.md)]

## Deploy your model

Generally after training a model you would review it's [evaluation details](../../how-to/view-model-evaluation.md) and [make improvements](../../how-to/improve-model.md) if necessary. In this quickstart, you will just deploy your model, and make it available for you to try.

After your model is trained, you can deploy it. Deploying your model lets you start using it to classify text, using [Analyze API](https://aka.ms/ct-runtime-swagger).

[!INCLUDE [Deploy a model using Language Studio](../deploy-model-language-studio.md)]

## Test your model

After your model is deployed, you can start using it for custom text classification. Use the following steps to send your first custom text classification request. 

[!INCLUDE [Test a model using Language Studio](../test-model-language-studio.md)]

## Clean up projects

When you don't need your project anymore, you can delete it from your [projects page in Language Studio](https://aka.ms/custom-classification
). Select the project you want to delete and click on **Delete**.
