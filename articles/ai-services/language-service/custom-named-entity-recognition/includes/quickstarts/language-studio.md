---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 01/25/2023
ms.author: aahi
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)



## Create a new Azure AI Language resource and Azure storage account

Before you can use custom NER, you'll need to create an Azure AI Language resource, which will give you the credentials that you need to create a project and start training a model. You'll also need an Azure storage account, where you can upload your dataset that will be used to build your model.

> [!IMPORTANT]
> To quickly get started, we recommend creating a new Azure AI Language resource using the steps provided in this article. Using the steps in this article will let you create the Language resource and storage account at the same time, which is easier than doing it later.
>
> If you have a pre-existing resource that you'd like to use, you will need to connect it to storage account. See [guidance to using a pre-existing resource](../../how-to/create-project.md#using-a-pre-existing-language-resource) for information.

[!INCLUDE [create a new resource from the Azure portal](../resource-creation-azure-portal.md)]



## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom NER](blob-storage-upload.md)]



## Create a custom named entity recognition project

Once your resource and storage account are configured, create a new custom NER project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

[!INCLUDE [Create custom NER project](../language-studio/create-project.md)]



## Train your model

Typically after you create a project, you go ahead and start [tagging the documents](../../how-to/tag-data.md) you have in the container connected to your project. For this quickstart, you have imported a sample tagged dataset and initialized your project with the sample JSON tags file.

[!INCLUDE [Train a model using Language Studio](../language-studio/train-model.md)]



## Deploy your model

Generally after training a model you would review its [evaluation details](../../how-to/view-model-evaluation.md) and [make improvements](../../how-to/view-model-evaluation.md) if necessary. In this quickstart, you will just deploy your model, and make it available for you to try in Language studio, or you can call the [prediction API](https://aka.ms/ct-runtime-swagger).

[!INCLUDE [Deploy a model using Language Studio](../language-studio/deploy-model.md)]




## Test your model

After your model is deployed, you can start using it to extract entities from your text via [Prediction API](https://aka.ms/ct-runtime-swagger). For this quickstart, you will use the [Language Studio](https://aka.ms/LanguageStudio) to submit the custom entity recognition task and visualize the results. In the sample dataset you downloaded earlier, you can find some test documents that you can use in this step.

[!INCLUDE [Test a model using Language Studio](../../../includes/custom/language-studio/test-model.md)]

:::image type="content" source="../../media/test-model-results.png" alt-text="A screenshot showing the model test results." lightbox="../../media/test-model-results.png":::

## Clean up resources

[!INCLUDE [Delete project using Language Studio](../language-studio/delete-project.md)]


